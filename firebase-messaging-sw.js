// firebase-messaging-sw.js
// MUH Plastic Handover — FCM Background Notifications
// This file MUST be at the root of your site (same level as index.html)

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCZc8g17IYScKDJLYHrjuY749kTvzBvJi4",
  authDomain: "muh-plastic-handover.firebaseapp.com",
  databaseURL: "https://muh-plastic-handover-default-rtdb.firebaseio.com",
  projectId: "muh-plastic-handover",
  storageBucket: "muh-plastic-handover.firebasestorage.app",
  messagingSenderId: "366426667486",
  appId: "1:366426667486:web:086255fb4dba5b3a6a454f"
});

const messaging = firebase.messaging();

// Handle background messages (app closed or in background)
messaging.onBackgroundMessage(function(payload) {
  console.log('[FCM SW] Background message received:', payload);

  const notificationTitle = payload.notification?.title || payload.data?.title || '🔔 MUH Plastic';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || 'New update',
    icon: './icon-192.png',
    badge: './icon-192.png',
    tag: payload.data?.tag || 'psx-notif',
    renotify: true,
    data: payload.data || {},
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click — open/focus the app
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'dismiss') return;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // If app already open, focus it
      for (let client of clientList) {
        if (client.url.includes('muh-plastic') && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow('./');
      }
    })
  );
});
