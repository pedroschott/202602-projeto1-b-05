import { buscarEconomiaHU05 } from './api.js';
import { iniciarLayout, formatarMoeda, formatarData } from './layout.js';

const form = document.querySelector('#hu05-form');
const feedback = document.querySelector('#hu05-feedback');
const etapas = [...document.querySelectorAll('.hu05-step')];
const marcadores = [...document.querySelectorAll('[data-step-label]')];
const resumo = document.querySelector('#hu05-resumo');
const bloqueio = document.querySelector('#hu05-bloqueio');
const detalhe = document.querySelector('#hu05-detalhe');
let regras = null;
let dados = null;

function mostrarEtapa(numero) {
  etapas.forEach((etapa, indice) => { etapa.hidden = indice !== numero - 1; });
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

function lerDados() {
  const campos = (prefixo) => ({
    valor: Number(form.elements[`${prefixo}Valor`].value),
    inicio: form.elements[`${prefixo}Inicio`].value,
    fim: form.elements[`${prefixo}Fim`].value,
    base: form.elements[`${prefixo}Base`].value
  });
  return { anterior: campos('anterior'), atual: campos('atual') };
}

function diasDoPeriodo(inicio, fim) {
  const a = new Date(`${inicio}T00:00:00Z`);
  const b = new Date(`${fim}T00:00:00Z`);
  return Math.round((b - a) / 86400000) + 1;
}

function validar(d) {
  if (!form.reportValidity()) return false;
  for (const [nome, conta] of Object.entries(d)) {
    if (!Number.isFinite(conta.valor) || conta.valor <= 0) {
      mostrarErro(`Informe um valor maior que zero para a fatura ${nome === 'anterior' ? 'anterior' : 'atual'}.`);
      return false;
    }
    if (!conta.inicio || !conta.fim || conta.inicio > conta.fim) {
      mostrarErro('Confira as datas inicial e final de cada período de consumo.');
      return false;
    }
  }
  if (d.anterior.base !== d.atual.base) {
    mostrarErro('Escolha a mesma base de comparação nas duas faturas.');
    return false;
  }
  if (diasDoPeriodo(d.anterior.inicio, d.anterior.fim) !== diasDoPeriodo(d.atual.inicio, d.atual.fim)) {
    mostrarErro('Os períodos informados têm durações diferentes. Confira as datas antes de continuar.');
    return false;
  }
  return true;
}

function descreverBase(base) {
  return base === 'total' ? 'Valor total da fatura' : 'Componente de energia informado';
}

function preencherComparacao() {
  const anterior = dados.anterior;
  const atual = dados.atual;
  resumo.innerHTML = `
    <div class="hu05-comparison-row">
      <div><span>Fatura anterior à Bulbe</span><strong>${formatarMoeda(anterior.valor)}</strong><small>${formatarData(anterior.inicio)} a ${formatarData(anterior.fim)}</small></div>
      <div><span>Primeira fatura após a Bulbe</span><strong>${formatarMoeda(atual.valor)}</strong><small>${formatarData(atual.inicio)} a ${formatarData(atual.fim)}</small></div>
    </div>
    <p><strong>Base informada:</strong> ${descreverBase(anterior.base)}</p>
    <p><strong>Duração:</strong> ${diasDoPeriodo(anterior.inicio, anterior.fim)} dias em cada período</p>
  `;
  const comparavel = regras.basesComparaveisConfirmadas === true &&
    regras.regrasCalculoConfirmadas === true &&
    regras.metodologiaConfirmada === true;
  bloqueio.hidden = comparavel;
  if (!comparavel) {
    bloqueio.textContent = regras.mensagemSemCalculo ||
      'Ainda não é possível calcular uma economia confiável: a metodologia e os critérios oficiais de comparação não foram confirmados pela Bulbe. Os valores e períodos informados são exibidos apenas para conferência.';
  } else {
    bloqueio.textContent = 'Os dados foram registrados para conferência. A implementação da fórmula oficial ainda depende da especificação aprovada pela Bulbe; nenhum valor de economia será inferido automaticamente.';
  }
  detalhe.textContent = 'A comparação só poderá apresentar economia quando a Bulbe confirmar quais componentes devem ser comparados, como os períodos devem ser normalizados e qual fórmula deve ser aplicada.';
}

async function carregarRegras() {
  const botao = form.querySelector('button[type="submit"]');
  botao.disabled = true;
  try {
    regras = await buscarEconomiaHU05();
    if (!regras || regras.tipo !== 'conferencia_economia') throw new Error('Configuração HU05 inválida.');
    botao.disabled = false;
  } catch (erro) {
    mostrarErro('Não foi possível carregar as regras da HU05. Verifique a conexão e tente novamente.');
    const tentar = document.querySelector('#hu05-tentar');
    tentar.hidden = false;
  }
}

async function iniciar() {
  iniciarLayout();
  document.querySelector('#hu05-tentar').addEventListener('click', async () => {
    limparErro();
    await carregarRegras();
  });
  await carregarRegras();

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    limparErro();
    const entrada = lerDados();
    if (!validar(entrada)) return;
    dados = entrada;
    preencherComparacao();
    mostrarEtapa(2);
  });
  form.addEventListener('input', limparErro);
  form.addEventListener('change', limparErro);
  document.querySelector('#hu05-details').addEventListener('click', () => mostrarEtapa(3));
  document.querySelector('#hu05-edit').addEventListener('click', () => mostrarEtapa(1));
  document.querySelector('#hu05-back').addEventListener('click', () => mostrarEtapa(2));
  document.querySelector('#hu05-restart').addEventListener('click', () => {
    form.reset();
    dados = null;
    resumo.replaceChildren();
    limparErro();
    mostrarEtapa(1);
  });
}

iniciar();
