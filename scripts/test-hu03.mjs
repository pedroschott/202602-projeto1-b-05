// Validação da HU03 em Chromium, com dados JSON reais servidos por HTTP.
// Execute com: npm install --no-save playwright && node scripts/test-hu03.mjs
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';

const ORIGIN = process.env.HU03_BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  locale: 'pt-BR'
});
const page = await context.newPage();
const uncaught = [];
const failedRequests = [];
page.on('pageerror', (error) => uncaught.push(error.message));
page.on('requestfailed', (req) => {
  if (req.url().startsWith(ORIGIN)) failedRequests.push(req.url());
});
try {
  const response = await page.goto(ORIGIN + '/pages/adesao.html', { waitUntil: 'load' });
  assert.equal(response.status(), 200, 'Página HTTP');
  await page.locator('#hu03-titulo').waitFor();
  assert.equal(await page.locator('#hu03-titulo').innerText(), 'Adesão em andamento');
  assert.equal(await page.locator('[data-etapa]').count(), 5);
  assert(await page.locator('.bulbe-logo').evaluate((image) => image.complete && image.naturalWidth > 0));

  for (const width of [320, 360, 390]) {
    await page.setViewportSize({ width, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false,
      'Sem rolagem horizontal em ' + width + 'px');
  }

  // Prints do aplicativo real; screenshot 390 x 844.
  mkdirSync('docs/telas', { recursive: true });
  await page.locator('main.bulbe-content').evaluate((el) => el.scrollTop = 0);
  await page.screenshot({ path: 'docs/telas/hu03-adesao.png', animations: 'disabled' });
  await page.locator('main.bulbe-content').evaluate((el) => el.scrollTop = el.scrollHeight);
  await page.screenshot({ path: 'docs/telas/hu03-adesao-inferior.png', animations: 'disabled' });

  for (let i = 0; i < 5; i++) {
    const button = page.locator('[data-etapa="' + i + '"]');
    await button.click();
    assert.equal(await button.getAttribute('aria-pressed'), 'true');
  }
  await page.getByRole('button', { name: 'Falar com o suporte humano' }).click();
  assert.equal(await page.locator('dialog[open]').count(), 1, 'Suporte abre');
  await page.locator('dialog [data-fechar]').click();

  const cenarios = {
    cadastro: 'Cadastro concluído',
    validacao: 'Validação concluída',
    'adesao-em-andamento': 'Adesão em andamento',
    ativacao: 'Etapa de ativação',
    'primeira-fatura': 'Primeira fatura'
  };
  for (const [cenario, titulo] of Object.entries(cenarios)) {
    await page.goto(ORIGIN + '/pages/adesao.html?cenario=' + cenario);
    await page.locator('#hu03-titulo').waitFor();
    assert.equal(await page.locator('#hu03-titulo').innerText(), titulo);
  }
  assert.equal(await page.getByRole('link', { name: 'Consultar faturas' }).count(), 1);
  await page.goto(ORIGIN + '/pages/adesao.html?cenario=inexistente');
  await page.getByText('Nada por aqui ainda').waitFor();

  await page.route('**/data/hu03-adesao.json', (route) => route.fulfill({
    status: 503, contentType: 'application/json', body: '{}'
  }));
  await page.goto(ORIGIN + '/pages/adesao.html');
  await page.getByText('Não foi possível carregar as informações.').waitFor();
  await page.unroute('**/data/hu03-adesao.json');
  await page.getByRole('button', { name: 'Tentar novamente' }).click();
  await page.locator('#hu03-titulo').waitFor();
  assert.equal(await page.locator('#hu03-titulo').innerText(), 'Adesão em andamento');

  assert.deepEqual(failedRequests, [], 'Sem erros de rede dos arquivos internos');
  assert.deepEqual(uncaught, [], 'Sem erros JavaScript não tratados');
  console.log('HU03: APROVADA — HTTP, JSON, 5 cenários, navegação, responsividade, suporte e retry');
} finally {
  await browser.close();
}
