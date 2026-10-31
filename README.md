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
- **HU02 — Acompanhar a espera até o benefício aparecer** (Pedro Schott): home ([`index.html`](index.html)) com card de acompanhamento, segunda fatura, Pix e detalhes demonstrativos e histórico; página [“A caminho da economia”](pages/acompanhamento.html). Dados fictícios em [`data/hu02-acompanhamento.json`](data/hu02-acompanhamento.json).
- **HU04 — Boas-vindas** (Rodrigo Rigotto): primeira versão em [`pages/boas-vindas.html`](pages/boas-vindas.html), acessível pelo menu “Conheça a Bulbe”. Três slides com conteúdo fictício em JSON via `fetch`, navegação e opção de pular para a demonstração. Login e exibição automática somente no primeiro acesso ficam pendentes.
- **HU03** (Pedro Padilha): tela original em [`docs/wireframes/Telas Prontas/hu03.html`](docs/wireframes/Telas%20Prontas/hu03.html), acessível pelo menu; ainda não integrada ao template comum.

Cenários de demonstração da HU02, escolhidos pelo endereço: `index.html` (aguardando créditos), `?cenario=previsao-confirmada`, `?cenario=pendencia-cliente`, `?cenario=dados-incompletos` e `?cenario=desconto-lancado`. Pix, detalhes e suporte não fazem pagamentos nem enviam mensagens.

**Pendente:** telas de Consumo e Indicações (a navegação avisa que estão pendentes), HU01 e HU05, integração da HU03 ao template, revisão do squad e validação das regras com a Bulbe.

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

## 6. Estrutura do repositório

```
├── index.html            # Home: card da HU02 e faturas
├── pages/
│   ├── boas-vindas.html   # HU04: apresentação inicial com JSON
│   ├── acompanhamento.html  # HU02: A caminho da economia
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
| Implementação | 25–28 | Em andamento: template comum e HU02 implementados, aguardando revisão; demais histórias pendentes |
| Sprint Review II | 29 | A desenvolver na aula correspondente |
| Versão final | 30 | A desenvolver na aula correspondente |

---

> Os registros de clientes e faturas deste repositório são fictícios. Nenhum dado pessoal real de cliente da Bulbe Energia é utilizado; os indicadores agregados citados vêm do material da disciplina.

## Fontes

- [Apresentação da aula 19](https://docs.google.com/presentation/d/1v_punRor5o8ZU-v9BN9I9VhaWDtIEyXWVMFbYb-s_Fg/edit), slides 4–8, 11 e 19
- [Roteiro do repositório](https://docs.google.com/document/d/1K9OFyecp78Xt7IMWENCUfc8RL-i-K73yShUDiCTYdSA/edit)
