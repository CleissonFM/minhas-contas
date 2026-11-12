// uso: node harness.js <script-de-teste.js>
const {chromium,devices}=require('playwright'); const fs=require('fs'); const path=require('path');
const ROOT=''+require('path').join(__dirname,'..')+''; const SP=__dirname;
module.exports=async function(fn,opts={}){
  const b=await chromium.launch(); const ctx=await b.newContext({...devices['iPhone 13'],...(opts.ctx||{})});
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{ if(m.type()==='error') errs.push('console: '+m.text()); });
  await p.route('**/*',async r=>{ const u=r.request().url();
    if(u.includes('gstatic.com/firebasejs')){ return r.fulfill({contentType:'application/javascript',body:u.includes('firebase-app-compat')?fs.readFileSync(SP+'/mockfb.js','utf8'):''}); }
    if(u.startsWith('http://app.local/')){ let f=u.replace('http://app.local/','').split('?')[0]||'index.html'; const fp=path.join(ROOT,f); if(fs.existsSync(fp)){ const ct={'.html':'text/html','.js':'application/javascript','.json':'application/json','.png':'image/png','.webmanifest':'application/manifest+json'}[path.extname(fp)]||'text/plain'; return r.fulfill({contentType:ct,body:fs.readFileSync(fp)}); } return r.fulfill({status:404,body:'nf'}); }
    if(u.includes('fonts.g')) return r.fulfill({body:''});
    return r.continue(); });
  await p.goto('http://app.local/index.html'); await p.waitForTimeout(300);
  if(!opts.empty){ const data=JSON.parse(fs.readFileSync((require('fs').existsSync(SP+'/backup-contas.json')?SP+'/backup-contas.json':SP+'/dados-exemplo.json'),'utf8')).contas; await p.evaluate(d=>window.__seed(d),data); await p.waitForTimeout(200); }
  try{ await fn(p); } finally { if(errs.length) console.log('ERROS DA PÁGINA:',errs); await b.close(); }
};
