const H=require('./harness');
const val=async p=>[await p.inputValue('#cTotalIn'),await p.inputValue('#cParcIn'),(await p.locator('#cMult').innerText()).replace(/\n/g,' / ')];
(async()=>{
await H(async p=>{
  await p.waitForTimeout(300);
  await p.click('nav.bar .add');
  await p.fill('#valor','1000'); await p.fill('#parcelas','4'); await p.dispatchEvent('#parcelas','input'); await p.dispatchEvent('#valor','input');
  console.log('A) regra sugerida 4x:', await p.inputValue('#acValor'), await val(p));
  await p.fill('#parcelas','10'); await p.dispatchEvent('#parcelas','input');
  await p.fill('#acValor','1,5'); await p.dispatchEvent('#acValor','input');
  console.log('B) x1,5 em 10x:', await val(p));
  await p.click('label:has(input[name=acTipo][value="%"])'); await p.fill('#acValor','50'); await p.dispatchEvent('#acValor','input');
  console.log('C) 50% em 10x:', await val(p));
  await p.fill('#parcelas','12'); await p.dispatchEvent('#parcelas','input');
  console.log('C2) mudou p/ 12x, mantém 50%:', await p.inputValue('#acValor'), await val(p));
  await p.fill('#parcelas','10'); await p.dispatchEvent('#parcelas','input');
  await p.fill('#nome','Venda Teste'); await p.click('#btnSalvar'); await p.waitForTimeout(1500);
  const doc=await p.evaluate(()=>{ for(const [k,v] of window.__store) if(v.nome==='Venda Teste') return v; });
  console.log('D) salvo:',JSON.stringify({valorBem:doc.valorBem,valorTotal:doc.valorTotal,valorParcela:doc.valorParcela,parcelas:doc.parcelas,mult:doc.multiplicador,acrescimo:doc.acrescimo}));
  await p.locator('.item .btn',{hasText:'Editar'}).click(); await p.waitForTimeout(200);
  console.log('E) editar recarrega:', await p.inputValue('#valor'), await p.inputValue('#acValor'), await val(p));
  // só parcela, sem item
  await p.click('nav.bar .add'); await p.fill('#parcelas','10'); await p.dispatchEvent('#parcelas','input');
  await p.fill('#cParcIn','150'); await p.dispatchEvent('#cParcIn','input');
  console.log('F) só parcela 150 em 10x:', await val(p));
  await p.fill('#valor','1000'); await p.dispatchEvent('#valor','input');
  console.log('G) depois informa item 1000:', await val(p));
  await p.screenshot({path:__dirname+'/t21.png',fullPage:false});
});
await H(async p=>{
  await p.waitForTimeout(300); await p.click('nav.bar .add');
  console.log('H) conta nova, acréscimo padrão:', await p.evaluate(()=>document.querySelector('input[name=acTipo]:checked').value));
  await p.fill('#valor','1000'); await p.dispatchEvent('#valor','input'); console.log('   total:', await val(p));
},{empty:true});
})();
