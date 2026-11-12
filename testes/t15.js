const H=require('./harness');
const calc=async(p,parc,val)=>{ await p.click('nav.bar .add'); await p.fill('#parcelas',String(parc)); await p.fill('#valor',String(val)); await p.dispatchEvent('#valor','input'); return [await p.inputValue('#regra'),await p.inputValue('#cTotalIn'),await p.locator('#cMult').innerText()]; };
(async()=>{
await H(async p=>{
  await p.waitForTimeout(400);
  console.log('CLEISSON prefs:',JSON.stringify(await p.evaluate(()=>window.__store.get('users/u1/config/prefs'))));
  console.log('CLEISSON 4x R$1000:',await calc(p,4,1000));
  console.log('CLEISSON 2x R$1000:',await calc(p,2,1000));
});
await H(async p=>{
  await p.waitForTimeout(400);
  console.log('NOVO prefs:',JSON.stringify(await p.evaluate(()=>window.__store.get('users/u1/config/prefs'))));
  console.log('NOVO 4x R$1000:',await calc(p,4,1000));
  // salva uma venda e recarrega: não pode ganhar a regra do Cleisson
  await p.fill('#nome','Cliente do Novo'); await p.click('#btnSalvar'); await p.waitForTimeout(1500);
  console.log('NOVO prefs depois de cadastrar:',JSON.stringify(await p.evaluate(()=>window.__store.get('users/u1/config/prefs'))));
  await p.click('#sync'); console.log('NOVO info:',await p.locator('#rgInfo').innerText());
  await p.fill('#rgLimite','2'); await p.fill('#rgAte','1,5'); await p.fill('#rgAcima','1,8'); await p.click('#btnRegra'); await p.waitForTimeout(200);
  console.log('NOVO 4x com regra própria:',await calc(p,4,1000));
},{empty:true});
})();
