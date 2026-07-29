const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { initDB, runAsync, getAsync } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务（仅在生产环境）
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
}

// 导入路由
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');
const categoryRoutes = require('./routes/categories');
const commentRoutes = require('./routes/comments');
const uploadRoutes = require('./routes/upload');

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/upload', uploadRoutes);

// 静态文件服务（上传的图片）
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 前端路由（仅在生产环境）
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器错误' });
});

// 初始化数据库并创建默认用户，然后启动服务器
async function startServer() {
  try {
    await initDB();
    
    // 检查并创建默认管理员账户
    const existingUser = await getAsync('SELECT id FROM users WHERE username = ?', ['admin']);
    
    if (!existingUser) {
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      await runAsync(
        'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
        ['admin', hashedPassword, 'admin@example.com']
      );
      console.log('默认管理员账户已创建：');
      console.log('用户名：admin');
      console.log('密码：admin123');
      console.log('请登录后及时修改密码！');
    }
    
    // 创建默认分类
    const categories = [
      ['技术', '技术相关文章'],
      ['生活', '生活随笔'],
      ['随笔', '心情随笔']
    ];
    
    for (const [name, description] of categories) {
      try {
        await runAsync(
          'INSERT INTO categories (name, description) VALUES (?, ?)',
          [name, description]
        );
      } catch (e) {
        // 忽略已存在的分类
      }
    }
    
    console.log('数据库初始化完成！');
    
    app.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('启动失败:', err);
    process.exit(1);
  }
}

startServer();

module.exports = app;
