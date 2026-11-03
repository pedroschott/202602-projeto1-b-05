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
  if (!dados.etapas.every((etapa) => obrigatorios.every((campo) => typeof etapa[campo] === 'string'))) {
    throw new Error('Etapas HU03 incompletas.');
  }
  const chave = cenario || dados.cenarioPadrao;
  const estado = dados.cenarios && Object.hasOwn(dados.cenarios, chave) ? dados.cenarios[chave] : null;
  if (!estado) return null;
  if (!Number.isInteger(estado.etapaAtual) || estado.etapaAtual < 0 || estado.etapaAtual >= dados.etapas.length) {
    throw new Error('Etapa atual inválida.');
  }
  return { etapas: dados.etapas, estado };
}

function mostrar({ etapas, estado }) {
  const atual = estado.etapaAtual;
  const etapasHTML = etapas.map((etapa, i) => (
    '<button type="button" class="hu03-step" data-etapa="' + i + '" aria-pressed="false">' +
      '<span class="hu03-circle">' + (i + 1) + '</span>' +
      '<span>' + escaparHTML(etapa.nome) + '</span>' +
    '</button>'
  )).join('');

  alvo.innerHTML =
    '<section class="hu03-card" aria-labelledby="titulo-jornada">' +
      '<div class="hu03-head"><div><p class="hu03-overline">ANDAMENTO DO PROCESSO</p>' +
      '<h2 id="titulo-jornada">Sua jornada</h2></div><span class="hu03-pill">Protótipo</span></div>' +
      '<div class="hu03-steps" role="group" aria-label="Etapas ilustrativas da adesão">' +
        '<div class="hu03-track" aria-hidden="true"><div id="hu03-fill" class="hu03-fill"></div></div>' +
        etapasHTML +
      '</div><p class="hu03-hint">Selecione uma etapa para ver detalhes. O progresso real está indicado em verde.</p>' +
    '</section>' +
    '<section class="hu03-status" aria-live="polite">' +
      '<div class="hu03-status-icon" aria-hidden="true">↻</div><div>' +
        '<p class="hu03-overline">DETALHES DA ETAPA · EXEMPLO</p><h2 id="hu03-titulo"></h2>' +
        '<p id="hu03-descricao"></p>' +
      '</div></section>' +
    '<section class="hu03-card hu03-next"><div class="hu03-next-icon" aria-hidden="true">→</div><div>' +
      '<p class="hu03-overline">O QUE VEM DEPOIS</p><h2 id="hu03-proxima"></h2>' +
      '<p id="hu03-orientacao"></p><div id="hu03-acao"></div>' +
    '</div></section>' +
    '<section class="hu03-update"><strong>◷ Última atualização</strong><p id="hu03-update-texto"></p></section>' +
    '<aside class="hu03-note">ⓘ Demonstração acadêmica com dados fictícios. O fluxo e as atualizações devem ser confirmados com a Bulbe.</aside>';

  const botoes = [...alvo.querySelectorAll('[data-etapa]')];
  const preenchimento = alvo.querySelector('#hu03-fill');
  preenchimento.style.width = (atual / (etapas.length - 1) * 100) + '%';

  function selecionar(indice) {
    const etapa = etapas[indice];
    botoes.forEach((botao, i) => {
      botao.classList.toggle('is-done', i < atual);
      botao.classList.toggle('is-active', i === indice);
      botao.setAttribute('aria-pressed', String(i === indice));
      botao.querySelector('.hu03-circle').textContent = i < atual ? '✓' : String(i + 1);
    });
    alvo.querySelector('#hu03-titulo').textContent = etapa.titulo;
    alvo.querySelector('#hu03-descricao').textContent = etapa.descricao;
    alvo.querySelector('#hu03-proxima').textContent = 'Próxima etapa: ' + etapa.proxima;
    alvo.querySelector('#hu03-orientacao').textContent = etapa.orientacao;
    alvo.querySelector('#hu03-update-texto').textContent = estado.ultimaAtualizacao || 'Atualização demonstrativa';
    const acao = alvo.querySelector('#hu03-acao');
    acao.replaceChildren();
    if (indice === 4 && atual === 4) {
      const link = document.createElement('a');
      link.className = 'hu03-next-action';
      link.href = '../index.html';
      link.textContent = 'Consultar faturas';
      acao.appendChild(link);
    }
  }
  botoes.forEach((botao) => botao.addEventListener('click', () => selecionar(Number(botao.dataset.etapa))));
  selecionar(atual);
}

carregarComEstados(alvo, {
  carregar: async () => validar(await buscarAcompanhamentoHU03()),
  mostrar,
  textoVazio: 'Não há informações de adesão para o cenário solicitado.'
});
