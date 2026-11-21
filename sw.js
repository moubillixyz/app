// Service worker: makes the app usable offline.
// Strategy: network-first, falling back to the cache. Every successful GET
// refreshes the cache, so the app updates implicitly whenever the network is
// available and keeps working with the last known version when it is not.

const CACHE = 'moubillixyz-v1'

// Files fetched at install time so the app works offline right after the first visit.
const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './favicon.ico',
  './icon-192x192.png',
  './icon-512x512.png',
  './profile/',
  './profile/index.js',
  './tuner/',
  'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4',
  'https://unpkg.com/alpinejs'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok || response.type === 'opaque') {
          const copy = response.clone()
          caches.open(CACHE).then((cache) => cache.put(request, copy))
        }
        return response
      })
      .catch(() =>
        caches.match(request, { ignoreSearch: true })
          .then((cached) => cached || (request.mode === 'navigate' && caches.match('./')))
          .then((cached) => (cached ? cleanRedirect(cached) : Response.error()))
      )
  )
})

// Browsers refuse a redirected response as the answer to a navigation
// (e.g. /profile cached after a redirect to /profile/), so strip the flag.
function cleanRedirect (response) {
  if (!response.redirected) return response
  return response.blob().then((body) => new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  }))
}
