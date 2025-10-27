// Local dev API server for Vite proxy
// Runs on http://localhost:3000 and reuses the same handler as Vercel

const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

// Load env from app root (eldeetech/.env)
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const app = express();

// Capture rawBody in case the handler needs it
app.use(
  express.json({
    verify: (req, _res, buf) => {
      try {
        req.rawBody = buf.toString();
      } catch (_) {
        req.rawBody = undefined;
      }
    },
  })
);

// Reuse the Vercel function handler
const sendMail = require("./send-mail");

app.post("/api/send-mail", (req, res) => {
  // Handler returns a promise
  Promise.resolve(sendMail(req, res)).catch((err) => {
    const msg = err && err.message ? err.message : "Internal Server Error";
    res.status(500).json({ success: false, message: msg });
  });
});

const PORT = Number(process.env.API_PORT || 3000);
app.listen(PORT, () => {
  console.log(`[dev-api] listening on http://localhost:${PORT}`);
});

