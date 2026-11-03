# HU03 — Acompanhar adesão | Implementação

Responsável: Pedro Padilha. Implementação acadêmica com dados fictícios, alinhada à base compartilhada do Squad 05.

## Arquivos

- `pages/adesao.html`: estrutura da tela e componentes compartilhados.
- `assets/css/hu03.css`: somente regras específicas das cinco etapas e cartões.
- `assets/js/hu03.js`: seleção de etapas e renderização segura.
- `data/hu03-adesao.json`: exemplos fictícios com cinco etapas e cinco cenários.
- `assets/js/api.js`: leitura centralizada via fetch.
- `assets/js/layout.js`: item do menu aponta para `pages/adesao.html`.

A primeira versão em `docs/wireframes/Telas Prontas/` foi preservada como referência histórica.

## Como abrir

Inicie o projeto com Live Server pela raiz, pois `fetch` não funciona ao abrir HTML via `file://`. No menu da home, escolha **Acompanhar adesão**.

### Cenários para avaliar

- `pages/adesao.html` — adesão em andamento (padrão, etapa 3).
- `pages/adesao.html?cenario=cadastro` — etapa 1.
- `pages/adesao.html?cenario=validacao` — etapa 2.
- `pages/adesao.html?cenario=ativacao` — etapa 4.
- `pages/adesao.html?cenario=primeira-fatura` — etapa 5, com atalho para faturas.
- `pages/adesao.html?cenario=inexistente` — estado vazio.

## Verificações antes do merge

- [ ] Abrir a home e navegar pelo menu até a HU03; voltar ao início.
- [ ] Conferir logotipo, cabeçalho azul, suporte e tipografia comuns às outras telas.
- [ ] Selecionar as cinco etapas: o cartão informativo muda, mas o avanço real não é alterado.
- [ ] Conferir os cinco cenários do JSON e o atalho de faturas na etapa 5.
- [ ] Simular Offline no DevTools: erro de carregamento e botão "Tentar novamente".
- [ ] Testar no navegador em 320, 360 e 390 px, sem rolagem horizontal; testar também com teclado.
- [ ] Registrar captura de tela da implementação real em 390 × 844 px em `docs/telas/hu03-adesao.png` (pendente de captura no navegador).

## Limitações

O progresso de adesão, os status e as datas são demonstrações ilustrativas, não dados oficiais de clientes. A seleção das etapas consulta informações, mas não modifica o andamento real. A captura de tela da aplicação executada deve ser adicionada antes de considerar a documentação visual completa.
