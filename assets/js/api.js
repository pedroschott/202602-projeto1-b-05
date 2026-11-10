// Funções compartilhadas de acesso aos dados JSON.
// Importante: fetch só funciona com o projeto aberto por um servidor (Live Server),
// e não abrindo o arquivo direto no navegador (file://).

const BASE = new URL('../../data/', import.meta.url);

async function lerJSON(arquivo, fetcher = fetch, opcoes) {
  const resposta = await fetcher(new URL(arquivo, BASE), opcoes);
  if (!resposta.ok) {
    throw new Error(`Erro ao carregar ${arquivo}: ${resposta.status}`);
  }
  return resposta.json();
}

export function buscarClientes() {
  return lerJSON('clientes.json');
}

export function buscarFaturas() {
  return lerJSON('faturas.json');
}

export async function buscarFaturasDoCliente(clienteId) {
  const faturas = await buscarFaturas();
  return faturas.filter((fatura) => fatura.clienteId === clienteId);
}

// HU02: dados fictícios de acompanhamento da espera pelo benefício.
// O arquivo tem vários cenários de demonstração; a página escolhe um pelo
// endereço (ex.: index.html?cenario=desconto-lancado). Sem ?cenario=, usa o padrão.
// Retorna null quando o cenário pedido não existe (a página mostra estado vazio).
export async function buscarAcompanhamentoHU02(cenario) {
  const dados = await lerJSON('hu02-acompanhamento.json');
  const nome = cenario || dados.cenarioPadrao;
  return Object.hasOwn(dados.cenarios, nome) ? dados.cenarios[nome] : null;
}

// HU04: conteúdo fictício da apresentação inicial.
export function buscarBoasVindas() {
  return lerJSON('hu04-boas-vindas.json');
}

// HU01: FAQ predefinida, independente dos dados financeiros da HU02.
export function buscarFAQHU01() {
  return lerJSON('hu01-assistente.json');
}

// HU03: cenários fictícios do acompanhamento das cinco etapas de adesão.
export function buscarAcompanhamentoHU03() {
  return lerJSON('hu03-adesao.json');
}

// HU05: configuração da conferência restaurada, separada do simulador.
export function buscarEconomiaHU05(fetcher = fetch) {
  return lerJSON('hu05-economia.json', fetcher, { cache: 'no-store' });
}

// HU05: premissas ilustrativas para simulação antes da contratação.
export function buscarSimulacaoEconomiaHU05() {
  return lerJSON('hu05-simulacao.json');
}
