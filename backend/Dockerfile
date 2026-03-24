FROM node:18-alpine

# 👇这一行是救命关键：直接安装缺失的 libssl1.1
RUN apk add --no-cache libssl1.1

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

CMD ["node", "src/app.js"]