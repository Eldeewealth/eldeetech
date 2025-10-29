const { setSessionCookie, verifyCredentials } = require('./_auth');
const { verifyTotp } = require('../_totp');

// In-memory rate limiting per IP+username
const attempts = new Map();
function keyFor(req, username) {
  const ip = (req.headers['x-forwarded-for'] || '').toString().split(',')[0].trim() || 'unknown';
  const user = (username || '').toString().trim().toLowerCase();
  return `${ip}|${user}`;
}
function getLimitConf() {
  return {
    max: Number(process.env.ADMIN_LOGIN_MAX_ATTEMPTS || 3),
    windowSec: Number(process.env.ADMIN_LOGIN_WINDOW_SECONDS || 900),
    lockSec: Number(process.env.ADMIN_LOGIN_LOCK_SECONDS || 900),
  };
}
function rateCheck(req, username) {
  const { windowSec } = getLimitConf();
  const now = Date.now();
  const k = keyFor(req, username);
  let rec = attempts.get(k);
  if (!rec) rec = { count: 0, first: now, lockedUntil: 0 };
  if (rec.lockedUntil && now >= rec.lockedUntil) { rec.count = 0; rec.first = now; rec.lockedUntil = 0; }
  if (now - rec.first > windowSec * 1000) { rec.count = 0; rec.first = now; rec.lockedUntil = 0; }
  attempts.set(k, rec);
  return rec;
}
function recordFailure(req, username) {
  const { max, lockSec } = getLimitConf();
  const k = keyFor(req, username);
  const rec = attempts.get(k) || { count: 0, first: Date.now(), lockedUntil: 0 };
  rec.count += 1;
  if (rec.count >= max) rec.lockedUntil = Date.now() + lockSec * 1000;
  attempts.set(k, rec);
}
function clearAttempts(req, username) {
  attempts.delete(keyFor(req, username));
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  try {
    const { username, password, otp } = req.body || {};
    if (!username || !password) return res.status(400).json({ success: false, message: 'Missing credentials' });

    // Optional email-domain constraint on username
    const domainRe = process.env.ADMIN_USERNAME_DOMAIN_REGEX;
    if (domainRe) {
      try {
        const re = new RegExp(domainRe, 'i');
        if (!re.test(String(username))) {
          return res.status(400).json({ success: false, message: 'Username must match the required email domain policy' });
        }
      } catch (_) { /* ignore invalid regex */ }
    }

    const rec = rateCheck(req, username);
    const { max } = getLimitConf();
    const otpSecret = process.env.ADMIN_TOTP_SECRET || '';
    const otpRequiredAlways = process.env.ADMIN_TOTP_REQUIRED === 'true';
    const otpOnExcess = (process.env.ADMIN_TOTP_ON_EXCESS || 'true') === 'true';

    // If locked, allow bypass with valid OTP when configured
    if (rec.lockedUntil && Date.now() < rec.lockedUntil) {
      if (otpOnExcess && otpSecret) {
        if (!otp || !verifyTotp(otp, otpSecret)) {
          return res.status(429).json({ success: false, message: 'Too many attempts. Provide a valid 2FA code to continue.' });
        }
      } else {
        return res.status(429).json({ success: false, message: 'Too many attempts. Please try again later.' });
      }
    }

    const ok = await verifyCredentials(username, password);
    if (!ok) {
      recordFailure(req, username);
      const remaining = Math.max(0, max - rateCheck(req, username).count);
      return res.status(401).json({ success: false, message: remaining ? `Invalid credentials. Attempts remaining: ${remaining}` : 'Invalid credentials. Too many attempts.' });
    }

    // TOTP requirements
    if (otpRequiredAlways && otpSecret) {
      if (!otp || !verifyTotp(otp, otpSecret)) {
        return res.status(401).json({ success: false, message: 'Two-factor code required' });
      }
    } else if (otpOnExcess && otpSecret && rec.count >= max) {
      if (!otp || !verifyTotp(otp, otpSecret)) {
        return res.status(401).json({ success: false, message: 'Two-factor code required (after multiple attempts)' });
      }
    }

    setSessionCookie(res, { sub: username, role: 'admin' });
    clearAttempts(req, username);
    return res.status(200).json({ success: true });
  } catch (e) {
    const msg = e && e.message ? e.message : 'Login failed';
    return res.status(500).json({ success: false, message: msg });
  }
};
