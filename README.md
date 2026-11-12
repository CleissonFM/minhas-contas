# Minhas Contas

App pessoal para controlar quem me deve e o que eu devo.

**Site:** https://cleissonfm.github.io/minhas-contas

## O que o app faz
- Lista de pessoas separada em **Atrasados**, **Vencem hoje**, **Em dia** e **Quitados**, com busca por nome, item ou telefone.
- Ficha de cada pessoa com as compras, parcelas em formato de calendário e botão **Recebi** (com **Desfazer**).
- **Pagamento parcial**, **histórico de pagamentos** e **recibo pelo WhatsApp**.
- Botão **WhatsApp** na lista e na ficha, com mensagem de cobrança pronta.
- Cálculo automático: até 3x = valor × 1,7; mais de 3x = valor × 2 (sempre editável).
- Tela **Meses**: quanto recebo em cada mês, quem paga em cada mês, quanto já recebi, e resumo para enviar.
- **Minha conta**: cópia de segurança, importar backup, planilha (Excel), lembretes no calendário e senha de 4 números.
- Funciona sem internet e sincroniza depois.
- **Várias pessoas podem usar o mesmo link**: cada uma entra com a própria conta e só vê os próprios dados. Regra de acréscimo, cores e senha são de cada conta.

## Como está montado
- Página única (`index.html`) publicada pelo GitHub Pages.
- Dados no Firebase (Firestore), separados por usuário em `users/{uid}/contas`. Regras em `firestore.rules`.
- `firebase-config.js` identifica o projeto Firebase (não é senha).
- `sw.js` guarda o app no aparelho para abrir sem internet.
