FROM node:18-alpine

# 关键步骤：安装缺失的 libssl1.1
RUN apk add --no-cache libssl1.1

WORKDIR /app

# 复制并安装依赖
COPY package*.json ./
RUN npm install

# 复制项目代码
COPY . .

# 生成 Prisma 客户端
RUN npx prisma generate

# 启动服务
CMD ["node", "src/app.js"]