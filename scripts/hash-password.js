// Usage: npm run hash:password -- your-plain-password
// Prints a bcrypt hash you can paste into ADMIN_PASSWORD_HASH
const bcrypt = require('bcryptjs');

async function main() {
  const idx = process.argv.indexOf('--');
  const pwd = idx !== -1 ? process.argv.slice(idx + 1).join(' ') : process.argv[2];
  if (!pwd) {
    console.error('Usage: npm run hash:password -- "your-plain-password"');
    process.exit(1);
  }
  const hash = await bcrypt.hash(pwd, 12);
  console.log(hash);
}

main().catch((e) => { console.error(e); process.exit(1); });

