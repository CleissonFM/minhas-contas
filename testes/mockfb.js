(function(){
 const store=new Map(); const listeners=[]; let n=0;
 const notify=()=>setTimeout(()=>listeners.forEach(l=>l()),5);
 const clone=d=>JSON.parse(JSON.stringify(d));
 function docRef(path){ return {id:path.split('/').pop(), path,
   async set(d,o){ store.set(path, o&&o.merge ? Object.assign({},store.get(path)||{},clone(d)) : clone(d)); notify();},
   async update(d){ if(!store.has(path)) throw {code:'not-found'}; store.set(path,Object.assign({},store.get(path),clone(d)));notify();},
   async delete(){store.delete(path);notify();},
   collection(p){return colRef(path+'/'+p);},
   onSnapshot(next,err){ const fire=()=>{ const v=store.get(path); next({id:path.split('/').pop(),exists:!!v,data:()=>v}); }; listeners.push(fire); setTimeout(fire,20); return ()=>{}; } };}
 function colRef(path){ return { path, doc(id){return docRef(path+'/'+(id||('auto'+(++n))));}, async add(d){const r=this.doc();await r.set(d);return r;},
   onSnapshot(opts,next,err){ if(typeof opts==='function'){err=next;next=opts;} const depth=path.split('/').length+1;
     const fire=()=>{const docs=[...store.entries()].filter(([k])=>k.startsWith(path+'/')&&k.split('/').length===depth).map(([k,v])=>({id:k.split('/').pop(),data:()=>v})); next({docs,metadata:{fromCache:false}});};
     listeners.push(fire); setTimeout(fire,20); return ()=>{const i=listeners.indexOf(fire); if(i>=0) listeners.splice(i,1);}; } };}
 const fs={collection:colRef,doc:docRef,enablePersistence:()=>Promise.resolve(),terminate:()=>Promise.resolve(),clearPersistence:()=>Promise.resolve()};
 window.__store=store;
 window.__seed=arr=>{arr.forEach(c=>{const {id,...r}=c;store.set('users/u1/contas/'+id,r);});notify();};
 let authCb=null; const user={uid:(window.__uid||'u1'),email:'teste@exemplo.com'};
 const auth={onAuthStateChanged(cb){authCb=cb;setTimeout(()=>cb(window.__noUser?null:user),10);}, getRedirectResult:()=>Promise.resolve(null), signOut(){window.__saiu=true; authCb&&authCb(null); return Promise.resolve();}, signInWithPopup:()=>Promise.resolve(), signInWithEmailAndPassword:()=>{ window.__noUser=false; setTimeout(()=>authCb&&authCb(user),10); return Promise.resolve(); }, createUserWithEmailAndPassword:()=>Promise.resolve(), sendPasswordResetEmail:()=>Promise.resolve()};
 function GoogleAuthProvider(){ this.setCustomParameters=()=>{}; }
 window.firebase={initializeApp(){}, auth:Object.assign(()=>auth,{GoogleAuthProvider}), firestore:()=>fs};
})();
