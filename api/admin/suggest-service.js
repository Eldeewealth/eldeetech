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
    const rows = await sql`
      SELECT service_slug, COUNT(*)::int AS c
      FROM contact_submissions
      WHERE service_slug IS NOT NULL AND service_slug <> ''
        AND (${hasQ} = false OR service_slug ILIKE ${q + '%'})
      GROUP BY service_slug
      ORDER BY c DESC, service_slug ASC
      LIMIT 10
    `;
    const options = rows.map(r => r.service_slug).filter(Boolean);
    res.status(200).json({ success: true, options });
  } catch (e) {
    const msg = e && e.message ? e.message : 'Failed to load suggestions';
    res.status(500).json({ success: false, message: msg });
  }
};

