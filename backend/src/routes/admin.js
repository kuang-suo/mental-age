import express from 'express';
import { body, validationResult, query } from 'express-validator';
import { loginLimiter } from '../middleware/rateLimiter.js';
import { authMiddleware } from '../middleware/auth.js';
import {
  login, generateCodes, getCodes, exportCodes,
  getStats, getResults, getResultById, deleteResult, exportResults,
  createMonthlyCards, getMonthlyCards, getMonthlyCardResults,
  updateCodeScope, batchUpdateCodeScope,
  getTestConfigs, addTestConfig, updateTestConfig, deleteTestConfig, seedDefaultTestConfigs
} from '../controllers/adminController.js';

const router = express.Router();

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

router.get(
  '/codes',
  authMiddleware,
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('codeType').optional().trim(),
  query('status').optional().trim(),
  query('scope').optional().trim(),
  query('search').optional().trim(),
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const filters = {
        codeType: req.query.codeType || null,
        status: req.query.status || null,
        scope: req.query.scope || null,
        search: req.query.search || null
      };
      const result = await getCodes(page, limit, filters);
      res.json(result);
    } catch (error) {
      console.error('获取兑换码列表失败:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

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
      const result = await generateCodes(req.body.count, req.body.allowedTestTypes || null);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

router.put(
  '/codes/:id/scope',
  authMiddleware,
  body('allowedTestTypes').optional({ nullable: true }).isArray(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const result = await updateCodeScope(
        parseInt(req.params.id),
        req.body.allowedTestTypes || null
      );
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

router.put(
  '/codes/batch-scope',
  authMiddleware,
  body('ids').isArray({ min: 1, max: 200 }).withMessage('请选择1-200个兑换码'),
  body('allowedTestTypes').optional({ nullable: true }).isArray(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const result = await batchUpdateCodeScope(
        req.body.ids,
        req.body.allowedTestTypes || null
      );
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

router.get(
  '/export',
  authMiddleware,
  async (req, res) => {
    try {
      const csv = await exportCodes();
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="codes.csv"');
      res.send('\uFEFF' + csv);
    } catch (error) {
      console.error('导出CSV失败:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

router.get('/stats/overview', authMiddleware, async (req, res) => {
  try {
    const stats = await getStats();
    res.json(stats);
  } catch (error) {
    console.error('获取统计数据失败:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get(
  '/results',
  authMiddleware,
  query('testType').optional().trim(),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('startDate').optional().trim(),
  query('endDate').optional().trim(),
  async (req, res) => {
    try {
      const testType = req.query.testType || 'all';
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const startDate = req.query.startDate || null;
      const endDate = req.query.endDate || null;
      const result = await getResults(testType, page, limit, startDate, endDate);
      res.json(result);
    } catch (error) {
      console.error('获取结果列表失败:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

router.get('/results/:id', authMiddleware, async (req, res) => {
  try {
    const result = await getResultById(parseInt(req.params.id));
    if (!result) {
      return res.status(404).json({ error: '结果不存在' });
    }
    res.json(result);
  } catch (error) {
    console.error('获取结果详情失败:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/results/:id', authMiddleware, async (req, res) => {
  try {
    await deleteResult(parseInt(req.params.id));
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('删除结果失败:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get(
  '/results-export',
  authMiddleware,
  async (req, res) => {
    try {
      const testType = req.query.testType || 'all';
      const startDate = req.query.startDate || null;
      const endDate = req.query.endDate || null;
      const csv = await exportResults(testType, startDate, endDate);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="results.csv"');
      res.send('\uFEFF' + csv);
    } catch (error) {
      console.error('导出结果CSV失败:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  '/create-monthly-cards',
  authMiddleware,
  body('count').isInt({ min: 1, max: 100 }).withMessage('数量必须在1-100之间'),
  body('validDays').optional().isInt({ min: 1 }).toInt(),
  body('useLimit').optional({ nullable: true }).isInt({ min: 1 }).toInt(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const result = await createMonthlyCards(
        req.body.count,
        req.body.validDays || 30,
        req.body.useLimit || null,
        req.body.remark || null,
        req.body.allowedTestTypes || null
      );
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

router.get(
  '/monthly-cards',
  authMiddleware,
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const result = await getMonthlyCards(page, limit);
      res.json(result);
    } catch (error) {
      console.error('获取月卡列表失败:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  '/monthly-cards/:id/results',
  authMiddleware,
  async (req, res) => {
    try {
      const results = await getMonthlyCardResults(parseInt(req.params.id));
      res.json(results);
    } catch (error) {
      console.error('获取月卡测试结果失败:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

router.get('/test-configs', authMiddleware, async (req, res) => {
  try {
    const configs = await getTestConfigs();
    res.json(configs);
  } catch (error) {
    console.error('获取测试配置失败:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post(
  '/test-configs',
  authMiddleware,
  body('typeKey').trim().notEmpty().withMessage('TypeKey不能为空'),
  body('name').trim().notEmpty().withMessage('测试名称不能为空'),
  body('page').optional().trim(),
  body('order').optional().isInt({ min: 0 }).toInt(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const config = await addTestConfig(
        req.body.typeKey,
        req.body.name,
        req.body.page || null,
        req.body.order || 0
      );
      res.json(config);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

router.put(
  '/test-configs/:id',
  authMiddleware,
  body('name').optional().trim().notEmpty(),
  body('page').optional().trim(),
  body('enabled').optional().isBoolean(),
  body('order').optional().isInt({ min: 0 }).toInt(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const data = {};
      if (req.body.name !== undefined) data.name = req.body.name;
      if (req.body.page !== undefined) data.page = req.body.page;
      if (req.body.enabled !== undefined) data.enabled = req.body.enabled;
      if (req.body.order !== undefined) data.order = req.body.order;

      const config = await updateTestConfig(parseInt(req.params.id), data);
      res.json(config);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

router.delete('/test-configs/:id', authMiddleware, async (req, res) => {
  try {
    await deleteTestConfig(parseInt(req.params.id));
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/test-configs/seed', authMiddleware, async (req, res) => {
  try {
    const result = await seedDefaultTestConfigs();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
