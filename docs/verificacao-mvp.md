# MVP — requisitos, evidências e liberação

**Atualizado em 10/11/2026 · main `df276b1`.** Verificação técnica, não aceite final. Fonte: [roteiro oficial da Implementação 2](https://docs.google.com/document/d/14SpYXCmTpKkOcLHv6X9748ZEXL4ni0p1azWpK9Lz4sI/edit). [Integração e divisão](implementacao-2.md).

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
| Processo e contribuições | Commits e PR #41, aprovado por Rodrigo | Registrar contribuições efetivas; aprovação técnica não equivale a aceite da Bulbe |
| MVP na main em 06/11 | PR #41 integrado em 05/11; ajustes posteriores integrados até 09/11 | Integração confirmada; não comprova apresentação ou aceite final |

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

- **HU04:** A tela de acesso é demonstrativa. Primeiro acesso → carrossel → acesso demonstrativo → home; Pular/falha também levam ao acesso. Sem autenticação real, cadastro ou coleta de credenciais. Os critérios originais ficam preservados, com aceite humano pendente.
- **HU05:** conferência não calcula economia oficial. Bases/durações diferentes geram avisos. O simulador pré-contratação separado aplica até 15% como hipótese acadêmica, sem oferta, garantia ou validação de economia realizada.
- **Produto:** sem pagamentos, envio de atendimento, backend, IA generativa ou dados de produção. Consumo e Indicações fora da navegação; simulador preservado como exercício extra, não parte do recorte principal.
- **Aceite:** sem feedback de clientes, aprovação da Bulbe ou redução de inadimplência comprovada. CI e revisão assistida não substituem revisão humana.

## Evidências e cobertura atual

A [CI 41953862665](https://github.com/pedroschott/202602-projeto1-b-05/actions/runs/41953862665), head `20f378a`, aprovou a suíte ampla anterior: Node e Chromium, incluindo contexto HU01 ↔ HU05, mobile HU03 e carga/retentativa do simulador. Foram inspecionadas parcialmente 14 capturas, sem defeito impeditivo nos trechos vistos. Os artefatos expiram em 12/11. Esse resultado pertence àquele commit, não certifica alterações posteriores.

A revisão de 05/11 reduz a automação para **três testes Node e quatro grupos de smoke Chromium**. A aplicação permanece preservada; variantes extensas de falha, parâmetros e dispositivos deixam de ter cobertura automatizada dedicada. Comandos no [README](../README.md#testes); revisão manual sugerida no [plano de QA](implementacao-2.md#qa-essencial-e-revisão-manual).

A [CI 42608108121](https://github.com/pedroschott/202602-projeto1-b-05/actions/runs/42608108121), executada em 09/11 na main `df276b1bdd62cce364cad2258372d97d2713fa2a`, concluiu com sucesso a verificação de sintaxe, os três testes Node e os quatro grupos de smoke Chromium. O smoke inclui primeiro acesso, navegação e suporte, layouts mobile/desktop, pendência e primeira fatura da HU03, retorno contextual fatura → assistente → conferência → mesma fatura e simulação acadêmica. O resultado foi conferido no GitHub em 10/11; não houve nova execução local nesta atualização documental.

O [PR #41](https://github.com/pedroschott/202602-projeto1-b-05/pull/41) recebeu aprovação de Rodrigo e foi integrado em 05/11. Os PRs #42, #43, #44, #46 e #47 também estão na main. Esses registros não comprovam revisão humana de todos os critérios, teste com clientes ou feedback da apresentação.

Em falha, a CI guarda `artifacts/falha.png`, sem commits automáticos nem coleção de imagens de sucesso. Não reutilizar contagens da suíte anterior como resultado da suíte atual. A CI aprovada não cobre todas as variantes de falha, inspeção visual ou Safari/iOS real. Alterações posteriores precisam de nova conferência do commit demonstrado.

## Checklist de liberação

- [x] Conferir a CI da main `df276b1`: aprovada em 09/11, conforme registro acima.
- [ ] Conferir novamente a CI e o fluxo manual no commit escolhido para o congelamento, após eventuais correções.
- [ ] Confirmar README, critérios e apresentação coerentes com o código demonstrado.
- [x] Registrar a aprovação de Rodrigo no PR #41.
- [ ] Confirmar a revisão humana dos critérios ainda pendentes e tratar observações reais.
- [x] Documentar acesso demonstrativo HU04, sem autenticação; manter explícito o bloqueio de cálculo HU05.
- [x] Confirmar integração do PR #41 à main em 05/11.
- [ ] Registrar feedback da Review II somente após a sessão.

## Apresentações e avaliação

- **Review II, 06/11:** 10 minutos, demonstração ao vivo e entregue versus excluído. [Roteiro](sprints/review-ii-roteiro.md).
- **Congelamento, 12/11; final, 13 ou 18/11:** 15 minutos + 5 de perguntas; todos falam. Apresentar problema, evidências, ideação, rastreabilidade, solução e limites.
- **Rubrica:** dor 1,5; rastreabilidade 1,5; MVP 3; código 1,5; processo ágil 1; apresentação 1,5. São pesos, não notas conquistadas.
