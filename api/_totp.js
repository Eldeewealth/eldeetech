// Minimal TOTP verifier (RFC 6238) using HMAC-SHA1 and 30s step
const crypto = require('crypto');

const B32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Decode(b32) {
  const s = String(b32 || '').trim().toUpperCase().replace(/=+$/g, '').replace(/\s+/g, '');
  let bits = '';
  for (let i = 0; i < s.length; i++) {
    const val = B32_ALPHABET.indexOf(s[i]);
    if (val === -1) continue; // skip unknown chars
    bits += val.toString(2).padStart(5, '0');
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }
  return Buffer.from(bytes);
}

function hotpSha1(secretBuf, counter, digits = 6) {
  const buf = Buffer.alloc(8);
  let c = BigInt(counter);
  for (let i = 7; i >= 0; i--) {
    buf[i] = Number(c & 0xffn);
    c >>= 8n;
  }
  const hmac = crypto.createHmac('sha1', secretBuf).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code = ((hmac[offset] & 0x7f) << 24) | (hmac[offset + 1] << 16) | (hmac[offset + 2] << 8) | hmac[offset + 3];
  const mod = 10 ** digits;
  return (code % mod).toString().padStart(digits, '0');
}

function verifyTotp(code, secretBase32, opts = {}) {
  try {
    const digits = opts.digits || 6;
    const step = opts.step || 30; // seconds
    const window = opts.window == null ? 1 : opts.window; // +/- steps
    const epoch = opts.epoch || Math.floor(Date.now() / 1000);
    const secret = base32Decode(secretBase32);
    const cur = Math.floor(epoch / step);
    const token = String(code || '').trim();
    if (!/^[0-9]{6,8}$/.test(token)) return false;
    for (let w = -window; w <= window; w++) {
      const counter = cur + w;
      const expect = hotpSha1(secret, counter, digits);
      if (expect === token) return true;
    }
    return false;
  } catch (_) {
    return false;
  }
}

function generateTotp(secretBase32, opts = {}) {
  const digits = opts.digits || 6;
  const step = opts.step || 30;
  const epoch = opts.epoch || Math.floor(Date.now() / 1000);
  const secret = base32Decode(secretBase32);
  const counter = Math.floor(epoch / step);
  return hotpSha1(secret, counter, digits);
}

module.exports = { verifyTotp, generateTotp, base32Decode };
