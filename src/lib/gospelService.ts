export interface GospelItem {
  title: string
  pubDate: string
  link: string
  description: string
}

const RSS_PATH = '/api/rss/it/vangelo-del-giorno-e-parola-del-giorno.rss.xml'

export async function fetchGospel(): Promise<GospelItem | null> {
  const res = await fetch(RSS_PATH)
  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`)
  const xml = await res.text()

  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, 'text/xml')
  const item = doc.querySelector('item')
  if (!item) throw new Error('No items in RSS feed')

  const getText = (tag: string) => item.querySelector(tag)?.textContent?.trim() ?? ''

  return {
    title:       getText('title'),
    description: getText('description'),
    pubDate:     getText('pubDate'),
    link:        getText('link'),
  }
}
