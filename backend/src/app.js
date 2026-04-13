import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import config from './config/env.js';
import { generalLimiter, errorHandler } from './middleware/auth.js';
import { initializeDatabase } from './utils/database.js';
import apiRoutes from './routes/api.js';
import adminRoutes from './routes/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const prisma = new PrismaClient();

// 【核心修复】开启trust proxy，适配Railway反向代理环境
app.set('trust proxy', 1);

// 中间件
app.use(cors({ 
  origin: config.cors.origin,
  credentials: true
}));
app.use(express.json());
// 限流中间件放在json解析之后
app.use(generalLimiter);

// 静态文件服务 - 服务前端文件
const frontendPath = path.join(__dirname, '../../frontend');
app.use(express.static(frontendPath));

// 路由
app.use('/api', apiRoutes);
app.use('/api/admin', adminRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '服务运行正常' });
});

// 错误处理
app.use(errorHandler);

// 启动服务器
async function start() {
  try {
    // 数据库初始化（现在服务能正常启动，不会崩溃了，可以恢复这个逻辑）
    await initializeDatabase(prisma);

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