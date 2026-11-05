# Primeiro Ciclo

> Proposta de solução do Squad 05, Turma B. Persona fictícia e escopo inicial para revisão do squad.

> Projeto em Ciência de Dados I · Ibmec BH · 2º semestre de 2026
> Cliente: **Bulbe Energia** · Turma **B** · Squad **05**

Proposta de um acompanhamento simples para o cliente pessoa física da Bulbe, da adesão à compreensão e ao pagamento da primeira fatura.

---

## 1. Problema

O recorte proposto é a falta de informação durante a espera e a dificuldade para encontrar e entender a primeira cobrança. A apresentação da aula 19 relata até 20 dias sem comunicação, cerca de 20% de falha nas mensagens de WhatsApp e pouca transparência na fatura antiga. A escolha ainda deve ser validada pelo squad.

- **Dor escolhida:** incerteza no primeiro ciclo e dificuldade de acesso e compreensão da fatura
- **Evidência:** até 20 dias sem comunicação; cerca de 20% de falha no WhatsApp; baixa transparência da fatura antiga (slides 7 e 18)
- **Indicador que a solução pretende mover:** pagamento da 1ª fatura, sem meta numérica ou impacto medido nesta fase

## 2. Personas consolidadas

As duas personas fictícias orientam a solução para o primeiro ciclo do cliente da Bulbe:

- **Cláudia Martins**, 46 anos, costureira autônoma de Ribeirão das Neves: precisa acompanhar a contratação e encontrar a primeira fatura sem depender dos avisos por WhatsApp.
- **Renata Alves**, 39 anos, assistente administrativa de Contagem: precisa compreender os valores, a relação entre Cemig e Bulbe e a base da economia antes de pagar.

[Conheça as duas personas completas](docs/personas/consolidadas.md).

Os perfis são propostas para revisão do squad e ainda não foram validados com clientes.

- **Mapa de jornada existente:** [docs/jornada.md](docs/jornada.md)
- **Contribuições individuais:** [Pedro Schott — Célia Martins](docs/personas/pedro-schott.md), [Pedro Padilha — Mariana Alves](docs/personas/pedro-padilha.md), [Sophia Miranda — Rafael Moreira](docs/personas/sophia-miranda.md), [Rodrigo Rigotto — Marina Tavares](docs/personas/rodrigo-rigotto.md) e [Vinicius Gorini — Renata Alves](docs/personas/vinicius-gorini.md).

## 3. Solução

A hipótese de solução combina acompanhamento da espera, acesso à fatura e explicação dos valores. As oportunidades estão documentadas em `docs/jornada.md`. Histórias e wireframes seguem em revisão pelo squad.

### O que já está implementado

- **Template HTML comum** do squad: CSS ([`assets/css/style.css`](assets/css/style.css)), JavaScript de cabeçalho, menu, suporte e estados de carregamento ([`assets/js/layout.js`](assets/js/layout.js)), logos originais e o modelo [`pages/modelo.html`](pages/modelo.html). Guia de uso: [docs/template.md](docs/template.md).
- **HU01 — Assistente contextual** (Vinicius Gorini): primeira implementação em [`pages/assistente.html`](pages/assistente.html), com entrada pela home e pelo detalhe em [`pages/fatura.html`](pages/fatura.html). Perguntas/respostas predefinidas em JSON via `fetch`, contexto e retorno à fatura, suporte e encaminhamento para a HU02. Sem IA real ou confirmação de pagamento. [Roteiro e evidências](docs/hu01-implementacao.md).
- **HU02 — Acompanhar a espera até o benefício aparecer** (Pedro Schott): home ([`index.html`](index.html)) com card de acompanhamento, segunda fatura, Pix e detalhes demonstrativos e histórico; página [“A caminho da economia”](pages/acompanhamento.html). Dados fictícios em [`data/hu02-acompanhamento.json`](data/hu02-acompanhamento.json).
- **HU04 — Boas-vindas** (Rodrigo Rigotto): primeira versão em [`pages/boas-vindas.html`](pages/boas-vindas.html), acessível pelo menu “Conheça a Bulbe”. Três slides com conteúdo fictício em JSON via `fetch`, navegação e opção de pular para a demonstração. O bloco em integração no PR #41 acrescenta primeiro acesso local pela home, com fallback seguro se o armazenamento não estiver disponível, além de ajustes de teclado e gesto. Login não foi implementado; o aceite desse requisito continua pendente.
- **HU03 — Acompanhar adesão** (Pedro Padilha): tela integrada em [`pages/adesao.html`](pages/adesao.html), com cinco etapas horizontais, dados fictícios carregados de [`data/hu03-adesao.json`](data/hu03-adesao.json), CSS próprio e componentes do template compartilhado. Os ajustes de rótulos mobile de Rodrigo estão em integração no PR #41, preservando a autoria original da HU03. Os arquivos de implementação ficam na estrutura comum do squad; a versão antiga pode ser consultada pelo histórico do GitHub. [Roteiro de testes](docs/hu03-implementacao.md).

- **HU05 — Conferir economia** (Sophia Miranda): tela própria em [`pages/calculo-economia.html`](pages/calculo-economia.html), formulário validado em JavaScript e regras fictícias em JSON via `fetch`. Exibe os períodos, bases e valores informados; não calcula economia enquanto a metodologia oficial estiver pendente. O bloco de Sophia em integração acrescenta validação de cronologia/sobreposição, carregamento/retentativa, foco e rolagem interna, além de retorno contextual preparado. Bases ou durações diferentes geram avisos na comparação, não bloqueios de entrada.

Cenários de demonstração da HU02, escolhidos pelo endereço: `index.html` (aguardando créditos), `?cenario=previsao-confirmada`, `?cenario=pendencia-cliente`, `?cenario=dados-incompletos` e `?cenario=desconto-lancado`. Pix, detalhes e suporte não fazem pagamentos nem enviam mensagens.


**Finalização em 05/11 (UTC):** os blocos de Sophia e Rodrigo estão reunidos no [PR draft #41](https://github.com/pedroschott/202602-projeto1-b-05/pull/41), ainda sem merge na `main`. A conferência HU05 e o [simulador pré-contratação](pages/simulacao-economia.html) são telas distintas. A rodada final prepara HU01 → HU05 com contexto, correção do breakpoint mobile da HU03 e proteção de carregamento do simulador. Essas correções de integração não são atribuídas aos autores originais das HUs. Confira a [matriz de requisitos, evidências e pendências](docs/verificacao-mvp.md) antes de considerar o MVP pronto para merge.

**Pendente:** login e decisão de escopo da HU04, telas de Consumo e Indicações (a navegação avisa que estão pendentes), revisão do conteúdo da HU01, metodologia de cálculo da HU05, revisão do squad e validação das regras com a Bulbe.

- **Histórias de usuário:** [docs/historias.md](docs/historias.md)
- **Wireframes:** [docs/wireframes/](docs/wireframes/)
- **Base visual compartilhada:** [docs/base-visual/](docs/base-visual/) — três modelos, CSS, logos, componente para Figma Make e regras de padronização do grupo (proposta para revisão).

## 4. Tecnologias

- HTML, CSS e JavaScript puro (vanilla)
- Dados fictícios em JSON, lidos com `fetch` (pasta [`data/`](data/))
- Git e GitHub (Issues, Projects e Pull Requests)

## 5. Como executar

1. Clone o repositório:
   ```bash
   git clone https://github.com/pedroschott/202602-projeto1-b-05.git
   ```
2. Abra a pasta no VS Code.
3. Instale a extensão **Live Server** (o VS Code vai sugerir automaticamente).
4. Clique com o botão direito em `index.html` e escolha **Open with Live Server**.

> Abrir o `index.html` direto no navegador (duplo clique) não funciona: o `fetch` dos arquivos JSON exige um servidor.

### Testes

Use Node.js 22. Na raiz do repositório, valide a sintaxe e execute os testes sem navegador:

```bash
for arquivo in assets/js/*.js scripts/*.mjs tests/*.mjs; do node --check "$arquivo" || exit 1; done
node --test scripts/test-api.mjs scripts/test-hu02.mjs scripts/test-hu01-integracao.mjs tests/*.mjs
```

Para os testes de navegador, instale o Playwright e o Chromium:

```bash
npm install --no-save playwright@1.56.1
npx playwright install chromium
python3 -m http.server 4173 --bind 127.0.0.1
```

Deixe o servidor aberto e, em outro terminal na raiz, execute:

```bash
node scripts/test-hu03.mjs
node scripts/test-hu03-mobile.mjs
node scripts/test-hu04.mjs
node scripts/test-hu04-primeiro-acesso.mjs
BULBE_BROWSER_TEST=1 node --test scripts/test-hu01-integracao.mjs
node scripts/test-hu05-simulacao.mjs
node scripts/test-integracao.mjs
node scripts/test-mvp-smoke.mjs
```

Em Linux sem as dependências do Chromium, use `npx playwright install --with-deps chromium` em ambiente com permissão para instalar os pacotes necessários. As novas evidências de navegador ficam sob `artifacts/`; o roteiro original HU03 também gera capturas em `docs/telas`. A CI coleta `artifacts/` e as capturas HU03 como artefatos, sem commit automático.

**Evidência histórica de 04/11 (não certifica o conjunto atual):** 35/35 testes Node aprovados (17 API/fontes e 18 HU02). A [CI de integração](https://github.com/pedroschott/202602-projeto1-b-05/actions/runs/41915874300) passou para o head `419b735`, incluindo Chromium HU03 e os sete fluxos de integração. Gerou 21 capturas mobile, além das duas capturas HU03. A inspeção visual parcial ainda encontrou rótulos de etapas HU03 quebrados em 320/390 px. O simulador pré-contratação adicionado à main no PR #38 não está coberto por essa suíte. Essa execução antecede os blocos agora em integração. **CI anterior em 05/11:** no head `4b53f86`, a [execução 41948447761](https://github.com/pedroschott/202602-projeto1-b-05/actions/runs/41948447761) aprovou 53 testes Node, 12 casos HU04, 10 de primeiro acesso e 9 de integração, mas o mobile HU03 falhou em 401 px; larguras posteriores não foram executadas. A rodada final precisa de nova CI e inspeção antes do merge.

## 6. Estrutura do repositório

```
├── index.html            # Home: card da HU02 e faturas
├── pages/
│   ├── boas-vindas.html   # HU04: apresentação inicial com JSON
│   ├── acompanhamento.html  # HU02: A caminho da economia
│   ├── adesao.html       # HU03: acompanhamento de adesão
│   ├── assistente.html   # HU01: perguntas e respostas predefinidas
│   ├── fatura.html       # Detalhe com contexto da fatura
│   ├── calculo-economia.html # HU05: conferência, sem fórmula oficial
│   ├── simulacao-economia.html # Simulador pré-contratação separado
│   └── modelo.html       # Modelo para novas telas
├── assets/
│   ├── css/style.css     # Estilos comuns do squad
│   ├── css/hu02.css      # Estilos da HU02
│   ├── js/layout.js      # Menu, suporte, diálogos e estados de carregamento
│   ├── js/api.js         # Leitura dos dados (fetch)
│   ├── js/hu02.js        # Regras da HU02 (etapas, previsão, simulação)
│   ├── js/main.js        # Lógica da home
│   ├── js/acompanhamento.js # Lógica da página de acompanhamento
│   └── img/              # Logos originais
├── data/                 # Dados fictícios em JSON
├── docs/                 # Jornada, histórias, wireframes e sprints
└── .github/              # Modelos de Issue e de Pull Request
```

## 7. Quadro do projeto

- **GitHub Projects:** [202602-projeto1-b-05](https://github.com/users/pedroschott/projects/2)
- **Colunas:** Backlog, A fazer, Em andamento, Em revisão e Concluído
- **Acesso:** quadro privado no momento; acesso do professor ainda pendente

## 8. Equipe

| Integrante | GitHub | Papel principal |
| --- | --- | --- |
| Pedro Marcondes Dombeck Schott | [@pedroschott](https://github.com/pedroschott) | A combinar com o squad |
| Rodrigo Araújo Rigotto |  [@rodrigorigotto](https://github.com/rodrigorigotto)  | A combinar com o squad |
| Sophia Cardoso Miranda | [@sophiacmiranda](https://github.com/sophiacmiranda) | A combinar com o squad |
| Vinicius Gorini | Usuário a confirmar | A combinar com o squad |
| Pedro Padilha | Usuário a confirmar | A combinar com o squad |

## 9. Entregas

| Marco | Aula | Status |
| --- | --- | --- |
| Mapa de jornada | 19 | Proposta, imagem e três Issues publicadas; revisão do squad pendente |
| Histórias de usuário | 20 | A desenvolver na aula correspondente |
| Wireframes | 21–23 | A desenvolver na aula correspondente |
| Sprint Review I | 24 | A desenvolver na aula correspondente |
| Implementação | 25–28 | Cinco HUs com telas; integração MVP e revisão humana pendentes. [Plano da Implementação 2](docs/implementacao-2.md) |
| Sprint Review II | 29 | 06/11/2026: MVP na main e apresentação de 10 minutos; [roteiro proposto](docs/sprints/review-ii-roteiro.md) |
| Versão final | 30 | Congelamento em 12/11/2026; apresentação em 13 ou 18/11, conforme sorteio |

---

> Os registros de clientes e faturas deste repositório são fictícios. Nenhum dado pessoal real de cliente da Bulbe Energia é utilizado; os indicadores agregados citados vêm do material da disciplina.

## Fontes

- [Apresentação da aula 19](https://docs.google.com/presentation/d/1v_punRor5o8ZU-v9BN9I9VhaWDtIEyXWVMFbYb-s_Fg/edit), slides 4–8, 11 e 19
- [Roteiro do repositório](https://docs.google.com/document/d/1K9OFyecp78Xt7IMWENCUfc8RL-i-K73yShUDiCTYdSA/edit)

- [Roteiro oficial da Implementação 2 e Review II](https://docs.google.com/document/d/14SpYXCmTpKkOcLHv6X9748ZEXL4ni0p1azWpK9Lz4sI/edit)
