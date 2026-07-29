# 多阶段构建 - 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 复制根目录 package.json（包含所有依赖）
COPY package*.json ./

# 安装所有依赖
RUN npm install

# 复制前端代码并构建
COPY frontend/package*.json ./frontend/
COPY frontend ./frontend
WORKDIR /app/frontend
RUN npm run build

# 生产阶段
FROM node:20-alpine

WORKDIR /app

# 创建目录
RUN mkdir -p /app/backend/data /app/backend/uploads

# 复制根目录 package.json 并安装生产依赖
COPY package*.json ./
RUN npm install --omit=dev

# 复制后端代码
COPY backend ./backend

# 从构建阶段复制构建好的前端静态文件
COPY --from=builder /app/frontend/dist ./backend/public

WORKDIR /app/backend

# 暴露端口
EXPOSE 3000

# 启动服务
CMD ["node", "server.js"]