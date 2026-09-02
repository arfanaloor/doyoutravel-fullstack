const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username);
  if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const token = jwt.sign(
    { sub: admin.id, username: admin.username },
    process.env.JWT_SECRET,
    { expiresIn: '12h' }
  );

  res.json({ token, username: admin.username });
});

// Lets the admin dashboard confirm a stored token is still valid on page load.
router.get('/verify', requireAdmin, (req, res) => {
  res.json({ valid: true, username: req.admin.username });
});

module.exports = router;
