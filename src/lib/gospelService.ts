import type { GospelItem } from '../types'

const RSS_PATH = '/it/vangelo-del-giorno-e-parola-del-giorno.rss.xml'

function get(xml: string, tag: string): string {
  const m = xml.match(
    new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`)
  )
  return m ? (m[1] ?? m[2] ?? '').trim() : ''
}

export async function fetchGospel(): Promise<GospelItem | null> {
  // In dev, Vite proxies /api/rss → https://www.vaticannews.va
  // In production, Vercel rewrites /api/rss/:path* → https://www.vaticannews.va/:path*
  const res = await fetch(`/api/rss${RSS_PATH}`)
  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`)
  const xml = await res.text()
  const itemMatch = xml.match(/<item>([\s\S]*?)<\/item>/)
  if (!itemMatch) throw new Error('No items in RSS feed')
  const item = itemMatch[1]
  return {
    title:       get(item, 'title'),
    description: get(item, 'description'),
    content:     get(item, 'description'),
    pubDate:     get(item, 'pubDate'),
    link:        get(item, 'link') || get(item, 'guid'),
  }
}
