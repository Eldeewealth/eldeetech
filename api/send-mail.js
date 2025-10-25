const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

function formatDate(date, tz) {
  try {
    return new Intl.DateTimeFormat('en-NG', {
      timeZone: tz || 'Africa/Lagos',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(date);
  } catch (_) {
    return date.toISOString();
  }
}

function makeTicketId() {
  const num = Math.floor(1000000 + Math.random() * 9000000); // 7 digits
  return `CAS-${num}`;
}

function getBannerAttachment() {
  const bannerPath = path.join(process.cwd(), 'public', 'email-banner.svg');
  if (fs.existsSync(bannerPath)) {
    return {
      filename: 'email-banner.svg',
      path: bannerPath,
      cid: 'email-banner',
      contentType: 'image/svg+xml',
    };
  }
  return null;
}

function buildCustomerHtml(ticketId, dateStr, form, hasBanner) {
  const baseStyles = `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji'; color:#0f172a;`;
  const footer = hasBanner
    ? `<div style="margin-top:24px;text-align:center"><img src="cid:email-banner" alt="ELDEETECH" style="max-width:100%;height:auto"/></div>`
    : `<div style="margin-top:24px;padding:16px;background:#0b5ed7;color:#fff;text-align:center;border-radius:8px">Empowering Technology, Creativity and AI-Driven Innovation</div>`;

  return `
  <div style="${baseStyles}">
    <h2 style="margin:0 0 8px">We received your request — Ticket ${ticketId}</h2>
    <p style="margin:0 0 12px">Thanks ${form.name || ''}! We've logged your message. Our team will reach out soon.</p>
    <div style="margin:16px 0;padding:12px;border:1px solid #e2e8f0;border-radius:8px;background:#f8fafc">
      <p style="margin:0 0 8px"><strong>Date:</strong> ${dateStr}</p>
      ${form.subject ? `<p style="margin:0 0 8px"><strong>Subject:</strong> ${escapeHtml(form.subject)}</p>` : ''}
      ${form.message ? `<p style="margin:0"><strong>Message:</strong><br/>${escapeHtml(form.message)}</p>` : ''}
    </div>
    <p style="margin:16px 0 0;font-size:14px;color:#475569">Ticket ID: <strong>${ticketId}</strong></p>
    ${footer}
  </div>`;
}

function buildAdminHtml(ticketId, dateStr, form) {
  const safe = (v) => (v ? escapeHtml(v) : '');
  return `
  <div style="font-family:system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial">
    <h2 style="margin:0 0 8px">New Contact Request</h2>
    <p style="margin:0 0 8px"><strong>Ticket:</strong> ${ticketId}</p>
    <p style="margin:0 0 8px"><strong>Date:</strong> ${dateStr}</p>
    <hr style="margin:16px 0;border:none;border-top:1px solid #e2e8f0" />
    <p style="margin:0 0 6px"><strong>Name:</strong> ${safe(form.name)}</p>
    <p style="margin:0 0 6px"><strong>Email:</strong> ${safe(form.email)}</p>
    <p style="margin:0 0 6px"><strong>Phone:</strong> ${safe(form.phone)}</p>
    <p style="margin:0 0 6px"><strong>Subject:</strong> ${safe(form.subject)}</p>
    <p style="margin:0 0 0"><strong>Message:</strong><br/>${safe(form.message)}</p>
  </div>`;
}

function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  let body = {};
  try {
    body = req.body && typeof req.body === 'object' ? req.body : JSON.parse(req.rawBody || '{}');
  } catch (_) {
    return res.status(400).json({ success: false, message: 'Invalid JSON body' });
  }

  const { name, email, phone, subject, message } = body || {};
  const botcheck = body.botcheck || body.honeypot;

  // Honeypot: if present, pretend success without sending
  if (botcheck) {
    return res.status(200).json({ success: true, message: 'Sent', ticketId: null, date: null });
  }

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Missing required fields: name, email, message' });
  }

  // Explicit env check for clearer errors during local dev
  const { ZOHO_USER, ZOHO_PASS } = process.env;
  if (!ZOHO_USER || !ZOHO_PASS) {
    return res.status(500).json({ success: false, message: 'Mail service not configured: missing ZOHO_USER/ZOHO_PASS' });
  }

  const ticketId = makeTicketId();
  const dateStr = formatDate(new Date(), process.env.EMAIL_TZ || 'Africa/Lagos');

  // SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.ZOHO_SMTP_HOST || 'smtp.zoho.eu',
    port: Number(process.env.ZOHO_SMTP_PORT || 465),
    secure: true,
    auth: {
      user: ZOHO_USER,
      pass: ZOHO_PASS,
    },
  });

  const fromAddr = ZOHO_USER || 'info@eldeetech.com.ng';
  const toPrimary = process.env.TO_PRIMARY || ZOHO_USER || 'info@eldeetech.com.ng';
  const toCc = process.env.TO_CC || '';

  const bannerAttachment = getBannerAttachment();
  const hasBanner = !!bannerAttachment;

  // Admin notification
  const adminMail = {
    from: fromAddr,
    to: toPrimary,
    cc: toCc || undefined,
    replyTo: email,
    subject: `[Contact] ${subject || 'New request'} — ${ticketId}`,
    text: `Ticket: ${ticketId}\nDate: ${dateStr}\nName: ${name}\nEmail: ${email}\nPhone: ${phone || ''}\nSubject: ${subject || ''}\n\nMessage:\n${message}`,
    html: buildAdminHtml(ticketId, dateStr, { name, email, phone, subject, message }),
  };

  // Customer acknowledgement
  const customerHtml = buildCustomerHtml(ticketId, dateStr, { name, email, subject, message }, hasBanner);
  const customerMail = {
    from: fromAddr,
    to: email,
    replyTo: toPrimary,
    subject: `We received your request — Ticket ${ticketId}`,
    text: `Thanks ${name}, we received your message on ${dateStr}. Ticket ID: ${ticketId}.`,
    html: customerHtml,
    attachments: bannerAttachment ? [bannerAttachment] : [],
  };

  try {
    await transporter.sendMail(adminMail);
    await transporter.sendMail(customerMail);
    return res.status(200).json({ success: true, message: 'Sent', ticketId, date: dateStr });
  } catch (err) {
    const msg = err && err.message ? err.message : 'Failed to send email';
    return res.status(500).json({ success: false, message: msg });
  }
};
