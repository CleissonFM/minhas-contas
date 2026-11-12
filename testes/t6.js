const H=require('./harness');
(async()=>{
await H(async p=>{
  // nova pessoa (me deve) com regra automatica 4x
  await p.click('nav.bar .add'); await p.fill('#nome','Cliente Teste'); await p.fill('#tel','98 99999-0000'); await p.fill('#item','iPhone 13');
  await p.fill('#parcelas','4'); await p.fill('#valor','1000'); await p.dispatchEvent('#valor','input');
  console.log('calc total/parcela:',await p.inputValue('#cTotalIn'),await p.inputValue('#cParcIn'));
  await p.click('#mais summary'); await p.fill('#entrada','200');
  await p.click('#btnSalvar'); await p.waitForTimeout(1500);
  console.log('tela pessoa:',await p.locator('#pNome').innerText(),'|',await p.locator('#pStatus').innerText());
  console.log('entrada:',await p.locator('.entrada').innerText());
  // eu devo
  await p.click('nav.bar .add'); await p.click('label:has(#tipoPagar)'); await p.fill('#nome','Fornecedor X'); await p.fill('#parcelas','2');
  console.log('regra pagar:',await p.inputValue('#regra')); await p.fill('#valor','500'); await p.dispatchEvent('#valor','input');
  await p.click('#btnSalvar'); await p.waitForTimeout(1500);
  await p.click('#voltar'); await p.waitForTimeout(200);
  console.log('aba eu devo selecionada:',await p.getAttribute('#segPag','aria-pressed'),'| linhas:',await p.locator('.row').count(), await p.locator('#stripK').innerText());
  await p.screenshot({path:__dirname+'/t6a.png'});
});
await H(async p=>{
  await p.click('#sync'); await p.setInputFiles('#fileImport',__dirname+'/dados-exemplo.json'); await p.waitForTimeout(2500);
  console.log('linhas depois de importar:',await p.locator('.row').count());
},{empty:true});
})();
