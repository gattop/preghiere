import { useState, useEffect } from 'react'

interface Celebration {
  title: string
  colour: string
  rank: string
}

interface CalendarDay {
  date: string
  season: string
  season_week: number
  celebrations: Celebration[]
}

const SEASON_IT: Record<string, string> = {
  advent:         'Avvento',
  christmas:      'Tempo di Natale',
  ordinary:       'Tempo Ordinario',
  lent:           'Quaresima',
  easter_triduum: 'Triduo Pasquale',
  easter:         'Tempo Pasquale',
}

const SEASON_ICON: Record<string, string> = {
  advent:         '🕯️',
  christmas:      '⭐',
  ordinary:       '✝️',
  lent:           '✦',
  easter_triduum: '✝️',
  easter:         '✝️',
}

const COLOUR_HEX: Record<string, string> = {
  green:  '#059669',
  white:  '#B45309',
  red:    '#DC2626',
  purple: '#7C3AED',
  rose:   '#DB2777',
  black:  '#374151',
}

const COLOUR_IT: Record<string, string> = {
  green:  'verde',
  white:  'bianco',
  red:    'rosso',
  purple: 'viola',
  rose:   'rosa',
  black:  'nero',
}

export default function CalendarioLiturgico() {
  const [data, setData] = useState<CalendarDay | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const today = new Date()
    const y = today.getFullYear()
    const m = String(today.getMonth() + 1).padStart(2, '0')
    const d = String(today.getDate()).padStart(2, '0')
    fetch(`/api/cal/api/v0/it/calendars/general-it/${y}/${m}/${d}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((json: CalendarDay) => { setData(json); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="cal-card cal-card--loading" aria-hidden="true">
      <div className="cal-left">
        <span className="cal-skel" style={{ width: '9rem' }} />
        <span className="cal-skel" style={{ width: '16rem', marginTop: '.4rem' }} />
      </div>
    </div>
  )

  if (!data) return null

  const feria  = data.celebrations.find(c => c.rank === 'feria')
  const saint  = data.celebrations.find(c => c.rank !== 'feria')
  const main   = saint ?? feria ?? data.celebrations[0]
  const colour = main?.colour ?? 'green'
  const hex    = COLOUR_HEX[colour] ?? '#7B6CF6'
  const colourIt = COLOUR_IT[colour] ?? colour
  const seasonLabel = SEASON_IT[data.season] ?? data.season
  const icon = SEASON_ICON[data.season] ?? '✝️'

  return (
    <div className="cal-card" style={{ '--cal-accent': hex } as React.CSSProperties}>
      <div className="cal-left">
        <span className="cal-season">
          {icon} {seasonLabel}{data.season_week > 0 ? ` · Settimana ${data.season_week}` : ''}
        </span>
        {feria && <span className="cal-feast">{feria.title}</span>}
        {saint && <span className="cal-saint">🙏 {saint.title}</span>}
      </div>
      <span className="cal-dot" title={`Colore liturgico: ${colourIt}`} />
    </div>
  )
}
