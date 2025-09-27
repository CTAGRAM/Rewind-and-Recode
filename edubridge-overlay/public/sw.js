const CACHE_NAME = 'edubridge-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/index.css',
  // Note: Bundled assets in build; cache Lottie and JSON for offline demo
  '/isl/neutral.json',
  '/isl/phrase1.json',
  '/isl/phrase2.json',
  '/isl/phrase3.json',
  // JSON files will be bundled; adjust for production
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          fetchResponse => {
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }
            const responseToCache = fetchResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return fetchResponse;
          }
        );
      })
  );
});
