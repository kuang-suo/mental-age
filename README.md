# 心理年龄测试网站 - 项目文档

## 1. 项目概述

### 1.1 项目简介

这是一个多类型心理测试平台，提供7种专业心理测试功能：

- **心理年龄测试**：20道精心设计的测试题目，覆盖8个心理维度
- **MBTI人格测试**：70道MBTI标准题目，4个维度的人格类型分析
- **SBTI测试**：心理年龄+MBTI综合测试
- **NBTI恋爱性格测试**：基于MBTI的恋爱风格分析
- **DISC测试**：4维度行为风格分析
- **回避型依恋测试**：依恋风格评估
- **性格匹配城市测试**：8维度城市匹配，15座城市数据

### 1.2 核心功能

✨ **用户端功能**

- 7种专业心理测试
- 兑换码验证系统（单次码 + 月卡）
- 智能算法计算测试结果
- 数据可视化（雷达图、进度条、维度条形图）
- 个性化分析和建议
- 结果截图保存功能
- 晒单领券活动

🔐 **安全特性**

- 兑换码验证系统（支持并发处理）
- 月卡有效期和次数限制验证
- 数据库事务确保数据一致性
- JWT 认证管理员后台
- 速率限制防止滥用
- 输入参数验证

📊 **管理功能**

- 数据概览仪表盘（总测试量、今日新增、兑换码使用率）
- 各测试完成量柱状图
- 生成单次兑换码（单次最多100个）
- 创建月卡（自定义有效期和使用次数）
- 测试结果查询（按类型/日期筛选、分页、详情查看）
- 结果数据导出CSV
- 兑换码列表（区分单次码/月卡、关联测试信息）
- 月卡管理（有效期、用量、状态）

### 1.3 适用场景

- 个人心理探索和自我了解
- 社交媒体分享
- 心理学教育用途
- 线上心理服务平台

***

## 2. 技术架构

### 2.1 技术栈

**后端技术栈**

- **运行环境**：Node.js 18+
- **Web框架**：Express.js
- **ORM**：Prisma 6.19.2
- **数据库**：PostgreSQL
- **认证**：JWT (jsonwebtoken)
- **输入验证**：express-validator
- **速率限制**：express-rate-limit
- **密码加密**：bcryptjs
- **CORS处理**：cors
- **环境管理**：dotenv

**前端技术栈**

- **基础技术**：原生 HTML5 / CSS3 / JavaScript (ES6+)
- **数据可视化**：Canvas API（雷达图）
- **截图功能**：html2canvas
- **样式设计**：响应式布局 + CSS变量 + 主题色系
- **设计风格**：温暖治愈风格 / 天蓝色系 / 粉色系

**部署技术**

- **容器化**：Docker + Docker Compose
- **云平台支持**：Railway、Render 等

### 2.2 系统架构图

```
┌─────────────────────────────────────────────────────────────────────┐
│                            用户界面层                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│
│  │心理年龄   │ │MBTI测试  │ │SBTI测试  │ │NBTI恋爱  │ │DISC测试  ││
│  │index.html│ │mbti.html │ │sbti.html │ │nbti.html │ │DISC.html ││
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘│
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                            │
│  │回避依恋   │ │城市匹配  │ │管理后台  │                            │
│  │avoidant  │ │city.html │ │admin.html│                            │
│  └──────────┘ └──────────┘ └──────────┘                            │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          API网关层                                    │
│                      Express + 中间件                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  限流中间件   │  │  CORS中间件  │  │  错误处理    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          业务逻辑层                                    │
│  ┌──────────────────┐  ┌──────────────────┐                        │
│  │  测试控制器       │  │  管理员控制器     │                        │
│  │  testController   │  │  adminController  │                        │
│  └──────────────────┘  └──────────────────┘                        │
│  ┌──────────────────┐  ┌──────────────────┐                        │
│  │  评分引擎         │  │  数据库工具       │                        │
│  │  scoring.js       │  │  database.js      │                        │
│  └──────────────────┘  └──────────────────┘                        │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          数据访问层                                    │
│                        Prisma ORM                                     │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          数据存储层                                    │
│                        PostgreSQL 数据库                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Question   │  │ExchangeCode  │  │  TestResult  │              │
│  │   (题目)      │  │  (兑换码)    │  │  (测试结果)  │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│  ┌──────────────┐                                                    │
│  │    Admin     │                                                    │
│  │  (管理员)     │                                                    │
│  └──────────────┘                                                    │
└─────────────────────────────────────────────────────────────────────┘
```

***

## 3. 核心功能模块说明

### 3.1 测试项目总览

| 测试名称 | 页面文件 | JS文件 | 提交接口 | testType | 主题色 |
|---------|---------|--------|---------|----------|-------|
| 心理年龄测试 | `index.html` | `main.js` | `/submit-test` | `mental-age` | 默认 |
| MBTI测试 | `mbti.html` | `mbti.js` | `/submit-mbti` | `mbti` | 默认 |
| SBTI测试 | `sbti.html` | `sbti.js` | `/submit-sbti` | `sbti` | 粉色系 |
| NBTI恋爱测试 | `nbti.html` | `nbti.js` | `/submit-nbti` | `nbti` | 粉色系 |
| DISC测试 | `DISC.html` | 内嵌JS | `/submit-disc` | `disc` | 默认 |
| 回避型依恋 | `avoidant.html` | `avoidant.js` | `/submit-avoidant` | `avoidant` | 默认 |
| 城市匹配 | `city.html` | `city.js` | `/submit-city` | `city` | 天蓝色系 |

### 3.2 心理年龄测试模块

通过20道精心设计的测试题目，评估用户的心理年龄和人格类型。

**8个心理维度**：情感稳定性、社交开放性、自我认知度、责任感、好奇心、适应性、乐观倾向、压力应对

**前端文件**：`frontend/index.html` + `frontend/js/main.js`

### 3.3 MBTI人格测试模块

通过70道MBTI标准题目，分析用户的人格类型（16种类型之一）。

**4个维度**：E/I（外向/内向）、S/N（感觉/直觉）、T/F（思考/情感）、J/P（判断/感知）

**前端文件**：`frontend/mbti.html` + `frontend/js/mbti.js`

### 3.4 SBTI测试模块

心理年龄与MBTI综合测试，提供更全面的人格分析。

**前端文件**：`frontend/sbti.html` + `frontend/js/sbti.js`

### 3.5 NBTI恋爱性格测试模块

基于MBTI的恋爱风格分析，包含爱情语言、明星匹配、恋爱建议等。

**前端文件**：`frontend/nbti.html` + `frontend/js/nbti.js`

### 3.6 DISC测试模块

4维度行为风格分析（D支配型/I影响型/S稳定型/C谨慎型）。

**前端文件**：`frontend/DISC.html`（JS内嵌）

### 3.7 回避型依恋测试模块

依恋风格评估，分析用户的依恋类型和回避程度。

**前端文件**：`frontend/avoidant.html` + `frontend/js/avoidant.js`

### 3.8 性格匹配城市测试模块

通过20道生活态度问题，在8个维度上匹配最适合用户的15座中国城市。

**8个匹配维度**：稳定/安稳、配套/便利、节奏/活力、国际/开放、居住/环境、美食/烟火、机遇/收入、生活成本

**15座城市**：上海、北京、深圳、广州、成都、杭州、西安、苏州、重庆、南京、武汉、长沙、厦门、青岛、大理

**结果包含**：灵魂城市Top1 + 匹配度、性格标签（5个）、为什么是你解读、八维度雷达图、城市画像、月度生活场景、数据卡片、适合同城好友城市Top2

**前端文件**：`frontend/city.html` + `frontend/js/city.js`

### 3.9 兑换码验证模块

#### 兑换码类型

| 类型 | 枚举值 | 说明 |
|------|--------|------|
| 单次兑换码 | `SINGLE_USE` | 使用一次后标记为已使用 |
| 月卡 | `MONTHLY_CARD` | 有效期内不限/限次使用 |

#### 验证流程

1. 用户输入兑换码
2. 后端验证兑换码是否存在
3. 单次码：检查是否已使用
4. 月卡：检查是否过期 + 使用次数是否达上限
5. 用户完成测试后，记录使用（单次码标记used，月卡递增usedCount）

#### 月卡验证逻辑

```
用户输入兑换码 → 查库
  ├─ SINGLE_USE：used == false → 通过，标记 used=true
  │                used == true  → "已被使用"
  └─ MONTHLY_CARD：now > expiresAt → "已过期"
                    usedCount >= useLimit → "使用次数已达上限"
                    通过 → usedCount++
```

### 3.10 管理员后台模块

4个Tab页面：

1. **📊 数据概览**：总测试次数、今日新增、兑换码使用率、各测试完成量柱状图、月卡统计
2. **💳 兑换码管理**：生成单次码、查看列表（区分类型/状态/关联测试）、导出CSV
3. **📋 结果查询**：按测试类型/日期筛选、分页浏览、查看详情、删除、导出CSV
4. **📅 月卡管理**：创建月卡（自定义有效期/次数限制/备注）、月卡列表

**前端文件**：`frontend/admin.html` + `frontend/js/admin.js`

***

## 4. API接口文档

### 4.1 公开API

#### 4.1.1 获取所有题目

```
GET /api/questions
```

#### 4.1.2 验证兑换码

```
POST /api/validate-code
Content-Type: application/json

{
  "code": "ABC12345"
}
```

**成功响应**：

```json
{
  "valid": true,
  "code": "ABC12345",
  "codeType": "SINGLE_USE"
}
```

#### 4.1.3 提交测试（通用格式）

所有7个测试提交接口遵循统一格式：

```
POST /api/submit-{testType}
Content-Type: application/json

{
  "code": "ABC12345",
  "rawAnswers": { "q1": 2, "q2": 0, ... },
  "resultData": { ... }
}
```

| 接口路径 | testType | resultData主要内容 |
|---------|----------|------------------|
| `/submit-test` | `mental-age` | mentalAge, realAge, dimensionScores, personalityType, archetype, keywords |
| `/submit-mbti` | `mbti` | mbtiType, dimensions, description, strengths, weaknesses |
| `/submit-sbti` | `sbti` | sbtiType, sbtiName, similarity, rawScores, levels, mbtiMatch |
| `/submit-nbti` | `nbti` | nbtiType, nbtiName, nbtiAlias, dimScores, dimDetails, summary |
| `/submit-disc` | `disc` | primaryType, scores, percentages, typeName, typeDesc |
| `/submit-avoidant` | `avoidant` | attachmentType, score, level, sectionScores, traits, advice |
| `/submit-city` | `city` | topCity, cityRanking, userDimensionScores, personalityTags |

**成功响应**：

```json
{
  "success": true,
  "message": "提交成功"
}
```

### 4.2 管理员API

所有管理员API需要在请求头中携带 `Authorization: Bearer <token>`。

#### 4.2.1 管理员登录

```
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

#### 4.2.2 数据概览统计

```
GET /api/admin/stats/overview
```

**响应**：

```json
{
  "totalResults": 3456,
  "todayNew": 89,
  "totalCodes": 2000,
  "usedCodes": 1560,
  "codeUsageRate": 78,
  "monthlyCards": 50,
  "activeMonthlyCards": 42,
  "byTestType": [
    { "testType": "sbti", "count": 1200 },
    { "testType": "nbti", "count": 800 }
  ]
}
```

#### 4.2.3 获取兑换码列表

```
GET /api/admin/codes?page=1&limit=50
```

#### 4.2.4 生成单次兑换码

```
POST /api/admin/generate-codes
Content-Type: application/json

{
  "count": 10
}
```

#### 4.2.5 创建月卡

```
POST /api/admin/create-monthly-cards
Content-Type: application/json

{
  "count": 5,
  "validDays": 30,
  "useLimit": null,
  "remark": "客户A"
}
```

#### 4.2.6 获取月卡列表

```
GET /api/admin/monthly-cards?page=1&limit=50
```

#### 4.2.7 查询测试结果

```
GET /api/admin/results?testType=all&page=1&limit=20&startDate=2026-01-01&endDate=2026-04-19
```

#### 4.2.8 查看结果详情

```
GET /api/admin/results/:id
```

#### 4.2.9 删除结果

```
DELETE /api/admin/results/:id
```

#### 4.2.10 导出结果CSV

```
GET /api/admin/results-export?testType=all&startDate=&endDate=
```

#### 4.2.11 导出兑换码CSV

```
GET /api/admin/export
```

#### 4.2.12 健康检查

```
GET /health
```

***

## 5. 数据库设计

### 5.1 数据库模型

#### 5.1.1 Question（题目）

```prisma
model Question {
  id        Int     @id @default(autoincrement())
  title     String  @db.Text
  dimension Int
  order     Int
  createdAt DateTime @default(now())

  @@index([dimension])
}
```

#### 5.1.2 ExchangeCode（兑换码）

```prisma
enum CodeType {
  SINGLE_USE
  MONTHLY_CARD
}

model ExchangeCode {
  id          Int         @id @default(autoincrement())
  code        String      @unique @db.VarChar(8)
  codeType    CodeType    @default(SINGLE_USE)
  used        Boolean     @default(false)
  usedAt      DateTime?
  expiresAt   DateTime?
  useLimit    Int?
  usedCount   Int         @default(0)
  remark      String?
  createdAt   DateTime    @default(now())
  testResults TestResult[]

  @@index([used])
  @@index([code])
  @@index([codeType])
  @@index([expiresAt])
}
```

**字段说明**：

| 字段 | 类型 | 说明 |
|------|------|------|
| `codeType` | CodeType | 兑换码类型：SINGLE_USE（单次）/ MONTHLY_CARD（月卡） |
| `expiresAt` | DateTime? | 月卡到期时间（单次码为null） |
| `useLimit` | Int? | 月卡使用次数上限（null表示不限） |
| `usedCount` | Int | 已使用次数（月卡递增，单次码0或1） |
| `remark` | String? | 备注 |
| `testResults` | TestResult[] | 关联的测试结果（月卡可有多条） |

#### 5.1.3 TestResult（测试结果 - 通用）

```prisma
model TestResult {
  id             Int          @id @default(autoincrement())
  testType       String
  rawAnswers     Json?
  resultData     Json
  createdAt      DateTime     @default(now())
  exchangeCodeId Int?
  exchangeCode   ExchangeCode? @relation(fields: [exchangeCodeId], references: [id])

  @@index([testType])
  @@index([createdAt])
  @@index([exchangeCodeId])
}
```

**字段说明**：

| 字段 | 类型 | 说明 |
|------|------|------|
| `testType` | String | 测试类型标识：mental-age / mbti / sbti / nbti / disc / avoidant / city |
| `rawAnswers` | Json? | 原始答题记录 |
| `resultData` | Json | 结构化结果数据（各测试格式不同） |
| `exchangeCodeId` | Int? | 关联兑换码ID（非unique，月卡可产生多条结果） |

#### 5.1.4 Admin（管理员）

```prisma
model Admin {
  id            Int     @id @default(autoincrement())
  username      String  @unique
  passwordHash  String
  createdAt     DateTime @default(now())
}
```

### 5.2 数据库关系图

```
┌──────────────┐         ┌──────────────┐
│   Question   │         │ExchangeCode  │
│   (题目)      │         │   (兑换码)    │
└──────────────┘         └──────┬───────┘
                                  │ 1:N（月卡可产生多条结果）
                                  │
                                  ▼
                         ┌──────────────┐
                         │  TestResult  │
                         │  (测试结果)  │
                         └──────────────┘

┌──────────────┐
│    Admin     │
│  (管理员)     │
└──────────────┘
```

***

## 6. 开发环境配置指南

### 6.1 系统要求

**使用 Docker 开发**：

- Docker 和 Docker Compose

**不使用 Docker 开发**：

- Node.js 18+
- PostgreSQL 12+

### 6.2 环境变量配置

创建 `.env` 文件（参考 `.env.example`）：

```env
# 数据库
DATABASE_URL=postgresql://user:password@localhost:5432/mental_age_test

# JWT
JWT_SECRET=your-secret-key-change-in-production

# 初始管理员密码
INIT_ADMIN_PASSWORD=admin123

# 前端 URL（CORS）
FRONTEND_URL=http://localhost:3000

# 服务器端口
PORT=3001

# 环境
NODE_ENV=development
```

### 6.3 本地开发（使用 Docker）

```bash
# 克隆项目
git clone <repository-url>
cd mental-age

# 复制环境变量文件
cp .env.example .env

# 启动应用
docker-compose up

# 初始化数据库
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npx prisma db seed

# 访问应用
# 前端：http://localhost:3000
# 管理后台：http://localhost:3000/admin.html
# API：http://localhost:3001/api
```

**默认管理员账户**：用户名 `admin`，密码 `admin123`

### 6.4 本地开发（不使用 Docker）

```bash
# 安装后端依赖
cd backend
npm install

# 配置数据库
cp ../.env.example .env
# 编辑 .env，设置 DATABASE_URL

# 初始化数据库
npx prisma db push
npx prisma db seed

# 启动后端服务
npm run dev
```

### 6.5 前端文件清单

| 测试 | 页面 | JS | 主题色 |
|------|------|-----|-------|
| 心理年龄 | `index.html` | `js/main.js` | 默认 |
| MBTI | `mbti.html` | `js/mbti.js` | 默认 |
| SBTI | `sbti.html` | `js/sbti.js` | 粉色系 |
| NBTI恋爱 | `nbti.html` | `js/nbti.js` | 粉色系 |
| DISC | `DISC.html` | 内嵌JS | 默认 |
| 回避型依恋 | `avoidant.html` | `js/avoidant.js` | 默认 |
| 城市匹配 | `city.html` | `js/city.js` | 天蓝色系 |
| 管理后台 | `admin.html` | `js/admin.js` | 紫色系 |
| 首页 | `home.html` | - | 默认 |

***

## 7. 部署流程

### 7.1 Docker 部署

```bash
docker-compose build
docker-compose up -d
docker-compose logs -f app
```

### 7.2 Railway 部署

1. 连接 GitHub 仓库到 Railway
2. 添加 PostgreSQL 插件
3. 设置环境变量：`DATABASE_URL`、`JWT_SECRET`、`INIT_ADMIN_PASSWORD`、`FRONTEND_URL`
4. 部署后端服务

### 7.3 生产环境安全建议

1. 修改 `JWT_SECRET` 为强密钥
2. 修改初始管理员密码
3. 启用 HTTPS
4. 配置适当的 CORS 策略
5. 使用环境变量管理敏感信息
6. 定期备份数据库
7. 监控速率限制
8. 定期更新依赖包

***

## 8. 常见问题解决方案

### 8.1 数据库连接失败

1. 检查 PostgreSQL 是否运行
2. 验证 `DATABASE_URL` 是否正确
3. 检查数据库用户名和密码
4. 确认数据库已创建

### 8.2 前端无法连接后端

1. 检查后端服务是否运行（访问 `http://localhost:3001/health`）
2. 验证 CORS 配置
3. 检查防火墙设置
4. 确认 `FRONTEND_URL` 环境变量设置正确

### 8.3 兑换码验证失败

1. 确保兑换码格式正确（8位字母数字）
2. 单次码：检查是否已被使用
3. 月卡：检查是否已过期或使用次数达上限
4. 确认兑换码没有大小写问题（系统不区分大小写）

### 8.4 管理员登录失败

1. 检查用户名和密码是否正确
2. 确保管理员账户已创建（通过数据库初始化）
3. 查看 `JWT_SECRET` 是否配置

### 8.5 测试结果未保存到后端

1. 检查提交接口是否返回成功
2. 确认前端发送了 `resultData` 和 `rawAnswers`
3. 检查VIP88888测试码不会写入数据库（设计如此）
4. 查看后端日志确认提交状态

### 8.6 月卡无法使用

1. 检查月卡是否已过期（`expiresAt`）
2. 检查使用次数是否已达上限（`useLimit`）
3. 确认月卡的 `codeType` 为 `MONTHLY_CARD`

***

## 9. 代码结构

### 9.1 目录结构

```
mental-age/
├── backend/                          # 后端代码
│   ├── prisma/                       # Prisma ORM 配置
│   │   ├── migrations/               # 数据库迁移文件
│   │   ├── schema.prisma             # 数据库模型定义
│   │   └── seed.js                   # 数据库初始化脚本
│   ├── src/                          # 源代码
│   │   ├── config/                   # 配置文件
│   │   │   └── env.js                # 环境变量配置
│   │   ├── controllers/              # 控制器
│   │   │   ├── adminController.js    # 管理员控制器（统计/结果/月卡/兑换码）
│   │   │   └── testController.js     # 测试控制器（验证码/提交）
│   │   ├── middleware/               # 中间件
│   │   │   ├── auth.js              # 认证和错误处理
│   │   │   └── rateLimiter.js       # 速率限制
│   │   ├── routes/                   # 路由
│   │   │   ├── admin.js             # 管理员路由（统计/结果/月卡/兑换码）
│   │   │   └── api.js               # 公开API路由（7个submit + validate）
│   │   ├── utils/                    # 工具函数
│   │   │   ├── database.js          # 数据库工具
│   │   │   └── scoring.js           # 评分引擎
│   │   └── app.js                   # 应用入口
│   ├── package.json                 # 后端依赖
│   └── Dockerfile                   # Docker镜像
├── frontend/                         # 前端代码
│   ├── css/                          # 样式文件
│   │   └── style.css                # 主样式文件（含NBTI粉色/城市天蓝变量）
│   ├── data/                         # 数据文件
│   │   └── content-v2.md            # 城市测试内容数据
│   ├── image/                        # 图片资源
│   ├── js/                           # JavaScript文件
│   │   ├── admin.js                 # 管理后台逻辑（4Tab）
│   │   ├── avoidant.js              # 回避型依恋测试逻辑
│   │   ├── city.js                  # 性格匹配城市测试逻辑
│   │   ├── html2canvas.min.js       # 截图库
│   │   ├── main.js                  # 心理年龄测试逻辑
│   │   ├── mbti.js                  # MBTI测试逻辑
│   │   ├── nbti.js                  # NBTI恋爱测试逻辑
│   │   └── sbti.js                  # SBTI测试逻辑
│   ├── admin.html                   # 管理后台页面（4Tab）
│   ├── avoidant.html                # 回避型依恋测试页面
│   ├── city.html                    # 性格匹配城市测试页面
│   ├── DISC.html                    # DISC测试页面
│   ├── home.html                    # 首页
│   ├── index.html                   # 心理年龄测试页面
│   ├── mbti.html                    # MBTI测试页面
│   ├── nbti.html                    # NBTI恋爱测试页面
│   └── sbti.html                    # SBTI测试页面
├── .env.example                     # 环境变量示例
├── docker-compose.yml               # Docker Compose配置
├── package.json                     # 根目录依赖
└── README.md                        # 项目说明
```

### 9.2 后端核心文件说明

#### `backend/src/app.js`

应用入口文件，初始化 Express 应用，配置中间件，挂载路由，启动服务器。

#### `backend/src/controllers/testController.js`

测试相关业务逻辑：`getQuestions()`、`validateCode()`（支持月卡验证）、`submitTest()`

#### `backend/src/controllers/adminController.js`

管理员相关业务逻辑：

| 函数 | 说明 |
|------|------|
| `login()` | 管理员登录 |
| `getStats()` | 数据概览统计 |
| `getCodes()` | 获取兑换码列表 |
| `generateCodes()` | 生成单次兑换码 |
| `exportCodes()` | 导出兑换码CSV |
| `getResults()` | 查询测试结果（分页+筛选） |
| `getResultById()` | 查看结果详情 |
| `deleteResult()` | 删除结果 |
| `exportResults()` | 导出结果CSV |
| `createMonthlyCards()` | 创建月卡 |
| `getMonthlyCards()` | 获取月卡列表 |

#### `backend/src/routes/api.js`

公开API路由，使用 `createSubmitRoute()` 工厂函数统一生成7个submit路由，包含 `consumeCode()` 通用兑换码消费逻辑（区分单次码/月卡）。

#### `backend/src/routes/admin.js`

管理员API路由，包含统计、结果查询、月卡管理等全部管理员接口。

***

## 10. 更新日志

### 2026-04-19

- 数据库Schema改造：ExchangeCode新增codeType/expiresAt/useLimit/usedCount/remark字段，支持月卡
- TestResult模型通用化：testType + rawAnswers(JSON) + resultData(JSON)，替代旧的固定字段
- 7个submit接口改写：统一写入TestResult，支持月卡验证逻辑
- 前端7个测试submit函数：发送rawAnswers和resultData到后端
- 管理员后台重构：4Tab布局（数据概览/兑换码管理/结果查询/月卡管理）
- 后端新增7个管理API：统计/结果查询/详情/删除/导出/月卡创建/月卡列表
- 新增性格匹配城市测试（city.html + city.js）：天蓝色系，20题，15城市，8维度雷达图，性格标签
- 兑换码系统增强：区分单次码/月卡，月卡支持有效期和次数限制

### 2026-04-08

- 修复 MBTI 测试选项点击事件问题
- 修复 MBTI 百分比计算超过 100% 的问题
- 添加 MBTI 测试进度条样式
- 优化 MBTI 结果页面显示

### 2026-04-07

- 实现 MBTI 测试功能
- 添加 MBTI 16种人格类型数据
- 优化结果页面设计
- 添加分享功能

### 2026-03-24

- 初始项目创建
- 实现心理年龄测试功能
- 实现兑换码系统
- 实现管理员后台
- 数据库设计和初始化

***

## 11. 附录

### 11.1 相关文档

- `FIXES_SUMMARY.md` - 修复总结
- `MODULE_5_6_REDESIGN.md` - 模块5-6重设计
- `RESULT_PAGE_REDESIGN.md` - 结果页面重设计
- `DATABASE_MIGRATION.md` - 数据库迁移

### 11.2 参考资源

- [MBTI 官方网站](https://www.myersbriggs.org/)
- [Prisma 文档](https://www.prisma.io/docs)
- [Express.js 文档](https://expressjs.com/)
- [html2canvas 文档](https://html2canvas.hertzen.com/)

### 11.3 许可证

MIT License

***

**文档版本**：2.0\
**最后更新**：2026-04-19\
**维护者**：项目开发团队
