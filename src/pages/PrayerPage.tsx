import { useParams } from 'react-router-dom'
import { prayerMap } from '../data/prayers'
import { BackButton } from '../components/BackButton'
import { FavoriteButton } from '../components/FavoriteButton'
import { PrayerBlockRenderer } from '../components/PrayerBlockRenderer'

export function PrayerPage() {
  const { id } = useParams<{ id: string }>()
  const prayer = id ? prayerMap.get(id) : undefined

  if (!prayer) {
    return (
      <>
        <BackButton />
        <p className="empty">Preghiera non trovata.</p>
      </>
    )
  }

  return (
    <>
      <BackButton />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <h2>{prayer.title}</h2>
          {prayer.subtitle && <p className="prayer-subtitle">{prayer.subtitle}</p>}
          {prayer.description && <p className="prayer-description">{prayer.description}</p>}
        </div>
        <FavoriteButton prayerId={prayer.id} />
      </div>

      <div className="prayer-body">
        {prayer.blocks.map((block, i) => (
          <PrayerBlockRenderer key={i} block={block} />
        ))}
      </div>
    </>
  )
}
