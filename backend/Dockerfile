# 使用 Node.js 18 Debian (Bookworm)
FROM node:18-bookworm-slim AS builder

# 【关键】安装 OpenSSL 1.1.x（从 Debian Bullseye 源获取）
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# 下载并安装 OpenSSL 1.1.1w
RUN wget http://security.debian.org/debian-security/pool/updates/main/o/openssl/libssl1.1_1.1.1w-0+deb11u1_amd64.deb \
    && dpkg -i libssl1.1_1.1.1w-0+deb11u1_amd64.deb \
    && rm libssl1.1_1.1.1w-0+deb11u1_amd64.deb

# 设置工作目录
WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制 Prisma Schema
COPY prisma ./prisma/

# 【关键】设置环境变量，强制 Prisma 使用 OpenSSL 1.1.x
ENV PRISMA_CLI_BINARY_TARGETS=debian-openssl-1.1.x
ENV OPENSSL_CONF=/etc/ssl/openssl.cnf

# 生成 Prisma Client
RUN npx prisma generate

# 复制所有源代码
COPY . .

# 生产阶段
FROM node:18-bookworm-slim AS runner

# 再次安装 OpenSSL 1.1.x
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN wget http://security.debian.org/debian-security/pool/updates/main/o/openssl/libssl1.1_1.1.1w-0+deb11u1_amd64.deb \
    && dpkg -i libssl1.1_1.1.1w-0+deb11u1_amd64.deb \
    && rm libssl1.1_1.1.1w-0+deb11u1_amd64.deb

# 设置工作目录
WORKDIR /app

# 设置生产环境和 Prisma 环境变量
ENV NODE_ENV=production
ENV PRISMA_CLI_BINARY_TARGETS=debian-openssl-1.1.x

# 从 builder 阶段复制文件
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src

# 暴露端口
EXPOSE 3001

# 启动命令
CMD ["npm", "start"]