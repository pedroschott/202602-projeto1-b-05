import { buscarSimulacaoEconomiaHU05 } from './api.js';
import { iniciarLayout, formatarMoeda } from './layout.js';

const form = document.querySelector('#hu05-form');
const feedback = document.querySelector('#hu05-feedback');
const etapas = [...document.querySelectorAll('.hu05-step')];
const marcadores = [...document.querySelectorAll('[data-step-label]')];
let regras = null;
let resultado = null;

function mostrarEtapa(numero) {
  etapas.forEach((etapa, indice) => {
    etapa.hidden = indice !== numero - 1;
  });
  marcadores.forEach((marcador, indice) => {
    marcador.classList.toggle('is-active', indice === numero - 1);
    marcador.classList.toggle('is-done', indice < numero - 1);
    if (indice === numero - 1) marcador.setAttribute('aria-current', 'step');
    else marcador.removeAttribute('aria-current');
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
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

function validarContas(contas) {
  if (!form.reportValidity()) return false;
  if (contas.some((conta) => !Number.isFinite(conta.valor) || conta.valor <= 0)) {
    mostrarErro('Informe valores maiores que zero para as três contas.');
    return false;
  }

  const periodos = contas.map((conta) => conta.periodo);
  if (new Set(periodos).size !== 3) {
    mostrarErro('Selecione três períodos de consumo diferentes.');
    return false;
  }

  const meses = periodos.map((periodo) => {
    const [ano, mes] = periodo.split('-').map(Number);
    return ano * 12 + mes;
  });
  if (!(meses[1] === meses[0] + 1 && meses[2] === meses[1] + 1)) {
    mostrarErro('Informe os três meses consecutivos mais recentes, em ordem do mais antigo para o mais recente.');
    return false;
  }
  return true;
}

function calcular(contas) {
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

function preencherResultado() {
  const moeda = formatarMoeda;
  document.querySelector('#hu05-saving').textContent = moeda(resultado.economia);
  document.querySelector('#hu05-percent').textContent = `Até ${resultado.percentual}% de redução estimada`;
  document.querySelector('#hu05-average').textContent = moeda(resultado.media);
  document.querySelector('#hu05-projected').textContent = moeda(resultado.projetado);
  document.querySelector('#hu05-detail-average').textContent = moeda(resultado.media);
  document.querySelector('#hu05-detail-projected').textContent = moeda(resultado.projetado);
  document.querySelector('#hu05-detail-base').textContent = moeda(resultado.media);
  document.querySelector('#hu05-detail-rate').textContent = `Até ${resultado.percentual}%`;
  document.querySelector('#hu05-detail-saving').textContent = moeda(resultado.economia);
  document.querySelector('#hu05-detail-total').textContent = moeda(resultado.projetado);
}

async function iniciar() {
  iniciarLayout();
  try {
    regras = await buscarEconomiaHU05();
    if (!Number.isFinite(regras.percentualMaximo) || regras.percentualMaximo < 0 || regras.percentualMaximo > 15) {
      throw new Error('Premissa de percentual inválida.');
    }
  } catch (erro) {
    mostrarErro('Não foi possível carregar as premissas da simulação. Atualize a página e tente novamente.');
    form.querySelector('button[type="submit"]').disabled = true;
    return;
  }

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    limparErro();
    const contas = lerContas();
    if (!validarContas(contas)) return;
    resultado = calcular(contas);
    preencherResultado();
    mostrarEtapa(2);
  });

  form.addEventListener('input', limparErro);
  document.querySelector('#hu05-details').addEventListener('click', () => mostrarEtapa(3));
  document.querySelector('#hu05-restart').addEventListener('click', () => {
    form.reset();
    resultado = null;
    limparErro();
    mostrarEtapa(1);
  });
  document.querySelector('#hu05-back').addEventListener('click', () => mostrarEtapa(2));
  document.querySelector('#hu05-contract').addEventListener('click', () => {
    window.location.href = 'https://bulbeenergia.com.br/';
  });
}

iniciar();