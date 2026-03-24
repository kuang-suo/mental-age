# 使用 Node.js 18 Debian (Bookworm) 作为基础镜像
FROM node:18-bookworm-slim AS builder

# 设置工作目录
WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制 Prisma Schema
COPY prisma ./prisma/

# 生成 Prisma Client（Debian 环境下生成，兼容性最好）
RUN npx prisma generate

# 复制所有源代码
COPY . .

# 生产阶段
FROM node:18-bookworm-slim AS runner

# 设置工作目录
WORKDIR /app

# 设置生产环境
ENV NODE_ENV=production

# 从 builder 阶段复制需要的文件
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src

# 暴露端口
EXPOSE 3001

# 启动命令
CMD ["npm", "start"]