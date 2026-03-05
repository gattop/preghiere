import { StrictMode, Component } from 'react'
import type { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import App from './App'
import './styles/index.css'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'Georgia, serif', maxWidth: 600, margin: '4rem auto' }}>
          <h2 style={{ color: '#830f24' }}>Qualcosa è andato storto</h2>
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: 4, fontSize: '0.85rem', overflowX: 'auto' }}>
            {this.state.error.message}
          </pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', cursor: 'pointer' }}>
            Ricarica la pagina
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

const root = document.getElementById('root')!
createRoot(root).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
