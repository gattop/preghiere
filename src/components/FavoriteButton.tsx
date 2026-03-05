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
      {fav ? '♥' : '♡'}
    </button>
  )
}
