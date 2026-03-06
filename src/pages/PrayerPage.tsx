import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { prayerMap } from '../data/prayers'
import { BackButton } from '../components/BackButton'
import { FavoriteButton } from '../components/FavoriteButton'
import { PrayerBlockRenderer } from '../components/PrayerBlockRenderer'

export function PrayerPage() {
  const { id } = useParams<{ id: string }>()
  const prayer = id ? prayerMap.get(id) : undefined
  const [readMode, setReadMode] = useState(false)

  if (!prayer) {
    return (
      <>
        <BackButton />
        <p className="empty">Preghiera non trovata.</p>
      </>
    )
  }

  if (readMode) {
    return (
      <div className="read-mode">
        <button className="read-mode-close" onClick={() => setReadMode(false)} aria-label="Chiudi modalità lettura">
          ✕
        </button>
        <h2 className="read-mode-title">{prayer.title}</h2>
        {prayer.subtitle && <p className="read-mode-subtitle">{prayer.subtitle}</p>}
        <div className="read-mode-body">
          {prayer.blocks.map((block, i) => (
            <PrayerBlockRenderer key={i} block={block} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <BackButton />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ textAlign: 'left' }}>{prayer.title}</h2>
          {prayer.subtitle && <p className="prayer-subtitle">{prayer.subtitle}</p>}
          {prayer.description && <p className="prayer-description">{prayer.description}</p>}
        </div>
        <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setReadMode(true)}
            title="Modalità lettura"
            aria-label="Apri modalità lettura"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            Lettura
          </button>
          <FavoriteButton prayerId={prayer.id} />
        </div>
      </div>

      <div className="prayer-body">
        {prayer.blocks.map((block, i) => (
          <PrayerBlockRenderer key={i} block={block} />
        ))}
      </div>
    </>
  )
}
