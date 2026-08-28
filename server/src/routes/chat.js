import { Router } from 'express';
import db from '../db/sqlite.js';
import { getAssistant } from '../assistants/index.js';
import { chatWithOllama } from '../services/ollamaService.js';
import { withContext } from '../services/contextService.js';

const router = Router();

router.post('/', async (req, res) => {
  const { assistantKey, conversationId, message } = req.body || {};

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message cannot be empty.' });
  }
  const assistant = getAssistant(assistantKey);
  if (!assistant) {
    return res.status(400).json({ error: 'Unknown assistant.' });
  }

  try {
    let convoId = conversationId;
    if (!convoId) {
      const result = db.prepare('INSERT INTO conversations (business_id, assistant_key, title) VALUES (1, ?, ?)')
        .run(assistant.key, message.trim().slice(0, 60));
      convoId = result.lastInsertRowid;
    } else {
      const exists = db.prepare('SELECT id FROM conversations WHERE id = ?').get(convoId);
      if (!exists) return res.status(404).json({ error: 'Conversation not found.' });
    }

    db.prepare('INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)')
      .run(convoId, 'user', message.trim());

    // Keep only the last 12 messages of history to keep prompts small
    const history = db.prepare('SELECT role, content FROM messages WHERE conversation_id = ? ORDER BY created_at ASC')
      .all(convoId)
      .slice(-12);

    const business = db.prepare('SELECT * FROM businesses WHERE id = 1').get();
    const systemPrompt = withContext(assistant.systemPrompt, business);

    const reply = await chatWithOllama(systemPrompt, history);

    db.prepare('INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)')
      .run(convoId, 'assistant', reply);

    db.prepare('INSERT INTO activity (business_id, assistant_key, action) VALUES (1, ?, ?)')
      .run(assistant.key, `Asked: "${message.trim().slice(0, 80)}"`);

    res.json({ conversationId: convoId, reply });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(502).json({
      error: "Ollama isn't available right now. Make sure Ollama is running (ollama serve) and that the model is pulled, then try again.",
      details: err.message,
    });
  }
});

export default router;
