import { Router } from 'express';
import db from '../db/sqlite.js';
import { isEmailConfigured } from '../services/emailService.js';
import { env } from '../config/env.js';

const router = Router();

router.get('/', (req, res) => {
  const business = db.prepare('SELECT low_stock_threshold FROM businesses WHERE id = 1').get();
  const emailConfigured = isEmailConfigured();
  res.json({
    lowStockThreshold: business?.low_stock_threshold ?? env.defaultLowStockThreshold,
    emailConfigured,
    alertEmailTo: emailConfigured ? env.alertEmailTo : null,
  });
});

router.put('/', (req, res) => {
  const { lowStockThreshold } = req.body || {};
  const n = Number(lowStockThreshold);
  if (!Number.isFinite(n) || n < 0) {
    return res.status(400).json({ error: 'lowStockThreshold must be a non-negative number.' });
  }
  const business = db.prepare('SELECT id FROM businesses WHERE id = 1').get();
  if (!business) {
    return res.status(400).json({ error: 'Complete business onboarding before changing settings.' });
  }
  db.prepare('UPDATE businesses SET low_stock_threshold = ? WHERE id = 1').run(n);
  res.json({ lowStockThreshold: n });
});

export default router;
