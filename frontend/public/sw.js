// Minimal offline-shell service worker.
// Strategy: cache-first for same-origin static assets (JS/CSS/images/fonts,
// which are content-hashed by Next.js and safe to cache indefinitely),
// network-first-with-cache-fallback for page navigations and API GETs, so
// a page the user has already visited keeps working when they lose
// connectivity, while online users always see fresh data.
const CACHE_NAME = "lexep-shell-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

function isStaticAsset(url) {
  return url.pathname.startsWith("/_next/static/") || /\.(png|jpg|jpeg|svg|webp|ico|woff2?)$/.test(url.pathname);
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return; // never intercept cross-origin (API) calls here
  if (event.request.method !== "GET") return;

  if (isStaticAsset(url)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        const response = await fetch(event.request);
        cache.put(event.request, response.clone());
        return response;
      })
    );
    return;
  }

  // Page navigations: network-first, falling back to the cached shell.
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()));
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match("/")))
  );
});
