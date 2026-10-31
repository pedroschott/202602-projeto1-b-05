// Regras da HU02 (Pedro Schott): etapas da espera, previsão, simulação e
// desconto lançado. Usado pela home (index.html) e por pages/acompanhamento.html.
//
// Princípios dos critérios de aceite:
// - a etapa vem dos dados (campo "situacao"); nunca avança por tempo ou pagamento;
// - estimativa e desconto lançado aparecem separados e com nomes diferentes;
// - sem dados suficientes, não inventa valor nem previsão.

import { escaparHTML, formatarMoeda, formatarReferencia, temNumero } from './layout.js';

const NOMES_ETAPAS = ['Adesão', 'Créditos', 'Primeiro desconto'];

// Quantas etapas já foram concluídas em cada situação dos dados.
const CONCLUIDAS_POR_SITUACAO = {
  adesao_em_andamento: 0,
  aguardando_creditos: 1,
  desconto_lancado: 3
};

export function cenarioDaURL() {
  return new URLSearchParams(window.location.search).get('cenario');
}

export function descontoFoiLancado(acomp) {
  return acomp.situacao === 'desconto_lancado';
}

// Devolve as três etapas com estado "concluida", "atual" ou "pendente",
// ou null se a situação não for conhecida (aí não mostramos progresso).
export function montarEtapas(acomp) {
  const concluidas = CONCLUIDAS_POR_SITUACAO[acomp.situacao];
  if (concluidas === undefined) {
    return null;
  }
  return NOMES_ETAPAS.map((nome, indice) => {
    let estado = 'pendente';
    if (indice < concluidas) {
      estado = 'concluida';
    } else if (indice === concluidas) {
      estado = 'atual';
    }
    return { nome, estado };
  });
}

export function numeroEtapaAtual(etapas) {
  const indice = etapas.findIndex((etapa) => etapa.estado === 'atual');
  return indice === -1 ? etapas.length : indice + 1;
}

// Só mostra previsão confirmada pela operação.
export function textoPrevisao(acomp) {
  const previsao = acomp.previsaoPrimeiroDesconto;
  if (previsao && previsao.confirmada === true && previsao.referencia) {
    return `Previsão confirmada: fatura de ${formatarReferencia(previsao.referencia)}`;
  }
  return 'Previsão ainda não confirmada';
}

// Simulação: energia compensável × percentual = valor por ciclo; × ciclos = total.
// Retorna null se faltar qualquer número (não inventamos valores).
export function calcularSimulacao(simulacao) {
  if (!simulacao) {
    return null;
  }
  const { energiaCompensavel, percentualDesconto, ciclos } = simulacao;
  if (!temNumero(energiaCompensavel) || !temNumero(percentualDesconto) || !temNumero(ciclos)) {
    return null;
  }
  const porCiclo = energiaCompensavel * percentualDesconto / 100;
  return {
    energiaCompensavel,
    percentualDesconto,
    ciclos,
    porCiclo,
    total: porCiclo * ciclos
  };
}

export function textoDescontoLancado(acomp) {
  const desconto = acomp.descontoLancado || {};
  const valor = temNumero(desconto.valor) ? formatarMoeda(desconto.valor) : 'Valor indisponível';
  const fatura = desconto.referencia ? ` na fatura de ${formatarReferencia(desconto.referencia)}` : '';
  return { valor, fatura };
}

const SIMBOLOS = { concluida: '✓', atual: '◷', pendente: '' };
const TEXTO_ESTADO = { concluida: 'concluída', atual: 'etapa atual', pendente: 'ainda não começou' };

function htmlBarras(etapas) {
  const itens = etapas.map((etapa) => `
      <li class="${etapa.estado}">
        <span aria-hidden="true">${SIMBOLOS[etapa.estado]}</span> ${etapa.nome}
        <span class="sr-only">(${TEXTO_ESTADO[etapa.estado]})</span>
      </li>`).join('');
  return `<ol class="barras">${itens}</ol>`;
}

function htmlPendencia(acomp) {
  if (!acomp.pendenciaCliente) {
    return '';
  }
  return `<p class="pendencia"><strong>Ação necessária:</strong> ${escaparHTML(acomp.pendenciaCliente)}</p>`;
}

// Card compacto da home.
export function htmlCardEspera(acomp, linkDetalhe) {
  const etapas = montarEtapas(acomp);
  const link = escaparHTML(linkDetalhe);

  if (!etapas) {
    return `
      <section class="card-espera" aria-labelledby="titulo-espera">
        <div class="card-espera-topo"><h2 id="titulo-espera">Acompanhamento da economia</h2></div>
        <p class="legenda">Não conseguimos identificar a etapa atual. Nenhum progresso é exibido até essa informação chegar.</p>
        <div class="card-espera-rodape">
          <button class="link" type="button" data-acao="suporte" data-assunto="Etapa da economia indisponível">Falar com o suporte</button>
        </div>
      </section>`;
  }

  if (descontoFoiLancado(acomp)) {
    const { valor, fatura } = textoDescontoLancado(acomp);
    return `
      <section class="card-espera" aria-labelledby="titulo-espera">
        <div class="card-espera-topo">
          <h2 id="titulo-espera"><span aria-hidden="true">☀</span> Seu primeiro desconto foi lançado</h2>
          <span class="selo-etapa">Concluído</span>
        </div>
        <p class="valor-estimado valor-realizado"><strong>${valor}</strong> de desconto${fatura}</p>
        ${htmlBarras(etapas)}
        <div class="card-espera-rodape">
          <span>Valor lançado, não é estimativa</span>
          <a href="${link}">Ver detalhes ›</a>
        </div>
      </section>`;
  }

  const simulacao = calcularSimulacao(acomp.simulacao);
  const valor = simulacao
    ? `<p class="valor-estimado"><strong>${formatarMoeda(simulacao.porCiclo)}</strong> / ciclo estimado*</p>`
    : '<p class="valor-estimado">Estimativa indisponível: faltam dados para calcular.</p>';

  return `
    <section class="card-espera" aria-labelledby="titulo-espera">
      <div class="card-espera-topo">
        <h2 id="titulo-espera"><span aria-hidden="true">☀</span> Sua economia está a caminho</h2>
        <span class="selo-etapa">Etapa ${numeroEtapaAtual(etapas)} de ${etapas.length}</span>
      </div>
      ${valor}
      ${htmlBarras(etapas)}
      ${htmlPendencia(acomp)}
      <div class="card-espera-rodape">
        <span>${textoPrevisao(acomp)}</span>
        <a href="${link}">Acompanhar ›</a>
      </div>
    </section>`;
}

// Textos de cada marco na linha do tempo da página de acompanhamento.
function detalheMarco(indice, estado, acomp) {
  if (indice === 0) {
    if (estado === 'concluida') {
      return { titulo: 'Adesão concluída', texto: 'Você já faz parte da Bulbe' };
    }
    return {
      titulo: 'Adesão em andamento',
      texto: acomp.pendenciaCliente ? `Ação necessária: ${acomp.pendenciaCliente}` : 'Nenhuma ação sua é necessária agora'
    };
  }
  if (indice === 1) {
    if (estado === 'concluida') {
      return { titulo: 'Créditos compensados', texto: 'Os créditos de energia chegaram à sua conta' };
    }
    if (estado === 'atual') {
      return { titulo: 'Aguardando créditos', texto: textoPrevisao(acomp) };
    }
    return { titulo: 'Créditos', texto: 'Começa depois da adesão' };
  }
  if (estado === 'concluida') {
    const { valor, fatura } = textoDescontoLancado(acomp);
    return { titulo: 'Primeiro desconto lançado', texto: `${valor}${fatura}` };
  }
  return { titulo: 'Primeiro desconto', texto: 'Aparece após a compensação dos créditos' };
}

export function htmlLinhaDoTempo(acomp) {
  const etapas = montarEtapas(acomp);
  if (!etapas) {
    return '<p class="estado">Etapa atual indisponível. Nenhum progresso é exibido até essa informação chegar.</p>';
  }
  const itens = etapas.map((etapa, indice) => {
    const marco = etapa.estado === 'concluida' ? '✓' : (etapa.estado === 'atual' ? '◷' : indice + 1);
    const { titulo, texto } = detalheMarco(indice, etapa.estado, acomp);
    return `
      <li class="${etapa.estado}">
        <span class="marco" aria-hidden="true">${marco}</span>
        <div>
          <h3>${escaparHTML(titulo)} <span class="sr-only">(${TEXTO_ESTADO[etapa.estado]})</span></h3>
          <p>${escaparHTML(texto)}</p>
        </div>
      </li>`;
  }).join('');
  return `<ol class="linha-tempo" aria-label="Etapas até o primeiro desconto">${itens}</ol>`;
}
