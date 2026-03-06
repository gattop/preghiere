import { useState, useCallback, useEffect } from 'react'
import { misteri, misteriPerGiorno, buildRosarioSequence } from '../data/rosario'
import type { RosarioStep } from '../data/rosario'
import { Link } from 'react-router-dom'
import { useSeo } from '../hooks/useSeo'

const ROSARIO_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://spadadellospirito.org/rosario#webpage',
  name: 'Santo Rosario — Spada dello Spirito',
  description: 'Prega il Santo Rosario guidato giorno per giorno con i misteri del giorno: Gaudiosi, Dolorosi, Gloriosi e della Luce.',
  url: 'https://spadadellospirito.org/rosario',
  inLanguage: 'it',
  isPartOf: { '@type': 'WebSite', '@id': 'https://spadadellospirito.org/#website' },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://spadadellospirito.org/' },
      { '@type': 'ListItem', position: 2, name: 'Santo Rosario', item: 'https://spadadellospirito.org/rosario' },
    ],
  },
}

interface RosarioState {
  started: boolean
  step: number
  misteroCorrente: number
}

export function RosarioPage() {
  const dayOfWeek = new Date().getDay()
  const chiave = misteriPerGiorno[dayOfWeek]
  const misteriDelGiorno = misteri[chiave]

  const [seq] = useState<RosarioStep[]>(() => buildRosarioSequence(dayOfWeek))
  const [state, setState] = useState<RosarioState>({ started: false, step: 0, misteroCorrente: -1 })

  useSeo({
    title: 'Santo Rosario',
    description: 'Prega il Santo Rosario guidato giorno per giorno con i misteri del giorno: Gaudiosi, Dolorosi, Gloriosi e della Luce.',
    canonical: 'https://spadadellospirito.org/rosario',
    jsonLd: ROSARIO_JSONLD,
  })

  const current = state.step < seq.length ? seq[state.step] : null

  const advance = useCallback(() => {
    setState(prev => {
      if (!prev.started) return { ...prev, started: true }
      const nextStep = prev.step + 1
      const nextItem = seq[nextStep]
      let misteroCorrente = prev.misteroCorrente
      if (nextItem?.tipo === 'descrizione' && nextItem.misteroIndex !== undefined) {
        misteroCorrente = nextItem.misteroIndex
      }
      return { ...prev, step: nextStep, misteroCorrente }
    })
  }, [seq])

  const goBack = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setState(prev => {
      if (prev.step === 0) return { ...prev, started: false }
      return { ...prev, step: prev.step - 1 }
    })
  }, [])

  // Keyboard support
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === ' ' || e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault()
        advance()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setState(prev => ({ ...prev, step: Math.max(0, prev.step - 1) }))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [advance])

  const progress = state.started ? (state.step / seq.length) * 100 : 0

  // Determine Ave bead state
  const isAve = current?.tipo === 'aveMaria'
  const isInitialAve = isAve && current?.aveIniziale !== undefined
  const aveCount = isInitialAve ? 3 : 10
  const currentAve = current?.aveNumber ?? current?.aveIniziale ?? 0

  if (!state.started) {
    return (
      <div
        className="rosario-page"
        onClick={advance}
        role="button"
        tabIndex={0}
        aria-label="Inizia il Rosario"
        onKeyDown={e => e.key === 'Enter' && advance()}
      >
        <div style={{ textAlign: 'center' }}>
          <h1 className="rosario-title">{misteriDelGiorno.nome}</h1>
          <p className="rosario-subtitle">Santo Rosario del giorno</p>
        </div>
        <p className="rosario-text" style={{ justifyContent: 'center' }}>
          Tocca o premi un tasto per iniziare
        </p>
        <p className="rosario-hint">← → o spazio per navigare</p>
        <Link to="/" className="btn btn-ghost" onClick={e => e.stopPropagation()} style={{ marginTop: '1rem' }}>← Home</Link>
      </div>
    )
  }

  if (state.step >= seq.length) {
    return (
      <div className="rosario-page">
        <div style={{ textAlign: 'center' }}>
          <h1 className="rosario-title">✝</h1>
          <p className="rosario-subtitle">Il Rosario è completato</p>
        </div>
        <p className="rosario-text" style={{ justifyContent: 'center', fontStyle: 'italic' }}>
          «Il Rosario è l'arma.» — San Pio da Pietrelcina
        </p>
        <Link to="/" className="btn btn-primary">← Torna alla home</Link>
      </div>
    )
  }

  return (
    <div
      className="rosario-page"
      onClick={advance}
      role="button"
      tabIndex={0}
      aria-label="Avanza nel Rosario"
      onKeyDown={e => e.key === 'Enter' && advance()}
    >
      <div style={{ textAlign: 'center', width: '100%', maxWidth: 560 }}>
        <p className="rosario-title" style={{ fontSize: '1.3rem', marginBottom: '.1rem' }}>{misteriDelGiorno.nome}</p>
        {state.misteroCorrente >= 0 && state.misteroCorrente < 5 && (
          <p className="rosario-subtitle">
            {state.misteroCorrente + 1}° Mistero: {misteriDelGiorno.lista[state.misteroCorrente].titolo}
          </p>
        )}
      </div>

      <p key={state.step} className="rosario-text">{current?.testo}</p>

      {isAve && (
        <div className="ave-beads">
          {Array.from({ length: aveCount }, (_, i) => {
            const n = i + 1
            const cls = n < currentAve ? 'done' : n === currentAve ? 'current' : ''
            return <span key={n} className={`ave-bead ${cls}`}>{n}</span>
          })}
        </div>
      )}

      <div style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="rosario-hint">{state.step + 1} / {seq.length}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '.6rem', marginTop: '.5rem' }}>
          <button className="btn btn-ghost btn-sm" onClick={goBack}>‹ Indietro</button>
          <span className="rosario-hint" style={{ alignSelf: 'center' }}>tocca ovunque per avanzare</span>
        </div>
      </div>
    </div>
  )
}
