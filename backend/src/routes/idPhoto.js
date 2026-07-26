import express from 'express';
import multer from 'multer';
import { body, validationResult } from 'express-validator';
import { submitIdPhoto } from '../controllers/idPhotoController.js';
import { submitIdPhotoLayout } from '../controllers/idPhotoLayoutController.js';
import { submitTestLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('只支持 JPG、PNG、WEBP 格式的图片'));
    }
  }
});

router.post(
  '/submit-id-photo',
  submitTestLimiter,
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'customTemplate', maxCount: 1 }
  ]),
  [
    body('code').trim().isLength({ min: 8, max: 8 }).withMessage('兑换码格式错误'),
    body('size').trim().isIn(['1寸', '2寸', '小2寸']).withMessage('请选择尺寸'),
    body('background').trim().isIn(['white', 'blue', 'red', 'darkblue', 'gray']).withMessage('请选择背景色'),
    body('template').trim().notEmpty().withMessage('请选择服装模板')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.files || !req.files.photo || !req.files.photo[0]) {
      return res.status(400).json({ error: '请上传照片' });
    }

    const { code, size, background, template } = req.body;
    const photoFile = req.files.photo[0];
    const customTemplateFile = req.files.customTemplate ? req.files.customTemplate[0] : null;

    try {
      const result = await submitIdPhoto(code, size, background, template, photoFile, customTemplateFile);
      res.json(result);
    } catch (error) {
      console.error('证件照生成失败:', error.message);
      res.status(400).json({ error: error.message });
    }
  }
);

// 证件照排版接口
router.post(
  '/submit-id-photo-layout',
  submitTestLimiter,
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'layoutImage', maxCount: 1 }
  ]),
  [
    body('code').trim().isLength({ min: 8, max: 8 }).withMessage('兑换码格式错误'),
    body('paperSize').trim().isIn(['5inch', '6inch', '7inch', '8inch', '10inch', '12inch', 'A4']).withMessage('请选择相纸尺寸'),
    body('photoSize').trim().isIn(['1inch', '2inch', 'small2inch', 'big2inch', 'small1inch', 'big1inch', 'visa', 'usVisa', 'passport', 'idcard']).withMessage('请选择照片尺寸'),
    body('layoutCount').isInt({ min: 1 }).withMessage('排版数量错误')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.files || !req.files.photo || !req.files.photo[0]) {
      return res.status(400).json({ error: '请上传照片' });
    }

    const { code, paperSize, photoSize, layoutCount } = req.body;
    const photoFile = req.files.photo[0];
    const layoutImageFile = req.files.layoutImage ? req.files.layoutImage[0] : null;

    try {
      const result = await submitIdPhotoLayout(code, paperSize, photoSize, layoutCount, photoFile, layoutImageFile);
      res.json(result);
    } catch (error) {
      console.error('证件照排版失败:', error.message);
      res.status(400).json({ error: error.message });
    }
  }
);

// 证件照压缩接口
router.post(
  '/submit-id-photo-compress',
  submitTestLimiter,
  [
    body('code').trim().isLength({ min: 8, max: 8 }).withMessage('兑换码格式错误'),
    body('resultData').isObject().withMessage('结果数据格式错误')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code, resultData } = req.body;

    try {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();

      // 验证兑换码
      const exchangeCode = await prisma.exchangeCode.findUnique({
        where: { code }
      });

      if (!exchangeCode) {
        await prisma.$disconnect();
        return res.status(400).json({ error: '兑换码不存在' });
      }

      if (exchangeCode.isUsed && exchangeCode.codeType !== 'MONTHLY_CARD') {
        await prisma.$disconnect();
        return res.status(400).json({ error: '兑换码已使用' });
      }

      if (exchangeCode.expiresAt && new Date() > exchangeCode.expiresAt) {
        await prisma.$disconnect();
        return res.status(400).json({ error: '兑换码已过期' });
      }

      // 保存测试结果
      const testResult = await prisma.testResult.create({
        data: {
          testType: 'id-photo-compress',
          resultData: resultData,
          exchangeCodeId: exchangeCode.id
        }
      });

      // 如果是单次码，标记为已使用
      if (exchangeCode.codeType !== 'MONTHLY_CARD') {
        await prisma.exchangeCode.update({
          where: { code },
          data: { isUsed: true }
        });
      }

      await prisma.$disconnect();
      res.json({ success: true, resultId: testResult.id });
    } catch (error) {
      console.error('证件照压缩结果保存失败:', error.message);
      res.status(400).json({ error: error.message });
    }
  }
);

export default router;
