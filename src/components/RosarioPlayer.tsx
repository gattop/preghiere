import { useState, useEffect, useCallback } from 'react'
import { buildRosarioSequence, misteriPerGiorno, misteri, type RosarioStep } from '../data/rosario'

const TIPO_LABEL: Record<string, string> = {
  segnoDelCroce: 'Segno della Croce',
  credo: 'Credo Apostolico',
  padreNostro: 'Padre Nostro',
  aveMaria: 'Ave Maria',
  gloria: 'Gloria',
  fatima: 'Preghiera di Fatima',
  mistero: 'Mistero',
  descrizione: 'Meditazione',
  salveRegina: 'Salve Regina',
}

function getStepCount(step: RosarioStep, total: number, index: number): string {
  if (step.tipo === 'aveMaria' && step.decina !== undefined) {
    return `${step.aveNumber}/10`
  }
  if (step.tipo === 'aveMaria' && step.aveIniziale !== undefined) {
    return `${step.aveIniziale}/3`
  }
  return `${index + 1} / ${total}`
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

  // Click anywhere to advance (except back button and home link)
  useEffect(() => {
    const handle = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('.rosario-btn') || target.closest('.rosario-home-link')) return
      next()
    }
    window.addEventListener('click', handle)
    return () => window.removeEventListener('click', handle)
  }, [next])

  if (!steps.length) return null

  const step = steps[current]
  const isFirst = current === 0
  const isLast = current === steps.length - 1
  const progress = ((current + 1) / steps.length) * 100

  // Ave Maria beads for a decade
  const showBeads = step.tipo === 'aveMaria' && step.decina !== undefined
  const beadCount = step.aveNumber ?? 0

  return (
    <div className="rosario-page">
      <div className="rosario-header">
        <a href="/" className="rosario-home-link" title="Torna alla home">✝</a>
        <span className="rosario-oggi">{nomeOggi}</span>
        <span className="rosario-counter">{getStepCount(step, steps.length, current)}</span>
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
        ) : (
          <p className="rosario-text">{step.testo}</p>
        )}

        {showBeads && (
          <div className="ave-beads">
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} className={`ave-bead${i < beadCount ? ' done' : ''}`} />
            ))}
          </div>
        )}
      </div>

      <div className="rosario-nav">
        <button className="rosario-btn" onClick={prev} disabled={isFirst}>← Indietro</button>
        {isLast ? (
          <a href="/" className="rosario-btn rosario-btn-end">Fine ✝</a>
        ) : (
          <button className="rosario-btn rosario-btn-next" onClick={next}>Avanti →</button>
        )}
      </div>

      <p className="rosario-hint">Tocca lo schermo o usa le frecce per navigare</p>
    </div>
  )
}
