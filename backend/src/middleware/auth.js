import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import rateLimit from 'express-rate-limit';

export function authMiddleware(req, res, next) {
  let token = req.headers.authorization?.split(' ')[1];
  if (!token && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ error: '未提供认证令牌' });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: '无效的认证令牌' });
  }
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || '服务器内部错误'
  });
}

// 通用接口限流
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP 100次请求
  standardHeaders: true, // 返回标准的限流响应头
  legacyHeaders: false, // 关闭旧版本的X-RateLimit-*头
  trustProxy: true, // 【核心新增】信任代理，和express的trust proxy配置匹配，解决报错
  message: { error: '请求过于频繁，请稍后再试' },
});