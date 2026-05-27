const CACHE_NAME = "death-note-v13";

const urlsToCache = [
  "/Death-Note/",
  "/Death-Note/index.html",
  "/Death-Note/style.css",
  "/Death-Note/script.js",
  "/Death-Note/manifest.json"
];

self.addEventListener("install", event => {

  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );

});

self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(keys => {

      return Promise.all(

        keys.map(key => {

          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }

        })

      );

    })

  );

});

self.addEventListener("fetch", event => {

  event.respondWith(

    fetch(event.request)

      .then(response => {

        const clone = response.clone();

        caches.open(CACHE_NAME)
          .then(cache => cache.put(event.request, clone));

        return response;

      })

      .catch(() => caches.match(event.request))

  );

});
