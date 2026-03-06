import { useEffect, useState } from 'react'
import DOMPurify from 'dompurify'
import { fetchGospel } from '../lib/gospelService'
import type { GospelItem } from '../types'

export function VangeloPage() {
  const [gospel, setGospel] = useState<GospelItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchGospel()
      .then(setGospel)
      .catch(e => setError((e as Error).message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="spinner" />

  if (error) {
    return (
      <>
        <h2>Vangelo del giorno</h2>
        <p className="empty">
          Impossibile caricare il Vangelo del giorno.{' '}
          <a
            href="https://www.vaticannews.va/it/vangelo-del-giorno-e-parola-del-giorno.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Leggi su Vatican News →
          </a>
        </p>
      </>
    )
  }

  if (!gospel) return <p className="empty">Nessun contenuto disponibile.</p>

  return (
    <>
      <h2>Vangelo del giorno</h2>
      <p className="gospel-date">{gospel.pubDate}</p>
      <p style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '1em', color: 'var(--accent)', marginBottom: '1.5rem', letterSpacing: '.04em' }}>
        {gospel.title}
      </p>

      <div
        className="gospel-body prayer-body"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(gospel.description) }}
      />

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <a
          href={gospel.link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost"
          style={{ fontSize: '.85rem' }}
        >
          Leggi su Vatican News ↗
        </a>
      </div>
    </>
  )
}
