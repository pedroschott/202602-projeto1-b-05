// Página "A caminho da economia" (pages/acompanhamento.html) — HU02.

import { buscarAcompanhamentoHU02 } from './api.js';
import { iniciarLayout, carregarComEstados, abrirDialogo, escaparHTML, formatarMoeda } from './layout.js';
import {
  cenarioDaURL, descontoFoiLancado, calcularSimulacao,
  textoDescontoLancado, htmlLinhaDoTempo
} from './hu02.js';

const busca = window.location.search; // mantém ?cenario= da demonstração

function htmlBeneficioEstimado(simulacao) {
  if (!simulacao) {
    return `
      <div class="beneficio">
        <div class="icone-sol" aria-hidden="true">☀</div>
        <p class="legenda">Benefício estimado</p>
        <p>Ainda não temos dados suficientes para estimar a sua economia.</p>
      </div>`;
  }
  return `
    <div class="beneficio">
      <div class="icone-sol" aria-hidden="true">☀</div>
      <p class="legenda">Benefício estimado</p>
      <p class="valor-grande"><strong>${formatarMoeda(simulacao.porCiclo)}</strong> / ciclo</p>
      <p class="legenda">após a compensação dos créditos*</p>
    </div>`;
}

function htmlSimulacao(simulacao, titulo) {
  if (!simulacao) {
    return '';
  }
  return `
    <div class="caixa-simulacao">
      <p class="legenda">${titulo}</p>
      <strong>${formatarMoeda(simulacao.total)}</strong>
      <p class="legenda">em ${simulacao.ciclos} ciclos com créditos*</p>
    </div>
    <p class="legenda nota-simulacao">
      *Simulação: ${formatarMoeda(simulacao.energiaCompensavel)} de energia compensável ×
      ${simulacao.percentualDesconto}% = ${formatarMoeda(simulacao.porCiclo)} por ciclo;
      × ${simulacao.ciclos} ciclos com créditos = ${formatarMoeda(simulacao.total)}.
      A contagem começa na compensação, não na adesão, e não é um prazo para o benefício acabar.
      O percentual não vale sobre o total da conta. Consumo, tarifas, créditos e contrato
      podem alterar o resultado; não é garantia.
    </p>`;
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
  const tituloSimulacao = lancado ? 'Estimativa da simulação (não é o valor lançado)' : 'Estimativa total';

  document.querySelector('#conteudo-acompanhamento').innerHTML = `
    ${topo}
    ${htmlLinhaDoTempo(acomp)}
    ${htmlSimulacao(simulacao, tituloSimulacao)}
    <div class="acoes-detalhe">
      <a class="bulbe-button bulbe-button--largo" href="../index.html${escaparHTML(busca)}#faturas">Ver minhas faturas</a>
      <button class="link" type="button" id="duvidas-espera">Tenho dúvidas sobre a espera</button>
    </div>`;

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
