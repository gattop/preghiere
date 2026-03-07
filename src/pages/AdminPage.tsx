import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import type { PrayerProposal, ProposalStatus } from '../types'

export function AdminPage() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [proposals, setProposals] = useState<PrayerProposal[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<ProposalStatus | 'all'>('pending')

  useEffect(() => {
    if (profile && !profile.is_admin) { navigate('/'); return }
    if (!profile) return
    load()
  }, [profile, filter, navigate])

  async function load() {
    setLoading(true)
    try {
      let q = supabase
        .from('prayer_proposals')
        .select('*, profiles(display_name)')
        .order('created_at', { ascending: false })
      if (filter !== 'all') q = q.eq('status', filter)
      const { data, error } = await q
      if (error) console.error('AdminPage load error:', error)
      setProposals((data as PrayerProposal[]) ?? [])
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id: string, status: ProposalStatus, adminNote?: string) {
    try {
      const { error } = await supabase
        .from('prayer_proposals')
        .update({ status, admin_note: adminNote ?? null, updated_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
      setProposals(prev => prev.map(p => p.id === id ? { ...p, status, admin_note: adminNote ?? null } : p))
    } catch (err) {
      console.error('updateStatus failed:', err)
    }
  }

  if (!profile?.is_admin) return null

  return (
    <>
      <h2>Pannello Admin</h2>
      <p className="lead">Gestione proposte di preghiera</p>

      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
        {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
          <button
            key={f}
            type="button"
            className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter(f)}
            style={{ fontSize: '.82rem', padding: '.3rem .8rem' }}
          >
            {f === 'all' ? 'Tutte' : f === 'pending' ? 'In attesa' : f === 'approved' ? 'Approvate' : 'Rifiutate'}
          </button>
        ))}
      </div>

      {loading && <div className="spinner" />}

      {!loading && proposals.length === 0 && (
        <p className="empty">Nessuna proposta.</p>
      )}

      {proposals.map(p => (
        <ProposalCard key={p.id} proposal={p} onUpdate={updateStatus} />
      ))}
    </>
  )
}

function ProposalCard({
  proposal,
  onUpdate,
}: {
  proposal: PrayerProposal
  onUpdate: (id: string, status: ProposalStatus, note?: string) => void
}) {
  const [note, setNote] = useState(proposal.admin_note ?? '')
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '.5rem' }}>
        <div>
          <div className="card-title">{proposal.title}</div>
          <div className="card-meta">
            {proposal.profiles?.display_name ?? '(utente sconosciuto)'} · {new Date(proposal.created_at).toLocaleDateString('it-IT')}
            {proposal.suggested_folder && ` · Cartella: ${proposal.suggested_folder}`}
          </div>
        </div>
        <span className={`tag tag-${proposal.status}`}>
          {proposal.status === 'pending' ? 'In attesa' : proposal.status === 'approved' ? 'Approvata' : 'Rifiutata'}
        </span>
      </div>

      <button
        type="button"
        className="btn btn-ghost"
        style={{ fontSize: '.78rem', padding: '.2rem .6rem', marginTop: '.6rem' }}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? 'Nascondi testo ▲' : 'Mostra testo ▼'}
      </button>

      {expanded && (
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: '.9em', background: 'var(--bg)', padding: '.8rem', borderRadius: 'var(--radius)', margin: '.6rem 0', border: '1px solid var(--border)' }}>
          {proposal.content}
        </pre>
      )}

      {proposal.author_note && (
        <p style={{ fontSize: '.85em', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '.4rem' }}>
          {proposal.author_note}
        </p>
      )}

      <div className="form-group" style={{ marginTop: '.8rem', marginBottom: '.5rem' }}>
        <label className="form-label">Nota admin (facoltativa)</label>
        <input
          className="form-input"
          type="text"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Motivazione o commento"
          style={{ fontSize: '.9rem' }}
        />
      </div>

      {proposal.status === 'pending' && (
        <div style={{ display: 'flex', gap: '.5rem' }}>
          <button
            className="btn btn-primary"
            style={{ fontSize: '.85rem' }}
            onClick={() => onUpdate(proposal.id, 'approved', note)}
          >
            ✓ Approva
          </button>
          <button
            className="btn btn-danger"
            style={{ fontSize: '.85rem' }}
            onClick={() => onUpdate(proposal.id, 'rejected', note)}
          >
            ✗ Rifiuta
          </button>
        </div>
      )}

      {proposal.status !== 'pending' && (
        <button
          className="btn btn-ghost"
          style={{ fontSize: '.82rem', padding: '.3rem .8rem' }}
          onClick={() => onUpdate(proposal.id, 'pending', '')}
        >
          Rimetti in attesa
        </button>
      )}
    </div>
  )
}
