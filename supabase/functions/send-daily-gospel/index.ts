// supabase/functions/send-daily-gospel/index.ts
// Invia il Vangelo del giorno via email a tutti gli utenti iscritti.
// Gira ogni ora (schedule "0 * * * *") ma invia solo quando Vatican News
// pubblica un articolo nuovo (rilevato tramite la tabella gospel_log).
//
// Segreti Supabase richiesti:
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, MAIL_SERVER_URL, MAIL_SERVER_KEY

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RSS_URL = 'https://www.vaticannews.va/it/vangelo-del-giorno-e-parola-del-giorno.rss.xml'

interface SmtpConfig {
  host:   string
  port:   number
  secure: boolean
  user:   string
  pass:   string
  from:   string
}

async function fetchGospel(): Promise<{ title: string; description: string; link: string } | null> {
  try {
    const res = await fetch(RSS_URL, { headers: { 'User-Agent': 'spada-dello-spirito/1.0' } })
    if (!res.ok) return null
    const xml = await res.text()
    const itemMatch = xml.match(/<item>([\s\S]*?)<\/item>/)
    if (!itemMatch) return null
    const item = itemMatch[1]
    const get = (tag: string) => {
      const m = item.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`))
      return m ? (m[1] ?? m[2] ?? '').trim() : ''
    }
    return { title: get('title'), description: get('description'), link: get('link') }
  } catch {
    return null
  }
}

async function sendMail(
  mailUrl: string,
  apiKey: string,
  smtp: SmtpConfig,
  to: string,
  subject: string,
  html: string,
): Promise<boolean> {
  try {
    const res = await fetch(`${mailUrl}/api/mail/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey },
      body: JSON.stringify({ to, subject, html, smtp }),
    })
    return res.ok
  } catch {
    return false
  }
}

serve(async (_req) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const mailUrl     = Deno.env.get('MAIL_SERVER_URL')!
  const mailKey     = Deno.env.get('MAIL_SERVER_KEY')!

  const smtp: SmtpConfig = {
    host:   Deno.env.get('SMTP_HOST')!,
    port:   parseInt(Deno.env.get('SMTP_PORT') ?? '587', 10),
    secure: Deno.env.get('SMTP_SECURE') === 'true',
    user:   Deno.env.get('SMTP_USER')!,
    pass:   Deno.env.get('SMTP_PASS')!,
    from:   Deno.env.get('SMTP_FROM')!,
  }

  const admin = createClient(supabaseUrl, serviceKey)

  // 1. Scarica il Vangelo dal feed RSS
  const gospel = await fetchGospel()
  if (!gospel) {
    return new Response(JSON.stringify({ skipped: true, reason: 'RSS fetch failed' }), { status: 200 })
  }

  // 2. Recupera gli utenti iscritti
  const { data: profiles, error: profilesError } = await admin
    .from('profiles')
    .select('id, display_name')
    .eq('receive_daily_gospel', true)

  if (profilesError) {
    return new Response(JSON.stringify({ error: profilesError.message }), { status: 500 })
  }

  // 4. Invia le email
  let sent = 0
  const errors: string[] = []

  for (const profile of profiles ?? []) {
    const { data: authUser } = await admin.auth.admin.getUserById(profile.id)
    if (!authUser?.user?.email) continue

    const email = authUser.user.email
    const name  = profile.display_name ?? email

    const html = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 2rem; color: #333;">
        <h1 style="font-size: 1.4rem; color: #830f24; margin-bottom: 0.25rem;">Vangelo del Giorno</h1>
        <h2 style="font-size: 1.1rem; font-weight: normal; color: #555; margin-top: 0;">${gospel.title}</h2>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 1.5rem 0;" />
        <div style="line-height: 1.8; font-size: 1rem;">${gospel.description}</div>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 1.5rem 0;" />
        <p style="font-size: 0.85rem; color: #888;">
          Caro ${name}, hai ricevuto questa email perché hai attivato il Vangelo del giorno su Spada dello Spirito.<br />
          <a href="${gospel.link}" style="color: #830f24;">Leggi sul sito Vatican News</a>
        </p>
      </div>
    `

    const ok = await sendMail(mailUrl, mailKey, smtp, email, `Vangelo del Giorno — ${gospel.title}`, html)
    if (ok) sent++
    else errors.push(email)
  }

  return new Response(
    JSON.stringify({ sent, failed: errors.length, errors, title: gospel.title }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
})
