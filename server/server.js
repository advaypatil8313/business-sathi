import express from 'express';
import cors from 'cors';
import { env } from './src/config/env.js';
import './src/db/sqlite.js'; // ensures schema is created on boot

import businessRoutes from './src/routes/business.js';
import assistantsRoutes from './src/routes/assistants.js';
import chatRoutes from './src/routes/chat.js';
import conversationsRoutes from './src/routes/conversations.js';
import healthRoutes from './src/routes/health.js';
import activityRoutes from './src/routes/activity.js';
import businessDataRoutes from './src/routes/businessData.js';
import reportsRoutes from './src/routes/reports.js';
import suggestionsRoutes from './src/routes/suggestions.js';
import settingsRoutes from './src/routes/settings.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.use('/api/business', businessRoutes);
app.use('/api/assistants', assistantsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/conversations', conversationsRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/business-data', businessDataRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/suggestions', suggestionsRoutes);
app.use('/api/settings', settingsRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

app.listen(env.port, () => {
  console.log(`Business Sathi server running on http://localhost:${env.port}`);
  console.log(`Ollama target: ${env.ollamaBaseUrl} (model: ${env.ollamaModel})`);
});
