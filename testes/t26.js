const H=require('./harness');
H(async p=>{
  const D=__dirname; await p.waitForTimeout(300);
  await p.click('#segEmp'); await p.waitForTimeout(100);
  await p.click('nav.bar .add'); await p.waitForTimeout(150);
  await p.fill('#enNome','Carlos Teste'); await p.fill('#enTel','98 99999-1111'); await p.fill('#enValor','10000');
  await p.fill('#enData','2026-10-12'); await p.fill('#enTaxa','30'); await p.dispatchEvent('#enTaxa','input');
  console.log('preview form:',(await p.locator('#enPrev').innerText()).replace(/\n/g,' / '));
  await p.locator('#formEmp').screenshot({path:D+'/t26a.png'});
  await p.click('#enSalvar'); await p.waitForTimeout(1500);
  console.log('status:',await p.locator('#eStatus').innerText());
  await p.fill('#epValor','4000'); await p.dispatchEvent('#epValor','input');
  console.log('previa pagamento:',(await p.locator('#epPrev').innerText()).replace(/\n/g,' / '));
  await p.screenshot({path:D+'/t26b.png'});
  await p.click('#epSalvar'); await p.waitForTimeout(500);
  console.log('status depois:',await p.locator('#eStatus').innerText());
  console.log('historico:',(await p.locator('#eHist .pg').first().innerText()).replace(/\n/g,' / '));
  await p.locator('#eResumo').screenshot({path:D+'/t26c.png'});
  // livre
  await p.click('nav.bar .add'); await p.fill('#enNome','Dona Maria'); await p.fill('#enValor','40000'); await p.click('label:has(input[name=enTipo][value=livre])');
  await p.click('#enSalvar'); await p.waitForTimeout(1500);
  for(const v of ['1000','5000']){ await p.fill('#epValor',v); await p.dispatchEvent('#epValor','input'); await p.click('#epSalvar'); await p.waitForTimeout(400); }
  console.log('livre status:',await p.locator('#eStatus').innerText());
  await p.click('#empVoltar'); await p.waitForTimeout(200);
  console.log('lista:',(await p.locator('#grupos').innerText()).replace(/\n+/g,' | '));
  console.log('hero:',(await p.locator('.hero').innerText()).replace(/\n+/g,' | '));
  await p.screenshot({path:D+'/t26d.png'});
},{empty:true});
