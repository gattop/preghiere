import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useBibbia, SearchResult } from '../utils/useBibbia';

const SUGGESTIONS = [
  'Gv 3,16', 'Sal 23', 'Rm 8,28', 'Lc 2,14-16',
  '1Cor 13,4-7', 'Mt 5,3-12', 'Gn 1,1', 'Ap 21,4',
];

interface Props {
  compact?: boolean;
  initialQuery?: string;
}

export default function BibleSearch({ compact = false, initialQuery = '' }: Props) {
  const { loading, error: loadError, cerca } = useBibbia();
  const [query, setQuery] = useState(initialQuery);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!initialQuery || loading) return;
    const trimmed = initialQuery.trim();
    if (!trimmed) return;
    const res = cerca(trimmed);
    setResult(res);
    if (!res.error) {
      setHistory(prev => [trimmed, ...prev.filter(h => h !== trimmed)].slice(0, 8));
    }
  }, [loading, initialQuery, cerca]);

  function handleSearch(q = query) {
    const trimmed = q.trim();
    if (!trimmed) return;
    const res = cerca(trimmed);
    setResult(res);
    if (!res.error) {
      setHistory((prev) => [trimmed, ...prev.filter((h) => h !== trimmed)].slice(0, 8));
    }
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSearch();
  }

  function handleSuggestion(s: string) {
    setQuery(s);
    handleSearch(s);
  }

  return (
    <div className="bible-wrapper">
      {!compact && (
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ marginBottom: '.3rem' }}>📖 La Sacra Bibbia</h1>
          <p className="lead">CEI 2008 · Cerca per riferimento biblico</p>
        </div>
      )}

      {/* Search bar */}
      <div className="bible-search-row">
        <input
          ref={inputRef}
          className="bible-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Es: Lc 2,14-16 · Gv 3,16 · Sal 23 · 1Cor 13,4-7"
          autoFocus
          disabled={loading}
          aria-label="Riferimento biblico"
        />
        <button
          className="btn btn-primary"
          onClick={() => handleSearch()}
          disabled={loading || !query.trim()}
          aria-label="Cerca"
        >
          {loading ? '⏳' : '🔍 Cerca'}
        </button>
      </div>

      <p style={{ fontSize: '.8rem', color: 'var(--text-subtle)', marginBottom: '1rem' }}>
        Formato: <code style={{ background: 'rgba(123,108,246,.1)', padding: '1px 6px', borderRadius: 4, fontSize: '.75rem' }}>Libro Cap,Vers</code>{' '}
        oppure{' '}
        <code style={{ background: 'rgba(123,108,246,.1)', padding: '1px 6px', borderRadius: 4, fontSize: '.75rem' }}>Libro Cap,Vers-Vers</code>
      </p>

      {/* Suggerimenti */}
      {!result && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', marginBottom: '1rem' }}>
          {SUGGESTIONS.map((s) => (
            <button key={s} className="bible-chip" onClick={() => handleSuggestion(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Storico ricerche */}
      {history.length > 0 && !result && (
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '.4rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '.75rem', color: 'var(--text-subtle)' }}>Recenti:</span>
          {history.map((h) => (
            <button
              key={h}
              onClick={() => handleSuggestion(h)}
              style={{
                padding: '3px 10px', background: 'transparent',
                border: '1px solid var(--border)', borderRadius: 16,
                cursor: 'pointer', fontSize: '.74rem', color: 'var(--text-muted)',
                fontFamily: 'var(--font-ui)',
              }}
            >
              {h}
            </button>
          ))}
        </div>
      )}

      {loadError && <BibleErrorBox message={loadError} />}
      {result && <BibleResults result={result} onClear={() => setResult(null)} />}
    </div>
  );
}

function BibleResults({ result, onClear }: { result: SearchResult; onClear: () => void }) {
  const [copied, setCopied] = useState(false);
  if (result.error) return <BibleErrorBox message={result.error} onClear={onClear} />;

  const { refLabel, versetti } = result;
  const libroNome = versetti[0]?.libro ?? '';

  async function copyAll() {
    const text = versetti.map((v) => `${v.versetto} ${v.testo}`).join('\n');
    const header = `${libroNome} ${versetti[0].capitolo},${versetti[0].versetto}${
      versetti.length > 1 ? `-${versetti[versetti.length - 1].versetto}` : ''
    }\n\n`;
    await navigator.clipboard.writeText(header + text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bible-results-card">
      <div className="bible-results-header">
        <div>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, marginRight: '.6rem' }}>{refLabel}</span>
          <span style={{ fontSize: '.82rem', opacity: .8 }}>{libroNome}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <span style={{ fontSize: '.72rem', opacity: .75 }}>
            {versetti.length} {versetti.length === 1 ? 'versetto' : 'versetti'}
          </span>
          <button
            onClick={copyAll}
            title="Copia tutto"
            style={{ background: 'rgba(255,255,255,.18)', border: '1px solid rgba(255,255,255,.3)', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', fontSize: '1rem', color: '#fff' }}
          >
            {copied ? '✅' : '📋'}
          </button>
          <button
            onClick={onClear}
            title="Nuova ricerca"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: 'rgba(255,255,255,.8)', padding: '4px 6px' }}
          >
            ✕
          </button>
        </div>
      </div>

      <div>
        {versetti.map((v) => (
          <BibleVersettoRow key={v.ref} verso={v} />
        ))}
      </div>

      <div style={{ padding: '.8rem 1.4rem', borderTop: '1px solid var(--border)' }}>
        <em style={{ fontSize: '.75rem', color: 'var(--text-subtle)' }}>La Sacra Bibbia CEI 2008</em>
      </div>
    </div>
  );
}

function BibleVersettoRow({ verso }: { verso: { versetto: number; testo: string } }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(verso.testo);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="bible-versetto-row">
      <span className="bible-versetto-num">{verso.versetto}</span>
      <p style={{ flex: 1, margin: 0, lineHeight: 1.75, fontSize: '.97rem' }}>{verso.testo}</p>
      <button
        onClick={copy}
        title={`Copia versetto ${verso.versetto}`}
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '.9rem', opacity: copied ? 1 : 0.3, transition: 'opacity .15s', padding: '2px 4px' }}
      >
        {copied ? '✅' : '📋'}
      </button>
    </div>
  );
}

function BibleErrorBox({ message, onClear }: { message: string; onClear?: () => void }) {
  return (
    <div style={{
      padding: '.9rem 1.2rem',
      background: 'rgba(239,68,68,.08)',
      border: '1.5px solid rgba(239,68,68,.25)',
      borderRadius: 'var(--radius)',
      color: '#b91c1c',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '.5rem',
    }} role="alert">
      <span>⚠️ {message}</span>
      {onClear && (
        <button onClick={onClear} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#b91c1c' }}>✕</button>
      )}
    </div>
  );
}
