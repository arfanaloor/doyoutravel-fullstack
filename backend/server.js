require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');

const db = require('./db');
const authRoutes = require('./routes/auth');
const packageRoutes = require('./routes/packages');
const uploadRoutes = require('./routes/upload');

if (!process.env.JWT_SECRET) {
  console.error('Missing JWT_SECRET in backend/.env — copy .env.example to .env first.');
  process.exit(1);
}

// Make sure an admin account + starter packages exist so the app works out of the box.
const adminCount = db.prepare('SELECT COUNT(*) AS n FROM admins').get().n;
const packageCount = db.prepare('SELECT COUNT(*) AS n FROM packages').get().n;
if (adminCount === 0 || packageCount === 0) {
  console.log('First run detected — seeding database...');
  require('child_process').execSync('node seed.js', { cwd: __dirname, stdio: 'inherit' });
}

const app = express();
const PORT = process.env.PORT || 4000;
const UPLOADS_DIR = path.join(__dirname, 'uploads');
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(UPLOADS_DIR));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/admin', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/admin/upload', uploadRoutes);

app.use((req, res) => res.status(404).json({ error: 'Not found.' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

app.listen(PORT, () => {
  console.log(`Do You Travel API running on http://localhost:${PORT}`);
});
