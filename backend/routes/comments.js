const express = require('express');
const { runAsync, getAsync, allAsync } = require('../db');

const router = express.Router();

// 获取文章的评论
router.get('/article/:articleId', async (req, res) => {
  try {
    const comments = await allAsync(`
      SELECT c.*
      FROM comments c
      WHERE c.article_id = ? AND c.approved = 1
      ORDER BY c.created_at DESC
    `, [req.params.articleId]);

    res.json(comments);
  } catch (error) {
    console.error('获取评论失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 创建评论
router.post('/article/:articleId', async (req, res) => {
  try {
    const { nickname, email, content } = req.body;

    if (!nickname || !email || !content) {
      return res.status(400).json({ message: '请填写完整信息' });
    }

    // 检查文章是否存在
    const article = await getAsync('SELECT id FROM articles WHERE id = ?', [req.params.articleId]);
    if (!article) {
      return res.status(404).json({ message: '文章不存在' });
    }

    const result = await runAsync(`
      INSERT INTO comments (article_id, nickname, email, content, approved)
      VALUES (?, ?, ?, ?, 1)
    `, [req.params.articleId, nickname, email, content]);

    res.status(201).json({
      id: result.lastID,
      message: '评论成功'
    });
  } catch (error) {
    console.error('创建评论失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取所有评论（后台管理）
router.get('/admin/all', async (req, res) => {
  try {
    const comments = await allAsync(`
      SELECT c.*, a.title as article_title
      FROM comments c
      LEFT JOIN articles a ON c.article_id = a.id
      ORDER BY c.created_at DESC
    `);

    res.json(comments);
  } catch (error) {
    console.error('获取评论失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 审核评论
router.put('/:id/approve', async (req, res) => {
  try {
    const { approved } = req.body;

    await runAsync('UPDATE comments SET approved = ? WHERE id = ?', [approved ? 1 : 0, req.params.id]);
    res.json({ message: '评论状态已更新' });
  } catch (error) {
    console.error('审核评论失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除评论
router.delete('/:id', async (req, res) => {
  try {
    const result = await runAsync('DELETE FROM comments WHERE id = ?', [req.params.id]);

    if (result.changes === 0) {
      return res.status(404).json({ message: '评论不存在' });
    }

    res.json({ message: '评论已删除' });
  } catch (error) {
    console.error('删除评论失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;
