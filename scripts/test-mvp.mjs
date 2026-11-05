// Smoke dos fluxos principais, sem substituir aceite humano ou teste em iOS real.
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const origin = process.env.BULBE_BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {}) });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, locale: 'pt-BR' });
page.setDefaultTimeout(10000);
const erros = [];
page.on('pageerror', erro => erros.push(erro.message));
page.on('console', msg => { if (msg.type() === 'error') erros.push(msg.text()); });
page.on('response', resposta => { if (resposta.url().startsWith(origin) && resposta.status() >= 400) erros.push(resposta.url()); });
mkdirSync('artifacts', { recursive: true });
async function abrir(caminho, pronto) {
  assert.equal((await page.goto(origin + caminho)).status(), 200);
  await page.locator(pronto).waitFor();
}
async function preencher(campos) {
  for (const [nome, valor] of Object.entries(campos)) await page.locator(`[name="${nome}"]`).fill(valor);
}
async function enviar() {
  await page.waitForFunction(() => !document.querySelector('#hu05-form button[type="submit"]').disabled);
  await page.locator('#hu05-form button[type="submit"]').click();
  await page.locator('#hu05-step-2').waitFor();
}
try {
  // 1. Primeiro acesso, carrossel e home persistida.
  await abrir('/index.html', '#slide article');
  await page.locator('#proximo').click();
  assert.equal(await page.locator('#posicao').innerText(), '2 de 3');
  await page.locator('#proximo').click();
  await page.locator('#proximo').click();
  await page.locator('.card-espera').waitFor();
  await page.reload();
  await page.locator('.card-espera').waitFor();
  console.log('OK: boas-vindas → home e acesso seguinte');

  // 2. Acompanhamento e adesão pelo menu, incluindo o breakpoint mobile.
  for (const [nome, pronto] of [['A caminho da economia', '.linha-tempo'], ['Acompanhar adesão', '#hu03-titulo']]) {
    await abrir('/index.html', '.card-espera');
    await page.getByRole('button', { name: 'Abrir menu' }).click();
    await page.getByRole('link', { name: new RegExp('^' + nome) }).click();
    await page.locator(pronto).waitFor();
  }
  for (const width of [390, 431]) {
    await page.setViewportSize({ width, height: 844 });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('.hu03-track').evaluate(el => getComputedStyle(el).display === 'none'), width <= 430);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  }
  await page.locator('[data-etapa="4"]').click();
  assert.equal(await page.locator('.hu03-step.is-selected').getAttribute('data-etapa'), '4');
  console.log('OK: acompanhamento, adesão e layout mobile');

  // 3. Fatura histórica → assistente → conferência → mesma fatura.
  await abrir('/pages/fatura.html?cenario=aguardando-creditos&id=202', '.hu01-fatura-total');
  const valor = await page.locator('.hu01-fatura-total').innerText();
  await page.getByRole('link', { name: 'Perguntar sobre esta fatura' }).click();
  await page.getByRole('button', { name: 'Como foi calculada minha economia?', exact: true }).click();
  await page.locator('#destino-resposta').click();
  await page.locator('#hu05-form').waitFor();
  await preencher({ anteriorValor: '100', anteriorInicio: '2026-09-01', anteriorFim: '2026-09-30', atualValor: '85', atualInicio: '2026-10-01', atualFim: '2026-10-30' });
  await enviar();
  assert(await page.locator('#hu05-bloqueio').isVisible());
  assert.doesNotMatch(await page.locator('#hu05-step-2').innerText(), /\d(?:[.,]\d+)?\s*%/);
  await page.locator('#hu05-retorno').click();
  await page.getByRole('link', { name: 'Voltar à fatura' }).click();
  await page.locator('.hu01-fatura-total').waitFor();
  assert.equal(new URL(page.url()).searchParams.get('id'), '202');
  assert.equal(await page.locator('.hu01-fatura-total').innerText(), valor);
  console.log('OK: fatura, assistente e conferência sem cálculo oficial');

  // 4. Simulação ilustrativa de três contas.
  await abrir('/pages/simulacao-economia.html', '#hu05-form');
  await preencher({ valor1: '100', periodo1: '2026-07', valor2: '100', periodo2: '2026-08', valor3: '100', periodo3: '2026-09' });
  await enviar();
  assert.match(await page.locator('#hu05-saving').innerText(), /15,00/);
  assert.match(await page.locator('#hu05-percent').innerText(), /Até 15%/);
  console.log('OK: simulador acadêmico');
  assert.deepEqual(erros, [], 'Sem erros JS, console ou recursos locais nos fluxos testados');
} catch (erro) {
  await page.screenshot({ path: 'artifacts/falha.png' }).catch(() => {});
  throw erro;
} finally {
  await browser.close();
}
