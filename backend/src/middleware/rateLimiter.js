import rateLimit from 'express-rate-limit';

// 通用速率限制
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制100个请求
  message: '请求过于频繁，请稍后再试'
});

// 提交测试的速率限制（更严格）
export const submitTestLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1分钟
  max: 3, // 限制3个请求
  message: '提交过于频繁，请稍后再试',
  skip: (req) => req.ip === '::1' || req.ip === '127.0.0.1' // 本地开发环境跳过
});

// 登录的速率限制
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 5, // 限制5个请求
  message: '登录尝试过于频繁，请稍后再试'
});

// 验证码的速率限制
export const validateCodeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1分钟
  max: 10, // 限制10个请求
  message: '验证过于频繁，请稍后再试'
});
