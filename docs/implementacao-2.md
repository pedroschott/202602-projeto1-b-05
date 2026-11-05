# Implementação 2 — proposta de divisão e revisão

**Estado em 05/11/2026 (UTC):** finalização do [PR draft #41](https://github.com/pedroschott/202602-projeto1-b-05/pull/41) para revisão antes do merge. Os blocos de Sophia e Rodrigo foram reunidos; a rodada final trata HU01 → HU05 com contexto, breakpoint mobile da HU03 e proteção de carregamento do simulador. Nova CI e revisão ainda pendentes. A autoria histórica permanece; ajustes assistidos de integração não constituem implementação individual dos colegas. [Matriz de requisitos e evidências](verificacao-mvp.md).

## Blocos recebidos e integração atual

- **Sophia / HU05:** branch `feat/hu05-implementacao`, head `336790015d17e7d28ab75550f482162e975d0680`, com a `main` `2c4a456` na ancestralidade. Restaura a conferência separada do simulador e acrescenta cronologia/sobreposição, proteção durante carga e retentativa, foco, rolagem interna e retorno contextual. Bases ou durações diferentes passam a avisos informativos na comparação, não erros que impedem a entrada. Não há fórmula oficial nem cálculo de economia comprovada.
- **Rodrigo / HU04 e mobile HU03:** branch `hu04-integracao-home`, head `952f4420493a03f2eb3ba74046286fa845bf0883`. Primeiro acesso local pela home limpa; se `localStorage` estiver indisponível, segue sem forçar a apresentação. Ajustes de teclado/gesto e rótulos mobile da HU03. A autoria original de Padilha permanece. Login não foi implementado nem aceito como requisito cumprido.
- **Integração geral:** restaurada a exportação de consulta da conferência em `api.js` e seu link no menu; preservado o simulador pré-contratação separado, herdado da `main`. A chamada de função inexistente do simulador, registrada no diagnóstico histórico, foi corrigida em `a4be6fa`; isso não constitui teste do conjunto atual.
- **HU01, autoria original de Vinicius:** encaminhamento HU01 → HU05 e retorno contextual fazem parte da rodada final de integração assistida, com teste dedicado. Validar o novo head antes de declarar o fluxo aprovado.
- **Validação:** incorporar `tests/hu05.test.mjs` aos testes Node; ampliar Chromium com `test-hu03-mobile.mjs`, `test-hu04.mjs` e `test-hu04-primeiro-acesso.mjs`, além de atualizar `test-integracao.mjs` e incluir `test-hu01-integracao.mjs` e `test-hu05-simulacao.mjs`. Publicar os resultados somente após execução no novo head.

**Limite herdado do simulador:** seu botão de envio nasce habilitado e o handler é registrado depois da consulta JSON. Uma submissão durante uma conexão lenta pode usar a navegação padrão do formulário. Diagnóstico estático anterior; sua correção está incluída na rodada final, ainda dependente de teste no novo head; não confundir com os estados de carga já corrigidos da conferência. O teste integrado cobre o fluxo carregado e capturas, não esse envio antecipado.

## Entrega e datas

Segundo o [roteiro oficial](https://docs.google.com/document/d/14SpYXCmTpKkOcLHv6X9748ZEXL4ni0p1azWpK9Lz4sI/edit):

- **06/11:** MVP na `main` e Sprint Review II de 10 minutos.
- **12/11:** congelamento da versão final.
- **13 ou 18/11:** apresentação final conforme sorteio, 15 minutos mais 5 de perguntas; todos falam.
- Uma HU e tela própria por integrante, leitura de JSON via `fetch`, formulário com JavaScript, funcionamento mobile, README e revisão por outro colega.

As cinco histórias já têm telas no repositório. Isso não significa que todos os critérios estejam cumpridos: a HU04 exige login e a HU05 depende de metodologia oficial para calcular economia. Não reescrever os critérios para contornar essas lacunas.

## Mapa de navegação e lacunas atuais

| Origem | Destino existente | Revisão proposta |
| --- | --- | --- |
| Home (`index.html`) | Assistente, detalhe da fatura e acompanhamento do benefício | Testar cenário e fatura atual/histórica sem perder o contexto |
| Detalhe (`pages/fatura.html`) | Assistente HU01 e retorno à origem | Preservar id e cenário ao entrar e sair |
| Assistente (`pages/assistente.html`) | Fatura, acompanhamento HU02 e suporte demonstrativo | Encaminhamento à HU05 e retorno contextual em finalização; validar novo head |
| Menu comum | Adesão HU03, boas-vindas HU04 e conferência HU05 | Revisar links e navegação em telas pequenas |
| Boas-vindas (`pages/boas-vindas.html`) | Home de demonstração ao começar/pular | Validar primeiro acesso local recebido; decidir escopo de login |
| Conferência (`pages/calculo-economia.html`) | Formulário → comparação → explicação do bloqueio | Validar correções recebidas de cronologia, carga, foco e rolagem |

O controle local de primeiro acesso recebido é apenas memória neste navegador, não autenticação nem reconhecimento entre dispositivos. Não resolve os critérios de login da HU04.

A HU05 já existe e permite conferir os dados informados. Não implementar uma subtração ou percentual como economia oficial: períodos de mesma duração e bases com o mesmo rótulo não comprovam comparabilidade segundo a Bulbe.

## Plano original de divisão — 04/11/2026

A orientação de Pedro é concentrar os novos blocos em **Rodrigo e Vinicius**, deixar uma parte menor para **Sophia** e reservar a **Pedro** a integração final, testes, CI e documentação. **Padilha fica fora de novas tarefas e revisões neste plano**; sua autoria histórica da HU03 permanece preservada. A tabela preserva o planejamento original, não registra aceite ou revisão humana. Os blocos recebidos em 05/11 estão descritos acima.

| Integrante / HU original | Bloco proposto nesta rodada | Commits sugeridos | Revisão cruzada sugerida |
| --- | --- | --- | --- |
| Vinicius Gorini / HU01 | HU01 → HU05 com retorno, cenário e id; revisão editorial da FAQ; links e contexto da navegação compartilhada, sem alterar regras das outras HUs | `feat(hu01): conecta conferência contextual`; `fix(navegacao): preserva origem e cenário`; `test(hu01): verifica FAQ e retorno` | Revisar o bloco de Rodrigo |
| Rodrigo Rigotto / HU04 | Decidir login com o grupo e implementar apenas o fluxo de entrada aprovado; testar começar/pular/falha; fazer os ajustes mobile necessários da HU03, preservando autoria original de Padilha | `fix(hu04): implementa fluxo aprovado de entrada`; `fix(hu03): ajusta etapas no mobile`; `test(entrada): verifica fluxo e responsividade` | Revisar o bloco de Vinicius |
| Sophia Miranda / HU05 | Correções delimitadas de cronologia/sobreposição, carregamento/retentativa e foco/rolagem do formulário; manter bloqueio de cálculo e documentar testes | `fix(hu05): valida períodos e estados`; `test(hu05): cobre formulário e acessibilidade` | Revisar a integração de Pedro |
| Pedro Schott / HU02 | Receber os blocos, resolver conflitos e amarrar o conjunto; regressão HU02, testes integrados, CI somente leitura, documentação e preparação do PR único. Não assumir a implementação dos colegas | `test(mvp): cobre navegação e cenários`; `ci(mvp): valida PR sem escrita`; `docs(mvp): registra evidências e pendências` | Revisar o bloco de Sophia |

A revisão técnica final assistida confere o conjunto, relata falhas e limites e ajuda Pedro a fechar a integração. Não substitui a revisão humana de outro colega exigida pelo roteiro, nem autoriza merge. Não há percentuais de carga comprovados; a prioridade de esforço acima é uma distribuição proposta, não uma medição de horas ou produtividade.

Os títulos de commits descrevem entregas esperadas, não commits já existentes. Não fabricar commits nem distribuir autoria para equilibrar números. O volume deve ser avaliado junto com escopo, alterações, revisões e evidências: merges e tarefas pequenas podem distorcer uma contagem simples. O gráfico de contribuições precisa usar dados reais do histórico e informar se conta merges e qual período considera.

## Fluxo em um único PR

1. Usar o PR draft #41, originalmente aberto com testes, CI e documentação, para reunir os blocos recebidos. Confirmar a divisão e as decisões de HU04/HU05 com o grupo antes de iniciar o trabalho de cada colega.
2. Reunir commits reais dos responsáveis em uma branch de integração; combinar sequência para arquivos compartilhados, especialmente `layout.js` e CSS comum.
3. Descrever no PR os blocos por HU, limitações, autoria efetiva e evidências de execução. Manter critérios de aceite pendentes quando não verificados.
4. Preparar CI em PR, `main` e execução manual, com `contents: read`: sintaxe de assets/scripts, testes Node API/HU02/HU05 e Chromium HU03, mobile HU03, HU04, primeiro acesso, HU01 contextual, simulador e integração. Evidências como artefatos, sem commit/push automático de capturas. Confirmar o resultado real após publicar o draft.
5. Solicitar revisão humana de outro colega. QA automatizado ou revisão assistida não substituem a revisão humana exigida.
6. Manter o PR em draft enquanto os blocos e a revisão final estiverem pendentes. O merge só ocorre depois de revisão humana e decisão sobre a versão final; a chegada dos blocos de Sophia e Rodrigo não equivale ao aceite de todos os critérios; a nova integração HU01 → HU05 ainda precisa passar pelos testes do head final.

## Plano de QA

**Os casos integrados abaixo são um plano de execução, não um checklist concluído.** As evidências já conhecidas ficam na última seção. Registrar depois data, commit, ambiente, resultado, evidência e responsável real. Não apresentar os testes históricos de uma HU como validação da integração nova.

- **Navegação:** home → detalhe → assistente → origem para faturas atual e histórica; exercitar todos os cenários da HU02, id inexistente e dados incompletos. Quando implementada, incluir ida e volta HU01 ↔ HU05.
- **HU02:** distinguir projeção de benefício lançado; conferir pendência do cliente, ausência de previsão e ausência de dados. Pix e suporte não devem simular pagamento ou envio real.
- **HU03:** etapas e próxima ação legíveis em 320, 360 e 430 px; testar carga, erro, retentativa e ausência de informação. Não inventar prazos.
- **HU04:** avançar/voltar, gesto, indicador, pular em cada slide, começar, imagem indisponível e erro de JSON. Testar primeiro acesso/retorno do bloco recebido, inclusive com armazenamento indisponível; registrar explicitamente a pendência de login.
- **HU05:** campos vazios, zero/negativos, datas invertidas dentro do período, períodos sobrepostos ou fora da ordem, bases diferentes e durações diferentes (avisos informativos na comparação, sem bloqueio de entrada). Conferir entrada válida, revisão dos dados e reinício. Não exibir economia monetária ou percentual sem metodologia implementada e confirmada.
- **Estados de consulta:** carga lenta visível, falha real do JSON e retentativa. Em testes locais, restaurar arquivos/dados antes de finalizar e não publicar uma simulação de falha.
- **Acessibilidade e layout:** teclado, foco visível e útil ao mudar etapa, rótulos, alertas, rolagem interna e ausência de sobreposição com cabeçalho/rodapé. Conferir mobile e desktop.
- **Técnico:** scripts existentes HU02/HU03, sintaxe dos scripts, links locais e diff; novos testes integrados/CI conforme implementação. Registrar separadamente falha de ambiente e defeito do produto.

## Decisões antes do aceite

- HU04: o grupo manterá o requisito de login para esta entrega? Se houver mudança de escopo, registrar decisão explícita sem declarar que o fluxo local cumpre o texto atual.
- HU05: obter metodologia oficial ou demonstrar apenas a conferência e o bloqueio, explicando o limite. Não declarar a história integralmente concluída.
- Conteúdo e etapas operacionais: revisão com o grupo/Bulbe continua pendente; nenhum feedback ou validação foi presumido.
- Fechar a divisão e a revisão cruzada antes de concluir o PR único. Cada integrante deve conseguir explicar sua tela, decisões e evidências na Review II.

## Evidências históricas registradas em 04/11/2026

Os resultados e diagnósticos desta seção pertencem aos commits citados. Não descrevem a validação dos blocos recebidos em 05/11 nem devem ser interpretados como defeitos ainda reproduzidos após as correções.

- **Node:** 35/35 testes locais aprovados: 18 regressões HU02 e 17 verificações API/fontes JSON, referências HTML e configuração sem cálculo oficial. Sintaxe dos scripts do app e testes verificada.
- **Chromium local:** bloqueado com `socket: Operation not permitted`; testes de navegador e QA visual não concluídos localmente. Não é aprovação nem reprovação das telas.
- **CI:** execução concluída com sucesso; run, commit, cobertura e limites detalhados abaixo.
- **Diagnóstico HU05 com DOM simulado:** aceita períodos idênticos e ordem invertida entre faturas; oculta o aviso com três flags `true`, embora não haja fórmula implementada. Não inclui validação HTML nativa, foco, rolagem ou layout. Correções propostas, não executadas nesta preparação.
- **Escopo:** arquivos da aplicação (assets, páginas, dados e index) preservados em relação à base `69f01fe75c6febc650755470a6e786c6147a8384`. O PR draft de preparação contém somente testes, CI e documentação; não representa entrega das tarefas dos colegas.

Comandos reproduzíveis de Node, Playwright 1.56.1 e servidor HTTP na porta 4173: [README — Testes](../README.md#testes).

### Resultado de CI e inspeção parcial

A execução [41915874300](https://github.com/pedroschott/202602-projeto1-b-05/actions/runs/41915874300) concluiu com sucesso para o head `419b735859649f30ba395848a7bbef31661b6f9e`, no merge provisório `cbb4cd7cc345bae1a896e074fd338ec4a1ee26b7` com main `be1d7f8`. O PR não foi integrado à main.

- 35 testes Node, roteiro Chromium HU03 e sete grupos de integração aprovados; nenhum erro JavaScript não tratado nos fluxos percorridos.
- Geradas 21 capturas de sete telas em 320/360/390 px e duas capturas HU03. Os artefatos dessa execução expiram em 11/11/2026; podem ser gerados novamente pelo workflow.
- Inspecionadas nove capturas: HU03/HU05 em 320 e 390 px, home, assistente, acompanhamento, boas-vindas e fatura em 360 px. A HU03 ainda quebra os nomes das etapas no meio das palavras, embora não tenha rolagem horizontal. Manter o ajuste mobile no bloco proposto para Rodrigo.
- Essa inspeção é parcial: não aprova todos os estados, telas inteiras, gestos ou desktop. Também não valida critérios pendentes de primeiro acesso, cronologia HU05 e encaminhamento contextual HU01 → HU05.
- O simulador pré-contratação entrou separadamente na main pelo [PR #38](https://github.com/pedroschott/202602-projeto1-b-05/pull/38) durante a preparação. Ele não está coberto pela suíte acima. No commit `be1d7f8`, `hu05-simulacao.js` importa `buscarSimulacaoEconomiaHU05`, mas chama `buscarEconomiaHU05`, ausente no módulo: a inicialização cai no tratamento de erro. Correção e decisão de escopo ficam pendentes, sem alteração desse arquivo nesta integração.

## CI anterior à rodada final — 05/11/2026

A [execução 41948447761](https://github.com/pedroschott/202602-projeto1-b-05/actions/runs/41948447761), relativa ao head `4b53f86`, aprovou 53 testes Node, 12 casos HU04, 10 casos de primeiro acesso e 9 grupos de integração. O teste mobile HU03 falhou em 401 px; as larguras seguintes não foram executadas. Portanto, essa execução **não aprova o MVP completo**.

A rodada final corrige o breakpoint e acrescenta os fluxos HU01/contexto e carga do simulador. O resultado dessa rodada deve ser registrado com novo head/run após execução. Login continua ausente e cálculo oficial da HU05 permanece bloqueado; nenhum teste substitui a decisão de escopo ou o aceite humano. A entrega de 06/11 exige o MVP na `main`, não somente um PR draft com CI verde.
