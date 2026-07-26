import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TRACKED_PAGES = new Set([
  '/',
  '/index.html',
  '/home.html',
  '/mbti.html',
  '/sbti.html',
  '/nbti.html',
  '/DISC.html',
  '/avoidant.html',
  '/anxious.html',
  '/love-depth.html',
  '/secret-crush.html',
  '/city-report.html',
  '/image-analysis.html'
]);

const PAGE_NAMES = {
  '/': '首页',
  '/index.html': '心理年龄测试',
  '/home.html': '测试首页',
  '/mbti.html': 'MBTI测试',
  '/sbti.html': 'SBTI测试',
  '/nbti.html': 'NBTI恋爱测试',
  '/DISC.html': 'DISC测试',
  '/avoidant.html': '回避型依恋测试',
  '/anxious.html': '焦虑型依恋测试',
  '/love-depth.html': '恋爱深度解析',
  '/secret-crush.html': '暗恋程度测试',
  '/city-report.html': '城市报告',
  '/image-analysis.html': '个人形象分析'
};

function normalizePage(path) {
  if (!path || path === '/') return '/';
  const normalized = path.split('?')[0];
  return normalized;
}

export async function visitTracker(req, res, next) {
  res.on('finish', async () => {
    try {
      if (req.method !== 'GET') return;
      if (res.statusCode >= 400) return;

      const rawPath = req.path || req.url?.split('?')[0] || '/';
      const page = normalizePage(rawPath);

      if (!TRACKED_PAGES.has(page)) return;

      const contentType = res.getHeader('content-type');
      if (contentType && !contentType.includes('text/html')) return;

      const ip = req.ip || req.headers['x-forwarded-for']?.split(',')[0]?.trim() || null;
      const userAgent = req.headers['user-agent'] || null;
      const referer = req.headers['referer'] || null;

      await prisma.visitLog.create({
        data: { page, ip, userAgent, referer }
      });

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await prisma.visitStat.upsert({
        where: { date_page: { date: today, page } },
        create: { date: today, page, visits: 1, uniqueIps: 1 },
        update: { visits: { increment: 1 } }
      });

    } catch (error) {
      console.error('访问统计错误:', error.message);
    }
  });

  next();
}

export async function getVisitStats(days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const stats = await prisma.visitStat.findMany({
    where: { date: { gte: startDate } },
    orderBy: [{ date: 'desc' }, { visits: 'desc' }]
  });

  const dailyTotals = {};
  const pageTotals = {};

  for (const stat of stats) {
    const dateKey = stat.date.toISOString().split('T')[0];
    if (!dailyTotals[dateKey]) dailyTotals[dateKey] = 0;
    dailyTotals[dateKey] += stat.visits;

    const pageName = PAGE_NAMES[stat.page] || stat.page;
    if (!pageTotals[pageName]) pageTotals[pageName] = 0;
    pageTotals[pageName] += stat.visits;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];

  const todayVisits = dailyTotals[todayStr] || 0;

  const totalVisits = Object.values(dailyTotals).reduce((a, b) => a + b, 0);

  const topPages = Object.entries(pageTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([page, visits]) => ({ page, visits }));

  const dailyChart = Object.entries(dailyTotals)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, visits]) => ({ date, visits }));

  return {
    todayVisits,
    totalVisits,
    topPages,
    dailyChart,
    days
  };
}

export async function cleanupOldLogs(daysToKeep = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const result = await prisma.visitLog.deleteMany({
    where: { createdAt: { lt: cutoffDate } }
  });

  return { deleted: result.count };
}

export { PAGE_NAMES };
