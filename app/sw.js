/* Service worker d'Atelier PDF
   - garde l'appli en mémoire pour qu'elle fonctionne sans connexion ;
   - reçoit les fichiers envoyés depuis le menu « Partager » d'Android.
   À CHAQUE MODIFICATION DE app/ : augmenter VERSION (atelier-v1 → atelier-v2…). */
const VERSION = 'atelier-v12';
const CACHE_PARTAGE = 'atelier-partage';
const FICHIERS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'lib/pdf.min.js',
  'lib/pdf.worker.min.js',
  'lib/pdf-lib.min.js',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION)
      .then(cache => cache.addAll(FICHIERS.map(u => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cles => Promise.all(cles.filter(c => c !== VERSION && c !== CACHE_PARTAGE).map(c => caches.delete(c))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Fichiers reçus depuis « Partager » : on les garde en mémoire locale, puis on ouvre l'appli.
  if (req.method === 'POST' && url.pathname.endsWith('/share-target')) {
    event.respondWith(recevoirPartage(req));
    return;
  }
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  // Page de l'appli : version en mémoire (même avec ?partage=1)
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match('index.html', { cacheName: VERSION })
        .then(rep => rep || fetch(req))
        .catch(() => caches.match('./'))
    );
    return;
  }
  event.respondWith(
    caches.match(req, { cacheName: VERSION }).then(rep => rep || fetch(req))
  );
});

async function recevoirPartage(req) {
  try {
    const donnees = await req.formData();
    const fichiers = donnees.getAll('fichiers').filter(f => f && typeof f !== 'string');
    const cache = await caches.open(CACHE_PARTAGE);
    for (const k of await cache.keys()) await cache.delete(k);
    let n = 0;
    for (const f of fichiers) {
      await cache.put(new Request(`partage-${Date.now()}-${n++}`), new Response(f, {
        headers: { 'Content-Type': f.type || 'application/octet-stream', 'X-Nom': encodeURIComponent(f.name || 'document') }
      }));
    }
  } catch (e) {
    // en cas d'échec, on ouvre quand même l'appli
  }
  return Response.redirect('./?partage=1', 303);
}
