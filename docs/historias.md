# Histórias de usuário

> Cada história nasce de uma oportunidade do mapa de jornada e vira uma Issue com o label `historia`.

| ID | História | Oportunidade de origem | Prioridade | Issue |
| --- | --- | --- | --- | --- |
| HU01 | Como cliente que recebeu sua primeira fatura da Bulbe, quero consultar uma explicação dos valores cobrados e da economia para conferir a cobrança antes de pagar. | #3 | Alta (proposta) | #5 |

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
