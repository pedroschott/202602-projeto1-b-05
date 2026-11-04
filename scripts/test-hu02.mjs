// Regressões da HU02. Executar com Node.js 22+: node --test scripts/test-hu02.mjs
// Usa somente módulos nativos. Os testes não alteram o JSON nem os arquivos do app.
// DOM/fetch simulados verificam a lógica; não substituem testes visuais no navegador.

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  calcularSimulacao, htmlCardEspera, htmlLinhaDoTempo, montarEtapas, textoPrevisao
} from '../assets/js/hu02.js';
import { carregarComEstados, formatarReferencia } from '../assets/js/layout.js';

const dados = JSON.parse(await readFile(new URL('../data/hu02-acompanhamento.json', import.meta.url)));
const espera = dados.cenarios['aguardando-creditos'];

test('formata as referências válidas sem mudar o resultado existente', () => {
  assert.equal(formatarReferencia('2026-01'), 'Janeiro/26');
  assert.equal(formatarReferencia('2026-10'), 'Outubro/26');
  assert.equal(formatarReferencia('2026-12'), 'Dezembro/26');
});

test('referências ausentes ou inválidas não lançam erro nem inventam mês', () => {
  for (const valor of [null, undefined, '', 202610, false, {}, '2026-00', '2026-13', '2026-1', '<b>2026-10</b>']) {
    assert.equal(formatarReferencia(valor), 'Referência indisponível');
  }
});

for (const [nome, acompanhamento] of Object.entries(dados.cenarios)) {
  test(`renderiza card e detalhe do cenário ${nome} sem alterar os dados`, () => {
    const antes = JSON.stringify(acompanhamento);
    assert.match(htmlCardEspera(acompanhamento, `pages/acompanhamento.html?cenario=${nome}`), /card-espera/);
    assert.match(htmlLinhaDoTempo(acompanhamento), /linha-tempo/);
    assert.equal(JSON.stringify(acompanhamento), antes);
  });
}

test('preserva cálculo, ausência de base e confirmação da previsão', () => {
  const simulacao = calcularSimulacao(espera.simulacao);
  assert.equal(simulacao.porCiclo, 45);
  assert.equal(simulacao.total, 270);
  assert.equal(calcularSimulacao(dados.cenarios['dados-incompletos'].simulacao), null);
  assert.equal(textoPrevisao(espera), 'Previsão ainda não confirmada');
  assert.match(textoPrevisao(dados.cenarios['previsao-confirmada']), /Previsão confirmada: fatura de Dezembro\/26/);
  assert.equal(textoPrevisao({ previsaoPrimeiroDesconto: { referencia: '2026-12', confirmada: false } }), 'Previsão ainda não confirmada');
});

test('desconto lançado continua separado da simulação e encerra a espera', () => {
  const acompanhamento = dados.cenarios['desconto-lancado'];
  const card = htmlCardEspera(acompanhamento, 'pages/acompanhamento.html');
  assert.match(card, /43,80/);
  assert.match(card, /Valor lançado, não é estimativa/);
  assert.doesNotMatch(card, /45,00/);
  assert.ok(montarEtapas(acompanhamento).every((etapa) => etapa.estado === 'concluida'));
});

test('mostra a pendência no card e no detalhe durante a espera por créditos', () => {
  const pendencia = 'Envie o documento solicitado pelo suporte.';
  const acompanhamento = { ...espera, pendenciaCliente: pendencia };
  const antes = JSON.stringify(acompanhamento);
  assert.ok(htmlCardEspera(acompanhamento, 'x').includes(pendencia));
  assert.ok(htmlLinhaDoTempo(acompanhamento).includes(pendencia));
  assert.equal(JSON.stringify(acompanhamento), antes);
});

test('pendência da adesão aparece uma vez, sem alegar que nenhuma ação é necessária', () => {
  const acompanhamento = dados.cenarios['pendencia-cliente'];
  const detalhe = htmlLinhaDoTempo(acompanhamento);
  assert.equal(detalhe.split(acompanhamento.pendenciaCliente).length - 1, 1);
  assert.doesNotMatch(detalhe, /Nenhuma ação sua é necessária/);
});

test('preserva ação informada mesmo sem uma etapa reconhecida, sem inventar progresso', () => {
  const pendencia = 'Confira o documento solicitado pelo suporte.';
  const acompanhamento = { ...espera, situacao: null, pendenciaCliente: pendencia };
  const card = htmlCardEspera(acompanhamento, 'x');
  const detalhe = htmlLinhaDoTempo(acompanhamento);
  assert.ok(card.includes(pendencia));
  assert.ok(detalhe.includes(pendencia));
  assert.doesNotMatch(card, /<ol class="barras"/);
  assert.doesNotMatch(detalhe, /<ol class="linha-tempo"/);
});

test('escapa conteúdo da pendência antes de inseri-lo no HTML', () => {
  const acompanhamento = { ...espera, pendenciaCliente: '<img src=x onerror=alert(1)>' };
  const detalhe = htmlLinhaDoTempo(acompanhamento);
  assert.match(detalhe, /&lt;img/);
  assert.doesNotMatch(detalhe, /<img/);
});

function elemento() {
  return {
    innerHTML: '', textContent: '',
    setAttribute() {}, removeAttribute() {}, addEventListener() {}, focus() {},
    querySelector() { return { addEventListener() {} }; }
  };
}

test('home mantém acompanhamento e faturas quando a referência do destaque ou histórico falta', async () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;
  const originalFetch = globalThis.fetch;
  const originalError = console.error;
  try {
    for (const indice of [0, 1]) {
      const resposta = structuredClone(dados);
      resposta.cenarios['aguardando-creditos'].faturas[indice].referencia = null;
      const conteudo = elemento();
      const instalacao = elemento();
      const erros = [];
      globalThis.window = { location: { search: '', hash: '' } };
      globalThis.document = {
        addEventListener() {},
        querySelector(seletor) { return seletor === '#conteudo-home' ? conteudo : instalacao; }
      };
      globalThis.fetch = async () => ({ ok: true, json: async () => resposta });
      console.error = (erro) => erros.push(erro);
      await import(`../assets/js/main.js?referencia-ausente=${indice}`);
      // Deixa concluir a cadeia assíncrona de fetch/json/renderização iniciada pelo módulo.
      await new Promise(setImmediate);
      assert.match(conteudo.innerHTML, /Sua economia está a caminho/);
      assert.match(conteudo.innerHTML, /Referência indisponível/);
      assert.match(conteudo.innerHTML, /Histórico de faturas/);
      assert.doesNotMatch(conteudo.innerHTML, /Verifique a conexão/);
      assert.equal(erros.length, 0);
    }
  } finally {
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
    if (originalDocument === undefined) delete globalThis.document;
    else globalThis.document = originalDocument;
    globalThis.fetch = originalFetch;
    console.error = originalError;
  }
});

test('falha de consulta mantém a opção Tentar novamente', async () => {
  const alvo = elemento();
  const originalError = console.error;
  try {
    console.error = () => {};
    await carregarComEstados(alvo, {
      carregar: async () => { throw new Error('Falha simulada'); },
      mostrar() { assert.fail('Não deve renderizar dados após uma falha'); }
    });
    assert.match(alvo.innerHTML, /Tentar novamente/);
    assert.match(alvo.innerHTML, /role="alert"/);
  } finally {
    console.error = originalError;
  }
});

test('estado vazio mantém a semântica anterior compartilhada com outras histórias', async () => {
  const alvo = elemento();
  await carregarComEstados(alvo, {
    carregar: async () => null,
    mostrar() { assert.fail('Não deve renderizar dados ausentes'); }
  });
  assert.match(alvo.innerHTML, /Nada por aqui ainda/);
  assert.doesNotMatch(alvo.innerHTML, /Verifique a conexão/);
});

test('atalho Faturas mantém o cenário da demonstração', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const href = html.match(/<a href="([^"]+)" aria-current="page">/)[1];
  const destino = new URL(href, 'https://exemplo.test/index.html?cenario=desconto-lancado');
  assert.equal(destino.search, '?cenario=desconto-lancado');
  assert.equal(destino.hash, '#faturas');
});

test('fontes explícitas da HU02 respeitam o mínimo de 12 px da base', async () => {
  const css = await readFile(new URL('../assets/css/hu02.css', import.meta.url), 'utf8');
  const tamanhos = [...css.matchAll(/font-size:\s*([\d.]+)px/g)].map((item) => Number(item[1]));
  assert.ok(tamanhos.length > 0);
  assert.ok(tamanhos.every((tamanho) => tamanho >= 12));
});
