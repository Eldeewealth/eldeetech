// Local dev API server to avoid deprecated transitive deps from CLI emulators
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env'), override: true });
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local'), override: true });

const express = require('express');

const app = express();
app.use(express.json({ limit: '1mb' }));

// Reuse the same Vercel handlers for consistency
const sendMailHandler = require('./send-mail.js');
const adminLogin = require('./admin/login.js');
const adminLogout = require('./admin/logout.js');
const adminMe = require('./admin/me.js');
const adminSubmissions = require('./admin/submissions.js');
const adminExport = require('./admin/export.js');
const adminStats = require('./admin/stats.js');
const adminUpdate = require('./admin/update.js');
const suggestService = require('./admin/suggest-service.js');
const suggestSearch = require('./admin/suggest-search.js');

function mount(method, path, handler) {
  app[method](path, (req, res) => {
    Promise.resolve(handler(req, res)).catch((err) => {
      const msg = err && err.message ? err.message : 'Internal Server Error';
      res.status(500).json({ success: false, message: msg });
    });
  });
}

mount('post', '/api/send-mail', sendMailHandler);
mount('post', '/api/admin/login', adminLogin);
mount('post', '/api/admin/logout', adminLogout);
mount('get', '/api/admin/me', adminMe);
mount('get', '/api/admin/submissions', adminSubmissions);
mount('get', '/api/admin/export.csv', adminExport);
mount('get', '/api/admin/stats', adminStats);
mount('post', '/api/admin/update', adminUpdate);
mount('get', '/api/admin/suggest/service', suggestService);
mount('get', '/api/admin/suggest/search', suggestSearch);

// Optional health check
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// 404 fallback
app.use((_req, res) => res.status(404).json({ error: 'Not Found' }));

const PORT = 3000; // matches Vite proxy target
app.listen(PORT, () => {
  console.log(`Local API server listening at http://localhost:${PORT}`);
});
