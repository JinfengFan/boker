# 个人博客系统

一个基于 React + Express 的全栈博客系统，采用前后端一体化架构。

## 🚀 快速开始

### 本地开发

### 1. 启动博客

双击运行 **`启动.bat`** 文件

### 2. 访问地址

启动成功后，在浏览器中打开：

- **前台首页**: http://localhost:5173
- **后台管理**: http://localhost:5173/admin

### 3. 默认账户

```
用户名：admin
密码：admin123
```

⚠️ 首次登录后请及时修改密码！

## 📦 技术栈

**前端**
- React 18 + TypeScript
- React Router v6
- Tailwind CSS
- React Markdown

**后端**
- Node.js + Express
- SQLite (sql.js)
- JWT 认证

## 📁 项目结构

```
boker/
├── backend/              # 后端代码
│   ├── server.js        # 主服务器
│   ├── db.js            # 数据库配置
│   ├── init-db.js       # 初始化脚本
│   ├── middleware/      # 中间件
│   └── routes/          # API 路由
├── frontend/            # 前端代码
│   └── src/             # 源代码
├── 启动.bat             # 启动脚本
├── package.json         # 项目配置
└── README.md            # 说明文档
```

## 🎯 功能特性

**前台**
- ✅ 文章列表展示（支持分类筛选）
- ✅ 文章详情页（Markdown 渲染 + 代码高亮）
- ✅ 评论功能
- ✅ 响应式设计

**后台**
- ✅ 登录认证（JWT）
- ✅ 文章管理（CRUD）
- ✅ 分类管理（CRUD）
- ✅ 评论管理（审核/删除）

## 🔧 开发命令

```bash
# 安装依赖
npm install

# 初始化数据库
npm run init:db

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 📝 API 接口

### 认证
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息

### 文章
- `GET /api/articles` - 获取文章列表
- `GET /api/articles/:id` - 获取文章详情
- `POST /api/articles` - 创建文章
- `PUT /api/articles/:id` - 更新文章
- `DELETE /api/articles/:id` - 删除文章

### 分类
- `GET /api/categories` - 获取分类列表
- `POST /api/categories` - 创建分类
- `PUT /api/categories/:id` - 更新分类
- `DELETE /api/categories/:id` - 删除分类

### 评论
- `GET /api/comments/article/:articleId` - 获取文章评论
- `POST /api/comments/article/:articleId` - 创建评论
- `GET /api/comments/admin/all` - 获取所有评论（管理）
- `PUT /api/comments/:id/approve` - 审核评论
- `DELETE /api/comments/:id` - 删除评论

## ⚙️ 环境变量

复制 `.env.example` 为 `.env`：

```env
PORT=3000
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

## 🛠️ 故障排查

### 端口被占用
修改 `.env` 文件中的端口号

### 数据库重置
```bash
del backend\blog.db
npm run init:db
```

### 依赖问题
```bash
npm cache clean --force
npm install
```

## 📄 License

MIT

---

## 🌐 部署到服务器

本项目支持一键部署到腾讯云 Lighthouse Ubuntu 服务器。

### 部署文件位置

所有部署相关的配置文件和脚本都在 **`deployment/`** 目录中。

### 快速部署

#### Windows 用户
1. 进入 `deployment` 目录
2. 双击运行 `上传密钥.cmd`（首次部署）
3. 双击运行 `部署.bat`

#### Mac/Linux 用户
```bash
cd deployment

# 首次部署 - 上传密钥
ssh-copy-id -i ~/.ssh/id_rsa.pub root@43.128.120.77 -p 22

# 执行部署
chmod +x deploy.sh && ./deploy.sh
```

### 部署文档

详细部署指南请查看 `deployment/` 目录中的文档：

- **00-开始部署.txt** - 快速开始指南 ⭐（建议首先阅读）
- **01-部署 README.md** - 项目概述和技术架构
- **02-快速部署指南.md** - 3 步快速部署教程
- **03-部署说明.md** - 完整的部署文档和故障排查
- **04-部署检查清单.md** - 部署验证清单
- **05-部署完成总结.md** - 部署总结和管理指南

### 服务器信息

- **服务器 IP**: 43.128.120.77
- **SSH 端口**: 22
- **SSH 用户**: root
- **访问地址**: http://43.128.120.77
- **部署目录**: /root/boker

### 技术架构

- **容器化**: Docker + Docker Compose
- **反向代理**: Nginx
- **应用服务**: Node.js + Express
- **数据库**: SQLite（持久化存储）

### 常用命令

```bash
# 查看容器状态
ssh root@43.128.120.77 "docker-compose ps"

# 查看日志
ssh root@43.128.120.77 "docker-compose logs -f"

# 重启服务
ssh root@43.128.120.77 "docker-compose restart"

# 停止服务
ssh root@43.128.120.77 "docker-compose down"

# 重新部署
ssh root@43.128.120.77 "docker-compose up -d --build"
```

### 配置域名和 SSL

1. **DNS 解析**：在域名服务商添加 A 记录指向 `43.128.120.77`
2. **修改配置**：编辑 `deployment/nginx.conf` 配置域名
3. **上传证书**：上传 SSL 证书到服务器
4. **启用 HTTPS**：重启 Nginx 容器

详细步骤请查看 [deployment/03-部署说明.md](./deployment/03-部署说明.md)

---
