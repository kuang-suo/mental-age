import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import config from '../config/env.js';

const prisma = new PrismaClient();

function generateRandomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function login(username, password) {
  const admin = await prisma.admin.findUnique({
    where: { username }
  });

  if (!admin) {
    throw new Error('用户名或密码错误');
  }

  const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
  if (!isPasswordValid) {
    throw new Error('用户名或密码错误');
  }

  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    config.jwt.secret,
    { expiresIn: '24h' }
  );

  return { token };
}

export async function generateCodes(count, groupId) {
  if (count < 1 || count > 100) {
    throw new Error('生成数量必须在1-100之间');
  }

  const codes = [];
  const existingCodes = new Set();

  const existing = await prisma.exchangeCode.findMany({
    select: { code: true }
  });
  existing.forEach(item => existingCodes.add(item.code));

  while (codes.length < count) {
    const code = generateRandomCode();
    if (!existingCodes.has(code)) {
      codes.push(code);
      existingCodes.add(code);
    }
  }

  const created = await prisma.exchangeCode.createMany({
    data: codes.map(code => ({
      code,
      groupId: groupId || null
    }))
  });

  return {
    count: created.count,
    codes
  };
}

export async function getCodes(page = 1, limit = 50, filters = {}) {
  const skip = (page - 1) * limit;
  const conditions = [];

  if (filters.codeType) {
    conditions.push({ codeType: filters.codeType });
  }

  if (filters.status === 'used') {
    conditions.push({ used: true, codeType: 'SINGLE_USE' });
  } else if (filters.status === 'unused') {
    conditions.push({ used: false, codeType: 'SINGLE_USE' });
  } else if (filters.status === 'active') {
    conditions.push({
      codeType: 'MONTHLY_CARD',
      OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }]
    });
  } else if (filters.status === 'expired') {
    conditions.push({ codeType: 'MONTHLY_CARD', expiresAt: { lt: new Date() } });
  }

  if (filters.groupId) {
    if (filters.groupId === 'none') {
      conditions.push({ groupId: null });
    } else {
      conditions.push({ groupId: parseInt(filters.groupId) });
    }
  }

  if (filters.search) {
    conditions.push({ code: { contains: filters.search, mode: 'insensitive' } });
  }

  const where = conditions.length > 0 ? { AND: conditions } : {};

  const [codes, total] = await Promise.all([
    prisma.exchangeCode.findMany({
      where,
      skip,
      take: limit,
      include: {
        group: {
          select: { id: true, name: true, allowedTestTypes: true }
        },
        testResults: {
          select: {
            id: true,
            testType: true,
            resultData: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.exchangeCode.count({ where })
  ]);

  return {
    codes,
    total,
    page,
    pages: Math.ceil(total / limit)
  };
}

export async function exportCodes() {
  const codes = await prisma.exchangeCode.findMany({
    include: {
      group: {
        select: { name: true, allowedTestTypes: true }
      },
      testResults: {
        select: {
          testType: true,
          resultData: true,
          createdAt: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const headers = ['兑换码', '类型', '状态', '分组', '测试范围', '使用时间', '使用次数', '关联测试', '创建时间'];
  const rows = codes.map(code => {
    const testInfo = code.testResults.length > 0
      ? code.testResults.map(r => r.testType).join('; ')
      : '-';
    const groupName = code.group?.name || '未分组';
    const scopeInfo = code.group?.allowedTestTypes && Array.isArray(code.group.allowedTestTypes) && code.group.allowedTestTypes.length > 0
      ? code.group.allowedTestTypes.join('; ')
      : '全部';
    return [
      code.code,
      code.codeType === 'MONTHLY_CARD' ? '月卡' : '单次',
      code.codeType === 'MONTHLY_CARD'
        ? (code.expiresAt && new Date() > code.expiresAt ? '已过期' : '有效')
        : (code.used ? '已使用' : '未使用'),
      groupName,
      scopeInfo,
      code.usedAt ? new Date(code.usedAt).toLocaleString('zh-CN') : '-',
      String(code.usedCount),
      testInfo,
      new Date(code.createdAt).toLocaleString('zh-CN')
    ];
  });

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csv;
}

export async function getStats() {
  const todayStart = new Date(new Date().setHours(0, 0, 0, 0));

  const [
    totalTestResults,
    todayTestResults,
    totalImageAnalysisResults,
    todayImageAnalysisResults,
    byTestType,
    byImageAnalysisType,
    totalCodes,
    usedCodes,
    monthlyCards,
    activeMonthlyCards
  ] = await Promise.all([
    prisma.testResult.count(),
    prisma.testResult.count({
      where: { createdAt: { gte: todayStart } }
    }),
    prisma.imageAnalysisResult.count(),
    prisma.imageAnalysisResult.count({
      where: { createdAt: { gte: todayStart } }
    }),
    prisma.testResult.groupBy({
      by: ['testType'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } }
    }),
    prisma.imageAnalysisResult.groupBy({
      by: ['analysisType'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } }
    }),
    prisma.exchangeCode.count(),
    prisma.exchangeCode.count({ where: { used: true } }),
    prisma.exchangeCode.count({ where: { codeType: 'MONTHLY_CARD' } }),
    prisma.exchangeCode.count({
      where: {
        codeType: 'MONTHLY_CARD',
        OR: [
          { expiresAt: null },
          { expiresAt: { gte: new Date() } }
        ]
      }
    })
  ]);

  const totalResults = totalTestResults + totalImageAnalysisResults;
  const todayNew = todayTestResults + todayImageAnalysisResults;

  const IMAGE_ANALYSIS_TYPE_MAP = {
    '1': 'image-analysis-1',
    '2': 'image-analysis-2',
    '3': 'image-analysis-3',
    '4': 'image-analysis-4',
    '5': 'image-analysis-5',
    '6': 'image-analysis-6',
    '7': 'image-analysis-7',
    '8': 'image-analysis-8',
    '9': 'image-analysis-9',
    '10': 'image-analysis-10',
    '11': 'image-analysis-11',
    '12': 'image-analysis-12'
  };

  const allByType = [
    ...byTestType.map(item => ({
      testType: item.testType,
      count: item._count.id
    })),
    ...byImageAnalysisType.map(item => ({
      testType: IMAGE_ANALYSIS_TYPE_MAP[item.analysisType] || `image-analysis-${item.analysisType}`,
      count: item._count.id
    }))
  ];

  const imageAnalysisTotal = byImageAnalysisType.reduce((sum, item) => sum + item._count.id, 0);
  if (imageAnalysisTotal > 0) {
    allByType.push({
      testType: 'image-analysis',
      count: imageAnalysisTotal
    });
  }

  allByType.sort((a, b) => b.count - a.count);

  return {
    totalResults,
    todayNew,
    totalCodes,
    usedCodes,
    codeUsageRate: totalCodes > 0 ? Math.round((usedCodes / totalCodes) * 100) : 0,
    monthlyCards,
    activeMonthlyCards,
    byTestType: allByType
  };
}

export async function getResults(testType, page = 1, limit = 20, startDate, endDate) {
  const skip = (page - 1) * limit;

  if (testType === 'all' || !testType) {
    const testWhere = {};
    const imageWhere = {};

    if (startDate || endDate) {
      const dateFilter = {};
      if (startDate) dateFilter.gte = new Date(startDate);
      if (endDate) dateFilter.lte = new Date(endDate);
      testWhere.createdAt = dateFilter;
      imageWhere.createdAt = dateFilter;
    }

    const [testResults, imageResults] = await Promise.all([
      prisma.testResult.findMany({
        where: testWhere,
        include: {
          exchangeCode: { select: { code: true, codeType: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.imageAnalysisResult.findMany({
        where: imageWhere,
        include: {
          exchangeCode: { select: { code: true, codeType: true } }
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    const allResults = [
      ...testResults.map(r => ({
        id: r.id,
        testType: r.testType,
        resultData: r.resultData,
        createdAt: r.createdAt,
        exchangeCode: r.exchangeCode,
        _type: 'test'
      })),
      ...imageResults.map(r => ({
        id: r.id,
        testType: 'image-analysis',
        resultData: { analysisType: r.analysisType, resultImage: r.resultImage },
        createdAt: r.createdAt,
        exchangeCode: r.exchangeCode,
        _type: 'image'
      }))
    ];

    allResults.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = allResults.length;
    const pagedResults = allResults.slice(skip, skip + limit);

    return { results: pagedResults, total, page, pages: Math.ceil(total / limit) };
  }

  if (testType === 'image-analysis') {
    const where = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [results, total] = await Promise.all([
      prisma.imageAnalysisResult.findMany({
        where,
        skip,
        take: limit,
        include: {
          exchangeCode: { select: { code: true, codeType: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.imageAnalysisResult.count({ where })
    ]);

    return {
      results: results.map(r => ({
        id: r.id,
        testType: 'image-analysis',
        resultData: { analysisType: r.analysisType, resultImage: r.resultImage },
        createdAt: r.createdAt,
        exchangeCode: r.exchangeCode,
        _type: 'image'
      })),
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  }

  const where = { testType };
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const [results, total] = await Promise.all([
    prisma.testResult.findMany({
      where,
      skip,
      take: limit,
      include: {
        exchangeCode: {
          select: { code: true, codeType: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.testResult.count({ where })
  ]);

  return { results, total, page, pages: Math.ceil(total / limit) };
}

export async function getResultById(id) {
  return prisma.testResult.findUnique({
    where: { id },
    include: {
      exchangeCode: {
        select: { code: true, codeType: true }
      }
    }
  });
}

export async function deleteResult(id) {
  return prisma.testResult.delete({ where: { id } });
}

export async function exportResults(testType, startDate, endDate) {
  const where = {};
  if (testType && testType !== 'all') {
    where.testType = testType;
  }
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const results = await prisma.testResult.findMany({
    where,
    include: {
      exchangeCode: {
        select: { code: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const headers = ['ID', '测试类型', '兑换码', '结果摘要', '创建时间'];
  const rows = results.map(r => {
    const rd = r.resultData || {};
    let summary = '';
    if (r.testType === 'mental-age') summary = `心理年龄${rd.mentalAge || '-'}`;
    else if (r.testType === 'mbti') summary = rd.mbtiType || '-';
    else if (r.testType === 'sbti') summary = `${rd.sbtiType || '-'}(${rd.sbtiName || '-'})`;
    else if (r.testType === 'nbti') summary = `${rd.nbtiType || '-'}(${rd.nbtiName || '-'})`;
    else if (r.testType === 'disc') summary = `${rd.primaryType || '-'}型`;
    else if (r.testType === 'avoidant') summary = `${rd.attachmentType || '-'}(${rd.score || '-'}分)`;
    else if (r.testType === 'city') summary = `${(rd.topCity || {}).name || '-'}`;
    else summary = JSON.stringify(rd).slice(0, 50);

    return [
      String(r.id),
      r.testType,
      r.exchangeCode?.code || '-',
      summary,
      new Date(r.createdAt).toLocaleString('zh-CN')
    ];
  });

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csv;
}

export async function createMonthlyCards(count, validDays, useLimit, remark, groupId) {
  if (count < 1 || count > 100) {
    throw new Error('生成数量必须在1-100之间');
  }

  const codes = [];
  const existingCodes = new Set();

  const existing = await prisma.exchangeCode.findMany({
    select: { code: true }
  });
  existing.forEach(item => existingCodes.add(item.code));

  while (codes.length < count) {
    const code = generateRandomCode();
    if (!existingCodes.has(code)) {
      codes.push(code);
      existingCodes.add(code);
    }
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (validDays || 30));

  const created = await prisma.exchangeCode.createMany({
    data: codes.map(code => ({
      code,
      codeType: 'MONTHLY_CARD',
      expiresAt,
      useLimit: useLimit || null,
      remark: remark || null,
      groupId: groupId || null
    }))
  });

  return { count: created.count, codes, expiresAt };
}

export async function getMonthlyCards(page = 1, limit = 50) {
  const skip = (page - 1) * limit;

  const [cards, total] = await Promise.all([
    prisma.exchangeCode.findMany({
      where: { codeType: 'MONTHLY_CARD' },
      skip,
      take: limit,
      include: {
        group: {
          select: { id: true, name: true, allowedTestTypes: true }
        },
        testResults: {
          select: { id: true, testType: true, createdAt: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.exchangeCode.count({ where: { codeType: 'MONTHLY_CARD' } })
  ]);

  return { cards, total, page, pages: Math.ceil(total / limit) };
}

export async function getMonthlyCardResults(exchangeCodeId) {
  const results = await prisma.testResult.findMany({
    where: { exchangeCodeId },
    orderBy: { createdAt: 'desc' }
  });
  return results;
}

export async function updateCodeScope(id, groupId) {
  const code = await prisma.exchangeCode.findUnique({
    where: { id }
  });
  if (!code) {
    throw new Error('兑换码不存在');
  }
  if (code.codeType === 'SINGLE_USE' && code.used) {
    throw new Error('已使用的兑换码不能修改分组');
  }
  if (code.codeType === 'MONTHLY_CARD' && code.expiresAt && new Date() > code.expiresAt) {
    throw new Error('已过期的月卡不能修改分组');
  }
  return prisma.exchangeCode.update({
    where: { id },
    data: {
      groupId: groupId || null
    }
  });
}

export async function updateMonthlyCardLimit(id, useLimit) {
  const code = await prisma.exchangeCode.findUnique({
    where: { id }
  });
  if (!code) {
    throw new Error('兑换码不存在');
  }
  if (code.codeType !== 'MONTHLY_CARD') {
    throw new Error('仅月卡支持修改次数');
  }
  return prisma.exchangeCode.update({
    where: { id },
    data: {
      useLimit: useLimit !== null && useLimit !== undefined && useLimit !== '' ? parseInt(useLimit) : null
    }
  });
}

export async function batchUpdateCodeScope(ids, groupId) {
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new Error('请选择要修改的兑换码');
  }
  if (ids.length > 200) {
    throw new Error('单次最多修改200个兑换码');
  }

  const codes = await prisma.exchangeCode.findMany({
    where: { id: { in: ids } }
  });

  const blocked = codes.filter(c =>
    (c.codeType === 'SINGLE_USE' && c.used) ||
    (c.codeType === 'MONTHLY_CARD' && c.expiresAt && new Date() > c.expiresAt)
  );
  if (blocked.length > 0) {
    throw new Error(`以下兑换码已使用或已过期，不能修改：${blocked.map(c => c.code).join(', ')}`);
  }

  const validIds = codes.map(c => c.id);

  await prisma.exchangeCode.updateMany({
    where: { id: { in: validIds } },
    data: { groupId: groupId || null }
  });

  return { updated: validIds.length };
}

export async function getTestConfigs() {
  const configs = await prisma.testConfig.findMany({
    orderBy: { order: 'asc' }
  });

  const configsWithCount = await Promise.all(configs.map(async (cfg) => {
    const resultCount = await prisma.testResult.count({
      where: { testType: cfg.typeKey }
    });
    return { ...cfg, resultCount };
  }));

  return configsWithCount;
}

export async function addTestConfig(typeKey, name, page, order) {
  const existing = await prisma.testConfig.findUnique({
    where: { typeKey }
  });
  if (existing) {
    throw new Error('该TypeKey已存在');
  }

  return prisma.testConfig.create({
    data: { typeKey, name, page: page || null, order: order || 0 }
  });
}

export async function updateTestConfig(id, data) {
  return prisma.testConfig.update({
    where: { id },
    data
  });
}

export async function deleteTestConfig(id) {
  return prisma.testConfig.delete({ where: { id } });
}

export async function seedDefaultTestConfigs() {
  const defaults = [
    { typeKey: 'mental-age', name: '心理年龄测试', page: 'index.html', order: 1 },
    { typeKey: 'mbti', name: 'MBTI性格测试', page: 'mbti.html', order: 2 },
    { typeKey: 'sbti', name: 'SBTI测试', page: 'sbti.html', order: 3 },
    { typeKey: 'nbti', name: 'NBTI恋爱测试', page: 'nbti.html', order: 4 },
    { typeKey: 'disc', name: 'DISC测试', page: 'DISC.html', order: 5 },
    { typeKey: 'avoidant', name: '回避型依恋测试', page: 'avoidant.html', order: 6 },
    { typeKey: 'city', name: '性格匹配城市测试', page: 'city.html', order: 7 },
    { typeKey: 'id-photo', name: '个人证件照生成', page: 'id-photo.html', order: 8 }
  ];

  let created = 0;
  for (const d of defaults) {
    const existing = await prisma.testConfig.findUnique({
      where: { typeKey: d.typeKey }
    });
    if (!existing) {
      await prisma.testConfig.create({ data: d });
      created++;
    }
  }

  return { seeded: created, total: defaults.length };
}

export async function getImageAnalysisResults(page = 1, limit = 20, startDate, endDate) {
  const skip = (page - 1) * limit;
  const where = {};

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const [results, total] = await Promise.all([
    prisma.imageAnalysisResult.findMany({
      where,
      skip,
      take: limit,
      include: {
        exchangeCode: {
          select: { code: true, codeType: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.imageAnalysisResult.count({ where })
  ]);

  return { results, total, page, pages: Math.ceil(total / limit) };
}

export async function getImageAnalysisResultById(id) {
  return prisma.imageAnalysisResult.findUnique({
    where: { id },
    include: {
      exchangeCode: {
        select: { code: true, codeType: true }
      }
    }
  });
}

export async function deleteImageAnalysisResult(id) {
  return prisma.imageAnalysisResult.delete({ where: { id } });
}

export async function getIdPhotoResults(page = 1, limit = 20, startDate, endDate) {
  const skip = (page - 1) * limit;
  const where = {};

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const [results, total] = await Promise.all([
    prisma.idPhotoResult.findMany({
      where,
      skip,
      take: limit,
      include: {
        exchangeCode: {
          select: { code: true, codeType: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.idPhotoResult.count({ where })
  ]);

  return { results, total, page, pages: Math.ceil(total / limit) };
}

export async function getIdPhotoResultById(id) {
  return prisma.idPhotoResult.findUnique({
    where: { id },
    include: {
      exchangeCode: {
        select: { code: true, codeType: true }
      }
    }
  });
}

export async function deleteIdPhotoResult(id) {
  return prisma.idPhotoResult.delete({ where: { id } });
}

export async function exportImageAnalysisResults(startDate, endDate) {
  const where = {};
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const results = await prisma.imageAnalysisResult.findMany({
    where,
    include: {
      exchangeCode: {
        select: { code: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const ANALYSIS_NAMES = {
    '1': '综合形象分析',
    '2': '穿搭分析',
    '3': '妆容分析',
    '4': '发型分析',
    '5': '色彩分析',
    '6': '气质风格定位',
    '7': '五官风格拆解',
    '8': '显瘦显脸小',
    '9': '拍照表现力',
    '10': '个人品牌感',
    '11': '体型比例分析',
    '12': '发色分析'
  };

  const headers = ['ID', '分析类型', '兑换码', '原始照片', '结果图片', '过期时间', '创建时间'];
  const rows = results.map(r => [
    String(r.id),
    ANALYSIS_NAMES[r.analysisType] || `类型${r.analysisType}`,
    r.exchangeCode?.code || '-',
    r.originalPhoto || '-',
    r.resultImage || '-',
    r.expiresAt ? new Date(r.expiresAt).toLocaleString('zh-CN') : '-',
    new Date(r.createdAt).toLocaleString('zh-CN')
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csv;
}

export async function getTestGroups() {
  const groups = await prisma.testGroup.findMany({
    orderBy: { createdAt: 'asc' },
    include: {
      _count: {
        select: { exchangeCodes: true }
      }
    }
  });
  return groups.map(g => ({
    ...g,
    codeCount: g._count.exchangeCodes
  }));
}

export async function getTestGroupById(id) {
  return prisma.testGroup.findUnique({
    where: { id },
    include: {
      exchangeCodes: {
        select: { id: true, code: true, codeType: true }
      }
    }
  });
}

export async function addTestGroup(name, description, allowedTestTypes) {
  const existing = await prisma.testGroup.findUnique({
    where: { name }
  });
  if (existing) {
    throw new Error('分组名称已存在');
  }

  return prisma.testGroup.create({
    data: {
      name,
      description: description || null,
      allowedTestTypes: allowedTestTypes && allowedTestTypes.length > 0 ? allowedTestTypes : []
    }
  });
}

export async function updateTestGroup(id, data) {
  if (data.name) {
    const existing = await prisma.testGroup.findFirst({
      where: { name: data.name, id: { not: id } }
    });
    if (existing) {
      throw new Error('分组名称已存在');
    }
  }

  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description || null;
  if (data.allowedTestTypes !== undefined) {
    updateData.allowedTestTypes = data.allowedTestTypes && data.allowedTestTypes.length > 0 ? data.allowedTestTypes : [];
  }

  return prisma.testGroup.update({
    where: { id },
    data: updateData
  });
}

export async function deleteTestGroup(id) {
  const codesCount = await prisma.exchangeCode.count({
    where: { groupId: id }
  });
  if (codesCount > 0) {
    throw new Error(`该分组下有 ${codesCount} 个兑换码，请先移除或转移这些兑换码`);
  }

  return prisma.testGroup.delete({ where: { id } });
}

export async function deleteExchangeCode(id) {
  const code = await prisma.exchangeCode.findUnique({
    where: { id },
    include: {
      testResults: { select: { id: true } },
      imageAnalysisResults: { select: { id: true } }
    }
  });

  if (!code) {
    throw new Error('兑换码不存在');
  }

  if (code.testResults.length > 0 || code.imageAnalysisResults.length > 0) {
    throw new Error('该兑换码已有关联的测试结果，不能删除');
  }

  await prisma.exchangeCode.delete({ where: { id } });
  return { success: true, code: code.code };
}

export async function batchDeleteExchangeCodes(ids) {
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new Error('请选择要删除的兑换码');
  }
  if (ids.length > 200) {
    throw new Error('单次最多删除200个兑换码');
  }

  const codes = await prisma.exchangeCode.findMany({
    where: { id: { in: ids } },
    include: {
      testResults: { select: { id: true } },
      imageAnalysisResults: { select: { id: true } }
    }
  });

  const withResults = codes.filter(c => 
    c.testResults.length > 0 || c.imageAnalysisResults.length > 0
  );

  if (withResults.length > 0) {
    throw new Error(`以下兑换码已有关联结果，不能删除：${withResults.map(c => c.code).join(', ')}`);
  }

  const result = await prisma.exchangeCode.deleteMany({
    where: { id: { in: ids } }
  });

  return { deleted: result.count };
}

export async function seedDefaultTestGroups() {
  const allTestTypes = [
    'mental-age', 'mbti', 'sbti', 'nbti', 'disc', 'avoidant', 'city', 'anxious', 'love-depth', 'secret-crush', 'city-report', 'image-analysis'
  ];

  const funTestTypes = [
    'mental-age', 'mbti', 'sbti', 'nbti', 'disc', 'avoidant', 'city', 'anxious', 'love-depth', 'secret-crush'
  ];

  const defaults = [
    { name: '全部测试', description: '包含所有测试项目', allowedTestTypes: allTestTypes },
    { name: '趣味测试', description: '不含深度报告和形象分析', allowedTestTypes: funTestTypes }
  ];

  let created = 0;
  for (const d of defaults) {
    const existing = await prisma.testGroup.findUnique({
      where: { name: d.name }
    });
    if (!existing) {
      await prisma.testGroup.create({ data: d });
      created++;
    }
  }

  return { seeded: created, total: defaults.length };
}

// 证件照排版结果查询
export async function getIdPhotoLayoutResults(page = 1, limit = 20, startDate, endDate) {
  const skip = (page - 1) * limit;
  const where = {};

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const [results, total] = await Promise.all([
    prisma.idPhotoLayoutResult.findMany({
      where,
      skip,
      take: limit,
      include: {
        exchangeCode: {
          select: { code: true, codeType: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.idPhotoLayoutResult.count({ where })
  ]);

  return { results, total, page, pages: Math.ceil(total / limit) };
}

export async function getIdPhotoLayoutResultById(id) {
  return prisma.idPhotoLayoutResult.findUnique({
    where: { id },
    include: {
      exchangeCode: {
        select: { code: true, codeType: true }
      }
    }
  });
}

export async function deleteIdPhotoLayoutResult(id) {
  return prisma.idPhotoLayoutResult.delete({ where: { id } });
}
