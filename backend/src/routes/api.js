import express from 'express';
import { body, validationResult } from 'express-validator';
import { validateCodeLimiter, submitTestLimiter } from '../middleware/rateLimiter.js';
import { validateCode, submitTest, getQuestions } from '../controllers/testController.js';

const router = express.Router();

// 获取所有题目
router.get('/questions', async (req, res) => {
  try {
    const questions = await getQuestions();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 验证兑换码
router.post(
  '/validate-code',
  validateCodeLimiter,
  body('code').trim().isLength({ min: 8, max: 8 }).withMessage('兑换码格式错误'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const result = await validateCode(req.body.code);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// 提交测试
router.post(
  '/submit-test',
  submitTestLimiter,
  body('code').trim().isLength({ min: 8, max: 8 }).withMessage('兑换码格式错误'),
  body('answers').isArray({ min: 20, max: 20 }).withMessage('答案数量必须为20'),
  body('answers.*').isInt({ min: 1, max: 5 }).withMessage('每个答案必须在1-5之间'),
  body('realAge').isInt({ min: 18, max: 150 }).withMessage('年龄必须在18-150之间'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('参数验证失败:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      console.log('提交测试请求:', {
        code: req.body.code,
        answersLength: req.body.answers?.length,
        realAge: req.body.realAge
      });

      const result = await submitTest(req.body.code, req.body.answers, req.body.realAge);
      console.log('提交测试成功');
      res.json(result);
    } catch (error) {
      console.error('提交测试失败:', error.message);
      res.status(400).json({ error: error.message });
    }
  }
);

export default router;
