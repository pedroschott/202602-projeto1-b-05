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
  // Navegação integrada: Home > Menu > HU03 > Home.
  await page.goto(ORIGIN + '/index.html', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Abrir menu' }).click();
  await page.getByRole('link', { name: /Acompanhar adesão/ }).click();
  await page.locator('#hu03-titulo').waitFor();
  assert.equal(await page.locator('#hu03-titulo').innerText(), 'Processo de adesão');
  await page.getByRole('link', { name: 'Voltar para o início' }).click();
  assert(page.url().endsWith('/index.html'), 'Botão voltar encaminha para a home');

  const response = await page.goto(ORIGIN + '/pages/adesao.html', { waitUntil: 'load' });
  assert.equal(response.status(), 200, 'Página HTTP');
  await page.locator('#hu03-titulo').waitFor();
  assert.equal(await page.locator('#hu03-titulo').innerText(), 'Processo de adesão');
  assert.equal(await page.locator('[data-etapa]').count(), 5);
  assert(await page.locator('.bulbe-logo').evaluate((image) => image.complete && image.naturalWidth > 0));

  for (const width of [320, 360, 390]) {
    await page.setViewportSize({ width, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false,
      'Sem rolagem horizontal em ' + width + 'px');
    assert((await page.locator('.hu03-step').first().evaluate(
      (elemento) => parseFloat(getComputedStyle(elemento).fontSize))) >= 12,
      'Legenda das etapas com pelo menos 12px em ' + width + 'px');
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
  await page.locator('[data-etapa="2"]').focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('[data-etapa="2"]').getAttribute('aria-pressed'), 'true', 'Atalho por teclado');
  await page.getByRole('button', { name: 'Falar com o suporte humano' }).click();
  assert.equal(await page.locator('dialog[open]').count(), 1, 'Suporte abre');
  await page.locator('dialog [data-fechar]').click();

  const cenarios = {
    cadastro: { indice: 0, titulo: 'Cadastro inicial',
      status: 'Cadastro em andamento', proxima: 'Próxima etapa: Validação' },
    validacao: { indice: 1, titulo: 'Conferência dos dados',
      status: 'Validação em andamento', proxima: 'Próxima etapa: Adesão' },
    'adesao-em-andamento': { indice: 2, titulo: 'Processo de adesão',
      status: 'Adesão em andamento', proxima: 'Próxima etapa: Ativação' },
    ativacao: { indice: 3, titulo: 'Ativação do benefício',
      status: 'Ativação em andamento', proxima: 'Próxima etapa: 1ª fatura' },
    'primeira-fatura': { indice: 4, titulo: 'Primeira fatura',
      status: 'Primeira fatura disponível', proxima: 'Consultar sua primeira fatura' }
  };

  for (const [cenario, esperado] of Object.entries(cenarios)) {
    await page.goto(ORIGIN + '/pages/adesao.html?cenario=' + cenario);
    await page.locator('#hu03-titulo').waitFor();
    assert.equal(await page.locator('#hu03-titulo').innerText(), esperado.titulo);
    assert.equal(await page.locator('#hu03-situacao').innerText(), esperado.status);
    assert.equal(await page.locator('#hu03-proxima').innerText(), esperado.proxima);
    assert.equal(await page.locator('.hu03-step.is-current').count(), 1);
    assert.equal(await page.locator('.hu03-step.is-selected').count(), 1);
    assert(await page.locator('[data-etapa="' + esperado.indice + '"]').evaluate(
      (elemento) => elemento.classList.contains('is-current')));
    assert((await page.locator('#hu03-update-texto').innerText()).includes(
      esperado.status), 'Última atualização coerente: ' + cenario);

    const fillAntes = await page.locator('#hu03-fill').evaluate((elemento) => elemento.style.width);
    const proximaAntes = await page.locator('#hu03-proxima').innerText();
    const atualizacaoAntes = await page.locator('#hu03-update-texto').innerText();
    const outroIndice = (esperado.indice + 2) % 5;
    await page.locator('[data-etapa="' + outroIndice + '"]').click();
    assert.equal(await page.locator('#hu03-situacao').innerText(), esperado.status,
      'Consulta não altera status atual: ' + cenario);
    assert.equal(await page.locator('#hu03-fill').evaluate((elemento) => elemento.style.width), fillAntes);
    assert.equal(await page.locator('#hu03-proxima').innerText(), proximaAntes);
    assert.equal(await page.locator('#hu03-update-texto').innerText(), atualizacaoAntes);
    assert(await page.locator('[data-etapa="' + esperado.indice + '"]').evaluate(
      (elemento) => elemento.classList.contains('is-current')),
      'Etapa atual preservada: ' + cenario);
    assert.equal(await page.locator('[data-etapa="' + outroIndice + '"]').getAttribute('aria-pressed'), 'true');
    assert((await page.locator('#hu03-detalhe-modo').innerText()).includes('CONSULTA DA ETAPA'));

    if (cenario === 'primeira-fatura') {
      assert.equal(await page.getByRole('link', { name: 'Consultar faturas' }).count(), 1,
        'Link de faturas permanece visível ao consultar outra etapa');
      assert(!(await page.locator('#hu03-descricao').innerText()).includes('Seu processo está nesta etapa'),
        'Consulta não diz que etapa consultada é a atual');
    } else {
      assert.equal(await page.getByRole('link', { name: 'Consultar faturas' }).count(), 0);
    }
  }
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
  assert.equal(await page.locator('#hu03-titulo').innerText(), 'Processo de adesão');

  const recursosHU03 = ['/pages/adesao.html', '/data/hu03-adesao.json', '/assets/js/hu03.js', '/assets/css/hu03.css'];
  assert.deepEqual(failedRequests.filter((url) => recursosHU03.some((recurso) => url.endsWith(recurso))), [], 'Sem falhas de rede nos arquivos da HU03');
  assert.deepEqual(uncaught, [], 'Sem erros JavaScript não tratados');
  console.log('HU03: APROVADA — 5 cenários coerentes, etapa atual fixa, consultas, HTTP, mobile e retry');
} finally {
  await browser.close();
}
