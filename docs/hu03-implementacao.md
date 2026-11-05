# HU03 — Acompanhar adesão | Implementação

Responsável: Pedro Padilha. Implementação acadêmica com dados fictícios, alinhada ao template compartilhado do Squad 05.

## Arquivos
- `pages/adesao.html`: estrutura com cabeçalho, logo e navegação comuns.
- `assets/css/hu03.css`: apenas estilos da jornada horizontal e cartões.
- `assets/js/hu03.js`: seleção e renderização das cinco etapas.
- `data/hu03-adesao.json`: cinco cenários de progresso e um cenário fictício adicional de pendência.
- `assets/js/api.js`: leitura via fetch.
- `assets/js/layout.js`: acesso pelo menu da home.
- `scripts/test-mvp.mjs`: smoke Chromium compartilhado; comandos no [README](../README.md#testes).

A implementação antiga foi retirada do diretório `docs/wireframes/Telas Prontas/` para evitar duplicação. Ela continua disponível no histórico de commits do GitHub; a versão mantida é `pages/adesao.html` e seus arquivos em `assets/` e `data/`.

## Capturas da tela integrada (390 × 844 px)
Capturas históricas da implementação HU03. A CI atual guarda apenas captura de falha como artefato, sem atualizar estas imagens automaticamente.
As imagens foram produzidas pelo Chromium no GitHub Actions, com o projeto servido por HTTP.

![HU03 — tela inicial](telas/hu03-adesao.png)

![HU03 — parte inferior com rolagem](telas/hu03-adesao-inferior.png)

## Como executar
Abra `index.html` pela extensão Live Server do VS Code e escolha **Acompanhar adesão** no menu. Não use `file://`: a leitura do JSON exige um servidor HTTP.

### Cenários
- `pages/adesao.html` — padrão, etapa 3 (adesão).
- `pages/adesao.html?cenario=cadastro` — etapa 1.
- `pages/adesao.html?cenario=validacao` — etapa 2.
- `pages/adesao.html?cenario=ativacao` — etapa 4.
- `pages/adesao.html?cenario=primeira-fatura` — etapa 5, com link para faturas.
- `pages/adesao.html?cenario=inexistente` — cenário ausente/estado vazio.
- `pages/adesao.html?cenario=pendencia-cliente` — validação com confirmação de contato pendente; orientação de ação demonstrativa.

## Orientações e pendências (complemento para Issue #1)
- Quando o JSON traz o objeto opcional `pendencia` (`titulo`, `detalhe`, `acao`), a HU03 informa a pendência e prioriza a ação no cartão de próximo passo. Sem esses dados, exibe "Nenhuma pendência informada" **apenas para o cenário demonstrativo**, sem pressupor o estado de um cliente real.
- A etapa atual permanece determinada por `etapaAtual`; a consulta de outra etapa não modifica status, pendência, orientação nem última atualização.
- Durante os cenários de espera, aparece orientação cautelosa de continuar pagando a Cemig **pelo período indicado pela Bulbe**, sem inventar datas, vencimentos ou previsão de conexão. É uma transposição informativa do material da disciplina, não uma regra de cobrança validada em produção.
- O cenário de primeira fatura não mostra o lembrete de espera da Cemig. O caminho de faturas segue demonstrativo.
- **Aceite pendente:** a equipe e a Bulbe precisam confirmar a sequência oficial, as regras de cobrança e pendências, além de revisar a legibilidade e os testes de compreensão; testes automáticos não substituem essas confirmações.


## Verificações históricas da HU03

O checklist abaixo registra a implementação original, não a cobertura da suíte reduzida atual.
- [x] Carregamento HTTP e leitura do JSON com fetch no Chromium do GitHub Actions.
- [x] Cinco etapas, cinco cenários, link de faturas e estado vazio.
- [x] Tratamento de erro HTTP 503 e recuperação pelo botão "Tentar novamente".
- [x] Dimensões de 320, 360 e 390 px sem rolagem horizontal.
- [x] Suporte humano demonstrativo e seleção das etapas.
- [x] Etapa atual permanece fixa, mesmo ao consultar outras etapas; próximo passo e atualização sempre referem-se ao estado real fictício.
- [x] Textos de status coerentes nos cinco cenários; instruções diretas para o cliente.
- [x] Legendas de etapas com pelo menos 12 px em 320, 360 e 390 px.
- [x] Capturas em `docs/telas/` com cabeçalho e navegação visual do squad.
- [ ] Conferência final do fluxo pela equipe e aprovação visual do grupo.

**Automação:** [GitHub Actions — MVP](https://github.com/pedroschott/202602-projeto1-b-05/actions/workflows/hu03-screenshots.yml).

## Limitações
As etapas e atualizações são ilustrativas; a Bulbe ainda precisa confirmar o fluxo. A seleção de uma etapa apenas mostra informações gerais; ela não altera o status atual, o próximo passo nem o andamento real. Não há login, pagamento ou comunicação com cliente real. O teste automatizado usa um servidor HTTP estático equivalente ao Live Server, e não a extensão específica do VS Code.
