-- 安全迁移脚本：从旧版本升级到新版本
-- 执行前请先备份数据库！

-- ============================================
-- 第一步：备份旧的 TestResult 数据到临时表
-- ============================================
CREATE TABLE "TestResult_backup" AS
SELECT
  id,
  "mentalAge",
  "realAge",
  "dimensionScores",
  "personalityType",
  archetype,
  "matchedCelebrity",
  keywords,
  "analysisText",
  "matchText",
  "createdAt",
  "exchangeCodeId"
FROM "TestResult";

-- ============================================
-- 第二步：为 ExchangeCode 添加新字段
-- ============================================
-- 添加 codeType 枚举类型
CREATE TYPE "CodeType" AS ENUM ('SINGLE_USE', 'MONTHLY_CARD');

-- 添加新字段（都有默认值，旧数据安全）
ALTER TABLE "ExchangeCode" ADD COLUMN "codeType" "CodeType" NOT NULL DEFAULT 'SINGLE_USE';
ALTER TABLE "ExchangeCode" ADD COLUMN "expiresAt" TIMESTAMP(3);
ALTER TABLE "ExchangeCode" ADD COLUMN "useLimit" INTEGER;
ALTER TABLE "ExchangeCode" ADD COLUMN "usedCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "ExchangeCode" ADD COLUMN remark TEXT;

-- 添加新索引
CREATE INDEX "ExchangeCode_codeType_idx" ON "ExchangeCode"("codeType");
CREATE INDEX "ExchangeCode_expiresAt_idx" ON "ExchangeCode"("expiresAt");

-- ============================================
-- 第三步：重建 TestResult 表（新结构）
-- ============================================
-- 删除旧表的外键约束
ALTER TABLE "TestResult" DROP CONSTRAINT "TestResult_exchangeCodeId_fkey";

-- 删除旧的唯一索引
DROP INDEX IF EXISTS "TestResult_exchangeCodeId_key";

-- 删除旧表
DROP TABLE "TestResult";

-- 创建新的 TestResult 表
CREATE TABLE "TestResult" (
    "id" SERIAL NOT NULL,
    "testType" TEXT NOT NULL,
    "rawAnswers" JSONB,
    "resultData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exchangeCodeId" INTEGER,

    CONSTRAINT "TestResult_pkey" PRIMARY KEY ("id")
);

-- 创建新索引
CREATE INDEX "TestResult_testType_idx" ON "TestResult"("testType");
CREATE INDEX "TestResult_createdAt_idx" ON "TestResult"("createdAt");
CREATE INDEX "TestResult_exchangeCodeId_idx" ON "TestResult"("exchangeCodeId");

-- 添加外键（不再是 unique）
ALTER TABLE "TestResult" ADD CONSTRAINT "TestResult_exchangeCodeId_fkey"
  FOREIGN KEY ("exchangeCodeId") REFERENCES "ExchangeCode"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- ============================================
-- 第四步：迁移旧的 TestResult 数据（可选）
-- ============================================
-- 将旧的 TestResult 数据转换为新的 JSON 格式并插入
INSERT INTO "TestResult" ("testType", "rawAnswers", "resultData", "createdAt", "exchangeCodeId")
SELECT
  'mental-age' as "testType",
  NULL as "rawAnswers",
  jsonb_build_object(
    'mentalAge', "mentalAge",
    'realAge', "realAge",
    'dimensionScores', "dimensionScores",
    'personalityType', "personalityType",
    'archetype', archetype,
    'matchedCelebrity', "matchedCelebrity",
    'keywords', keywords,
    'analysisText', "analysisText"::jsonb,
    'matchText', "matchText"::jsonb
  ) as "resultData",
  "createdAt",
  "exchangeCodeId"
FROM "TestResult_backup";

-- ============================================
-- 第五步：创建 TestConfig 表
-- ============================================
CREATE TABLE "TestConfig" (
    "id" SERIAL NOT NULL,
    "typeKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "page" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestConfig_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TestConfig_typeKey_key" ON "TestConfig"("typeKey");
CREATE INDEX "TestConfig_typeKey_idx" ON "TestConfig"("typeKey");
CREATE INDEX "TestConfig_enabled_idx" ON "TestConfig"("enabled");
CREATE INDEX "TestConfig_order_idx" ON "TestConfig"("order");

-- 插入默认测试配置
INSERT INTO "TestConfig" ("typeKey", "name", "page", "order", "updatedAt") VALUES
  ('mental-age', '心理年龄测试', 'index.html', 1, NOW()),
  ('mbti', 'MBTI性格测试', 'mbti.html', 2, NOW()),
  ('sbti', 'SBTI测试', 'sbti.html', 3, NOW()),
  ('nbti', 'NBTI恋爱测试', 'nbti.html', 4, NOW()),
  ('disc', 'DISC测试', 'DISC.html', 5, NOW()),
  ('avoidant', '回避型依恋测试', 'avoidant.html', 6, NOW()),
  ('city', '性格匹配城市测试', 'city.html', 7, NOW());

-- ============================================
-- 第六步：清理（确认迁移成功后执行）
-- ============================================
-- 确认数据迁移成功后，可以删除备份表
-- DROP TABLE IF EXISTS "TestResult_backup";

-- 或者保留备份表以便回滚
