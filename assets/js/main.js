// Home (index.html): card da HU02 + segunda fatura + histórico.
// Os dados vêm de data/hu02-acompanhamento.json (fictícios).

import { buscarAcompanhamentoHU02 } from './api.js';
import {
  iniciarLayout, carregarComEstados, abrirDialogo, escaparHTML,
  formatarMoeda, formatarData, formatarReferencia, temNumero
} from './layout.js';
import { cenarioDaURL, htmlCardEspera } from './hu02.js';

const SITUACOES_FATURA = {
  em_aberto: 'Em aberto',
  paga: 'Paga',
  vencida: 'Vencida'
};

const AVISO_FICTICIO = '<p class="aviso-ficticio">Dados fictícios de demonstração. Nenhum pagamento real é feito ou confirmado por esta tela.</p>';

let faturasCarregadas = [];

function textoSituacao(fatura) {
  return SITUACOES_FATURA[fatura.situacao] ?? 'Situação indisponível';
}

function textoValor(fatura) {
  return temNumero(fatura.valor) ? formatarMoeda(fatura.valor) : 'Valor indisponível';
}

function textoVencimento(fatura) {
  return fatura.vencimento ? formatarData(fatura.vencimento) : 'não informado';
}

function podePagar(fatura) {
  return fatura.situacao === 'em_aberto' || fatura.situacao === 'vencida';
}

function htmlFaturaDestaque(fatura) {
  const valor = temNumero(fatura.valor)
    ? `R$ <strong>${formatarMoeda(fatura.valor).replace('R$', '').trim()}</strong>`
    : 'Valor indisponível';
  const observacao = fatura.observacao ? `<p class="fatura-obs">${escaparHTML(fatura.observacao)}</p>` : '';

  let botaoPix = '';
  if (podePagar(fatura)) {
    botaoPix = fatura.pixCopiaECola
      ? `<button class="bulbe-button" type="button" data-pix="${fatura.id}">Pagar com Pix</button>`
      : '<span class="legenda">Código Pix indisponível</span>';
  }

  return `
    <article class="fatura-destaque" aria-labelledby="fatura-${fatura.id}">
      <div class="fatura-topo">
        <h3 id="fatura-${fatura.id}">${formatarReferencia(fatura.referencia)}</h3>
        <span class="situacao situacao--${escaparHTML(fatura.situacao)}">${textoSituacao(fatura)}</span>
      </div>
      <p>Vence dia <strong>${textoVencimento(fatura)}</strong></p>
      <p>Valor desta fatura</p>
      <p class="fatura-valor">${valor}</p>
      ${observacao}
      <div class="fatura-acoes">
        ${botaoPix}
        <button class="link" type="button" data-detalhes="${fatura.id}">Ver detalhes</button>
      </div>
    </article>`;
}

function htmlHistorico(faturas) {
  if (faturas.length === 0) {
    return '<p class="legenda">Nenhuma fatura anterior.</p>';
  }
  const itens = faturas.map((fatura) => `
    <li>
      <span><strong>${formatarReferencia(fatura.referencia)}</strong><br>
        <span class="legenda">${textoSituacao(fatura)} · ${textoValor(fatura)}</span></span>
      <button class="link" type="button" data-detalhes="${fatura.id}">Detalhes</button>
    </li>`).join('');
  return `<ul class="historico">${itens}</ul>`;
}

function htmlFaturas(faturas) {
  if (!faturas || faturas.length === 0) {
    return '<div class="estado"><strong>Nenhuma fatura disponível ainda</strong>Quando a primeira fatura for emitida, ela aparece aqui.</div>';
  }
  // destaque: a fatura em aberto mais recente (a lista vem da mais nova para a mais antiga)
  const destaque = faturas.find(podePagar) ?? faturas[0];
  const anteriores = faturas.filter((fatura) => fatura !== destaque);
  return `
    ${htmlFaturaDestaque(destaque)}
    <h2 class="titulo-secao">Histórico de faturas</h2>
    ${htmlHistorico(anteriores)}`;
}

function mostrarDetalhes(fatura) {
  const observacao = fatura.observacao ? `<p>${escaparHTML(fatura.observacao)}</p>` : '';
  abrirDialogo(`Fatura de ${formatarReferencia(fatura.referencia)}`, `
    <dl class="dados-lista">
      <div><dt>Situação</dt><dd>${textoSituacao(fatura)}</dd></div>
      <div><dt>Valor</dt><dd>${textoValor(fatura)}</dd></div>
      <div><dt>Vencimento</dt><dd>${textoVencimento(fatura)}</dd></div>
    </dl>
    ${observacao}
    <p>A explicação completa do que compõe a cobrança é a HU04, ainda pendente.</p>
    ${AVISO_FICTICIO}
  `);
}

function mostrarPix(fatura) {
  const caixa = abrirDialogo('Pagar com Pix', `
    <p>Valor: <strong>${textoValor(fatura)}</strong> · vence ${textoVencimento(fatura)}</p>
    <p>Código Pix copia e cola:</p>
    <code class="codigo-pix">${escaparHTML(fatura.pixCopiaECola)}</code>
    <button class="bulbe-button" type="button" data-copiar>Copiar código</button>
    <p class="legenda" data-resultado-copia role="status"></p>
    <p>Copiar o código não confirma o pagamento. A situação da fatura só muda depois que o pagamento é conciliado, e pagar não antecipa a compensação dos créditos.</p>
    ${AVISO_FICTICIO}
  `);
  caixa.querySelector('[data-copiar]').addEventListener('click', async () => {
    const resultado = caixa.querySelector('[data-resultado-copia]');
    try {
      await navigator.clipboard.writeText(fatura.pixCopiaECola);
      resultado.textContent = 'Código copiado.';
    } catch (erro) {
      resultado.textContent = 'Não foi possível copiar automaticamente. Selecione o código acima.';
    }
  });
}

function mostrarHome(acomp) {
  document.querySelector('#instalacao').textContent = acomp.instalacao || 'Não informada';
  faturasCarregadas = acomp.faturas || [];

  const linkDetalhe = `pages/acompanhamento.html${window.location.search}`;
  document.querySelector('#conteudo-home').innerHTML = `
    ${htmlCardEspera(acomp, linkDetalhe)}
    <h2 class="titulo-secao" id="faturas" tabindex="-1">Faturas</h2>
    ${htmlFaturas(faturasCarregadas)}`;

  if (window.location.hash === '#faturas') {
    document.querySelector('#faturas').focus();
  }
}

function iniciarHome() {
  iniciarLayout();

  // Pix e detalhes usam a lista carregada (os botões só existem depois do fetch).
  document.querySelector('#conteudo-home').addEventListener('click', (evento) => {
    const botao = evento.target.closest('[data-pix], [data-detalhes]');
    if (!botao) {
      return;
    }
    const id = Number(botao.dataset.pix ?? botao.dataset.detalhes);
    const fatura = faturasCarregadas.find((item) => item.id === id);
    if (!fatura) {
      return;
    }
    if (botao.dataset.pix) {
      mostrarPix(fatura);
    } else {
      mostrarDetalhes(fatura);
    }
  });

  carregarComEstados(document.querySelector('#conteudo-home'), {
    carregar: () => buscarAcompanhamentoHU02(cenarioDaURL()),
    mostrar: mostrarHome,
    textoVazio: 'Não encontramos acompanhamento para esta instalação.'
  });
}

iniciarHome();
