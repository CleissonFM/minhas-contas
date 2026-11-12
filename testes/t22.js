const H=require('./harness');
H(async p=>{
  await p.waitForTimeout(300); await p.click('nav.bar .add');
  await p.fill('#nome','Fulano'); await p.fill('#item','iPhone 15');
  await p.fill('#parcelas','10'); await p.dispatchEvent('#parcelas','input');
  await p.fill('#valor','1000'); await p.dispatchEvent('#valor','input');
  await p.fill('#acValor','1,5'); await p.dispatchEvent('#acValor','input');
  await p.locator('#valorWrap').scrollIntoViewIfNeeded(); await p.evaluate(()=>window.scrollBy(0,-120));
  await p.locator('#valorWrap').screenshot({path:__dirname+'/t22a.png'}); await p.locator('.calc').screenshot({path:__dirname+'/t22.png'});
});
