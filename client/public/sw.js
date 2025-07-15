// Service Worker for BibleAudio 4L - Enhanced for Play Store
const CACHE_NAME = 'bibleaudio-v2.0';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icon-512.png',
  '/icon-192.png',
  '/icon-144.png',
  '/icon-96.png',
  '/bible-icon-option2.svg'
];

// Install event - precache essential resources
self.addEventListener('install', function(event) {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Caching essential resources');
        return cache.addAll(urlsToCache).catch(err => {
          console.warn('Some resources failed to cache:', err);
          // Continue even if some resources fail
          return Promise.resolve();
        });
      })
      .then(() => {
        self.skipWaiting(); // Activate immediately
      })
  );
});

// Fetch event - Network first, then cache fallback with offline page
self.addEventListener('fetch', function(event) {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        // If network request succeeds, clone and cache it
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(function() {
        // Network failed, try cache
        return caches.match(event.request)
          .then(function(cachedResponse) {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // If it's a navigation request and we don't have it cached
            if (event.request.mode === 'navigate') {
              return new Response(`
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <title>오프라인 - 성경듣기</title>
                  <style>
                    body { 
                      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                      display: flex; 
                      flex-direction: column;
                      align-items: center; 
                      justify-content: center; 
                      min-height: 100vh; 
                      margin: 0;
                      background-color: #2D1810;
                      color: #F5F5DC;
                      text-align: center;
                      padding: 20px;
                    }
                    h1 { color: #D2691E; margin-bottom: 20px; }
                    p { margin: 10px 0; line-height: 1.5; }
                    .icon { font-size: 48px; margin-bottom: 20px; }
                    .retry-btn {
                      background: #8B4513;
                      color: white;
                      padding: 12px 24px;
                      border: none;
                      border-radius: 8px;
                      cursor: pointer;
                      margin-top: 20px;
                      font-size: 16px;
                    }
                  </style>
                </head>
                <body>
                  <div class="icon">📖</div>
                  <h1>오프라인 상태</h1>
                  <p>인터넷 연결을 확인해주세요.</p>
                  <p>연결이 복구되면 다시 시도해보세요.</p>
                  <button class="retry-btn" onclick="window.location.reload()">다시 시도</button>
                </body>
                </html>
              `, {
                headers: { 'Content-Type': 'text/html; charset=utf-8' }
              });
            }
            
            // For other requests, return a simple response
            return new Response('오프라인 상태입니다.', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', function(event) {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated');
      return self.clients.claim(); // Take control of all pages
    })
  );
});

// Handle messages from main thread
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});