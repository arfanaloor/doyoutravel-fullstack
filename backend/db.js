const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, 'data.sqlite');
const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS packages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    region TEXT NOT NULL,
    duration TEXT NOT NULL,
    price TEXT NOT NULL,
    image TEXT NOT NULL,
    tags TEXT NOT NULL DEFAULT '[]',
    description TEXT NOT NULL DEFAULT '',
    inclusions TEXT NOT NULL DEFAULT '[]',
    featured INTEGER NOT NULL DEFAULT 0,
    featured_dates TEXT NOT NULL DEFAULT '',
    featured_route TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
`);

module.exports = db;
