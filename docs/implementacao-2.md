# Implementação 2 — proposta de divisão e revisão

**Estado em 04/11/2026:** preparação de um PR draft limitado a testes, CI e documentação; divisão de implementação para alinhamento com o squad. Não registra aceitação das tarefas pelos colegas, novas funcionalidades implementadas, feedback recebido ou aceite das histórias. Os resultados técnicos conhecidos estão separados na seção de evidências. A autoria das HUs existentes é preservada; integração assistida não é contribuição individual de outro integrante.

## Entrega e datas

Segundo o [roteiro oficial](https://docs.google.com/document/d/14SpYXCmTpKkOcLHv6X9748ZEXL4ni0p1azWpK9Lz4sI/edit):

- **06/11:** MVP na `main` e Sprint Review II de 10 minutos.
- **12/11:** congelamento da versão final.
- **13 ou 18/11:** apresentação, conforme sorteio.
- Uma HU e tela própria por integrante, leitura de JSON via `fetch`, formulário com JavaScript, funcionamento mobile, README e revisão por outro colega.

As cinco histórias já têm telas no repositório. Isso não significa que todos os critérios estejam cumpridos: a HU04 exige login e a HU05 depende de metodologia oficial para calcular economia. Não reescrever os critérios para contornar essas lacunas.

## Mapa de navegação e lacunas

| Origem | Destino existente | Revisão proposta |
| --- | --- | --- |
| Home (`index.html`) | Assistente, detalhe da fatura e acompanhamento do benefício | Testar cenário e fatura atual/histórica sem perder o contexto |
| Detalhe (`pages/fatura.html`) | Assistente HU01 e retorno à origem | Preservar id e cenário ao entrar e sair |
| Assistente (`pages/assistente.html`) | Fatura, acompanhamento HU02 e suporte demonstrativo | Propor encaminhamento à HU05 e retorno contextual; não consta como implementado |
| Menu comum | Adesão HU03, boas-vindas HU04 e conferência HU05 | Revisar links e navegação em telas pequenas |
| Boas-vindas (`pages/boas-vindas.html`) | Home de demonstração ao começar/pular | Decidir escopo de login e controle do primeiro acesso |
| Conferência (`pages/calculo-economia.html`) | Formulário → comparação → explicação do bloqueio | Revisar cronologia, carregamento, teclado, foco e rolagem |

O controle local de primeiro acesso seria apenas memória neste navegador, não autenticação nem reconhecimento entre dispositivos. Mesmo se adotado, não resolve os critérios de login da HU04.

A HU05 já existe e permite conferir os dados informados. Não implementar uma subtração ou percentual como economia oficial: períodos de mesma duração e bases com o mesmo rótulo não comprovam comparabilidade segundo a Bulbe.

## Divisão sugerida para não concentrar o trabalho

A orientação de Pedro é concentrar os novos blocos em **Rodrigo e Vinicius**, deixar uma parte menor para **Sophia** e reservar a **Pedro** a integração final, testes, CI e documentação. **Padilha fica fora de novas tarefas e revisões neste plano**; sua autoria histórica da HU03 permanece preservada. A tabela detalha essa orientação, mas não registra concordância ou entrega dos colegas.

| Integrante / HU original | Bloco proposto nesta rodada | Commits sugeridos | Revisão cruzada sugerida |
| --- | --- | --- | --- |
| Vinicius Gorini / HU01 | HU01 → HU05 com retorno, cenário e id; revisão editorial da FAQ; links e contexto da navegação compartilhada, sem alterar regras das outras HUs | `feat(hu01): conecta conferência contextual`; `fix(navegacao): preserva origem e cenário`; `test(hu01): verifica FAQ e retorno` | Revisar o bloco de Rodrigo |
| Rodrigo Rigotto / HU04 | Decidir login com o grupo e implementar apenas o fluxo de entrada aprovado; testar começar/pular/falha; fazer os ajustes mobile necessários da HU03, preservando autoria original de Padilha | `fix(hu04): implementa fluxo aprovado de entrada`; `fix(hu03): ajusta etapas no mobile`; `test(entrada): verifica fluxo e responsividade` | Revisar o bloco de Vinicius |
| Sophia Miranda / HU05 | Correções delimitadas de cronologia/sobreposição, carregamento/retentativa e foco/rolagem do formulário; manter bloqueio de cálculo e documentar testes | `fix(hu05): valida períodos e estados`; `test(hu05): cobre formulário e acessibilidade` | Revisar a integração de Pedro |
| Pedro Schott / HU02 | Receber os blocos, resolver conflitos e amarrar o conjunto; regressão HU02, testes integrados, CI somente leitura, documentação e preparação do PR único. Não assumir a implementação dos colegas | `test(mvp): cobre navegação e cenários`; `ci(mvp): valida PR sem escrita`; `docs(mvp): registra evidências e pendências` | Revisar o bloco de Sophia |

A revisão técnica final assistida confere o conjunto, relata falhas e limites e ajuda Pedro a fechar a integração. Não substitui a revisão humana de outro colega exigida pelo roteiro, nem autoriza merge. Não há percentuais de carga comprovados; a prioridade de esforço acima é uma distribuição proposta, não uma medição de horas ou produtividade.

Os títulos de commits descrevem entregas esperadas, não commits já existentes. Não fabricar commits nem distribuir autoria para equilibrar números. O volume deve ser avaliado junto com escopo, alterações, revisões e evidências: merges e tarefas pequenas podem distorcer uma contagem simples. O gráfico de contribuições precisa usar dados reais do histórico e informar se conta merges e qual período considera.

## Fluxo em um único PR

1. Abrir o PR draft de preparação com testes, CI e documentação. Confirmar a divisão e as decisões de HU04/HU05 com o grupo antes de iniciar o trabalho de cada colega.
2. Reunir commits reais dos responsáveis em uma branch de integração; combinar sequência para arquivos compartilhados, especialmente `layout.js` e CSS comum.
3. Descrever no PR os blocos por HU, limitações, autoria efetiva e evidências de execução. Manter critérios de aceite pendentes quando não verificados.
4. Preparar CI em PR, `main` e execução manual, com `contents: read`: sintaxe de assets/scripts, testes Node API/HU02 e Chromium HU03/integração. Evidências como artefatos, sem commit/push automático de capturas. Confirmar o resultado real após publicar o draft.
5. Solicitar revisão humana de outro colega. QA automatizado ou revisão assistida não substituem a revisão humana exigida.
6. Manter o PR em draft enquanto os blocos e a revisão final estiverem pendentes. O merge só ocorre depois de revisão humana e decisão sobre a versão final; as correções por integrante continuam propostas, não implementadas.

## Plano de QA

**Os casos integrados abaixo são um plano de execução, não um checklist concluído.** As evidências já conhecidas ficam na última seção. Registrar depois data, commit, ambiente, resultado, evidência e responsável real. Não apresentar os testes históricos de uma HU como validação da integração nova.

- **Navegação:** home → detalhe → assistente → origem para faturas atual e histórica; exercitar todos os cenários da HU02, id inexistente e dados incompletos. Quando implementada, incluir ida e volta HU01 ↔ HU05.
- **HU02:** distinguir projeção de benefício lançado; conferir pendência do cliente, ausência de previsão e ausência de dados. Pix e suporte não devem simular pagamento ou envio real.
- **HU03:** etapas e próxima ação legíveis em 320, 360 e 430 px; testar carga, erro, retentativa e ausência de informação. Não inventar prazos.
- **HU04:** avançar/voltar, gesto, indicador, pular em cada slide, começar, imagem indisponível e erro de JSON. Testar primeiro acesso/retorno apenas após implementação; registrar explicitamente a pendência de login.
- **HU05:** campos vazios, zero/negativos, datas invertidas dentro do período, períodos sobrepostos ou fora da ordem, bases diferentes e durações diferentes. Conferir entrada válida, revisão dos dados e reinício. Não exibir economia monetária ou percentual sem metodologia implementada e confirmada.
- **Estados de consulta:** carga lenta visível, falha real do JSON e retentativa. Em testes locais, restaurar arquivos/dados antes de finalizar e não publicar uma simulação de falha.
- **Acessibilidade e layout:** teclado, foco visível e útil ao mudar etapa, rótulos, alertas, rolagem interna e ausência de sobreposição com cabeçalho/rodapé. Conferir mobile e desktop.
- **Técnico:** scripts existentes HU02/HU03, sintaxe dos scripts, links locais e diff; novos testes integrados/CI conforme implementação. Registrar separadamente falha de ambiente e defeito do produto.

## Decisões antes do aceite

- HU04: o grupo manterá o requisito de login para esta entrega? Se houver mudança de escopo, registrar decisão explícita sem declarar que o fluxo local cumpre o texto atual.
- HU05: obter metodologia oficial ou demonstrar apenas a conferência e o bloqueio, explicando o limite. Não declarar a história integralmente concluída.
- Conteúdo e etapas operacionais: revisão com o grupo/Bulbe continua pendente; nenhum feedback ou validação foi presumido.
- Fechar a divisão e a revisão cruzada antes de concluir o PR único. Cada integrante deve conseguir explicar sua tela, decisões e evidências na Review II.

## Evidências registradas em 04/11/2026

- **Node:** 35/35 testes locais aprovados: 18 regressões HU02 e 17 verificações API/fontes JSON, referências HTML e configuração sem cálculo oficial. Sintaxe dos scripts do app e testes verificada.
- **Chromium local:** bloqueado com `socket: Operation not permitted`; testes de navegador e QA visual não concluídos localmente. Não é aprovação nem reprovação das telas.
- **CI:** preparada para verificar o draft; resultado ainda pendente. Registrar run e commit depois da execução, sem antecipar sucesso.
- **Diagnóstico HU05 com DOM simulado:** aceita períodos idênticos e ordem invertida entre faturas; oculta o aviso com três flags `true`, embora não haja fórmula implementada. Não inclui validação HTML nativa, foco, rolagem ou layout. Correções propostas, não executadas nesta preparação.
- **Escopo:** arquivos da aplicação (assets, páginas, dados e index) preservados em relação à base `69f01fe75c6febc650755470a6e786c6147a8384`. O PR draft de preparação contém somente testes, CI e documentação; não representa entrega das tarefas dos colegas.

Comandos reproduzíveis de Node, Playwright 1.56.1 e servidor HTTP na porta 4173: [README — Testes](../README.md#testes).
