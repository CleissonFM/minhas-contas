const {chromium,devices}=require('playwright'); const fs=require('fs'), path=require('path');
const ROOT=path.join(__dirname,'..');
(async()=>{
 const b=await chromium.launch(); const ctx=await b.newContext({...devices['iPhone 13'],serviceWorkers:'block'});
 await ctx.route('**/*',async r=>{ const u=r.request().url();
  if(u.includes('gstatic.com/firebasejs')) return r.fulfill({contentType:'application/javascript',body:u.includes('app-compat')?fs.readFileSync(__dirname+'/mockfb.js','utf8'):''});
  if(u.startsWith('https://app.local/')){ const f=u.replace('https://app.local/','').split('?')[0]||'index.html'; const fp=path.join(ROOT,f); const ct={'.html':'text/html','.js':'application/javascript','.png':'image/png','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'}[path.extname(fp)]||'text/plain'; return fs.existsSync(fp)?r.fulfill({contentType:ct,body:fs.readFileSync(fp)}):r.fulfill({status:404,body:''}); }
  return r.fulfill({body:''}); });
 const p=await ctx.newPage(); await p.addInitScript(()=>{ window.__noUser=true; });
 await p.goto('https://app.local/index.html'); await p.waitForTimeout(500);
 await p.screenshot({path:__dirname+'/t23a.png',clip:{x:0,y:0,width:390,height:330}});
 await p.click('#btnLocal'); await p.waitForTimeout(300); await p.click('#instEntendi');
 await p.screenshot({path:__dirname+'/t23b.png',clip:{x:0,y:0,width:390,height:120}});
 await b.close();
})();
