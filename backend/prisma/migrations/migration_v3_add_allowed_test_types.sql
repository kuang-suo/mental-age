-- 为 ExchangeCode 添加 allowedTestTypes 字段（使用范围）
-- null 表示通用（所有测试可用），JSON 数组表示限定的测试类型列表
-- 示例: ["mental-age", "mbti"] 表示该兑换码只能用于心理年龄测试和MBTI测试

ALTER TABLE "ExchangeCode" ADD COLUMN "allowedTestTypes" JSONB;
