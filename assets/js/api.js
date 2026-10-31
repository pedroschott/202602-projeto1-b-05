// Funções de acesso aos dados. Toda leitura de JSON passa por aqui.
// Importante: fetch só funciona com o projeto aberto por um servidor (Live Server),
// e não abrindo o arquivo direto no navegador (file://).

const BASE = new URL('../../data/', import.meta.url);

async function lerJSON(arquivo) {
  const resposta = await fetch(new URL(arquivo, BASE));
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
