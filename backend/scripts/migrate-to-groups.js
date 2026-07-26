import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TEST_TYPE_NAMES = {
  'mental-age': '心理年龄',
  'mbti': 'MBTI',
  'sbti': 'SBTI',
  'nbti': 'NBTI恋爱',
  'disc': 'DISC',
  'avoidant': '回避型依恋',
  'city': '城市匹配',
  'anxious': '焦虑型依恋',
  'love-depth': '恋爱深度解析',
  'secret-crush': '暗恋程度测试',
  'city-report': '城市报告',
  'image-analysis': '个人形象分析'
};

async function migrate() {
  console.log('开始迁移兑换码到分组系统...\n');

  const allTestTypes = Object.keys(TEST_TYPE_NAMES);

  const allGroup = await prisma.testGroup.findUnique({ where: { name: '全部测试' } });
  if (!allGroup) {
    const created = await prisma.testGroup.create({
      data: { name: '全部测试', description: '包含所有测试项目', allowedTestTypes: allTestTypes }
    });
    console.log('✅ 创建默认分组: 全部测试');
  } else {
    console.log('ℹ️ 分组已存在: 全部测试');
  }

  const funGroup = await prisma.testGroup.findUnique({ where: { name: '趣味测试' } });
  if (!funGroup) {
    const funTestTypes = allTestTypes.filter(t => t !== 'city-report' && t !== 'image-analysis');
    await prisma.testGroup.create({
      data: { name: '趣味测试', description: '不含深度报告和形象分析', allowedTestTypes: funTestTypes }
    });
    console.log('✅ 创建默认分组: 趣味测试');
  } else {
    console.log('ℹ️ 分组已存在: 趣味测试');
  }

  const codes = await prisma.exchangeCode.findMany({
    where: {
      groupId: null
    }
  });

  console.log(`\n找到 ${codes.length} 个未分组的兑换码\n`);

  const scopeMap = new Map();

  for (const code of codes) {
    const scopeKey = JSON.stringify(code.allowedTestTypes || []);
    if (!scopeMap.has(scopeKey)) {
      scopeMap.set(scopeKey, []);
    }
    scopeMap.get(scopeKey).push(code);
  }

  console.log(`发现 ${scopeMap.size} 种不同的范围配置\n`);

  let groupCount = 0;
  let migratedCount = 0;

  for (const [scopeKey, codesInScope] of scopeMap) {
    const allowedTestTypes = JSON.parse(scopeKey);

    if (allowedTestTypes.length === 0) {
      console.log(`📋 范围为空(全部可用): ${codesInScope.length} 个兑换码 → 保持未分组状态`);
      continue;
    }

    const groupNames = allowedTestTypes.map(t => TEST_TYPE_NAMES[t] || t);
    const newGroupName = `迁移分组-${groupNames.slice(0, 2).join('+')}${groupNames.length > 2 ? '等' : ''}`;

    let group = await prisma.testGroup.findFirst({
      where: { allowedTestTypes: { equals: allowedTestTypes } }
    });

    if (!group) {
      group = await prisma.testGroup.create({
        data: {
          name: newGroupName,
          description: `迁移自兑换码范围: ${groupNames.join(', ')}`,
          allowedTestTypes
        }
      });
      groupCount++;
      console.log(`✅ 创建新分组: ${group.name} (包含 ${allowedTestTypes.length} 个测试)`);
    }

    await prisma.exchangeCode.updateMany({
      where: { id: { in: codesInScope.map(c => c.id) } },
      data: { groupId: group.id }
    });

    migratedCount += codesInScope.length;
    console.log(`   └─ 关联 ${codesInScope.length} 个兑换码`);
  }

  console.log(`\n========== 迁移完成 ==========`);
  console.log(`新增分组: ${groupCount} 个`);
  console.log(`已迁移兑换码: ${migratedCount} 个`);
  console.log(`保持未分组: ${codes.length - migratedCount} 个 (全部可用)`);

  await prisma.$disconnect();
}

migrate().catch(e => {
  console.error('迁移失败:', e);
  process.exit(1);
});
