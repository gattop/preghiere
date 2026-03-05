// ─── Prayer content types ─────────────────────────────────────────────────────

export type PrayerBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'italic'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'verse'; lines: string[] }
  | { type: 'response'; prompt: string; response: string }
  | { type: 'repetition'; text: string; count: number }
  | { type: 'litany'; rows: Array<{ prompt: string; response: string }> }
  | { type: 'divider' }

export interface Prayer {
  id: string
  title: string
  /** e.g. "di Fratel Cosimo" */
  subtitle?: string
  /** shown above the prayer body */
  description?: string
  blocks: PrayerBlock[]
}

export interface Folder {
  id: string
  title: string
  subtitle?: string
  description?: string
  prayers?: Prayer[]
  subfolders?: Folder[]
}

// ─── Supabase DB types ────────────────────────────────────────────────────────

export interface Profile {
  id: string
  email: string
  display_name: string | null
  receive_daily_gospel: boolean
  is_admin: boolean
  created_at: string
}

export type ProposalStatus = 'pending' | 'approved' | 'rejected'

export interface PrayerProposal {
  id: string
  user_id: string
  title: string
  content: string
  author_note: string | null
  suggested_folder: string | null
  status: ProposalStatus
  admin_note: string | null
  created_at: string
  updated_at: string
  profiles?: Pick<Profile, 'display_name' | 'email'>
}

export interface Favorite {
  id: string
  user_id: string
  prayer_id: string
  created_at: string
}

// ─── RSS / Gospel ─────────────────────────────────────────────────────────────

export interface GospelItem {
  title: string
  pubDate: string
  link: string
  description: string
  content: string
}
