import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function FavoriteButton({ prayerId }: { prayerId: string }) {
  const [userId, setUserId] = useState<string | null>(null)
  const [isFav, setIsFav] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const uid = data.session?.user.id ?? null
      setUserId(uid)
      if (uid) {
        supabase
          .from('favorites')
          .select('id')
          .eq('user_id', uid)
          .eq('prayer_id', prayerId)
          .maybeSingle()
          .then(({ data: fav }) => setIsFav(!!fav))
      }
    })
  }, [prayerId])

  async function toggle() {
    if (!userId) {
      window.location.href = '/accedi'
      return
    }
    const prev = isFav
    setIsFav(!prev)
    if (prev) {
      const { error } = await supabase.from('favorites').delete().eq('user_id', userId).eq('prayer_id', prayerId)
      if (error) setIsFav(true)
    } else {
      const { error } = await supabase.from('favorites').insert({ user_id: userId, prayer_id: prayerId })
      if (error) setIsFav(false)
    }
  }

  return (
    <button
      className={`fav-btn${isFav ? ' active' : ''}`}
      onClick={toggle}
      aria-pressed={isFav}
      title={isFav ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
      aria-label={isFav ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
    >
      {isFav ? '❤️' : '🤍'}
    </button>
  )
}
