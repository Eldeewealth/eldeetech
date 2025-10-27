# Eldeetech Ltd — Official Website

Live Preview: Deployed on Vercel  
Custom Domain: https://eldeetech.com.ng

---

## About Eldeetech Ltd

Eldeetech Ltd is an integrated Information Technology, Digital Solutions, and Data Consultancy firm based in Nigeria. We deliver end‑to‑end technology services — from software development and digital transformation to data analytics and cloud consulting — empowering businesses and individuals to thrive in a digital economy.

This website serves as our corporate presence and client gateway, showcasing our expertise, service portfolio, and contact channels.

---

## Tech Stack

| Category | Technologies |
|---------|--------------|
| Frontend Framework | React 18 |
| Build Tool | Vite |
| Language | TypeScript |
| UI Components | shadcn/ui |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Hosting | Vercel |
| Mail Integration | Zoho Mail (SMTP via Nodemailer) |
| Domain | eldeetech.com.ng (Cloudflare DNS) |

---

## Key Features

- Modern, responsive UI built with React + TypeScript
- Serverless contact form on Vercel using Nodemailer (Zoho SMTP)
- Optimized performance with Vite and code-splitting
- SEO-friendly metadata and clean routing
- HTTPS via Vercel and Cloudflare

---

## Local Development

From the repository root:

```
cd eldeetech
npm install

# Start Vite (frontend) and local API (Express) together
npm run dev:all
```

The frontend runs on http://localhost:8080 and proxies API requests to http://localhost:3000.

- API route for mail: POST /api/send-mail
- Local API server source: `eldeetech/api/dev-server.js` (reuses the Vercel handler)

Environment variables for local development go in `eldeetech/.env`:

- ZOHO_USER, ZOHO_PASS
- optional: ZOHO_SMTP_HOST, ZOHO_SMTP_PORT, TO_PRIMARY, TO_CC, EMAIL_TZ, EMAIL_FOOTER_IMAGE_URL

---

## Deploy on Vercel

Project Settings:

- Root Directory: `eldeetech`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

Environment Variables (Project Settings → Environment Variables):

- ZOHO_USER, ZOHO_PASS
- optional: ZOHO_SMTP_HOST, ZOHO_SMTP_PORT, TO_PRIMARY, TO_CC, EMAIL_TZ, EMAIL_FOOTER_IMAGE_URL

API route `/api/send-mail` is implemented at `eldeetech/api/send-mail.js` and deploys automatically as a Vercel Function.

