# 心理年龄测试网站 - 项目文档

## 1. 项目概述

### 1.1 项目简介

这是一个温暖治愈风格的心理年龄测试网站，提供两种主要测试功能：

- **心理年龄测试**：20道精心设计的测试题目，覆盖8个心理维度
- **MBTI人格测试**：70道MBTI标准题目，4个维度的人格类型分析

### 1.2 核心功能

✨ **用户端功能**

- 心理年龄测试（18-60岁）
- MBTI人格类型测试
- 兑换码验证系统
- 智能算法计算测试结果
- 8种人格类型判定
- 个性化分析和建议
- 数据可视化（雷达图、进度条）
- 结果截图保存功能

🔐 **安全特性**

- 兑换码验证系统（支持并发处理）
- 数据库事务确保数据一致性
- JWT 认证管理员后台
- 速率限制防止滥用
- 输入参数验证

📊 **管理功能**

- 生成兑换码（单次最多100个）
- 查看兑换码使用情况
- 导出 CSV 对账
- 管理员账户管理

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
- **CSV导出**：csv-writer
- **环境管理**：dotenv

**前端技术栈**

- **基础技术**：原生 HTML5 / CSS3 / JavaScript (ES6+)
- **数据可视化**：Chart.js (雷达图)
- **截图功能**：html2canvas
- **样式设计**：响应式布局 + CSS变量
- **设计风格**：温暖治愈风格

**部署技术**

- **容器化**：Docker + Docker Compose
- **云平台支持**：Railway、Render 等

### 2.2 系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                          用户界面层                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  心理年龄测试  │  │  MBTI测试    │  │  管理后台     │    │
│  │  (index.html) │  │ (mbti.html)  │  │ (admin.html) │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        API网关层                              │
│                    Express + 中间件                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  限流中间件   │  │  CORS中间件  │  │  错误处理    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        业务逻辑层                              │
│  ┌──────────────────┐  ┌──────────────────┐                  │
│  │  测试控制器       │  │  管理员控制器     │                  │
│  │  testController   │  │  adminController  │                  │
│  └──────────────────┘  └──────────────────┘                  │
│  ┌──────────────────┐  ┌──────────────────┐                  │
│  │  评分引擎         │  │  数据库工具       │                  │
│  │  scoring.js       │  │  database.js      │                  │
│  └──────────────────┘  └──────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        数据访问层                              │
│                      Prisma ORM                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        数据存储层                              │
│                      PostgreSQL 数据库                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Question   │  │ExchangeCode  │  │  TestResult  │    │
│  │   (题目)      │  │   (兑换码)    │  │  (测试结果)  │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│  ┌──────────────┐                                          │
│  │    Admin     │                                          │
│  │  (管理员)     │                                          │
│  └──────────────┘                                          │
└─────────────────────────────────────────────────────────────┘
```

***

## 3. 核心功能模块说明

### 3.1 心理年龄测试模块

#### 功能概述

通过20道精心设计的测试题目，评估用户的心理年龄和人格类型。

#### 8个心理维度

1. **情感稳定性** - 情绪控制和心理韧性
2. **社交开放性** - 社交能力和人际交往
3. **自我认知度** - 自我了解和内省能力
4. **责任感** - 承诺和执行力
5. **好奇心** - 学习欲望和探索精神
6. **适应性** - 应对变化的能力
7. **乐观倾向** - 积极心态和希望
8. **压力应对** - 抗压能力和冷静思考

#### 评分算法

- 每个维度2-3道题目
- 每道题目得分1-5分
- 维度得分 = (题目得分总和 / (题目数量 × 5)) × 100
- 心理年龄 = 各维度加权计算得出（18-60岁）

#### 前端文件

- `frontend/index.html` - 心理年龄测试页面
- `frontend/js/main.js` - 心理年龄测试逻辑
- `frontend/css/style.css` - 样式文件

### 3.2 MBTI人格测试模块

#### 功能概述

通过70道MBTI标准题目，分析用户的人格类型（16种类型之一）。

#### 4个维度

1. **E/I 维度** - 外向 (Extraversion) vs 内向 (Introversion) - 10道题
2. **S/N 维度** - 感觉 (Sensing) vs 直觉 (Intuition) - 20道题
3. **T/F 维度** - 思考 (Thinking) vs 情感 (Feeling) - 20道题
4. **J/P 维度** - 判断 (Judging) vs 感知 (Perceiving) - 20道题

#### 评分算法

- 统计每个字母出现的次数
- 计算百分比：
  - E% = (e的数量 ÷ 10) × 100，I% = 100 - E%
  - S% = (s的数量 ÷ 20) × 100，N% = 100 - S%
  - T% = (t的数量 ÷ 20) × 100，F% = 100 - T%
  - J% = (j的数量 ÷ 20) × 100，P% = 100 - J%

#### 16种人格类型

| 类型   | 中文昵称 | 特点                         |
| ---- | ---- | -------------------------- |
| INTJ | 建筑师  | 富有想象力和战略性的思想家              |
| INTP | 逻辑学家 | 具有创造力的发明家，对知识有着止不住的渴望      |
| ENTJ | 指挥官  | 大胆、富有想象力且意志强大的领导者          |
| ENTP | 辩论家  | 聪明好奇的思想者，不会放弃任何智力上的挑战      |
| INFJ | 倡导者  | 安静而神秘，同时鼓舞人心且不知疲倦的理想主义者    |
| INFP | 调停者  | 诗意、善良的利他主义者，总是热情地为正当理由提供帮助 |
| ENFJ | 主角   | 富有魅力且鼓舞人心的领导者              |
| ENFP | 宣传者  | 热情、有创造力、社交自由的人             |
| ISTJ | 物流师  | 实际且注重事实的个人                 |
| ISFJ | 守护者  | 非常专注且温暖的保护者                |
| ESTJ | 执行官  | 出色的管理者                     |
| ESFJ | 领事   | 极有同情心、爱社交、受欢迎的人            |
| ISTP | 鉴赏家  | 大胆而实际的实验家                  |
| ISFP | 探险家  | 灵活且有魅力的艺术家                 |
| ESTP | 企业家  | 聪明、精力充沛且善于感知的人             |
| ESFP | 表演者  | 自发的、精力充沛的艺人                |

#### 前端文件

- `frontend/mbti.html` - MBTI测试页面
- `frontend/js/mbti.js` - MBTI测试逻辑
- `frontend/css/style.css` - 样式文件

### 3.3 兑换码验证模块

#### 功能概述

使用兑换码系统控制测试访问权限，防止滥用。

#### 主要特性

- 8位字母数字组合的兑换码
- 单次使用限制
- 数据库事务确保数据一致性
- 并发访问安全处理

#### 流程

1. 用户输入兑换码
2. 后端验证兑换码是否存在且未使用
3. 用户完成测试后，标记兑换码为已使用

### 3.4 管理员后台模块

#### 功能概述

提供管理员管理兑换码和查看测试数据的功能。

#### 主要功能

- 管理员登录（JWT认证）
- 生成兑换码（单次1-100个）
- 查看兑换码使用情况
- 导出CSV数据进行对账
- 管理员账户管理

#### 前端文件

- `frontend/admin.html` - 管理后台页面
- `frontend/js/admin.js` - 管理后台逻辑

### 3.5 首页模块

#### 功能概述

提供网站入口和导航，包括心理年龄测试和MBTI测试的入口。

#### 前端文件

- `frontend/home.html` - 首页
- `frontend/css/style.css` - 样式文件

***

## 4. API接口文档

### 4.1 公开API

#### 4.1.1 获取所有题目

```
GET /api/questions
```

**响应示例**：

```json
[
  {
    "id": 1,
    "title": "当遇到挫折时，我能很快调整心态继续前进",
    "dimension": 1,
    "order": 1,
    "createdAt": "2026-03-24T03:40:50.000Z"
  }
]
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
  "code": "ABC12345"
}
```

**错误响应**：

```json
{
  "error": "兑换码不存在"
}
```

#### 4.1.3 提交心理年龄测试

```
POST /api/submit-test
Content-Type: application/json

{
  "code": "ABC12345",
  "answers": [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5],
  "realAge": 25
}
```

**成功响应**：

```json
{
  "success": true,
  "result": {
    "mentalAge": 28,
    "realAge": 25,
    "dimensionScores": {
      "1": 75,
      "2": 80,
      "3": 60,
      "4": 70,
      "5": 85,
      "6": 75,
      "7": 90,
      "8": 65
    },
    "personalityType": "温柔治愈者",
    "archetype": "暖阳使者",
    "matchedCelebrity": "特蕾莎修女",
    "keywords": ["成熟", "稳定", "温暖"],
    "analysisText": {
      "coreTraits": "你是一个情感稳定、富有同理心的人...",
      "blindSpots": "可以留意的是，有时候你可能过于照顾他人...",
      "growthAdvice": "每周给自己留出一些独处时间..."
    },
    "matchText": {
      "socialType": "温暖陪伴型",
      "socialStyle": "你倾向于在社交中扮演倾听者和支持者的角色...",
      "bestMatch": "活力挑战者、理性守望者",
      "relationshipReminder": "在亲密关系中，记得也要关注自己的需求..."
    }
  }
}
```

#### 4.1.4 提交MBTI测试

```
POST /api/submit-mbti
Content-Type: application/json

{
  "code": "ABC12345",
  "answers": ["e", "s", "t", "j", ...],
  "realAge": 25
}
```

**成功响应**：

```json
{
  "success": true,
  "message": "兑换码已成功使用"
}
```

### 4.2 管理员API

#### 4.2.1 管理员登录

```
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**成功响应**：

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 4.2.2 获取兑换码列表

```
GET /api/admin/codes?page=1&limit=50
Authorization: Bearer <token>
```

**成功响应**：

```json
{
  "codes": [
    {
      "id": 1,
      "code": "ABC12345",
      "used": false,
      "usedAt": null,
      "createdAt": "2026-03-24T03:40:50.000Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 50
}
```

#### 4.2.3 生成兑换码

```
POST /api/admin/generate-codes
Authorization: Bearer <token>
Content-Type: application/json

{
  "count": 10
}
```

**成功响应**：

```json
{
  "count": 10,
  "codes": ["ABC12345", "DEF67890", ...]
}
```

#### 4.2.4 导出CSV

```
GET /api/admin/export
Authorization: Bearer <token>
```

**响应**：CSV文件下载

#### 4.2.5 健康检查

```
GET /health
```

**响应**：

```json
{
  "status": "ok",
  "message": "服务运行正常"
}
```

***

## 5. 数据库设计

### 5.1 数据库模型

#### 5.1.1 Question（题目）

```prisma
model Question {
  id        Int     @id @default(autoincrement())
  title     String  @db.Text
  dimension Int     // 1-8 维度
  order     Int
  createdAt DateTime @default(now())

  @@index([dimension])
}
```

**字段说明**：

- `id` - 主键，自增
- `title` - 题目文本
- `dimension` - 维度编号（1-8）
- `order` - 题目显示顺序
- `createdAt` - 创建时间

#### 5.1.2 ExchangeCode（兑换码）

```prisma
model ExchangeCode {
  id          Int         @id @default(autoincrement())
  code        String      @unique @db.VarChar(8)
  used        Boolean     @default(false)
  usedAt      DateTime?
  createdAt   DateTime    @default(now())
  testResult  TestResult?

  @@index([used])
  @@index([code])
}
```

**字段说明**：

- `id` - 主键，自增
- `code` - 兑换码（8位字母数字，唯一）
- `used` - 是否已使用
- `usedAt` - 使用时间
- `createdAt` - 创建时间
- `testResult` - 关联的测试结果

**索引**：

- `used` - 加速查询未使用的兑换码
- `code` - 加速兑换码验证

#### 5.1.3 TestResult（测试结果）

```prisma
model TestResult {
  id                Int         @id @default(autoincrement())
  mentalAge         Int
  realAge           Int
  dimensionScores   Json        // 8个维度的得分
  personalityType   String
  archetype         String
  matchedCelebrity  String
  keywords          Json        // 关键词数组
  analysisText      Json        // 深度分析（对象：coreTraits, blindSpots, growthAdvice）
  matchText         Json        // 社交匹配（对象：socialType, socialStyle, bestMatch, relationshipReminder）
  createdAt         DateTime    @default(now())
  exchangeCodeId    Int         @unique
  exchangeCode      ExchangeCode @relation(fields: [exchangeCodeId], references: [id])

  @@index([createdAt])
}
```

**字段说明**：

- `id` - 主键，自增
- `mentalAge` - 心理年龄
- `realAge` - 实际年龄
- `dimensionScores` - 8个维度的得分（JSON对象）
- `personalityType` - 人格类型名称
- `archetype` - 原型角色
- `matchedCelebrity` - 匹配名人
- `keywords` - 关键词数组（JSON）
- `analysisText` - 深度分析（JSON对象）
- `matchText` - 社交匹配（JSON对象）
- `createdAt` - 创建时间
- `exchangeCodeId` - 关联的兑换码ID（唯一）

**索引**：

- `createdAt` - 加速按时间查询测试结果

#### 5.1.4 Admin（管理员）

```prisma
model Admin {
  id            Int     @id @default(autoincrement())
  username      String  @unique
  passwordHash  String
  createdAt     DateTime @default(now())
}
```

**字段说明**：

- `id` - 主键，自增
- `username` - 用户名（唯一）
- `passwordHash` - 密码哈希（bcrypt加密）
- `createdAt` - 创建时间

### 5.2 数据库关系图

```
┌──────────────┐         ┌──────────────┐
│   Question   │         │ExchangeCode  │
│   (题目)      │         │   (兑换码)    │
└──────────────┘         └──────┬───────┘
                                  │ 1:1
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

### 5.3 数据初始化

数据库初始化通过 `backend/prisma/seed.js` 文件完成，主要包括：

1. 创建20道心理年龄测试题目
2. 创建默认管理员账户（用户名：admin，密码：admin123）

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

#### 步骤

1. 克隆项目

```bash
git clone <repository-url>
cd mental-age
```

1. 复制环境变量文件

```bash
cp .env.example .env
```

1. 启动应用

```bash
docker-compose up
```

1. 初始化数据库

```bash
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npx prisma db seed
```

1. 访问应用

- 前端：<http://localhost:3000>
- 管理后台：<http://localhost:3000/admin.html>
- API：<http://localhost:3001/api>

**默认管理员账户**：

- 用户名：admin
- 密码：admin123

### 6.4 本地开发（不使用 Docker）

#### 步骤

1. 安装后端依赖

```bash
cd backend
npm install
```

1. 配置数据库

```bash
# 创建 .env 文件
cp ../.env.example .env

# 编辑 .env，设置 DATABASE_URL
DATABASE_URL="postgresql://user:password@localhost:5432/mental_age_test"
```

1. 初始化数据库

```bash
npx prisma migrate deploy
npx prisma db seed
```

1. 启动后端服务

```bash
npm run dev
```

1. 启动前端

- 在浏览器中打开 `frontend/index.html`
- 或使用 HTTP 服务器：

```bash
python -m http.server 3000 --directory frontend
```

### 6.5 前端开发

前端使用原生 HTML/CSS/JavaScript，无需构建工具。主要文件：

**心理年龄测试**：

- `frontend/index.html` - 页面结构
- `frontend/js/main.js` - 业务逻辑
- `frontend/css/style.css` - 样式

**MBTI测试**：

- `frontend/mbti.html` - 页面结构
- `frontend/js/mbti.js` - 业务逻辑
- `frontend/css/style.css` - 样式

**管理后台**：

- `frontend/admin.html` - 页面结构
- `frontend/js/admin.js` - 业务逻辑
- `frontend/css/style.css` - 样式

**首页**：

- `frontend/home.html` - 页面结构
- `frontend/css/style.css` - 样式

***

## 7. 部署流程

### 7.1 Docker 部署

#### 使用 Docker Compose 部署

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f app
```

### 7.2 Railway 部署

1. 连接 GitHub 仓库到 Railway
2. 添加 PostgreSQL 插件
3. 设置环境变量：
   - `DATABASE_URL` - Railway 自动提供
   - `JWT_SECRET` - 设置强密钥
   - `INIT_ADMIN_PASSWORD` - 设置管理员密码
   - `FRONTEND_URL` - 你的前端 URL
4. 部署后端服务

### 7.3 Render 部署

1. 连接 GitHub 仓库
2. 创建 PostgreSQL 数据库
3. 创建 Web Service
4. 设置构建命令：`npm install && npx prisma migrate deploy`
5. 设置启动命令：`npm start`
6. 配置环境变量

### 7.4 生产环境安全建议

1. **修改 JWT\_SECRET** 为强密钥
2. **修改初始管理员密码**
3. **启用 HTTPS**
4. **配置适当的 CORS 策略**
5. **使用环境变量管理敏感信息**
6. **定期备份数据库**
7. **使用强密码**
8. **限制数据库访问权限**
9. **监控速率限制**
10. **定期审计日志**
11. **更新依赖包**

***

## 8. 常见问题解决方案

### 8.1 数据库连接失败

**问题**：后端无法连接到 PostgreSQL 数据库

**解决方案**：

1. 检查 PostgreSQL 是否运行
2. 验证 `DATABASE_URL` 是否正确
3. 检查数据库用户名和密码
4. 确认数据库已创建

### 8.2 前端无法连接后端

**问题**：前端页面显示网络错误

**解决方案**：

1. 检查后端服务是否运行（访问 <http://localhost:3001/health）>
2. 验证 CORS 配置
3. 检查防火墙设置
4. 确认 `FRONTEND_URL` 环境变量设置正确

### 8.3 兑换码验证失败

**问题**：输入兑换码后提示错误

**解决方案**：

1. 确保兑换码格式正确（8位字母数字）
2. 检查兑换码是否已被使用
3. 查看数据库中是否存在该码
4. 确认兑换码没有大小写问题（系统不区分大小写）

### 8.4 管理员登录失败

**问题**：无法登录管理后台

**解决方案**：

1. 检查用户名和密码是否正确
2. 确保管理员账户已创建（通过数据库初始化）
3. 查看 `JWT_SECRET` 是否配置
4. 检查浏览器是否支持 Cookie

### 8.5 测试结果显示异常

**问题**：测试结果页面显示不正确

**解决方案**：

1. 检查网络连接
2. 查看浏览器控制台错误
3. 确认后端 API 返回正确数据
4. 清除浏览器缓存

### 8.6 进度条不显示

**问题**：MBTI测试结果页面进度条不显示

**解决方案**：

1. 检查 CSS 样式是否正确加载
2. 确认 HTML 结构包含进度条元素
3. 查看浏览器开发者工具中的元素样式
4. 清除浏览器缓存并强制刷新

### 8.7 MBTI百分比超过100%

**问题**：MBTI测试结果中某个维度的百分比超过100%

**解决方案**：

1. 确认选项的 `onclick` 事件正确设置
2. 检查 `selectAnswer` 函数是否正确记录答案
3. 验证 `calculateMBTIResult` 函数的计算逻辑
4. 确保每个维度的问题数量正确

***

## 9. 代码结构

### 9.1 目录结构

```
mental-age/
├── backend/                      # 后端代码
│   ├── prisma/                  # Prisma ORM 配置
│   │   ├── migrations/          # 数据库迁移文件
│   │   ├── schema.prisma        # 数据库模型定义
│   │   └── seed.js             # 数据库初始化脚本
│   ├── src/                     # 源代码
│   │   ├── config/              # 配置文件
│   │   │   └── env.js          # 环境变量配置
│   │   ├── controllers/         # 控制器
│   │   │   ├── adminController.js   # 管理员控制器
│   │   │   └── testController.js    # 测试控制器
│   │   ├── middleware/          # 中间件
│   │   │   ├── auth.js         # 认证和错误处理
│   │   │   └── rateLimiter.js  # 速率限制
│   │   ├── routes/              # 路由
│   │   │   ├── admin.js        # 管理员路由
│   │   │   └── api.js          # API路由
│   │   ├── utils/               # 工具函数
│   │   │   ├── database.js     # 数据库工具
│   │   │   └── scoring.js      # 评分引擎
│   │   └── app.js              # 应用入口
│   ├── package.json            # 后端依赖
│   └── Dockerfile              # Docker镜像
├── frontend/                    # 前端代码
│   ├── css/                     # 样式文件
│   │   ├── style.css           # 主样式文件
│   │   └── style - 备份.css     # 备份样式
│   ├── js/                      # JavaScript文件
│   │   ├── admin.js            # 管理后台逻辑
│   │   ├── main.js             # 心理年龄测试逻辑
│   │   └── mbti.js             # MBTI测试逻辑
│   ├── admin.html              # 管理后台页面
│   ├── home.html               # 首页
│   ├── index.html              # 心理年龄测试页面
│   └── mbti.html               # MBTI测试页面
├── .env.example                # 环境变量示例
├── docker-compose.yml          # Docker Compose配置
├── package.json                # 根目录依赖
├── README.md                   # 项目说明
└── PROJECT_DOCUMENTATION.md    # 项目文档（本文件）
```

### 9.2 后端核心文件说明

#### `backend/src/app.js`

- **用途**：应用入口文件
- **功能**：
  - 初始化 Express 应用
  - 配置中间件（CORS、JSON解析、限流）
  - 挂载路由
  - 启动服务器
  - 初始化数据库

#### `backend/src/controllers/testController.js`

- **用途**：测试相关的业务逻辑
- **功能**：
  - `getQuestions()` - 获取所有测试题目
  - `validateCode()` - 验证兑换码
  - `submitTest()` - 提交心理年龄测试（包含数据库事务）

#### `backend/src/controllers/adminController.js`

- **用途**：管理员相关的业务逻辑
- **功能**：
  - `login()` - 管理员登录
  - `getCodes()` - 获取兑换码列表
  - `generateCodes()` - 生成兑换码
  - `exportCodes()` - 导出兑换码CSV

#### `backend/src/utils/scoring.js`

- **用途**：评分引擎
- **功能**：
  - `calculateDimensionScores()` - 计算8个维度的得分
  - `calculateMentalAge()` - 计算心理年龄
  - `determinePerssonalityType()` - 确定人格类型
  - `generateKeywords()` - 生成关键词
  - `generateAnalysisText()` - 生成分析文本
  - `generateMatchText()` - 生成匹配文本
  - `PERSONALITY_TYPES` - 8种人格类型定义

#### `backend/src/routes/api.js`

- **用途**：公开API路由
- **路由**：
  - `GET /api/questions` - 获取题目
  - `POST /api/validate-code` - 验证兑换码
  - `POST /api/submit-test` - 提交心理年龄测试
  - `POST /api/submit-mbti` - 提交MBTI测试
  - `POST /api/submit-sbti` - 提交SBTI测试-可通用，仅验证8位兑换码

#### `backend/src/routes/admin.js`

- **用途**：管理员API路由
- **路由**：
  - `POST /api/admin/login` - 管理员登录
  - `GET /api/admin/codes` - 获取兑换码列表
  - `POST /api/admin/generate-codes` - 生成兑换码
  - `GET /api/admin/export` - 导出CSV

#### `backend/prisma/schema.prisma`

- **用途**：数据库模型定义
- **模型**：
  - `Question` - 测试题目
  - `ExchangeCode` - 兑换码
  - `TestResult` - 测试结果
  - `Admin` - 管理员

### 9.3 前端核心文件说明

#### `frontend/js/main.js`

- **用途**：心理年龄测试逻辑
- **功能**：
  - 显示测试题目
  - 记录用户答案
  - 调用API提交测试
  - 显示测试结果
  - 生成雷达图
  - 截图保存功能

#### `frontend/js/mbti.js`

- **用途**：MBTI测试逻辑
- **功能**：
  - `MBTI_QUESTIONS` - 70道MBTI题目定义
  - `MBTI_DATA` - 16种MBTI类型数据
  - `selectAnswer()` - 记录用户答案
  - `calculateMBTIResult()` - 计算MBTI结果
  - `renderResult()` - 渲染结果页面
  - `saveResultImage()` - 保存结果图片
  - `copyShareText()` - 复制分享文案

#### `frontend/js/admin.js`

- **用途**：管理后台逻辑
- **功能**：
  - 管理员登录
  - 查看兑换码列表
  - 生成兑换码
  - 导出CSV

#### `frontend/css/style.css`

- **用途**：样式文件
- **功能**：
  - 心理年龄测试样式
  - MBTI测试样式
  - 管理后台样式
  - 响应式布局
  - CSS变量定义

***

## 10. 关键实现逻辑

### 10.1 心理年龄评分算法

#### 维度得分计算

```javascript
function calculateDimensionScores(answers) {
  const dimensionQuestions = {
    1: [0, 8, 16],      // 情感稳定性 (3个问题)
    2: [1, 9, 17],      // 社交开放性 (3个问题)
    3: [2, 10, 18],     // 自我认知度 (3个问题)
    4: [3, 11, 19],     // 责任感 (3个问题)
    5: [4, 12],         // 好奇心 (2个问题)
    6: [5, 13],         // 适应性 (2个问题)
    7: [6, 14],         // 乐观倾向 (2个问题)
    8: [7, 15]          // 压力应对 (2个问题)
  };

  const scores = {};
  for (let dim = 1; dim <= 8; dim++) {
    const questionIndices = dimensionQuestions[dim];
    const sum = questionIndices.reduce((acc, idx) => acc + answers[idx], 0);
    // 百分制计算：(sum / (题目数 * 5)) * 100
    const dimensionMaxScore = questionIndices.length * 5;
    scores[dim] = Math.round((sum / dimensionMaxScore) * 100);
  }
  return scores;
}
```

#### 心理年龄计算

```javascript
function calculateMentalAge(dimensionScores) {
  // 基于各维度得分计算心理年龄（18-60岁）
  const totalScore = Object.values(dimensionScores).reduce((a, b) => a + b, 0);
  const avgScore = totalScore / 8;
  
  // 简单的映射：平均得分50对应心理年龄30岁
  // 得分越高，心理年龄越成熟
  const baseAge = 18;
  const maxAge = 60;
  const mentalAge = Math.round(baseAge + (avgScore / 100) * (maxAge - baseAge));
  
  return Math.max(baseAge, Math.min(maxAge, mentalAge));
}
```

### 10.2 MBTI评分算法

#### 答案统计

```javascript
function calculateMBTIResult(answers) {
  const counts = { e: 0, i: 0, s: 0, n: 0, t: 0, f: 0, j: 0, p: 0 };

  const dimensionCounts = { e: 10, i: 10, s: 20, n: 20, t: 20, f: 20, j: 20, p: 20 };

  answers.forEach(answer => {
    if (counts.hasOwnProperty(answer) && counts[answer] < dimensionCounts[answer]) {
      counts[answer]++;
    }
  });

  const percentages = {
    e: Math.min((counts.e / 10) * 100, 100),
    i: Math.min(100 - (counts.e / 10) * 100, 100),
    s: Math.min((counts.s / 20) * 100, 100),
    n: Math.min(100 - (counts.s / 20) * 100, 100),
    t: Math.min((counts.t / 20) * 100, 100),
    f: Math.min(100 - (counts.t / 20) * 100, 100),
    j: Math.min((counts.j / 20) * 100, 100),
    p: Math.min(100 - (counts.j / 20) * 100, 100)
  };

  const type = [
    counts.e > counts.i ? 'E' : 'I',
    counts.s > counts.n ? 'S' : 'N',
    counts.t > counts.f ? 'T' : 'F',
    counts.j > counts.p ? 'J' : 'P'
  ].join('');

  return { type, counts, percentages, typeInfo: MBTI_DATA[type] };
}
```

### 10.3 数据库事务处理

```javascript
async function submitTest(code, answers, realAge) {
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

    return { success: true, result: { ... } };
  });

  return result;
}
```

### 10.4 兑换码生成算法

```javascript
function generateRandomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 排除易混淆字符
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function generateCodes(count) {
  const codes = [];
  for (let i = 0; i < count; i++) {
    let code;
    let attempts = 0;
    do {
      code = generateRandomCode();
      attempts++;
      if (attempts > 100) {
        throw new Error('无法生成唯一兑换码');
      }
    } while (codes.includes(code));
    
    codes.push(code);
  }

  const createdCodes = await prisma.exchangeCode.createMany({
    data: codes.map(code => ({ code }))
  });

  return codes;
}
```

***

## 11. 更新日志

### 2026-04-08

- 修复 MBTI 测试选项点击事件问题
- 修复 MBTI 百分比计算超过 100% 的问题
- 添加 MBTI 测试进度条样式
- 移除测试按钮
- 优化 MBTI 结果页面显示

### 2026-04-07

- 实现 MBTI 测试功能
- 添加 MBTI 16种人格类型数据
- 优化结果页面设计
- 添加分享功能
- 修复心理年龄测试样式问题

### 2026-03-24

- 初始项目创建
- 实现心理年龄测试功能
- 实现兑换码系统
- 实现管理员后台
- 数据库设计和初始化

***

## 12. 附录

### 12.1 相关文档

- `README.md` - 项目快速开始指南
- `FIXES_SUMMARY.md` - 修复总结
- `MODULE_5_6_REDESIGN.md` - 模块5-6重设计
- `RESULT_PAGE_REDESIGN.md` - 结果页面重设计
- `SCORING_10TO5.md` - 评分10到5
- `DATABASE_MIGRATION.md` - 数据库迁移
- `译文_skill.txt` - 项目翻译文档

### 12.2 参考资源

- [MBTI 官方网站](https://www.myersbriggs.org/)
- [Prisma 文档](https://www.prisma.io/docs)
- [Express.js 文档](https://expressjs.com/)
- [Chart.js 文档](https://www.chartjs.org/docs/)
- [html2canvas 文档](https://html2canvas.hertzen.com/)

### 12.3 许可证

MIT License

***

## 13. 联系方式

如有问题或建议，请提交 Issue 或 Pull Request。

***

**文档版本**：1.0\
**最后更新**：2026-04-08\
**维护者**：项目开发团队
