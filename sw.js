const V='yotei-v1.4.9';
const SHELL='yotei-shell-'+V;
const ASSETS=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png','grok-yuzu.js?v=gy4','yuka.js?v=yk2','nav.js?v=nv3','sent-status.js?v=ss1','backup.js?v=bk4'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(SHELL).then(c=>c.addAll(ASSETS)))});
// only delete this app's own old caches (never other notes' caches)
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('yotei-')&&k!==SHELL).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(/grok-yuzu\.json|yuka\.json|restore\/latest\.json/.test(e.request.url))return;const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
  const key=u.pathname.includes('/data/')?u.origin+u.pathname:e.request;
  e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(r.ok){const cp=r.clone();caches.open(SHELL).then(c=>c.put(key,cp))}return r})
    .catch(()=>caches.match(key,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))))});
