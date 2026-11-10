# Conformidade da entrega e pendências factuais

Atualização documental de 10/11/2026. Referências: [enunciado da Etapa 2](https://docs.google.com/document/d/14SpYXCmTpKkOcLHv6X9748ZEXL4ni0p1azWpK9Lz4sI/edit) e [estrutura-base](https://docs.google.com/document/d/1K9OFyecp78Xt7IMWENCUfc8RL-i-K73yShUDiCTYdSA/edit).

## Aplicativo e ferramentas

O aplicativo em `index.html`, `pages/` e `assets/` usa HTML, CSS e módulos JavaScript nativos. Toda leitura de JSON passa por `assets/js/api.js`; a HU05 valida a configuração depois de recebê-la. `fetch`, DOM, URLSearchParams, localStorage e Clipboard são APIs do navegador, não frameworks. Não há backend, IA generativa ou pagamento real. A fonte Poppins usa Google Fonts como primeira opção, cópia local como fallback e, por último, a fonte do sistema. Essa configuração original foi preservada.

Playwright, Node e GitHub Actions só verificam o projeto. Não são carregados pelo navegador do cliente. O React de `docs/base-visual/BulbeLayout.tsx` é uma referência do Figma Make, não parte do aplicativo; permanece no repositório para conservar a origem do material. O enunciado proíbe frameworks e bibliotecas de interface na solução, mas não proíbe ferramentas de teste nem estabelece limite de linhas de código.

## Dor, indicador e escopo

O indicador principal é pagamento da primeira fatura: proporção das primeiras faturas quitadas integralmente até o vencimento, com janela completa de conciliação. Uma eventual avaliação requer dados reais autorizados e comparação adequada; o protótipo não mede impacto. O dado histórico de 32,4% refere-se à inadimplência da primeira fatura.

A HU02 explica a espera desde a adesão. Seu cenário de segunda fatura fica preservado como extensão exploratória: não é evidência sobre a primeira fatura, e seu indicador não substitui o principal. As telas de adesão, acompanhamento, FAQ e conferência apoiam a compreensão do primeiro ciclo. O grupo ainda precisa validar conteúdo e regras com as fontes da Bulbe.

Consumo e Indicações foram retirados da navegação por não terem fluxo implementado. O simulador pré-contratação permanece como exercício acadêmico extra identificado, para preservar a contribuição existente; não é a HU05 de conferência nem integra a demonstração principal do MVP. O convite comercial foi substituído pelo retorno ao acompanhamento. Sua média de três contas com até 15% não é uma fórmula oficial ou promessa comercial.

A conferência HU05 valida valores, datas, cronologia e bases, apresenta os dados e explica o bloqueio. Não calcula economia oficial mesmo que alguém altere flags do JSON: a metodologia ainda não foi confirmada e implementada. Não afirmar que a história de cálculo está integralmente aceita. A tela de acesso é demonstrativa; autenticação real não é exigida pelo enunciado do frontend.

## Pendências que código não comprova

- **Registros das Sprint Reviews:** não foram encontrados registros preenchidos da Review I ou II. O roteiro proposto não é ata. Registrar apenas sessão, participantes, entregas, pendências e feedback que o grupo possa confirmar. Ver [orientação para os registros](sprints/README.md).
- **Autoria individual:** o enunciado exige história implementada de ponta a ponta pelo próprio integrante. Os nomes nas telas e o número de commits não comprovam isso sozinhos. Cada integrante deve explicar sua contribuição efetiva, inclusive ajuda recebida, usando o histórico real. Integração e correções assistidas não devem ser atribuídas retroativamente aos colegas.
- **Aceite e conteúdo:** a aprovação técnica do PR #41 por Rodrigo existe; não comprova aceite de todas as histórias, validação de clientes, feedback do professor ou aprovação da Bulbe.
- **Quadro e acesso:** conferir com o grupo responsáveis, tarefas e acesso do professor ao Projects. Esta revisão de código não certifica as permissões do quadro.
- **Versão final:** usar a CI do commit que será apresentado e conferir manualmente celular, navegação e estados de falha. CI não substitui arguição, revisão humana ou teste visual em Safari/iOS.

## Preparação para a arguição

Cada integrante deve conseguir demonstrar sua história e explicar: origem do JSON, fluxo assíncrono e retentativa; validação de entradas; cenário/id/origem na navegação; diferença entre estimativa e desconto lançado; estado local de boas-vindas versus autenticação; FAQ cadastrada versus IA; cópia de Pix fictício versus pagamento. Explicar também a função dos módulos comuns, a proteção de texto inserido no HTML e os limites dos testes. Não remover testes ou registros para ocultar ajuda ou autoria.

## Verificações desta correção

Sintaxe dos scripts, cinco testes Node e verificação de whitespace passaram localmente. Os novos testes cobrem carregamento HU05 pela API comum, erro HTTP/configuração inválida, ausência de atalhos vazios, fallback de fonte e ausência de imports React no runtime. O smoke Chromium ganhou verificações do simulador extra e retorno ao acompanhamento. A execução local do Chromium foi bloqueada antes de abrir por restrição de sockets do ambiente; consultar a CI do head desta PR para o resultado do navegador. Não houve inspeção visual local concluída nesta rodada.
