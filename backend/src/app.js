import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import config from './config/env.js';
import { generalLimiter, errorHandler } from './middleware/auth.js';
import { initializeDatabase } from './utils/database.js';
import apiRoutes from './routes/api.js';
import adminRoutes from './routes/admin.js';

const app = express();
const prisma = new PrismaClient();

// 中间件
app.use(cors({ origin: config.cors.origin }));
app.use(express.json());
app.use(generalLimiter);

// 路由
app.use('/api', apiRoutes);
app.use('/api/admin', adminRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 错误处理
app.use(errorHandler);

// 启动服务器
async function start() {
  try {
    // 初始化数据库
    await initializeDatabase(prisma);

    app.listen(config.port, () => {
      console.log(`服务器运行在 http://localhost:${config.port}`);
      console.log(`环境: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('启动失败:', error);
    process.exit(1);
  }
}

start();

export default app;
