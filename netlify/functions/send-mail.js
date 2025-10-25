// netlify/functions/send-mail.js
const nodemailer = require("nodemailer");

const ok = (body) => ({
  statusCode: 200,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});
const bad = (code, message) => ({
  statusCode: code,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify({ success: false, message }),
});

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return bad(405, "Method Not Allowed");

  try {
    console.log("[fn] using host:", process.env.ZOHO_SMTP_HOST, "user:", process.env.ZOHO_USER);
    const data = JSON.parse(event.body || "{}");

    // Honeypot (silently accept bots)
    if (data.botcheck) return ok({ success: true });

    const name = (data.name || "").trim();
    const email = (data.email || "").trim();
    const phone = (data.phone || "").trim();
    const subject = (data.subject || `New contact from ${name} – Eldeetech Website`).trim();
    const message = (data.message || "").trim();
    if (!name || !email || !message) return bad(400, "Name, email, and message are required.");

    const transporter = nodemailer.createTransport({
      host: process.env.ZOHO_SMTP_HOST || "smtp.zoho.eu",
      port: Number(process.env.ZOHO_SMTP_PORT || 465),
      secure: true, // SSL 465
      auth: { user: process.env.ZOHO_USER, pass: process.env.ZOHO_PASS },
    });

    const toPrimary = process.env.TO_PRIMARY || process.env.ZOHO_USER;
    const toCc = (process.env.TO_CC || "").split(",").map((s) => s.trim()).filter(Boolean);

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#111;">
        <p>Hello,</p>
        <p>A new contact request has been submitted on <b>eldeetech.com.ng</b>.</p>
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

    const text = `Hello,

A new contact request has been submitted on eldeetech.com.ng.

Name: ${name}
Email: ${email}
Phone: ${phone}
Subject: ${subject}

Message:
${message}

(Replying to this email will reach the sender.)`;

    await transporter.sendMail({
      from: { name: "Eldeetech Ltd", address: process.env.ZOHO_USER },
      to: toPrimary,
      cc: toCc.length ? toCc : undefined,
      replyTo: email,
      subject,
      text,
      html,
    });

    return ok({ success: true, message: "Sent" });
  } catch (err) {
    console.error("send-mail error:", err);
    return bad(500, "Unable to send message at the moment.");
  }
};

function esc(s) {
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}