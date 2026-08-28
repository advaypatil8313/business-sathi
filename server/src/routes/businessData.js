import { Router } from 'express';
import multer from 'multer';
import db from '../db/sqlite.js';
import { parseBusinessCsv } from '../services/csvService.js';
import { analyzeBusinessData } from '../services/analysisService.js';
import { sendLowStockEmail } from '../services/emailService.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const router = Router();

function getBusiness() {
  return db.prepare('SELECT * FROM businesses WHERE id = 1').get();
}

router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file was uploaded.' });
  }
  if (!req.file.originalname.toLowerCase().endsWith('.csv')) {
    return res.status(400).json({ error: 'Please upload a .csv file.' });
  }

  let parsed;
  try {
    parsed = parseBusinessCsv(req.file.buffer);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  db.prepare('INSERT INTO business_data (business_id, filename, data) VALUES (1, ?, ?)')
    .run(req.file.originalname, JSON.stringify(parsed.rows));

  const business = getBusiness();
  const threshold = business?.low_stock_threshold ?? 5;
  const analysis = analyzeBusinessData(parsed.rows, { lowStockThreshold: threshold });

  db.prepare('INSERT INTO activity (business_id, assistant_key, action) VALUES (1, ?, ?)')
    .run('business-analyst', `Uploaded business data (${req.file.originalname}, ${parsed.rows.length} rows)`);

  let emailResult = { sent: false, reason: 'No low-stock items detected.' };
  if (analysis.lowStockItems.length > 0) {
    emailResult = await sendLowStockEmail(business, analysis.lowStockItems);
    db.prepare('INSERT INTO low_stock_alerts (business_id, items_json, email_sent) VALUES (1, ?, ?)')
      .run(JSON.stringify(analysis.lowStockItems), emailResult.sent ? 1 : 0);
    db.prepare('INSERT INTO activity (business_id, assistant_key, action) VALUES (1, ?, ?)')
      .run(
        'business-analyst',
        emailResult.sent
          ? `Low-stock alert emailed for ${analysis.lowStockItems.length} product(s).`
          : `Low stock detected for ${analysis.lowStockItems.length} product(s) — email not sent (${emailResult.reason})`
      );
  }

  res.json({
    filename: req.file.originalname,
    rowsStored: parsed.rows.length,
    warnings: parsed.warnings,
    columnsDetected: parsed.columnsDetected,
    analysis,
    emailResult,
  });
});

router.get('/summary', (req, res) => {
  const latest = db.prepare('SELECT * FROM business_data ORDER BY created_at DESC LIMIT 1').get();
  if (!latest) return res.json(null);

  const rows = JSON.parse(latest.data);
  const business = getBusiness();
  const threshold = business?.low_stock_threshold ?? 5;
  const analysis = analyzeBusinessData(rows, { lowStockThreshold: threshold });

  res.json({ filename: latest.filename, uploadedAt: latest.created_at, ...analysis });
});

export default router;
