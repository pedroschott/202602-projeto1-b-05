# Histórias de usuário

> Cada história nasce de uma oportunidade do mapa de jornada e vira uma Issue com o label `historia`.

| ID | História | Oportunidade de origem | Prioridade | Issue |
| --- | --- | --- | --- | --- |
| HU01 | Como cliente que recebeu sua primeira fatura da Bulbe, quero consultar uma explicação dos valores cobrados e da economia para conferir a cobrança antes de pagar. | #3 | Alta (proposta) | #5 |
| HU02 | Como cliente da Bulbe que não recebeu o aviso da primeira fatura, quero localizar a cobrança e consultar seu vencimento pelo app/site para organizar o pagamento sem depender da mensagem de WhatsApp. | #2 | Alta (proposta) | #9 |
| HU03 | Como cliente pessoa física da Bulbe no primeiro ciclo de contratação, quero acompanhar visualmente o andamento da minha adesão e consultar o próximo passo, para saber em que situação estou e se preciso realizar alguma ação. | #1 — acompanhamento da adesão durante a espera | Média (proposta individual; priorização pendente) | A definir |
| HU04 | Como cliente que recebeu a primeira fatura da Bulbe, quero ver pelo celular o que compõe o total, como a cobrança da Bulbe se relaciona com a conta da Cemig e em que se baseia a economia para pagar com confiança. | #3 (com apoio de #1 e #2) | A definir | A definir |

## HU01 — Entender os valores da primeira fatura

**Status:** proposta individual; aguarda alinhamento com as duas personas consolidadas e confirmação de entrada no MVP.
**Responsável:** Vinicius Gorini (@viniciusgorini)
**Persona de origem:** [Renata Alves](personas/vinicius-gorini.md)
**Momento da jornada:** recebimento e conferência da primeira fatura
**Oportunidade de origem:** [#3](https://github.com/pedroschott/202602-projeto1-b-05/issues/3)
**Tela proposta:** Entenda sua fatura

### História

Como cliente que recebeu sua primeira fatura da Bulbe, quero consultar uma explicação dos valores cobrados e da economia para conferir a cobrança antes de pagar.

### Critérios de aceite

- [ ] Mostrar referência, vencimento e valor total da fatura.
- [ ] Apresentar cada componente com nome, valor e explicação.
- [ ] A soma dos componentes corresponde ao total.
- [ ] Informar a base usada para comparar a economia.
- [ ] Sem dados suficientes, informar que a comparação está indisponível.
- [ ] Carregar dados fictícios em JSON via fetch.
- [ ] Exibir carregamento, falha e opção de tentar novamente.
- [ ] Permitir voltar à lista de faturas.
- [ ] Funcionar em largura de 360 px sem rolagem horizontal.

### Indicador e validação

Indicador pretendido: pagamento da primeira fatura. A hipótese é que compreender a cobrança ajude o cliente a decidir sobre o pagamento com menos dúvidas. Nenhum impacto foi medido.

Conferir cálculos, navegação, carregamento, falhas e apresentação no celular. Em um teste de compreensão, verificar se a pessoa identifica total, vencimento, componentes e base de comparação. Esse teste não comprova redução de inadimplência.

### Issues vinculadas

- Persona e jornada individual: #4
- História: #5
- Wireframe: #6
- Protótipo de alta fidelidade: #7
- Implementação: #8

Wireframe, protótipo e implementação estão planejados, ainda não executados. A consolidação das personas e a priorização coletiva do MVP permanecem pendentes.

## HU02 — Localizar a primeira fatura sem o aviso

**Status:** proposta individual; aguarda alinhamento com as duas personas consolidadas e confirmação de entrada no MVP.
**Responsável:** Pedro Marcondes Dombeck Schott (@pedroschott)
**Persona de origem:** [Célia Martins](personas/pedro-schott.md)
**Momento da jornada:** localização da primeira fatura e consulta do vencimento
**Oportunidade de origem:** [#2](https://github.com/pedroschott/202602-projeto1-b-05/issues/2)
**Tela proposta:** Minha primeira fatura

### História

Como cliente da Bulbe que não recebeu o aviso da primeira fatura, quero localizar a cobrança e consultar seu vencimento pelo app/site para organizar o pagamento sem depender da mensagem de WhatsApp.

### Critérios de aceite

- [ ] Disponibilizar na página inicial um acesso identificado como “Minha primeira fatura”, sem exigir um link recebido por WhatsApp ou e-mail.
- [ ] Quando a fatura estiver disponível, mostrar referência, valor total, vencimento e situação do pagamento informados nos dados.
- [ ] Quando ainda não houver fatura, mostrar “Aguardando emissão” e orientar a consultar novamente, sem inventar data de emissão ou vencimento.
- [ ] Diferenciar as situações “Em aberto”, “Vencida” e “Paga”; na situação “Paga”, mostrar a data de pagamento quando informada nos dados.
- [ ] Para uma fatura em aberto ou vencida, permitir abrir a cobrança fictícia com as informações necessárias para pagamento; para uma fatura paga, permitir consultar seus detalhes.
- [ ] Disponibilizar um caminho para consultar o contato cadastrado e encontrar orientação de atendimento quando precisar corrigi-lo.
- [ ] Carregar dados fictícios em JSON via fetch, incluindo cenários sem fatura, em aberto, vencida e paga.
- [ ] Exibir carregamento, falha e opção de tentar novamente; uma falha de consulta não deve ser apresentada como ausência de fatura.
- [ ] Permitir voltar à página inicial após consultar a cobrança.
- [ ] Funcionar em largura de 360 px sem rolagem horizontal, com rótulos legíveis e sem depender apenas de cores para indicar a situação.

### Indicador e validação

Indicador pretendido: pagamento da primeira fatura. A hipótese é que encontrar a cobrança e seu vencimento sem depender do aviso ajude o cliente a organizar o pagamento. Nenhum impacto foi medido.

Conferir navegação, dados, situações da fatura, carregamento, falhas e apresentação no celular. Em um teste de uso, apresentar o protótipo sem mensagem de aviso e verificar se a pessoa encontra a fatura, identifica vencimento e situação do pagamento e localiza onde consultar o contato cadastrado. Esse teste não comprova redução de inadimplência, entrega real de mensagens ou processamento de pagamentos.

### Issues vinculadas

- Persona e jornada individual: [Célia Martins](personas/pedro-schott.md)
- Oportunidade: [#2](https://github.com/pedroschott/202602-projeto1-b-05/issues/2), correspondente à O2 de `docs/jornada.md`
- História: [#9](https://github.com/pedroschott/202602-projeto1-b-05/issues/9)

Wireframe, protótipo e implementação ainda não foram executados. A consolidação das personas e a priorização coletiva do MVP permanecem pendentes.

## HU03 — Acompanhar o andamento da contratação

**Status:** proposta individual; aguarda alinhamento com as personas consolidadas e confirmação de entrada no MVP.  
**Responsável:** Pedro Padilha (contribuição individual — Persona 5)  
**Persona de referência:** [P1 — Cláudia Martins](personas/consolidadas.md#p1--cláudia-martins-acompanhar-e-acessar)  
**Momento da jornada:** cadastro e período de espera pela conexão  
**Oportunidade de origem:** acompanhamento claro da adesão durante a espera (O1 em `docs/jornada.md`)  
**Tela proposta:** Acompanhe sua adesão

### História

Como cliente pessoa física da Bulbe no primeiro ciclo de contratação, quero acompanhar visualmente o andamento da minha adesão e consultar o próximo passo, para saber em que situação estou e se preciso realizar alguma ação.

### Critérios de aceite

- [ ] Exibir uma linha de progresso com etapas identificadas e numeradas, destacando visualmente a etapa atual.
- [ ] Mostrar o status atual em linguagem simples; a compreensão não pode depender apenas de cores, números ou porcentagem.
- [ ] Exibir a última atualização quando essa informação estiver disponível nos dados.
- [ ] Mostrar pendências e o próximo passo quando houver informações confirmadas.
- [ ] Quando nenhuma ação for necessária do cliente, explicar que ele deve aguardar, sem inventar prazos ou datas de conexão.
- [ ] Definir as etapas do protótipo com base no processo confirmado pela Bulbe; enquanto isso não ocorrer, identificar os nomes e a sequência como ilustrativos.
- [ ] Carregar os dados fictícios de acompanhamento em arquivo JSON por meio de `fetch`.
- [ ] Exibir estados de carregamento e falha de consulta, com opção de tentar novamente.
- [ ] Não inventar status, datas, pendências, prazos ou previsões de conexão ausentes dos dados.
- [ ] Permitir navegar entre a tela de acompanhamento e as demais telas do protótipo.
- [ ] Funcionar em largura de 360 px sem rolagem horizontal, mantendo textos e etapas legíveis.

### Indicador e justificativa

**Indicador pretendido:** pagamento da primeira fatura. A inadimplência da primeira fatura foi de 32,4% entre setembro de 2025 e julho de 2026. A jornada também registra que alguns clientes passaram até 20 dias sem comunicação durante a espera. A hipótese é que informar o status e o próximo passo reduza a incerteza e ajude a preparar o cliente para as etapas seguintes. Isso não demonstra que a tela, por si só, reduzirá a inadimplência; nenhum impacto foi medido.

### Validação

Em um teste com o protótipo, pedir à pessoa para identificar em qual etapa está, explicar o que o status significa e dizer se precisa realizar alguma ação. Registrar se ela consegue responder sem ajuda. O teste avalia compreensão e navegação, não comprova redução de inadimplência, nem valida etapas oficiais do processo.

### Limites de escopo

Esta HU03 trata exclusivamente do acompanhamento da adesão durante o cadastro e a espera pela conexão. Não inclui explicar valores ou economia da primeira fatura (tema da HU01/HU04), nem localizar uma fatura cujo aviso não foi recebido (tema da HU02). Os nomes e a sequência das etapas precisam ser confirmados com a Bulbe antes de serem apresentados como processo oficial.

## HU04 — Conferir a primeira fatura e a relação com a Cemig

**Status:** proposta individual; aguarda alinhamento do squad e confirmação de entrada no MVP.  
**Responsável:** Rodrigo Araujo Rigotto (@rodrigorigotto)  
**Persona de origem:** [P2 — Renata Alves](personas/consolidadas.md#p2--renata-alves-compreender-e-conferir)  
**Momento da jornada:** chegada da 1ª fatura, decisão e pagamento  
**Oportunidade de origem:** [#3](https://github.com/pedroschott/202602-projeto1-b-05/issues/3), com apoio de [#1](https://github.com/pedroschott/202602-projeto1-b-05/issues/1) e [#2](https://github.com/pedroschott/202602-projeto1-b-05/issues/2)  
**Tela proposta:** Entenda sua fatura

### História

Como cliente que recebeu a primeira fatura da Bulbe, quero ver pelo celular o que compõe o total, como a cobrança da Bulbe se relaciona com a conta da Cemig e em que se baseia a economia para pagar com confiança, sem medo de estar pagando duas vezes ou de não ter o benefício contratado.

### Critérios de aceite

- [ ] Mostrar valor total e vencimento no topo da tela, sem rolar.
- [ ] Apresentar cada componente com nome, valor e explicação em linguagem simples.
- [ ] Explicar o que continua sendo pago à Cemig durante a espera, o que é cobrado pela Bulbe e o próximo passo, usando apenas as orientações disponíveis (E4).
- [ ] Não afirmar nem negar pagamento em dobro sem regra de faturamento confirmada; nesse caso, direcionar ao atendimento.
- [ ] Informar os períodos comparados e a base usada para calcular a economia.
- [ ] Sem dados suficientes ou com períodos não comparáveis, informar que a comparação está indisponível, sem exibir valor de economia.
- [ ] Mostrar orientação de pagamento e acesso ao atendimento próximos à explicação.
- [ ] Carregar dados fictícios em JSON via fetch.
- [ ] Exibir carregamento, falha e opção de tentar novamente.
- [ ] Funcionar em largura de 360 px sem rolagem horizontal.

### Indicador e validação

Indicador pretendido: pagamento da primeira fatura. A hipótese é que entender a cobrança, sua relação com a conta da Cemig e a base da economia ajude o cliente a pagar com menos dúvidas. Nenhum impacto foi medido; o dado de inadimplência de 32,4% (E0) é apenas contexto.

Em um teste com protótipo, verificar se a pessoa identifica, sem ajuda, total, vencimento, componentes, base da economia e a orientação aplicável à conta da Cemig. O teste não promete economia nem comprova redução de inadimplência ou churn.

### Observação de consolidação

Esta história se sobrepõe à HU01 e à HU03 na explicação dos valores e da economia. O que ela acrescenta é a relação entre a cobrança da Bulbe e a conta da Cemig durante a espera. O squad deve decidir se a HU04 segue como história própria ou se esse critério entra na HU01.
