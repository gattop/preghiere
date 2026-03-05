import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// If env vars are missing the client is created with placeholder values;
// Supabase calls will simply fail at runtime — the app remains usable.
export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder'
)

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
