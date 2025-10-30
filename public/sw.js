// Kilalo Service Worker
// Cache-first strategy for static assets to improve performance on slow connections

const CACHE_NAME = 'kilalo-cache-v1'
const CACHE_URLS = [
  '/',
  '/en',
  '/fr',
]

// Install event - cache initial resources
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...')
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching initial resources')
      return cache.addAll(CACHE_URLS)
    })
  )
  // Force the waiting service worker to become the active service worker
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  // Take control of all pages immediately
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!event.request.url.startsWith('http')) {
    return
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if found
      if (cachedResponse) {
        console.log('[Service Worker] Serving from cache:', event.request.url)
        return cachedResponse
      }

      // Otherwise fetch from network
      return fetch(event.request).then((response) => {
        // Don't cache if not a successful response
        if (!response || response.status !== 200 || response.type === 'error') {
          return response
        }

        // Clone the response (response can only be consumed once)
        const responseToCache = response.clone()

        // Cache static assets (images, CSS, JS, fonts)
        const url = new URL(event.request.url)
        const shouldCache =
          url.pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg|css|js|woff|woff2|ttf)$/i) ||
          url.hostname === 'cdn.sanity.io'

        if (shouldCache) {
          caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching new resource:', event.request.url)
            cache.put(event.request, responseToCache)
          })
        }

        return response
      })
    })
  )
})

// Message event - allow cache clearing from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('[Service Worker] Clearing all caches...')
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            return caches.delete(cacheName)
          })
        )
      })
    )
  }
})
