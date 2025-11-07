
const CACHE='vouchers-cache-final-v1';
const PRECACHE=['./','index.html','manifest.json','vouchers.json','icons/icon-192.png','icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(PRECACHE)));self.skipWaiting();});
self.addEventListener('activate',e=>{self.clients.claim();});
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  e.respondWith(caches.match(e.request).then(resp=>resp||fetch(e.request).then(r=>{
    if(e.request.method==='GET'&&(url.pathname.endsWith('.pdf')||PRECACHE.includes(url.pathname)||url.pathname.endsWith('/'))){
      const copy=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy));
    } return r;
  })).catch(()=>caches.match(e.request)));
});
self.addEventListener('message',event=>{
  if(event.data&&event.data.type==='cache-add'&&event.data.path){
    event.waitUntil((async()=>{const cache=await caches.open(CACHE); const req=new Request(event.data.path); const res=await fetch(req); await cache.put(req,res);})());
  }
});
