const CACHE_NAME = 'spada-v3'

const PRECACHE_URLS = [
  '/',
  '/rosario',
  '/vangelo',
  '/bibbia',
  '/offline.html',
  '/favicon/logo.png',
  '/favicon/icon-192.png',
  '/favicon/icon-512.png',
  '/manifest.webmanifest',
]

// ─ Install: pre-cache app shell ────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  )
  self.skipWaiting()
})

// ─ Activate: remove old caches ─────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  )
  self.clients.claim()
})

// ─ Fetch: cache strategies ─────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event
  // Only handle GET
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // Skip chrome-extension and non-http(s) schemes
  if (!url.protocol.startsWith('http')) return

  // Network-first for Supabase API calls
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    )
    return
  }

  // Skip cross-origin requests other than Supabase
  if (url.origin !== self.location.origin) return

  // Cache-first for static assets (images, fonts, CSS, JS)
  if (/\.(png|jpe?g|svg|ico|webp|css|js|woff2?)(\?.*)?$/.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            if (res.ok) {
              const clone = res.clone()
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
            }
            return res
          })
      )
    )
    return
  }

  // Network-first (with cache fallback) for HTML pages
  event.respondWith(
    fetch(request)
      .then((res) => {
        if (res.ok) {
          const clone = res.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        }
        return res
      })
      .catch(() => caches.match(request).then(cached => cached ?? caches.match('/offline.html')))
  )
})
