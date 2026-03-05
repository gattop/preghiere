import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { prayerMap } from '../data/prayers'
import type { Favorite } from '../types'

export function PreferitiPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/accedi'); return }
    supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setFavorites(data ?? []))
      .then(() => setLoading(false), () => setLoading(false))
  }, [user, navigate])

  if (loading) return <div className="spinner" />

  return (
    <>
      <h2>Preferiti</h2>
      {favorites.length === 0 ? (
        <p className="empty">
          Non hai ancora preghiere nei preferiti.<br />
          Apri una preghiera e tocca ♡ per aggiungerla.
        </p>
      ) : (
        favorites.map(fav => {
          const prayer = prayerMap.get(fav.prayer_id)
          if (!prayer) return null
          return (
            <Link key={fav.id} to={`/preghiera/${prayer.id}`} style={{ textDecoration: 'none' }}>
              <div className="list-item">
                <span className="list-item-title">{prayer.title}</span>
                <span className="list-item-icon">›</span>
              </div>
            </Link>
          )
        })
      )}
    </>
  )
}
