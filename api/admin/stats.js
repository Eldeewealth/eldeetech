const { requireAdmin } = require('./_auth');
const { getSql } = require('../_db');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  if (!requireAdmin(req, res)) return;

  try {
    const sql = await getSql();
    if (!sql) return res.status(500).json({ success: false, message: 'Database not configured' });

    const url = new URL(req.url, 'http://localhost');
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');

    const end = to ? new Date(to) : new Date();
    // normalize to date without time
    const endDate = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()));
    const start = from ? new Date(from) : new Date(endDate.getTime() - 29 * 86400000);
    const startDate = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));

    // Inclusive range: [startDate, endDate]
    const endExclusive = new Date(endDate.getTime() + 86400000); // +1 day

    const [totals] = await sql`
      SELECT 
        COUNT(*)::int AS total,
        SUM(CASE WHEN admin_sent THEN 1 ELSE 0 END)::int AS admin_ok,
        SUM(CASE WHEN customer_sent THEN 1 ELSE 0 END)::int AS customer_ok
      FROM contact_submissions
      WHERE created_at >= ${startDate.toISOString()} AND created_at < ${endExclusive.toISOString()}
    `;

    const daily = await sql`
      WITH series AS (
        SELECT generate_series(${startDate.toISOString()}::date, ${endDate.toISOString()}::date, '1 day') AS d
      )
      SELECT 
        d::date AS date,
        COALESCE(COUNT(cs.*), 0)::int AS count
      FROM series s
      LEFT JOIN contact_submissions cs ON cs.created_at::date = s.d
      GROUP BY d
      ORDER BY d
    `;

    const byService = await sql`
      SELECT COALESCE(service_slug, '(none)') AS service_slug, COUNT(*)::int AS count
      FROM contact_submissions
      WHERE created_at >= ${startDate.toISOString()} AND created_at < ${endExclusive.toISOString()}
      GROUP BY service_slug
      ORDER BY count DESC, service_slug ASC
      LIMIT 12
    `;

    res.status(200).json({ success: true, totals, daily, byService, range: { from: startDate.toISOString(), to: endDate.toISOString() } });
  } catch (e) {
    const msg = e && e.message ? e.message : 'Failed to load stats';
    res.status(500).json({ success: false, message: msg });
  }
};

