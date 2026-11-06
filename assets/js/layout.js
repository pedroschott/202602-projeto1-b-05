// JavaScript comum do squad: menu, suporte, abas pendentes, diálogos,
// estados de carregamento e formatação. Cada página importa o que precisar:
//   import { iniciarLayout, carregarComEstados } from '../assets/js/layout.js';
//
// O <body> de cada página informa o caminho até a raiz do projeto em
// data-raiz ("./" no index.html e "../" nas páginas de pages/).

let dialogo = null;

// Ícones de linha usados em mais de uma história (mesmo traço do cabeçalho).
// Sempre decorativos: o estado também aparece em texto ao lado.
const CAMINHOS_ICONES = {
  check: 'M5 12.5l4.5 4.5L19 7.5',
  relogio: 'M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18',
  sol: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  pergunta: 'M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4.5M12 17.5v.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18',
  seta: 'M9 6l6 6-6 6'
};

export function icone(nome, classe = '') {
  return `<svg class="bulbe-icon ${classe}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${CAMINHOS_ICONES[nome]}"/></svg>`;
}

// Escapa texto antes de colocar dentro de innerHTML.
export function escaparHTML(texto) {
  return String(texto)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// Cria (uma única vez) o <dialog> usado por todas as janelas da página.
function pegarDialogo() {
  if (!dialogo) {
    dialogo = document.createElement('dialog');
    dialogo.className = 'dialogo';
    dialogo.setAttribute('aria-labelledby', 'dialogo-titulo');
    document.body.appendChild(dialogo);
    dialogo.addEventListener('click', (evento) => {
      // clicar no fundo escuro (fora da caixa) ou em [data-fechar] fecha o diálogo
      const caixa = dialogo.getBoundingClientRect();
      const foraDaCaixa = evento.target === dialogo && (
        evento.clientX < caixa.left || evento.clientX > caixa.right ||
        evento.clientY < caixa.top || evento.clientY > caixa.bottom);
      if (foraDaCaixa || evento.target.closest('[data-fechar]')) {
        dialogo.close();
      }
    });
  }
  return dialogo;
}

// titulo: texto simples. conteudoHTML: HTML já escapado pela página.
export function abrirDialogo(titulo, conteudoHTML) {
  const caixa = pegarDialogo();
  caixa.innerHTML = `
    <h2 id="dialogo-titulo">${escaparHTML(titulo)}</h2>
    ${conteudoHTML}
    <button class="bulbe-button bulbe-button--secundario" type="button" data-fechar>Fechar</button>
  `;
  if (!caixa.open) {
    caixa.showModal();
  }
  return caixa;
}

// O menu usa o mesmo contexto da rota, sem carregar marcadores da HU05 para a home.
export function consultasDoMenu(search = '', pathname = '') {
  const original = new URLSearchParams(search);
  const comum = new URLSearchParams(original);
  comum.delete('origem');
  comum.delete('origemAssistente');
  const assistente = new URLSearchParams(original);
  if (original.get('origem') === 'assistente'
      && ['fatura', 'home'].includes(original.get('origemAssistente'))) {
    assistente.set('origem', original.get('origemAssistente'));
  } else if (pathname.endsWith('/fatura.html')) {
    assistente.set('origem', 'fatura');
  }
  assistente.delete('origemAssistente');
  const conferencia = new URLSearchParams(original);
  if (pathname.endsWith('/assistente.html') || pathname.endsWith('/fatura.html')) {
    conferencia.set('origemAssistente', pathname.endsWith('/fatura.html')
      || original.get('origem') === 'fatura' ? 'fatura' : 'home');
    conferencia.set('origem', 'assistente');
  }
  const busca = params => params.size ? '?' + params.toString() : '';
  return { comum: busca(comum), assistente: busca(assistente), conferencia: busca(conferencia) };
}

function abrirMenu() {
  const raiz = document.body.dataset.raiz || './';
  const consultas = consultasDoMenu(window.location.search, window.location.pathname);
  const busca = escaparHTML(consultas.comum);
  const buscaAssistente = escaparHTML(consultas.assistente);
  const buscaConferencia = escaparHTML(consultas.conferencia);
  abrirDialogo('Menu', `
    <ul class="dialogo-menu">
      <li><a href="${raiz}index.html${busca}">Início<small>Faturas e acompanhamento da economia</small></a></li>
      <li><a href="${raiz}pages/acompanhamento.html${busca}">A caminho da economia<small>Etapas e previsão do primeiro benefício</small></a></li>
      <li><a href="${raiz}pages/simulacao-economia.html${busca}">Simular economia<small>Projeção ilustrativa antes da contratação</small></a></li>
      <li><a href="${raiz}pages/calculo-economia.html${buscaConferencia}">Conferir economia<small>Confira períodos e bases, sem cálculo oficial</small></a></li>
      <li><a href="${raiz}pages/adesao.html">Acompanhar adesão<small>Etapas da contratação</small></a></li>
      <li><a href="${raiz}pages/login.html">Acesso demonstrativo<small>Entrada visual, sem autenticação real</small></a></li>
      <li><a href="${raiz}pages/boas-vindas.html">Conheça a Bulbe<small>Apresentação do serviço</small></a></li>
      <li><a href="${raiz}pages/assistente.html${buscaAssistente}">Assistente virtual<small>Explicações e dúvidas sobre a cobrança</small></a></li>
    </ul>
  `);
}

export function abrirSuporte(assunto) {
  const extra = assunto ? `<p><strong>Assunto:</strong> ${escaparHTML(assunto)}</p>` : '';
  abrirDialogo('Suporte humano', `
    ${extra}
    <p>O atendimento por pessoa ainda não está integrado a este protótipo.</p>
    <p>Para dúvidas reais sobre contrato, créditos ou cobrança, use os canais oficiais da Bulbe:
      <a href="https://bulbeenergia.com.br/duvidas/" target="_blank" rel="noopener">bulbeenergia.com.br/duvidas</a>.</p>
    <p class="aviso-ficticio">Nenhuma mensagem é enviada a partir desta tela.</p>
  `);
}

// Abas ou atalhos que ainda não têm tela: avisa com honestidade em vez de ficar sem ação.
export function avisarPendente(nome) {
  abrirDialogo(nome, `
    <p>Esta parte ainda não foi implementada pelo squad.</p>
    <p class="aviso-ficticio">Recurso indisponível neste protótipo.</p>
  `);
}

// Liga os botões comuns do cabeçalho e da navegação.
//   data-acao="menu"       abre o menu
//   data-acao="suporte"    abre o suporte humano (data-assunto opcional)
//   data-pendente="Nome"   avisa que a tela ainda não existe
export function iniciarLayout() {
  document.addEventListener('click', (evento) => {
    const botao = evento.target.closest('[data-acao], [data-pendente]');
    if (!botao) {
      return;
    }
    if (botao.dataset.pendente) {
      avisarPendente(botao.dataset.pendente);
    } else if (botao.dataset.acao === 'menu') {
      abrirMenu();
    } else if (botao.dataset.acao === 'suporte') {
      abrirSuporte(botao.dataset.assunto);
    }
  });
}

// Mostra "carregando", chama a função que busca os dados e depois:
//   - sem dados (null, undefined ou lista vazia): mensagem de vazio;
//   - com erro: mensagem de falha e botão "Tentar novamente";
//   - com dados: chama mostrar(dados).
export async function carregarComEstados(alvo, opcoes) {
  const { carregar, mostrar, textoVazio = 'Nenhuma informação disponível.' } = opcoes;

  alvo.setAttribute('aria-busy', 'true');
  alvo.innerHTML = '<div class="estado carregando" role="status">Carregando informações...</div>';

  try {
    const dados = await carregar();
    alvo.removeAttribute('aria-busy');
    const vazio = dados === null || dados === undefined || (Array.isArray(dados) && dados.length === 0);
    if (vazio) {
      alvo.innerHTML = `<div class="estado" role="status"><strong>Nada por aqui ainda</strong>${escaparHTML(textoVazio)}</div>`;
      return;
    }
    mostrar(dados);
  } catch (erro) {
    console.error(erro);
    alvo.removeAttribute('aria-busy');
    alvo.innerHTML = `
      <div class="estado estado--falha" role="alert">
        <strong>Não foi possível carregar as informações.</strong>
        Verifique a conexão e tente de novo. Nada foi alterado na sua conta.
        <br><button class="bulbe-button" type="button" data-tentar>Tentar novamente</button>
      </div>`;
    alvo.querySelector('[data-tentar]').addEventListener('click', () => carregarComEstados(alvo, opcoes));
  }
}

// ---------- Formatação (pt-BR) ----------

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export function temNumero(valor) {
  return typeof valor === 'number' && Number.isFinite(valor);
}

export function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// "2026-11-06" -> "06/11/2026" (sem usar Date, para não mudar o dia pelo fuso horário)
export function formatarData(textoISO) {
  const [ano, mes, dia] = textoISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

// "2026-10" -> "Outubro/26"
export function formatarReferencia(textoAnoMes) {
  if (typeof textoAnoMes !== 'string' || !/^\d{4}-(0[1-9]|1[0-2])$/.test(textoAnoMes)) {
    return 'Referência indisponível';
  }
  const [ano, mes] = textoAnoMes.split('-');
  return `${MESES[Number(mes) - 1]}/${ano.slice(2)}`;
}
