const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 配置 multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    // 如果目录不存在则创建
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // 生成唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// 文件过滤器（只允许图片）
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('只允许上传图片文件（jpeg, jpg, png, gif, webp）'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 限制 5MB
  },
  fileFilter: fileFilter
});

// 上传接口
router.post('/', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer 错误:', err);
      return res.status(400).json({ message: '上传失败：' + err.message });
    }
    
    try {
      if (!req.file) {
        return res.status(400).json({ message: '没有上传文件' });
      }
      
      console.log('文件上传成功:', req.file.filename);
      
      // 返回图片访问路径
      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({
        url: imageUrl,
        path: imageUrl,
        filename: req.file.filename
      });
    } catch (error) {
      console.error('上传失败:', error);
      res.status(500).json({ message: '上传失败' });
    }
  });
});

module.exports = router;
