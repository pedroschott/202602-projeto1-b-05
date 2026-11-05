# MVP — requisitos, evidências e condições para merge

**05/11/2026 (UTC), rodada final do PR #41.** Documento de verificação, não aceite final. Fonte: [roteiro oficial da Implementação 2](https://docs.google.com/document/d/14SpYXCmTpKkOcLHv6X9748ZEXL4ni0p1azWpK9Lz4sI/edit). Histórico técnico: [Implementação 2](implementacao-2.md).

## Matriz de entrega

| Requisito | Evidência disponível | Pendente ou limite |
| --- | --- | --- |
| Dor apoiada em evidências | [Jornada](jornada.md) e fontes no README: espera sem comunicação, falhas de WhatsApp e dificuldade de compreender a cobrança | Dados agregados da disciplina; personas fictícias. Não houve medição de impacto do MVP |
| Pelo menos uma HU e tela por integrante, ligada à jornada | [Histórias](historias.md), telas e autoria abaixo | Rastreabilidade não prova aceite. Preservar commits reais, sem atribuir integração assistida aos colegas |
| Telas navegáveis | Home, detalhe, assistente, acompanhamento, adesão, boas-vindas, conferência e simulador | HU01 → HU05/contexto e retornos passaram na CI final; revisão humana pendente |
| JSON via fetch | `data/`, `assets/js/api.js` e testes API | Exportações, carga e retentativa cobertas pelas suítes finais; sem integração com dados reais |
| Formulário validado em JavaScript | Conferência HU05: entradas, cronologia, sobreposição, revisão; simulador separado | Método oficial da conferência não confirmado. Carga lenta e retentativa do simulador testadas após correção |
| Mobile | Suítes Chromium e capturas; correções HU03/HU04 recebidas | Falha anterior em 401 px corrigida; todas as larguras da suíte passaram. Inspeção visual parcial |
| HTML/CSS/JS vanilla e organização | Estrutura comum `pages/`, `assets/`, `data/`; comandos no README | Playwright é ferramenta de teste, não framework da aplicação |
| README atualizado e dados fictícios | README descreve execução, testes, limites e fontes | Não inserir dados reais de clientes nos formulários, JSON ou capturas |
| Processo ágil e contribuições | Commits e PR #41; plano de integração documentado | Revisão humana por outro colega e registro real das contribuições ainda precisam ser conferidos; CI não substitui revisão |
| MVP na main em 06/11 | Branch de integração com CI final aprovada | PR draft não é entrega na main. Revisão humana e merge autorizado ainda necessários |

## Autoria e rastreabilidade das telas

| Autoria original | HU e tela | Ligação à jornada |
| --- | --- | --- |
| Vinicius Gorini | HU01, assistente e detalhe contextual | Compreensão da cobrança e próximo passo |
| Pedro Schott | HU02, home e acompanhamento do benefício | Espera pelo benefício e segunda fatura |
| Pedro Padilha | HU03, adesão | Acompanhamento da contratação |
| Rodrigo Rigotto | HU04, boas-vindas | Primeiro acesso e compreensão inicial do serviço |
| Sophia Miranda | HU05, conferência | Transparência de bases, períodos e valores |

A tabela registra a autoria das HUs, não atribui todos os commits posteriores aos mesmos autores. Rodrigo contribuiu com ajustes mobile da HU03; os ajustes assistidos da rodada final devem permanecer identificados como integração. Não criar autoria ou evidência individual retroativa.

## Desvios que permanecem explícitos

- **HU04:** exibe primeiro acesso local e leva à home de demonstração. Não existe login; os critérios originais que exigem chegar ao login não estão cumpridos. Não adicionar autenticação fictícia nem marcar aceite por equivalência.
- **HU05:** conferência não calcula economia oficial; bases ou durações diferentes são avisos informativos. O simulador pré-contratação é uma tela separada e não valida metodologia de economia realizada.
- **Produto:** sem pagamentos reais, atendimento enviado, backend, IA generativa ou dados de produção. Consumo e Indicações permanecem indisponíveis.
- **Validação:** não há feedback de clientes, aprovação da Bulbe ou redução de inadimplência demonstrada. A Review II deve registrar feedback real somente depois da sessão.

## Evidência técnica e checklist de liberação

CI [41948447761](https://github.com/pedroschott/202602-projeto1-b-05/actions/runs/41948447761), head `4b53f86`: 53 testes Node, 12 casos HU04, 10 de primeiro acesso e 9 grupos de integração passaram. Mobile HU03 falhou em 401 px; larguras posteriores não foram executadas. Não usar esse resultado como aprovação integral.

- [x] Registrar head e run da CI final com HU01/contexto, simulador e correção mobile; ver abaixo.
- [x] Confirmar suítes finais executadas; o teste de navegador pulado na etapa Node foi executado no estágio Chromium.
- [x] Inspecionar amostra de 14 capturas e registrar limites; foco, rolagem e retornos cobertos pelas suítes abaixo. Não representa inspeção visual exaustiva.
- [ ] Confirmar README, critérios preservados e apresentação coerentes com o código final.
- [ ] Registrar revisão humana de outro colega, tratar observações e manter autoria efetiva.
- [ ] Obter autorização aplicável e integrar à main antes da entrega de 06/11.

## Apresentações e avaliação

- **Review II em 06/11:** 10 minutos com demonstração ao vivo, entregue versus excluído e registro posterior do feedback. [Roteiro](sprints/review-ii-roteiro.md).
- **Congelamento em 12/11. Apresentação final em 13 ou 18/11:** 15 minutos mais 5 de perguntas; todos falam. Apresentar problema, evidências, ideação, rastreabilidade, solução, demonstração e limites, sem confundir hipótese com impacto comprovado.
- **Pesos da rubrica:** dor 1,5; rastreabilidade 1,5; MVP 3; código 1,5; processo ágil 1; apresentação 1,5. São critérios de avaliação, não notas conquistadas.

## Verificação final — 05/11/2026 (UTC)

A [CI 41953862665](https://github.com/pedroschott/202602-projeto1-b-05/actions/runs/41953862665) foi aprovada para o head `20f378adcbc096026477974d099a227ab44752bf`, no merge provisório `3798e8aef25b0e2093ccd1c1deb01fa2b95c88cf`. O merge provisório de CI não altera a `main`; o PR #41 continua draft.

- **Node:** 79 aprovados, zero falhas e um teste de navegador intencionalmente pulado nessa etapa. O estágio Chromium HU01 executou 11 testes: dez testes unitários repetidos e um teste de navegador. Não somar os dez repetidos como cobertura adicional.
- **Chromium:** HU03 funcional; HU03 mobile em 320, 360, 375, 390, 400, 401 e 430 px com etapas verticais, e 431/1280 px com etapas horizontais; HU04 (12 grupos); primeiro acesso (10); simulador (11); integração (9); smoke de oito telas e conferência. Todas essas suítes passaram.
- **Correções verificadas:** FAQ ↔ HU05 com contexto seguro, carregamento/retentativa e validações do simulador, breakpoint de 401 px da HU03. Smoke sem erro JavaScript, de console ou de recurso local nos fluxos percorridos.
- **Inspeção visual parcial:** examinadas 14 capturas: cinco HUs em 390 × 1000; simulador inicial e detalhamento em 390 px, resultado em 320 px; recortes das etapas HU03 em 401/431 px; home e detalhe de fatura em 390 px; HU01 e HU04 em 320 px. Nenhum defeito impeditivo observado nos trechos examinados. Áreas longas exigem rolagem interna e não aparecem integralmente nas capturas; nem todas as telas e estados foram inspecionados.
- **Evidências:** capturas e resultados nos artefatos da execução, incluindo `artifacts/mvp-final` e demais pastas das suítes. Os artefatos expiram em **12/11/2026**; podem ser regenerados pelo workflow.

Limites: Chromium desktop com mobile emulado, não Safari/iOS real; inspeção visual parcial, não aceite da Bulbe. Login HU04 continua ausente e sujeito à decisão humana; metodologia oficial HU05 segue bloqueada. Revisão por colega e merge autorizado ainda faltam. O MVP só atende à entrega na `main` após essa integração efetiva.
