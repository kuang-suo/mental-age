import express from 'express';
import multer from 'multer';
import { body, validationResult } from 'express-validator';
import { submitImageAnalysis } from '../controllers/imageAnalysisController.js';
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
  '/submit-image-analysis',
  submitTestLimiter,
  upload.single('photo'),
  [
    body('code').trim().isLength({ min: 8, max: 8 }).withMessage('兑换码格式错误'),
    body('analysisType').trim().isIn(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']).withMessage('无效的分析类型')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ error: '请上传照片' });
    }

    const { code, analysisType } = req.body;

    try {
      const result = await submitImageAnalysis(code, analysisType, req.file);
      res.json(result);
    } catch (error) {
      console.error('图片分析失败:', error.message);
      res.status(400).json({ error: error.message });
    }
  }
);

export default router;
