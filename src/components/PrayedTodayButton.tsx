import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

function todayStr(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function PrayedTodayButton({ prayerId }: { prayerId: string }) {
  const [userId, setUserId] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      const uid = data.session?.user.id ?? null
      setUserId(uid)
      if (uid) {
        supabase!
          .from('prayer_checkins')
          .select('id')
          .eq('user_id', uid)
          .eq('prayer_id', prayerId)
          .eq('prayed_on', todayStr())
          .maybeSingle()
          .then(({ data: checkin }) => {
            setDone(!!checkin)
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
    const prev = done
    setDone(!prev)
    if (prev) {
      const { error } = await supabase!
        .from('prayer_checkins')
        .delete()
        .eq('user_id', userId)
        .eq('prayer_id', prayerId)
        .eq('prayed_on', todayStr())
      if (error) setDone(true)
    } else {
      const { error } = await supabase!
        .from('prayer_checkins')
        .insert({ user_id: userId, prayer_id: prayerId, prayed_on: todayStr() })
      if (error) setDone(false)
    }
  }

  return (
    <button
      className={`prayed-btn${done ? ' active' : ''}${!ready ? ' is-loading' : ''}`}
      onClick={toggle}
      aria-pressed={done}
      title={done ? 'Segnata come pregata oggi' : 'Segna come pregata oggi'}
      aria-label={done ? 'Segnata come pregata oggi' : 'Segna come pregata oggi'}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
      {done ? 'Pregata oggi' : 'Segna pregata'}
    </button>
  )
}
