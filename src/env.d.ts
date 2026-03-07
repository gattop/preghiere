/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_MAIL_SERVER_URL: string
  readonly VITE_MAIL_SERVER_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
