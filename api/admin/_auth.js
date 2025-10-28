const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const COOKIE_NAME = process.env.ADMIN_COOKIE_NAME || 'admin_session';
const SESSION_TTL_HOURS = Number(process.env.ADMIN_SESSION_TTL_HOURS || 8);
const SECURE_COOKIES = process.env.NODE_ENV === 'production';

function getJwtSecret() {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) throw new Error('Missing ADMIN_JWT_SECRET');
  return secret;
}

function setSessionCookie(res, payload) {
  const token = jwt.sign(payload, getJwtSecret(), { algorithm: 'HS256', expiresIn: `${SESSION_TTL_HOURS}h` });
  const maxAge = SESSION_TTL_HOURS * 60 * 60; // seconds
  const parts = [
    `${COOKIE_NAME}=${token}`,
    `Path=/`,
    `HttpOnly`,
    `SameSite=Lax`,
  ];
  if (SECURE_COOKIES) parts.push('Secure');
  parts.push(`Max-Age=${maxAge}`);
  res.setHeader('Set-Cookie', parts.join('; '));
}

function clearSessionCookie(res) {
  const parts = [
    `${COOKIE_NAME}=`,
    `Path=/`,
    `HttpOnly`,
    `SameSite=Lax`,
    `Max-Age=0`,
  ];
  if (SECURE_COOKIES) parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
}

function parseCookies(req) {
  const header = req.headers && req.headers.cookie;
  const out = {};
  if (!header) return out;
  header.split(';').forEach((p) => {
    const idx = p.indexOf('=');
    if (idx > -1) {
      const k = p.slice(0, idx).trim();
      const v = p.slice(idx + 1).trim();
      out[k] = decodeURIComponent(v);
    }
  });
  return out;
}

function verifySession(req) {
  try {
    const cookies = parseCookies(req);
    const token = cookies[COOKIE_NAME];
    if (!token) return null;
    const payload = jwt.verify(token, getJwtSecret(), { algorithms: ['HS256'] });
    return payload;
  } catch (_) {
    return null;
  }
}

async function verifyCredentials(username, password) {
  const envUser = process.env.ADMIN_USERNAME;
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!envUser || !hash) {
    throw new Error('Admin login not configured');
  }
  if (username !== envUser) return false;
  try {
    return await bcrypt.compare(password, hash);
  } catch (_) {
    return false;
  }
}

function requireAdmin(req, res) {
  const payload = verifySession(req);
  if (!payload) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return null;
  }
  return payload;
}

module.exports = {
  setSessionCookie,
  clearSessionCookie,
  verifySession,
  verifyCredentials,
  requireAdmin,
};
