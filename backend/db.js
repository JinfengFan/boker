const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

let db = null;
// 支持自定义数据库路径，默认在 data 目录下
const DB_DIR = process.env.DB_PATH || path.join(__dirname, 'data');
const DB_PATH = path.join(DB_DIR, 'blog.db');

// 确保数据库目录存在
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// 初始化数据库
async function initDB() {
  const SQL = await initSqlJs();
  
  // 如果数据库文件存在，则加载
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // 创建表
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      summary TEXT,
      cover_image TEXT,
      author_id INTEGER NOT NULL,
      category_id INTEGER,
      views INTEGER DEFAULT 0,
      published INTEGER DEFAULT 0,
      custom_date DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES users(id),
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      article_id INTEGER NOT NULL,
      user_id INTEGER,
      nickname TEXT NOT NULL,
      email TEXT NOT NULL,
      content TEXT NOT NULL,
      approved INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  saveDB();
  console.log('数据库初始化完成');
}

// 保存数据库到文件
function saveDB() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

// 辅助函数：运行查询
function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    try {
      db.run(sql, params);
      saveDB();
      resolve({ lastID: db.exec("SELECT last_insert_rowid()")[0].values[0][0], changes: db.getRowsModified() });
    } catch (err) {
      reject(err);
    }
  });
}

// 辅助函数：获取单行
function getAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      if (stmt.step()) {
        const row = stmt.getAsObject();
        stmt.free();
        resolve(row);
      } else {
        stmt.free();
        resolve(null);
      }
    } catch (err) {
      reject(err);
    }
  });
}

// 辅助函数：获取多行
function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      const results = [];
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      stmt.free();
      resolve(results);
    } catch (err) {
      reject(err);
    }
  });
}

// 导出 db 对象，包含异步方法
module.exports = { 
  runAsync,
  getAsync,
  allAsync,
  initDB,
  saveDB
};
