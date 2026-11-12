require('./harness')(async p=>{
  // simula senha antiga (versão anterior) guardada sem conta
  await p.click('#sync');
  await p.locator('#vConta .tema[data-t=roxo]').click(); await p.waitForTimeout(200);
  await p.fill('#rgLimite','5'); await p.fill('#rgAte','1,5'); await p.fill('#rgAcima','1,8'); await p.click('#btnRegra'); await p.waitForTimeout(300);
  console.log('prefs:',JSON.stringify(await p.evaluate(()=>window.__store.get('users/u1/config/prefs'))));
  await p.click('nav.bar .add'); await p.fill('#parcelas','4'); await p.fill('#valor','1000'); await p.dispatchEvent('#valor','input');
  console.log('4x com regra nova:',await p.inputValue('#cTotalIn'),'|',await p.locator('#cMult').innerText());
  await p.fill('#parcelas','6'); await p.dispatchEvent('#parcelas','input');
  console.log('6x:',await p.inputValue('#cTotalIn'),'|',await p.locator('#cMult').innerText());
  console.log('opcao:',await p.locator('#optAuto').textContent());
  // senha por conta
  await p.click('#sync'); await p.click('#btnPin');
  for(const k of '24682468') await p.locator('#lockPad button',{hasText:new RegExp('^'+k+'$')}).click();
  await p.waitForTimeout(300);
  console.log('chaves:',await p.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('cc_'))));
  await p.click('#btnSair'); await p.waitForTimeout(800);
  console.log('saiu, tema:',await p.evaluate(()=>document.documentElement.dataset.tema||'verde'));
});
