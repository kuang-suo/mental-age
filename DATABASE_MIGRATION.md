# 数据库迁移说明

## 问题原因
`analysisText` 和 `matchText` 字段从字符串改为对象格式，导致 Prisma schema 不匹配。

## 解决方案
已将 schema 中这两个字段从 `String @db.Text` 改为 `Json` 类型，使其能够存储结构化对象。

## 执行迁移

### 如果使用 Docker Compose：
```bash
# 方法1: 推送迁移到数据库（推荐）
docker-compose exec app npx prisma db push

# 方法2: 创建新的迁移文件并执行
docker-compose exec app npx prisma migrate dev --name update_analysis_match_to_json
```

### 如果本地开发（不使用 Docker）：
```bash
cd backend
npx prisma db push
# 或
npx prisma migrate dev --name update_analysis_match_to_json
```

## 迁移内容
- `analysisText`: String → Json
  - 存储格式: `{coreTraits: "...", blindSpots: "...", growthAdvice: "..."}`
- `matchText`: String → Json
  - 存储格式: `{socialType: "...", socialStyle: "...", bestMatch: "...", relationshipReminder: "..."}`

## 注意事项
✅ 这是一个向后兼容的改动
✅ 不会丢失现有数据
✅ 建议在执行迁移前做数据库备份

## 迁移后
重启应用即可，新的提交就能正常工作了。
