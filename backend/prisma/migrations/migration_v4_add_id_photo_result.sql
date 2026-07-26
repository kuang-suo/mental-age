-- 创建证件照生成结果表
CREATE TABLE "IdPhotoResult" (
    "id" SERIAL NOT NULL,
    "gender" TEXT NOT NULL,
    "styleType" TEXT NOT NULL,
    "originalPhoto" TEXT NOT NULL,
    "resultImage" TEXT NOT NULL,
    "expiresAt" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exchangeCodeId" INTEGER,
    PRIMARY KEY ("id")
);

-- 添加外键约束
ALTER TABLE "IdPhotoResult" ADD CONSTRAINT "IdPhotoResult_exchangeCodeId_fkey"
    FOREIGN KEY ("exchangeCodeId") REFERENCES "ExchangeCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- 创建索引
CREATE INDEX "IdPhotoResult_gender_idx" ON "IdPhotoResult"("gender");
CREATE INDEX "IdPhotoResult_styleType_idx" ON "IdPhotoResult"("styleType");
CREATE INDEX "IdPhotoResult_expiresAt_idx" ON "IdPhotoResult"("expiresAt");
CREATE INDEX "IdPhotoResult_exchangeCodeId_idx" ON "IdPhotoResult"("exchangeCodeId");
