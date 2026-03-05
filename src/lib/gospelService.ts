import type { GospelItem } from '../types'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// In dev (no Supabase configured) fetch the RSS directly through the Vite proxy.
// In production the Supabase edge function handles CORS.
const isDev = import.meta.env.DEV
const supabaseReady = Boolean(
  SUPABASE_URL && !SUPABASE_URL.includes('placeholder') && SUPABASE_ANON_KEY
)

function get(xml: string, tag: string): string {
  const m = xml.match(
    new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`)
  )
  return m ? (m[1] ?? m[2] ?? '').trim() : ''
}

async function fetchFromProxy(): Promise<GospelItem | null> {
  const rssPath = '/it/vangelo-del-giorno-e-parola-del-giorno.rss.xml'
  const res = await fetch(`/api/rss${rssPath}`)
  if (!res.ok) return null
  const xml = await res.text()
  const itemMatch = xml.match(/<item>([\s\S]*?)<\/item>/)
  if (!itemMatch) return null
  const item = itemMatch[1]
  return {
    title: get(item, 'title'),
    description: get(item, 'description'),
    content: get(item, 'description'),
    pubDate: get(item, 'pubDate'),
    link: get(item, 'link'),
  }
}

async function fetchFromEdgeFunction(): Promise<GospelItem | null> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/gospel-proxy`, {
    headers: { Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
  })
  if (!res.ok) return null
  return (await res.json()) as GospelItem
}

export async function fetchGospel(): Promise<GospelItem | null> {
  // Use the Vite dev proxy when running locally without Supabase configured
  if (isDev || !supabaseReady) {
    return fetchFromProxy()
  }
  return fetchFromEdgeFunction()
}
