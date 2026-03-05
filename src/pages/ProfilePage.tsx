import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function ProfilePage() {
  const { user, profile, updatePassword, updateProfile, deleteAccount } = useAuth()
  const navigate = useNavigate()

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwError, setPwError] = useState<string | null>(null)
  const [pwSuccess, setPwSuccess] = useState<string | null>(null)
  const [pwLoading, setPwLoading] = useState(false)

  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [gospelLoading, setGospelLoading] = useState(false)

  useEffect(() => {
    if (!user) navigate('/accedi')
  }, [user, navigate])
  if (!user) return null

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    setPwError(null)
    setPwSuccess(null)
    if (newPassword !== confirmPassword) { setPwError('Le password non coincidono.'); return }
    if (newPassword.length < 8) { setPwError('La password deve essere di almeno 8 caratteri.'); return }
    setPwLoading(true)
    try {
      await updatePassword(newPassword)
      setPwSuccess('Password aggiornata con successo.')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPwError((err as Error).message)
    } finally {
      setPwLoading(false)
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirm !== user!.email) { setDeleteError('Email non corretta. Digita la tua email per confermare.'); return }
    setDeleteLoading(true)
    setDeleteError(null)
    try {
      await deleteAccount()
      navigate('/')
    } catch (err) {
      setDeleteError((err as Error).message)
      setDeleteLoading(false)
    }
  }

  const [gospelError, setGospelError] = useState<string | null>(null)

  async function toggleGospel() {
    setGospelLoading(true)
    setGospelError(null)
    try {
      await updateProfile({ receive_daily_gospel: !profile?.receive_daily_gospel })
    } catch (err) {
      setGospelError(err instanceof Error ? err.message : 'Errore aggiornamento')
    } finally {
      setGospelLoading(false)
    }
  }

  return (
    <>
      <h2>Il mio profilo</h2>
      <p className="lead">{profile?.display_name ?? user.email}</p>

      {/* ─── Gospel ──── */}
      <h3>Notifiche email</h3>
      <div className="toggle-row">
        <span className="toggle-label">Ricevi il Vangelo del giorno via email</span>
        <button
          className={`btn ${profile?.receive_daily_gospel ? 'btn-primary' : 'btn-ghost'}`}
          onClick={toggleGospel}
          disabled={gospelLoading}
          type="button"
        >
          {profile?.receive_daily_gospel ? 'Attivo ✓' : 'Disattivato'}
        </button>
      </div>
      {gospelError && <p className="form-error">{gospelError}</p>}

      {/* ─── Password ──── */}
      <h3 style={{ marginTop: '2rem' }}>Cambia password</h3>
      <form onSubmit={handlePasswordChange} style={{ maxWidth: 380 }}>
        <div className="form-group">
          <label htmlFor="new-password" className="form-label">Nuova password</label>
          <input
            id="new-password"
            className="form-input"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="••••••••"
            minLength={8}
            required
            autoComplete="new-password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password" className="form-label">Conferma password</label>
          <input
            id="confirm-password"
            className="form-input"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            minLength={8}
            required
            autoComplete="new-password"
          />
        </div>
        {pwError && <p className="form-error">{pwError}</p>}
        {pwSuccess && <p className="form-success">{pwSuccess}</p>}
        <button className="btn btn-primary" type="submit" disabled={pwLoading}>
          {pwLoading ? '…' : 'Aggiorna password'}
        </button>
      </form>

      {/* ─── Delete account ──── */}
      <h3 style={{ marginTop: '2.5rem', color: '#c0392b' }}>Elimina account</h3>
      <p style={{ fontSize: '.9em', color: 'var(--text-muted)', marginBottom: '.8rem' }}>
        Questa azione è irreversibile. Tutti i tuoi dati (preferiti, proposte) verranno eliminati.
      </p>
      <div className="form-group" style={{ maxWidth: 380 }}>
        <label htmlFor="delete-confirm" className="form-label">Digita la tua email per confermare: <strong>{user.email}</strong></label>
        <input
          id="delete-confirm"
          className="form-input"
          type="email"
          value={deleteConfirm}
          onChange={e => setDeleteConfirm(e.target.value)}
          placeholder={user.email ?? ''}
          autoComplete="off"
        />
      </div>
      {deleteError && <p className="form-error">{deleteError}</p>}
      <button
        className="btn btn-danger"
        type="button"
        onClick={handleDeleteAccount}
        disabled={deleteLoading || deleteConfirm !== user.email}>
        {deleteLoading ? '…' : 'Elimina account definitivamente'}
      </button>
    </>
  )
}
