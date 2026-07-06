import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function FavoriteButton({ prayerId }: { prayerId: string }) {
  const [userId, setUserId] = useState<string | null>(null)
  const [isFav, setIsFav] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      const uid = data.session?.user.id ?? null
      setUserId(uid)
      if (uid) {
        supabase!
          .from('favorites')
          .select('id')
          .eq('user_id', uid)
          .eq('prayer_id', prayerId)
          .maybeSingle()
          .then(({ data: fav }) => {
            setIsFav(!!fav)
            setReady(true)
          })
      } else {
        setReady(true)
      }
    })
  }, [prayerId])

  if (!supabase) return null

  async function toggle() {
    if (!userId) {
      window.location.href = '/accedi'
      return
    }
    const prev = isFav
    setIsFav(!prev)
    if (prev) {
      const { error } = await supabase!.from('favorites').delete().eq('user_id', userId).eq('prayer_id', prayerId)
      if (error) setIsFav(true)
    } else {
      const { error } = await supabase!.from('favorites').insert({ user_id: userId, prayer_id: prayerId })
      if (error) setIsFav(false)
    }
  }

  return (
    <button
      className={`fav-btn${isFav ? ' active' : ''}${!ready ? ' is-loading' : ''}`}
      onClick={toggle}
      aria-pressed={isFav}
      title={isFav ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
      aria-label={isFav ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
    >
      <svg width="19" height="19" viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  )
}
