import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://spadadellospirito.org',
  integrations: [
    react(),
    sitemap(),
  ],
  output: 'static',
  vite: {
    server: {
      proxy: {
        // Mirror the Vercel rewrite so /api/rss works in local dev
        '/api/rss': {
          target: 'https://www.vaticannews.va',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/rss/, ''),
        },
        '/api/cal': {
          target: 'http://calapi.inadiutorium.cz',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/cal/, ''),
        },
      },
    },
  },
})
