import { buscarFAQHU01, buscarAcompanhamentoHU02 } from './api.js';
import { iniciarLayout, carregarComEstados, escaparHTML as e, formatarMoeda, formatarReferencia, formatarData, temNumero, abrirSuporte } from './layout.js';

const params = new URLSearchParams(location.search);
const cenario = params.get('cenario');
const id = params.get('id');
const origemFatura = params.get('origem') === 'fatura';
const alvo = document.querySelector('#conteudo-hu01');
const form = document.querySelector('#pergunta-form');
const input = document.querySelector('#pergunta-input');
let faq;

function url(pagina, extras = {}) {
  const busca = new URLSearchParams();
  if (cenario) busca.set('cenario', cenario);
  if (id) busca.set('id', id);
  Object.entries(extras).forEach(([k,v]) => busca.set(k,v));
  return pagina + (busca.size ? '?' + busca : '');
}
const home = url('../index.html');
const faturaURL = url('fatura.html');
const retorno = origemFatura ? faturaURL : home;
iniciarLayout();
document.querySelector('#voltar-hu01').href = document.body.dataset.hu01 === 'fatura' ? home : retorno;

function obterFatura(dados) {
  if (!id || !dados || !Array.isArray(dados.faturas)) return null;
  return dados.faturas.find(f => String(f.id) === id) || null;
}
function validarFAQ(dados) {
  if (!dados || !Array.isArray(dados.perguntas)) throw new Error('FAQ inválida');
  if (!dados.perguntas.length) return null;
  const items = [...dados.perguntas, dados.semResposta];
  if (items.some(p => !p || typeof p.pergunta !== 'string' || typeof p.resposta !== 'string' || typeof p.acao !== 'string' || !['fatura','suporte','acompanhamento'].includes(p.destino))) throw new Error('Resposta inválida');
  if (typeof dados.aviso !== 'string' || dados.perguntas.some(p => typeof p.id !== 'string')) throw new Error('FAQ incompleta');
  return dados;
}
function mostrarResposta(resposta, pergunta = resposta.pergunta) {
  alvo.innerHTML = `<div class="hu01-mensagem hu01-minha">${e(pergunta)}</div><div class="hu01-mensagem"><p>${e(resposta.resposta)}</p></div><div class="hu01-acoes"><button class="bulbe-button" id="destino-resposta">${e(resposta.acao)}</button><button class="bulbe-button bulbe-button--secundario" id="outra-pergunta">Fazer outra pergunta</button></div><p class="legenda hu01-aviso">${e(faq.aviso)}</p>`;
  document.querySelector('#destino-resposta').addEventListener('click', () => {
    if (resposta.destino === 'suporte') abrirSuporte(pergunta);
    else if (resposta.destino === 'acompanhamento') location.href = url('acompanhamento.html');
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
  document.querySelector('#contexto-hu01').textContent = origemFatura ? 'Assistente virtual · dúvida sobre a fatura selecionada' : 'Assistente virtual · ajuda e dúvidas';
  if (origemFatura) {
    // Só apresenta referência/valor se a fatura existir no cenário solicitado.
    try {
      const fatura = obterFatura(await buscarAcompanhamentoHU02(cenario));
      document.querySelector('#contexto-hu01').textContent = fatura ? `Assistente virtual · ${formatarReferencia(fatura.referencia)} · ${temNumero(fatura.valor) ? formatarMoeda(fatura.valor) : 'Valor indisponível'}` : 'Fatura não localizada. As respostas abaixo são gerais e não confirmam sua cobrança.';
    } catch {
      document.querySelector('#contexto-hu01').textContent = 'Não foi possível consultar a fatura. As respostas abaixo são gerais; volte à fatura para tentar novamente.';
    }
  }
  carregarComEstados(alvo, {
    carregar: async () => validarFAQ(await buscarFAQHU01()),
    textoVazio: 'Nenhuma resposta cadastrada. Use o suporte humano no cabeçalho.',
    mostrar: dados => { faq = dados; mostrarPerguntas(); form.hidden = false; }
  });
  form.addEventListener('submit', evento => {
    evento.preventDefault(); const pergunta = input.value.trim();
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
    carregar: async () => obterFatura(await buscarAcompanhamentoHU02(cenario)),
    textoVazio: 'Fatura não localizada neste cenário. Volte ao início para escolher uma fatura disponível.',
    mostrar: f => {
      alvo.innerHTML = `<article class="bulbe-card"><h2>${e(formatarReferencia(f.referencia))}</h2><p class="hu01-fatura-total">${temNumero(f.valor) ? e(formatarMoeda(f.valor)) : 'Valor indisponível'}</p><dl class="dados-lista"><div><dt>Vencimento</dt><dd>${f.vencimento ? e(formatarData(f.vencimento)) : 'Não informado'}</dd></div><div><dt>Situação</dt><dd>${e(({em_aberto:'Em aberto',paga:'Paga',vencida:'Vencida'})[f.situacao] || 'Indisponível')}</dd></div></dl><p class="legenda">${e(f.observacao || 'Sem observação disponível.')}</p></article><article class="hu01-convite hu01-convite--claro"><span class="legenda">ASSISTENTE VIRTUAL</span><h2>Não entendeu esse valor?</h2><p>Pergunte sobre a fatura selecionada, sem perder o contexto.</p><a class="bulbe-button" href="${e(url('assistente.html',{origem:'fatura'}))}">Perguntar sobre esta fatura</a></article><h2 class="titulo-secao">Componentes da cobrança</h2><p>O detalhamento dos componentes ainda está indisponível. Não há dados suficientes para explicar a soma dos itens ou confirmar cobrança duplicada.</p><p class="aviso-ficticio">Dados fictícios de demonstração. Esta tela não realiza nem confirma pagamentos.</p><a class="link" href="${e(home + '#faturas')}">Voltar à lista de faturas</a>`;
    }
  });
}
if (document.body.dataset.hu01 === 'fatura') iniciarFatura(); else iniciarAssistente();
