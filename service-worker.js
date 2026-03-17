const CACHE_NAME = 'deepfocus-v5';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json'
];

// Install event - cache assets (skip app.html to avoid redirect issues)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cache static assets that don't redirect
      return Promise.all(
        ASSETS_TO_CACHE.map(url => {
          return fetch(url, { redirect: 'follow' })
            .then(response => {
              if (response.ok) {
                return cache.put(url, response);
              }
            })
            .catch(() => {
              // Ignore cache failures for individual files
              console.log('Failed to cache:', url);
            });
        })
      );
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip service worker for non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  const url = new URL(event.request.url);
  
  // Skip service worker for external requests
  if (url.origin !== location.origin) {
    return;
  }
  
  // IMPORTANT: Skip service worker for app.html - always fetch fresh
  // This prevents caching redirected responses
  if (url.pathname === '/app.html' || url.pathname.endsWith('/app.html')) {
    return; // Let browser handle it directly, no service worker interference
  }
  
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Fetch from network with redirect mode set to 'follow'
      return fetch(event.request, {
        redirect: 'follow',
        credentials: 'same-origin'
      }).then((response) => {
        // Handle redirects - don't cache them
        if (response.redirected || response.type === 'opaqueredirect') {
          return response;
        }
        
        // Don't cache errors or non-200 responses
        if (!response || response.status !== 200) {
          return response;
        }
        
        // Only cache successful, non-redirected responses
        if (response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            // Don't cache if it's a redirect
            if (!responseToCache.redirected) {
              cache.put(event.request, responseToCache);
            }
          });
        }
        
        return response;
      }).catch((error) => {
        console.log('Fetch error:', error);
        // Offline fallback - return cached index.html for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html') || caches.match('/');
        }
        // Return error for other requests
        return new Response('Network error', { status: 408 });
      });
    })
  );
});
