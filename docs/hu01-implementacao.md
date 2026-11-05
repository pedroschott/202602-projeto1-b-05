# HU01 — assistente contextual integrado

Responsável: Vinicius Gorini (@viniciusgorini). Relacionada às issues #5 e #8. A autoria original e as evidências da primeira versão são preservadas abaixo. A integração técnica não comprova impacto em pagamento ou aprovação do conteúdo pela Bulbe.

## O que funciona

- Home do grupo → convite identificado → assistente de perguntas prontas.
- Ver detalhes em qualquer fatura da home/histórico → `pages/fatura.html` → convite contextual → assistente → retorno à mesma fatura.
- FAQ independente em `data/hu01-assistente.json`, carregada via `assets/js/api.js`; carregamento, falha com tentativa novamente e ausência de perguntas.
- Valor, vencimento e situação vêm dos mesmos cenários da HU02. O id e o cenário acompanham a navegação; valores ausentes não são inventados.
- Respostas com encaminhamentos para fatura, acompanhamento HU02, conferência HU05 e suporte humano demonstrativo. A HU05 apresenta valores, períodos e bases informados, sem calcular economia por falta de metodologia oficial confirmada e implementada. Os componentes detalhados da cobrança continuam indisponíveis.
- A FAQ diferencia a conferência HU05 do simulador pré-contratação herdado da `main`, cuja premissa acadêmica de até 15% não equivale a economia realizada, oferta ou garantia da Bulbe.
- Campo opcional: só reconhece a pergunta cadastrada completa (ignorando acentos, caixa e pontuação básica); outros textos mostram a limitação e oferecem suporte. Não é IA. Textos do usuário são escapados.
- Template comum, fonte Poppins, logos do grupo e foco de teclado com azul/branco no lugar do laranja de baixo contraste.

## Executar

Abra `index.html` com Live Server. Não abrir por `file://`, pois a leitura JSON exige servidor.

## Roteiro de revisão

1. Home: abrir Conversar com o assistente; escolher perguntas, ler resposta e voltar ao início.
2. Home: Ver detalhes da fatura atual; abrir Perguntar sobre esta fatura; conferir referência e valor; voltar à mesma fatura.
3. Histórico: abrir Detalhes da primeira fatura (id 201 no cenário padrão); conferir que não aparece o valor da segunda.
4. Dúvida “Como foi calculada minha economia?”: abrir Conferir períodos e bases; verificar que a HU05 continua sem cálculo oficial; retornar ao assistente e depois à mesma fatura/home. Repetir a navegação. Dúvida “Quando o benefício vai aparecer?”: abrir Ver acompanhamento do benefício e conferir a tela da HU02. Suporte abre o diálogo comum sem enviar mensagem.
5. Enviar pergunta não cadastrada; verificar limitação e caminho de suporte. Enviar somente espaços: validação solicita uma pergunta.
6. Para falha real do fetch em ambiente local: renomear temporariamente `data/hu01-assistente.json`, recarregar o assistente, confirmar a falha; restaurar o nome e clicar Tentar novamente. Nunca publicar o arquivo removido.
7. Para vazio: em cópia local, usar `{ "perguntas": [] }`; conferir aviso e suporte; restaurar o conteúdo original.
8. Fatura ausente: `pages/fatura.html?id=9999`. Dados incompletos: `pages/fatura.html?cenario=dados-incompletos&id=302`. Não mostrar dados de outra fatura para preencher lacunas.
9. Conferir 360 px de largura, rolagem interna, navegação por teclado e cabeçalho/rodapé sem sobreposição.
10. Histórico no cenário `desconto-lancado`: usar a fatura 202 (Outubro/26, paga), entrar no assistente e na HU05, voltar e confirmar o mesmo cenário/id.
11. Usar cenário inválido, id vazio ou duplicado e origem desconhecida: o assistente deve explicar a ausência de contexto válido, oferecer respostas gerais e retornar à home sem exibir dados de outra fatura.

## Integração HU01 → HU05

A FAQ abre a conferência preservando cenário, id e origem válidos. O retorno passa pelo assistente e chega à mesma fatura ou home, sem preencher valores nem aplicar fórmulas. Contextos vazios, duplicados ou inválidos são descartados; destinos da FAQ seguem uma lista fechada.

Os comandos atuais estão no [README](../README.md#testes). A suíte reduzida mantém o fluxo principal; o roteiro manual acima cobre variantes adicionais. [Resultados e limites da integração](verificacao-mvp.md).

## Limites

Não há backend, envio de mensagens, IA generativa ou pagamento. O suporte e as abas globais já existentes mantêm seus avisos de indisponibilidade. A FAQ é uma demonstração e precisa de revisão editorial e de regras com o grupo/Bulbe. Os critérios técnicos marcados em `historias.md` não equivalem à validação com usuários. O protótipo de alta fidelidade em Figma é um entregável separado.

## Evidências da primeira versão

Capturas da área do app com 430 px; teste de largura mínima realizado separadamente.

![Home integrada](telas/hu01-home.png)

![Detalhe da fatura](telas/hu01-fatura.png)

![Assistente](telas/hu01-assistente.png)
