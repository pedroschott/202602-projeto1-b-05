# Histórias de usuário

> Cada história nasce de uma oportunidade do mapa de jornada e vira uma Issue com o label `historia`.

| ID | História | Oportunidade de origem | Prioridade | Issue |
| --- | --- | --- | --- | --- |
| HU01 | Como Renata, cliente que recebeu sua primeira fatura e não compreende a cobrança, quero acessar explicações em linguagem simples por um assistente dentro do aplicativo para entender os valores e saber qual próximo passo realizar. | #3 (com apoio de #2) | Alta (proposta) | #5 |
| HU02 | Como cliente da Bulbe que não recebeu o aviso da primeira fatura, quero localizar a cobrança e consultar seu vencimento pelo app/site para organizar o pagamento sem depender da mensagem de WhatsApp. | #2 | Alta (proposta) | #9 |
| HU03 | Como cliente pessoa física da Bulbe no primeiro ciclo de contratação, quero acompanhar visualmente o andamento da minha adesão e consultar o próximo passo, para saber em que situação estou e se preciso realizar alguma ação. | #1 — acompanhamento da adesão durante a espera | Média (proposta individual; priorização pendente) | A definir |
| HU04 | Como cliente que recebeu a primeira fatura da Bulbe, quero ver pelo celular o que compõe o total, como a cobrança da Bulbe se relaciona com a conta da Cemig e em que se baseia a economia para pagar com confiança. | #3 (com apoio de #1 e #2) | A definir | A definir |
| HU05 | Como cliente da Bulbe, quero calcular e conferir minha economia usando períodos e bases comparáveis, para entender de onde vem o resultado e avaliar o benefício com confiança. | #3 — transparência e compreensão da economia | A definir | A definir |
| HU06 | Como Renata, cliente que está conhecendo a Bulbe, quero conhecer a oportunidade de indicar o serviço depois de compreender seu benefício na minha rotina, para recomendar com confiança e decidir se quero participar. | Observação do onboarding trazida por Pedro; extensão da avaliação no 2º mês | A definir; fora do MVP até alinhamento | A definir |

## HU01 — Esclarecer dúvidas com o assistente da Bulbe

**Status:** reformulação alinhada à orientação do professor relatada por Vinicius; priorização coletiva no MVP a confirmar.  
**Responsável:** Vinicius Gorini (@viniciusgorini)  
**Prioridade proposta:** Alta  
**Persona de referência:** [P2 — Renata Alves: compreender e conferir](personas/consolidadas.md#p2--renata-alves-compreender-e-conferir)  
**Momento da jornada:** recebimento e conferência da primeira fatura  
**Oportunidade principal:** [#3 — compreensão da cobrança](https://github.com/pedroschott/202602-projeto1-b-05/issues/3), com apoio de [#2 — acesso à informação e à fatura](https://github.com/pedroschott/202602-projeto1-b-05/issues/2)  
**Fluxo proposto:** convites contextuais no início e no detalhe da fatura → assistente/FAQ → informação ou tela correspondente.

### História

Como Renata, cliente que recebeu sua primeira fatura e não compreende a cobrança, quero acessar explicações em linguagem simples por um assistente dentro do aplicativo para entender os valores e saber qual próximo passo realizar.

### Critérios de aceite

- [ ] O assistente pode ser acessado pela tela inicial e pelo detalhe da fatura.
- [ ] Os convites identificam claramente que se trata de um assistente virtual.
- [ ] O cliente consegue iniciar a interação por perguntas prontas, sem precisar digitar.
- [ ] O acesso pela fatura oferece perguntas relacionadas à cobrança.
- [ ] As respostas usam linguagem simples e informações verificadas, sem inventar regras de faturamento ou valores.
- [ ] Quando aplicável, a resposta oferece um botão para a tela correspondente do aplicativo.
- [ ] Quando não há informação suficiente, o assistente informa a limitação e oferece um caminho de atendimento.
- [ ] Ao sair da conversa, o cliente consegue retornar à tela de origem.
- [ ] Carregar perguntas, respostas e dados fictícios de demonstração em JSON via `fetch`, com estados de carregamento, falha e tentativa novamente.
- [ ] Funcionar em largura de 360 px sem rolagem horizontal.

### Wireframes da mesma história

1. **Início do app:** convite visível e identificado para conversar com o assistente sobre dúvidas do serviço e da cobrança.
2. **Detalhe da fatura:** gancho contextual, como “Não entendeu esse valor? Pergunte ao assistente”, preservando o assunto ao abrir a conversa.
3. **Assistente/FAQ:** perguntas prontas, explicações curtas, botões para os destinos correspondentes e retorno à origem.

As três telas demonstram descoberta, entrada e uso do mesmo recurso e pertencem à HU01.

### Indicador e validação

Indicador pretendido: pagamento da primeira fatura. A hipótese é que explicações acessíveis no momento da dúvida apoiem a compreensão e a escolha do próximo passo. Nenhum impacto foi medido.

No protótipo, verificar se uma pessoa encontra o convite sem instrução, reconhece que é um assistente virtual, inicia uma pergunta, compreende a explicação, segue o encaminhamento e volta à tela de origem. Incluir uma pergunta sem resposta disponível para verificar o encaminhamento ao atendimento. Esse teste avalia descoberta, compreensão e navegação; não comprova redução de inadimplência.

### Limites e integração

A HU01 oferece explicações e encaminhamentos. Não substitui a localização da fatura (HU02), o acompanhamento da adesão (HU03), os detalhes da cobrança (HU04) ou a calculadora (HU05); integra esses destinos quando disponíveis. Não confirma pagamentos reais.

Perguntas prontas constituem o fluxo mínimo. Conversa livre, voz e integração com modelo de IA não são requisitos fechados nesta revisão; sua inclusão e viabilidade dependem de definição posterior. O protótipo não deve apresentar respostas predefinidas como IA já implementada.

### Issues vinculadas

- Persona e jornada individual de origem: #4
- História: #5
- Três wireframes: #6
- Protótipo de alta fidelidade: #7
- Implementação: #8

Wireframe, protótipo e implementação permanecem como tarefas planejadas, sem conclusão atribuída nesta revisão.

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


## HU05 — Calcular e conferir a economia

**Status:** proposta individual; aguarda alinhamento do squad e confirmação de entrada no MVP.  
**Responsável:** Sophia Miranda (@sophiacmiranda)  
**Persona de referência:** [P2 — Renata Alves](personas/consolidadas.md#p2--renata-alves-compreender-e-conferir)  
**Momento da jornada:** conferência da primeira fatura e avaliação da economia  
**Oportunidade de origem:** [#3](https://github.com/pedroschott/202602-projeto1-b-05/issues/3) — transparência dos valores e da economia  
**Tela proposta:** Calculadora de economia

### História

Como cliente da Bulbe, quero calcular e conferir minha economia usando períodos e bases comparáveis, para entender de onde vem o resultado e avaliar o benefício com confiança.

### Critérios de aceite

- [ ] Permitir visualizar os períodos considerados no cálculo e identificar claramente as datas inicial e final de cada período.
- [ ] Identificar a base de comparação e os valores usados no cálculo, com rótulos e explicações em linguagem simples.
- [ ] Exibir a fórmula ou as etapas do cálculo para que o cliente consiga entender como o resultado foi obtido.
- [ ] Calcular e exibir a economia somente quando houver dados suficientes e bases e períodos considerados comparáveis segundo regras confirmadas pela Bulbe.
- [ ] Se os períodos não forem comparáveis, houver dados ausentes ou a regra de cálculo não estiver confirmada, explicar por que não é possível calcular a economia e não apresentar um valor como se fosse confiável.
- [ ] Diferenciar valores informados, estimativas e resultados calculados; não apresentar estimativa como economia garantida.
- [ ] Permitir revisar os dados de entrada e atualizar o resultado quando eles forem alterados.
- [ ] Carregar dados fictícios de demonstração em JSON via `fetch`, sem usar ou expor dados reais de clientes.
- [ ] Exibir estados de carregamento e falha, com opção de tentar novamente.
- [ ] Funcionar em largura de 360 px sem rolagem horizontal, mantendo valores, períodos e explicações legíveis.

### Indicador e validação

**Indicador pretendido:** compreensão da base de cálculo da economia e pagamento da primeira fatura. A hipótese é que tornar períodos, valores e fórmula verificáveis ajude a pessoa a compreender o benefício. Nenhum impacto foi medido; o wireframe não comprova economia real nem redução de inadimplência.

Em um teste de compreensão, pedir à pessoa para apontar quais períodos foram comparados, explicar a base do cálculo e descrever como o resultado foi obtido. Incluir pelo menos um cenário com períodos incomparáveis ou dados insuficientes e verificar se a pessoa entende por que nenhum valor de economia é apresentado.

### Limites de escopo e relação com outras histórias

Esta história foca na **interação para conferir o cálculo da economia**. A HU01 explica os componentes da primeira fatura, enquanto a HU04 aborda também a relação entre as cobranças da Bulbe e da Cemig. A HU05 pode complementar essas histórias, mas o squad deve decidir se a calculadora será uma tela própria ou parte da tela “Entenda sua fatura”.

As regras oficiais, os dados necessários e a fórmula devem ser confirmados com a Bulbe antes de implementar o cálculo. Não se deve presumir que períodos ou valores sejam comparáveis sem essa confirmação.


## HU06 — Conhecer a indicação depois de experimentar o serviço

**Status:** proposta individual de Pedro Schott; aguarda revisão do squad e confirmação de escopo.
**Persona de referência:** [P2 — Renata Alves: compreender e conferir](personas/consolidadas.md#p2--renata-alves-compreender-e-conferir)
**Momento da jornada:** avaliação da experiência após compreender a primeira fatura e a economia; extensão da fase 6 do [mapa de jornada](jornada.md).
**Origem:** observação do onboarding enviada por Pedro em 20/10/2026, acompanhada de captura da tela “Indique e ganhe”. Não corresponde às oportunidades #1–#3 já registradas.

### Problema observado e hipótese

Segundo a observação trazida por Pedro, o convite para indicar aparece durante o onboarding, antes de o usuário experimentar o aplicativo. A captura mostra a oferta de R$ 50 para quem indica e R$ 50 para o indicado, condicionada à indicação confirmada, com benefício do indicado na primeira conta Bulbe. A imagem, isoladamente, não comprova quando a tela aparece nem valida as regras atuais da campanha.

Renata confere as cobranças e precisa entender o benefício antes de confiar no serviço. Pedir uma recomendação nesse primeiro contato pode chegar antes de ela ter uma experiência para compartilhar. Essa relação com a persona é uma hipótese, sem entrevista ou taxa de conversão medida.

A hipótese a testar é que apresentar o convite após uma experiência de valor torne a indicação mais relevante. Esta proposta amplia o recorte atual de acompanhamento e pagamento da primeira fatura; não altera a prioridade das HU01–HU05 nem atribui impacto em inadimplência.

### História

Como Renata, cliente que está conhecendo a Bulbe, quero conhecer a oportunidade de indicar o serviço depois de compreender seu benefício na minha rotina, para recomendar com confiança e decidir se quero participar.

A história descreve a necessidade e o benefício para a persona. Popup, missão e gatilho são a proposta de solução abaixo, que pode ser revisada sem mudar essa necessidade.

### Proposta de solução para o futuro wireframe

- Retirar o convite de indicação do onboarding.
- Apresentar um popup contextual após um marco de uso. Para o protótipo, propor a primeira consulta da explicação da economia com dados suficientes, após a primeira fatura. Esse marco é uma hipótese para discussão, não uma regra oficial nem prova de satisfação. Só contar dias desde o cadastro não garante experiência com o serviço.
- Mostrar no popup o benefício para as duas pessoas, as condições e o acesso à missão “Indique e ganhe”, com ação “Ver missão” e opção “Agora não”. Valores e condições devem ser confirmados com a Bulbe antes de uso real; no protótipo, são ilustrativos a partir da captura.
- Manter a missão no app, com explicação, regras, acesso ao compartilhamento por WhatsApp e acompanhamento do estado.
- Permitir fechar o popup e continuar usando o app. A missão pendente não pode ser descartada definitivamente: permanece acessível até ser concluída. Esta é a interpretação proposta para “missão que deve ser concluída para ser dismissable”; a persistência se aplica à missão, sem bloquear fatura, pagamento ou outras funções.
- Propor como conclusão da missão uma indicação confirmada conforme as regras da campanha. Nesse estado, permitir arquivá-la da lista de pendentes e manter o resultado consultável. A condição oficial de confirmação precisa ser definida com a Bulbe.

**Fluxo:** marco de uso → popup → missão pendente → compartilhamento → aguardando confirmação → missão concluída → arquivamento opcional.

Fechar o popup mantém a missão pendente. Abrir ou cancelar o WhatsApp não comprova envio, adesão ou indicação confirmada e não conclui a missão. Sem confirmação de envio, manter a missão pendente; usar “aguardando confirmação” somente quando houver registro de indicação verificável. Não creditar desconto só porque a missão foi aberta ou compartilhada.

### Critérios de aceite propostos

- [ ] O convite não aparece durante o onboarding nem antes do marco de uso definido para o protótipo.
- [ ] Quando faltam dados para compreender a economia, o marco não é considerado atingido.
- [ ] Após o marco, o popup informa o objetivo e as condições da indicação e permite abrir a missão ou fechar o convite.
- [ ] O popup é apresentado automaticamente uma única vez por campanha; fechar ou reabrir o app não o faz reaparecer. A missão continua acessível na área de missões.
- [ ] Fechar o popup não conclui, remove ou arquiva a missão pendente e não impede o uso do restante do app.
- [ ] A missão explica o que falta para concluir e diferencia pendente, aguardando confirmação e concluída por texto, sem depender apenas de cores.
- [ ] Abrir, cancelar ou retornar do WhatsApp sem evidência de indicação não conclui a missão nem informa que houve envio.
- [ ] Uma indicação só conclui a missão quando atende à condição de confirmação definida para a campanha; no protótipo, identificar essa confirmação como simulação com dados fictícios.
- [ ] Apenas a missão concluída pode ser arquivada da lista de pendentes; seu resultado continua consultável.
- [ ] Reabrir o app preserva o estado da missão e o registro de exibição do popup, sem duplicar missões da mesma campanha.
- [ ] Falha ao consultar o estado mostra erro e tentativa novamente, sem simular conclusão, confirmação ou concessão de desconto.
- [ ] O conteúdo funciona em largura de 360 px sem rolagem horizontal, com ações legíveis.

### Indicadores e validação

No teste do protótipo, verificar se a pessoa entende por que recebeu o convite, o benefício de cada participante, a condição de conclusão e a diferença entre fechar o popup e arquivar a missão. Testar saída e retorno, cancelamento do compartilhamento, falha de consulta e confirmação simulada.

Para uma avaliação futura em produção, comparar convite no onboarding e após o marco de uso, medindo indicações confirmadas por usuário exposto em uma mesma janela de acompanhamento. Acompanhar também abertura da missão, fechamento do popup e abandono de tarefas principais. Cliques no WhatsApp são intenção de compartilhar, não indicações confirmadas. A janela, o tamanho da amostra e a meta ainda precisam ser definidos; nenhum ganho de conversão foi demonstrado.

### Limites e próximos passos

Este PR documenta a história e o comportamento proposto. Não implementa o recurso, não altera a campanha real e não cria wireframe. Pedro fará o wireframe no Figma, contemplando popup, missão pendente e conclusão/arquivamento. O link poderá ser incluído quando existir.

Antes da implementação, alinhar com o squad a inclusão no escopo e confirmar com a Bulbe o marco de uso, as condições da campanha e o evento que comprova uma indicação. As biografias da persona consolidada permanecem preservadas; o comportamento de indicação é uma hipótese adicional.
