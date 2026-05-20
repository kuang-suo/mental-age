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

async function cleanupExpiredFiles() {
  console.log('开始清理过期文件...');
  
  try {
    const expiredResults = await prisma.imageAnalysisResult.findMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
    
    let deletedCount = 0;
    
    for (const result of expiredResults) {
      try {
        const photoPath = path.join(UPLOADS_DIR, '..', result.originalPhoto);
        if (fs.existsSync(photoPath)) {
          fs.unlinkSync(photoPath);
          deletedCount++;
        }
      } catch (err) {
        console.error(`删除照片失败: ${result.originalPhoto}`, err.message);
      }
      
      try {
        const resultPath = path.join(UPLOADS_DIR, '..', result.resultImage);
        if (fs.existsSync(resultPath)) {
          fs.unlinkSync(resultPath);
          deletedCount++;
        }
      } catch (err) {
        console.error(`删除结果图片失败: ${result.resultImage}`, err.message);
      }
    }
    
    const deleteResult = await prisma.imageAnalysisResult.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
    
    console.log(`清理完成: 删除 ${deletedCount} 个文件, ${deleteResult.count} 条数据库记录`);
  } catch (error) {
    console.error('清理过期文件失败:', error.message);
  }
}

function startCleanupScheduler() {
  cleanupExpiredFiles();
  
  setInterval(() => {
    cleanupExpiredFiles();
  }, 24 * 60 * 60 * 1000);
  
  console.log('文件清理调度器已启动，每24小时执行一次');
}

export { cleanupExpiredFiles, startCleanupScheduler };
