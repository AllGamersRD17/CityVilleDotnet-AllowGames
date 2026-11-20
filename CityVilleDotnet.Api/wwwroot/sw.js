// CityVille Revived - Allow Games: service worker para los avisos en el celular (Web Push).
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('push', function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { title: 'CityVille', body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'CityVille', {
    body: d.body || '',
    icon: '/ag/icon_192.png',
    badge: '/ag/badge_96.png',
    tag: d.tag || undefined,
    renotify: !!d.tag,
    vibrate: [80, 40, 80],
    data: { url: d.url || '/Game' }
  }));
});

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || '/Game';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      if (c.url.indexOf('/Game') >= 0 && 'focus' in c) { c.postMessage({ agNav: url }); return c.focus(); }
    }
    return self.clients.openWindow(url);
  }));
});
