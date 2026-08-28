import { Router } from 'express';
import db from '../db/sqlite.js';

const router = Router();

router.get('/', (req, res) => {
  const business = db.prepare('SELECT * FROM businesses WHERE id = 1').get();
  res.json(business || null);
});

router.put('/', (req, res) => {
  const { name, type, location, products, customers, goal } = req.body || {};
  if (!name || !name.trim() || !type || !type.trim()) {
    return res.status(400).json({ error: 'Business name and type are required.' });
  }

  const existing = db.prepare('SELECT id FROM businesses WHERE id = 1').get();
  if (existing) {
    db.prepare(`UPDATE businesses SET name=?, type=?, location=?, products=?, customers=?, goal=?, updated_at=datetime('now') WHERE id=1`)
      .run(name.trim(), type.trim(), location || '', products || '', customers || '', goal || '');
  } else {
    db.prepare(`INSERT INTO businesses (id, name, type, location, products, customers, goal) VALUES (1, ?, ?, ?, ?, ?, ?)`)
      .run(name.trim(), type.trim(), location || '', products || '', customers || '', goal || '');
  }

  const business = db.prepare('SELECT * FROM businesses WHERE id = 1').get();
  res.json(business);
});

export default router;
