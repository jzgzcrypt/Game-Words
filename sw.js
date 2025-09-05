// Service Worker para Cosmic Depths
const CACHE_NAME = 'cosmic-depths-v1.0.0';
const STATIC_CACHE = 'cosmic-depths-static-v1.0.0';
const DYNAMIC_CACHE = 'cosmic-depths-dynamic-v1.0.0';

// Archivos a cachear estáticamente
const STATIC_FILES = [
    '/',
    '/index.html',
    '/game.js',
    '/manifest.json',
    '/assets/mobile-controls-simple.js',
    '/assets/optimized-graphics-system.js',
    '/assets/video-rewards-system.js',
    '/assets/boost-integration.js',
    '/assets/mission-system.js',
    '/assets/base-building-system.js',
    '/assets/mission-panel.js',
    '/assets/base-panel.js',
    '/assets/simple-graphics.js',
    '/assets/sprites.js',
    '/assets/merchant-system.js',
    '/assets/ship-evolution.js',
    '/assets/realistic-sprites.js',
    '/assets/boss-system.js',
    '/assets/pet-system.js',
    '/assets/game-systems.js',
    '/assets/enemy-sprites.js',
    '/assets/professional-submarines.js',
    '/assets/subnautica-vehicles.js',
    '/assets/player-submarine.js',
    '/assets/merchant-tavern.js',
    '/assets/ocean-effects.js',
    '/assets/biome-elements.js'
];

// Archivos de recursos (imágenes, sonidos, etc.)
const RESOURCE_FILES = [
    '/assets/icons/',
    '/assets/screenshots/',
    '/assets/audio/',
    '/assets/images/'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker instalando...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Cacheando archivos estáticos...');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Service Worker instalado correctamente');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Error al instalar Service Worker:', error);
            })
    );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker activando...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Eliminando cache obsoleto:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker activado correctamente');
                return self.clients.claim();
            })
    );
});

// Interceptar peticiones
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Estrategia de cache para diferentes tipos de archivos
    if (request.method === 'GET') {
        // Archivos estáticos
        if (STATIC_FILES.includes(url.pathname)) {
            event.respondWith(cacheFirst(request, STATIC_CACHE));
        }
        // Recursos (imágenes, sonidos)
        else if (RESOURCE_FILES.some(resource => url.pathname.startsWith(resource))) {
            event.respondWith(cacheFirst(request, DYNAMIC_CACHE));
        }
        // API calls y otros recursos dinámicos
        else if (url.pathname.startsWith('/api/') || url.pathname.includes('admob')) {
            event.respondWith(networkFirst(request, DYNAMIC_CACHE));
        }
        // Páginas HTML
        else if (request.headers.get('accept').includes('text/html')) {
            event.respondWith(networkFirst(request, DYNAMIC_CACHE));
        }
        // Otros recursos
        else {
            event.respondWith(networkFirst(request, DYNAMIC_CACHE));
        }
    }
});

// Estrategia: Cache First
async function cacheFirst(request, cacheName) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Error en cacheFirst:', error);
        
        // Fallback para archivos críticos
        if (request.url.includes('game.js') || request.url.includes('index.html')) {
            return new Response('Error: No se pudo cargar el juego', {
                status: 503,
                statusText: 'Service Unavailable'
            });
        }
        
        throw error;
    }
}

// Estrategia: Network First
async function networkFirst(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('Error en networkFirst:', error);
        
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        throw error;
    }
}

// Manejar mensajes del cliente
self.addEventListener('message', (event) => {
    const { type, data } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'GET_CACHE_INFO':
            event.ports[0].postMessage({
                type: 'CACHE_INFO',
                data: {
                    staticCache: STATIC_CACHE,
                    dynamicCache: DYNAMIC_CACHE,
                    staticFiles: STATIC_FILES.length,
                    resourceFiles: RESOURCE_FILES.length
                }
            });
            break;
            
        case 'CLEAR_CACHE':
            clearAllCaches();
            break;
            
        case 'UPDATE_CACHE':
            updateCache();
            break;
            
        default:
            console.log('Mensaje no reconocido:', type);
    }
});

// Limpiar todos los caches
async function clearAllCaches() {
    try {
        const cacheNames = await caches.keys();
        await Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('Todos los caches han sido limpiados');
        
        // Notificar a los clientes
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'CACHE_CLEARED',
                data: { success: true }
            });
        });
    } catch (error) {
        console.error('Error al limpiar caches:', error);
    }
}

// Actualizar cache
async function updateCache() {
    try {
        // Limpiar cache dinámico
        const dynamicCache = await caches.open(DYNAMIC_CACHE);
        await dynamicCache.clear();
        
        console.log('Cache dinámico actualizado');
        
        // Notificar a los clientes
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'CACHE_UPDATED',
                data: { success: true }
            });
        });
    } catch (error) {
        console.error('Error al actualizar cache:', error);
    }
}

// Manejar push notifications
self.addEventListener('push', (event) => {
    console.log('Push notification recibida:', event);
    
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body || '¡Nueva actualización disponible!',
            icon: '/assets/icons/icon-192x192.png',
            badge: '/assets/icons/icon-72x72.png',
            image: data.image || '/assets/screenshots/mobile-gameplay-1.png',
            vibrate: [200, 100, 200],
            data: {
                url: data.url || '/',
                action: data.action || 'play'
            },
            actions: [
                {
                    action: 'play',
                    title: '🎮 Jugar',
                    icon: '/assets/icons/play-96x96.png'
                },
                {
                    action: 'missions',
                    title: '📋 Misiones',
                    icon: '/assets/icons/missions-96x96.png'
                },
                {
                    action: 'videos',
                    title: '🎬 Videos',
                    icon: '/assets/icons/videos-96x96.png'
                }
            ],
            requireInteraction: true,
            tag: 'cosmic-depths-notification'
        };
        
        event.waitUntil(
            self.registration.showNotification('Cosmic Depths', options)
        );
    }
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', (event) => {
    console.log('Notificación clickeada:', event);
    
    event.notification.close();
    
    const { action, url } = event.notification.data;
    
    if (action) {
        // Abrir panel específico
        event.waitUntil(
            self.clients.matchAll()
                .then((clients) => {
                    if (clients.length > 0) {
                        // Enviar mensaje al cliente activo
                        clients[0].postMessage({
                            type: 'OPEN_PANEL',
                            data: { action }
                        });
                        clients[0].focus();
                    } else {
                        // Abrir nueva ventana
                        self.clients.openWindow(url);
                    }
                })
        );
    } else {
        // Abrir juego normalmente
        event.waitUntil(
            self.clients.openWindow(url)
        );
    }
});

// Manejar notificaciones cerradas
self.addEventListener('notificationclose', (event) => {
    console.log('Notificación cerrada:', event);
    
    // Analytics o tracking si es necesario
    const analyticsData = {
        notificationId: event.notification.tag,
        timestamp: Date.now(),
        action: 'closed'
    };
    
    // Enviar datos de analytics
    self.registration.pushManager.getSubscription()
        .then((subscription) => {
            if (subscription) {
                // Enviar a tu servidor de analytics
                fetch('/api/analytics/notification', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(analyticsData)
                }).catch(console.error);
            }
        });
});

// Manejar sincronización en background
self.addEventListener('sync', (event) => {
    console.log('Sincronización en background:', event);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(
            performBackgroundSync()
        );
    }
});

// Realizar sincronización en background
async function performBackgroundSync() {
    try {
        // Sincronizar datos del juego
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'BACKGROUND_SYNC',
                data: { timestamp: Date.now() }
            });
        });
        
        console.log('Sincronización en background completada');
    } catch (error) {
        console.error('Error en sincronización en background:', error);
    }
}

// Manejar errores del Service Worker
self.addEventListener('error', (event) => {
    console.error('Error en Service Worker:', event.error);
    
    // Reportar error a analytics
    const errorData = {
        message: event.error.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        timestamp: Date.now()
    };
    
    // Enviar a tu servidor de analytics
    fetch('/api/analytics/error', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(errorData)
    }).catch(console.error);
});

// Manejar rechazos de promesas no manejadas
self.addEventListener('unhandledrejection', (event) => {
    console.error('Promesa rechazada no manejada:', event.reason);
    
    // Reportar error a analytics
    const errorData = {
        type: 'unhandledrejection',
        reason: event.reason,
        timestamp: Date.now()
    };
    
    // Enviar a tu servidor de analytics
    fetch('/api/analytics/error', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(errorData)
    }).catch(console.error);
});

console.log('Service Worker cargado correctamente');