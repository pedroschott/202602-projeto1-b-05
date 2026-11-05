import { buscarFAQHU01, buscarAcompanhamentoHU02 } from './api.js';
import { iniciarLayout, carregarComEstados, escaparHTML as e, formatarMoeda, formatarReferencia, formatarData, temNumero, abrirSuporte } from './layout.js';

// O contexto usa a mesma lista de cenários e o mesmo formato de id aceitos pela HU05.
// Parâmetros ambíguos ou inválidos não podem apontar para outra fatura por engano.
const CENARIOS_VALIDOS = new Set([
  'aguardando-creditos', 'previsao-confirmada', 'pendencia-cliente',
  'dados-incompletos', 'desconto-lancado'
]);
const DESTINOS_VALIDOS = new Set(['fatura', 'suporte', 'acompanhamento', 'conferencia']);

export function lerContextoHU01(search = '') {
  const params = new URLSearchParams(search);
  const cenario = params.get('cenario');
  const id = params.get('id');
  const origem = params.get('origem');
  const ambiguo = ['cenario', 'id', 'origem'].some(chave => params.getAll(chave).length > 1);
  const valido = !ambiguo
    && (!params.has('cenario') || CENARIOS_VALIDOS.has(cenario))
    && (!params.has('id') || /^[1-9]\d{0,8}$/.test(id))
    && (!params.has('origem') || ['fatura', 'home'].includes(origem))
    && (origem !== 'fatura' || Boolean(id));
  return {
    cenario: valido ? cenario : null,
    id: valido ? id : null,
    origemFatura: valido && origem === 'fatura',
    valido
  };
}

export function montarNavegacaoHU01(search = '') {
  const contexto = lerContextoHU01(search);
  function url(pagina, extras = {}) {
    const busca = new URLSearchParams();
    if (contexto.cenario) busca.set('cenario', contexto.cenario);
    if (contexto.id) busca.set('id', contexto.id);
    Object.entries(extras).forEach(([chave, valor]) => busca.set(chave, valor));
    return pagina + (busca.size ? '?' + busca : '');
  }
  const home = url('../index.html');
  const fatura = url('fatura.html');
  return {
    contexto,
    home,
    fatura,
    retorno: contexto.origemFatura ? fatura : home,
    assistenteFatura: url('assistente.html', { origem: contexto.id ? 'fatura' : 'home' }),
    acompanhamento: url('acompanhamento.html'),
    conferencia: url('calculo-economia.html', {
      origem: 'assistente',
      origemAssistente: contexto.origemFatura ? 'fatura' : 'home'
    })
  };
}

export function obterFaturaHU01(dados, contexto) {
  if (!contexto.valido || !contexto.id || !dados || !Array.isArray(dados.faturas)) return null;
  return dados.faturas.find(f => String(f.id) === contexto.id) || null;
}

export function validarFAQHU01(dados) {
  if (!dados || !Array.isArray(dados.perguntas)) throw new Error('FAQ inválida');
  if (!dados.perguntas.length) return null;
  const items = [...dados.perguntas, dados.semResposta];
  if (items.some(p => !p || typeof p.pergunta !== 'string' || typeof p.resposta !== 'string' || typeof p.acao !== 'string' || !DESTINOS_VALIDOS.has(p.destino))) throw new Error('Resposta inválida');
  if (typeof dados.aviso !== 'string' || dados.perguntas.some(p => typeof p.id !== 'string')) throw new Error('FAQ incompleta');
  return dados;
}

function iniciarHU01() {
  const navegacao = montarNavegacaoHU01(location.search);
  const { contexto, home, fatura: faturaURL, retorno } = navegacao;
  const { cenario, id, origemFatura } = contexto;
  const alvo = document.querySelector('#conteudo-hu01');
  const form = document.querySelector('#pergunta-form');
  const input = document.querySelector('#pergunta-input');
  let faq;
  iniciarLayout();
  document.querySelector('#voltar-hu01').href = document.body.dataset.hu01 === 'fatura' ? home : retorno;

  function mostrarResposta(resposta, pergunta = resposta.pergunta) {
    alvo.innerHTML = `<div class="hu01-mensagem hu01-minha">${e(pergunta)}</div><div class="hu01-mensagem"><p>${e(resposta.resposta)}</p></div><div class="hu01-acoes"><button class="bulbe-button" id="destino-resposta">${e(resposta.acao)}</button><button class="bulbe-button bulbe-button--secundario" id="outra-pergunta">Fazer outra pergunta</button></div><p class="legenda hu01-aviso">${e(faq.aviso)}</p>`;
    document.querySelector('#destino-resposta').addEventListener('click', () => {
      if (resposta.destino === 'suporte') abrirSuporte(pergunta);
      else if (resposta.destino === 'conferencia') location.href = navegacao.conferencia;
      else if (resposta.destino === 'acompanhamento') location.href = navegacao.acompanhamento;
      else if (id) location.href = faturaURL;
      else location.href = home + '#faturas';
    });
    document.querySelector('#outra-pergunta').addEventListener('click', mostrarPerguntas);
  }
  function mostrarPerguntas() {
    alvo.innerHTML = '<div class="hu01-mensagem"><strong>Olá!</strong><p>Escolha uma dúvida para começarmos. Você não precisa digitar.</p></div><div class="hu01-perguntas" aria-label="Perguntas sugeridas"></div>';
    const lista = alvo.querySelector('.hu01-perguntas');
    faq.perguntas.forEach(pergunta => {
      const botao = document.createElement('button');
      botao.type = 'button'; botao.textContent = pergunta.pergunta;
      botao.addEventListener('click', () => mostrarResposta(pergunta));
      lista.appendChild(botao);
    });
    const aviso = document.createElement('p'); aviso.className = 'legenda hu01-aviso'; aviso.textContent = faq.aviso; alvo.appendChild(aviso);
  }
  async function iniciarAssistente() {
    const voltar = document.querySelector('#voltar-origem');
    voltar.href = retorno; voltar.textContent = origemFatura ? 'Voltar à fatura' : 'Voltar ao início';
    document.querySelector('#contexto-hu01').textContent = !contexto.valido
      ? 'O contexto informado é inválido. As respostas abaixo são gerais; volte ao início para escolher uma fatura.'
      : origemFatura ? 'Assistente virtual · dúvida sobre a fatura selecionada' : 'Assistente virtual · ajuda e dúvidas';
    if (origemFatura) {
      // Só apresenta referência/valor se a fatura existir no cenário solicitado.
      try {
        const fatura = obterFaturaHU01(await buscarAcompanhamentoHU02(cenario), contexto);
        document.querySelector('#contexto-hu01').textContent = fatura ? `Assistente virtual · ${formatarReferencia(fatura.referencia)} · ${temNumero(fatura.valor) ? formatarMoeda(fatura.valor) : 'Valor indisponível'}` : 'Fatura não localizada. As respostas abaixo são gerais e não confirmam sua cobrança.';
      } catch {
        document.querySelector('#contexto-hu01').textContent = 'Não foi possível consultar a fatura. As respostas abaixo são gerais; volte à fatura para tentar novamente.';
      }
    }
    carregarComEstados(alvo, {
      carregar: async () => validarFAQHU01(await buscarFAQHU01()),
      textoVazio: 'Nenhuma resposta cadastrada. Use o suporte humano no cabeçalho.',
      mostrar: dados => { faq = dados; mostrarPerguntas(); form.hidden = false; }
    });
    form.addEventListener('submit', evento => {
      evento.preventDefault();
      if (!faq) return; // Nenhuma resposta é enviada antes da leitura válida da FAQ.
      const pergunta = input.value.trim();
      if (!pergunta) { input.setCustomValidity('Escreva uma pergunta ou escolha uma das opções.'); input.reportValidity(); return; }
      // Texto livre só coincide com perguntas cadastradas. Não há modelo de IA.
      const normalizar = texto => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[?!.]/g,'').trim();
      const resposta = faq.perguntas.find(p => normalizar(p.pergunta) === normalizar(pergunta)) || faq.semResposta;
      mostrarResposta(resposta, pergunta); input.value = '';
    });
    input.addEventListener('input', () => input.setCustomValidity(''));
  }
  function iniciarFatura() {
    carregarComEstados(alvo, {
      carregar: async () => contexto.valido && id
        ? obterFaturaHU01(await buscarAcompanhamentoHU02(cenario), contexto) : null,
      textoVazio: 'Fatura não localizada neste cenário. Volte ao início para escolher uma fatura disponível.',
      mostrar: f => {
        alvo.innerHTML = `<article class="bulbe-card"><h2>${e(formatarReferencia(f.referencia))}</h2><p class="hu01-fatura-total">${temNumero(f.valor) ? e(formatarMoeda(f.valor)) : 'Valor indisponível'}</p><dl class="dados-lista"><div><dt>Vencimento</dt><dd>${f.vencimento ? e(formatarData(f.vencimento)) : 'Não informado'}</dd></div><div><dt>Situação</dt><dd>${e(({em_aberto:'Em aberto',paga:'Paga',vencida:'Vencida'})[f.situacao] || 'Indisponível')}</dd></div></dl><p class="legenda">${e(f.observacao || 'Sem observação disponível.')}</p></article><article class="hu01-convite hu01-convite--claro"><span class="legenda">ASSISTENTE VIRTUAL</span><h2>Não entendeu esse valor?</h2><p>Pergunte sobre a fatura selecionada, sem perder o contexto.</p><a class="bulbe-button" href="${e(navegacao.assistenteFatura)}">Perguntar sobre esta fatura</a></article><h2 class="titulo-secao">Componentes da cobrança</h2><p>O detalhamento dos componentes ainda está indisponível. Não há dados suficientes para explicar a soma dos itens ou confirmar cobrança duplicada.</p><p class="aviso-ficticio">Dados fictícios de demonstração. Esta tela não realiza nem confirma pagamentos.</p><a class="link" href="${e(home + '#faturas')}">Voltar à lista de faturas</a>`;
      }
    });
  }
  if (document.body.dataset.hu01 === 'fatura') iniciarFatura(); else iniciarAssistente();
}

if (typeof document !== 'undefined' && document.querySelector('#conteudo-hu01')) iniciarHU01();
