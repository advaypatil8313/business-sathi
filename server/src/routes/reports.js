import { Router } from 'express';
import db from '../db/sqlite.js';
import { analyzeBusinessData } from '../services/analysisService.js';
import { chatWithOllama } from '../services/ollamaService.js';
import { buildBusinessContext } from '../services/contextService.js';

const router = Router();

const REPORT_SYSTEM_PROMPT = `You are the Business Analyst inside Business Sathi.
Write a clear weekly business report using ONLY the calculated data given to you — never invent numbers.
Structure the report with short headings: Sales Overview, Top Products, Inventory Observations, Concerns, Recommendations.
If a section has nothing meaningful to say (e.g. no trend data), say so briefly instead of making something up.
Keep it concise, specific, and practical — this is for a busy local business owner, not a formal corporate report.`;

router.post('/weekly', async (req, res) => {
  const latest = db.prepare('SELECT * FROM business_data ORDER BY created_at DESC LIMIT 1').get();
  if (!latest) {
    return res.status(400).json({ error: 'No business data has been uploaded yet. Upload a CSV first.' });
  }

  const business = db.prepare('SELECT * FROM businesses WHERE id = 1').get();
  const rows = JSON.parse(latest.data);
  const analysis = analyzeBusinessData(rows, { lowStockThreshold: business?.low_stock_threshold ?? 5 });

  const userPrompt = `Business context:\n${buildBusinessContext(business)}\n\nCalculated data (source file: ${latest.filename}, ${analysis.rowCount} rows):\n${JSON.stringify(analysis, null, 2)}\n\nWrite the weekly report.`;

  try {
    const content = await chatWithOllama(REPORT_SYSTEM_PROMPT, [{ role: 'user', content: userPrompt }]);

    db.prepare('INSERT INTO reports (business_id, content, stats_json) VALUES (1, ?, ?)')
      .run(content, JSON.stringify(analysis));
    db.prepare('INSERT INTO activity (business_id, assistant_key, action) VALUES (1, ?, ?)')
      .run('business-analyst', 'Generated weekly report');

    res.json({ content, analysis });
  } catch (err) {
    res.status(502).json({
      error: "Ollama isn't available right now. Make sure Ollama is running and try again.",
      details: err.message,
    });
  }
});

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT id, content, created_at FROM reports ORDER BY created_at DESC LIMIT 10').all();
  res.json(rows);
});

export default router;
