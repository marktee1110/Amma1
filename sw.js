const CACHE_NAME = "app-cache-v1";
const urlsToCache = [
  "/index.html",
  "/css/index.css",
  "/js/index.js",
  "/icon-192.png",
  "/icon-512.png"
];

// تثبيت الـ Service Worker وتخزين الملفات في الكاش
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// التقاط كل طلب Fetch وإرجاعه من الكاش أو الشبكة
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// تحديث الكاش عند تفعيل نسخة جديدة من Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
});