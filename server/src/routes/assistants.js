import { Router } from 'express';
import { assistants } from '../assistants/index.js';

const router = Router();

router.get('/', (req, res) => {
  const list = assistants.map(({ key, name, tagline, description, suggestedPrompts }) => ({
    key, name, tagline, description, suggestedPrompts,
  }));
  res.json(list);
});

export default router;
