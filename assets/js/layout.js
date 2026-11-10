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
  seta: 'M9 6l6 6-6 6',
  casa: 'M3 11l9-7 9 7M5 9.5V20h5v-6h4v6h5V9.5',
  etapas: 'M9 6h11M9 12h11M9 18h11M4 5.5l1 1 2-2M4 11.5l1 1 2-2M4.5 18h.01',
  calculadora: 'M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1M8 7h8v3H8zM8.5 14h.01M12 14h.01M15.5 14h.01M8.5 17.5h.01M12 17.5h.01M15.5 17.5h.01',
  conferir: 'M9 3h6v3H9zM7 4.5H5.5A1.5 1.5 0 0 0 4 6v13.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H17M8.5 13.5l2.5 2.5 4.5-5',
  conversa: 'M4 5h16v11H9l-5 4zM8 9.5h8M8 12.5h5',
  fechar: 'M6 6l12 12M18 6L6 18'
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
    const foraDaCaixa = (evento) => {
      const caixa = dialogo.getBoundingClientRect();
      return evento.clientX < caixa.left || evento.clientX > caixa.right ||
        evento.clientY < caixa.top || evento.clientY > caixa.bottom;
    };
    // Clicar ou tocar no fundo escuro, ou em [data-fechar], fecha o diálogo.
    // O fundo (::backdrop) pertence ao próprio <dialog>, por isso o alvo é ele.
    dialogo.addEventListener('click', (evento) => {
      if ((evento.target === dialogo && foraDaCaixa(evento)) || evento.target.closest('[data-fechar]')) {
        fecharDialogo();
      }
    });
    // No menu, arrastar para cima também fecha.
    let inicioToque = null;
    dialogo.addEventListener('touchstart', (evento) => {
      const toque = evento.touches[0];
      inicioToque = { x: toque.clientX, y: toque.clientY };
    }, { passive: true });
    dialogo.addEventListener('touchend', (evento) => {
      if (!inicioToque || !dialogo.classList.contains('dialogo--menu')) {
        return;
      }
      const toque = evento.changedTouches[0];
      const dx = toque.clientX - inicioToque.x;
      const dy = toque.clientY - inicioToque.y;
      inicioToque = null;
      if (dy < -60 && Math.abs(dy) > Math.abs(dx)) {
        fecharDialogo();
      }
    });
    // Esc também passa pela animação de saída do menu.
    dialogo.addEventListener('cancel', (evento) => {
      if (dialogo.classList.contains('dialogo--menu')) {
        evento.preventDefault();
        fecharDialogo();
      }
    });
  }
  return dialogo;
}

// Fecha o diálogo; o menu sobe antes de fechar.
function fecharDialogo() {
  if (!dialogo?.open) {
    return;
  }
  const animar = dialogo.classList.contains('dialogo--menu') &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!animar) {
    dialogo.close();
    return;
  }
  dialogo.classList.add('saindo');
  setTimeout(() => {
    dialogo.classList.remove('saindo');
    dialogo.close();
  }, 180);
}

// titulo: texto simples. conteudoHTML: HTML já escapado pela página.
export function abrirDialogo(titulo, conteudoHTML) {
  const caixa = pegarDialogo();
  caixa.classList.remove('dialogo--menu');
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

// Menu hambúrguer: desce do topo, com itens agrupados, ícones e a página atual destacada.
function abrirMenu() {
  const raiz = document.body.dataset.raiz || './';
  const consultas = consultasDoMenu(window.location.search, window.location.pathname);
  const busca = escaparHTML(consultas.comum);
  const buscaAssistente = escaparHTML(consultas.assistente);
  const buscaConferencia = escaparHTML(consultas.conferencia);
  const grupos = [
    ['Sua conta', [
      ['casa', 'index.html', busca, 'Início', 'Faturas e acompanhamento da economia'],
      ['sol', 'pages/acompanhamento.html', busca, 'A caminho da economia', 'Etapas e previsão do primeiro benefício'],
      ['etapas', 'pages/adesao.html', '', 'Acompanhar adesão', 'Etapas da contratação']
    ]],
    ['Economia', [
      ['calculadora', 'pages/simulacao-economia.html', busca, 'Simular economia', 'Projeção ilustrativa antes da contratação'],
      ['conferir', 'pages/calculo-economia.html', buscaConferencia, 'Conferir economia', 'Confira períodos e bases, sem cálculo oficial']
    ]],
    ['Ajuda', [
      ['conversa', 'pages/assistente.html', buscaAssistente, 'Assistente virtual', 'Explicações e dúvidas sobre a cobrança']
    ]]
  ];
  const paginaAtual = window.location.pathname.split('/').pop() || 'index.html';
  const htmlGrupos = grupos.map(([titulo, itens]) => `
      <p class="menu-grupo">${titulo}</p>
      <ul class="dialogo-menu">${itens.map(([nomeIcone, caminho, consulta, nome, descricao]) => {
        const atual = caminho.endsWith(paginaAtual);
        return `
        <li><a href="${raiz}${caminho}${consulta}"${atual ? ' aria-current="page"' : ''}>
          <span class="menu-texto">${nome}<small>${descricao}</small></span>
          <span class="menu-icone">${icone(nomeIcone)}</span>
          ${icone('seta', 'menu-seta')}
        </a></li>`;
      }).join('')}
      </ul>`).join('');

  const caixa = pegarDialogo();
  caixa.classList.add('dialogo--menu');
  caixa.innerHTML = `
    <div class="menu-topo">
      <button class="bulbe-icon-btn" type="button" data-fechar aria-label="Fechar menu">${icone('fechar')}</button>
      <img class="bulbe-logo" src="${raiz}assets/img/logo-clara.png" alt="Bulbe">
      <h2 id="dialogo-titulo" class="sr-only">Menu</h2>
    </div>
    <nav class="menu-corpo" aria-label="Menu">${htmlGrupos}</nav>`;
  if (!caixa.open) {
    caixa.showModal();
  }
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
