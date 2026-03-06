import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  function isActive(path: string) {
    return location.pathname === path || location.pathname.startsWith(path + '/') ? 'active' : ''
  }

  function close() { setMenuOpen(false) }

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="logo" onClick={close}>
            <svg className="logo-cross" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <defs>
                <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#9B8DF8"/>
                  <stop offset="100%" stopColor="#5A49D4"/>
                </linearGradient>
              </defs>
              <rect x="39" y="8" width="22" height="104" rx="5" ry="5" fill="url(#lg)"/>
              <rect x="12" y="30" width="76" height="22" rx="5" ry="5" fill="url(#lg)"/>
            </svg>
            <span className="logo-name">Spada dello Spirito</span>
          </Link>

          <button
            type="button"
            className={`nav-toggle${menuOpen ? ' open' : ''}`}
            aria-label={menuOpen ? 'Chiudi menu' : 'Apri menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(v => !v)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav className={`header-nav${menuOpen ? ' open' : ''}`}>
            <div className="site-nav">
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={close}>Home</Link>
              <Link to="/rosario" className={`nav-link ${isActive('/rosario')}`} onClick={close}>Rosario</Link>
              <Link to="/vangelo" className={`nav-link ${isActive('/vangelo')}`} onClick={close}>Vangelo</Link>
              <Link to="/bibbia" className={`nav-link ${isActive('/bibbia')}`} onClick={close}>Bibbia</Link>
              {user && (
                <>
                  <Link to="/preferiti" className={`nav-link ${isActive('/preferiti')}`} onClick={close}>Preferiti</Link>
                  <Link to="/proposta" className={`nav-link ${isActive('/proposta')}`} onClick={close}>Proponi</Link>
                  {profile?.is_admin && (
                    <Link to="/admin" className={`nav-link ${isActive('/admin')}`} onClick={close}>Admin</Link>
                  )}
                </>
              )}
              {user ? (
                <>
                  <Link to="/profilo" className={`nav-link ${isActive('/profilo')}`} onClick={close}>Profilo</Link>
                  <button type="button" className="nav-link" style={{ cursor: 'pointer' }} onClick={() => { signOut().then(() => { navigate('/'); close() }) }}>Esci</button>
                </>
              ) : (
                <Link to="/accedi" className={`nav-link nav-link-pill ${isActive('/accedi')}`} onClick={close}>Accedi</Link>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="page-wrap">
        {children}
      </main>

      <footer className="site-footer">
        <p>
          Raccolta di preghiere cattoliche by Tommaso Martarelli
        </p>
      </footer>
    </>
  )
}
