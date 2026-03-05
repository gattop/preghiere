import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useFavorites() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) { setFavorites(new Set()); return }
    setLoading(true)
    supabase
      .from('favorites')
      .select('prayer_id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setFavorites(new Set(data?.map(f => f.prayer_id) ?? []))
      })
      .then(() => setLoading(false), () => setLoading(false))
  }, [user])

  async function toggle(prayerId: string) {
    if (!user) return

    if (favorites.has(prayerId)) {
      setFavorites(prev => { const s = new Set(prev); s.delete(prayerId); return s })
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('prayer_id', prayerId)
      if (error) setFavorites(prev => new Set([...prev, prayerId])) // rollback
    } else {
      setFavorites(prev => new Set([...prev, prayerId]))
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, prayer_id: prayerId })
      if (error) setFavorites(prev => { const s = new Set(prev); s.delete(prayerId); return s }) // rollback
    }
  }

  return { favorites, loading, toggle, isFavorite: (id: string) => favorites.has(id) }
}
