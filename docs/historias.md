# Histórias de usuário

> Cada história nasce de uma oportunidade do mapa de jornada e vira uma Issue com o label `historia`.

| ID | História | Oportunidade de origem | Prioridade | Issue |
| --- | --- | --- | --- | --- |
| HU01 | Como cliente que recebeu sua primeira fatura da Bulbe, quero consultar uma explicação dos valores cobrados e da economia para conferir a cobrança antes de pagar. | #3 | Alta (proposta) | #5 |
| HU02 | Como cliente da Bulbe que não recebeu o aviso da primeira fatura, quero localizar a cobrança e consultar seu vencimento pelo app/site para organizar o pagamento sem depender da mensagem de WhatsApp. | #2 | Alta (proposta) | #9 |

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
