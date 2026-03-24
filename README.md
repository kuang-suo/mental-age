# 心理年龄测试网站

一个温暖治愈风格的心理年龄测试网站，帮助用户了解自己的心理年龄、人格类型和独特特质。

## 功能特性

✨ **核心功能**
- 20道精心设计的心理测试题目（覆盖8个维度）
- 智能算法计算心理年龄（18-60岁）
- 8种人格类型判定（含原型角色和匹配名人）
- 个性化分析和建议
- 雷达图数据可视化
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

## 技术栈

**后端**
- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT 认证
- express-validator 输入验证
- express-rate-limit 速率限制

**前端**
- 原生 HTML/CSS/JavaScript
- Chart.js 雷达图
- html2canvas 截图
- 温暖治愈风格设计
- 响应式布局

**部署**
- Docker + Docker Compose
- 支持 Railway、Render 等云平台

## 快速开始

### 本地开发（使用 Docker）

**前置要求**
- Docker 和 Docker Compose
- Node.js 18+ （如果不使用 Docker）

**步骤**

1. 克隆项目
```bash
git clone <repository-url>
cd mental-age-test
```

2. 复制环境变量文件
```bash
cp .env.example .env
```

3. 启动应用
```bash
docker-compose up
```

4. 初始化数据库
```bash
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npx prisma db seed
```

5. 访问应用
- 前端：http://localhost:3000
- 管理后台：http://localhost:3000/admin.html
- API：http://localhost:3001/api

**默认管理员账户**
- 用户名：admin
- 密码：admin123

### 本地开发（不使用 Docker）

**前置要求**
- Node.js 18+
- PostgreSQL 12+

**步骤**

1. 安装后端依赖
```bash
cd backend
npm install
```

2. 配置数据库
```bash
# 创建 .env 文件
cp ../.env.example .env

# 编辑 .env，设置 DATABASE_URL
DATABASE_URL="postgresql://user:password@localhost:5432/mental_age_test"
```

3. 初始化数据库
```bash
npx prisma migrate deploy
npx prisma db seed
```

4. 启动后端服务
```bash
npm run dev
```

5. 启动前端
- 在浏览器中打开 `frontend/index.html`
- 或使用 HTTP 服务器：`python -m http.server 3000 --directory frontend`

## 部署指南

### Docker 部署

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f app
```

### Railway 部署

1. 连接 GitHub 仓库到 Railway
2. 添加 PostgreSQL 插件
3. 设置环境变量：
   - `DATABASE_URL` - Railway 自动提供
   - `JWT_SECRET` - 设置强密钥
   - `INIT_ADMIN_PASSWORD` - 设置管理员密码
   - `FRONTEND_URL` - 你的前端 URL

4. 部署后端服务

### Render 部署

1. 连接 GitHub 仓库
2. 创建 PostgreSQL 数据库
3. 创建 Web Service
4. 设置构建命令：`npm install && npx prisma migrate deploy`
5. 设置启动命令：`npm start`
6. 配置环境变量

## API 文档

### 公开 API

#### 获取所有题目
```
GET /api/questions
```

响应：
```json
[
  {
    "id": 1,
    "title": "当遇到挫折时，我能很快调整心态继续前进",
    "dimension": 1,
    "order": 1
  }
]
```

#### 验证兑换码
```
POST /api/validate-code
Content-Type: application/json

{
  "code": "ABC12345"
}
```

响应：
```json
{
  "valid": true,
  "code": "ABC12345"
}
```

#### 提交测试
```
POST /api/submit-test
Content-Type: application/json

{
  "code": "ABC12345",
  "answers": [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5],
  "realAge": 25
}
```

响应：
```json
{
  "success": true,
  "result": {
    "mentalAge": 28,
    "realAge": 25,
    "dimensionScores": {
      "1": 7.5,
      "2": 8.0,
      ...
    },
    "personalityType": "温柔治愈者",
    "archetype": "暖阳使者",
    "matchedCelebrity": "特蕾莎修女",
    "keywords": ["成熟", "稳定", "温暖"],
    "analysisText": "...",
    "matchText": "..."
  }
}
```

### 管理员 API

#### 登录
```
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

响应：
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### 获取兑换码列表
```
GET /api/admin/codes?page=1&limit=50
Authorization: Bearer <token>
```

#### 生成兑换码
```
POST /api/admin/generate-codes
Authorization: Bearer <token>
Content-Type: application/json

{
  "count": 10
}
```

响应：
```json
{
  "count": 10,
  "codes": ["ABC12345", "DEF67890", ...]
}
```

#### 导出 CSV
```
GET /api/admin/export
Authorization: Bearer <token>
```

## 管理员后台使用

1. 访问 `http://localhost:3000/admin.html`
2. 使用默认账户登录（admin/admin123）
3. 生成兑换码
4. 查看兑换码使用情况
5. 导出数据进行对账

## 数据库模型

### Question（题目）
- id: 主键
- title: 题目文本
- dimension: 维度（1-8）
- order: 题目顺序

### ExchangeCode（兑换码）
- id: 主键
- code: 兑换码（8位）
- used: 是否已使用
- usedAt: 使用时间
- createdAt: 创建时间
- testResultId: 关联的测试结果

### TestResult（测试结果）
- id: 主键
- mentalAge: 心理年龄
- realAge: 实际年龄
- dimensionScores: 8个维度的得分（JSON）
- personalityType: 人格类型
- archetype: 原型角色
- matchedCelebrity: 匹配名人
- keywords: 关键词（JSON）
- analysisText: 分析文字
- matchText: 匹配建议
- createdAt: 创建时间

### Admin（管理员）
- id: 主键
- username: 用户名
- passwordHash: 密码哈希
- createdAt: 创建时间

## 8个心理维度

1. **情感稳定性** - 情绪控制和心理韧性
2. **社交开放性** - 社交能力和人际交往
3. **自我认知度** - 自我了解和内省能力
4. **责任感** - 承诺和执行力
5. **好奇心** - 学习欲望和探索精神
6. **适应性** - 应对变化的能力
7. **乐观倾向** - 积极心态和希望
8. **压力应对** - 抗压能力和冷静思考

## 8种人格类型

| 类型 | 原型角色 | 匹配名人 | 特点 |
|------|--------|--------|------|
| 温柔治愈者 | 暖阳使者 | 特蕾莎修女 | 富有同理心，擅长安抚他人 |
| 活力挑战者 | 追风少年 | 理查德·布兰森 | 热爱冒险，充满能量 |
| 理性守望者 | 智慧长者 | 苏格拉底 | 冷静自持，善于分析 |
| 自由探索者 | 星辰旅人 | 大卫·爱登堡 | 好奇心旺盛，独立不羁 |
| 温润调和者 | 静水磐石 | 达赖喇嘛 | 情绪稳定，善于化解冲突 |
| 理想远航者 | 梦想建筑师 | 埃隆·马斯克 | 高责任感，敢于设定目标 |
| 敏锐洞察者 | 暗夜灯塔 | 弗吉尼亚·伍尔芙 | 自我认知深刻，情感细腻 |
| 快乐传播者 | 阳光精灵 | 罗宾·威廉姆斯 | 乐观外向，善于带给他人欢笑 |

## 故障排除

### 数据库连接失败
- 检查 PostgreSQL 是否运行
- 验证 DATABASE_URL 是否正确
- 检查数据库用户名和密码

### 前端无法连接后端
- 检查后端服务是否运行（http://localhost:3001/health）
- 验证 CORS 配置
- 检查防火墙设置

### 兑换码验证失败
- 确保兑换码格式正确（8位字母数字）
- 检查兑换码是否已被使用
- 查看数据库中是否存在该码

### 管理员登录失败
- 检查用户名和密码是否正确
- 确保管理员账户已创建
- 查看 JWT_SECRET 是否配置

## 环境变量

```
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

## 安全建议

1. **生产环境**
   - 修改 JWT_SECRET 为强密钥
   - 修改初始管理员密码
   - 启用 HTTPS
   - 配置适当的 CORS 策略
   - 使用环境变量管理敏感信息

2. **数据库**
   - 定期备份数据库
   - 使用强密码
   - 限制数据库访问权限

3. **API**
   - 监控速率限制
   - 定期审计日志
   - 更新依赖包

## 许可证

MIT

## 支持

如有问题或建议，请提交 Issue 或 Pull Request。
