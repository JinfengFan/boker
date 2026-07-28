const express = require('express');
const { runAsync, getAsync, allAsync } = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// 获取文章列表（分页）
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const categoryId = req.query.category;

    let query = `
      SELECT a.*, u.username as author, c.name as category_name
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.published = 1
    `;

    let countQuery = 'SELECT COUNT(*) as total FROM articles WHERE published = 1';
    const params = [];

    if (categoryId) {
      query += ' AND a.category_id = ?';
      countQuery += ' AND category_id = ?';
      params.push(categoryId);
    }

    query += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const articles = await allAsync(query, params);
    const totalResult = await getAsync(countQuery, categoryId ? [categoryId] : []);
    const total = totalResult.total;

    res.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('获取文章列表失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取文章详情
router.get('/:id', async (req, res) => {
  try {
    const article = await getAsync(`
      SELECT a.*, u.username as author, c.name as category_name
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.id = ?
    `, [req.params.id]);

    if (!article) {
      return res.status(404).json({ message: '文章不存在' });
    }

    // 增加阅读量
    await runAsync('UPDATE articles SET views = views + 1 WHERE id = ?', [req.params.id]);

    res.json(article);
  } catch (error) {
    console.error('获取文章详情失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 创建文章（需要登录）
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content, summary, cover_image, category_id, published = 0, custom_date } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: '标题和内容不能为空' });
    }

    const result = await runAsync(`
      INSERT INTO articles (title, content, summary, cover_image, author_id, category_id, published, custom_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, content, summary || '', cover_image || null, req.user.id, category_id || null, published ? 1 : 0, custom_date || null]);

    res.status(201).json({
      id: result.lastID,
      message: '文章创建成功'
    });
  } catch (error) {
    console.error('创建文章失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新文章
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, content, summary, cover_image, category_id, published, custom_date } = req.body;

    const article = await getAsync('SELECT * FROM articles WHERE id = ?', [req.params.id]);
    if (!article) {
      return res.status(404).json({ message: '文章不存在' });
    }

    await runAsync(`
      UPDATE articles
      SET title = ?, content = ?, summary = ?, cover_image = ?, category_id = ?, published = ?, custom_date = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      title || article.title,
      content || article.content,
      summary || article.summary,
      cover_image !== undefined ? cover_image : article.cover_image,
      category_id !== undefined ? category_id : article.category_id,
      published !== undefined ? (published ? 1 : 0) : article.published,
      custom_date !== undefined ? custom_date : article.custom_date,
      req.params.id
    ]);

    res.json({ message: '文章更新成功' });
  } catch (error) {
    console.error('更新文章失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除文章
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await runAsync('DELETE FROM articles WHERE id = ?', [req.params.id]);
    res.json({ message: '文章已删除' });
  } catch (error) {
    console.error('删除文章失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取所有文章（后台管理，包含未发布）
router.get('/admin/all', async (req, res) => {
  try {
    const articles = await allAsync(`
      SELECT a.*, u.username as author, c.name as category_name
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      LEFT JOIN categories c ON a.category_id = c.id
      ORDER BY a.created_at DESC
    `);

    res.json(articles);
  } catch (error) {
    console.error('获取文章列表失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;
