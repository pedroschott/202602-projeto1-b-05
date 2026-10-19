# Primeiro Ciclo

> Proposta de solução do Squad 05, Turma B. Personas fictícias consolidadas e escopo inicial para revisão do squad.

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

As cinco propostas individuais foram comparadas pelas necessidades recorrentes e consolidadas em dois perfis complementares para revisão do squad:

| Persona | Necessidade central | Contribuições que fundamentam o perfil |
| --- | --- | --- |
| **P1 — Cláudia Martins**, 46 anos, costureira de Ribeirão das Neves | Acompanhar a contratação e encontrar a primeira fatura sem depender de avisos por WhatsApp. | Célia e Rafael, com acompanhamento trazido por Mariana. |
| **P2 — Renata Alves**, 39 anos, assistente administrativa de Contagem | Compreender valores, relação entre Cemig e Bulbe e base da economia antes de pagar. | Renata, Marina e Mariana. |

O uso do celular, a busca por economia e a necessidade de informação clara aparecem nas propostas. Os perfis sintetizam **acompanhar e acessar** e **compreender e conferir**; uma mesma persona pode gerar várias histórias.

- **Descrição completa e matriz de consolidação:** [docs/personas/consolidadas.md](docs/personas/consolidadas.md)
- **Evidências e mapa inicial do projeto:** [docs/jornada.md](docs/jornada.md)

Cada um dos cinco integrantes deverá desenvolver sua própria jornada e a tela correspondente. A consolidação em duas personas orienta esses trabalhos; não define uma jornada por persona.
- **Contribuições individuais preservadas:** [Pedro Schott — Célia](docs/personas/pedro-schott.md), [Pedro Padilha — Mariana](docs/personas/pedro-padilha.md), [Sophia Miranda — Rafael](docs/personas/sophia-miranda.md), [Rodrigo Rigotto — Marina](docs/personas/rodrigo-rigotto.md) e [Vinicius Gorini — Renata](docs/personas/vinicius-gorini.md).

As personas são fictícias e ainda não foram validadas com clientes. A consolidação documental foi preparada por **Vinicius Gorini (@viniciusgorini)** a partir das cinco contribuições, para revisão coletiva.

## 3. Solução

A hipótese de solução combina acompanhamento da espera, acesso à fatura e explicação dos valores. As oportunidades estão documentadas em `docs/jornada.md`. Histórias, telas e wireframes ainda serão definidos a partir da revisão do squad nas aulas seguintes. O código desta preparação continua sendo o exemplo original fornecido pelo professor.

- **Histórias de usuário:** [docs/historias.md](docs/historias.md)
- **Wireframes:** [docs/wireframes/](docs/wireframes/)

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
├── index.html            # Página inicial
├── pages/                # Demais telas da solução
├── assets/
│   ├── css/style.css     # Estilos
│   ├── js/main.js        # Lógica da página inicial
│   ├── js/api.js         # Leitura dos dados (fetch)
│   └── img/              # Imagens e ícones
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
| Vinicius Gorini | [@viniciusgorini](https://github.com/viniciusgorini) | A combinar com o squad |
| Pedro Padilha | Usuário a confirmar | A combinar com o squad |

## 9. Entregas

| Marco | Aula | Status |
| --- | --- | --- |
| Mapa de jornada | 19 | Proposta, imagem e três Issues publicadas; revisão do squad pendente |
| Histórias de usuário | 20 | A desenvolver na aula correspondente |
| Wireframes | 21–23 | A desenvolver na aula correspondente |
| Sprint Review I | 24 | A desenvolver na aula correspondente |
| Implementação | 25–28 | A desenvolver na aula correspondente |
| Sprint Review II | 29 | A desenvolver na aula correspondente |
| Versão final | 30 | A desenvolver na aula correspondente |

---

> Os registros de clientes e faturas deste repositório são fictícios. Nenhum dado pessoal real de cliente da Bulbe Energia é utilizado; os indicadores agregados citados vêm do material da disciplina.

## Fontes

- [Apresentação da aula 19](https://docs.google.com/presentation/d/1v_punRor5o8ZU-v9BN9I9VhaWDtIEyXWVMFbYb-s_Fg/edit), slides 4–8, 11 e 19
- [Roteiro do repositório](https://docs.google.com/document/d/1K9OFyecp78Xt7IMWENCUfc8RL-i-K73yShUDiCTYdSA/edit)
