const express = require('express');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

const REQUIRED_FIELDS = ['title', 'category', 'region', 'duration', 'price', 'image'];
const ALLOWED_CATEGORIES = ['MICE', 'Group Fixed', 'Student'];
const ALLOWED_REGIONS = ['Domestic', 'International'];

function serialize(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    region: row.region,
    duration: row.duration,
    price: row.price,
    image: row.image,
    tags: safeParseArray(row.tags),
    description: row.description,
    inclusions: safeParseArray(row.inclusions),
    featured: !!row.featured,
    featuredDates: row.featured_dates,
    featuredRoute: row.featured_route,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function safeParseArray(value) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function validatePayload(body, { partial = false } = {}) {
  const errors = [];

  for (const field of REQUIRED_FIELDS) {
    if (!partial || body[field] !== undefined) {
      if (body[field] === undefined || String(body[field]).trim() === '') {
        errors.push(`"${field}" is required.`);
      }
    }
  }

  if (body.category !== undefined && !ALLOWED_CATEGORIES.includes(body.category)) {
    errors.push(`"category" must be one of: ${ALLOWED_CATEGORIES.join(', ')}.`);
  }

  if (body.region !== undefined && !ALLOWED_REGIONS.includes(body.region)) {
    errors.push(`"region" must be one of: ${ALLOWED_REGIONS.join(', ')}.`);
  }

  if (body.tags !== undefined && !Array.isArray(body.tags)) {
    errors.push('"tags" must be an array of strings.');
  }

  if (body.inclusions !== undefined && !Array.isArray(body.inclusions)) {
    errors.push('"inclusions" must be an array of strings.');
  }

  return errors;
}

// --- PUBLIC ---

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM packages ORDER BY sort_order ASC, id ASC').all();
  res.json(rows.map(serialize));
});

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM packages WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Package not found.' });
  res.json(serialize(row));
});

// --- ADMIN ---

router.post('/', requireAdmin, (req, res) => {
  const errors = validatePayload(req.body);
  if (errors.length) return res.status(400).json({ error: errors.join(' ') });

  const b = req.body;
  const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order), -1) AS m FROM packages').get().m;

  const info = db.prepare(`
    INSERT INTO packages
      (title, category, region, duration, price, image, tags, description, inclusions, featured, featured_dates, featured_route, sort_order, updated_at)
    VALUES (@title, @category, @region, @duration, @price, @image, @tags, @description, @inclusions, @featured, @featuredDates, @featuredRoute, @sortOrder, datetime('now'))
  `).run({
    title: b.title,
    category: b.category,
    region: b.region,
    duration: b.duration,
    price: String(b.price),
    image: b.image,
    tags: JSON.stringify(b.tags || []),
    description: b.description || '',
    inclusions: JSON.stringify(b.inclusions || []),
    featured: b.featured ? 1 : 0,
    featuredDates: b.featuredDates || '',
    featuredRoute: b.featuredRoute || '',
    sortOrder: maxOrder + 1
  });

  const row = db.prepare('SELECT * FROM packages WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(serialize(row));
});

router.put('/:id', requireAdmin, (req, res) => {
  const existing = db.prepare('SELECT * FROM packages WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Package not found.' });

  const errors = validatePayload(req.body, { partial: true });
  if (errors.length) return res.status(400).json({ error: errors.join(' ') });

  const b = req.body;
  const merged = {
    title: b.title ?? existing.title,
    category: b.category ?? existing.category,
    region: b.region ?? existing.region,
    duration: b.duration ?? existing.duration,
    price: b.price !== undefined ? String(b.price) : existing.price,
    image: b.image ?? existing.image,
    tags: JSON.stringify(b.tags ?? safeParseArray(existing.tags)),
    description: b.description ?? existing.description,
    inclusions: JSON.stringify(b.inclusions ?? safeParseArray(existing.inclusions)),
    featured: b.featured !== undefined ? (b.featured ? 1 : 0) : existing.featured,
    featuredDates: b.featuredDates ?? existing.featured_dates,
    featuredRoute: b.featuredRoute ?? existing.featured_route,
  };

  db.prepare(`
    UPDATE packages SET
      title = @title, category = @category, region = @region, duration = @duration,
      price = @price, image = @image, tags = @tags, description = @description,
      inclusions = @inclusions, featured = @featured, featured_dates = @featuredDates,
      featured_route = @featuredRoute, updated_at = datetime('now')
    WHERE id = @id
  `).run({ ...merged, id: req.params.id });

  const row = db.prepare('SELECT * FROM packages WHERE id = ?').get(req.params.id);
  res.json(serialize(row));
});

router.delete('/:id', requireAdmin, (req, res) => {
  const existing = db.prepare('SELECT * FROM packages WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Package not found.' });

  db.prepare('DELETE FROM packages WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
