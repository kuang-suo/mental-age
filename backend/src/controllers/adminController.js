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

export async function generateCodes(count) {
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
    data: codes.map(code => ({ code }))
  });

  return {
    count: created.count,
    codes
  };
}

export async function getCodes(page = 1, limit = 50) {
  const skip = (page - 1) * limit;

  const [codes, total] = await Promise.all([
    prisma.exchangeCode.findMany({
      skip,
      take: limit,
      include: {
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
    prisma.exchangeCode.count()
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

  const headers = ['兑换码', '类型', '状态', '使用时间', '使用次数', '关联测试', '创建时间'];
  const rows = codes.map(code => {
    const testInfo = code.testResults.length > 0
      ? code.testResults.map(r => r.testType).join('; ')
      : '-';
    return [
      code.code,
      code.codeType === 'MONTHLY_CARD' ? '月卡' : '单次',
      code.codeType === 'MONTHLY_CARD'
        ? (code.expiresAt && new Date() > code.expiresAt ? '已过期' : '有效')
        : (code.used ? '已使用' : '未使用'),
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
  const [totalResults, todayStart] = await Promise.all([
    prisma.testResult.count(),
    prisma.testResult.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      },
      select: { id: true }
    })
  ]);

  const byTestType = await prisma.testResult.groupBy({
    by: ['testType'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } }
  });

  const [totalCodes, usedCodes] = await Promise.all([
    prisma.exchangeCode.count(),
    prisma.exchangeCode.count({ where: { used: true } })
  ]);

  const monthlyCards = await prisma.exchangeCode.count({
    where: { codeType: 'MONTHLY_CARD' }
  });

  const activeMonthlyCards = await prisma.exchangeCode.count({
    where: {
      codeType: 'MONTHLY_CARD',
      OR: [
        { expiresAt: null },
        { expiresAt: { gte: new Date() } }
      ]
    }
  });

  return {
    totalResults,
    todayNew: todayStart.length,
    totalCodes,
    usedCodes,
    codeUsageRate: totalCodes > 0 ? Math.round((usedCodes / totalCodes) * 100) : 0,
    monthlyCards,
    activeMonthlyCards,
    byTestType: byTestType.map(item => ({
      testType: item.testType,
      count: item._count.id
    }))
  };
}

export async function getResults(testType, page = 1, limit = 20, startDate, endDate) {
  const skip = (page - 1) * limit;
  const where = {};

  if (testType && testType !== 'all') {
    where.testType = testType;
  }

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

export async function createMonthlyCards(count, validDays, useLimit, remark) {
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
      remark: remark || null
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
    { typeKey: 'city', name: '性格匹配城市测试', page: 'city.html', order: 7 }
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
