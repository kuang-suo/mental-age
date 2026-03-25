import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import config from './config/env.js';
import { generalLimiter, errorHandler } from './middleware/auth.js';
// import { initializeDatabase } from './utils/database.js'; 先注释掉，避免启动失败
import apiRoutes from './routes/api.js';
import adminRoutes from './routes/admin.js';

const app = express();
const prisma = new PrismaClient();

// 中间件
app.use(cors({ 
  origin: config.cors.origin,
  credentials: true
}));
app.use(express.json());
app.use(generalLimiter);

// 路由
app.use('/api', apiRoutes);
app.use('/api/admin', adminRoutes);

// 健康检查（优先测试这个接口，确认服务是否正常）
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '服务运行正常' });
});

// 错误处理
app.use(errorHandler);

// 启动服务器
async function start() {
  try {
    // 先注释掉数据库初始化，避免启动崩溃
    // await initializeDatabase(prisma);

    // 正确监听端口，适配Railway环境
    app.listen(config.port, "0.0.0.0", () => {
      console.log(`✅ 服务启动成功，监听端口：${config.port}`);
      console.log(`🌍 运行环境：${config.nodeEnv}`);
      console.log(`🔗 健康检查地址：http://0.0.0.0:${config.port}/health`);
    });
  } catch (error) {
    console.error('❌ 服务启动失败:', error);
    process.exit(1);
  }
}

start();

export default app;