# 使用 Node.js 18 Alpine 作为基础镜像
FROM node:18-alpine AS builder

# 安装 OpenSSL 1.1（这是关键！）
RUN apk add --no-cache openssl1.1-compat

# 设置工作目录
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

# 生产阶段
FROM node:18-alpine AS runner

# 再次安装 OpenSSL 1.1
RUN apk add --no-cache openssl1.1-compat

WORKDIR /app

# 从 builder 阶段复制需要的文件
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src

# 暴露端口（Railway 会自动映射）
EXPOSE 3001

# 启动命令
CMD ["npm", "start"]