const { requireAdmin } = require('./_auth');
const { getSql, ensureContactSchema } = require('../_db');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  if (!requireAdmin(req, res)) return; // sends 401 if not

  const url = new URL(req.url, 'http://localhost');
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(url.searchParams.get('pageSize') || '20', 10)));
  const q = (url.searchParams.get('q') || '').trim();
  const service = (url.searchParams.get('service') || '').trim();
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');

  try {
    const sql = await getSql();
    if (!sql) return res.status(500).json({ success: false, message: 'Database not configured' });
    await ensureContactSchema(sql);

    const offset = (page - 1) * pageSize;
    const hasQ = !!q;
    const hasService = !!service;
    const hasFrom = !!from;
    const hasTo = !!to;

    const rows = await sql`
      SELECT ticket_id, name, email, phone, subject, message, service_slug,
             admin_sent, customer_sent, error, created_at,
             handled, notes, handled_at, handled_by
      FROM contact_submissions
      WHERE
        (${hasQ} = false OR (name ILIKE ${'%' + q + '%'} OR email ILIKE ${'%' + q + '%'} OR subject ILIKE ${'%' + q + '%'} OR message ILIKE ${'%' + q + '%'}))
        AND (${hasService} = false OR service_slug = ${service})
        AND (${hasFrom} = false OR created_at >= ${from})
        AND (${hasTo} = false OR created_at <= ${to})
      ORDER BY created_at DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `;

    const [{ count }] = await sql`
      SELECT COUNT(*)::int AS count FROM contact_submissions
      WHERE
        (${hasQ} = false OR (name ILIKE ${'%' + q + '%'} OR email ILIKE ${'%' + q + '%'} OR subject ILIKE ${'%' + q + '%'} OR message ILIKE ${'%' + q + '%'}))
        AND (${hasService} = false OR service_slug = ${service})
        AND (${hasFrom} = false OR created_at >= ${from})
        AND (${hasTo} = false OR created_at <= ${to})
    `;

    res.status(200).json({ success: true, data: rows, page, pageSize, total: count });
  } catch (e) {
    const msg = e && e.message ? e.message : 'Failed to load submissions';
    res.status(500).json({ success: false, message: msg });
  }
};
