// Guarda o app no aparelho para abrir mesmo sem internet.
const CACHE='caderneta-v2';
const APP=['./','index.html','firebase-config.js','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
const SDK=['app','auth','firestore'].map(n=>`https://www.gstatic.com/firebasejs/10.12.2/firebase-${n}-compat.js`);
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll([...APP,...SDK]).catch(()=>c.addAll(APP))).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET') return;
  const url=new URL(req.url);
  // Banco de dados e login: sempre direto pela internet (o Firestore cuida do modo offline).
  if(url.hostname.includes('googleapis.com') && !url.hostname.startsWith('fonts.')) return;
  if(url.hostname.includes('firebaseapp.com')||url.hostname.includes('google.com')) return;
  const mesmoSite=url.origin===self.location.origin;
  if(mesmoSite){
    // App: busca a versão nova; sem internet, usa a guardada.
    e.respondWith(fetch(req).then(r=>{ if(r.ok){ const cp=r.clone(); caches.open(CACHE).then(c=>c.put(req,cp)); } return r; }).catch(()=>caches.match(req,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));
    return;
  }
  if(url.hostname==='www.gstatic.com'||url.hostname.startsWith('fonts.')){
    e.respondWith(caches.match(req).then(r=>r||fetch(req).then(res=>{ const cp=res.clone(); caches.open(CACHE).then(c=>c.put(req,cp)); return res; })));
  }
});
