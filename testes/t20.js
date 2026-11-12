const {chromium,devices}=require('playwright'); const fs=require('fs'), path=require('path');
const ROOT=''+require('path').join(__dirname,'..')+'';
(async()=>{
 const b=await chromium.launch(); const ctx=await b.newContext({...devices['iPhone 13'],serviceWorkers:'block'});
 await ctx.route('**/*',async r=>{ const u=r.request().url();
  if(u.includes('gstatic.com/firebasejs')) return r.fulfill({contentType:'application/javascript',body:u.includes('app-compat')?fs.readFileSync(__dirname+'/mockfb.js','utf8'):''});
  if(u.startsWith('https://app.local/')){ const f=u.replace('https://app.local/','').split('?')[0]||'index.html'; const fp=path.join(ROOT,f); return fs.existsSync(fp)?r.fulfill({contentType:f.endsWith('.js')?'application/javascript':'text/html',body:fs.readFileSync(fp)}):r.fulfill({status:404,body:''}); }
  return r.fulfill({body:''}); });
 const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.addInitScript(()=>{ window.__noUser=true; });
 await p.goto('https://app.local/index.html'); await p.waitForTimeout(400);
 await p.click('#btnLocal'); await p.waitForTimeout(300); await p.click('#instEntendi'); await p.waitForTimeout(200);
 await p.evaluate(()=>window.scrollTo(0,420)); await p.waitForTimeout(100);
 await p.screenshot({path:__dirname+'/t20.png'});
 console.log('premium:',await p.locator('.premium').count(),'| link:',await p.locator('.premium a').getAttribute('href'));
 await p.click('.premium [data-nao]'); await p.waitForTimeout(100);
 await p.reload(); await p.waitForTimeout(500);
 console.log('depois de "Agora não" e recarregar:',await p.locator('.premium').count(),'| erros:',errs);
 await b.close();
})();
