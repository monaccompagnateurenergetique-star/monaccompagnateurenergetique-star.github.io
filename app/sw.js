/* Service worker d'Atelier PDF
   - garde l'appli en mémoire pour qu'elle fonctionne sans connexion ;
   - reçoit les fichiers envoyés depuis le menu « Partager » d'Android.
   À CHAQUE MODIFICATION DE app/ : augmenter VERSION (atelier-v1 → atelier-v2…). */
const VERSION = 'atelier-v72';
const CACHE_PARTAGE = 'atelier-partage';
// Bibliothèques lourdes et facultatives (Excel, OCR) : téléchargées à la première utilisation,
// puis gardées hors ligne dans un cache à part, qui n'est PAS vidé à chaque nouvelle version de l'appli.
const CACHE_EXTRAS = 'atelier-extras-v1';
const EXTRAS = /\/lib\/(ocr|xlsx)\//;
const FICHIERS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'lib/pdf.min.js',
  'lib/pdf.worker.min.js',
  'lib/pdf-lib.min.js',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'modeles/cerfa_15923-01.pdf'
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
      .then(cles => Promise.all(cles.filter(c => c !== VERSION && c !== CACHE_PARTAGE && c !== CACHE_EXTRAS).map(c => caches.delete(c))))
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

  if (EXTRAS.test(url.pathname)) {
    event.respondWith(caches.open(CACHE_EXTRAS).then(async cache => {
      const garde = await cache.match(req);
      if (garde) return garde;
      const rep = await fetch(req);
      if (rep.ok) cache.put(req, rep.clone());
      return rep;
    }));
    return;
  }

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
    // Garde-fous : 40 fichiers au plus, 150 Mo au plus chacun (l'appli refait aussi ces vérifications)
    const fichiers = donnees.getAll('fichiers').filter(f => f && typeof f !== 'string' && f.size <= 150 * 1048576).slice(0, 40);
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
