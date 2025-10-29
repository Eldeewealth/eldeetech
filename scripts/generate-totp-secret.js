#!/usr/bin/env node
// Generate a TOTP secret and helper info for Google Authenticator or similar apps.
// Usage:
//   node scripts/generate-totp-secret.js --issuer="ELDEETECH" --account="admin"

const crypto = require('crypto');
const { generateTotp } = require('../api/_totp');

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (const arg of args) {
    const [k, v] = arg.split('=');
    if (k && v) {
      const key = k.replace(/^--/, '');
      out[key] = v.replace(/^"|"$/g, '');
    }
  }
  return out;
}

const opts = parseArgs();
const issuer = opts.issuer || process.env.ADMIN_TOTP_ISSUER || 'ELDEETECH';
const account = opts.account || process.env.ADMIN_TOTP_ACCOUNT || 'admin';
const digits = Number(opts.digits || 6);
const period = Number(opts.period || 30);

function base32Encode(buffer) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = '';
  let output = '';
  for (const byte of buffer) {
    bits += byte.toString(2).padStart(8, '0');
    while (bits.length >= 5) {
      const chunk = bits.slice(0, 5);
      bits = bits.slice(5);
      output += alphabet[parseInt(chunk, 2)];
    }
  }
  if (bits.length > 0) {
    output += alphabet[parseInt(bits.padEnd(5, '0'), 2)];
  }
  while (output.length % 8 !== 0) output += '=';
  return output;
}

const random = crypto.randomBytes(20); // 160-bit secret
const secret = base32Encode(random);

const label = `${issuer}:${account}`;
const otpauth = `otpauth://totp/${encodeURIComponent(label)}?secret=${secret.replace(/=/g, '')}&issuer=${encodeURIComponent(issuer)}&digits=${digits}&period=${period}`;

const currentTotp = generateTotp(secret, { digits, step: period });
const nextTotp = generateTotp(secret, { digits, step: period, epoch: Math.floor(Date.now() / 1000) + period });

console.log('=== TOTP Secret Generated ===');
console.log(`Issuer:         ${issuer}`);
console.log(`Account label:  ${account}`);
console.log(`Secret (base32): ${secret}`);
console.log(`otpauth URI:    ${otpauth}`);
console.log();
console.log('Current code:   ', currentTotp);
console.log(`Next code (~${period}s):`, nextTotp);
console.log();
console.log('To create a QR code you can run:');
console.log(`  npx qrcode-terminal "${otpauth}"`);
console.log();
console.log('Add to Google Authenticator by scanning the QR or entering the secret manually.');
console.log('Remember to store the secret securely.');
