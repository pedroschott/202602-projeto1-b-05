// Testes da HU04 (boas-vindas) em Chromium, com o site servido por HTTP.
// Não certificam o aceite da HU04: login e primeiro acesso dependem de decisão do squad.
// Servidor: python3 -m http.server 4173 --bind 127.0.0.1
// Teste:    npm install --no-save playwright@1.56.1 && node scripts/test-hu04.mjs
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const ORIGIN = process.env.BULBE_BASE_URL || 'http://127.0.0.1:4173';
const PAGINA = ORIGIN + '/pages/boas-vindas.html';
// Destino atual de Começar/Pular. Trocar aqui se o squad aprovar outro destino.
const DESTINO = '/index.html';
const evidencias = process.env.BULBE_EVIDENCE_DIR || 'artifacts/hu04';
mkdirSync(evidencias, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 360, height: 800 },
  hasTouch: true,
  locale: 'pt-BR'
});
const page = await context.newPage();
page.setDefaultTimeout(10000);
const erros = [];
page.on('pageerror', (erro) => erros.push(erro.message));
let aprovados = 0;

function ok(nome) {
  aprovados++;
  console.log('OK: ' + nome);
}

// Abre a página e espera o primeiro slide aparecer.
async function abrir() {
  const resposta = await page.goto(PAGINA, { waitUntil: 'domcontentloaded' });
  assert.equal(resposta.status(), 200);
  await page.locator('#slide article').waitFor();
}

async function posicao() {
  return page.locator('#posicao').innerText();
}

// Simula um arrasto com o dedo dentro da área do slide.
async function arrastar(dx, dy) {
  await page.evaluate(([dx, dy]) => {
    const alvo = document.querySelector('#slide');
    const caixa = alvo.getBoundingClientRect();
    const x = caixa.left + caixa.width / 2;
    const y = caixa.top + 40;
    const inicio = new Touch({ identifier: 1, target: alvo, clientX: x, clientY: y });
    const fim = new Touch({ identifier: 1, target: alvo, clientX: x + dx, clientY: y + dy });
    alvo.dispatchEvent(new TouchEvent('touchstart', { changedTouches: [inicio], touches: [inicio], bubbles: true }));
    alvo.dispatchEvent(new TouchEvent('touchend', { changedTouches: [fim], touches: [], bubbles: true }));
  }, [dx, dy]);
}

// Substitui a resposta do JSON da HU04 só para o próximo carregamento.
async function trocarJSON(status, corpo) {
  await page.route('**/data/hu04-boas-vindas.json', (rota) => {
    rota.fulfill({ status, contentType: 'application/json', body: corpo });
  });
}

async function semRolagemHorizontal() {
  return page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
}

try {
  // 1. Estado inicial
  await abrir();
  assert.equal(await page.locator('#slide article').count(), 1);
  assert.equal(await posicao(), '1 de 3');
  assert.equal(await page.locator('#anterior').isDisabled(), true);
  assert.equal(await page.locator('#proximo').innerText(), 'Continuar');
  assert.equal(await page.locator('#slide h2').innerText(), 'Bem-vindo à Bulbe');
  ok('Carrega 3 slides com título, texto, imagem e indicador "1 de 3"');

  // 2. Avançar e voltar pelos botões, com limites
  await page.locator('#proximo').click();
  assert.equal(await posicao(), '2 de 3');
  assert.equal(await page.locator('#anterior').isDisabled(), false);
  await page.locator('#proximo').click();
  assert.equal(await posicao(), '3 de 3');
  assert.equal(await page.locator('#proximo').innerText(), 'Começar');
  await page.locator('#anterior').click();
  await page.locator('#anterior').click();
  assert.equal(await posicao(), '1 de 3');
  // Clique programático no "Voltar" desabilitado não passa do primeiro slide.
  await page.evaluate(() => document.querySelector('#anterior').click());
  assert.equal(await posicao(), '1 de 3');
  ok('Botões avançam e voltam; não passa do 1º slide; último mostra "Começar"');

  // 3. Gesto
  await arrastar(-120, 0);
  assert.equal(await posicao(), '2 de 3');
  await arrastar(120, 0);
  assert.equal(await posicao(), '1 de 3');
  await arrastar(120, 0);
  assert.equal(await posicao(), '1 de 3', 'gesto para trás no 1º slide não muda');
  await arrastar(-30, 0);
  assert.equal(await posicao(), '1 de 3', 'arrasto curto não muda');
  await arrastar(-60, -150);
  assert.equal(await posicao(), '1 de 3', 'arrasto mais vertical é rolagem');
  await arrastar(-120, 0);
  await arrastar(-120, 0);
  assert.equal(await posicao(), '3 de 3');
  await arrastar(-120, 0);
  assert.equal(await posicao(), '3 de 3', 'gesto no último slide não sai da página');
  assert.equal(new URL(page.url()).pathname, '/pages/boas-vindas.html');
  ok('Gesto avança/volta, respeita limites e ignora arrasto curto ou vertical');

  // 4. Pular em cada slide
  for (let indice = 0; indice < 3; indice++) {
    await abrir();
    for (let passo = 0; passo < indice; passo++) {
      await page.locator('#proximo').click();
    }
    assert.equal(await posicao(), `${indice + 1} de 3`);
    await page.getByRole('link', { name: 'Pular apresentação' }).click();
    await page.waitForURL((url) => url.pathname === DESTINO);
  }
  ok('"Pular apresentação" funciona nos slides 1, 2 e 3 → ' + DESTINO);

  // 5. Começar no último slide
  await abrir();
  await page.locator('#proximo').click();
  await page.locator('#proximo').click();
  await page.getByRole('button', { name: 'Começar' }).click();
  await page.waitForURL((url) => url.pathname === DESTINO);
  ok('"Começar" no último slide → ' + DESTINO);

  // 6. Imagem quebrada: texto continua e navegação funciona
  await page.route('**/hu04-energia.svg', (rota) => rota.fulfill({ status: 404, body: '' }));
  await page.setViewportSize({ width: 320, height: 640 });
  await abrir();
  await page.waitForFunction(() => document.querySelector('#slide img') === null);
  assert.equal(await page.locator('#slide h2').isVisible(), true);
  assert.equal(await page.locator('#slide p').isVisible(), true);
  await page.locator('#proximo').click();
  await page.waitForFunction(() => document.querySelector('#slide img') === null);
  assert.equal(await page.locator('#slide h2').innerText(), 'Entenda os créditos de energia');
  assert.equal(await semRolagemHorizontal(), true);
  await page.screenshot({ path: `${evidencias}/hu04-imagem-quebrada-320.png` });
  await page.unroute('**/hu04-energia.svg');
  await page.setViewportSize({ width: 360, height: 800 });
  ok('Imagem quebrada: texto visível em 320 px e navegação funcionando');

  // 7. JSON vazio
  await trocarJSON(200, '[]');
  await page.goto(PAGINA);
  await page.getByText('Nada por aqui ainda').waitFor();
  assert.equal(await page.locator('#controles').isVisible(), false);
  await page.getByRole('link', { name: 'Pular apresentação' }).click();
  await page.waitForURL((url) => url.pathname === DESTINO);
  await page.unroute('**/data/hu04-boas-vindas.json');
  ok('JSON vazio: mensagem de vazio, controles ocultos, pular continua disponível');

  // 8. JSON malformado e item sem texto
  for (const corpo of ['{ isto não é json', '[{"titulo": "Só título"}]', '{"titulo": "objeto"}']) {
    await trocarJSON(200, corpo);
    await page.goto(PAGINA);
    await page.getByRole('alert').waitFor();
    assert.equal(await page.getByRole('button', { name: 'Tentar novamente' }).isVisible(), true);
    assert.equal(await page.locator('#controles').isVisible(), false);
    assert.equal(await page.getByRole('link', { name: 'Pular apresentação' }).isVisible(), true);
    await page.unroute('**/data/hu04-boas-vindas.json');
  }
  ok('JSON inválido (malformado, item incompleto, objeto): falha + tentar novamente + pular');

  // 9. Erro HTTP e retentativa com sucesso
  await trocarJSON(500, '');
  await page.goto(PAGINA);
  await page.getByRole('alert').waitFor();
  await page.unroute('**/data/hu04-boas-vindas.json');
  await page.getByRole('button', { name: 'Tentar novamente' }).click();
  await page.locator('#slide article').waitFor();
  assert.equal(await posicao(), '1 de 3');
  assert.equal(await page.locator('#controles').isVisible(), true);
  ok('Erro HTTP 500 → "Tentar novamente" carrega os slides');

  // 10. Navegação repetida pelo menu "Conheça a Bulbe" e retorno pelo histórico
  for (let rodada = 0; rodada < 3; rodada++) {
    await page.goto(ORIGIN + '/index.html');
    await page.getByRole('button', { name: 'Abrir menu' }).click();
    await page.getByRole('link', { name: /^Conheça a Bulbe/ }).click();
    await page.locator('#slide article').waitFor();
    assert.equal(await posicao(), '1 de 3');
    await page.getByRole('link', { name: 'Pular apresentação' }).click();
    await page.waitForURL((url) => url.pathname === DESTINO);
  }
  await page.goBack();
  await page.locator('#slide article').waitFor();
  assert.equal(new URL(page.url()).pathname, '/pages/boas-vindas.html');
  ok('Menu "Conheça a Bulbe" → pular, 3 vezes, e "voltar" do navegador reabre o carrossel');

  // 11. Teclado e foco
  await abrir();
  await page.locator('#proximo').focus();
  await page.keyboard.press('Enter');
  assert.equal(await posicao(), '2 de 3');
  await page.keyboard.press('Shift+Tab');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'anterior');
  await page.keyboard.press('Enter');
  assert.equal(await posicao(), '1 de 3');
  // O "Voltar" fica desabilitado: o foco precisa ir para o "Continuar".
  assert.equal(await page.evaluate(() => document.activeElement.id), 'proximo');
  const contorno = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
  assert.notEqual(contorno, 'none', 'foco visível no botão');
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), 'Pular apresentação');
  await page.keyboard.press('Enter');
  await page.waitForURL((url) => url.pathname === DESTINO);
  ok('Teclado: Enter/Tab navegam, foco não fica preso no "Voltar" desabilitado, foco visível');

  // 12. Larguras: sem rolagem horizontal, título e botões dentro da tela
  for (const [largura, altura] of [[320, 640], [360, 740], [430, 932], [1280, 800]]) {
    await page.setViewportSize({ width: largura, height: altura });
    await abrir();
    assert.equal(await semRolagemHorizontal(), true, `${largura}px sem rolagem horizontal`);
    for (const seletor of ['#slide h2', '#slide p', '#anterior', '#proximo', '.pular-apresentacao']) {
      const caixa = await page.locator(seletor).boundingBox();
      assert(caixa.x >= 0 && caixa.x + caixa.width <= largura, `${seletor} dentro da largura ${largura}px`);
    }
    await page.screenshot({ path: `${evidencias}/hu04-${largura}.png`, fullPage: true });
  }
  ok('320, 360, 430 e 1280 px: sem rolagem horizontal e elementos dentro da tela');

  assert.deepEqual(erros, [], 'sem erros JavaScript não tratados');
  console.log(`HU04: ${aprovados} grupos de verificação aprovados. Capturas em ${evidencias}.`);
} finally {
  await browser.close();
}
