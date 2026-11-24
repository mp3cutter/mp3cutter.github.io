const CACHE_NAME = 'mp3cutter-static-v3';

const PRECACHE_URLS = [
  '/',
  '/how-to-use/',
  '/hire-me/',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/og-image.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // Only cache same-origin requests; skip third-party analytics/external calls
  if (url.origin !== self.location.origin) return;

  // Cache-first for static assets (JS, CSS, WASM, images, fonts) and pages with background refresh
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
          }
          return response;
        })
        .catch(() => {
          if (request.mode === 'navigate') {
            return caches.match('/') || cachedResponse;
          }
          return cachedResponse;
        });

      return cachedResponse || networkFetch;
    })
  );
});
