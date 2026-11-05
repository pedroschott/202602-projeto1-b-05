import { buscarAcompanhamentoHU03 } from './api.js';
import { iniciarLayout, carregarComEstados, escaparHTML } from './layout.js';

iniciarLayout();
const alvo = document.querySelector('#hu03-conteudo');
const cenario = new URLSearchParams(window.location.search).get('cenario');

function validar(dados) {
  if (!dados || !Array.isArray(dados.etapas) || dados.etapas.length !== 5) {
    throw new Error('A HU03 precisa ter cinco etapas.');
  }

  const obrigatorios = ['nome', 'titulo', 'descricao', 'proxima', 'orientacao'];
  if (!dados.etapas.every((etapa) =>
    obrigatorios.every((campo) => typeof etapa[campo] === 'string'))) {
    throw new Error('Etapas HU03 incompletas.');
  }

  const chave = cenario || dados.cenarioPadrao;
  const estado = dados.cenarios && Object.hasOwn(dados.cenarios, chave)
    ? dados.cenarios[chave] : null;
  if (!estado) return null;

  if (!Number.isInteger(estado.etapaAtual) ||
    estado.etapaAtual < 0 || estado.etapaAtual >= dados.etapas.length ||
    !['statusAtual', 'resumoAtual', 'ultimaAtualizacao']
      .every((campo) => typeof estado[campo] === 'string' && estado[campo].trim())) {
    throw new Error('Estado atual da HU03 incompleto ou inválido.');
  }

  // Uma pendência só é exibida se vier informada explicitamente nos dados.
  if (estado.pendencia != null &&
      (typeof estado.pendencia !== 'object' ||
      !['titulo', 'detalhe', 'acao'].every((campo) =>
        typeof estado.pendencia[campo] === 'string' &&
        estado.pendencia[campo].trim()))) {
    throw new Error('Pendência da HU03 incompleta ou inválida.');
  }

  return { etapas: dados.etapas, estado };
}

function mostrar({ etapas, estado }) {
  // etapaAtual vem dos dados; etapaSelecionada só altera o painel de consulta.
  const etapaAtual = estado.etapaAtual;
  const situacaoEtapa = (indice) => indice < etapaAtual
    ? 'Concluído' : indice === etapaAtual ? 'Etapa atual' : 'Aguardando';

  const etapasHTML = etapas.map((etapa, indice) =>
    '<button type="button" class="hu03-step" data-etapa="' + indice + '"' +
      ' aria-pressed="false" aria-label="' +
      escaparHTML(etapa.nome + ': ' + situacaoEtapa(indice)) + '">' +
      '<span class="hu03-circle" aria-hidden="true">' + (indice + 1) + '</span>' +
      '<span>' + escaparHTML(etapa.nome) + '</span>' +
    '</button>'
  ).join('');

  alvo.innerHTML =
    '<section class="hu03-card" aria-labelledby="titulo-jornada">' +
      '<div class="hu03-head"><div><p class="hu03-overline">ANDAMENTO DO PROCESSO</p>' +
      '<h2 id="titulo-jornada">Sua jornada</h2></div>' +
      '<span class="hu03-pill">Protótipo</span></div>' +
      '<p class="hu03-current-label">Etapa atual: <strong>' +
        escaparHTML(etapas[etapaAtual].nome) + '</strong></p>' +
      '<div class="hu03-steps" role="group" aria-label="Etapas ilustrativas da adesão">' +
        '<div class="hu03-track" aria-hidden="true">' +
          '<div id="hu03-fill" class="hu03-fill"></div></div>' +
        etapasHTML +
      '</div>' +
      '<div class="hu03-legend" aria-label="Significado dos indicadores">' +
        '<span><i class="hu03-legend-dot is-done" aria-hidden="true"></i>Concluído</span>' +
        '<span><i class="hu03-legend-dot is-current" aria-hidden="true"></i>Etapa atual</span>' +
        '<span><i class="hu03-legend-dot is-waiting" aria-hidden="true"></i>Aguardando</span>' +
      '</div>' +
      '<p class="hu03-hint">Selecione uma etapa para consultar detalhes. Isso não muda seu andamento.</p>' +
    '</section>' +
    '<section class="hu03-status" aria-labelledby="hu03-situacao">' +
      '<div class="hu03-status-icon" aria-hidden="true">✓</div>' +
      '<div><p class="hu03-overline">SITUAÇÃO ATUAL · EXEMPLO</p>' +
        '<h2 id="hu03-situacao"></h2><p id="hu03-resumo-atual"></p>' +
      '</div></section>' +
    '<section class="hu03-card hu03-details" aria-live="polite">' +
      '<p class="hu03-overline" id="hu03-detalhe-modo"></p>' +
      '<h2 id="hu03-titulo"></h2><p id="hu03-descricao"></p>' +
    '</section>' +
    '<section class="hu03-card hu03-next">' +
      '<div class="hu03-next-icon" aria-hidden="true">→</div><div>' +
        '<p class="hu03-overline">SEU PRÓXIMO PASSO</p>' +
        '<h2 id="hu03-proxima"></h2><p id="hu03-orientacao"></p>' +
        '<div id="hu03-acao"></div>' +
      '</div></section>' +
    '<section class="hu03-card hu03-pendency" aria-labelledby="hu03-pendencia-titulo">' +
      '<p class="hu03-overline">PENDÊNCIAS E AÇÕES</p>' +
      '<h2 id="hu03-pendencia-titulo"></h2>' +
      '<p id="hu03-pendencia-detalhe"></p>' +
    '</section>' +
    '<aside class="hu03-cemig">' +
      '<strong>Sobre a conta da Cemig durante a espera</strong>' +
      '<p>O material do projeto orienta continuar pagando a Cemig durante o período ' +
      'indicado pela Bulbe. Confirme pelo atendimento oficial quais orientações ' +
      'se aplicam ao seu caso. Esta demonstração não informa prazos de conexão, ' +
      'datas de pagamento ou situação real das suas faturas.</p>' +
    '</aside>' +
    '<section class="hu03-update">' +
      '<strong>◷ Última atualização</strong><p id="hu03-update-texto"></p>' +
    '</section>' +
    '<aside class="hu03-note">ⓘ Demonstração acadêmica com dados fictícios. ' +
      'O fluxo e as atualizações devem ser confirmados com a Bulbe.</aside>';

  const botoes = [...alvo.querySelectorAll('[data-etapa]')];
  const preenchimento = alvo.querySelector('#hu03-fill');

  // Os elementos de andamento real são preenchidos uma única vez.
  // Consultar qualquer outra etapa não altera esta informação.
  preenchimento.style.width = (etapaAtual / (etapas.length - 1) * 100) + '%';
  alvo.querySelector('#hu03-situacao').textContent = estado.statusAtual;
  alvo.querySelector('#hu03-resumo-atual').textContent = estado.resumoAtual;
  const pendencia = estado.pendencia || null;
  alvo.querySelector('#hu03-proxima').textContent = pendencia
    ? 'Ação necessária: ' + pendencia.titulo
    : etapaAtual === 4
      ? 'Consultar sua primeira fatura'
      : 'Próxima etapa: ' + etapas[etapaAtual].proxima;
  alvo.querySelector('#hu03-orientacao').textContent = pendencia
    ? pendencia.acao
    : etapas[etapaAtual].orientacao;
  alvo.querySelector('#hu03-update-texto').textContent = estado.ultimaAtualizacao;

  const secaoPendencia = alvo.querySelector('.hu03-pendency');
  secaoPendencia.classList.toggle('is-action-required', Boolean(pendencia));
  alvo.querySelector('#hu03-pendencia-titulo').textContent = pendencia
    ? pendencia.titulo : 'Nenhuma pendência informada';
  alvo.querySelector('#hu03-pendencia-detalhe').textContent = pendencia
    ? pendencia.detalhe
    : 'Neste cenário demonstrativo, não há ação pendente registrada. ' +
      'Continue acompanhando as atualizações.';
  // Orientação de espera não é mostrada no cenário da fatura já disponível.
  alvo.querySelector('.hu03-cemig').hidden = etapaAtual === 4;

  if (etapaAtual === 4) {
    const link = document.createElement('a');
    link.className = 'hu03-next-action';
    link.href = '../index.html';
    link.textContent = 'Consultar faturas';
    alvo.querySelector('#hu03-acao').appendChild(link);
  }

  function selecionar(etapaSelecionada) {
    const etapa = etapas[etapaSelecionada];
    botoes.forEach((botao, indice) => {
      botao.classList.toggle('is-done', indice < etapaAtual);
      botao.classList.toggle('is-current', indice === etapaAtual);
      botao.classList.toggle('is-selected', indice === etapaSelecionada);
      botao.setAttribute('aria-pressed', String(indice === etapaSelecionada));
      botao.querySelector('.hu03-circle').textContent =
        indice < etapaAtual ? '✓' : String(indice + 1);
    });
    const consultandoAtual = etapaSelecionada === etapaAtual;
    alvo.querySelector('#hu03-detalhe-modo').textContent = consultandoAtual
      ? 'DETALHES DA ETAPA ATUAL'
      : 'CONSULTA DA ETAPA · ' + situacaoEtapa(etapaSelecionada).toUpperCase();
    alvo.querySelector('#hu03-titulo').textContent = etapa.titulo;
    alvo.querySelector('#hu03-descricao').textContent = etapa.descricao;
  }

  botoes.forEach((botao) =>
    botao.addEventListener('click', () => selecionar(Number(botao.dataset.etapa))));
  selecionar(etapaAtual);
}

carregarComEstados(alvo, {
  carregar: async () => validar(await buscarAcompanhamentoHU03()),
  mostrar,
  textoVazio: 'Não há informações de adesão para o cenário solicitado.'
});
