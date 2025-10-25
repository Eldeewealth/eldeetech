# Local Setup and Vercel Migration Runbook

## Prerequisites
- Node.js 18+
- npm

## Local Development
1. Install dependencies:
   ```bash
   npm i
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Local API endpoint (Vercel-style): `POST /api/send-mail`

## Vercel Deployment Steps (manual)
1. Create/import the project in Vercel pointing to the `eldeetech` folder as root.
2. In Vercel Project Settings → Environment Variables, add:
   - `ZOHO_USER` (e.g., info@eldeetech.com.ng)
   - `ZOHO_PASS`
   - `ZOHO_SMTP_HOST` = `smtp.zoho.eu`
   - `ZOHO_SMTP_PORT` = `465`
   - `TO_PRIMARY` (primary admin recipient)
   - `TO_CC` (optional CC)
   - `EMAIL_TZ` = `Africa/Lagos`
3. Redeploy once env vars are set.

## Domain Configuration (Cloudflare + Vercel)
- `www` CNAME → `cname.vercel-dns.com` (DNS only)
- `@` A → `76.76.21.21` (DNS only)
- Add domains to Vercel: `www.eldeetech.com.ng` and `eldeetech.com.ng` and verify.

## Browser Console Test
Run after the app is deployed or `npm run dev` locally:
```js
fetch('/api/send-mail', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test',
    email: 'me@example.com',
    message: 'Hello from local test',
  }),
}).then(r => r.json()).then(console.log).catch(console.error);
```

## Notes
- If `public/email-banner.svg` exists, the customer email embeds it via CID; otherwise, a branded blue footer text block is rendered.
- Honeypot `botcheck` is included and short-circuits with success for bots.