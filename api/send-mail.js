// vercel/api/send-mail.js
const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
    return;
  }

  try {
    const data =
      req.body && typeof req.body === "object"
        ? req.body
        : JSON.parse(req.rawBody || "{}");

    // Honeypot (silently accept bots)
    if (data.botcheck || data.honeypot) {
      res.status(200).json({ success: true });
      return;
    }

    const name = (data.name || "").trim();
    const email = (data.email || "").trim();
    const phone = (data.phone || "").trim();
    const subject = (data.subject || `New contact from ${name} – Eldeetech Website`).trim();
    const message = (data.message || "").trim();
    if (!name || !email || !message) {
      res.status(400).json({ success: false, message: "Name, email, and message are required." });
      return;
    }

    // Ticket and timestamp
    const ticketId = generateTicketId();
    const tz = process.env.EMAIL_TZ || "Africa/Lagos";
    const dateStr = formatDate(new Date(), tz);

    const transporter = nodemailer.createTransport({
      host: process.env.ZOHO_SMTP_HOST || "smtp.zoho.eu",
      port: Number(process.env.ZOHO_SMTP_PORT || 465),
      secure: true,
      auth: { user: process.env.ZOHO_USER, pass: process.env.ZOHO_PASS },
    });

    const toPrimary = process.env.TO_PRIMARY || process.env.ZOHO_USER;
    const toCc = (process.env.TO_CC || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const adminHtml = `
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#111;">
        <p>Hello,</p>
        <p>A new contact request has been submitted on <b>info@eldeetech.com.ng</b>.</p>
        <p style="margin:10px 0"><b>Ticket</b>: <span style="font-family:monospace">${esc(ticketId)}</span> – ${esc(dateStr)}</p>
        <table style="border-collapse:collapse;">
          <tr><td style="padding:4px 8px;"><b>Name</b></td><td style="padding:4px 8px;">${esc(name)}</td></tr>
          <tr><td style="padding:4px 8px;"><b>Email</b></td><td style="padding:4px 8px;">${esc(email)}</td></tr>
          <tr><td style="padding:4px 8px;"><b>Phone</b></td><td style="padding:4px 8px;">${esc(phone)}</td></tr>
          <tr><td style="padding:4px 8px;"><b>Subject</b></td><td style="padding:4px 8px;">${esc(subject)}</td></tr>
        </table>
        <p style="margin-top:10px;"><b>Message</b></p>
        <pre style="white-space:pre-wrap;background:#fafafa;border:1px solid #eee;padding:10px;border-radius:6px;">${esc(message)}</pre>
        <p style="margin-top:16px;color:#666;">You can reply directly to this email to contact the sender.</p>
      </div>
    `;
    const adminText = `Admin notification\n\nTicket: ${ticketId} – ${dateStr}\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\n\nMessage:\n${message}\n`;

    const tagline = "Empowering Technology, Creativity and AI-Driven Innovation";
    const footerImageUrl = process.env.EMAIL_FOOTER_IMAGE_URL || "";
    const footerBlock = footerImageUrl
      ? `<img src="${esc(footerImageUrl)}" alt="${esc(tagline)}" style="max-width:100%;height:auto;border-radius:4px;margin-top:12px;" />`
      : `<div style=\"padding:12px;color:#fff;background:#17298a;text-align:center;border-radius:4px;margin-top:12px;\">${esc(tagline)}</div>`;

    const customerSubject = `We received your request – Ticket ${ticketId}`;
    const customerHtml = `
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:#111;">
        <p>Dear ${esc(name)},</p>
        <p>Thank you so much for taking time to reach out to us. Your query has been logged and is receiving due attention.</p>
        <p>We are committed to providing you with the best support possible. Your ticket ID is <b>${esc(ticketId)}</b> of ${esc(dateStr)}. We will reference this ID in all our next engagement with you.</p>
        <p>Feel free to contact us here using the same ticket ID and we will get in touch!</p>
        <p>Thank you for choosing Eldeetech Ltd.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0;" />
        ${footerBlock}
      </div>
    `;
    const customerText = `Dear ${name},\n\nThank you so much for taking time to reach out to us. Your query has been logged and is receiving due attention.\n\nWe are committed to providing you with the best support possible. Your ticket ID is ${ticketId} of ${dateStr}. We will reference this ID in all our next engagement with you.\n\nFeel free to contact us here using the same ticket ID and we will get in touch!\n\nThank you for choosing Eldeetech Ltd.`;

    // Send admin email
    await transporter.sendMail({
      from: { name: "Eldeetech Ltd", address: process.env.ZOHO_USER },
      to: toPrimary,
      cc: toCc.length ? toCc : undefined,
      replyTo: email,
      subject: `${subject} – Ticket ${ticketId}`,
      text: adminText,
      html: adminHtml,
    });

    // Send acknowledgement to customer
    await transporter.sendMail({
      from: { name: "Eldeetech Ltd", address: process.env.ZOHO_USER },
      to: email,
      replyTo: toPrimary,
      subject: customerSubject,
      text: customerText,
      html: customerHtml,
    });

    res.status(200).json({ success: true, message: "Sent", ticketId, date: dateStr });
  } catch (err) {
    const msg = err && err.message ? err.message : "Unable to send message at the moment.";
    res.status(500).json({ success: false, message: msg });
  }
};

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function generateTicketId(prefix = "CAS") {
  const n = Math.floor(1000000 + Math.random() * 9000000);
  return `${prefix}-${n}`;
}

function formatDate(date, timeZone) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

