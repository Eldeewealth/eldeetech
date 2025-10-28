const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const dns = require('dns').promises;
const { isDisposableDomain } = require('./_disposable');

let __dbInitialized = false;
async function getSql() {
  try {
    const candidates = [
      process.env.DATABASE_URL,
      process.env.POSTGRES_URL_NON_POOLING, // Vercel/Neon recommended for HTTP driver
      process.env.DATABASE_URL_UNPOOLED,
      process.env.POSTGRES_URL, // pooled; works but non-pooled preferred
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

async function ensureSchema(sql) {
  if (!sql || __dbInitialized) return;
  try {
    await sql(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id BIGSERIAL PRIMARY KEY,
        ticket_id TEXT UNIQUE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        subject TEXT,
        subject_input TEXT,
        message TEXT NOT NULL,
        service_slug TEXT,
        website TEXT,
        ip TEXT,
        user_agent TEXT,
        referer TEXT,
        admin_sent BOOLEAN DEFAULT FALSE,
        customer_sent BOOLEAN DEFAULT FALSE,
        error TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions (created_at);
      CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions (email);
    `);
    // Ensure new columns exist even if table was created previously
    try { await sql`ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS subject_input TEXT`; } catch (_) {}
    __dbInitialized = true;
  } catch (e) {
    // Don't crash function if schema setup fails
  }
}

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
  const pub = path.join(process.cwd(), 'public');
  const pngPath = path.join(pub, 'email-banner.png');
  const jpgPath = path.join(pub, 'email-banner.jpg');
  const svgPath = path.join(pub, 'email-banner.svg');

  if (fs.existsSync(pngPath)) {
    return {
      filename: 'email-banner.png',
      path: pngPath,
      cid: 'email-banner',
      contentType: 'image/png',
      contentDisposition: 'inline',
    };
  }
  if (fs.existsSync(jpgPath)) {
    return {
      filename: 'email-banner.jpg',
      path: jpgPath,
      cid: 'email-banner',
      contentType: 'image/jpeg',
      contentDisposition: 'inline',
    };
  }
  // Avoid SVG inline for Gmail/webmail; will fall back to CSS brand bar.
  if (process.env.EMAIL_BANNER_ALLOW_SVG === 'true' && fs.existsSync(svgPath)) {
    return {
      filename: 'email-banner.svg',
      path: svgPath,
      cid: 'email-banner',
      contentType: 'image/svg+xml',
      contentDisposition: 'inline',
    };
  }
  return null;
}

function buildCustomerHtml(ticketId, dateStr, form, hasBanner) {
  const baseStyles = `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji'; color:#0f172a;`;
  const smallStyles = `font-size:12px;color:#475569`;
  const footer = hasBanner
    ? `<div style="margin-top:24px;text-align:center">
         <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse">
           <tr>
             <td align="center" style="padding:0;margin:0">
               <img src="cid:email-banner" alt="ELDEETECH" title="ELDEETECH" width="560" style="display:block;border:0;outline:none;text-decoration:none;width:100%;max-width:560px;height:auto;margin:0 auto"/>
             </td>
           </tr>
         </table>
       </div>`
    : `<div style="margin-top:24px;padding:16px;background:#0b5ed7;color:#fff;text-align:center;border-radius:8px">Empowering Technology, Creativity and AI-Driven Innovation</div>`;

  const safeName = typeof form.name === 'string' ? escapeHtml(form.name) : '';

  return `
  <div style="${baseStyles}">
    <h2 style="margin:0 0 8px">Dear ${safeName},</h2>
    <p style="margin:0 0 14px">Thank you so much for taking time to reach out to us. Your query has been logged and is receiving due attention.</p>
    <p style="margin:0 0 14px">We are committed to providing you with the best support possible. Your ticket ID is <strong>${ticketId}</strong> of <strong>${dateStr}</strong>. We will reference this ID in all our next engagement with you.</p>
    <p style="margin:0 0 14px">Feel free to contact us here using the same ticket ID and we will get in touch!</p>
    ${footer}
        <p style="margin:16px 0 0; ${smallStyles}">This is an automated acknowledgement. A member of our team will respond shortly.</p>
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
  const serviceSlug = (body && (body.service || body.service_slug)) ? String(body.service || body.service_slug) : '';

  function slugToTitle(slug) {
    try {
      const s = String(slug || '')
        .replace(/[-_]+/g, ' ')
        .trim()
        .toLowerCase();
      return s.replace(/\b\w/g, (m) => m.toUpperCase());
    } catch (_) { return String(slug || ''); }
  }

  const subjectTrimmed = (subject || '').toString().trim();
  const subjectFinal = subjectTrimmed || (serviceSlug ? `Enquiry on your "${slugToTitle(serviceSlug)}" service` : '');
  const botcheck = body.botcheck || body.honeypot;

  // Honeypot: if present, pretend success without sending
  if (botcheck) {
    return res.status(200).json({ success: true, message: 'Sent', ticketId: null, date: null });
  }

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Missing required fields: name, email, message' });
  }

  // Email validation: format + block disposable domains + optional MX check
  const emailNorm = String(email || '').trim().toLowerCase();
  const emailFormat = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailFormat.test(emailNorm)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
  }
  const domain = emailNorm.split('@')[1] || '';
  if (isDisposableDomain(domain)) {
    return res.status(400).json({ success: false, message: 'Temporary/disposable email domains are not allowed. Please use a permanent email.' });
  }
  if (process.env.EMAIL_STRICT_MX === 'true') {
    try {
      const mx = await Promise.race([
        dns.resolveMx(domain),
        new Promise((_, reject) => setTimeout(() => reject(new Error('MX check timeout')), 1500)),
      ]);
      if (!Array.isArray(mx) || mx.length === 0) {
        return res.status(400).json({ success: false, message: 'Email domain does not appear to accept mail (no MX record)' });
      }
    } catch (_) {
      return res.status(400).json({ success: false, message: 'Unable to verify email domain (MX). Please use a different email.' });
    }
  }

  // Explicit env check for clearer errors during local dev
  const { ZOHO_USER, ZOHO_PASS } = process.env;
  if (!ZOHO_USER || !ZOHO_PASS) {
    return res.status(500).json({ success: false, message: 'Mail service not configured: missing ZOHO_USER/ZOHO_PASS' });
  }

  const ticketId = makeTicketId();
  const dateStr = formatDate(new Date(), process.env.EMAIL_TZ || 'Africa/Lagos');

  // Optional DB insert (Neon/Vercel Postgres)
  let sql = null;
  try {
    sql = await getSql();
    await ensureSchema(sql);
    if (sql) {
      const ip = (req.headers['x-forwarded-for'] || '').toString().split(',')[0].trim();
      const userAgent = (req.headers['user-agent'] || '').toString();
      const referer = (req.headers['referer'] || req.headers['referrer'] || '').toString();
      await sql`
        INSERT INTO contact_submissions (
          ticket_id, name, email, phone, subject, subject_input, message, service_slug, website, ip, user_agent, referer
        ) VALUES (
          ${ticketId}, ${name}, ${email}, ${phone || ''}, ${subjectFinal}, ${subjectTrimmed}, ${message}, ${serviceSlug}, ${body.website || ''}, ${ip}, ${userAgent}, ${referer}
        )
        ON CONFLICT (ticket_id) DO UPDATE SET
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          phone = EXCLUDED.phone,
          subject = EXCLUDED.subject,
          subject_input = EXCLUDED.subject_input,
          message = EXCLUDED.message,
          website = EXCLUDED.website,
          service_slug = EXCLUDED.service_slug;
      `;
    }
  } catch (e) {
    // Log but do not fail request on DB error
    console.error('DB insert error:', e && e.message ? e.message : e);
  }

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

  const fromAddrEmail = ZOHO_USER || 'info@eldeetech.com.ng';
  const fromAddr = `Eldeetech Ltd <${fromAddrEmail}>`;
  const toPrimary = process.env.TO_PRIMARY || fromAddrEmail || 'info@eldeetech.com.ng';
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
    try { if (sql) { await sql`UPDATE contact_submissions SET admin_sent = TRUE WHERE ticket_id = ${ticketId}`; } } catch (_) {}
    await transporter.sendMail(customerMail);
    try { if (sql) { await sql`UPDATE contact_submissions SET customer_sent = TRUE WHERE ticket_id = ${ticketId}`; } } catch (_) {}
    return res.status(200).json({ success: true, message: 'Sent', ticketId, date: dateStr });
  } catch (err) {
    const msg = err && err.message ? err.message : 'Failed to send email';
    try { if (sql) { await sql`UPDATE contact_submissions SET error = ${msg} WHERE ticket_id = ${ticketId}`; } } catch (_) {}
    return res.status(500).json({ success: false, message: msg });
  }
};
