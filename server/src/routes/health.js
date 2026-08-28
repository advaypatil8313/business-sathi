import { Router } from 'express';
import { checkOllamaHealth } from '../services/ollamaService.js';
import { env } from '../config/env.js';

const router = Router();

router.get('/ollama', async (req, res) => {
  const health = await checkOllamaHealth();
  res.json({ ...health, baseUrl: env.ollamaBaseUrl, model: env.ollamaModel });
});

export default router;
