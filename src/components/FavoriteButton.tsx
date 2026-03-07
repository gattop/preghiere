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
    if (isFav) {
      setIsFav(false)
      await supabase.from('favorites').delete().eq('user_id', userId).eq('prayer_id', prayerId)
    } else {
      setIsFav(true)
      await supabase.from('favorites').insert({ user_id: userId, prayer_id: prayerId })
    }
  }

  return (
    <button
      className={`fav-btn${isFav ? ' active' : ''}`}
      onClick={toggle}
      title={isFav ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
    >
      {isFav ? '❤️' : '🤍'}
    </button>
  )
}
