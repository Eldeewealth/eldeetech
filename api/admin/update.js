const { requireAdmin } = require('./_auth');
const { getSql, ensureContactSchema } = require('../_db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  const me = requireAdmin(req, res);
  if (!me) return;

  try {
    const { ticket_id, handled, notes, handled_by } = req.body || {};
    if (!ticket_id) return res.status(400).json({ success: false, message: 'Missing ticket_id' });

    const sql = await getSql();
    if (!sql) return res.status(500).json({ success: false, message: 'Database not configured' });
    await ensureContactSchema(sql);

    const handledVal = typeof handled === 'boolean' ? handled : undefined;
    const notesVal = typeof notes === 'string' ? notes : undefined;
    const handledByValRaw = typeof handled_by === 'string' ? handled_by.trim() : undefined;
    const handledByVal = handledByValRaw !== undefined ? (handledByValRaw.length ? handledByValRaw : null) : undefined;

    if (handledVal === undefined && notesVal === undefined && handledByVal === undefined) {
      return res.status(400).json({ success: false, message: 'No updates provided' });
    }

    const handledBy = me?.sub || 'admin';
    const nowIso = new Date().toISOString();

    const setParts = [];
    const params = [];

    if (handledVal !== undefined) {
      setParts.push(`handled = $${params.length + 1}`);
      params.push(handledVal);

      setParts.push(`handled_at = $${params.length + 1}`);
      params.push(handledVal ? nowIso : null);

      const handledByFinal = handledVal ? (handledByVal !== undefined ? handledByVal : handledBy) : null;
      setParts.push(`handled_by = $${params.length + 1}`);
      params.push(handledByFinal);
    } else if (handledByVal !== undefined) {
      setParts.push(`handled_by = $${params.length + 1}`);
      params.push(handledByVal);
    }

    if (notesVal !== undefined) {
      setParts.push(`notes = $${params.length + 1}`);
      params.push(notesVal);
    }

    if (!setParts.length) {
      return res.status(400).json({ success: false, message: 'No updates to apply' });
    }

    params.push(ticket_id);

    const query = `
      UPDATE contact_submissions
      SET ${setParts.join(', ')}
      WHERE ticket_id = $${params.length}
      RETURNING ticket_id, name, email, phone, subject, subject_input, message, service_slug, admin_sent, customer_sent, error, created_at, handled, notes, handled_at, handled_by
    `;

    const rows = await sql(query, ...params);

    return res.status(200).json({ success: true, data: rows[0] });
  } catch (e) {
    const msg = e && e.message ? e.message : 'Failed to update submission';
    res.status(500).json({ success: false, message: msg });
  }
};
