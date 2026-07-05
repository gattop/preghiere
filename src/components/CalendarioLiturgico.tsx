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

const SEASON_THEME: Record<string, { accent: string; accentD: string; accentL: string; shadowAccent: string }> = {
  advent:         { accent: '#7B6CF6', accentD: '#5A49D4', accentL: '#EDE9FF', shadowAccent: '0 6px 28px rgba(123,108,246,.32)' },
  christmas:      { accent: '#B45309', accentD: '#92400E', accentL: '#FEF3C7', shadowAccent: '0 6px 28px rgba(180,83,9,.32)' },
  ordinary:       { accent: '#059669', accentD: '#047857', accentL: '#D1FAE5', shadowAccent: '0 6px 28px rgba(5,150,105,.32)' },
  lent:           { accent: '#6D28D9', accentD: '#4C1D95', accentL: '#EDE9FF', shadowAccent: '0 6px 28px rgba(109,40,217,.32)' },
  easter_triduum: { accent: '#B91C1C', accentD: '#991B1B', accentL: '#FEE2E2', shadowAccent: '0 6px 28px rgba(185,28,28,.32)' },
  easter:         { accent: '#D97706', accentD: '#B45309', accentL: '#FEF3C7', shadowAccent: '0 6px 28px rgba(217,119,6,.32)' },
}

export default function CalendarioLiturgico() {
  const [data, setData] = useState<CalendarDay | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const today = new Date()
    const y = today.getFullYear()
    const m = String(today.getMonth() + 1).padStart(2, '0')
    const d = String(today.getDate()).padStart(2, '0')
    const cacheKey = `cal-${y}-${m}-${d}`

    const applyTheme = (season: string) => {
      const theme = SEASON_THEME[season]
      if (!theme) return
      const root = document.documentElement
      root.style.setProperty('--accent', theme.accent)
      root.style.setProperty('--accent-d', theme.accentD)
      root.style.setProperty('--accent-l', theme.accentL)
      root.style.setProperty('--shadow-accent', theme.shadowAccent)
    }

    try {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        const parsed: CalendarDay = JSON.parse(cached)
        setData(parsed)
        setLoading(false)
        applyTheme(parsed.season)
        return
      }
    } catch {}

    fetch(`/api/cal/api/v0/it/calendars/general-it/${y}/${m}/${d}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((json: CalendarDay) => {
        try { localStorage.setItem(cacheKey, JSON.stringify(json)) } catch {}
        setData(json)
        setLoading(false)
        applyTheme(json.season)
      })
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
    <div className="cal-card" style={{ '--cal-accent': hex } as React.CSSProperties} aria-live="polite" aria-atomic="true">
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
