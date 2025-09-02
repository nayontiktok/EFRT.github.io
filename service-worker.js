const CACHE_NAME = 'monapp-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/1.png',
  '/icons/2.png'
];

// INSTALLATION : mise en cache des fichiers
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()) // force le SW actif immédiatement
  );
});

// ACTIVATION
self.addEventListener('activate', event => {
  event.waitUntil(
    clients.claim() // prend le contrôle immédiatement
  );
});

// FETCH : récupération depuis cache ou réseau
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// NOTIFICATION CLICK : ouvre la PWA quand on clique dessus
self.addEventListener('notificationclick', event => {
  event.notification.close(); // ferme la notification
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      for (let client of windowClients) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});

// PUSH : affiche une notification au lancement si permission accordée
self.addEventListener('push', event => {
  const data = event.data ? event.data.text() : "Bienvenue sur MonApp !";
  const options = {
    body: data,
    icon: '/icons/1.png',
    vibrate: [100, 50, 100],
    tag: 'welcome-notification'
  };
  event.waitUntil(
    self.registration.showNotification('MonApp', options)
  );
});
