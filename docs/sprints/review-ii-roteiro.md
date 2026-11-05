# Sprint Review II — roteiro proposto

**06/11/2026 · 10 minutos · demonstração ao vivo.** Não é ata nem registro de feedback ou aceite. Fonte: [roteiro oficial](https://docs.google.com/document/d/14SpYXCmTpKkOcLHv6X9748ZEXL4ni0p1azWpK9Lz4sI/edit). Preparação: [matriz do MVP](../verificacao-mvp.md).

| Tempo | Conteúdo proposto |
| --- | --- |
| 0:00–1:15 | Conceito: reduzir a incerteza no primeiro ciclo. Mostrar a dor e suas fontes, distinguindo evidências agregadas de hipóteses |
| 1:15–2:15 | Ideação: personas fictícias, jornada e escolha das cinco HUs. Explicar por que acompanhamento, informação e conferência se complementam |
| 2:15–3:00 | HU04: boas-vindas e entrada local demonstrativa. Dizer claramente que login não está implementado |
| 3:00–4:00 | HU03: etapa da adesão e próximo passo; HU02: espera pelo benefício, projeção versus desconto lançado |
| 4:00–5:15 | HU01: pergunta pronta, fatura contextual e encaminhamento HU05. Usar apenas o fluxo efetivamente testado no head demonstrado |
| 5:15–6:30 | HU05: formulário, conferência e bloqueio de cálculo oficial. Distinguir do simulador pré-contratação |
| 6:30–7:30 | Qualidade: JSON via fetch, validação JS, mobile e estados de erro; mostrar evidências reais da versão apresentada |
| 7:30–8:30 | Entregue e excluído: login, cálculo oficial, pagamentos reais, Consumo/Indicações e validação com clientes |
| 8:30–10:00 | Aprendizados técnicos observados, revisão/pendências e próximos passos até 12/11; receber feedback sem antecipá-lo |

A distribuição de fala deve ser combinada com o grupo. A HU03 mantém autoria original de Pedro Padilha; apresentador a combinar, sem atribuir nova implementação a ele. Identificar o trabalho efetivo de cada integrante e os ajustes posteriores de integração.

## Antes da apresentação

- Usar a versão efetivamente disponível na `main`, após revisão e merge autorizado. Não apresentar draft como entrega concluída.
- Abrir em servidor HTTP; preparar dados fictícios e uma largura mobile.
- Usar a CI final 41953862665, aprovada no head `20f378a`; a falha anterior em 401 px foi corrigida. Conferir se o head apresentado corresponde ao testado e comunicar os limites da inspeção visual parcial.
- Apresentar somente testes executados, com commit/run e limites. Revisão assistida não substitui revisão humana de colega.
- Não afirmar aumento de pagamentos, aprovação da Bulbe, entrevista, reunião ou feedback que não tenham ocorrido.

## Depois da sessão

Registrar data, participantes efetivos, feedback recebido, decisões confirmadas e próximos passos. Este roteiro não preenche esses registros antecipadamente.

## Adaptação para a apresentação final

Em 13 ou 18/11, conforme sorteio, haverá **15 minutos mais 5 de perguntas**, com fala de todos. Ampliar conceito, evidências, ideação e aprendizados, mantendo a demonstração e os limites explícitos. O congelamento é em 12/11. A apresentação final não deve reproduzir apenas uma sequência de telas ou confundir o roteiro de 10 minutos da Review II com o tempo final.
