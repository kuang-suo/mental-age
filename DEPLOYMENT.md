# 服务器更新指南

## 概述

本次更新包含以下重大变更：

1. **ExchangeCode 表**：新增 `codeType`、`expiresAt`、`useLimit`、`usedCount`、`remark` 字段（支持月卡功能）
2. **TestResult 表**：完全重构为通用 JSON 格式（`testType` + `rawAnswers` + `resultData`）
3. **新增 TestConfig 表**：测试项目配置管理

## 更新步骤

### 方式一：使用迁移脚本（推荐）

#### 1. 备份数据库

```bash
# 进入服务器
ssh your-server

# 进入项目目录
cd /path/to/mental-age

# 备份 PostgreSQL 数据库
docker exec mental_age_test_db pg_dump -U postgres mental_age_test > backup_$(date +%Y%m%d_%H%M%S).sql

# 或者备份整个 volume
docker run --rm -v mental_age_test_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup_$(date +%Y%m%d).tar.gz /data
```

#### 2. 拉取最新代码

```bash
git pull origin main
```

#### 3. 执行数据库迁移

```bash
# 方式A：使用迁移脚本（推荐，保留旧数据）
docker exec -i mental_age_test_db psql -U postgres -d mental_age_test < backend/prisma/migrations/migration_v2.sql

# 方式B：使用 Prisma（会尝试保留数据，但可能失败）
# docker-compose exec app npx prisma migrate deploy
```

#### 4. 重新构建并启动

```bash
# 重新构建镜像
docker-compose build

# 重启服务
docker-compose down && docker-compose up -d

# 查看日志
docker-compose logs -f app
```

#### 5. 验证

```bash
# 检查健康状态
curl http://localhost:3001/health

# 检查兑换码是否保留
docker exec mental_age_test_db psql -U postgres -d mental_age_test -c "SELECT code, used, codeType FROM \"ExchangeCode\" LIMIT 5;"

# 检查测试结果是否迁移
docker exec mental_age_test_db psql -U postgres -d mental_age_test -c "SELECT id, \"testType\", \"resultData\"->>'mentalAge' as mental_age FROM \"TestResult\" LIMIT 5;"
```

---

### 方式二：完全重建（会丢失 TestResult 数据）

如果旧数据不重要或想从头开始：

```bash
# 1. 备份兑换码（如果需要）
docker exec mental_age_test_db psql -U postgres -d mental_age_test -c "COPY \"ExchangeCode\" TO STDOUT WITH CSV HEADER" > codes_backup.csv

# 2. 停止并删除容器和 volume
docker-compose down -v

# 3. 拉取最新代码
git pull origin main

# 4. 重新构建并启动
docker-compose up -d --build

# 5. 查看日志
docker-compose logs -f app
```

---

## 数据迁移说明

### ExchangeCode 表

| 旧字段 | 新字段 | 说明 |
|--------|--------|------|
| code | code | 保持不变 |
| used | used | 保持不变 |
| usedAt | usedAt | 保持不变 |
| createdAt | createdAt | 保持不变 |
| - | **codeType** | 新增，默认 `SINGLE_USE` |
| - | **expiresAt** | 新增，月卡到期时间 |
| - | **useLimit** | 新增，月卡使用次数限制 |
| - | **usedCount** | 新增，已使用次数 |
| - | **remark** | 新增，备注 |

**旧兑换码自动变为单次码**，功能不受影响。

### TestResult 表

旧数据会被转换为新的 JSON 格式：

```json
{
  "mentalAge": 28,
  "realAge": 25,
  "dimensionScores": {...},
  "personalityType": "ENFP",
  "archetype": "梦想家",
  "matchedCelebrity": "周杰伦",
  "keywords": [...],
  "analysisText": {...},
  "matchText": {...}
}
```

`testType` 自动设为 `mental-age`。

---

## 回滚方案

如果更新后出现问题，可以回滚：

```bash
# 1. 停止服务
docker-compose down

# 2. 恢复数据库备份
cat backup_YYYYMMDD_HHMMSS.sql | docker exec -i mental_age_test_db psql -U postgres -d mental_age_test

# 3. 回退代码
git checkout <previous-commit>

# 4. 重启服务
docker-compose up -d
```

---

## 常见问题

### Q: 迁移脚本报错 "relation already exists"

说明某些表/字段已存在，可以跳过相关步骤或手动检查。

```bash
# 检查当前表结构
docker exec mental_age_test_db psql -U postgres -d mental_age_test -c "\d \"ExchangeCode\""
docker exec mental_age_test_db psql -U postgres -d mental_age_test -c "\d \"TestResult\""
```

### Q: 前端页面空白或报错

确保前端文件也已更新：

```bash
# 检查前端文件
ls -la frontend/
ls -la frontend/js/

# 确保后端正确服务前端
curl http://localhost:3001/home.html
```

### Q: 兑换码验证失败

检查数据库连接和兑换码状态：

```bash
docker exec mental_age_test_db psql -U postgres -d mental_age_test -c "SELECT * FROM \"ExchangeCode\" WHERE code = 'YOUR_CODE';"
```

---

## 更新后检查清单

- [ ] 后端健康检查通过：`GET /health`
- [ ] 管理员登录正常：`admin.html`
- [ ] 兑换码列表显示正常
- [ ] 旧兑换码可以正常使用
- [ ] 新测试提交正常
- [ ] 管理后台4个Tab都能正常显示
- [ ] 月卡创建功能正常
- [ ] 测试配置Tab显示7个默认测试
