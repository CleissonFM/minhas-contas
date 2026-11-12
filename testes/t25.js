const H=require('./harness');
H(async p=>{
  await p.waitForTimeout(300);
  const casos=await p.evaluate(()=>{
    const A=window.__testes.analisarEmp, base={nome:'X',valor:10000,taxa:30,tipo:'juros',periodo:'mensal'};
    const r=(nome,e)=>{ const a=A(e); return {nome,estado:a.estado,venc:a.venc,juros:a.jurosPend,atrasados:a.jurosAtrasados,divida:a.principal,quitar:a.saldo,pago:a.pagoTotal}; };
    return [
      r('S1 vence hoje, nada pago',{...base,data:'2026-10-12',pagamentos:[]}),
      r('S2 pagou 3000 hoje (só juros)',{...base,data:'2026-10-12',pagamentos:[{d:'2026-11-12',v:3000}]}),
      r('S3 pagou 4000 hoje',{...base,data:'2026-10-12',pagamentos:[{d:'2026-11-12',v:4000}]}),
      r('S4 pagou 13000 (quitou)',{...base,data:'2026-10-12',pagamentos:[{d:'2026-11-12',v:13000}]}),
      r('S5 2 meses sem pagar',{...base,data:'2026-09-12',pagamentos:[]}),
      r('S6 pagou 3000 e depois 4000',{...base,data:'2026-09-12',pagamentos:[{d:'2026-10-12',v:3000},{d:'2026-11-12',v:4000}]}),
      r('S7 livre 40 mil, pagou 1000 e 5000',{nome:'Y',valor:40000,tipo:'livre',data:'2026-10-01',pagamentos:[{d:'2026-10-10',v:1000},{d:'2026-11-03',v:5000}]}),
      r('S8 recem criado hoje',{...base,data:'2026-11-12',pagamentos:[]}),
      r('S9 pagou 2000 (menos que juros) ontem do venc',{...base,data:'2026-09-12',pagamentos:[{d:'2026-10-12',v:2000}]}),
    ];
  });
  casos.forEach(c=>console.log(JSON.stringify(c)));
},{empty:true});
