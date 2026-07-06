import { useState, useEffect, useCallback } from 'react'
import { buildRosarioSequence, misteriPerGiorno, misteri, type RosarioStep } from '../data/rosario'

const TIPO_LABEL: Record<string, string> = {
  decina: '1 Padre Nostro, 10 Ave Maria, 1 Gloria, Preghiera di Fatima',
  mistero: 'Mistero',
  descrizione: 'Meditazione',
  salveRegina: 'Salve Regina',
}

export default function RosarioPlayer() {
  const today = new Date().getDay()
  const chiave = misteriPerGiorno[today]
  const nomeOggi = misteri[chiave]?.nome ?? ''

  const [steps, setSteps] = useState<RosarioStep[]>([])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    setSteps(buildRosarioSequence(today))
  }, [today])

  const next = useCallback(() => setCurrent(c => Math.min(c + 1, steps.length - 1)), [steps.length])
  const prev = useCallback(() => setCurrent(c => Math.max(c - 1, 0)), [])

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); next() }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prev() }
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [next, prev])


  if (!steps.length) return null

  const step = steps[current]
  const isFirst = current === 0
  const isLast = current === steps.length - 1
  const progress = ((current + 1) / steps.length) * 100

  return (
    <div className="rosario-page">
      <div className="rosario-header">
        <a href="/" className="rosario-home-link" title="Esci dal Rosario">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          Esci
        </a>
        <span className="rosario-oggi">{nomeOggi}</span>
        <span className="rosario-counter">{current + 1} / {steps.length}</span>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="rosario-body">
        <p className="rosario-tipo">{TIPO_LABEL[step.tipo] ?? step.tipo}</p>

        {step.tipo === 'mistero' ? (
          <div className="mistero-card">
            <p className="mistero-title">{step.testo}</p>
          </div>
        ) : step.tipo === 'decina' && step.parti ? (
          <div className="decina-card">
            {step.parti.map((parte, i) => (
              <div className="decina-parte" key={i}>
                <p className="decina-parte-label">{parte.volte && parte.volte > 1 ? `${parte.volte}× ` : ''}{parte.label}</p>
                <p className="decina-parte-text">{parte.testo}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="rosario-text">{step.testo}</p>
        )}
      </div>

      <div className="rosario-nav">
        <button className="rosario-btn rosario-btn-back" onClick={prev} disabled={isFirst}>← Indietro</button>
        {isLast ? (
          <a href="/" className="rosario-btn rosario-btn-end">Fine ✝</a>
        ) : (
          <button className="rosario-btn rosario-btn-next" onClick={next}>Avanti →</button>
        )}
      </div>

      <p className="rosario-hint"> Usa le frecce per navigare</p>
    </div>
  )
}
