import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import config from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const UPLOADS_DIR = path.join(__dirname, '../../uploads');
const PHOTOS_DIR = path.join(UPLOADS_DIR, 'photos');
const RESULTS_DIR = path.join(UPLOADS_DIR, 'results');

[UPLOADS_DIR, PHOTOS_DIR, RESULTS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const ANALYSIS_PROMPTS = {
  '1': '请根据我上传的人像照片，做一套个人形象分析图卡，包含发型、妆容、色彩和珠宝。要求：保留五官脸型肤色，不要过度修图，所有变化在同一张脸真实展示，风格干净高级。发型：长短、卷直、刘海，对比最适合/普通/不建议（显脸小、显老）。妆容：眉眼鼻唇分析，标签（自然、提气色、柔和）。色彩：不同颜色上身，对比推荐/普通/不适合（显白、显老）。珠宝：珍珠、翡翠、红蓝宝、钻石、黄金，对比推荐/普通/不建议。整体：视觉为主，文字简短。',
  
  '2': '请根据我上传的人像照片，制作一张高质感个人穿搭分析图卡，穿搭风格例如韩系，街头，茶系，时髦，小香，温柔，辣妹，小众，复古，学院，运动风。保留主角原本五官、肤色、脸型与真实特征，透过左右或并排对比方式，展示不同服装穿在主角身上的效果，清楚区分「风格」，让人一眼看出哪些造型、提升气色与整体质感。版面设计需干净时尚、像专业形象顾问报告，整体以视觉呈现为主，只使用简短标签（例如：推荐、普通、避免），不要加入长段文字。高分辨率，信息清楚，适合社群分享。',
  
  '3': '请根据我上传的人像照片，制作一张高质感「妆容分析指南」信息图表，图片需要专业，整体为中文版本，风格干净时尚、像美妆杂志专栏。以上传的图片也就是原人物五官要基础，保留真实长相与辨识度，不过度修图。版面采视觉优先设计，重点用图象呈现，文字精简，不要长段落，成果图片要适合社群分享',
  
  '4': '请根据我上传的人像照片，制作一张高质感个人发型分析图卡。保留主角原本五官、脸型与真实特征，透过左右或并排对比方式，展示不同发型套用在主角身上的效果，清楚区分「最适合」、「普通」与「不建议」发型，让人一眼看出哪些发型最修饰脸型、提升气质与整体颜值。可比较长发、短发、浏海、卷发、直发、层次剪裁、绑发造型等。版面设计需干净时尚、像专业造型顾问报告，整体以视觉呈现为主，只使用简短标签，不要加入长段文字。高解析度，资讯清楚，适合社群分享。',
  
  '5': '请根据我上传的人像照片，帮我制作一张高质感个人色彩分析图卡。请保留主角原本五官、肤色、脸型与真实特征，透过左右或并排对比方式，展示不同服装颜色穿在主角身上的效果，清楚区分「适合色」与「不适合色」，让人一眼看出哪些颜色最衬肤色、提升气色与整体质感。版面设计需干净时尚、像专业形象顾问报告，整体以视觉呈现为主，只使用简短标签（例如：推荐、普通、避免），不要加入长段文字。产出的图片需要高分辨率，专业且信息清楚，适合社群分享。一定要准确我想知道我适合什么风格',
  
  '6': '请根据我上传的人像照片，制作一张高质感「气质风格定位分析指南」信息图表，图片需要专业，整体为中文版本，风格干净时尚、像美妆杂志专栏。以上传的图片也就是原人物五官要基础，保留真实长相与辨识度，不过度修图。版面采视觉优先设计，重点用图象呈现，文字精简，不要长段落，成果图片要适合社群分享',
  
  '7': '请根据我上传的人像照片，制作一张高质感「五官风格拆解-高级版脸部分析指南」如眼型（圆润/杏眼/下垂/上扬）、鼻型（存在感/立体度）、唇型（厚薄/亲和力）、面部留白&比例信息图表，图片需要专业，整体为中文版本，风格干净时尚、像美妆杂志专栏。以上传的图片也就是原人物五官要基础，保留真实长相与辨识度，不过度修图。版面采视觉优先设计，重点用图象呈现，文字精简，不要长段落，成果图片要适合社群分享',
  
  '8': '请根据我上传的人像照片，制作一张高质感「显瘦&显脸小策略分析指南」如发型如何修饰脸宽/脸短、领口（方领/V领/圆领）影响、耳饰、项链长度如何改变脸型比例信息图表，图片需要专业，整体为中文版本，风格干净时尚、像美妆杂志专栏。以上传的图片也就是原人物五官要基础，保留真实长相与辨识度，不过度修图。版面采视觉优先设计，重点用图象呈现，文字精简，不要长段落，成果图片要适合社群分享',
  
  '9': '请根据我上传的人像照片，制作一张高质感「拍照表现力分析」如最适合角度（正脸/45°/侧脸）、表情（甜笑/冷脸/微笑）、光线（柔光/侧光）信息图表，图片需要专业，整体为中文版本，风格干净时尚、像美妆杂志专栏。以上传的图片也就是原人物五官要基础，保留真实长相与辨识度，不过度修图。版面采视觉优先设计，重点用图象呈现，文字精简，不要长段落，成果图片要适合社群分享',
  
  '10': '请根据我上传的人像照片，制作一张高质感「个人品牌感分析」如视觉统一风格（滤镜/色调/氛围）、人设定位（邻家感/温柔姐姐/甜妹/高级感）信息图表，图片需要专业，整体为中文版本，风格干净时尚、像美妆杂志专栏。以上传的图片也就是原人物五官要基础，保留真实长相与辨识度，不过度修图。版面采视觉优先设计，重点用图象呈现，文字精简，不要长段落，成果图片要适合社群分享',
  
  '11': '请根据我上传的人像照片，制作一张高质感「体型&比例分析指南」如判断比例（上长下短/五五分）、显高穿搭、显瘦重点区域信息图表，图片需要专业，整体为中文版本，风格干净时尚、像美妆杂志专栏。以上传的图片也就是原人物五官要基础，保留真实长相与辨识度，不过度修图。版面采视觉优先设计，重点用图象呈现，文字精简，不要长段落，成果图片要适合社群分享',
  
  '12': '请根据我上传的人像照片，制作一张高质感个人发色分析图卡。保留主角原本五官、脸型与真实特征，透过左右或并排对比方式，展示不同发色套用在主角身上的效果，清楚区分「最适合」、「普通」与「不建议」发色，让人一眼看出哪些发型最适合肤色、提升气质与整体颜值。可比较黑色、褐色、黄色、橙色、蓝色、绿色、巴黎画染、挑染、金色、红色、灰色等等。版面设计需干净时尚、像专业造型顾问报告，整体以视觉呈现为主，只使用简短标签，不要加入长段文字。高分辨率，资讯清楚，适合社群分享。'
};

const ANALYSIS_NAMES = {
  '1': '综合形象分析',
  '2': '穿搭分析',
  '3': '妆容分析',
  '4': '发型分析',
  '5': '色彩分析',
  '6': '气质风格定位分析',
  '7': '五官风格拆解',
  '8': '显瘦显脸小策略',
  '9': '拍照表现力分析',
  '10': '个人品牌感分析',
  '11': '体型比例分析',
  '12': '发色分析'
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

  return exchangeCode;
}

async function callImageAPI(imagePublicUrl, analysisType) {
  const prompt = ANALYSIS_PROMPTS[analysisType];
  if (!prompt) {
    throw new Error('无效的分析类型');
  }

  console.log(`调用图片生成API，图片URL: ${imagePublicUrl}`);

  const response = await fetch(`${config.imageAnalysis.apiUrl}/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.imageAnalysis.apiKey}`
    },
    body: JSON.stringify({
      model: config.imageAnalysis.model,
      prompt: prompt,
      size: '1520x1904',
      quality: 'high',
      response_format: 'url',
      output_format: 'png',
      background: 'auto',
      moderation: 'auto',
      image: [imagePublicUrl]
    })
  });

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

export async function submitImageAnalysis(code, analysisType, photoFile) {
  const analysisName = ANALYSIS_NAMES[analysisType] || `类型${analysisType}`;
  console.log(`开始处理图片分析: ${analysisName}`);
  
  let exchangeCode = null;
  await prisma.$transaction(async (tx) => {
    exchangeCode = await validateAndConsumeExchangeCode(tx, code, 'image-analysis');
  });
  
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const photoExt = path.extname(photoFile.originalname) || '.jpg';
  const photoFilename = `${timestamp}_${randomStr}${photoExt}`;
  const photoPath = path.join(PHOTOS_DIR, photoFilename);
  
  fs.writeFileSync(photoPath, photoFile.buffer);
  console.log(`照片已保存: ${photoFilename}`);
  
  const photoPublicUrl = `${config.imageAnalysis.serverUrl}/uploads/photos/${photoFilename}`;
  console.log(`照片公开URL: ${photoPublicUrl}`);
  
  let resultImageUrl = null;
  let resultImagePath = null;
  
  try {
    resultImageUrl = await callImageAPI(photoPublicUrl, analysisType);
    console.log(`API返回图片URL: ${resultImageUrl}`);
    
    const resultFilename = `${timestamp}_${randomStr}_result.jpg`;
    resultImagePath = path.join(RESULTS_DIR, resultFilename);
    
    await downloadImage(resultImageUrl, resultImagePath);
    console.log(`结果图片已保存: ${resultFilename}`);
    
    resultImageUrl = `/uploads/results/${resultFilename}`;
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
  
  await prisma.imageAnalysisResult.create({
    data: {
      analysisType,
      originalPhoto: `/uploads/photos/${photoFilename}`,
      resultImage: resultImageUrl,
      expiresAt,
      exchangeCodeId: exchangeCode.id
    }
  });
  
  console.log(`${analysisName}提交成功`);
  
  return {
    success: true,
    message: '分析完成',
    resultImageUrl,
    analysisName,
    expiresIn: config.imageAnalysis.photoExpireDays * 24 * 60 * 60
  };
}

export { ANALYSIS_NAMES };
