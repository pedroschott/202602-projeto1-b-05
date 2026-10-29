# Base compartilhada Bulbe / v1

Este é o contrato visual proposto para os cinco integrantes. Baseado nas telas do arquivo Bulbe :: IBMEC exportadas em 26/10/2026. Não é um manual oficial da marca.

## Invariantes
- Fonte Poppins: corpo 16 px/1.6, título 24 px/1.35 peso 600, subtítulo 20 px peso 600, legenda 12 px/1.5. Pesos 400, 500, 600 e 700. Carregar Poppins; fallback sans-serif apenas durante carregamento.
- Azul principal #08068D e verde de destaque #26D07C amostrados da exportação. Verde vivo para gráficos/destaque, não texto pequeno sobre branco. Texto #344054; secundário #667085; fundo branco; superfície #F6F9F9; borda #D1D9E0. Valores secundários e medidas são decisões de padronização do grupo.
- Logo original sempre com proporção preservada em caixa 96 x 38 px (object-fit: contain); não digitar a marca como texto nem redesenhar. Os PNGs são recortes da referência. Preferir SVG original futuramente, sem mudar a caixa.
- Cabeçalho 64 px. Colunas 44 px / 1fr / 44 px; marca centralizada no viewport, independentemente dos ícones. Ícone visual 24 px, alvo clicável 44 x 44 px. Suporte humano na direita. Não confundir suporte humano com chatbot/assistente HU01.
- Conteúdo com 24 px de margem lateral; espaçamento em múltiplos de 8 px (8,16,24,32). Botão principal altura mínima 48 px, raio 8 px; cartões raio 12 px e padding 16 px.
- Layout de referência 390 x 844 px; fluido de 320 a 430 px, sem rolagem horizontal. Não fixar largura e altura de celular na tela real. Usar 100dvh e área central rolável. Respeitar safe-area-inset-bottom; não simular barra de status do sistema.
- Componentes idênticos para todos; alterar tokens num único CSS. Não duplicar o cabeçalho em cada tela. Não sobrescrever medidas por integrante.

## Três modelos
1. onboarding: cabeçalho branco com marca colorida central e suporte, sem menu de cliente nem barra inferior. Área livre para imagem/mensagem. Rodapé com indicador de etapas, Continuar e Pular apresentação. Contagem e etapa devem ser controladas por estado.
2. app: cabeçalho azul com menu, marca clara e suporte. Navegação inferior com Faturas, Consumo, Indicações; altura 72 px + área segura. Item ativo ligado à rota. Área livre central.
3. detail: cabeçalho branco com Voltar, marca colorida e suporte. Sem duplicar barra principal. Rodapé contextual opcional para ação como Salvar; telas de leitura podem omiti-lo. Estado vazio central é apenas guia, remover ao inserir o conteúdo.

## Integração
- Reutilizar BulbeLayout.tsx e bulbe-base.css em Make/React. Todas as telas devem usar o componente, passando children e callbacks. Não deixar botões sem destino no protótipo final.
- HTMLs e demo.js servem para pré-visualização e futura base em HTML/CSS/JS. Não são uma implementação das histórias. O protótipo Make e a entrega acadêmica em HTML/CSS/JS são etapas distintas; confirmar os requisitos atuais da disciplina antes de usar React no repositório final.
- Não adicionar chatbot global ao cabeçalho: a HU01 terá seus ganchos próprios dentro do conteúdo.
- Tela de detalhe pode ser usada para chatbot, mas o campo de mensagem deve ocupar o rodapé contextual. Não adicionar Continuar numa conversa.
- Manter textos de botões descritivos, foco de teclado visível, contraste e rótulos acessíveis.

## Uso entre os cinco
Manter uma base comum versionada. Escolher o modelo; trabalhar apenas no conteúdo e no estado da sua história. Mudanças de cabeçalho, logo, tokens ou navegação devem entrar primeiro na base comum e ser replicadas por todos. Anexar o mesmo componente, CSS e este arquivo em cada Make. Prompts sozinhos não sincronizam arquivos separados.

Fonte visual: https://www.figma.com/design/j70T2O7tkWCyMWkHKcAK7R
Fonte sobre anexos de código no Make: https://help.figma.com/hc/en-us/articles/31304529835671
