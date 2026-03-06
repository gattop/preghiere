import { useEffect } from 'react'

const SITE = 'Spada dello Spirito'
const DEFAULT_DESC =
  'Raccolta di preghiere cattoliche: rosario giornaliero, vangelo del giorno, preghiere tradizionali e ai santi.'

interface SeoOptions {
  title: string
  description?: string
  canonical?: string
  /** Pass a memoised object — it will be JSON-serialised for diffing. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonLd?: Record<string, any> | null
}

function setAttr(selector: string, value: string, attr = 'content') {
  const el = document.querySelector<HTMLElement>(selector)
  if (el) el.setAttribute(attr, value)
}

/**
 * Lightweight SEO hook: updates <title>, meta description, OG tags,
 * canonical link and injects a per-page <script type="application/ld+json">.
 * Reverts everything on unmount so the next page begins with a clean slate.
 */
export function useSeo({ title, description, canonical, jsonLd }: SeoOptions) {
  const fullTitle = title.includes(SITE) ? title : `${title} — ${SITE}`
  const desc = description || DEFAULT_DESC
  // serialise for stable effect dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const jsonLdStr = jsonLd ? JSON.stringify(jsonLd) : null

  useEffect(() => {
    document.title = fullTitle
    setAttr('meta[name="description"]', desc)
    setAttr('meta[property="og:title"]', fullTitle)
    setAttr('meta[property="og:description"]', desc)
    setAttr('meta[property="og:url"]', canonical || window.location.href)
    setAttr('meta[name="twitter:title"]', fullTitle)
    setAttr('meta[name="twitter:description"]', desc)

    // Canonical link
    if (canonical) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
      if (!link) {
        link = document.createElement('link')
        link.rel = 'canonical'
        document.head.appendChild(link)
      }
      link.href = canonical
    }

    // Per-page JSON-LD
    if (jsonLdStr) {
      let script = document.getElementById('page-jsonld') as HTMLScriptElement | null
      if (!script) {
        script = document.createElement('script')
        script.id = 'page-jsonld'
        script.type = 'application/ld+json'
        document.head.appendChild(script)
      }
      script.textContent = jsonLdStr
    }

    return () => {
      document.title = SITE
      setAttr('meta[name="description"]', DEFAULT_DESC)
      setAttr('meta[property="og:title"]', SITE)
      setAttr('meta[property="og:description"]', DEFAULT_DESC)
      setAttr('meta[name="twitter:title"]', SITE)
      setAttr('meta[name="twitter:description"]', DEFAULT_DESC)
      document.getElementById('page-jsonld')?.remove()
      document.querySelector('link[rel="canonical"]')?.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullTitle, desc, canonical, jsonLdStr])
}
