const CACHE_NAME = 'math-tutor-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './static/styles/style.css',
  './static/scripts/script.js',
  './static/logo.png',
  './static/icons/icon-72.png',
  './static/icons/icon-96.png',
  './static/icons/icon-128.png',
  './static/icons/icon-192.png',
  './static/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
