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
          where: { code },
          include: {
            group: {
              select: { allowedTestTypes: true }
            }
          }
        });

        if (!exchangeCode) {
          throw new Error('兑换码不存在');
        }

        const allowedTestTypes = exchangeCode.group?.allowedTestTypes;
        if (allowedTestTypes && Array.isArray(allowedTestTypes) && allowedTestTypes.length > 0) {
          if (!allowedTestTypes.includes('city-report')) {
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
    where: { code },
    include: {
      group: {
        select: { allowedTestTypes: true }
      }
    }
  });

  if (!exchangeCode) {
    throw new Error('兑换码不存在');
  }

  const allowedTestTypes = exchangeCode.group?.allowedTestTypes;
  if (allowedTestTypes && Array.isArray(allowedTestTypes) && allowedTestTypes.length > 0) {
    if (!testType || !allowedTestTypes.includes(testType)) {
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
  'submit-anxious': 'anxious',
  'submit-love-depth': 'love-depth',
  'submit-secret-crush': 'secret-crush',
  'submit-lonely': 'lonely'
};

const TEST_NAMES = {
  'submit-test': '心理年龄测试',
  'submit-mbti': 'MBTI测试',
  'submit-sbti': 'SBTI测试',
  'submit-nbti': 'NBTI恋爱测试',
  'submit-disc': 'DISC测试',
  'submit-avoidant': '回避型依恋测试',
  'submit-city': '性格匹配城市测试',
  'submit-anxious': '焦虑型依恋测试',
  'submit-love-depth': '恋爱深度解析',
  'submit-secret-crush': '暗恋程度测试',
  'submit-lonely': '孤独程度测试'
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
createSubmitRoute('/submit-love-depth');
createSubmitRoute('/submit-secret-crush');
createSubmitRoute('/submit-lonely');

// 查询兑换码对应的所有测试结果
router.post(
  '/query-results',
  body('code').trim().isLength({ min: 8, max: 8 }).withMessage('兑换码格式错误'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code } = req.body;

    try {
      // 查找兑换码
      const exchangeCode = await prisma.exchangeCode.findUnique({
        where: { code },
        select: {
          id: true,
          code: true,
          codeType: true,
          createdAt: true
        }
      });

      if (!exchangeCode) {
        return res.status(400).json({ error: '兑换码不存在' });
      }

      // 查询所有关联的结果
      const [testResults, imageAnalysisResults, idPhotoResults, idPhotoLayoutResults] = await Promise.all([
        // 测试结果
        prisma.testResult.findMany({
          where: { exchangeCodeId: exchangeCode.id },
          select: {
            id: true,
            testType: true,
            resultData: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' }
        }),
        // 图片分析结果
        prisma.imageAnalysisResult.findMany({
          where: { exchangeCodeId: exchangeCode.id },
          select: {
            id: true,
            analysisType: true,
            originalPhoto: true,
            resultImage: true,
            expiresAt: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' }
        }),
        // 证件照结果
        prisma.idPhotoResult.findMany({
          where: { exchangeCodeId: exchangeCode.id },
          select: {
            id: true,
            gender: true,
            styleType: true,
            originalPhoto: true,
            resultImage: true,
            expiresAt: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' }
        }),
        // 证件照排版结果
        prisma.idPhotoLayoutResult.findMany({
          where: { exchangeCodeId: exchangeCode.id },
          select: {
            id: true,
            paperSize: true,
            photoSize: true,
            layoutCount: true,
            originalPhoto: true,
            resultImage: true,
            expiresAt: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' }
        })
      ]);

      // 测试类型名称映射
      const testTypeNames = {
        'mental-age': '心理年龄测试',
        'mbti': 'MBTI性格测试',
        'sbti': 'SBTI测试',
        'nbti': 'NBTI恋爱测试',
        'disc': 'DISC测试',
        'avoidant': '回避型依恋测试',
        'city': '性格匹配城市测试',
        'anxious': '焦虑型依恋测试',
        'love-depth': '恋爱深度解析',
        'secret-crush': '暗恋程度测试',
        'lonely': '孤独程度测试',
        'city-report': '城市深度调研报告'
      };

      // 图片分析类型名称映射
      const analysisTypeNames = {
        '1': '发型设计建议',
        '2': '妆容风格分析',
        '3': '穿搭风格建议',
        '4': '色彩搭配分析',
        '5': '面部特征分析',
        '6': '整体形象评分',
        '7': '职场形象建议',
        '8': '休闲穿搭建议',
        '9': '约会形象建议',
        '10': '眼镜/配饰建议',
        '11': '护肤建议',
        '12': '整体改造方案'
      };

      // 证件照风格名称映射
      const styleTypeNames = {
        '1': '高智感职业照',
        '2': '蓝色背景2寸照',
        '3': '韩式风格'
      };

      // 格式化测试结果
      const formattedTestResults = testResults.map(result => ({
        id: result.id,
        type: 'test',
        typeName: testTypeNames[result.testType] || result.testType,
        testType: result.testType,
        resultData: result.resultData,
        createdAt: result.createdAt
      }));

      // 格式化图片分析结果
      const formattedImageResults = imageAnalysisResults.map(result => ({
        id: result.id,
        type: 'imageAnalysis',
        typeName: analysisTypeNames[result.analysisType] || `分析类型${result.analysisType}`,
        analysisType: result.analysisType,
        resultImage: result.resultImage,
        originalPhoto: result.originalPhoto,
        expiresAt: result.expiresAt,
        createdAt: result.createdAt,
        isExpired: new Date() > result.expiresAt
      }));

      // 格式化证件照结果
      const formattedIdPhotoResults = idPhotoResults.map(result => ({
        id: result.id,
        type: 'idPhoto',
        typeName: styleTypeNames[result.styleType] || `风格${result.styleType}`,
        styleType: result.styleType,
        gender: result.gender,
        resultImage: result.resultImage,
        originalPhoto: result.originalPhoto,
        expiresAt: result.expiresAt,
        createdAt: result.createdAt,
        isExpired: new Date() > result.expiresAt
      }));

      // 格式化证件照排版结果
      const formattedLayoutResults = idPhotoLayoutResults.map(result => ({
        id: result.id,
        type: 'idPhotoLayout',
        typeName: '证件照排版',
        paperSize: result.paperSize,
        photoSize: result.photoSize,
        layoutCount: result.layoutCount,
        resultImage: result.resultImage,
        originalPhoto: result.originalPhoto,
        expiresAt: result.expiresAt,
        createdAt: result.createdAt,
        isExpired: new Date() > result.expiresAt
      }));

      // 合并所有结果并按时间排序
      const allResults = [
        ...formattedTestResults,
        ...formattedImageResults,
        ...formattedIdPhotoResults,
        ...formattedLayoutResults
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      res.json({
        success: true,
        code: exchangeCode.code,
        codeType: exchangeCode.codeType,
        totalResults: allResults.length,
        results: allResults
      });

    } catch (error) {
      console.error('查询兑换码结果失败:', error.message);
      res.status(500).json({ error: '查询失败，请稍后重试' });
    }
  }
);

export default router;
