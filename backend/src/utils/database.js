import bcrypt from 'bcryptjs';
import config from '../config/env.js';

// 20道测试题目（覆盖8个维度）
const QUESTIONS = [
  { title: '当遇到挫折时，我能很快调整心态继续前进', dimension: 1, order: 1 },
  { title: '我喜欢在社交场合中与陌生人交流', dimension: 2, order: 2 },
  { title: '我对自己的优缺点有清晰的认识', dimension: 3, order: 3 },
  { title: '我会主动承担工作中的责任', dimension: 4, order: 4 },
  { title: '我对新事物充满好奇心', dimension: 5, order: 5 },
  { title: '面对变化，我能快速适应新环境', dimension: 6, order: 6 },
  { title: '我对生活的未来充满乐观', dimension: 7, order: 7 },
  { title: '在压力下，我能保持冷静思考', dimension: 8, order: 8 },
  { title: '我很少因为小事而感到烦恼', dimension: 1, order: 9 },
  { title: '我是朋友圈中的活跃分子', dimension: 2, order: 10 },
  { title: '我经常反思自己的行为和决定', dimension: 3, order: 11 },
  { title: '我会按时完成承诺的事情', dimension: 4, order: 12 },
  { title: '我喜欢学习新的知识和技能', dimension: 5, order: 13 },
  { title: '我能轻松接受他人的不同意见', dimension: 6, order: 14 },
  { title: '即使困难重重，我也相信会有好结果', dimension: 7, order: 15 },
  { title: '我有有效的方法来缓解压力', dimension: 8, order: 16 },
  { title: '我的情绪波动不会影响日常生活', dimension: 1, order: 17 },
  { title: '我喜欢参加各种社交活动', dimension: 2, order: 18 },
  { title: '我了解自己真正想要什么', dimension: 3, order: 19 },
  { title: '我会为自己的错误承担后果', dimension: 4, order: 20 }
];

export async function initializeDatabase(prisma) {
  try {
    // 检查是否已有题目
    const questionCount = await prisma.question.count();
    if (questionCount === 0) {
      console.log('初始化题目数据...');
      await prisma.question.createMany({
        data: QUESTIONS
      });
      console.log('✓ 题目数据初始化完成');
    }

    // 检查是否已有管理员
    const adminCount = await prisma.admin.count();
    if (adminCount === 0) {
      console.log('初始化管理员账户...');
      const password = config.admin.initPassword;
      const passwordHash = await bcrypt.hash(password, 10);

      await prisma.admin.create({
        data: {
          username: 'admin',
          passwordHash
        }
      });

      console.log('✓ 管理员账户初始化完成');
      console.log(`  用户名: admin`);
      console.log(`  密码: ${password}`);
      console.log('  ⚠️  请在生产环境中修改密码！');
    }
  } catch (error) {
    console.error('数据库初始化失败:', error);
    throw error;
  }
}
