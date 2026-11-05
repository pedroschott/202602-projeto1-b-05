// Regras e contrato HU01 → HU05 sem dependências externas:
//   node --test scripts/test-hu01-integracao.mjs
// Exercício real da interface, com servidor HTTP e Playwright/Chromium:
//   BULBE_BROWSER_TEST=1 node --test scripts/test-hu01-integracao.mjs
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import {
  lerContextoHU01, montarNavegacaoHU01, obterFaturaHU01, validarFAQHU01
} from '../assets/js/hu01.js';
import { lerContextoAssistente, montarRetornoAssistente } from '../assets/js/hu05.js';
import { escaparHTML, consultasDoMenu } from '../assets/js/layout.js';

const raiz = new URL('../', import.meta.url);
const faq = JSON.parse(await readFile(new URL('data/hu01-assistente.json', raiz)));
const dados = JSON.parse(await readFile(new URL('data/hu02-acompanhamento.json', raiz)));
const base = 'https://prototipo.invalid/pages/';
const buscar = caminho => new URL(caminho, base).search;

function idaEVolta(search) {
  const ida = montarNavegacaoHU01(search);
  const contextoHU05 = lerContextoAssistente(buscar(ida.conferencia));
  assert(contextoHU05, 'A HU05 reconhece o contexto emitido pela HU01');
  const retornoHU05 = montarRetornoAssistente(contextoHU05);
  assert.equal(new URL(retornoHU05, base).pathname, '/pages/assistente.html');
  const volta = montarNavegacaoHU01(buscar(retornoHU05));
  assert.deepEqual(volta.contexto, ida.contexto);
  assert.equal(volta.retorno, ida.retorno);
  return { ida, volta, contextoHU05, retornoHU05 };
}

test('HU01 → HU05 → assistente → home preserva os cinco cenários, com ou sem id', () => {
  for (const cenario of [null, ...Object.keys(dados.cenarios)]) {
    for (const id of [null, '202']) {
      const params = new URLSearchParams({ origem: 'home' });
      if (cenario) params.set('cenario', cenario);
      if (id) params.set('id', id);
      const { volta, contextoHU05 } = idaEVolta(params.toString());
      assert.equal(contextoHU05.origemAssistente, 'home');
      assert.equal(new URL(volta.retorno, base).pathname, '/index.html');
      assert.equal(new URL(volta.retorno, base).searchParams.get('cenario'), cenario);
      assert.equal(new URL(volta.retorno, base).searchParams.get('id'), id);
    }
  }
  assert.equal(idaEVolta('').volta.retorno, '../index.html');
});

test('Fatura → HU01 → HU05 → assistente → mesma fatura inclui o id histórico 202', () => {
  for (const [cenario, id, situacao] of [
    ['aguardando-creditos', '202', 'em_aberto'],
    ['aguardando-creditos', '201', 'paga'],
    ['desconto-lancado', '202', 'paga'],
    ['dados-incompletos', '302', 'em_aberto']
  ]) {
    const fatura = montarNavegacaoHU01(`?cenario=${cenario}&id=${id}`);
    const { ida, volta, contextoHU05 } = idaEVolta(buscar(fatura.assistenteFatura));
    assert.equal(contextoHU05.origemAssistente, 'fatura');
    assert.equal(volta.retorno, `fatura.html?cenario=${cenario}&id=${id}`);
    assert.equal(obterFaturaHU01(dados.cenarios[cenario], ida.contexto).situacao, situacao);
  }
  const padrao = idaEVolta('?id=202&origem=fatura');
  assert.equal(padrao.volta.retorno, 'fatura.html?id=202');
  assert.equal(padrao.contextoHU05.cenario, null);
});

test('Navegação repetida conserva origem, cenário e id sem acumular parâmetros', () => {
  for (const origem of ['home', 'fatura']) {
    let search = `?origem=${origem}&cenario=desconto-lancado&id=202`;
    const esperado = lerContextoHU01(search);
    for (let i = 0; i < 10; i += 1) {
      const { ida, retornoHU05, volta } = idaEVolta(search);
      assert.deepEqual(volta.contexto, esperado);
      for (const chave of ['cenario', 'id', 'origem', 'origemAssistente']) {
        assert.equal(new URL(ida.conferencia, base).searchParams.getAll(chave).length, 1);
      }
      search = buscar(retornoHU05);
    }
  }
});

test('Menu da HU05 restaura o assistente e limpa marcadores ao passar pela home', () => {
  for (const origem of ['home', 'fatura']) {
    const ida = montarNavegacaoHU01(`?origem=${origem}&cenario=desconto-lancado&id=202`);
    const menu = consultasDoMenu(buscar(ida.conferencia), '/pages/calculo-economia.html');
    assert.deepEqual(lerContextoHU01(menu.assistente), ida.contexto);
    const viaHome = montarNavegacaoHU01(menu.comum);
    assert.equal(viaHome.contexto.valido, true);
    assert.equal(viaHome.contexto.origemFatura, false);
    assert.equal(viaHome.contexto.id, '202');
    assert.equal(viaHome.contexto.cenario, 'desconto-lancado');
    assert.equal(new URLSearchParams(menu.comum).has('origemAssistente'), false);
    assert.equal(lerContextoAssistente(buscar(viaHome.conferencia)).origemAssistente, 'home');
  }
});

test('Contexto inválido ou ambíguo volta à home sem reaproveitar outra fatura', () => {
  const invalidos = [
    '?cenario=inexistente&id=202&origem=fatura', '?cenario=__proto__&id=202',
    '?cenario=&id=202', '?cenario=aguardando-creditos&cenario=desconto-lancado&id=202',
    '?id=', '?id=0', '?id=-1', '?id=0202', '?id=2.02', '?id=2e2', '?id=1000000000',
    '?id=%3Cimg%20src=x%3E', '?id=202&id=201', '?id=202&id=202',
    '?origem=fatura', '?origem=', '?origem=https%3A%2F%2Fexemplo.invalid',
    '?origem=home&origem=fatura&id=202'
  ];
  for (const search of invalidos) {
    const navegacao = montarNavegacaoHU01(search);
    assert.deepEqual(navegacao.contexto, { cenario: null, id: null, origemFatura: false, valido: false }, search);
    assert.equal(navegacao.retorno, '../index.html', search);
    assert.equal(navegacao.conferencia, 'calculo-economia.html?origem=assistente&origemAssistente=home', search);
    assert.equal(obterFaturaHU01(dados.cenarios[dados.cenarioPadrao], navegacao.contexto), null, search);
  }
});

test('Parâmetros extras nunca se tornam destino, contexto ou mensagem enviada', () => {
  const nav = montarNavegacaoHU01('?origem=home&cenario=desconto-lancado&id=202&redirect=https%3A%2F%2Fexemplo.invalid&pergunta=segredo&origemAssistente=fatura');
  assert.equal(nav.contexto.valido, true);
  for (const destino of Object.values(nav).filter(item => typeof item === 'string')) {
    const url = new URL(destino, base);
    assert.equal(url.origin, new URL(base).origin);
    assert.equal(url.searchParams.has('redirect'), false);
    assert.equal(url.searchParams.has('pergunta'), false);
  }
  assert.equal(new URL(nav.conferencia, base).searchParams.get('origemAssistente'), 'home');
});

test('Fatura ausente, cenário vazio e dados incompletos não usam valores de outra conta', () => {
  for (const [cenario, id] of [['aguardando-creditos', '9999'], ['pendencia-cliente', '202'], ['previsao-confirmada', '201']]) {
    assert.equal(obterFaturaHU01(dados.cenarios[cenario], lerContextoHU01(`?cenario=${cenario}&id=${id}`)), null);
  }
  const contexto = lerContextoHU01('?cenario=dados-incompletos&id=302&origem=fatura');
  assert.equal(obterFaturaHU01(dados.cenarios['dados-incompletos'], contexto).valor, null);
  assert.equal(obterFaturaHU01(null, contexto), null);
});

test('FAQ oferece conferência sem fórmula oficial e mantém acompanhamento separado', () => {
  assert.equal(validarFAQHU01(faq), faq);
  const economia = faq.perguntas.find(pergunta => pergunta.id === 'economia');
  assert.equal(economia.destino, 'conferencia');
  assert.match(economia.resposta, /não calcula economia.*metodologia oficial/);
  assert.match(economia.resposta, /pré-contratação.*separado.*premissa acadêmica.*15%/);
  assert.match(economia.resposta, /sem representar economia realizada, oferta ou garantia/);
  assert(faq.perguntas.some(pergunta => pergunta.destino === 'acompanhamento'));
  assert.match(faq.semResposta.resposta, /sem enviar sua pergunta/);
});

test('FAQ aceita apenas destinos internos conhecidos ou suporte não remetente', () => {
  for (const destino of ['https://exemplo.invalid', 'javascript:alert(1)', 'mailto:exemplo@invalid', '__proto__', 'simulacao', '', null]) {
    const invalida = structuredClone(faq);
    invalida.perguntas[0].destino = destino;
    assert.throws(() => validarFAQHU01(invalida), /Resposta inválida/);
    const fallbackInvalido = structuredClone(faq);
    fallbackInvalido.semResposta.destino = destino;
    assert.throws(() => validarFAQHU01(fallbackInvalido), /Resposta inválida/);
  }
  assert.equal(validarFAQHU01({ perguntas: [] }), null);
  assert.throws(() => validarFAQHU01({}), /FAQ inválida/);
  const incompleta = structuredClone(faq);
  delete incompleta.semResposta;
  assert.throws(() => validarFAQHU01(incompleta), /Resposta inválida/);
});

test('Texto de pergunta desconhecida continua escapável, inclusive aspas e marcação', () => {
  assert.equal(escaparHTML('<img src="x" onerror=alert(1)>&\''), '&lt;img src=&quot;x&quot; onerror=alert(1)&gt;&amp;&#39;');
});

test('Interface real: HU01/HU05, repetição, retorno, parâmetros inválidos e suporte sem envio', {
  skip: process.env.BULBE_BROWSER_TEST !== '1' ? 'Ative BULBE_BROWSER_TEST=1 com servidor HTTP e Chromium.' : false,
  timeout: 120000
}, async () => {
  const { chromium } = await import('playwright');
  const origin = process.env.BULBE_BASE_URL || 'http://127.0.0.1:4173';
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {})
  });
  try {
    const context = await browser.newContext({ viewport: { width: 360, height: 800 }, locale: 'pt-BR' });
    await context.addInitScript(() => {
      try { localStorage.setItem('bulbe.hu04.apresentacaoVista', 'sim'); } catch { /* sem armazenamento */ }
    });
    const page = await context.newPage();
    const erros = [];
    const mutacoes = [];
    page.on('pageerror', erro => erros.push(erro.message));
    page.on('request', request => {
      if (!['GET', 'HEAD'].includes(request.method())) mutacoes.push(request.url());
    });
    page.setDefaultTimeout(10000);
    async function abrirAssistente(search = '') {
      await page.goto(origin + '/pages/assistente.html' + search, { waitUntil: 'networkidle' });
      await page.locator('.hu01-perguntas').waitFor();
    }
    async function conferir() {
      await page.getByRole('button', { name: 'Como foi calculada minha economia?', exact: true }).click();
      assert.match(await page.locator('#conteudo-hu01').innerText(), /não calcula economia/);
      await page.locator('#destino-resposta').click();
      await page.locator('#hu05-form').waitFor();
      await page.waitForFunction(() => !document.querySelector('#hu05-form button[type="submit"]').disabled);
      assert.equal(new URL(page.url()).pathname, '/pages/calculo-economia.html');
    }

    for (const origem of ['home', 'fatura']) {
      const entrada = origem === 'home' ? '/index.html' : '/pages/fatura.html';
      await page.goto(origin + entrada + '?cenario=desconto-lancado&id=202', { waitUntil: 'networkidle' });
      await page.getByRole('link', { name: origem === 'home' ? 'Conversar com o assistente' : 'Perguntar sobre esta fatura' }).click();
      await page.locator('.hu01-perguntas').waitFor();
      if (origem === 'fatura') assert.match(await page.locator('#contexto-hu01').innerText(), /Outubro\/26.*306,73/);
      for (let repeticao = 0; repeticao < 2; repeticao += 1) {
        await conferir();
        assert.equal(new URL(page.url()).searchParams.get('origemAssistente'), origem);
        assert.equal(new URL(page.url()).searchParams.get('id'), '202');
        await page.locator('#hu05-retorno').click();
        await page.locator('.hu01-perguntas').waitFor();
        assert.equal(new URL(page.url()).searchParams.get('origem'), origem);
        assert.equal(new URL(page.url()).searchParams.get('cenario'), 'desconto-lancado');
      }
      await page.locator('#voltar-origem').click();
      assert.equal(new URL(page.url()).pathname, origem === 'fatura' ? '/pages/fatura.html' : '/index.html');
      assert.equal(new URL(page.url()).searchParams.get('id'), '202');
      if (origem === 'fatura') {
        await page.locator('.hu01-fatura-total').waitFor();
        assert.match(await page.locator('#conteudo-hu01').innerText(), /Paga/);
        await page.getByRole('link', { name: 'Perguntar sobre esta fatura' }).click();
        await page.locator('.hu01-perguntas').waitFor();
        assert.match(await page.locator('#contexto-hu01').innerText(), /Outubro\/26.*306,73/);
      }
    }

    // Voltar/avançar do navegador também recompõe o mesmo contexto.
    await conferir();
    await page.goBack();
    await page.locator('#contexto-hu01').waitFor();
    assert.equal(new URL(page.url()).searchParams.get('origem'), 'fatura');
    await page.goForward();
    await page.locator('#hu05-form').waitFor();
    await page.locator('#hu05-retorno').click();
    await page.locator('.hu01-perguntas').waitFor();
    assert.equal(new URL(page.url()).searchParams.get('id'), '202');

    // O menu deve cumprir o mesmo contrato do link de retorno e não contaminar a home.
    for (const origem of ['home', 'fatura']) {
      await abrirAssistente(`?origem=${origem}&cenario=desconto-lancado&id=202`);
      await conferir();
      await page.getByRole('button', { name: 'Abrir menu' }).click();
      await page.getByRole('link', { name: /^Assistente virtual/ }).click();
      await page.locator('.hu01-perguntas').waitFor();
      assert.equal(new URL(page.url()).searchParams.get('origem'), origem);
      assert.doesNotMatch(await page.locator('#contexto-hu01').innerText(), /inválido/);
      await conferir();
      await page.getByRole('button', { name: 'Abrir menu' }).click();
      await page.getByRole('link', { name: /^Início/ }).click();
      await page.getByRole('link', { name: 'Conversar com o assistente' }).click();
      await page.locator('.hu01-perguntas').waitFor();
      assert.match(await page.locator('#contexto-hu01').innerText(), /ajuda e dúvidas/);
      assert.equal(new URL(page.url()).searchParams.get('cenario'), 'desconto-lancado');
      assert.equal(new URL(page.url()).searchParams.get('id'), '202');
      assert.equal(new URL(await page.locator('#voltar-origem').getAttribute('href'), page.url()).pathname, '/index.html');
    }

    await abrirAssistente('?origem=fatura&cenario=inexistente&id=202&redirect=https%3A%2F%2Fexemplo.invalid');
    assert.match(await page.locator('#contexto-hu01').innerText(), /contexto informado é inválido/);
    assert.equal(new URL(await page.locator('#voltar-origem').getAttribute('href'), page.url()).pathname, '/index.html');
    await conferir();
    assert.equal(new URL(page.url()).searchParams.has('id'), false);
    assert.equal(new URL(page.url()).searchParams.has('cenario'), false);
    assert.equal(new URL(page.url()).searchParams.get('origemAssistente'), 'home');

    await abrirAssistente();
    const pergunta = '<img src=x onerror=alert(1)> & pergunta particular';
    await page.locator('#pergunta-input').fill(pergunta);
    await page.getByRole('button', { name: 'Enviar', exact: true }).click();
    assert.equal(await page.locator('#conteudo-hu01 img').count(), 0);
    assert.equal(await page.locator('.hu01-minha').textContent(), pergunta);
    assert.match(await page.locator('#conteudo-hu01').innerText(), /sem enviar sua pergunta/);
    const requisicoesSuporte = [];
    const observar = request => requisicoesSuporte.push(request.url());
    page.on('request', observar);
    for (let repeticao = 0; repeticao < 2; repeticao += 1) {
      await page.locator('#destino-resposta').click();
      await page.locator('dialog[open]').waitFor();
      assert.match(await page.locator('dialog').innerText(), /Nenhuma mensagem é enviada/);
      assert.equal(await page.locator('dialog img').count(), 0);
      assert.equal(await page.locator('dialog a').getAttribute('href'), 'https://bulbeenergia.com.br/duvidas/');
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('dialog[open]').count(), 0);
    }
    await page.waitForLoadState('networkidle');
    page.off('request', observar);
    assert.deepEqual(requisicoesSuporte, [], 'Abrir suporte não transmite a pergunta ou dispara consultas');
    await page.locator('#outra-pergunta').click();
    await page.locator('.hu01-perguntas').waitFor();
    await page.locator('#pergunta-input').fill('   ');
    await page.getByRole('button', { name: 'Enviar', exact: true }).click();
    assert.equal(await page.locator('#pergunta-input').evaluate(input => input.validity.valid), false);
    assert.deepEqual(mutacoes, [], 'Não há POST, pagamento ou envio externo nestes fluxos');
    assert.deepEqual(erros, []);
  } finally {
    await browser.close();
  }
});
