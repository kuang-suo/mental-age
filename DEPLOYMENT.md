# 证件照功能部署清单

## 部署信息
- 服务器IP: 124.223.44.24
- 服务器域名: https://home.quceshi.asia/
- 后端目录: /www/mental-age/backend
- 前端目录: /www/mental-age/frontend
- Node版本: v20.20.2
- 数据库: PostgreSQL (mental_age_test)

## 需要上传的文件

### 前端文件 (frontend/)
**新增文件:**
1. id-photo.html - 证件照生成页面
2. js/id-photo.js - 证件照生成逻辑
3. id-fhoto-image/001.png - 服装模板图片

**修改文件:**
4. admin.html - 管理后台页面
5. js/admin.js - 管理后台逻辑
6. home.html - 首页入口

### 后端文件 (backend/)
**新增文件:**
1. src/controllers/idPhotoController.js - 证件照控制器
2. src/routes/idPhoto.js - 证件照路由
3. prisma/migrations/migration_v4_add_id_photo_result.sql - 数据库迁移文件

**修改文件:**
4. src/app.js - 应用入口(静态文件路径修复)
5. src/controllers/adminController.js - 管理控制器
6. src/routes/admin.js - 管理路由
7. prisma/schema.prisma - 数据库模型

## 部署步骤

### 步骤1: 备份服务器代码
```bash
ssh root@124.223.44.24
cd /www/mental-age
tar -czf backup_$(date +%Y%m%d_%H%M%S).tar.gz backend frontend
```

### 步骤2: 上传文件到服务器
使用SCP或SFTP工具上传文件

### 步骤3: 安装依赖和数据库迁移
```bash
cd /www/mental-age/backend
npm install
npx prisma generate
psql -d mental_age_test -f prisma/migrations/migration_v4_add_id_photo_result.sql
```

### 步骤4: 重启应用
```bash
pm2 restart mental-age-backend
```

### 步骤5: 验证部署
访问: https://home.quceshi.asia/id-photo.html

## 注意事项
1. 确保服务器有足够的存储空间
2. 数据库迁移前先备份
3. 检查环境变量配置
4. 确保uploads目录权限正确
