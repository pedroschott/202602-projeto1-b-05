import { buscarSimulacaoEconomiaHU05 } from './api.js';
import { iniciarLayout, formatarMoeda } from './layout.js';

// Estas premissas pertencem só ao simulador acadêmico, não à conferência HU05.
export function premissasSimulacaoValidas(dados) {
  return Boolean(dados && !Array.isArray(dados)
    && dados.tipo === 'simulacao_academica'
    && Number.isFinite(dados.percentualMaximo)
    && dados.percentualMaximo >= 0 && dados.percentualMaximo <= 15);
}

export async function carregarPremissasSimulacao(buscar = buscarSimulacaoEconomiaHU05) {
  const dados = await buscar();
  if (!premissasSimulacaoValidas(dados)) throw new Error('Premissas de simulação inválidas.');
  return dados;
}

// Retorna a mensagem de erro, ou uma string vazia quando as três contas são válidas.
export function validarContasSimulacao(contas) {
  if (!Array.isArray(contas) || contas.length !== 3 || contas.some((conta) => !conta
    || !Number.isFinite(conta.valor) || conta.valor < 0.01 || conta.valor > 1000000)) {
    return 'Informe valores entre R$ 0,01 e R$ 1.000.000,00 para as três contas.';
  }
  if (contas.some((conta) => Math.abs(conta.valor * 100 - Math.round(conta.valor * 100)) > 0.000001)) {
    return 'Use valores monetários com até duas casas decimais.';
  }

  const periodos = contas.map((conta) => conta.periodo);
  if (periodos.some((periodo) => typeof periodo !== 'string' || !/^\d{4,}-(0[1-9]|1[0-2])$/.test(periodo))) {
    return 'Informe o período de consumo das três contas.';
  }
  const meses = periodos.map((periodo) => {
    const [ano, mes] = periodo.split('-').map(Number);
    return ano > 0 ? ano * 12 + mes : NaN;
  });
  if (meses.some((mes) => !Number.isSafeInteger(mes))) {
    return 'Informe períodos de consumo válidos para as três contas.';
  }
  if (new Set(periodos).size !== 3) {
    return 'Selecione três períodos de consumo diferentes.';
  }
  if (!(meses[1] === meses[0] + 1 && meses[2] === meses[1] + 1)) {
    return 'Informe os três meses consecutivos mais recentes, em ordem do mais antigo para o mais recente.';
  }
  return '';
}

export function calcularSimulacao(contas, regras) {
  const erro = validarContasSimulacao(contas);
  if (erro) throw new Error(erro);
  if (!premissasSimulacaoValidas(regras)) throw new Error('Premissas de simulação inválidas.');
  const media = contas.reduce((soma, conta) => soma + conta.valor, 0) / contas.length;
  const percentual = regras.percentualMaximo / 100;
  const economia = media * percentual;
  return {
    contas,
    media,
    percentual: regras.percentualMaximo,
    economia,
    projetado: media - economia
  };
}

function iniciar() {
  const form = document.querySelector('#hu05-form');
  const feedback = document.querySelector('#hu05-feedback');
  const status = document.querySelector('#hu05-status');
  const submit = form.querySelector('button[type="submit"]');
  const retry = document.querySelector('#hu05-tentar');
  const content = document.querySelector('.hu05-content');
  const etapas = [...document.querySelectorAll('.hu05-step')];
  const marcadores = [...document.querySelectorAll('[data-step-label]')];
  let regras = null;
  let resultado = null;
  let carregando = false;
  let etapaAtual = 1;

  function mostrarEtapa(numero) {
    if (numero > 1 && !resultado) return;
    etapaAtual = numero;
    etapas.forEach((etapa, indice) => {
      etapa.hidden = indice !== numero - 1;
    });
    marcadores.forEach((marcador, indice) => {
      marcador.classList.toggle('is-active', indice === numero - 1);
      marcador.classList.toggle('is-done', indice < numero - 1);
      if (indice === numero - 1) marcador.setAttribute('aria-current', 'step');
      else marcador.removeAttribute('aria-current');
    });
    // O conteúdo rola dentro da moldura do app, não na janela.
    content.scrollTo({ top: 0, behavior: 'auto' });
    etapas[numero - 1].querySelector('.hu05-title').focus({ preventScroll: true });
  }

  function mostrarErro(mensagem) {
    feedback.textContent = mensagem;
    feedback.className = 'hu05-feedback hu05-feedback--erro';
  }

  function limparErro() {
    feedback.textContent = '';
    feedback.className = 'hu05-feedback';
  }

  function lerContas() {
    return [1, 2, 3].map((numero) => ({
      valor: Number(form.elements[`valor${numero}`].value),
      periodo: form.elements[`periodo${numero}`].value
    }));
  }

  function preencherResultado() {
    const valores = {
      '#hu05-saving': resultado?.economia,
      '#hu05-average': resultado?.media,
      '#hu05-projected': resultado?.projetado,
      '#hu05-detail-base': resultado?.media,
      '#hu05-detail-saving': resultado?.economia,
      '#hu05-detail-total': resultado?.projetado
    };
    Object.entries(valores).forEach(([seletor, valor]) => {
      document.querySelector(seletor).textContent = resultado ? formatarMoeda(valor) : '—';
    });
    document.querySelector('#hu05-percent').textContent = resultado ? `Até ${resultado.percentual}% de redução estimada` : '—';
    document.querySelector('#hu05-detail-rate').textContent = resultado ? `Até ${resultado.percentual}%` : '—';
  }

  async function carregarRegras() {
    if (carregando || regras) return;
    carregando = true;
    submit.disabled = true;
    submit.textContent = 'Carregando premissas…';
    retry.disabled = true;
    retry.hidden = true;
    form.setAttribute('aria-busy', 'true');
    status.className = 'hu05-status';
    status.textContent = 'Carregando as premissas da simulação acadêmica…';
    limparErro();
    try {
      regras = await carregarPremissasSimulacao();
      status.className = 'hu05-status hu05-status--ok';
      status.textContent = 'Premissas carregadas.';
      submit.disabled = false;
      limparErro();
    } catch (erro) {
      regras = null;
      status.className = 'hu05-status hu05-status--erro';
      status.textContent = 'Não foi possível carregar as premissas da simulação. Confira a conexão ou os dados e tente novamente. As contas preenchidas foram mantidas.';
      retry.hidden = false;
    } finally {
      carregando = false;
      form.setAttribute('aria-busy', 'false');
      submit.textContent = 'Calcular minha economia';
      retry.disabled = false;
    }
  }

  // Registre os bloqueios antes do fetch: Enter e submit programático também
  // precisam ser cancelados quando a resposta estiver lenta ou tiver falhado.
  form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    if (etapaAtual !== 1) return;
    if (carregando || !regras) {
      mostrarErro(carregando
        ? 'Aguarde o carregamento das premissas antes de calcular.'
        : 'Use “Tentar novamente” para carregar as premissas antes de calcular.');
      return;
    }
    limparErro();
    const contas = lerContas();
    const erro = validarContasSimulacao(contas);
    if (erro) {
      mostrarErro(erro);
      form.reportValidity();
      return;
    }
    if (!form.reportValidity()) return;
    resultado = calcularSimulacao(contas, regras);
    preencherResultado();
    mostrarEtapa(2);
  });

  form.addEventListener('input', limparErro);
  form.addEventListener('change', limparErro);
  retry.addEventListener('click', carregarRegras);
  document.querySelector('#hu05-details').addEventListener('click', () => {
    if (etapaAtual === 2 && resultado) mostrarEtapa(3);
  });
  document.querySelector('#hu05-restart').addEventListener('click', () => {
    if (etapaAtual !== 2 || !resultado) return;
    form.reset();
    resultado = null;
    preencherResultado();
    limparErro();
    mostrarEtapa(1);
  });
  document.querySelector('#hu05-back').addEventListener('click', () => {
    if (etapaAtual === 3 && resultado) mostrarEtapa(2);
  });
  document.querySelector('#hu05-contract').addEventListener('click', () => {
    if (etapaAtual === 3 && resultado) window.location.href = 'https://bulbeenergia.com.br/';
  });

  iniciarLayout();
  carregarRegras();
}

if (typeof document !== 'undefined' && document.querySelector('#hu05-form')) iniciar();
