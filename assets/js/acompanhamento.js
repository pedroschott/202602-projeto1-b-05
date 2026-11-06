// Página "A caminho da economia" (pages/acompanhamento.html) — HU02.

import { buscarAcompanhamentoHU02 } from './api.js';
import { iniciarLayout, carregarComEstados, abrirDialogo, escaparHTML, formatarMoeda, icone } from './layout.js';
import {
  cenarioDaURL, descontoFoiLancado, calcularSimulacao,
  textoDescontoLancado, htmlLinhaDoTempo
} from './hu02.js';

const busca = window.location.search; // mantém ?cenario= da demonstração

function htmlBeneficioEstimado(simulacao) {
  if (!simulacao) {
    return `
      <div class="beneficio">
        ${icone('sol', 'icone-sol')}
        <p class="legenda">Benefício estimado</p>
        <p>Ainda não temos dados suficientes para estimar a sua economia.</p>
      </div>`;
  }
  return `
    <div class="beneficio">
      ${icone('sol', 'icone-sol')}
      <p class="legenda">Benefício estimado</p>
      <p class="valor-grande"><strong>${formatarMoeda(simulacao.porCiclo)}</strong> / ciclo</p>
      <p class="legenda">após a compensação dos créditos</p>
    </div>`;
}

// Simulação: a pessoa arrasta para ver o total em quantos ciclos quiser.
// A conta é sempre a mesma (valor por ciclo × ciclos) e continua sendo estimativa.
function htmlSimulacao(simulacao, titulo, interativa) {
  if (!simulacao) {
    return '';
  }
  const total = interativa ? `
      <label for="ciclos">Ciclos com créditos <output id="ciclos-valor" for="ciclos">${simulacao.ciclos}</output></label>
      <input id="ciclos" type="range" min="1" max="12" step="1" value="${simulacao.ciclos}">
      <p class="simulador-total">${titulo}<strong id="ciclos-total">${formatarMoeda(simulacao.total)}</strong></p>`
    : `<p class="simulador-total">${titulo}<strong>${formatarMoeda(simulacao.total)}</strong>em ${simulacao.ciclos} ciclos</p>`;
  return `
    <div class="simulador-ciclos">${total}</div>
    <details class="bulbe-detalhes">
      <summary>${icone('seta')} Como calculamos</summary>
      <p>${formatarMoeda(simulacao.energiaCompensavel)} de energia compensável × ${simulacao.percentualDesconto}% = ${formatarMoeda(simulacao.porCiclo)} por ciclo.</p>
      <p>Valores fictícios. Consumo, tarifas e contrato podem mudar o resultado; não é garantia.</p>
    </details>`;
}

function ligarSimulador(simulacao) {
  const faixa = document.querySelector('#ciclos');
  if (!faixa) {
    return;
  }
  faixa.addEventListener('input', () => {
    const ciclos = Number(faixa.value);
    document.querySelector('#ciclos-valor').textContent = ciclos;
    document.querySelector('#ciclos-total').textContent = formatarMoeda(simulacao.porCiclo * ciclos);
  });
}

function htmlDescontoLancado(acomp) {
  const { valor, fatura } = textoDescontoLancado(acomp);
  return `
    <div class="caixa-realizado">
      <p class="legenda">Desconto lançado</p>
      <strong>${valor}</strong>${fatura}
      <p class="legenda">Este é o valor aplicado na fatura, não uma estimativa.</p>
    </div>`;
}

function mostrarAcompanhamento(acomp) {
  const simulacao = calcularSimulacao(acomp.simulacao);
  const lancado = descontoFoiLancado(acomp);

  document.querySelector('#titulo-pagina').textContent = lancado ? 'Seu desconto começou' : 'A caminho da economia';

  const topo = lancado ? htmlDescontoLancado(acomp) : htmlBeneficioEstimado(simulacao);
  const tituloSimulacao = lancado ? 'Estimativa da simulação (não é o valor lançado)' : 'Economia estimada no período';

  document.querySelector('#conteudo-acompanhamento').innerHTML = `
    ${topo}
    ${htmlLinhaDoTempo(acomp)}
    ${htmlSimulacao(simulacao, tituloSimulacao, !lancado)}
    <div class="acoes-detalhe">
      <a class="bulbe-button bulbe-button--largo" href="../index.html${escaparHTML(busca)}#faturas">Ver minhas faturas</a>
      <button class="link" type="button" id="duvidas-espera">Tenho dúvidas sobre a espera</button>
    </div>`;

  ligarSimulador(simulacao);

  document.querySelector('#duvidas-espera').addEventListener('click', () => {
    abrirDialogo('Dúvidas sobre a espera', `
      <p>Os créditos de energia são compensados pela operação. A etapa só muda quando isso acontece de fato.</p>
      <p>Pagar a fatura não antecipa a compensação dos créditos, e aguardar os créditos não é motivo para deixar de pagar. Se achar que há cobrança em duplicidade, fale com o suporte antes de pagar de novo.</p>
      <button class="bulbe-button" type="button" data-acao="suporte" data-assunto="Dúvidas sobre a espera">Falar com o suporte</button>
    `);
  });
}

function iniciarAcompanhamento() {
  iniciarLayout();
  document.querySelector('#voltar').href = `../index.html${busca}`;

  carregarComEstados(document.querySelector('#conteudo-acompanhamento'), {
    carregar: () => buscarAcompanhamentoHU02(cenarioDaURL()),
    mostrar: mostrarAcompanhamento,
    textoVazio: 'Não encontramos acompanhamento para esta instalação.'
  });
}

iniciarAcompanhamento();
