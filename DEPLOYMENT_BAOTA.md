# 宝塔面板更新指南

## 更新步骤

### 1. 备份数据库

登录宝塔面板 → 数据库 → 选择 `mental_age_test` 数据库 → 备份

或者通过 SSH：

```bash
# 备份数据库
mysqldump -u root -p mental_age_test > backup_$(date +%Y%m%d).sql

# 或者如果用的是 PostgreSQL
pg_dump -U postgres mental_age_test > backup_$(date +%Y%m%d).sql
```

### 2. 备份旧代码

```bash
cd /www/wwwroot/your-site
cp -r mental-age mental-age_backup_$(date +%Y%m%d)
```

### 3. 拉取最新代码

```bash
cd /www/wwwroot/your-site/mental-age
git pull origin main
```

### 4. 更新后端依赖

```bash
cd backend
npm install
```

### 5. 执行数据库迁移

```bash
# 进入后端目录
cd /www/wwwroot/your-site/mental-age/backend

# 方式A：使用迁移脚本（推荐）
# 先检查数据库类型，如果是 PostgreSQL：
psql -U postgres -d mental_age_test -f prisma/migrations/migration_v2.sql

# 如果是 MySQL，需要先转换语法（见下方 MySQL 版本迁移脚本）

# 方式B：使用 Prisma db push（会尝试保留数据）
npx prisma db push
```

### 6. 重启后端服务

```bash
# 如果使用 PM2
pm2 restart mental-age-backend

# 或者通过宝塔面板 → 软件商店 → PM2管理器 → 重启项目
```

### 7. 验证更新

```bash
# 检查后端健康状态
curl http://localhost:3001/health

# 检查兑换码是否保留
psql -U postgres -d mental_age_test -c "SELECT code, used, \"codeType\" FROM \"ExchangeCode\" LIMIT 5;"
```

---

## MySQL 版本迁移脚本

如果你的数据库是 MySQL，使用以下迁移脚本：

```sql
-- ============================================
-- MySQL 迁移脚本
-- ============================================

-- 第一步：备份旧的 TestResult 数据到临时表
CREATE TABLE TestResult_backup AS
SELECT * FROM TestResult;

-- 第二步：为 ExchangeCode 添加新字段
ALTER TABLE ExchangeCode ADD COLUMN codeType VARCHAR(20) NOT NULL DEFAULT 'SINGLE_USE';
ALTER TABLE ExchangeCode ADD COLUMN expiresAt DATETIME;
ALTER TABLE ExchangeCode ADD COLUMN useLimit INT;
ALTER TABLE ExchangeCode ADD COLUMN usedCount INT NOT NULL DEFAULT 0;
ALTER TABLE ExchangeCode ADD COLUMN remark VARCHAR(255);

-- 添加索引
CREATE INDEX idx_exchangeCode_codeType ON ExchangeCode(codeType);
CREATE INDEX idx_exchangeCode_expiresAt ON ExchangeCode(expiresAt);

-- 第三步：重建 TestResult 表
DROP TABLE TestResult;

CREATE TABLE TestResult (
    id INT AUTO_INCREMENT PRIMARY KEY,
    testType VARCHAR(50) NOT NULL,
    rawAnswers JSON,
    resultData JSON NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    exchangeCodeId INT,
    INDEX idx_testType (testType),
    INDEX idx_createdAt (createdAt),
    INDEX idx_exchangeCodeId (exchangeCodeId),
    FOREIGN KEY (exchangeCodeId) REFERENCES ExchangeCode(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- 第四步：迁移旧数据
INSERT INTO TestResult (testType, rawAnswers, resultData, createdAt, exchangeCodeId)
SELECT
  'mental-age' as testType,
  NULL as rawAnswers,
  JSON_OBJECT(
    'mentalAge', mentalAge,
    'realAge', realAge,
    'dimensionScores', dimensionScores,
    'personalityType', personalityType,
    'archetype', archetype,
    'matchedCelebrity', matchedCelebrity,
    'keywords', keywords,
    'analysisText', analysisText,
    'matchText', matchText
  ) as resultData,
  createdAt,
  exchangeCodeId
FROM TestResult_backup;

-- 第五步：创建 TestConfig 表
CREATE TABLE TestConfig (
    id INT AUTO_INCREMENT PRIMARY KEY,
    typeKey VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    page VARCHAR(100),
    enabled BOOLEAN DEFAULT TRUE,
    `order` INT DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_typeKey (typeKey),
    INDEX idx_enabled (enabled),
    INDEX idx_order (`order`)
);

-- 插入默认测试配置
INSERT INTO TestConfig (typeKey, name, page, `order`) VALUES
  ('mental-age', '心理年龄测试', 'index.html', 1),
  ('mbti', 'MBTI性格测试', 'mbti.html', 2),
  ('sbti', 'SBTI测试', 'sbti.html', 3),
  ('nbti', 'NBTI恋爱测试', 'nbti.html', 4),
  ('disc', 'DISC测试', 'DISC.html', 5),
  ('avoidant', '回避型依恋测试', 'avoidant.html', 6),
  ('city', '性格匹配城市测试', 'city.html', 7);

-- 第六步：清理（确认成功后执行）
-- DROP TABLE IF EXISTS TestResult_backup;
```

---

## 宝塔面板 PM2 配置

如果还没有配置 PM2，在宝塔面板中：

1. 软件商店 → 安装 PM2管理器
2. 添加项目：
   - 项目名称：`mental-age-backend`
   - 启动文件：`/www/wwwroot/your-site/mental-age/backend/src/app.js`
   - 运行目录：`/www/wwwroot/your-site/mental-age/backend`
   - 端口：`3001`

或者创建 `ecosystem.config.js`：

```javascript
module.exports = {
  apps: [{
    name: 'mental-age-backend',
    script: './src/app.js',
    cwd: '/www/wwwroot/your-site/mental-age/backend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
```

然后运行：

```bash
pm2 start ecosystem.config.js
pm2 save
```

---

## Nginx 配置（宝塔面板）

在网站设置中添加反向代理：

```nginx
location /api {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}

location /health {
    proxy_pass http://127.0.0.1:3001;
}
```

静态文件直接由 Nginx 服务：

```nginx
root /www/wwwroot/your-site/mental-age/frontend;
index home.html index.html;

location / {
    try_files $uri $uri/ /home.html;
}
```

---

## 常见问题

### Q: 执行迁移脚本报错

检查数据库连接：

```bash
# PostgreSQL
psql -U postgres -d mental_age_test -c "SELECT version();"

# MySQL
mysql -u root -p mental_age_test -e "SELECT VERSION();"
```

### Q: PM2 启动失败

检查日志：

```bash
pm2 logs mental-age-backend
```

检查环境变量：

```bash
pm2 env mental-age-backend
```

### Q: 前端页面 404

检查 Nginx 配置中的 root 路径是否正确指向 `frontend` 目录。

---

## 更新后检查清单

- [ ] 后端健康检查：`curl http://localhost:3001/health`
- [ ] 前端首页正常：访问 `http://your-domain/home.html`
- [ ] 管理后台登录：`http://your-domain/admin.html`
- [ ] 兑换码列表显示正常
- [ ] 旧兑换码可以正常使用
- [ ] 新测试提交正常
- [ ] 月卡创建功能正常
