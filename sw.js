const CACHE_NAME = 'nyctc-v' + Date.now(); // Forces a new cache name every time it's re-installed
const ASSETS = [
  './',
  './index.html',
  './logo.jpeg'
];

// 1. Install Phase: Cache the current files
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Forces the new service worker to become active immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 2. Activate Phase: Delete all OLD caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// 3. Fetch Phase: NETWORK FIRST strategy
// This looks for the update online FIRST. If it fails (offline), it takes the cache.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
