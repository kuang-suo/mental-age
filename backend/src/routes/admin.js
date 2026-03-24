import express from 'express';
import { body, validationResult, query } from 'express-validator';
import { loginLimiter } from '../middleware/rateLimiter.js';
import { authMiddleware } from '../middleware/auth.js';
import { login, generateCodes, getCodes, exportCodes } from '../controllers/adminController.js';

const router = express.Router();

// 登录
router.post(
  '/login',
  loginLimiter,
  body('username').trim().notEmpty().withMessage('用户名不能为空'),
  body('password').notEmpty().withMessage('密码不能为空'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const result = await login(req.body.username, req.body.password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
);

// 获取兑换码列表（需要认证）
router.get(
  '/codes',
  authMiddleware,
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      console.log('获取兑换码列表:', { page, limit, adminId: req.admin?.id });

      const result = await getCodes(page, limit);
      console.log('成功获取兑换码列表:', { totalCodes: result.total, pages: result.pages });
      res.json(result);
    } catch (error) {
      console.error('获取兑换码列表失败:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

// 生成兑换码（需要认证）
router.post(
  '/generate-codes',
  authMiddleware,
  body('count').isInt({ min: 1, max: 100 }).withMessage('数量必须在1-100之间'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const result = await generateCodes(req.body.count);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// 导出CSV（需要认证）
router.get(
  '/export',
  authMiddleware,
  async (req, res) => {
    try {
      console.log('导出CSV请求:', { adminId: req.admin?.id });
      const csv = await exportCodes();
      console.log('成功导出CSV:', { size: csv.length });

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="codes.csv"');
      res.send('\uFEFF' + csv); // BOM for Excel
    } catch (error) {
      console.error('导出CSV失败:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
