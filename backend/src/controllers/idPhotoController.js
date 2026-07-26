import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import config from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const UPLOADS_DIR = path.join(__dirname, '../../uploads');
const PHOTOS_DIR = path.join(UPLOADS_DIR, 'id-photos');
const RESULTS_DIR = path.join(UPLOADS_DIR, 'id-results');

[UPLOADS_DIR, PHOTOS_DIR, RESULTS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const SIZE_NAMES = {
  '1寸': '1寸证件照',
  '2寸': '2寸证件照',
  '小2寸': '小2寸证件照'
};

// 证件照尺寸映射（像素）- 根据用户要求：尺寸乘以64
const SIZE_PIXELS = {
  '1寸': { width: 1600, height: 2240 },    // 25mm × 35mm → 25*64=1600, 35*64=2240
  '2寸': { width: 2240, height: 3136 },    // 35mm × 49mm → 35*64=2240, 49*64=3136
  '小2寸': { width: 2112, height: 3072 }   // 33mm × 48mm → 33*64=2112, 48*64=3072
};

const BACKGROUND_NAMES = {
  'white': '白色背景',
  'blue': '蓝色背景',
  'red': '红色背景',
  'darkblue': '深蓝色背景',
  'gray': '灰色背景'
};

const BACKGROUND_COLORS = {
  'white': '白色',
  'blue': '浅蓝色',
  'red': '红色',
  'darkblue': '深蓝色',
  'gray': '灰色'
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

async function callImageAPI(imagePublicUrl, size, background, template, customTemplateUrl = null) {
  const backgroundColor = BACKGROUND_COLORS[background] || '浅蓝色';
  
  // 生成提示词
    let prompt = `请把我这张自拍照，生成${size}证件照正面照，背景为标准证件照的${backgroundColor}底，人像清晰、无阴影，头部占画面比例合适，整体符合标准证件照规范，保留五官脸型，保持自然肤色。`;
  // let prompt = `请把我这张自拍正脸照，${size}证件照正面照，背景为标准证件照的${backgroundColor}底，人像清晰、无阴影，头部占画面比例合适，整体符合标准证件照规范，保留五官脸型，不要过度修图，保持自然肤色。`;
  
  // 准备图片数组
  let imageUrls = [imagePublicUrl];

  // 如果选择了服装模板,添加服装替换的提示和模板图片
  if (template && template !== 'none') {
    prompt += ` 请参考服装模板图片,将服装替换为模板中的服装。`;

    // 获取服装模板的公开URL
    let templateUrl;
    if (template === 'custom' && customTemplateUrl) {
      // 使用自定义上传的模板
      templateUrl = customTemplateUrl;
    } else {
      // 使用预设模板
      templateUrl = `${config.imageAnalysis.serverUrl}/id-fhoto-image/${template}.png`;
    }

    // 将模板图片放在第一位，用户照片放在第二位
    imageUrls = [templateUrl, imagePublicUrl];
  }

  // 根据尺寸获取对应的像素尺寸
  const sizePixels = SIZE_PIXELS[size] || SIZE_PIXELS['1寸'];
  const imageSize = `${sizePixels.width}x${sizePixels.height}`;

  console.log(`调用图片生成API，图片URL: ${imagePublicUrl}, 尺寸: ${size}, 像素: ${imageSize}, 背景: ${background}, 模板: ${template}`);
  console.log(`图片数组:`, imageUrls);

  // 设置超时时间为10分钟（图片生成需要较长时间）
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
    console.log('API请求超时，已取消请求');
  }, 10 * 60 * 1000); // 10分钟超时

  try {
    const response = await fetch(`${config.imageAnalysis.apiUrl}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.imageAnalysis.apiKey}`
      },
      body: JSON.stringify({
        model: config.imageAnalysis.model,
        prompt: prompt,
        size: imageSize,
        quality: 'high',
        response_format: 'url',
        output_format: 'png',
        background: 'auto',
        moderation: 'auto',
        image: imageUrls
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API调用失败: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('API返回结果:', JSON.stringify(result, null, 2));

    if (result.data && result.data[0] && result.data[0].url) {
      return result.data[0].url;
    }

    if (result.url) {
      return result.url;
    }

    throw new Error('API返回格式异常，无法获取图片URL');
  } catch (error) {
    clearTimeout(timeoutId);
    
    // 处理超时错误
    if (error.name === 'AbortError') {
      throw new Error('API请求超时（超过10分钟），请稍后重试');
    }
    
    // 处理网络错误
    if (error.name === 'TypeError' && error.message.includes('fetch failed')) {
      console.error('Fetch错误详情:', error.message);
      console.error('Fetch错误类型:', error.name);
      if (error.cause) {
        console.error('Fetch错误原因:', JSON.stringify(error.cause));
      }
      throw new Error(`API网络请求失败: ${error.message}。请检查服务器是否能访问 ${config.imageAnalysis.apiUrl}`);
    }
    
    throw error;
  }
}

async function downloadImage(url, savePath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`下载图片失败: ${response.status}`);
  }
  
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(savePath, buffer);
}

export async function submitIdPhoto(code, size, background, template, photoFile, customTemplateFile = null) {
  const sizeName = SIZE_NAMES[size] || size;
  const backgroundName = BACKGROUND_NAMES[background] || background;
  console.log(`开始处理证件照生成: ${sizeName} - ${backgroundName} - 模板: ${template}`);
  
  let exchangeCode = null;
  await prisma.$transaction(async (tx) => {
    exchangeCode = await validateAndConsumeExchangeCode(tx, code, 'id-photo');
  });
  
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const photoExt = path.extname(photoFile.originalname) || '.jpg';
  const photoFilename = `${timestamp}_${randomStr}${photoExt}`;
  const photoPath = path.join(PHOTOS_DIR, photoFilename);

  fs.writeFileSync(photoPath, photoFile.buffer);
  console.log(`照片已保存: ${photoFilename}`);

  const photoPublicUrl = `${config.imageAnalysis.serverUrl}/uploads/id-photos/${photoFilename}`;
  console.log(`照片公开URL: ${photoPublicUrl}`);

  // 处理自定义模板文件
  let customTemplatePublicUrl = null;
  if (template === 'custom' && customTemplateFile) {
    const templateExt = path.extname(customTemplateFile.originalname) || '.png';
    const templateFilename = `${timestamp}_${randomStr}_template${templateExt}`;
    const templatePath = path.join(PHOTOS_DIR, templateFilename);

    fs.writeFileSync(templatePath, customTemplateFile.buffer);
    console.log(`自定义模板已保存: ${templateFilename}`);

    customTemplatePublicUrl = `${config.imageAnalysis.serverUrl}/uploads/id-photos/${templateFilename}`;
    console.log(`自定义模板公开URL: ${customTemplatePublicUrl}`);
  }

  let resultImageUrl = null;
  let resultImagePath = null;

  try {
    resultImageUrl = await callImageAPI(photoPublicUrl, size, background, template, customTemplatePublicUrl);
    console.log(`API返回图片URL: ${resultImageUrl}`);
    
    const resultFilename = `${timestamp}_${randomStr}_result.jpg`;
    resultImagePath = path.join(RESULTS_DIR, resultFilename);
    
    await downloadImage(resultImageUrl, resultImagePath);
    console.log(`结果图片已保存: ${resultFilename}`);
    
    resultImageUrl = `/uploads/id-results/${resultFilename}`;
  } catch (error) {
    console.error(`图片生成失败: ${error.message}`);
    fs.unlinkSync(photoPath);
    
    console.log('API调用失败，恢复兑换码...');
    await prisma.$transaction(async (tx) => {
      if (exchangeCode.codeType === 'SINGLE_USE') {
        await tx.exchangeCode.update({
          where: { id: exchangeCode.id },
          data: { used: false, usedAt: null }
        });
      } else if (exchangeCode.codeType === 'MONTHLY_CARD') {
        await tx.exchangeCode.update({
          where: { id: exchangeCode.id },
          data: { usedCount: { decrement: 1 } }
        });
      }
    });
    
    throw new Error(`图片生成失败: ${error.message}`);
  }
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + config.imageAnalysis.photoExpireDays);
  
  await prisma.idPhotoResult.create({
    data: {
      gender: 'unknown',
      styleType: template || 'none',
      originalPhoto: `/uploads/id-photos/${photoFilename}`,
      resultImage: resultImageUrl,
      expiresAt,
      exchangeCodeId: exchangeCode.id
    }
  });
  
  console.log(`${sizeName} - ${backgroundName}提交成功`);
  
  return {
    success: true,
    message: '证件照生成完成',
    resultImageUrl,
    sizeName,
    backgroundName,
    template,
    expiresIn: config.imageAnalysis.photoExpireDays * 24 * 60 * 60
  };
}

export { SIZE_NAMES, BACKGROUND_NAMES };
