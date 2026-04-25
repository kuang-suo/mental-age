import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { validateCodeLimiter, submitTestLimiter } from '../middleware/rateLimiter.js';
import { validateCode, submitTest, getQuestions } from '../controllers/testController.js';

const prisma = new PrismaClient();

const router = express.Router();

router.get('/questions', async (req, res) => {
  try {
    const questions = await getQuestions();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  '/validate-code',
  validateCodeLimiter,
  body('code').trim().isLength({ min: 8, max: 8 }).withMessage('兑换码格式错误'),
  body('testType').optional().trim().isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const result = await validateCode(req.body.code, req.body.testType || null);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

router.post(
  '/validate-city-report',
  validateCodeLimiter,
  body('code').trim().isLength({ min: 8, max: 8 }).withMessage('兑换码格式错误'),
  body('cityKey').optional().trim().isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code, cityKey } = req.body;

    try {
      const result = await prisma.$transaction(async (tx) => {
        const exchangeCode = await tx.exchangeCode.findUnique({
          where: { code }
        });

        if (!exchangeCode) {
          throw new Error('兑换码不存在');
        }

        if (exchangeCode.allowedTestTypes && Array.isArray(exchangeCode.allowedTestTypes) && exchangeCode.allowedTestTypes.length > 0) {
          if (!exchangeCode.allowedTestTypes.includes('city-report')) {
            throw new Error('该兑换码不适用于当前测试');
          }
        }

        if (exchangeCode.codeType === 'SINGLE_USE') {
          if (exchangeCode.used) {
            throw new Error('兑换码已被使用');
          }
          await tx.exchangeCode.update({
            where: { id: exchangeCode.id },
            data: { used: true, usedAt: new Date() }
          });
        } else if (exchangeCode.codeType === 'MONTHLY_CARD') {
          if (exchangeCode.expiresAt && new Date() > exchangeCode.expiresAt) {
            throw new Error('月卡已过期');
          }
          if (exchangeCode.useLimit !== null && exchangeCode.usedCount >= exchangeCode.useLimit) {
            throw new Error('月卡使用次数已达上限');
          }
          await tx.exchangeCode.update({
            where: { id: exchangeCode.id },
            data: { usedCount: { increment: 1 }, usedAt: new Date() }
          });
        }

        await tx.testResult.create({
          data: {
            testType: 'city-report',
            resultData: { cityKey: cityKey || 'shanghai', accessedAt: new Date().toISOString() },
            exchangeCodeId: exchangeCode.id
          }
        });

        return { 
          success: true, 
          message: '验证成功',
          codeType: exchangeCode.codeType 
        };
      });

      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

async function consumeCode(tx, code, testType) {
  const exchangeCode = await tx.exchangeCode.findUnique({
    where: { code }
  });

  if (!exchangeCode) {
    throw new Error('兑换码不存在');
  }

  if (exchangeCode.allowedTestTypes && Array.isArray(exchangeCode.allowedTestTypes) && exchangeCode.allowedTestTypes.length > 0) {
    if (!testType || !exchangeCode.allowedTestTypes.includes(testType)) {
      throw new Error('该兑换码不适用于当前测试');
    }
  }

  if (exchangeCode.codeType === 'SINGLE_USE') {
    if (exchangeCode.used) {
      throw new Error('兑换码已被使用');
    }
    await tx.exchangeCode.update({
      where: { id: exchangeCode.id },
      data: { used: true, usedAt: new Date() }
    });
  } else if (exchangeCode.codeType === 'MONTHLY_CARD') {
    if (exchangeCode.expiresAt && new Date() > exchangeCode.expiresAt) {
      throw new Error('月卡已过期');
    }
    if (exchangeCode.useLimit !== null && exchangeCode.usedCount >= exchangeCode.useLimit) {
      throw new Error('月卡使用次数已达上限');
    }
    await tx.exchangeCode.update({
      where: { id: exchangeCode.id },
      data: { usedCount: { increment: 1 }, usedAt: new Date() }
    });
  }

  return exchangeCode;
}

const TEST_TYPES = {
  'submit-test': 'mental-age',
  'submit-mbti': 'mbti',
  'submit-sbti': 'sbti',
  'submit-nbti': 'nbti',
  'submit-disc': 'disc',
  'submit-avoidant': 'avoidant',
  'submit-city': 'city',
  'submit-anxious': 'anxious'
};

const TEST_NAMES = {
  'submit-test': '心理年龄测试',
  'submit-mbti': 'MBTI测试',
  'submit-sbti': 'SBTI测试',
  'submit-nbti': 'NBTI恋爱测试',
  'submit-disc': 'DISC测试',
  'submit-avoidant': '回避型依恋测试',
  'submit-city': '性格匹配城市测试',
  'submit-anxious': '焦虑型依恋测试'
};

function createSubmitRoute(routePath, extraValidation = []) {
  router.post(
    routePath,
    submitTestLimiter,
    body('code').trim().isLength({ min: 8, max: 8 }).withMessage('兑换码格式错误'),
    ...extraValidation,
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const testType = TEST_TYPES[routePath.slice(1)];
      const testName = TEST_NAMES[routePath.slice(1)];
      const { code, resultData, rawAnswers } = req.body;

      try {
        const testConfig = await prisma.testConfig.findUnique({
          where: { typeKey: testType }
        });
        if (testConfig && !testConfig.enabled) {
          return res.status(400).json({ error: '该测试已禁用' });
        }

        const result = await prisma.$transaction(async (tx) => {
          const exchangeCode = await consumeCode(tx, code, testType);

          await tx.testResult.create({
            data: {
              testType,
              rawAnswers: rawAnswers || null,
              resultData: resultData || {},
              exchangeCodeId: exchangeCode.id
            }
          });

          return { success: true, message: '提交成功' };
        });

        console.log(`${testName}提交成功`);
        res.json(result);
      } catch (error) {
        console.error(`${testName}提交失败:`, error.message);
        res.status(400).json({ error: error.message });
      }
    }
  );
}

createSubmitRoute('/submit-test');
createSubmitRoute('/submit-mbti', [
  body('answers').optional().isArray(),
  body('realAge').optional().isInt({ min: 18, max: 150 })
]);
createSubmitRoute('/submit-sbti');
createSubmitRoute('/submit-nbti');
createSubmitRoute('/submit-disc');
createSubmitRoute('/submit-avoidant');
createSubmitRoute('/submit-city');
createSubmitRoute('/submit-anxious');

export default router;
