// Service worker: the app shell is cache-first; Hacker News data is network-first with a cached fallback for offline reading.
const SHELL = 'hn-shell-v4';
const DATA = 'hn-data-v1';
const FILES = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];
const API_HOSTS = ['hacker-news.firebaseio.com', 'hn.algolia.com'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== SHELL && k !== DATA).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
async function trimData() {
  const c = await caches.open(DATA);
  const keys = await c.keys();
  for (const k of keys.slice(0, Math.max(0, keys.length - 1500))) await c.delete(k);
}
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (API_HOSTS.includes(url.hostname)) {
    e.respondWith(fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(DATA).then((c) => c.put(req, copy)).then(trimData); }
      return res;
    }).catch(() => caches.match(req).then((hit) => hit || Response.error())));
    return;
  }
  if (url.origin === self.location.origin) {
    e.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => {
      const net = fetch(req).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(SHELL).then((c) => c.put(req, copy)); } return res; });
      return hit || net.catch(() => caches.match('./index.html'));
    }));
  }
});
