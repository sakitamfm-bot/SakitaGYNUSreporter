// Offline cache for SakitaGYNUSreporter. The cache name changes whenever any file changes, so a new upload replaces the old copy
// on the next online launch; until then (and whenever offline) the stored copy is used.
const CACHE = 'sakita-gynus-5106c2229e';
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, {cache: 'reload'})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('sakita-gynus-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(caches.match(r, {ignoreSearch: true}).then(hit => hit || fetch(r).catch(() =>
    r.mode === 'navigate' ? caches.match('index.html') : Response.error())));
});
