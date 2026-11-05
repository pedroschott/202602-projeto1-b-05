# MVP — requisitos, evidências e liberação

**05/11/2026 · PR #41.** Verificação técnica, não aceite final. Fonte: [roteiro oficial da Implementação 2](https://docs.google.com/document/d/14SpYXCmTpKkOcLHv6X9748ZEXL4ni0p1azWpK9Lz4sI/edit). [Integração e divisão](implementacao-2.md).

## Matriz de entrega

| Requisito | Evidência | Limite / pendência |
| --- | --- | --- |
| Dor apoiada em evidências | [Jornada](jornada.md) e fontes no README: espera, falhas de WhatsApp e compreensão da cobrança | Dados agregados; personas fictícias; impacto do MVP não medido |
| HU e tela por integrante | [Histórias](historias.md) e autoria abaixo | Rastreabilidade não prova aceite |
| Telas navegáveis | Home, detalhe, cinco HUs e simulador | Revisão humana pendente |
| JSON via fetch | `data/` e `assets/js/api.js` | Sem dados reais ou backend |
| Formulário validado em JS | Conferência HU05 e simulador separado | Conferência sem metodologia oficial; simulador acadêmico |
| Mobile | Layout responsivo e smoke Chromium | Emulação não certifica Safari/iOS ou todos os estados |
| HTML/CSS/JS vanilla | `pages/`, `assets/`, `data/` | Playwright é ferramenta de teste, não framework do app |
| README e dados fictícios | Instruções e limitações no README | Não inserir dados reais de clientes |
| Processo e contribuições | Commits e PR #41 | Revisão de colega e registro de contribuições efetivas |
| MVP na main em 06/11 | Branch de integração | Draft não é entrega; revisão e merge autorizado pendentes |

## Autoria das telas

| Autoria original | HU / tela | Jornada |
| --- | --- | --- |
| Vinicius Gorini | HU01, assistente e detalhe contextual | Compreensão da cobrança |
| Pedro Schott | HU02, home e acompanhamento | Espera pelo benefício |
| Pedro Padilha | HU03, adesão | Contratação |
| Rodrigo Rigotto | HU04, boas-vindas | Primeiro acesso |
| Sophia Miranda | HU05, conferência | Bases, períodos e valores |

Rodrigo também ajustou o mobile HU03. Correções posteriores assistidas são integração, não contribuições individuais retroativas. Os commits originais permanecem preservados.

## Limitações essenciais

- **HU04:** Pedro autorizou em 05/11 a tela de acesso demonstrativa. Primeiro acesso → carrossel → acesso demonstrativo → home; Pular/falha também levam ao acesso. Sem autenticação real, cadastro ou coleta de credenciais. Os critérios originais ficam preservados, com aceite humano pendente.
- **HU05:** conferência não calcula economia oficial. Bases/durações diferentes geram avisos. O simulador pré-contratação separado aplica até 15% como hipótese acadêmica, sem oferta, garantia ou validação de economia realizada.
- **Produto:** sem pagamentos, envio de atendimento, backend, IA generativa ou dados de produção. Consumo e Indicações indisponíveis.
- **Aceite:** sem feedback de clientes, aprovação da Bulbe ou redução de inadimplência comprovada. CI e revisão assistida não substituem revisão humana.

## Evidências e cobertura atual

A [CI 41953862665](https://github.com/pedroschott/202602-projeto1-b-05/actions/runs/41953862665), head `20f378a`, aprovou a suíte ampla anterior: Node e Chromium, incluindo contexto HU01 ↔ HU05, mobile HU03 e carga/retentativa do simulador. Foram inspecionadas parcialmente 14 capturas, sem defeito impeditivo nos trechos vistos. Os artefatos expiram em 12/11. Esse resultado pertence àquele commit, não certifica alterações posteriores.

A revisão de 05/11 reduz a automação para **três testes Node e quatro grupos de smoke Chromium**. A aplicação permanece preservada; variantes extensas de falha, parâmetros e dispositivos deixam de ter cobertura automatizada dedicada. Comandos no [README](../README.md#testes); revisão manual sugerida no [plano de QA](implementacao-2.md#qa-essencial-e-revisão-manual).

A execução da suíte reduzida deve ser conferida nos checks do [PR #41](https://github.com/pedroschott/202602-projeto1-b-05/pull/41) para o commit apresentado. Em falha, a CI guarda `artifacts/falha.png`, sem commits automáticos nem coleção de imagens de sucesso. Não reutilizar contagens da suíte anterior como resultado da suíte atual.

## Checklist de liberação

- [ ] Conferir CI do head final e registrar resultado real; analisar falhas antes do merge.
- [ ] Confirmar README, critérios e apresentação coerentes com o código demonstrado.
- [ ] Registrar revisão humana de outro colega e tratar observações.
- [x] Registrar autorização de Pedro para acesso demonstrativo HU04, sem autenticação; manter explícito o bloqueio de cálculo HU05.
- [ ] Integrar à main com autorização antes da entrega de 06/11.
- [ ] Registrar feedback da Review II somente após a sessão.

## Apresentações e avaliação

- **Review II, 06/11:** 10 minutos, demonstração ao vivo e entregue versus excluído. [Roteiro](sprints/review-ii-roteiro.md).
- **Congelamento, 12/11; final, 13 ou 18/11:** 15 minutos + 5 de perguntas; todos falam. Apresentar problema, evidências, ideação, rastreabilidade, solução e limites.
- **Rubrica:** dor 1,5; rastreabilidade 1,5; MVP 3; código 1,5; processo ágil 1; apresentação 1,5. São pesos, não notas conquistadas.
