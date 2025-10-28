const { requireAdmin } = require('./_auth');
const { getSql, ensureContactSchema } = require('../_db');

function toCsv(rows) {
  if (!rows || !rows.length) return 'ticket_id,name,email,phone,subject,message,service_slug,admin_sent,customer_sent,error,created_at\n';
  const headers = Object.keys(rows[0]);
  const escape = (v) => {
    if (v == null) return '';
    const s = String(v).replace(/"/g, '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  };
  return headers.join(',') + '\n' + rows.map(r => headers.map(h => escape(r[h])).join(',')).join('\n');
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  if (!requireAdmin(req, res)) return;

  const url = new URL(req.url, 'http://localhost');
  const q = (url.searchParams.get('q') || '').trim();
  const service = (url.searchParams.get('service') || '').trim();
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');

  try {
    const sql = await getSql();
    if (!sql) return res.status(500).json({ success: false, message: 'Database not configured' });
    await ensureContactSchema(sql);

    const hasQ = !!q;
    const hasService = !!service;
    const hasFrom = !!from;
    const hasTo = !!to;

    const rows = await sql`
      SELECT ticket_id, name, email, phone, subject, subject_input, message, service_slug,
             admin_sent, customer_sent, error, created_at,
             handled, notes, handled_at, handled_by
      FROM contact_submissions
      WHERE
        (${hasQ} = false OR (name ILIKE ${'%' + q + '%'} OR email ILIKE ${'%' + q + '%'} OR subject ILIKE ${'%' + q + '%'} OR message ILIKE ${'%' + q + '%'}))
        AND (${hasService} = false OR service_slug = ${service})
        AND (${hasFrom} = false OR created_at >= ${from})
        AND (${hasTo} = false OR created_at <= ${to})
      ORDER BY created_at DESC
    `;

    const csv = toCsv(rows);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Disposition', 'attachment; filename="submissions.csv"');
    res.status(200).send(csv);
  } catch (e) {
    const msg = e && e.message ? e.message : 'Failed to export CSV';
    res.status(500).json({ success: false, message: msg });
  }
};
