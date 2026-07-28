# 多阶段构建 - 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 复制 package 文件
COPY package*.json ./
COPY frontend/package*.json ./frontend/

# 安装所有依赖（包括 devDependencies）
RUN npm install

# 复制前端代码并构建
COPY frontend ./frontend
WORKDIR /app/frontend
RUN npm run build

# 生产阶段
FROM node:18-alpine

WORKDIR /app

# 创建数据和上传目录
RUN mkdir -p /app/backend/data /app/backend/uploads

# 复制后端相关文件和依赖
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install --production

# 复制后端代码
WORKDIR /app
COPY backend ./backend

# 从构建阶段复制构建好的前端静态文件
COPY --from=builder /app/frontend/dist ./backend/public

WORKDIR /app/backend

# 暴露端口
EXPOSE 3000

# 启动服务
CMD ["node", "server.js"]
