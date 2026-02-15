// =============================================
// FarmaPalabra: Trasplante - Service Worker
// Hospital U.P. La Fe - Servicio de Farmacia
// =============================================

const CACHE_NAME = 'farmapalabra-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './styles.css',
    './game.js',
    './Logo-La-Fe.jpg',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png',
    'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Instalando...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[ServiceWorker] Cacheando archivos de la aplicación');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                console.log('[ServiceWorker] Instalación completada');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[ServiceWorker] Error durante la instalación:', error);
            })
    );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activando...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[ServiceWorker] Eliminando caché antigua:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[ServiceWorker] Activación completada');
                return self.clients.claim();
            })
    );
});

// Estrategia de caché: Cache First, luego Network
self.addEventListener('fetch', (event) => {
    // Solo manejar peticiones GET
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Si está en caché, devolverlo
                if (cachedResponse) {
                    console.log('[ServiceWorker] Sirviendo desde caché:', event.request.url);
                    return cachedResponse;
                }

                // Si no está en caché, buscar en la red
                console.log('[ServiceWorker] Buscando en red:', event.request.url);
                return fetch(event.request)
                    .then((networkResponse) => {
                        // Verificar que la respuesta sea válida
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        // Clonar la respuesta para guardarla en caché
                        const responseToCache = networkResponse.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return networkResponse;
                    })
                    .catch((error) => {
                        console.error('[ServiceWorker] Error de red:', error);

                        // Si falla la red y es una página HTML, mostrar página offline
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match('./index.html');
                        }
                    });
            })
    );
});

// Manejar mensajes del cliente
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
