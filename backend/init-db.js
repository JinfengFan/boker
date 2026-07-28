const { initDB, runAsync, getAsync, allAsync } = require('./db');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// 添加 custom_date 字段到 articles 表
async function addCustomDateColumn() {
  try {
    const dbPath = path.join(__dirname, 'blog.db');
    if (!fs.existsSync(dbPath)) {
      console.log('数据库文件不存在，跳过字段添加');
      return;
    }

    // 检查 custom_date 列是否存在
    const tableInfo = await allAsync("PRAGMA table_info(articles)");
    const hasCustomDate = tableInfo.some(col => col.name === 'custom_date');

    if (!hasCustomDate) {
      console.log('添加 custom_date 字段到 articles 表...');
      await runAsync('ALTER TABLE articles ADD COLUMN custom_date DATETIME');
      console.log('✓ custom_date 字段添加成功');
    } else {
      console.log('✓ custom_date 字段已存在');
    }
  } catch (error) {
    console.error('添加 custom_date 字段失败:', error);
  }
}

// 初始化数据库并创建默认管理员账户
async function setup() {
  try {
    await initDB();

    // 添加 custom_date 字段
    await addCustomDateColumn();

    // 检查是否已有管理员账户
    const existingUser = await getAsync('SELECT id FROM users WHERE username = ?', ['admin']);
    
    if (!existingUser) {
      // 创建默认管理员账户
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      await runAsync(`
        INSERT INTO users (username, password, email) 
        VALUES (?, ?, ?)
      `, ['admin', hashedPassword, 'admin@example.com']);

      console.log('默认管理员账户已创建：');
      console.log('用户名：admin');
      console.log('密码：admin123');
      console.log('请登录后及时修改密码！');
    } else {
      console.log('管理员账户已存在');
    }

    // 创建默认分类
    const categories = [
      ['技术', '技术相关文章'],
      ['生活', '生活随笔'],
      ['随笔', '心情随笔']
    ];

    for (const [name, description] of categories) {
      try {
        await runAsync(`
          INSERT INTO categories (name, description) 
          VALUES (?, ?)
        `, [name, description]);
      } catch (e) {
        // 忽略已存在的分类
      }
    }

    console.log('数据库初始化完成！');
  } catch (error) {
    console.error('初始化失败:', error);
    process.exit(1);
  }
}

setup();
