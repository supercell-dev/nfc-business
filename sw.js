// SuperTap PWA Service Worker
const CACHE_NAME = 'supertap-v1';
const OFFLINE_URL = 'index.html';

const ASSETS_TO_CACHE = [
    '/',
    'index.html',
    'store.html',
    'services.html',
    'product-lite.html',
    'product-pro.html',
    'product-elite.html',
    'privacy.html',
    'terms.html',
    'translations.js',
    'manifest.json',
    'icon.svg'
];

// Install: cache critical assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(cacheNames.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))
        )
    );
    self.clients.claim();
});

// Fetch: network-first, fallback to cache
self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => caches.match(OFFLINE_URL))
        );
        return;
    }
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});
