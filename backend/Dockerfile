FROM node:18-alpine

# 安装 libssl1.1（解决 Prisma 依赖问题）
RUN apk add --no-cache libssl1.1

WORKDIR /app

# 复制依赖文件并安装
COPY package*.json ./
RUN npm install

# 复制项目代码
COPY . .

# 生成 Prisma 客户端
RUN npx prisma generate

# 启动服务
CMD ["node", "src/app.js"]