// Testes do primeiro acesso da HU04 (marca local), em Chromium com servidor HTTP.
// Exige a chamada de abrirApresentacaoNoPrimeiroAcesso() em assets/js/main.js.
// A marca é só deste navegador: não é login. O critério de login segue pendente.
// Servidor: python3 -m http.server 4173 --bind 127.0.0.1
// Teste:    node scripts/test-hu04-primeiro-acesso.mjs
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const ORIGIN = process.env.BULBE_BASE_URL || 'http://127.0.0.1:4173';
const BOAS_VINDAS = '/pages/boas-vindas.html';
const HOME = '/index.html';

const browser = await chromium.launch({ headless: true });
let aprovados = 0;

function ok(nome) {
  aprovados++;
  console.log('OK: ' + nome);
}

// Cada cenário usa um navegador "novo" (sem marca gravada).
async function novaPagina(opcoes = {}) {
  const context = await browser.newContext({ viewport: { width: 360, height: 800 }, locale: 'pt-BR' });
  if (opcoes.semArmazenamento) {
    // Simula navegador que bloqueia o localStorage.
    await context.addInitScript(() => {
      const bloquear = () => { throw new DOMException('bloqueado', 'SecurityError'); };
      Storage.prototype.getItem = bloquear;
      Storage.prototype.setItem = bloquear;
      Storage.prototype.removeItem = bloquear;
    });
  }
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  const registro = { erros: [], visitasBoasVindas: 0 };
  page.on('pageerror', (erro) => registro.erros.push(erro.message));
  page.on('framenavigated', (frame) => {
    if (frame === page.mainFrame() && new URL(frame.url()).pathname === BOAS_VINDAS) {
      registro.visitasBoasVindas++;
    }
  });
  return { context, page, registro };
}

function caminho(page) {
  return new URL(page.url()).pathname;
}

// Confirma que a home ficou aberta (sem redirecionar) por um tempo.
async function continuaNaHome(page) {
  await page.locator('.card-espera').waitFor();
  await page.waitForTimeout(700);
  assert.equal(caminho(page), HOME);
}

try {
  // 1. Primeiro acesso → apresentação; pular → home, sem repetir
  {
    const { context, page, registro } = await novaPagina();
    await page.goto(ORIGIN + HOME);
    await page.waitForURL((url) => url.pathname === BOAS_VINDAS);
    await page.locator('#slide article').waitFor();
    await page.getByRole('link', { name: 'Pular apresentação' }).click();
    await continuaNaHome(page);
    await page.reload();
    await continuaNaHome(page);
    await page.goto(ORIGIN + HOME);
    await continuaNaHome(page);
    assert.equal(registro.visitasBoasVindas, 1, 'apresentação abriu sozinha uma única vez');
    assert.deepEqual(registro.erros, []);
    await context.close();
  }
  ok('Primeiro acesso abre a apresentação; depois de pular, home, recarga e retorno não repetem');

  // 2. Começar no último slide
  {
    const { context, page } = await novaPagina();
    await page.goto(ORIGIN + HOME);
    await page.locator('#slide article').waitFor();
    await page.locator('#proximo').click();
    await page.locator('#proximo').click();
    await page.getByRole('button', { name: 'Começar' }).click();
    await continuaNaHome(page);
    await context.close();
  }
  ok('Primeiro acesso → Começar no último slide → home, sem voltar à apresentação');

  // 3. Endereço raiz "/" também conta como home
  {
    const { context, page } = await novaPagina();
    await page.goto(ORIGIN + '/');
    await page.waitForURL((url) => url.pathname === BOAS_VINDAS);
    await context.close();
  }
  ok('Endereço raiz "/" no primeiro acesso abre a apresentação');

  // 4. Botão "voltar" não cria loop
  {
    const { context, page, registro } = await novaPagina();
    await page.goto(ORIGIN + HOME);
    await page.waitForURL((url) => url.pathname === BOAS_VINDAS);
    await page.getByRole('link', { name: 'Pular apresentação' }).click();
    await continuaNaHome(page);
    await page.goBack();
    await page.waitForURL((url) => url.pathname === BOAS_VINDAS);
    await page.goBack();
    // A home que redirecionou foi substituída (location.replace): não há para onde voltar.
    assert.notEqual(caminho(page), HOME);
    assert.equal(registro.visitasBoasVindas, 2, 'só a ida inicial e o "voltar" explícito');
    await context.close();
  }
  ok('Voltar do navegador: retorna à apresentação uma vez e não cai na home que redireciona');

  // 5. Links de cenário e de fatura não redirecionam
  for (const endereco of [
    HOME + '?cenario=pendencia-cliente',
    HOME + '?cenario=desconto-lancado',
    '/pages/fatura.html?cenario=aguardando-creditos&id=201',
    '/pages/acompanhamento.html',
    '/pages/adesao.html'
  ]) {
    const { context, page, registro } = await novaPagina();
    await page.goto(ORIGIN + endereco);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    assert.equal(caminho(page), new URL(ORIGIN + endereco).pathname, endereco);
    assert.equal(registro.visitasBoasVindas, 0, endereco);
    await context.close();
  }
  ok('Primeiro acesso por ?cenario=, fatura, acompanhamento e adesão não redireciona');

  // 6. Acesso direto às boas-vindas conta como visto
  {
    const { context, page } = await novaPagina();
    await page.goto(ORIGIN + BOAS_VINDAS);
    await page.locator('#slide article').waitFor();
    await page.goto(ORIGIN + HOME);
    await continuaNaHome(page);
    await context.close();
  }
  ok('Acesso direto à apresentação grava a marca; a home não redireciona depois');

  // 7. Menu "Conheça a Bulbe" continua abrindo a apresentação de propósito
  {
    const { context, page } = await novaPagina();
    await page.goto(ORIGIN + BOAS_VINDAS);
    await page.locator('#slide article').waitFor();
    for (let rodada = 0; rodada < 2; rodada++) {
      await page.goto(ORIGIN + HOME);
      await continuaNaHome(page);
      await page.getByRole('button', { name: 'Abrir menu' }).click();
      await page.getByRole('link', { name: /^Conheça a Bulbe/ }).click();
      await page.locator('#slide article').waitFor();
      assert.equal(await page.locator('#posicao').innerText(), '1 de 3');
    }
    await context.close();
  }
  ok('Depois de vista, o menu "Conheça a Bulbe" ainda abre a apresentação (2 vezes)');

  // 8. Armazenamento bloqueado: sem redirecionar e sem erro
  {
    const { context, page, registro } = await novaPagina({ semArmazenamento: true });
    await page.goto(ORIGIN + HOME);
    await continuaNaHome(page);
    await page.getByRole('button', { name: 'Abrir menu' }).click();
    await page.getByRole('link', { name: /^Conheça a Bulbe/ }).click();
    await page.locator('#slide article').waitFor();
    await page.getByRole('link', { name: 'Pular apresentação' }).click();
    await continuaNaHome(page);
    assert.equal(registro.visitasBoasVindas, 1, 'só a visita pelo menu');
    assert.deepEqual(registro.erros, []);
    await context.close();
  }
  ok('localStorage bloqueado: home não redireciona, apresentação abre pelo menu, sem erro JS');

  // 9. Falha do JSON no primeiro acesso: pular leva à home sem loop
  {
    const { context, page, registro } = await novaPagina();
    await page.route('**/data/hu04-boas-vindas.json', (rota) => rota.fulfill({ status: 500, body: '' }));
    await page.goto(ORIGIN + HOME);
    await page.waitForURL((url) => url.pathname === BOAS_VINDAS);
    await page.getByRole('alert').waitFor();
    await page.getByRole('link', { name: 'Pular apresentação' }).click();
    await continuaNaHome(page);
    assert.equal(registro.visitasBoasVindas, 1);
    await context.close();
  }
  ok('JSON com erro no primeiro acesso: pular vai para a home e não repete');

  // 10. Marca é só deste navegador: limpar o armazenamento volta ao primeiro acesso
  {
    const { context, page } = await novaPagina();
    await page.goto(ORIGIN + BOAS_VINDAS);
    await page.locator('#slide article').waitFor();
    await page.evaluate(() => localStorage.clear());
    await page.goto(ORIGIN + HOME);
    await page.waitForURL((url) => url.pathname === BOAS_VINDAS);
    await context.close();
  }
  ok('Sem a marca (armazenamento limpo), a apresentação volta a abrir: não é login');

  console.log(`HU04 primeiro acesso: ${aprovados} grupos de verificação aprovados.`);
} finally {
  await browser.close();
}
