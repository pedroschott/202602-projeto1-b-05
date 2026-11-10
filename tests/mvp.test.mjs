import test from 'node:test';
import assert from 'node:assert/strict';
import { lerContextoAssistente, montarRetornoAssistente, validarEntrada, podeCalcularEconomia } from '../assets/js/hu05.js';
import { calcularSimulacao, validarContasSimulacao } from '../assets/js/hu05-simulacao.js';

test('retorno mantém a fatura; contexto ambíguo usa a home', () => {
  const contexto = lerContextoAssistente('?origem=assistente&origemAssistente=fatura&cenario=aguardando-creditos&id=202');
  assert.equal(montarRetornoAssistente(contexto), 'assistente.html?cenario=aguardando-creditos&id=202&origem=fatura');
  assert.equal(montarRetornoAssistente(lerContextoAssistente('?origem=assistente&origemAssistente=fatura&id=201&id=202')), '../index.html');
});

test('conferência valida períodos e nunca inventa economia oficial', () => {
  const dados = {
    anterior: { valor: 100, inicio: '2026-09-01', fim: '2026-09-30', base: 'total' },
    atual: { valor: 85, inicio: '2026-10-01', fim: '2026-10-30', base: 'total' }
  };
  assert.equal(validarEntrada(dados).valido, true);
  dados.atual.inicio = '2026-09-30';
  assert.equal(validarEntrada(dados).valido, false);
  assert.equal(podeCalcularEconomia({ regrasCalculoConfirmadas: true, metodologiaConfirmada: true, basesComparaveisConfirmadas: true }), false);
});

test('simulador aplica a premissa acadêmica apenas a três meses válidos', () => {
  const contas = ['2026-08', '2026-09', '2026-10'].map(periodo => ({ periodo, valor: 100 }));
  const resultado = calcularSimulacao(contas, { tipo: 'simulacao_academica', percentualMaximo: 15 });
  assert.equal(resultado.economia, 15);
  assert.equal(resultado.projetado, 85);
  contas[1].periodo = contas[0].periodo;
  assert.notEqual(validarContasSimulacao(contas), '');
});

test('HU05 usa a leitura compartilhada e rejeita HTTP/JSON inválidos', async () => {
  const { buscarConfiguracaoHU05 } = await import('../assets/js/hu05.js');
  let chamada;
  const dados = await buscarConfiguracaoHU05(async (url, opcoes) => {
    chamada = { url, opcoes };
    return { ok: true, json: async () => ({ tipo: 'conferencia_economia' }) };
  });
  assert.equal(dados.tipo, 'conferencia_economia');
  assert.match(chamada.url.pathname, /\/data\/hu05-economia\.json$/);
  assert.deepEqual(chamada.opcoes, { cache: 'no-store' });
  await assert.rejects(buscarConfiguracaoHU05(async () => ({ ok: false, status: 503 })), /503/);
  await assert.rejects(buscarConfiguracaoHU05(async () => ({ ok: true, json: async () => ({ tipo: 'outro' }) })), /inválido/);
});

test('runtime mantém fetch centralizado, fonte local e navegação sem atalhos vazios', async () => {
  const { readFile, readdir } = await import('node:fs/promises');
  const raiz = new URL('../', import.meta.url);
  for (const nome of await readdir(new URL('assets/js/', raiz))) {
    const codigo = await readFile(new URL('assets/js/' + nome, raiz), 'utf8');
    if (nome !== 'api.js') assert.doesNotMatch(codigo, /(?:fetch|fetcher)\s*\(\s*new URL/);
    assert.doesNotMatch(codigo, /from\s+['"](?:react|vue|@angular)/);
  }
  const css = await readFile(new URL('assets/css/style.css', raiz), 'utf8');
  assert.doesNotMatch(css, /fonts\.googleapis\.com/);
  assert.match(css, /poppins-400\.woff2/);
  for (const arquivo of ['index.html', ... (await readdir(new URL('pages/', raiz))).filter(n => n.endsWith('.html')).map(n => 'pages/' + n)]) {
    const html = await readFile(new URL(arquivo, raiz), 'utf8');
    assert.doesNotMatch(html, /data-pendente="(?:Consumo|Indicações)"/);
    assert.doesNotMatch(html, /BulbeLayout\.tsx|node_modules/);
  }
});
