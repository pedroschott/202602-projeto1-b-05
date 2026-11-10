# Primeiro Ciclo

> Solução do Squad 05, Turma B: MVP navegável com cinco histórias de usuário integradas, usando personas e dados fictícios.

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

A solução combina boas-vindas, acompanhamento da adesão e da espera, acesso à fatura e explicação dos valores. As oportunidades estão documentadas em `docs/jornada.md`, e as histórias em `docs/historias.md`.

### O que já está implementado

- **Template HTML comum** do squad: CSS ([`assets/css/style.css`](assets/css/style.css)), JavaScript de cabeçalho, menu, suporte e estados de carregamento ([`assets/js/layout.js`](assets/js/layout.js)), logos originais e o modelo [`pages/modelo.html`](pages/modelo.html). Guia de uso: [docs/template.md](docs/template.md).
- **HU01 — Assistente contextual** (Vinicius Gorini): primeira implementação em [`pages/assistente.html`](pages/assistente.html), com entrada pela home e pelo detalhe em [`pages/fatura.html`](pages/fatura.html). Perguntas/respostas predefinidas em JSON via `fetch`, contexto e retorno à fatura, suporte e encaminhamentos para a HU02 e a conferência HU05, com retorno contextual. Sem IA real ou confirmação de pagamento. [Roteiro e evidências](docs/hu01-implementacao.md).
- **HU02 — Acompanhar a espera até o benefício aparecer** (Pedro Schott): home ([`index.html`](index.html)) com card de acompanhamento, segunda fatura, Pix e detalhes demonstrativos e histórico; página [“A caminho da economia”](pages/acompanhamento.html). Dados fictícios em [`data/hu02-acompanhamento.json`](data/hu02-acompanhamento.json).
- **HU04 — Boas-vindas** (Rodrigo Rigotto): primeira versão em [`pages/boas-vindas.html`](pages/boas-vindas.html), acessível pelo menu “Conheça a Bulbe”. Três slides com conteúdo fictício em JSON via `fetch`, navegação e opção de pular para a demonstração. A integração do PR #41 acrescenta primeiro acesso local pela home, com fallback seguro se o armazenamento não estiver disponível, além de ajustes de teclado e gesto. Na finalização, Começar/Pular passam pela [tela de acesso demonstrativo](pages/login.html), sem autenticação real. Ela não coleta credenciais nem autentica usuários; a integração assistida não altera a autoria original da HU04.
- **HU03 — Acompanhar adesão** (Pedro Padilha): tela integrada em [`pages/adesao.html`](pages/adesao.html), com cinco etapas verticais no mobile até 430 px e horizontais a partir de 431 px, dados fictícios carregados de [`data/hu03-adesao.json`](data/hu03-adesao.json), CSS próprio e componentes do template compartilhado. Os ajustes de rótulos mobile de Rodrigo entraram com o PR #41; a correção final do breakpoint foi testada, preservando a autoria original da HU03. Os arquivos de implementação ficam na estrutura comum do squad; a versão antiga pode ser consultada pelo histórico do GitHub. [Roteiro de testes](docs/hu03-implementacao.md).

- **HU05 — Conferir economia** (Sophia Miranda): tela própria em [`pages/calculo-economia.html`](pages/calculo-economia.html), além do [simulador acadêmico pré-contratação](pages/simulacao-economia.html), formulário validado em JavaScript e regras fictícias em JSON via `fetch`. Exibe os períodos, bases e valores informados; não calcula economia enquanto a metodologia oficial estiver pendente. O bloco recebido de Sophia acrescenta validação de cronologia/sobreposição, carregamento/retentativa, foco e rolagem interna, além de retorno contextual preparado. Bases ou durações diferentes geram avisos na comparação, não bloqueios de entrada.

Cenários de demonstração da HU02, escolhidos pelo endereço: `index.html` (aguardando créditos), `?cenario=previsao-confirmada`, `?cenario=pendencia-cliente`, `?cenario=dados-incompletos` e `?cenario=desconto-lancado`. Pix, detalhes e suporte não fazem pagamentos nem enviam mensagens.


**Integração:** as cinco HUs estão na `main` desde 05/11, pelos PRs [#41](https://github.com/pedroschott/202602-projeto1-b-05/pull/41) (integração do MVP) e [#42](https://github.com/pedroschott/202602-projeto1-b-05/pull/42) (ilustrações do carrossel da HU04). Correções de integração preservam a autoria original das HUs. A conferência HU05 e o simulador acadêmico são telas distintas. [Requisitos, evidências e pendências](docs/verificacao-mvp.md).

**Atualização de 10/11:** os PRs [#43](https://github.com/pedroschott/202602-projeto1-b-05/pull/43) (pendências HU03 e orientação Cemig), [#44](https://github.com/pedroschott/202602-projeto1-b-05/pull/44) (padronização visual), [#46](https://github.com/pedroschott/202602-projeto1-b-05/pull/46) (teclado no carrossel) e [#47](https://github.com/pedroschott/202602-projeto1-b-05/pull/47) (fonte local) também estão integrados. A [CI da main `df276b1`](https://github.com/pedroschott/202602-projeto1-b-05/actions/runs/42608108121), executada em 09/11, passou sintaxe, três testes Node e quatro grupos de smoke Chromium. Esse resultado não substitui a conferência manual nem certifica alterações posteriores.

**Pendente:** autenticação real (fora do frontend acadêmico), revisão do conteúdo da HU01, metodologia de cálculo da HU05, revisão do squad e validação das regras com a Bulbe.

- **Histórias de usuário:** [docs/historias.md](docs/historias.md)
- **Wireframes:** [docs/wireframes/](docs/wireframes/)
- **Base visual compartilhada:** [docs/base-visual/](docs/base-visual/) — três modelos, CSS, logos, componente para Figma Make e regras de padronização do grupo (proposta para revisão).

## 4. Tecnologias

- HTML, CSS e JavaScript puro (vanilla)
- Sem biblioteca de interface no aplicativo. React em `docs/base-visual/` é referência do Figma Make, não runtime. Playwright/Node são ferramentas de teste, não dependências para abrir o app.
- Fonte Poppins local, sem chamada ao Google Fonts no aplicativo. [Conformidade, autoria e pendências](docs/conformidade-entrega.md)
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

**Alternativa sem extensão:** com Python 3 instalado, abra o terminal na pasta clonada, execute `python3 -m http.server 4173 --bind 127.0.0.1` (no Windows, `py -m http.server 4173 --bind 127.0.0.1`) e acesse http://127.0.0.1:4173. Mantenha o terminal aberto; `Ctrl+C` encerra o servidor. O aplicativo não exige instalação de pacotes npm: as dependências abaixo são apenas para os testes.

Na primeira visita, a home abre as boas-vindas. Use **Pular apresentação** ou **Começar** para abrir o acesso demonstrativo e então **Entrar na demonstração**. Nas visitas seguintes do mesmo navegador, a home abre diretamente. O menu permite revisitar todas as cinco HUs. Atalhos de Consumo e Indicações, sem funcionalidade no MVP, foram retirados da navegação. O simulador foi preservado como exercício extra identificado, separado da conferência HU05.

### Testes

Use Node.js 22. Na raiz, verifique a sintaxe e os cinco testes essenciais sem navegador:

```bash
for arquivo in assets/js/*.js scripts/*.mjs tests/*.mjs; do node --check "$arquivo" || exit 1; done
node --test tests/mvp.test.mjs
```

Para o smoke dos fluxos principais, instale Playwright/Chromium e mantenha o servidor aberto:

```bash
npm install --no-save playwright@1.56.1
npx playwright install chromium
python3 -m http.server 4173 --bind 127.0.0.1
```

Em outro terminal na raiz: `node scripts/test-mvp.mjs`. Em Linux sem bibliotecas do navegador, use `npx playwright install --with-deps chromium` onde houver permissão para instalar dependências.

A CI executa sintaxe, cinco testes Node e quatro grupos de smoke Chromium. Em falha, guarda `artifacts/falha.png`, sem commits automáticos. A suíte foi reduzida aos fluxos essenciais; não cobre todas as variantes, falhas e dispositivos. Consulte [verificação do MVP](docs/verificacao-mvp.md) para resultados vinculados ao commit e limitações.

## 6. Estrutura do repositório

```
├── index.html            # Home: card da HU02 e faturas
├── pages/
│   ├── login.html        # Acesso demonstrativo, sem autenticação
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
│   ├── css/hu01.css … hu05.css # Estilos de cada história
│   ├── js/layout.js      # Menu, suporte, diálogos e estados de carregamento
│   ├── js/api.js         # Leitura dos dados (fetch)
│   ├── js/main.js        # Lógica da home
│   ├── js/hu01.js        # HU01: assistente e detalhe da fatura
│   ├── js/hu02.js        # HU02: etapas, previsão e simulação
│   ├── js/acompanhamento.js # HU02: página "A caminho da economia"
│   ├── js/hu03.js        # HU03: etapas da adesão
│   ├── js/boas-vindas.js # HU04: carrossel de boas-vindas
│   ├── js/hu04-primeiro-acesso.js # HU04: memória local do primeiro acesso
│   ├── js/login.js       # Acesso demonstrativo
│   ├── js/hu05.js        # HU05: conferência de economia
│   ├── js/hu05-simulacao.js # Simulador pré-contratação
│   └── img/              # Logos e ilustrações do carrossel
├── data/                 # Dados fictícios em JSON
├── docs/                 # Jornada, histórias, wireframes e sprints
├── tests/                # Testes de regras em Node
├── scripts/              # Smoke dos fluxos no Chromium (Playwright)
└── .github/              # Modelos de Issue e de PR, e CI
```

## 7. Quadro do projeto

- **GitHub Projects:** [202602-projeto1-b-05](https://github.com/users/pedroschott/projects/2)
- **Colunas:** Backlog, A fazer, Em andamento, Em revisão e Concluído
- **Acesso:** quadro privado no momento; acesso do professor ainda pendente

## 8. Equipe

| Integrante | GitHub | Papel principal |
| --- | --- | --- |
| Vinicius Gorini | [@viniciusgorini](https://github.com/viniciusgorini) | HU01: assistente da fatura |
| Pedro Marcondes Dombeck Schott | [@pedroschott](https://github.com/pedroschott) | HU02: espera pelo benefício; integração do MVP |
| Pedro Padilha | [@PPadilha19](https://github.com/PPadilha19) | HU03: status da adesão |
| Rodrigo Araújo Rigotto | [@rodrigorigotto](https://github.com/rodrigorigotto) | HU04: boas-vindas |
| Sophia Cardoso Miranda | [@sophiacmiranda](https://github.com/sophiacmiranda) | HU05: conferência de economia e simulador |

## 9. Entregas

| Marco | Aula | Status |
| --- | --- | --- |
| Mapa de jornada | 19 | Proposta, imagem e três Issues publicadas; revisão do squad pendente |
| Histórias de usuário | 20 | Cinco histórias documentadas; critérios e limites em [docs/historias.md](docs/historias.md), aceite pendente |
| Wireframes | 21–23 | Arquivos disponíveis em [docs/wireframes](docs/wireframes/); revisão/aceite não presumidos |
| Sprint Review I | 24 | Realização e feedback não comprovados por este registro |
| Implementação | 25–28 | Cinco HUs e ajustes dos PRs #41–#44, #46 e #47 integrados na `main`; CI de `df276b1` aprovada em 09/11. [Plano da Implementação 2](docs/implementacao-2.md) |
| Sprint Review II | 29 | 06/11/2026: MVP na main e apresentação de 10 minutos; [roteiro proposto](docs/sprints/review-ii-roteiro.md) |
| Versão final | 30 | Congelamento em 12/11/2026; apresentação em 13 ou 18/11, conforme sorteio |

---

> Os registros de clientes e faturas deste repositório são fictícios. Nenhum dado pessoal real de cliente da Bulbe Energia é utilizado; os indicadores agregados citados vêm do material da disciplina.

## Fontes

- [Apresentação da aula 19](https://docs.google.com/presentation/d/1v_punRor5o8ZU-v9BN9I9VhaWDtIEyXWVMFbYb-s_Fg/edit), slides 4–8, 11 e 19
- [Roteiro do repositório](https://docs.google.com/document/d/1K9OFyecp78Xt7IMWENCUfc8RL-i-K73yShUDiCTYdSA/edit)
- [Roteiro oficial da Implementação 2 e Review II](https://docs.google.com/document/d/14SpYXCmTpKkOcLHv6X9748ZEXL4ni0p1azWpK9Lz4sI/edit)
