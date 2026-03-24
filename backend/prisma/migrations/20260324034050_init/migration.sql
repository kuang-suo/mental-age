-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "dimension" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExchangeCode" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(8) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExchangeCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestResult" (
    "id" SERIAL NOT NULL,
    "mentalAge" INTEGER NOT NULL,
    "realAge" INTEGER NOT NULL,
    "dimensionScores" JSONB NOT NULL,
    "personalityType" TEXT NOT NULL,
    "archetype" TEXT NOT NULL,
    "matchedCelebrity" TEXT NOT NULL,
    "keywords" JSONB NOT NULL,
    "analysisText" TEXT NOT NULL,
    "matchText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exchangeCodeId" INTEGER NOT NULL,

    CONSTRAINT "TestResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Question_dimension_idx" ON "Question"("dimension");

-- CreateIndex
CREATE UNIQUE INDEX "ExchangeCode_code_key" ON "ExchangeCode"("code");

-- CreateIndex
CREATE INDEX "ExchangeCode_used_idx" ON "ExchangeCode"("used");

-- CreateIndex
CREATE INDEX "ExchangeCode_code_idx" ON "ExchangeCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "TestResult_exchangeCodeId_key" ON "TestResult"("exchangeCodeId");

-- CreateIndex
CREATE INDEX "TestResult_createdAt_idx" ON "TestResult"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- AddForeignKey
ALTER TABLE "TestResult" ADD CONSTRAINT "TestResult_exchangeCodeId_fkey" FOREIGN KEY ("exchangeCodeId") REFERENCES "ExchangeCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
