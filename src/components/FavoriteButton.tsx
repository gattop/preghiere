import { useFavorites } from '../hooks/useFavorites'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

interface FavoriteButtonProps {
  prayerId: string
}

export function FavoriteButton({ prayerId }: FavoriteButtonProps) {
  const { user } = useAuth()
  const { isFavorite, toggle } = useFavorites()
  const navigate = useNavigate()
  const fav = isFavorite(prayerId)

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (!user) { navigate('/accedi'); return }
    toggle(prayerId)
  }

  return (
    <button
      className={`btn-icon ${fav ? 'active' : ''}`}
      onClick={handleClick}
      title={fav ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
      aria-label={fav ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
    >
      {fav
        ? <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      }
    </button>
  )
}
