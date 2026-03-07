import { createContext, useContext, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export interface Profile {
  id: string
  display_name: string | null
  receive_daily_gospel: boolean
  is_admin: boolean
  created_at: string
}

interface AuthContextValue {
  session: Session | null
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signOut: () => Promise<void>
  updatePassword: (newPassword: string) => Promise<void>
  deleteAccount: () => Promise<void>
  updateProfile: (updates: Partial<Pick<Profile, 'display_name' | 'receive_daily_gospel'>>) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadProfile(userId: string) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(data ?? null)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) loadProfile(session.user.id).finally(() => setLoading(false))
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) loadProfile(session.user.id).catch(console.error)
      else { setProfile(null) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function signUp(email: string, password: string, displayName: string) {
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { display_name: displayName } },
    })
    if (error) throw error
  }

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  async function updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
  }

  async function deleteAccount() {
    const { error } = await supabase.functions.invoke('delete-account')
    if (error) throw error
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  async function updateProfile(updates: Partial<Pick<Profile, 'display_name' | 'receive_daily_gospel'>>) {
    if (!session) throw new Error('Non autenticato')
    const { error } = await supabase.from('profiles').update(updates).eq('id', session.user.id)
    if (error) throw error
    setProfile(prev => prev ? { ...prev, ...updates } : prev)
  }

  return (
    <AuthContext.Provider value={{
      session, user: session?.user ?? null, profile, loading,
      signIn, signUp, signOut, updatePassword, deleteAccount, updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
