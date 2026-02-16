const CACHE_NAME = 'copychatt-v8';
const assets = [
    './',
    './index.html',
    './src/index.css',
    './src/main.js',
    './src/utils/storage.js',
    './public/logo.jpg'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(assets))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});
