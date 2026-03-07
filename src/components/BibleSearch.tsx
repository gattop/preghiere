import { useState, useRef, type FormEvent } from 'react'
import { useBibbia } from '../utils/useBibbia'

export default function BibleSearch() {
  const { cerca, loading, error: loadError } = useBibbia()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ReturnType<typeof cerca> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    setResults(cerca(q))
  }

  return (
    <div className="bible-wrapper">
      <form onSubmit={handleSubmit} className="bible-search-row">
        <input
          ref={inputRef}
          type="text"
          className="bible-input"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Es. Gv 3,16 · Mt 5,3-12 · Lc 15,1-3.11-32"
          disabled={loading}
          autoFocus
        />
        <button type="submit" className="btn btn-primary" disabled={loading || !query.trim()}>
          {loading ? '…' : 'Cerca'}
        </button>
      </form>

      {loadError && <p className="form-error">{loadError}</p>}

      {results && (
        results.error ? (
          <p className="form-error">{results.error}</p>
        ) : (
          <div className="bible-results-card">
            <div className="bible-results-header">
              <span>{results.refLabel}</span>
              <span style={{ fontSize: '.8rem', opacity: 0.8 }}>{results.versetti.length} versett{results.versetti.length === 1 ? 'o' : 'i'}</span>
            </div>
            {results.versetti.map(v => (
              <div key={v.ref} className="bible-versetto-row">
                <span className="bible-versetto-num">{v.versetto}</span>
                <span>{v.testo}</span>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}

