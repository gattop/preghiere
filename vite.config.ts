import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Include static assets that should be pre-cached
      includeAssets: [
        'favicon/favicon.ico',
        'favicon/favicon-16x16.png',
        'favicon/favicon-32x32.png',
        'favicon/apple-touch-icon.png',
        'favicon/android-chrome-192x192.png',
        'favicon/android-chrome-512x512.png',
      ],
      manifest: {
        name: 'Preghiamo',
        short_name: 'Preghiamo',
        description: 'Raccolta personale di preghiere cattoliche',
        lang: 'it',
        theme_color: '#830f24',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        orientation: 'portrait',
        icons: [
          {
            src: '/favicon/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/favicon/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/favicon/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Pre-cache all build output (JS, CSS, HTML, images)
        globPatterns: ['**/*.{js,css,html,png,svg,ico,woff,woff2}'],
        // Runtime caching for external APIs
        runtimeCaching: [
          {
            // Vatican News RSS — try network first, fall back to cache
            urlPattern: /^https:\/\/www\.vaticannews\.va\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'vatican-rss',
              expiration: { maxEntries: 5, maxAgeSeconds: 24 * 60 * 60 },
              networkTimeoutSeconds: 10,
            },
          },
          {
            // Supabase API (auth, DB, edge functions)
            urlPattern: /^https:\/\/[a-z]+\.supabase\.co\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 },
              networkTimeoutSeconds: 10,
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/rss': {
        target: 'https://www.vaticannews.va',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/rss/, ''),
      },
    },
  },
})
