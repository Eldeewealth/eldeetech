exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    const { name, email, phone, subject, message } = payload;

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.FROM_EMAIL || "info@eldeetech.com.ng";
    const recipients = ["info@eldeetech.com.ng", "eldeetech1@gmail.com"];

    if (!apiKey) {
      return { statusCode: 500, body: "Missing RESEND_API_KEY" };
    }

    const html = `
      <div style="font-family: Arial, sans-serif;">
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name || ""}</p>
        <p><strong>Email:</strong> ${email || ""}</p>
        <p><strong>Phone:</strong> ${phone || ""}</p>
        <p><strong>Subject:</strong> ${subject || "(no subject)"}</p>
        <p><strong>Message:</strong></p>
        <p>${(message || "").replace(/\n/g, "<br/>")}</p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: recipients,
        subject: subject || `New contact from ${name || "Unknown"}`,
        html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        statusCode: res.status || 500,
        body: JSON.stringify({ error: data }),
      };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true, id: data.id }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "Invalid payload" }) };
  }
};