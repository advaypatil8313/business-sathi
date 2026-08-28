import { Router } from 'express';
import db from '../db/sqlite.js';

const router = Router();

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM activity ORDER BY created_at DESC LIMIT 15').all();
  res.json(rows);
});

export default router;
