import { Router } from 'express';
import db from '../db/sqlite.js';

const router = Router();

// List conversations, optionally filtered by assistant
router.get('/', (req, res) => {
  const { assistant } = req.query;
  const rows = assistant
    ? db.prepare('SELECT * FROM conversations WHERE assistant_key = ? ORDER BY created_at DESC').all(assistant)
    : db.prepare('SELECT * FROM conversations ORDER BY created_at DESC').all();
  res.json(rows);
});

// Latest conversation (with messages) for a given assistant
router.get('/assistant/:key/latest', (req, res) => {
  const convo = db.prepare('SELECT * FROM conversations WHERE assistant_key = ? ORDER BY created_at DESC LIMIT 1')
    .get(req.params.key);
  if (!convo) return res.json(null);
  const messages = db.prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC').all(convo.id);
  res.json({ ...convo, messages });
});

router.get('/:id', (req, res) => {
  const convo = db.prepare('SELECT * FROM conversations WHERE id = ?').get(req.params.id);
  if (!convo) return res.status(404).json({ error: 'Conversation not found.' });
  const messages = db.prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC').all(convo.id);
  res.json({ ...convo, messages });
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM conversations WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

export default router;
