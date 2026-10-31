# Template HTML do squad

Guia curto para criar uma tela nova usando a base comum, sem framework. Proposta para revisão do squad.

## Começar uma tela

1. Copie [`pages/modelo.html`](../pages/modelo.html) para `pages/<sua-tela>.html`.
2. Troque o `<title>` e escreva o conteúdo da história **somente dentro de `<main>`**.
3. Abra com o Live Server (o `fetch` não funciona com duplo clique no arquivo).

## O que é comum (não altere por conta própria)

| Parte | Onde está | Como usar |
| --- | --- | --- |
| Cores, fonte Poppins, cabeçalho, navegação, botões, cartões, diálogo, estados | `assets/css/style.css` | Já vem no modelo. Mudanças entram aqui primeiro, revisadas pelo grupo. |
| Logo original | `assets/img/logo-clara.png` (fundo azul) e `logo-colorida.png` (fundo branco) | Sempre em `<img class="bulbe-logo">`; não digitar a marca como texto. |
| Menu, suporte humano, abas pendentes | `assets/js/layout.js` → `iniciarLayout()` | Botões com `data-acao="menu"`, `data-acao="suporte"` ou `data-pendente="Nome da tela"`. |
| Leitura de JSON | `assets/js/api.js` | Crie uma função `buscar...()` para o seu arquivo em `data/`. |
| Carregando, vazio, falha e "Tentar novamente" | `carregarComEstados(alvo, { carregar, mostrar, textoVazio })` em `layout.js` | Ver exemplo no fim de `pages/modelo.html`. |
| Moeda e datas | `formatarMoeda`, `formatarData`, `formatarReferencia` em `layout.js` | Evitam diferenças de formato entre telas. |

O `<body>` precisa de `data-raiz` com o caminho até a raiz (`"../"` em `pages/`), para o menu montar os links.

## Cabeçalho e navegação

- **Cabeçalho:** menu à esquerda, logo no centro, suporte humano à direita. Em telas de detalhe, troque o menu por um link de voltar (ver `pages/acompanhamento.html`). Suporte humano não é o chatbot da HU01.
- **Navegação inferior:** Faturas, Consumo e Indicações. Marque a tela atual com `aria-current="page"`. Enquanto uma tela não existir, mantenha `data-pendente`: o botão abre um aviso honesto em vez de ficar sem ação. Quando a tela existir, troque o botão por um `<a href>`.

## Dados

- Cada história usa **o seu próprio arquivo** em `data/` (ex.: `data/hu02-acompanhamento.json`), para não quebrar as telas dos colegas. Não edite o JSON de outra história sem combinar.
- Somente dados fictícios. Campos ausentes devem aparecer como indisponíveis, sem inventar valores.
- Antes de colocar dado em `innerHTML`, use `escaparHTML()`.

## Estilos e scripts da história

- CSS próprio: `assets/css/<sua-historia>.css`, carregado depois do `style.css`.
- JS próprio: `assets/js/<sua-historia>.js` com `type="module"`, ou o `<script type="module">` do modelo.
- Exemplo completo: HU02 em `index.html`, `pages/acompanhamento.html`, `assets/css/hu02.css`, `assets/js/hu02.js`, `assets/js/main.js` e `assets/js/acompanhamento.js`.

## Conferir antes do PR

- 360 px de largura sem rolagem horizontal (DevTools → modo celular).
- Teclado: todos os botões alcançáveis e com foco visível.
- Estados de carregando, vazio e falha funcionando (no DevTools → Network → Offline, recarregue a página).
