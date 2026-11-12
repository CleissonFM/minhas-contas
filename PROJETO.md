# Caderneta de Contas — anotações do projeto

App pessoal (PWA) para controlar quem me deve e o que eu devo.
**Site:** https://cleissonfm.github.io/minhas-contas (GitHub Pages, branch `main`, pasta raiz).

## Arquivos
- `index.html` — o app inteiro (HTML, CSS e JavaScript numa página só).
- `firebase-config.js` — identificação do projeto Firebase (`minhas-contas-477f7`, não é senha) e o WhatsApp de contato para pedir acesso online (`CONTATO_WHATSAPP`).
- `sw.js` — service worker: guarda o app no aparelho para abrir sem internet. **Ao publicar uma mudança, aumentar o número em `CACHE`** (ex.: `caderneta-v16` → `v17`).
- `manifest.webmanifest`, ícones — instalação na Tela de Início.
- `firestore.rules` — regras de segurança do Firestore (cada usuário só lê/grava `users/{uid}/...`).
- `testes/` — testes automáticos com Playwright e um Firebase de mentira (`mockfb.js`). Rodar: `node testes/t21.js` etc. Usam `testes/dados-exemplo.json` (dados fictícios).

## Modos de uso
1. **Online (nuvem):** login por e-mail/senha ou Google; dados no Firestore em `users/{uid}/contas`, `users/{uid}/pessoas` (cobrança) e `users/{uid}/config/prefs` (cor, acréscimo sugerido). O acesso online é **liberado pelo dono** no Firebase Console (Authentication → Usuários → Adicionar usuário), com o cadastro livre desligado (Authentication → Configurações → Ações do usuário).
2. **Só no celular (offline):** sem conta; dados no `localStorage` do aparelho (`cc_local_db_v1`). Ao entrar depois no modo online, o app oferece **enviar os dados para a nuvem**.
- No primeiro acesso a pessoa escolhe o modo. Quem está offline vê o convite **"Caderneta Online (Premium)"**, que leva ao WhatsApp do dono.

## Regras de negócio
- **Acréscimo é escolhido em cada negociação**: vezes (×1,5), porcentagem (50%) ou sem acréscimo; ou digita direto o valor da parcela/total. Ex.: item R$ 1.000 × 1,5 em 10x = R$ 1.500, 10x de R$ 150.
- Cada conta pode ter um **acréscimo sugerido** (Conta → "Acréscimo sugerido"), que só pré-preenche o formulário. A conta do dono tem a sugestão: até 3x = ×1,7; mais de 3x = ×2.
- Parcelas mensais (mesmo dia; último dia do mês se não existir) ou semanais (+7 dias). Cada parcela pode ter valor/data próprios, pagamento parcial e data de pagamento (`historico`).
- Cobrança por pessoa: recebido, sem resposta, ou promessa de pagamento com data; histórico e último contato pelo WhatsApp.

## Outras funções
WhatsApp com mensagem pronta (lista e ficha), recibo, resumo do mês, lembretes no calendário (.ics), planilha (.csv), cópia de segurança/importação, senha de 4 números por conta, 5 paletas de cores (modo claro e escuro), aviso de novidades a cada versão (`VERSAO` no código).

## Histórico
- Começou como artifact no Claude (dados antigos lá estão congelados, com aviso apontando para este site).
- Dados reais do dono foram importados para o Firestore pelo próprio app; **dados de clientes não ficam neste repositório (público)**.
