import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import config from '../config/env.js';

const prisma = new PrismaClient();

// 生成随机兑换码
function generateRandomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function login(username, password) {
  const admin = await prisma.admin.findUnique({
    where: { username }
  });

  if (!admin) {
    throw new Error('用户名或密码错误');
  }

  const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
  if (!isPasswordValid) {
    throw new Error('用户名或密码错误');
  }

  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    config.jwt.secret,
    { expiresIn: '24h' }
  );

  return { token };
}

export async function generateCodes(count) {
  if (count < 1 || count > 100) {
    throw new Error('生成数量必须在1-100之间');
  }

  const codes = [];
  const existingCodes = new Set();

  // 获取已存在的码
  const existing = await prisma.exchangeCode.findMany({
    select: { code: true }
  });
  existing.forEach(item => existingCodes.add(item.code));

  // 生成新码
  while (codes.length < count) {
    const code = generateRandomCode();
    if (!existingCodes.has(code)) {
      codes.push(code);
      existingCodes.add(code);
    }
  }

  // 批量插入
  const created = await prisma.exchangeCode.createMany({
    data: codes.map(code => ({ code }))
  });

  return {
    count: created.count,
    codes
  };
}

export async function getCodes(page = 1, limit = 50) {
  const skip = (page - 1) * limit;

  const [codes, total] = await Promise.all([
    prisma.exchangeCode.findMany({
      skip,
      take: limit,
      include: {
        testResult: {
          select: {
            mentalAge: true,
            realAge: true,
            personalityType: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.exchangeCode.count()
  ]);

  return {
    codes,
    total,
    page,
    pages: Math.ceil(total / limit)
  };
}

export async function exportCodes() {
  const codes = await prisma.exchangeCode.findMany({
    include: {
      testResult: {
        select: {
          mentalAge: true,
          realAge: true,
          personalityType: true,
          createdAt: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // 生成CSV内容
  const headers = ['兑换码', '状态', '使用时间', '心理年龄', '实际年龄', '人格类型', '创建时间'];
  const rows = codes.map(code => [
    code.code,
    code.used ? '已使用' : '未使用',
    code.usedAt ? new Date(code.usedAt).toLocaleString('zh-CN') : '-',
    code.testResult?.mentalAge || '-',
    code.testResult?.realAge || '-',
    code.testResult?.personalityType || '-',
    new Date(code.createdAt).toLocaleString('zh-CN')
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csv;
}
