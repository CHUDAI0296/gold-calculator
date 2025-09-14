/**
 * Service Worker for Gold Calculator
 * Handles caching strategies for improved performance
 */

const CACHE_NAME = 'gold-calculator-v1.2';
const CACHE_URLS = [
    '/',
    '/index.html',
    '/calculator.html',
    '/market.html',
    '/metals.html',
    '/css/styles.css',
    '/css/print-styles.css',
    '/js/main.js',
    '/js/gold-api.js',
    '/js/calculator.js',
    '/js/market-charts.js',
    '/js/metals-calculator.js',
    '/images/logo.svg',
    '/images/favicon.svg',
    '/images/favicon.ico'
];

// External resources to cache
const EXTERNAL_CACHE_NAME = 'gold-calculator-external-v1.2';
const EXTERNAL_URLS = [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'
];

// Install event - cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        Promise.all([
            caches.open(CACHE_NAME).then(cache => {
                console.log('Caching app shell...');
                return cache.addAll(CACHE_URLS);
            }),
            caches.open(EXTERNAL_CACHE_NAME).then(cache => {
                console.log('Caching external resources...');
                return cache.addAll(EXTERNAL_URLS);
            })
        ])
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME && cacheName !== EXTERNAL_CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve cached content with fallback strategies
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Handle different types of requests with appropriate strategies
    if (request.destination === 'document') {
        // HTML pages - Network First with Cache Fallback
        event.respondWith(networkFirstWithCache(request));
    } else if (request.destination === 'style' || request.destination === 'script') {
        // CSS and JS - Cache First with Network Fallback
        event.respondWith(cacheFirstWithNetwork(request));
    } else if (request.destination === 'image') {
        // Images - Cache First with Network Fallback
        event.respondWith(cacheFirstWithNetwork(request));
    } else if (url.origin !== location.origin) {
        // External resources - Stale While Revalidate
        event.respondWith(staleWhileRevalidate(request));
    } else {
        // Default - Network First
        event.respondWith(networkFirstWithCache(request));
    }
});

// Network First with Cache Fallback (for HTML)
async function networkFirstWithCache(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }
        throw new Error('Network response not ok');
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        // Return offline page or error response
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
    }
}

// Cache First with Network Fallback (for static assets)
async function cacheFirstWithNetwork(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cacheName = request.url.startsWith(self.location.origin) ? CACHE_NAME : EXTERNAL_CACHE_NAME;
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }
        throw new Error('Network response not ok');
    } catch (error) {
        console.error('Failed to fetch resource:', request.url, error);
        return new Response('Resource not available', { status: 404 });
    }
}

// Stale While Revalidate (for external resources)
async function staleWhileRevalidate(request) {
    const cachedResponse = await caches.match(request);

    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
            const cache = caches.open(EXTERNAL_CACHE_NAME);
            cache.then(c => c.put(request, networkResponse.clone()));
        }
        return networkResponse;
    }).catch(error => {
        console.warn('Failed to update cache for:', request.url, error);
        return cachedResponse;
    });

    return cachedResponse || fetchPromise;
}

// Background sync for offline actions (if needed)
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    // Handle background sync tasks
    console.log('Background sync triggered');
}

// Handle push notifications (if needed)
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/images/favicon.svg',
            badge: '/images/favicon.svg',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: data.primaryKey
            },
            actions: [
                {
                    action: 'explore',
                    title: 'View Calculator',
                    icon: '/images/favicon.svg'
                },
                {
                    action: 'close',
                    title: 'Close',
                    icon: '/images/favicon.svg'
                }
            ]
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});