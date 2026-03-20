const CACHE_NAME = 'nyctc-offline-v1';
// List all files you want to work offline
const ASSETS = [
  './',
  './index.html',
  './logo.jpeg'
];

// 1. Install Phase: Save files to the browser cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets for offline use');
      return cache.addAll(ASSETS);
    })
  );
});

// 2. Activate Phase: Clean up old caches if you update the version
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// 3. Fetch Phase: If internet is off, load from the Cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return the cached file OR try to get it from the network
      return response || fetch(event.request);
    })
  );
});