// Lightweight disposable/temporary email domain detection
// Extend via env var DISPOSABLE_EMAIL_DOMAINS (comma-separated)

const BASE_SET = new Set([
  '10minutemail.com', '10minutemail.net', '10minutemail.co.uk',
  '20minutemail.com', '1secmail.com', 'guerrillamail.com', 'guerrillamailblock.com', 'sharklasers.com', 'grr.la',
  'mailinator.com', 'mailinator.net', 'mailinator.org', 'mailinator2.com',
  'yopmail.com', 'yopmail.fr', 'yopmail.net',
  'tempmail.com', 'tempmail.net', 'tempmail.dev', 'tempmail.email', 'tempmail.io', 'temp-mail.org', 'temp-mail.io',
  'getnada.com', 'nada.ltd', 'getairmail.com',
  'maildrop.cc', 'moakt.com', 'trashmail.com', 'dispostable.com', 'throwawaymail.com',
  'mailnesia.com', 'spamgourmet.com', 'spam4.me', 'fakeinbox.com',
  'emailondeck.com', 'mintemail.com', 'mytemp.email', 'tempail.com', 'tmail.ws', 'trbvm.com',
]);

// Allow additional domains from env var (comma-separated)
const extra = (process.env.DISPOSABLE_EMAIL_DOMAINS || process.env.BLOCKED_EMAIL_DOMAINS || '')
  .split(',')
  .map(s => s.trim().toLowerCase())
  .filter(Boolean);
for (const d of extra) BASE_SET.add(d);

function normalizeDomain(d) {
  try {
    return String(d || '').trim().toLowerCase();
  } catch (_) { return ''; }
}

function isDisposableDomain(domain) {
  const d = normalizeDomain(domain);
  if (!d) return false;
  if (BASE_SET.has(d)) return true;
  // Also check common subdomain patterns like foo.yopmail.com
  const parts = d.split('.');
  for (let i = 0; i < parts.length - 1; i++) {
    const candidate = parts.slice(i).join('.');
    if (BASE_SET.has(candidate)) return true;
  }
  return false;
}

module.exports = { isDisposableDomain };

