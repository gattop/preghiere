import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { prayerTree } from '../data/prayers'

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

  useEffect(() => {
    if (!user) navigate('/accedi')
  }, [user, navigate])
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
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <>
        <h2>Grazie!</h2>
        <p className="lead">La tua proposta è stata inviata e sarà valutata dall'amministratore.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>← Torna alla home</button>
      </>
    )
  }

  return (
    <>
      <h2>Proponi una preghiera</h2>
      <p className="lead">Invia una preghiera che potrebbe essere aggiunta alla raccolta.</p>

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
    </>
  )
}
