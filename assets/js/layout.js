// JavaScript comum do squad: menu, suporte, abas pendentes, diálogos,
// estados de carregamento e formatação. Cada página importa o que precisar:
//   import { iniciarLayout, carregarComEstados } from '../assets/js/layout.js';
//
// O <body> de cada página informa o caminho até a raiz do projeto em
// data-raiz ("./" no index.html e "../" nas páginas de pages/).

let dialogo = null;

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

function abrirMenu() {
  const raiz = document.body.dataset.raiz || './';
  const busca = escaparHTML(window.location.search); // mantém ?cenario= da demonstração
  abrirDialogo('Menu', `
    <ul class="dialogo-menu">
      <li><a href="${raiz}index.html${busca}">Início<small>Faturas e acompanhamento da economia</small></a></li>
      <li><a href="${raiz}pages/acompanhamento.html${busca}">A caminho da economia<small>Etapas e previsão do primeiro benefício</small></a></li>
      <li><a href="${raiz}docs/wireframes/Telas%20Prontas/hu03.html">Acompanhar adesão<small>Etapas da contratação</small></a></li>
      <li><a href="${raiz}pages/modelo.html">Modelo de página<small>Template para os colegas copiarem</small></a></li>
    </ul>
    <p class="aviso-ficticio">Protótipo acadêmico com dados fictícios. Login, perfil e configurações não fazem parte desta entrega.</p>
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
  const [ano, mes] = textoAnoMes.split('-');
  return `${MESES[Number(mes) - 1]}/${ano.slice(2)}`;
}
