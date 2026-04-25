import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getQuestions() {
  const questions = await prisma.question.findMany({
    orderBy: { order: 'asc' }
  });
  return questions;
}

export async function validateCode(code, testType) {
  const exchangeCode = await prisma.exchangeCode.findUnique({
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
  } else if (exchangeCode.codeType === 'MONTHLY_CARD') {
    if (exchangeCode.expiresAt && new Date() > exchangeCode.expiresAt) {
      throw new Error('月卡已过期');
    }
    if (exchangeCode.useLimit !== null && exchangeCode.usedCount >= exchangeCode.useLimit) {
      throw new Error('月卡使用次数已达上限');
    }
  }

  return { valid: true, code, codeType: exchangeCode.codeType };
}

export async function submitTest(code, answers, realAge) {
  const result = await prisma.$transaction(async (tx) => {
    const exchangeCode = await tx.exchangeCode.findUnique({
      where: { code }
    });

    if (!exchangeCode) {
      throw new Error('兑换码不存在');
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

    return { success: true };
  });

  return result;
}
