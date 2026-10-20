# Histórias de usuário

> Cada história nasce de uma oportunidade do mapa de jornada e vira uma Issue com o label `historia`.

| ID | História | Oportunidade de origem | Prioridade | Issue |
| --- | --- | --- | --- | --- |
| HU01 | Como cliente que recebeu sua primeira fatura da Bulbe, quero consultar uma explicação dos valores cobrados e da economia para conferir a cobrança antes de pagar. | #3 | Alta (proposta) | #5 |
| HU02 | Como cliente da Bulbe que não recebeu o aviso da primeira fatura, quero localizar a cobrança e consultar seu vencimento pelo app/site para organizar o pagamento sem depender da mensagem de WhatsApp. | #2 | Alta (proposta) | #9 |
| HU03 | Como cliente da Bulbe, quero acompanhar pelo celular o andamento da contratação e entender os valores e a economia da primeira fatura para saber o que estou pagando sem precisar procurar atendimento. | Acompanhamento da jornada e compreensão da primeira cobrança | Média (proposta individual; priorização pendente) | A definir |
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

## HU03 — Acompanhar a contratação e entender a primeira fatura

**Status:** proposta individual; aguarda alinhamento com as duas personas consolidadas e confirmação de entrada no MVP.  
**Responsável:** contribuição individual — Persona 5  
**Persona de origem:** [Mariana Alves](personas/mariana-alves.md)  
**Momento da jornada:** período de espera, recebimento e conferência da primeira fatura  
**Oportunidade de origem:** acompanhamento claro da adesão e compreensão da primeira cobrança  
**Tela proposta:** Acompanhe sua adesão / Entenda sua primeira fatura

### História

Como cliente da Bulbe, quero acompanhar pelo celular o andamento da contratação e entender os valores e a economia da primeira fatura para saber o que estou pagando sem precisar procurar atendimento.

### Critérios de aceite

- [ ] Permitir consultar o status atual da contratação e apresentar o próximo passo quando essa informação estiver disponível.
- [ ] Quando a primeira fatura estiver disponível, mostrar valor total, vencimento e referência da cobrança.
- [ ] Explicar os principais componentes da fatura em linguagem simples.
- [ ] Informar a base usada para comparar a economia; se não houver dados suficientes, deixar isso explícito.
- [ ] Apresentar as informações em layout legível pelo celular.
- [ ] Exibir estados de carregamento e falha de consulta, com opção de tentar novamente.
- [ ] Não inventar datas, valores, status ou economias que não estejam presentes nos dados.
- [ ] Permitir acessar as informações sem depender exclusivamente de uma mensagem de WhatsApp.

### Indicador e validação

Indicador pretendido: compreensão da primeira fatura e apoio ao pagamento da primeira cobrança. A hipótese é que o acompanhamento claro e a explicação dos valores reduzam dúvidas. Nenhum impacto foi medido.

Em um teste com protótipo, verificar se a pessoa consegue encontrar o status da adesão, identificar o valor e vencimento da primeira fatura e explicar os principais componentes e a base da economia. O teste avalia compreensão e navegação, não comprova redução de inadimplência.

### Observação de consolidação

Esta história é uma proposta individual e pode se sobrepor à HU01, que já aborda a explicação dos valores e da economia, e à HU02, que aborda localizar a primeira fatura sem o aviso. O squad deve comparar as necessidades e decidir se a HU03 acrescenta um fluxo distinto ou se seus critérios devem ser incorporados às histórias existentes antes da definição final do MVP.

## HU04 — Conhecer a Bulbe pelo carrossel antes do login

**Status:** proposta individual; aguarda alinhamento do squad e confirmação de entrada no MVP.  
**Responsável:** Rodrigo Araujo Rigotto (@rodrigorigotto)  
**Persona de origem:** [a definir — link para a persona em personas/consolidadas.md]  
**Momento da jornada:** primeiro acesso ao app, antes do login  
**Oportunidade de origem:** [a definir — link para a issue]  
**Tela proposta:** Boas-vindas (carrossel)

### História

Como pessoa que abre o app da Bulbe pela primeira vez, quero ver em poucos slides o que a Bulbe oferece, como o serviço funciona e o que vou encontrar depois de entrar, para decidir com segurança se faço login ou crio conta, sem precisar me cadastrar primeiro para entender o app.

### Critérios de aceite

- [ ] Exibir o carrossel no primeiro acesso, antes da tela de login.
- [ ] Apresentar cada slide com título, texto curto em linguagem simples e imagem.
- [ ] Usar no conteúdo dos slides apenas informações confirmadas sobre o serviço; não prometer valor de economia nem prazo.
- [ ] Permitir avançar e voltar com gesto de deslizar e com botões.
- [ ] Mostrar um indicador de posição (por exemplo, "2 de 4" ou bolinhas).
- [ ] Oferecer "Pular" em todos os slides, levando direto à tela de login.
- [ ] No último slide, exibir o botão "Começar", que leva à tela de login.
- [ ] Não exibir o carrossel de novo para quem já viu ou pulou.
- [ ] Se uma imagem não carregar, manter o texto visível e a navegação funcionando.
- [ ] Carregar o conteúdo dos slides de um JSON fictício via fetch.
- [ ] Exibir carregamento, falha e opção de tentar novamente; em caso de falha, permitir seguir para o login.
- [ ] Funcionar em largura de 360 px sem rolagem horizontal.

### Indicador e validação

Indicador pretendido: avanço do primeiro acesso para o login ou cadastro. A hipótese é que entender a proposta da Bulbe antes do login diminua a desistência na entrada do app. Nenhum impacto foi medido.

Em um teste com protótipo, verificar se a pessoa consegue, sem ajuda, dizer o que a Bulbe oferece, navegar pelos slides, pular o carrossel e chegar à tela de login. O teste não comprova aumento de cadastros nem de conversão.

### Observação de consolidação

[a definir — verificar se esta história se sobrepõe a outra HU do squad, como login ou cadastro. Se não houver sobreposição, retirar esta seção.]