import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

type Mode = 'login' | 'register'

export function LoginPage() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      if (mode === 'login') {
        await signIn(email, password)
        navigate('/')
      } else {
        if (!displayName.trim()) { setError('Inserisci il tuo nome.'); setLoading(false); return }
        await signUp(email, password, displayName)
        setSuccess('Registrazione avvenuta! Controlla la tua email per confermare l\'account.')
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '3rem auto' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>{mode === 'login' ? 'Accedi' : 'Registrati'}</h2>

      <form onSubmit={handleSubmit}>
        {mode === 'register' && (
          <div className="form-group">
            <label htmlFor="display-name" className="form-label">Nome</label>
            <input
              id="display-name"
              className="form-input"
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Il tuo nome"
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            className="form-input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="email@esempio.it"
            required
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            id="password"
            className="form-input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={8}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
          {mode === 'register' && <span className="form-hint">Minimo 8 caratteri</span>}
        </div>

        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
          {loading ? '…' : mode === 'login' ? 'Accedi' : 'Registrati'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '.9em', color: 'var(--text-muted)' }}>
        {mode === 'login' ? (
          <>Non hai un account?{' '}
            <button type="button" style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 'inherit', fontWeight: 700, padding: 0, textDecoration: 'underline', textDecorationColor: 'rgba(123,108,246,.35)' }} onClick={() => setMode('register')}>Registrati</button>
          </>
        ) : (
          <>Hai già un account?{' '}
            <button type="button" style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 'inherit', fontWeight: 700, padding: 0, textDecoration: 'underline', textDecorationColor: 'rgba(123,108,246,.35)' }} onClick={() => setMode('login')}>Accedi</button>
          </>
        )}
      </p>
    </div>
  )
}
