# Implementação 2 — integração e revisão

**05/11/2026:** o [PR draft #41](https://github.com/pedroschott/202602-projeto1-b-05/pull/41) reúne as cinco HUs, sem merge na `main`. As contribuições originais permanecem no histórico; ajustes assistidos de integração não constituem implementação individual dos colegas. [Matriz de requisitos, evidências e pendências](verificacao-mvp.md).

## Blocos recebidos

- **Sophia / HU05:** `feat/hu05-implementacao`, commit `3367900`, com a `main` `2c4a456` na ancestralidade. Conferência separada do simulador; validação de cronologia/sobreposição, carga/retentativa, foco, rolagem e retorno contextual. Bases e durações diferentes geram avisos, não bloqueiam a entrada. Não há fórmula oficial.
- **Rodrigo / HU04 e mobile HU03:** `hu04-integracao-home`, commit `952f442`. Primeiro acesso local pela home, fallback quando o armazenamento está indisponível, teclado/gesto e ajustes mobile. A HU03 mantém autoria original de Padilha. A contribuição original não incluía login. A integração final acrescenta acesso visual demonstrativo, sem atribuí-lo retroativamente a Rodrigo.
- **Integração:** consulta e menu da conferência restaurados; simulador pré-contratação da `main` preservado. A rodada final conecta HU01 ↔ HU05 com contexto seguro, corrige o breakpoint HU03 e protege carga/retentativa do simulador. A HU01 mantém autoria original de Vinicius.

## Entrega e datas

Segundo o [roteiro oficial](https://docs.google.com/document/d/14SpYXCmTpKkOcLHv6X9748ZEXL4ni0p1azWpK9Lz4sI/edit):

- **06/11:** MVP na `main` e Sprint Review II de 10 minutos.
- **12/11:** congelamento da versão final.
- **13 ou 18/11:** apresentação final conforme sorteio, 15 minutos mais 5 de perguntas; todos falam.
- Uma HU e tela própria por integrante, JSON via `fetch`, formulário validado em JavaScript, funcionamento mobile, README e revisão por outro colega.

As cinco histórias têm telas. Isso não comprova todos os critérios: a HU04 tem acesso visual demonstrativo, não autenticação real, e a HU05 depende de metodologia oficial. Não reescrever critérios para contornar essas lacunas.

## Navegação e limites

| Origem | Destino / comportamento |
| --- | --- |
| Home e histórico | Detalhe da fatura, assistente e acompanhamento HU02 |
| Detalhe da fatura | HU01 com id e cenário; retorno à mesma fatura |
| Assistente HU01 | Conferência HU05, acompanhamento HU02 e suporte demonstrativo |
| Menu comum | Adesão HU03, boas-vindas HU04, conferência e simulador separados |
| Boas-vindas HU04 | Começar/Pular → acesso demonstrativo → home; sem autenticação real |
| Conferência HU05 | Formulário → revisão dos dados → explicação do bloqueio de cálculo |

O primeiro acesso guarda memória apenas no navegador: não autentica nem reconhece outros dispositivos. Na HU05, bases com o mesmo rótulo e períodos de igual duração não comprovam comparabilidade. Não apresentar subtração ou percentual como economia oficial.

## Plano original de divisão — 04/11

A orientação foi concentrar os novos blocos em **Rodrigo e Vinicius**, deixar uma parte menor para **Sophia** e reservar a **Pedro** integração, testes, CI e documentação. **Padilha não recebe novas tarefas ou revisões neste plano**; sua autoria histórica da HU03 permanece. Esta tabela registra a proposta, não comprova execução ou aceite.

| Integrante / HU | Bloco proposto | Revisão sugerida |
| --- | --- | --- |
| Vinicius / HU01 | Conferência contextual, retorno, revisão editorial da FAQ e navegação compartilhada | Bloco de Rodrigo |
| Rodrigo / HU04 | Fluxo de entrada aprovado pelo grupo, começar/pular/falha e ajustes mobile HU03 | Bloco de Vinicius |
| Sophia / HU05 | Cronologia/sobreposição, carga/retentativa, foco e rolagem; manter cálculo bloqueado | Integração de Pedro |
| Pedro / HU02 | Reunir commits, resolver conflitos, regressões essenciais, CI, documentos e PR único | Bloco de Sophia |

A revisão assistida não substitui revisão humana nem autoriza merge. Não há medição de horas ou percentuais de esforço. O gráfico de contribuições deve usar o histórico real, informar período e tratamento dos merges, sem fabricar commits ou redistribuir autoria para equilibrar contagens.

## Processo do PR único

1. Reunir commits reais na branch de integração, coordenando arquivos compartilhados como `layout.js` e CSS.
2. Registrar blocos, limitações, autoria efetiva e evidências. Critérios não verificados continuam pendentes.
3. Executar a CI em PR, `main` e execução manual, com `contents: read`: sintaxe, três testes Node essenciais e smoke Chromium. Captura de falha é artefato; não há commit/push automático.
4. Solicitar revisão humana de outro integrante, tratar observações e decidir os desvios HU04/HU05.
5. Integrar à `main` somente após revisão e autorização. PR draft ou CI verde não equivalem à entrega.

## QA essencial e revisão manual

A suíte foi reduzida a poucos testes para facilitar manutenção. [Comandos reproduzíveis](../README.md#testes). A cobertura automatizada não substitui os critérios originais ou a revisão manual abaixo:

- **Navegação/HU02:** percorrer home → detalhe → assistente → conferência → origem, conservando cenário/id. Conferir fatura atual e histórica, previsão versus benefício lançado e ausência de dados. Pix e suporte não enviam mensagens nem efetuam pagamentos.
- **HU03:** etapa atual, próximo passo e rótulos legíveis no celular. As etapas são verticais até 430 px e horizontais a partir de 431 px. Não inventar prazos.
- **HU04:** avançar/voltar, começar/pular e retorno após primeiro acesso. Verificar que ausência de armazenamento não bloqueia a home. O destino é a tela de acesso demonstrativo; depois, a home.
- **HU05:** entrada válida, revisão e reinício; conferir datas invertidas, sobreposição e valores inválidos. Bases/durações diferentes são avisos. A conferência mantém cálculo oficial bloqueado; o simulador separado usa premissa acadêmica de até 15%, sem promessa comercial.
- **Carga e acessibilidade:** quando necessário, exercitar falha/retentativa, teclado, foco e rolagem interna em cópia local. Restaurar dados antes de publicar. Essas variantes não são todas cobertas pelo smoke reduzido.

Registrar data, commit, ambiente, resultado e evidência real. Distinguir defeito do produto de limitação do ambiente, e teste automatizado de inspeção visual.

## Decisões antes do aceite

- **HU04:** A tela de acesso é demonstrativa. O fluxo visual está implementado; autenticação real e cadastro continuam fora do protótipo. Revisão humana dos critérios ainda pendente.
- **HU05:** obter metodologia oficial ou demonstrar apenas a conferência bloqueada, sem declarar conclusão integral.
- **Conteúdo:** revisar FAQ, etapas e regras com grupo/Bulbe; nenhum feedback ou impacto foi presumido.
- **Review II:** cada integrante deve explicar sua tela e contribuição efetiva. Combinar fala e registrar feedback somente depois da sessão; [roteiro](sprints/review-ii-roteiro.md).

Resultados de execução e checklist de liberação ficam apenas na [verificação do MVP](verificacao-mvp.md), evitando manter cópias divergentes em cada documento.
