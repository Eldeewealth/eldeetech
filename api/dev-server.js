// Local dev API server to avoid deprecated transitive deps from CLI emulators
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env'), override: true });
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local'), override: true });

const express = require('express');

const app = express();
app.use(express.json({ limit: '1mb' }));

// Reuse the same Vercel handler for consistency
const sendMailHandler = require('./send-mail.js');

app.post('/api/send-mail', (req, res) => {
  // The handler expects Express-like req/res; this is compatible
  return sendMailHandler(req, res);
});

// Optional health check
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// 404 fallback
app.use((_req, res) => res.status(404).json({ error: 'Not Found' }));

const PORT = 3000; // matches Vite proxy target
app.listen(PORT, () => {
  console.log(`Local API server listening at http://localhost:${PORT}`);
});