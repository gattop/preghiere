import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth()
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
          <Link to="/" className="logo" onClick={close}>Preghiamo.eu</Link>

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
              {user && (
                <>
                  <Link to="/preferiti" className={`nav-link ${isActive('/preferiti')}`} onClick={close}>Preferiti</Link>
                  <Link to="/proposta" className={`nav-link ${isActive('/proposta')}`} onClick={close}>Proponi</Link>
                </>
              )}
              {user ? (
                <>
                  <Link to="/profilo" className={`nav-link ${isActive('/profilo')}`} onClick={close}>Profilo</Link>
                  <button type="button" className="nav-link" style={{ cursor: 'pointer' }} onClick={() => { signOut().then(() => { navigate('/'); close() }) }}>Esci</button>
                </>
              ) : (
                <Link to="/accedi" className={`nav-link ${isActive('/accedi')}`} onClick={close}>Accedi</Link>
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
          Raccolta personale di preghiere cattoliche · Suggerisci una preghiera:{' '}
          <a href="mailto:preghiere@tmso.it">preghiere@tmso.it</a>
        </p>
      </footer>
    </>
  )
}
