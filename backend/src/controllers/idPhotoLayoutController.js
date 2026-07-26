import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import config from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const UPLOADS_DIR = path.join(__dirname, '../../uploads');
const PHOTOS_DIR = path.join(UPLOADS_DIR, 'id-layout-photos');
const RESULTS_DIR = path.join(UPLOADS_DIR, 'id-layout-results');

[UPLOADS_DIR, PHOTOS_DIR, RESULTS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const PAPER_SIZE_NAMES = {
  '5inch': '五寸相纸',
  '6inch': '六寸相纸',
  '7inch': '七寸相纸',
  '8inch': '八寸相纸',
  '10inch': '十寸相纸',
  '12inch': '十二寸相纸',
  'A4': 'A4纸'
};

const PHOTO_SIZE_NAMES = {
  '1inch': '标准一寸',
  '2inch': '标准二寸',
  'small2inch': '小二寸',
  'big2inch': '大二寸',
  'small1inch': '小一寸',
  'big1inch': '大一寸',
  'visa': '签证照',
  'usVisa': '美国签证',
  'passport': '护照照',
  'idcard': '身份证'
};

async function validateAndConsumeExchangeCode(tx, code, testType) {
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
    const result = await tx.exchangeCode.updateMany({
      where: { 
        id: exchangeCode.id,
        used: false
      },
      data: { used: true, usedAt: new Date() }
    });
    
    if (result.count === 0) {
      throw new Error('兑换码已被使用');
    }
  } else if (exchangeCode.codeType === 'MONTHLY_CARD') {
    if (exchangeCode.expiresAt && new Date() > exchangeCode.expiresAt) {
      throw new Error('月卡已过期');
    }
    
    if (exchangeCode.useLimit === null) {
      await tx.exchangeCode.update({
        where: { id: exchangeCode.id },
        data: { usedCount: { increment: 1 }, usedAt: new Date() }
      });
    } else {
      const result = await tx.exchangeCode.updateMany({
        where: { 
          id: exchangeCode.id,
          usedCount: { lt: exchangeCode.useLimit }
        },
        data: { usedCount: { increment: 1 }, usedAt: new Date() }
      });
      
      if (result.count === 0) {
        throw new Error('月卡使用次数已达上限');
      }
    }
  }

  return exchangeCode;
}

export async function submitIdPhotoLayout(code, paperSize, photoSize, layoutCount, photoFile, layoutImageFile) {
  const paperName = PAPER_SIZE_NAMES[paperSize] || paperSize;
  const photoName = PHOTO_SIZE_NAMES[photoSize] || photoSize;
  console.log(`开始处理证件照排版: ${paperName} - ${photoName} - ${layoutCount}张`);

  let exchangeCode = null;
  await prisma.$transaction(async (tx) => {
    exchangeCode = await validateAndConsumeExchangeCode(tx, code, 'id-photo-layout');
  });

  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);

  // 保存原始照片
  const photoExt = path.extname(photoFile.originalname) || '.jpg';
  const photoFilename = `${timestamp}_${randomStr}${photoExt}`;
  const photoPath = path.join(PHOTOS_DIR, photoFilename);

  fs.writeFileSync(photoPath, photoFile.buffer);
  console.log(`原始照片已保存: ${photoFilename}`);

  // 保存排版后的图片
  let resultImagePath;
  if (layoutImageFile) {
    const layoutExt = path.extname(layoutImageFile.originalname) || '.png';
    const layoutFilename = `${timestamp}_${randomStr}_layout${layoutExt}`;
    const layoutPath = path.join(RESULTS_DIR, layoutFilename);

    fs.writeFileSync(layoutPath, layoutImageFile.buffer);
    console.log(`排版图片已保存: ${layoutFilename}`);

    resultImagePath = `/uploads/id-layout-results/${layoutFilename}`;
  } else {
    // 如果没有排版图片，使用原图路径（兼容旧版本）
    resultImagePath = `/uploads/id-layout-photos/${photoFilename}`;
    console.log(`未收到排版图片，使用原图路径`);
  }

  // 保存排版结果记录
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7天过期

  const result = await prisma.idPhotoLayoutResult.create({
    data: {
      paperSize,
      photoSize,
      layoutCount: parseInt(layoutCount),
      originalPhoto: `/uploads/id-layout-photos/${photoFilename}`,
      resultImage: resultImagePath,
      expiresAt,
      exchangeCodeId: exchangeCode.id
    }
  });

  console.log(`${paperName} - ${photoName} 排版结果保存成功`);

  return {
    success: true,
    message: '证件照排版完成',
    paperName,
    photoName,
    layoutCount,
    expiresIn: 7 * 24 * 60 * 60
  };
}

export { PAPER_SIZE_NAMES, PHOTO_SIZE_NAMES };
