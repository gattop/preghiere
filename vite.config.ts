import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import fs from 'node:fs'

// ── Build the route list from prayer data ─────────────────────────────────────
// We import the compiled TS at config time via tsx/ts-node (Vite supports it).
import type { Folder } from './src/types'
import { prayerTree } from './src/data/prayers'

function collectRoutes(folders: Folder[], prefix = '/cartella'): string[] {
  const routes: string[] = []
  for (const folder of folders) {
    const folderPath = `${prefix}/${folder.id}`
    routes.push(folderPath)
    for (const prayer of folder.prayers ?? []) {
      routes.push(`/preghiera/${prayer.id}`)
    }
    routes.push(...collectRoutes(folder.subfolders ?? [], folderPath))
  }
  return routes
}

const dynamicRoutes = [
  '/rosario',
  '/vangelo',
  ...collectRoutes(prayerTree),
]

const HOSTNAME = 'https://spadadellospirito.org'
const EXCLUDE = new Set(['/accedi', '/profilo', '/proposta', '/preferiti', '/admin'])

function sitemapPlugin(outDir: string): Plugin {
  return {
    name: 'generate-sitemap',
    apply: 'build',
    closeBundle() {
      const routes = ['/', ...dynamicRoutes].filter(r => !EXCLUDE.has(r))
      const today = new Date().toISOString().split('T')[0]
      const priority = (r: string) =>
        r === '/' ? '1.0' : r === '/vangelo' || r === '/rosario' || r === '/bibbia' ? '0.9' : '0.7'

      const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...routes.map(r =>
          `  <url>\n    <loc>${HOSTNAME}${r}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${priority(r)}</priority>\n  </url>`
        ),
        '</urlset>',
      ].join('\n')

      fs.mkdirSync(outDir, { recursive: true })
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), xml, 'utf-8')
      console.log(`\x1b[32m✓ sitemap.xml generato (${routes.length} URL)\x1b[0m`)
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    sitemapPlugin('dist'),
    VitePWA({
      registerType: 'autoUpdate',
      // Include static assets that should be pre-cached
      includeAssets: ['favicon/logo.png', 'favicon/icon-192.png', 'favicon/icon-512.png'],
      manifest: {
        name: 'Spada dello Spirito',
        short_name: 'Spada',
        description: 'Raccolta personale di preghiere cattoliche',
        lang: 'it',
        theme_color: '#7B6CF6',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        orientation: 'portrait',
        icons: [
          {
            src: '/favicon/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/favicon/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/favicon/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Pre-cache all build output (JS, CSS, HTML, images)
        globPatterns: ['**/*.{js,css,html,png,svg,ico,woff,woff2}'],
        // Exclude large brand images from precache (they're served normally)
        globIgnores: ['**/banner-*.png', '**/logo_con_testo-*.png', '**/logo-*.png'],
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
