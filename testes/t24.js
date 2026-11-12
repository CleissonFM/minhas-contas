const {chromium,devices}=require('playwright'); const fs=require('fs'), path=require('path');
const ROOT=path.join(__dirname,'..');
(async()=>{
 const b=await chromium.launch(); const ctx=await b.newContext({...devices['iPhone 13'],serviceWorkers:'block'});
 await ctx.route('**/*',async r=>{ const u=r.request().url();
  if(u.includes('gstatic.com/firebasejs')) return r.fulfill({contentType:'application/javascript',body:u.includes('app-compat')?fs.readFileSync(__dirname+'/mockfb.js','utf8'):''});
  if(u.startsWith('https://app.local/')){ const f=u.replace('https://app.local/','').split('?')[0]||'index.html'; const fp=path.join(ROOT,f); const ct={'.html':'text/html','.js':'application/javascript','.png':'image/png','.svg':'image/svg+xml'}[path.extname(fp)]||'text/plain'; return fs.existsSync(fp)?r.fulfill({contentType:ct,body:fs.readFileSync(fp)}):r.fulfill({status:404,body:''}); }
  return r.fulfill({body:''}); });
 const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.addInitScript(()=>{ window.__noUser=true; });
 await p.goto('https://app.local/index.html'); await p.waitForTimeout(400);
 await p.click('#btnLocal'); await p.waitForTimeout(300); await p.click('#instEntendi'); await p.waitForTimeout(200);
 console.log('tema novo usuario:',await p.evaluate(()=>document.documentElement.dataset.tema));
 await p.screenshot({path:__dirname+'/t24a.png'});
 await p.click('#btnCores'); await p.waitForTimeout(200); await p.locator('#sheetCores .sheet-box').screenshot({path:__dirname+'/t24b.png'});
 await p.locator('#sheetCores .tema[data-t=verde]').click(); await p.waitForTimeout(100);
 console.log('trocou p/ verde:',await p.evaluate(()=>document.documentElement.dataset.tema||'verde'),'| erros:',errs);
 await b.close();
})();
