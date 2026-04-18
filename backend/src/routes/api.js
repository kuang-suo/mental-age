import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { validateCodeLimiter, submitTestLimiter } from '../middleware/rateLimiter.js';
import { validateCode, submitTest, getQuestions } from '../controllers/testController.js';

const prisma = new PrismaClient();

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

// 提交心理年龄测试
router.post(
  '/submit-test',
  submitTestLimiter,
  body('code').trim().isLength({ min: 8, max: 8 }).withMessage('兑换码格式错误'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('参数验证失败:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      console.log('提交心理年龄测试请求:', {
        code: req.body.code
      });

      // 这里我们只需要标记兑换码为已使用，不需要计算心理年龄结果
      const { code } = req.body;
      
      // 在事务中处理，确保原子性
      const result = await prisma.$transaction(async (tx) => {
        // 1. 查找兑换码
        const exchangeCode = await tx.exchangeCode.findUnique({
          where: { code }
        });

        if (!exchangeCode) {
          throw new Error('兑换码不存在');
        }

        if (exchangeCode.used) {
          throw new Error('兑换码已被使用');
        }

        // 2. 标记兑换码为已使用
        await tx.exchangeCode.update({
          where: { id: exchangeCode.id },
          data: {
            used: true,
            usedAt: new Date()
          }
        });

        return {
          success: true,
          message: '兑换码已成功使用'
        };
      });

      console.log('提交测试成功');
      res.json(result);
    } catch (error) {
      console.error('提交测试失败:', error.message);
      res.status(400).json({ error: error.message });
    }
  }
);

// 提交MBTI测试
router.post(
  '/submit-mbti',
  submitTestLimiter,
  body('code').trim().isLength({ min: 8, max: 8 }).withMessage('兑换码格式错误'),
  body('answers').isArray({ min: 70, max: 70 }).withMessage('答案数量必须为70'),
  body('realAge').isInt({ min: 18, max: 150 }).withMessage('年龄必须在18-150之间'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('参数验证失败:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      console.log('提交MBTI测试请求:', {
        code: req.body.code,
        answersLength: req.body.answers?.length,
        realAge: req.body.realAge
      });

      // 这里我们只需要标记兑换码为已使用，不需要计算心理年龄结果
      const { code, realAge } = req.body;
      
      // 在事务中处理，确保原子性
      const result = await prisma.$transaction(async (tx) => {
        // 1. 查找兑换码
        const exchangeCode = await tx.exchangeCode.findUnique({
          where: { code }
        });

        if (!exchangeCode) {
          throw new Error('兑换码不存在');
        }

        if (exchangeCode.used) {
          throw new Error('兑换码已被使用');
        }

        // 2. 标记兑换码为已使用
        await tx.exchangeCode.update({
          where: { id: exchangeCode.id },
          data: {
            used: true,
            usedAt: new Date()
          }
        });

        return {
          success: true,
          message: '兑换码已成功使用'
        };
      });

      console.log('提交MBTI测试成功');
      res.json(result);
    } catch (error) {
      console.error('提交MBTI测试失败:', error.message);
      res.status(400).json({ error: error.message });
    }
  }
);

// 提交SBTI测试
router.post(
  '/submit-sbti',
  submitTestLimiter,
  body('code').trim().isLength({ min: 8, max: 8 }).withMessage('兑换码格式错误'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('参数验证失败:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      console.log('提交SBTI测试请求:', {
        code: req.body.code
      });

      const { code } = req.body;

      const result = await prisma.$transaction(async (tx) => {
        const exchangeCode = await tx.exchangeCode.findUnique({
          where: { code }
        });

        if (!exchangeCode) {
          throw new Error('兑换码不存在');
        }

        if (exchangeCode.used) {
          throw new Error('兑换码已被使用');
        }

        await tx.exchangeCode.update({
          where: { id: exchangeCode.id },
          data: {
            used: true,
            usedAt: new Date()
          }
        });

        return {
          success: true,
          message: '兑换码已成功使用'
        };
      });

      console.log('提交SBTI测试成功');
      res.json(result);
    } catch (error) {
      console.error('提交SBTI测试失败:', error.message);
      res.status(400).json({ error: error.message });
    }
  }
);

// 提交DISC测试
router.post(
  '/submit-disc',
  submitTestLimiter,
  body('code').trim().isLength({ min: 8, max: 8 }).withMessage('兑换码格式错误'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('参数验证失败:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      console.log('提交DISC测试请求:', {
        code: req.body.code
      });

      const { code } = req.body;

      const result = await prisma.$transaction(async (tx) => {
        const exchangeCode = await tx.exchangeCode.findUnique({
          where: { code }
        });

        if (!exchangeCode) {
          throw new Error('兑换码不存在');
        }

        if (exchangeCode.used) {
          throw new Error('兑换码已被使用');
        }

        await tx.exchangeCode.update({
          where: { id: exchangeCode.id },
          data: {
            used: true,
            usedAt: new Date()
          }
        });

        return {
          success: true,
          message: '兑换码已成功使用'
        };
      });

      console.log('提交DISC测试成功');
      res.json(result);
    } catch (error) {
      console.error('提交DISC测试失败:', error.message);
      res.status(400).json({ error: error.message });
    }
  }
);

// 提交回避型依恋测试
router.post(
  '/submit-avoidant',
  submitTestLimiter,
  body('code').trim().isLength({ min: 8, max: 8 }).withMessage('兑换码格式错误'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('参数验证失败:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      console.log('提交回避型依恋测试请求:', {
        code: req.body.code
      });

      const { code } = req.body;

      const result = await prisma.$transaction(async (tx) => {
        const exchangeCode = await tx.exchangeCode.findUnique({
          where: { code }
        });

        if (!exchangeCode) {
          throw new Error('兑换码不存在');
        }

        if (exchangeCode.used) {
          throw new Error('兑换码已被使用');
        }

        await tx.exchangeCode.update({
          where: { id: exchangeCode.id },
          data: {
            used: true,
            usedAt: new Date()
          }
        });

        return {
          success: true,
          message: '兑换码已成功使用'
        };
      });

      console.log('提交回避型依恋测试成功');
      res.json(result);
    } catch (error) {
      console.error('提交回避型依恋测试失败:', error.message);
      res.status(400).json({ error: error.message });
    }
  }
);

// 提交NBTI恋爱性格测试
router.post(
  '/submit-nbti',
  submitTestLimiter,
  body('code').trim().isLength({ min: 8, max: 8 }).withMessage('兑换码格式错误'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('参数验证失败:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      console.log('提交NBTI恋爱性格测试请求:', {
        code: req.body.code
      });

      const { code } = req.body;

      const result = await prisma.$transaction(async (tx) => {
        const exchangeCode = await tx.exchangeCode.findUnique({
          where: { code }
        });

        if (!exchangeCode) {
          throw new Error('兑换码不存在');
        }

        if (exchangeCode.used) {
          throw new Error('兑换码已被使用');
        }

        await tx.exchangeCode.update({
          where: { id: exchangeCode.id },
          data: {
            used: true,
            usedAt: new Date()
          }
        });

        return {
          success: true,
          message: '兑换码已成功使用'
        };
      });

      console.log('提交NBTI恋爱性格测试成功');
      res.json(result);
    } catch (error) {
      console.error('提交NBTI恋爱性格测试失败:', error.message);
      res.status(400).json({ error: error.message });
    }
  }
);

export default router;
