import { Router } from 'express';
import db from '../db/sqlite.js';
import { analyzeBusinessData } from '../services/analysisService.js';
import { chatWithOllama } from '../services/ollamaService.js';
import { buildBusinessContext } from '../services/contextService.js';

const router = Router();

const SUGGESTIONS_SYSTEM_PROMPT = `You are Business Sathi's suggestion engine.
Give 3-5 specific, practical suggestions for this business based on its profile and, if provided, its actual sales/inventory data.
Never invent data that wasn't given to you. If no business data is available, say so and base suggestions only on the business profile.
Format as a short bulleted list. Each suggestion should be 1-2 sentences and something the owner could actually act on this week — no generic motivational advice.`;

router.post('/', async (req, res) => {
  const business = db.prepare('SELECT * FROM businesses WHERE id = 1').get();
  const latest = db.prepare('SELECT * FROM business_data ORDER BY created_at DESC LIMIT 1').get();
  const analysis = latest
    ? analyzeBusinessData(JSON.parse(latest.data), { lowStockThreshold: business?.low_stock_threshold ?? 5 })
    : null;

  const userPrompt = `Business context:\n${buildBusinessContext(business)}\n\n${
    analysis ? `Calculated data:\n${JSON.stringify(analysis, null, 2)}` : 'No business data has been uploaded yet.'
  }`;

  try {
    const content = await chatWithOllama(SUGGESTIONS_SYSTEM_PROMPT, [{ role: 'user', content: userPrompt }]);
    db.prepare('INSERT INTO activity (business_id, assistant_key, action) VALUES (1, ?, ?)')
      .run('business-advisor', 'Generated business suggestions');
    res.json({ content, hasData: Boolean(latest) });
  } catch (err) {
    res.status(502).json({
      error: "Ollama isn't available right now. Make sure Ollama is running and try again.",
      details: err.message,
    });
  }
});

export default router;
