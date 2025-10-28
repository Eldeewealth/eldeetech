const { requireAdmin } = require('./_auth');
const { getSql } = require('../_db');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  if (!requireAdmin(req, res)) return;
  try {
    const url = new URL(req.url, 'http://localhost');
    const q = (url.searchParams.get('q') || '').trim();
    const sql = await getSql();
    if (!sql) return res.status(500).json({ success: false, message: 'Database not configured' });

    const hasQ = !!q;
    // Gather distinct suggestions across important fields; prefer prefix matches.
    const rows = await sql`
      SELECT val FROM (
        SELECT DISTINCT name AS val FROM contact_submissions WHERE (${hasQ} = false OR name ILIKE ${q + '%'}) LIMIT 10
      ) a
      UNION
      SELECT val FROM (
        SELECT DISTINCT email AS val FROM contact_submissions WHERE (${hasQ} = false OR email ILIKE ${q + '%'}) LIMIT 10
      ) b
      UNION
      SELECT val FROM (
        SELECT DISTINCT subject AS val FROM contact_submissions WHERE (${hasQ} = false OR subject ILIKE ${q + '%'}) LIMIT 10
      ) c
      UNION
      SELECT val FROM (
        SELECT DISTINCT message AS val FROM contact_submissions WHERE (${hasQ} = false OR message ILIKE ${q + '%'}) LIMIT 10
      ) d
      LIMIT 10
    `;
    const options = rows.map(r => r.val).filter(Boolean);
    res.status(200).json({ success: true, options });
  } catch (e) {
    const msg = e && e.message ? e.message : 'Failed to load suggestions';
    res.status(500).json({ success: false, message: msg });
  }
};

