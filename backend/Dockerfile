# 使用 Node.js 20 Debian 12（Bookworm），自带 OpenSSL 3.0
FROM node:20-bookworm-slim

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制 Prisma Schema
COPY prisma ./prisma/

# 生成 Prisma Client
RUN npx prisma generate

# 复制所有源代码
COPY . .

# 暴露端口
EXPOSE 3001

# 启动命令
CMD ["npm", "start"]