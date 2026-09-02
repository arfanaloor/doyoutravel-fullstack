const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads', 'packages');
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const name = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      return cb(new Error('Only JPG, PNG, WEBP, or GIF images are allowed.'));
    }
    cb(null, true);
  }
});

router.post('/', requireAdmin, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'No image file was provided.' });
    res.status(201).json({ url: `/uploads/packages/${req.file.filename}` });
  });
});

module.exports = router;
