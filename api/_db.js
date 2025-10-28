async function getSql() {
  try {
    const candidates = [
      process.env.DATABASE_URL,
      process.env.POSTGRES_URL_NON_POOLING,
      process.env.DATABASE_URL_UNPOOLED,
      process.env.POSTGRES_URL,
      process.env.POSTGRES_PRISMA_URL,
    ].filter(Boolean);
    const url = candidates[0];
    if (!url) return null;
    const mod = await import('@neondatabase/serverless');
    return mod.neon(url);
  } catch (_) {
    return null;
  }
}

async function ensureContactSchema(sql) {
  if (!sql) return;
  try {
    // Some drivers disallow multiple statements; run separately.
    await sql`ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS handled BOOLEAN DEFAULT FALSE`;
    await sql`ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS notes TEXT`;
    await sql`ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS handled_at TIMESTAMPTZ`;
    await sql`ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS handled_by TEXT`;
    await sql`CREATE INDEX IF NOT EXISTS idx_contact_submissions_handled ON contact_submissions (handled)`;
  } catch (e) {
    console.error('ensureContactSchema error:', e && e.message ? e.message : e);
  }
}

module.exports = { getSql, ensureContactSchema };
