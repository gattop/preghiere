import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useFavorites(userId: string | null) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId) { setFavorites(new Set()); return }
    setLoading(true)
    supabase
      .from('favorites').select('prayer_id').eq('user_id', userId)
      .then(({ data }) => {
        setFavorites(new Set(data?.map(f => f.prayer_id) ?? []))
        setLoading(false)
      })
  }, [userId])

  async function toggle(prayerId: string) {
    if (!userId) return
    if (favorites.has(prayerId)) {
      setFavorites(prev => { const s = new Set(prev); s.delete(prayerId); return s })
      const { error } = await supabase.from('favorites').delete()
        .eq('user_id', userId).eq('prayer_id', prayerId)
      if (error) setFavorites(prev => new Set([...prev, prayerId]))
    } else {
      setFavorites(prev => new Set([...prev, prayerId]))
      const { error } = await supabase.from('favorites').insert({ user_id: userId, prayer_id: prayerId })
      if (error) setFavorites(prev => { const s = new Set(prev); s.delete(prayerId); return s })
    }
  }

  return { favorites, loading, toggle, isFavorite: (id: string) => favorites.has(id) }
}
