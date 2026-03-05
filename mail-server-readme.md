# mail-server

Serverless mail server built with **Node.js + TypeScript + Express**, deployed on **Vercel**.  
Replaces external services like Render + Resend with a self-hosted SMTP relay exposed via REST API.

**Live URL:** `https://mail-server-five-alpha.vercel.app`

---

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/health` | ❌ Public | Server status |
| `GET` | `/health?check=smtp` | ❌ Public | Server status + SMTP connectivity check |
| `POST` | `/api/mail/send` | ✅ `X-API-Key` | Send an email |

---

## Authentication

All `/api/mail/*` routes require the `X-API-Key` header:

```
X-API-Key: <your-api-key>
```

If `API_KEY` is not set in env vars, authentication is disabled (dev only).

---

## POST /api/mail/send

### Request headers

| Header | Required | Value |
|--------|----------|-------|
| `Content-Type` | ✅ | `application/json` |
| `X-API-Key` | ✅ | your API key |

### Request body

```jsonc
{
  "to": "recipient@example.com",      // required — string or array of strings
  "subject": "Hello!",                // required
  "text": "Plain text body",          // at least one of text or html required
  "html": "<p>HTML body</p>",         // optional
  "from": "override@example.com",     // optional — overrides SMTP_FROM
  "replyTo": "reply@example.com",     // optional
  "attachments": [                    // optional
    {
      "filename": "file.pdf",
      "path": "/absolute/path/to/file.pdf"
    }
  ]
}
```

### Response — success `200`

```json
{
  "success": true,
  "messageId": "<a7c5bd82-ce4b-0bbf-6061-03f8b7c44152@martarelli.cc>"
}
```

### Response — error `400`

```json
{ "error": "Missing required fields: \"to\" and \"subject\" are required." }
```

### Response — error `401`

```json
{ "error": "Unauthorized: invalid or missing API key." }
```

### Response — error `500`

```json
{ "error": "Failed to send email.", "detail": "SMTP error message..." }
```

---

## Usage examples

### fetch (JavaScript / TypeScript)

```ts
const res = await fetch('https://mail-server-five-alpha.vercel.app/api/mail/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.MAIL_SERVER_KEY!,
  },
  body: JSON.stringify({
    to: 'user@example.com',
    subject: 'Your subject',
    html: '<p>Hello!</p>',
  }),
});

const data = await res.json();
console.log(data.messageId);
```

### PowerShell

```powershell
Invoke-RestMethod `
  -Uri "https://mail-server-five-alpha.vercel.app/api/mail/send" `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json"; "X-API-Key" = "<key>" } `
  -Body '{"to":"user@example.com","subject":"Test","text":"Hello!"}'
```

### curl (Linux / macOS)

```bash
curl -X POST https://mail-server-five-alpha.vercel.app/api/mail/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: <key>" \
  -d '{"to":"user@example.com","subject":"Test","text":"Hello!"}'
```

---

## Environment variables

Set these in **Vercel Dashboard → Settings → Environment Variables**:

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `SMTP_HOST` | ✅ | `smtp.protonmail.ch` | SMTP server hostname |
| `SMTP_PORT` | ✅ | `587` | SMTP port (587 = STARTTLS, 465 = SSL) |
| `SMTP_SECURE` | ✅ | `false` | `true` only for port 465 |
| `SMTP_USER` | ✅ | `no-reply@example.com` | SMTP login username |
| `SMTP_PASS` | ✅ | `yourpassword` | SMTP login password / app password |
| `SMTP_FROM` | ✅ | `"Name <no-reply@example.com>"` | Default sender address |
| `API_KEY` | ✅ | `LE0aGC-wZ1qW1FRnfQNBIl6jRIsFj6Eli1ZAmxNa6xs` | Secret key for `X-API-Key` header |
| `CORS_ORIGIN` | ⚠️ | `https://yourapp.vercel.app` | Allowed CORS origin(s), comma-separated |

Copy `.env.example` to `.env` for local development.

### Compatible SMTP providers

Any standard SMTP provider works. Examples:

| Provider | SMTP host | Port |
|----------|-----------|------|
| Proton Mail | `smtp.protonmail.ch` | `587` |
| Gmail | `smtp.gmail.com` | `587` |
| Outlook / Hotmail | `smtp-mail.outlook.com` | `587` |
| Brevo (ex Sendinblue) | `smtp-relay.sendinblue.com` | `587` |
| Postmark | `smtp.postmarkapp.com` | `587` |
| Mailgun | `smtp.mailgun.org` | `587` |

---

## Local development

```bash
# 1. Copy env file and fill in your values
cp .env.example .env

# 2. Install dependencies
npm install

# 3. Start with hot-reload
npm run dev
# → http://localhost:3000
```

---

## Project structure

```
mail-server/
├── api/
│   └── index.ts          # Vercel serverless entry point
├── src/
│   ├── app.ts            # Express app (no listen — Vercel-compatible)
│   ├── dev.ts            # Local dev server (loads .env, calls listen)
│   ├── config/
│   │   └── mailer.ts     # Lazy singleton SMTP transporter
│   ├── controllers/
│   │   └── mailController.ts
│   ├── middleware/
│   │   └── auth.ts       # X-API-Key guard
│   ├── routes/
│   │   └── mailRoutes.ts
│   ├── services/
│   │   └── mailService.ts
│   └── types/
│       └── index.ts
├── .env.example
├── vercel.json
├── package.json
└── tsconfig.json
```

---

## Deploy on Vercel

1. Push the repo to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Add all environment variables listed above
4. Vercel auto-builds via `@vercel/node` — no manual compile step needed

After any env var change: **Deployments → Redeploy** to apply it.
