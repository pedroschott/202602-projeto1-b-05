// Smoke do conjunto final em dados normais, sem falhas injetadas.
// Serve também capturas de demonstração, não substitui aceite das histórias.
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const ORIGIN = process.env.BULBE_BASE_URL || 'http://127.0.0.1:4173';
const evidencias = process.env.BULBE_EVIDENCE_DIR || 'artifacts/mvp-final';
mkdirSync(evidencias, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 1000 }, locale: 'pt-BR' });
await context.addInitScript(() => localStorage.setItem('bulbe.hu04.apresentacaoVista', 'sim'));
const page = await context.newPage();
page.setDefaultTimeout(10000);
const erros = [];
const capturas = [];
page.on('pageerror', error => erros.push({ pagina: page.url(), tipo: 'javascript', erro: error.message }));
page.on('console', msg => { if (msg.type() === 'error') erros.push({ pagina: page.url(), tipo: 'console', erro: msg.text() }); });
page.on('response', resposta => {
  if (resposta.url().startsWith(ORIGIN) && resposta.status() >= 400) {
    erros.push({ tipo: 'http', url: resposta.url(), status: resposta.status() });
  }
});
page.on('requestfailed', pedido => {
  if (pedido.url().startsWith(ORIGIN) && !pedido.failure()?.errorText.includes('ERR_ABORTED')) {
    erros.push({ tipo: 'rede', url: pedido.url(), erro: pedido.failure()?.errorText });
  }
});

async function capturar(nome) {
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${evidencias}/${nome}.png`, animations: 'disabled' });
  capturas.push({ nome, url: page.url(), largura: 390, altura: 1000 });
}

try {
  for (const [nome, caminho, seletor] of [
    ['home', '/index.html?cenario=aguardando-creditos', '.card-espera'],
    ['hu01', '/pages/assistente.html?cenario=aguardando-creditos&origem=home', '.hu01-perguntas'],
    ['hu02', '/pages/acompanhamento.html?cenario=aguardando-creditos', '.linha-tempo'],
    ['hu03', '/pages/adesao.html', '#hu03-titulo'],
    ['hu04', '/pages/boas-vindas.html', '#slide article'],
    ['hu05-formulario', '/pages/calculo-economia.html', '#hu05-status'],
    ['fatura', '/pages/fatura.html?cenario=aguardando-creditos&id=201', '.hu01-fatura-total'],
    ['simulador', '/pages/simulacao-economia.html', '#hu05-form']
  ]) {
    const resposta = await page.goto(ORIGIN + caminho, { waitUntil: 'networkidle' });
    assert.equal(resposta.status(), 200, caminho);
    await page.locator(seletor).waitFor();
    if (nome.startsWith('hu05') || nome === 'simulador') {
      await page.waitForFunction(() => !document.querySelector('button[type="submit"]').disabled);
    }
    await capturar(nome);
  }
  await page.goto(ORIGIN + '/pages/calculo-economia.html', { waitUntil: 'networkidle' });
  for (const [campo, valor] of Object.entries({
    anteriorValor: '100', anteriorInicio: '2026-09-01', anteriorFim: '2026-09-30',
    atualValor: '85', atualInicio: '2026-10-01', atualFim: '2026-10-30'
  })) await page.locator(`[name="${campo}"]`).fill(valor);
  await page.locator('#hu05-form button[type="submit"]').click();
  await page.locator('#hu05-step-2').waitFor();
  assert(await page.locator('#hu05-bloqueio').isVisible());
  await capturar('hu05-conferencia');
  assert.deepEqual(erros, [], 'Fluxos normais sem erro no console, JS ou recursos locais');
  console.log('MVP smoke: oito telas e conferência, sem erros em fluxos normais.');
} finally {
  writeFileSync(`${evidencias}/resultado.json`, JSON.stringify({ erros, capturas,
    observacao: 'Capturas de viewport. Não certificam áreas fora da imagem, login ou metodologia oficial.' }, null, 2));
  await browser.close();
}
