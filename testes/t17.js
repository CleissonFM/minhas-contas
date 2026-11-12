const {chromium,devices}=require('playwright'); const fs=require('fs'), path=require('path');
const ROOT=''+require('path').join(__dirname,'..')+'';
(async()=>{
 const b=await chromium.launch(); const ctx=await b.newContext({...devices['iPhone 13'],serviceWorkers:'block',acceptDownloads:true});
 let semInternet=false;
 await ctx.route('**/*',async r=>{ const u=r.request().url();
  if(u.includes('gstatic.com/firebasejs')){ if(semInternet) return r.abort(); return r.fulfill({contentType:'application/javascript',body:u.includes('app-compat')?fs.readFileSync(__dirname+'/mockfb.js','utf8'):''}); }
  if(u.startsWith('https://app.local/')){ const f=u.replace('https://app.local/','').split('?')[0]||'index.html'; const fp=path.join(ROOT,f); return fs.existsSync(fp)?r.fulfill({contentType:f.endsWith('.js')?'application/javascript':'text/html',body:fs.readFileSync(fp)}):r.fulfill({status:404,body:''}); }
  return r.fulfill({body:''}); });
 const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.addInitScript(()=>{ window.__noUser=true; });
 await p.goto('https://app.local/index.html'); await p.waitForTimeout(500);
 console.log('login visivel:',await p.locator('#login').isVisible());
 await p.screenshot({path:__dirname+'/t17a.png'});
 await p.click('#btnLocal'); await p.waitForTimeout(400); await p.click('#instEntendi');
 console.log('sync:',await p.locator('#sync').innerText());
 // cadastra uma pessoa
 await p.click('#novFechar').catch(()=>{});
 await p.click('nav.bar .add'); await p.fill('#nome','Cliente Local'); await p.fill('#parcelas','2'); await p.fill('#cParcIn','150'); await p.dispatchEvent('#cParcIn','input');
 await p.click('#btnSalvar'); await p.waitForTimeout(1500);
 console.log('ficha:',await p.locator('#pNome').innerText(),'|',await p.locator('#pStatus').innerText());
 // recarrega SEM internet: app deve abrir com os dados locais
 semInternet=true; await p.reload(); await p.waitForTimeout(800);
 console.log('offline -> login escondido:',await p.locator('#login').isHidden(),'| linhas:',await p.locator('.row').count(),'| sync:',await p.locator('#sync').innerText());
 await p.click('#sync'); await p.waitForTimeout(150);
 console.log('conta:',await p.locator('#contaEmail').innerText(),'| cardLocal:',await p.locator('#cardLocal').isVisible());
 await p.click('#btnInstalar'); console.log('passos instalar abertos:',await p.locator('#sheetInstalar').isVisible()); await p.click('#instEntendi');
 await p.locator('#cardLocal').scrollIntoViewIfNeeded(); await p.screenshot({path:__dirname+'/t17b.png'});
 const [dl]=await Promise.all([p.waitForEvent('download'),p.click('#btnExport')]); await dl.saveAs(__dirname+'/local-backup.json');
 console.log('backup contas:',JSON.parse(fs.readFileSync(__dirname+'/local-backup.json','utf8')).contas.length);
 await p.click('#btnSair'); await p.waitForTimeout(300); console.log('saiu -> login:',await p.locator('#login').isVisible());
 console.log('erros:',errs);
 await b.close();
})();
