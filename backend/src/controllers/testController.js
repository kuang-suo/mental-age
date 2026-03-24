import { PrismaClient } from '@prisma/client';
import {
  calculateDimensionScores,
  calculateMentalAge,
  determinePerssonalityType,
  generateKeywords,
  generateAnalysisText,
  generateMatchText,
  PERSONALITY_TYPES
} from '../utils/scoring.js';

const prisma = new PrismaClient();

export async function getQuestions() {
  const questions = await prisma.question.findMany({
    orderBy: { order: 'asc' }
  });
  return questions;
}

export async function validateCode(code) {
  const exchangeCode = await prisma.exchangeCode.findUnique({
    where: { code }
  });

  if (!exchangeCode) {
    throw new Error('兑换码不存在');
  }

  if (exchangeCode.used) {
    throw new Error('兑换码已被使用');
  }

  return { valid: true, code };
}

export async function submitTest(code, answers, realAge) {
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

    // 2. 计算得分和人格类型
    const dimensionScores = calculateDimensionScores(answers);
    const mentalAge = calculateMentalAge(dimensionScores);
    const personalityTypeId = determinePerssonalityType(dimensionScores);
    const personalityType = PERSONALITY_TYPES[personalityTypeId];
    const keywords = generateKeywords(dimensionScores);
    const analysisText = generateAnalysisText(mentalAge, realAge, dimensionScores, personalityTypeId);
    const matchText = generateMatchText(personalityTypeId);

    // 3. 保存测试结果
    const testResult = await tx.testResult.create({
      data: {
        mentalAge,
        realAge,
        dimensionScores,
        personalityType: personalityType.name,
        archetype: personalityType.archetype,
        matchedCelebrity: personalityType.celebrity,
        keywords,
        analysisText,
        matchText,
        exchangeCodeId: exchangeCode.id
      }
    });

    // 4. 标记兑换码为已使用
    await tx.exchangeCode.update({
      where: { id: exchangeCode.id },
      data: {
        used: true,
        usedAt: new Date()
      }
    });

    return {
      success: true,
      result: {
        mentalAge,
        realAge,
        dimensionScores,
        personalityType: personalityType.name,
        archetype: personalityType.archetype,
        matchedCelebrity: personalityType.celebrity,
        keywords,
        analysisText,  // 现在是对象: {coreTraits, blindSpots, growthAdvice}
        matchText      // 现在是对象: {socialType, socialStyle, bestMatch, relationshipReminder}
      }
    };
  });

  return result;
}
