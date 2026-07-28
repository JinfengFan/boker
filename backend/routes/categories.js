const express = require('express');
const { runAsync, getAsync, allAsync } = require('../db');

const router = express.Router();

// 获取所有分类
router.get('/', async (req, res) => {
  try {
    const categories = await allAsync(`
      SELECT c.*, COUNT(a.id) as article_count
      FROM categories c
      LEFT JOIN articles a ON c.id = a.category_id AND a.published = 1
      GROUP BY c.id
      ORDER BY c.name
    `);

    res.json(categories);
  } catch (error) {
    console.error('获取分类失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 创建分类
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: '分类名称不能为空' });
    }

    const result = await runAsync(`
      INSERT INTO categories (name, description)
      VALUES (?, ?)
    `, [name, description || '']);

    res.status(201).json({
      id: result.lastID,
      message: '分类创建成功'
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ message: '分类名称已存在' });
    }
    console.error('创建分类失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新分类
router.put('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;

    const result = await runAsync(`
      UPDATE categories
      SET name = ?, description = ?
      WHERE id = ?
    `, [name, description || '', req.params.id]);

    if (result.changes === 0) {
      return res.status(404).json({ message: '分类不存在' });
    }

    res.json({ message: '分类更新成功' });
  } catch (error) {
    console.error('更新分类失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除分类
router.delete('/:id', async (req, res) => {
  try {
    const result = await runAsync('DELETE FROM categories WHERE id = ?', [req.params.id]);

    if (result.changes === 0) {
      return res.status(404).json({ message: '分类不存在' });
    }

    res.json({ message: '分类已删除' });
  } catch (error) {
    console.error('删除分类失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;
