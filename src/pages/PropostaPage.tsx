import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { prayerTree } from '../data/prayers'
import type { PrayerProposal } from '../types'

/** Flatten all folder ids for the dropdown */
function collectFolderOptions(folders: typeof prayerTree, prefix = ''): string[] {
  const opts: string[] = []
  for (const f of folders) {
    opts.push(prefix ? `${prefix} › ${f.title}` : f.title)
    opts.push(...collectFolderOptions(f.subfolders ?? [], prefix ? `${prefix} › ${f.title}` : f.title))
  }
  return opts
}

const FOLDER_OPTIONS = collectFolderOptions(prayerTree)

const STATUS_LABEL: Record<string, string> = {
  pending: 'In attesa',
  approved: 'Approvata',
  rejected: 'Rifiutata',
}

export function PropostaPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [authorNote, setAuthorNote] = useState('')
  const [suggestedFolder, setSuggestedFolder] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const [myProposals, setMyProposals] = useState<PrayerProposal[]>([])
  const [loadingProposals, setLoadingProposals] = useState(true)

  useEffect(() => {
    if (!user) navigate('/accedi')
  }, [user, navigate])

  const loadMyProposals = useCallback(async () => {
    setLoadingProposals(true)
    const { data } = await supabase
      .from('prayer_proposals')
      .select('id, title, status, admin_note, created_at, suggested_folder')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
    setMyProposals((data as PrayerProposal[]) ?? [])
    setLoadingProposals(false)
  }, [user])

  useEffect(() => {
    if (!user) return
    loadMyProposals()
  }, [user, loadMyProposals])

  if (!user) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!title.trim() || !content.trim()) { setError('Titolo e testo sono obbligatori.'); return }
    setLoading(true)
    try {
      const { error: dbErr } = await supabase.from('prayer_proposals').insert({
        user_id: user!.id,
        title: title.trim(),
        content: content.trim(),
        author_note: authorNote.trim() || null,
        suggested_folder: suggestedFolder || null,
      })
      if (dbErr) throw dbErr
      setSuccess(true)
      setTitle('')
      setContent('')
      setAuthorNote('')
      setSuggestedFolder('')
      await loadMyProposals()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h2>Proponi una preghiera</h2>
      <p className="lead">Invia una preghiera che potrebbe essere aggiunta alla raccolta.</p>

      {success && (
        <div style={{
          background: 'var(--accent-dim)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '.75rem 1rem',
          marginBottom: '1.2rem',
        }}>
          ✓ Proposta inviata! Sarà valutata dall'amministratore.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: 560 }}>
        <div className="form-group">
          <label htmlFor="prayer-title" className="form-label">Titolo della preghiera *</label>
          <input
            id="prayer-title"
            className="form-input"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="es. Preghiera a San Giuseppe"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="prayer-content" className="form-label">Testo della preghiera *</label>
          <textarea
            id="prayer-content"
            className="form-textarea"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Digita il testo completo della preghiera. Usa righe vuote per separare i paragrafi."
            required
            style={{ minHeight: 220 }}
          />
          <span className="form-hint">Usa righe vuote per separare i paragrafi; a capo semplice per andare a riga.</span>
        </div>

        <div className="form-group">
          <label htmlFor="author-note" className="form-label">Autore / fonte (facoltativo)</label>
          <input
            id="author-note"
            className="form-input"
            type="text"
            value={authorNote}
            onChange={e => setAuthorNote(e.target.value)}
            placeholder="es. di San Pio da Pietrelcina"
          />
        </div>

        <div className="form-group">
          <label htmlFor="suggested-folder" className="form-label">Cartella suggerita (facoltativa)</label>
          <select
            id="suggested-folder"
            className="form-select"
            value={suggestedFolder}
            onChange={e => setSuggestedFolder(e.target.value)}
          >
            <option value="">— seleziona —</option>
            {FOLDER_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {error && <p className="form-error">{error}</p>}

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? '…' : 'Invia proposta'}
        </button>
      </form>

      {/* ─── Le mie proposte ─── */}
      <h3 style={{ marginTop: '2.5rem' }}>Le mie proposte</h3>

      {loadingProposals && <div className="spinner" />}

      {!loadingProposals && myProposals.length === 0 && (
        <p className="empty">Nessuna proposta inviata finora.</p>
      )}

      {myProposals.map(p => (
        <div key={p.id} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '.5rem' }}>
            <div>
              <div className="card-title">{p.title}</div>
              <div className="card-meta">
                {new Date(p.created_at).toLocaleDateString('it-IT')}
                {p.suggested_folder && ` · ${p.suggested_folder}`}
              </div>
            </div>
            <span className={`tag tag-${p.status}`}>{STATUS_LABEL[p.status] ?? p.status}</span>
          </div>
          {p.admin_note && (
            <p style={{ marginTop: '.5rem', fontSize: '.88em', fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: 0 }}>
              Nota: {p.admin_note}
            </p>
          )}
        </div>
      ))}
    </>
  )
}

