// Regressões do simulador acadêmico herdado, separado da conferência HU05.
// HTTP: python3 -m http.server 4173 --bind 127.0.0.1
// Teste: npm install --no-save playwright@1.56.1 && node scripts/test-hu05-simulacao.mjs
// Nunca aciona o botão externo de contratação.
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const ORIGIN = process.env.BULBE_BASE_URL || 'http://127.0.0.1:4173';
const PAGINA = '/pages/simulacao-economia.html';
const CONFIG = '**/data/hu05-simulacao.json';
const evidencias = process.env.BULBE_EVIDENCE_DIR || 'artifacts/hu05-simulacao';
const regras = { tipo: 'simulacao_academica', percentualMaximo: 15 };
const campos = {
  valor1: '100', periodo1: '2026-08',
  valor2: '200', periodo2: '2026-09',
  valor3: '300', periodo3: '2026-10'
};
const verificacoes = [];
mkdirSync(evidencias, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {})
});

function portao() {
  let liberar;
  const promessa = new Promise((resolve) => { liberar = resolve; });
  return { promessa, liberar };
}

async function novaPagina(width = 360) {
  const context = await browser.newContext({ viewport: { width, height: 800 }, locale: 'pt-BR' });
  const page = await context.newPage();
  const registro = { erros: [], navegacoes: 0, externos: [] };
  page.on('pageerror', (erro) => registro.erros.push(erro.message));
  page.on('framenavigated', (frame) => {
    if (frame === page.mainFrame()) registro.navegacoes++;
  });
  // Defesa adicional: nenhum cenário pode abrir a contratação externa.
  await page.route('https://bulbeenergia.com.br/**', async (rota) => {
    registro.externos.push(rota.request().url());
    await rota.abort();
  });
  page.setDefaultTimeout(10000);
  return { context, page, registro };
}

async function abrir(page) {
  const resposta = await page.goto(ORIGIN + PAGINA, { waitUntil: 'domcontentloaded' });
  assert.equal(resposta.status(), 200);
  await page.locator('#hu05-form').waitFor();
}

async function esperarPremissas(page) {
  await page.waitForFunction(() => !document.querySelector('#hu05-form button[type="submit"]').disabled);
  assert.equal(await page.locator('#hu05-form').getAttribute('aria-busy'), 'false');
  assert.equal(await page.locator('#hu05-tentar').isVisible(), false);
}

async function preencher(page, valores = campos) {
  for (const [nome, valor] of Object.entries(valores)) {
    await page.locator(`[name="${nome}"]`).fill(valor);
  }
}

async function conferirCampos(page, valores = campos) {
  for (const [nome, valor] of Object.entries(valores)) {
    assert.equal(await page.locator(`[name="${nome}"]`).inputValue(), valor, nome);
  }
}

async function enviarRepetidamente(page) {
  const eventos = await page.evaluate(() => {
    const form = document.querySelector('#hu05-form');
    const cancelados = [];
    const observar = (evento) => cancelados.push(evento.defaultPrevented);
    form.addEventListener('submit', observar);
    // Inclui submit sintético e requestSubmit, que poderia navegar apesar do botão desabilitado.
    for (let tentativa = 0; tentativa < 3; tentativa++) {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      form.requestSubmit();
    }
    form.removeEventListener('submit', observar);
    return cancelados;
  });
  assert.equal(eventos.length, 6);
  assert(eventos.every(Boolean), 'todos os submits devem cancelar a navegação nativa');
}

async function conferirEtapa(page, numero, foco) {
  assert.equal(await page.locator('.hu05-step:visible').count(), 1);
  assert.equal(await page.locator(`#hu05-step-${numero}`).isVisible(), true);
  assert.equal(await page.locator('[aria-current="step"]').getAttribute('data-step-label'), String(numero));
  if (foco) {
    assert.equal(await page.evaluate(() => document.activeElement.id), foco);
    assert.equal(await page.locator('.hu05-content').evaluate((el) => el.scrollTop), 0);
  }
  const largura = await page.locator('.hu05-content').evaluate((el) => ({
    conteudo: el.scrollWidth, disponivel: el.clientWidth
  }));
  assert(largura.conteudo <= largura.disponivel + 1, 'sem rolagem horizontal no conteúdo');
}

function moeda(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

async function concluir(cenario, nome) {
  assert.deepEqual(cenario.registro.erros, [], 'sem exceções JavaScript');
  assert.deepEqual(cenario.registro.externos, [], 'sem tentativa de contratação externa');
  await cenario.context.close();
  verificacoes.push(nome);
  console.log('OK: ' + nome);
}

try {
  // 1. Fetch retido: formulário permanece editável, mas nenhum submit pode navegar.
  {
    const cenario = await novaPagina();
    const { page, registro } = cenario;
    const resposta = portao();
    const solicitada = portao();
    let requisicoes = 0;
    await page.route(CONFIG, async (rota) => {
      requisicoes++;
      solicitada.liberar();
      await resposta.promessa;
      await rota.fulfill({ json: regras });
    });
    await abrir(page);
    await solicitada.promessa;
    const navegacoes = registro.navegacoes;
    assert.equal(await page.locator('#hu05-form button[type="submit"]').isDisabled(), true);
    assert.equal(await page.locator('#hu05-form').getAttribute('aria-busy'), 'true');
    assert.match(await page.locator('#hu05-status').innerText(), /Carregando/);
    await preencher(page);
    await page.locator('[name="valor3"]').press('Enter');
    await enviarRepetidamente(page);
    await conferirEtapa(page, 1);
    await conferirCampos(page);
    assert.equal(page.url(), ORIGIN + PAGINA);
    assert.equal(registro.navegacoes, navegacoes);
    await page.screenshot({ path: `${evidencias}/fetch-lento.png` });
    resposta.liberar();
    await esperarPremissas(page);
    await conferirEtapa(page, 1);
    await conferirCampos(page);
    await enviarRepetidamente(page);
    await conferirEtapa(page, 2, 'hu05-result-title');
    assert.equal(await page.locator('#hu05-saving').innerText(), moeda(30));
    assert.equal(requisicoes, 1);
    assert.equal(registro.navegacoes, navegacoes);
    await concluir(cenario, 'Fetch lento: Enter, submit antecipado e repetido não navegam nem perdem os dados');
  }

  // 2. Falha HTTP e retry lento: os dados são mantidos e cliques repetidos geram só uma nova requisição.
  {
    const cenario = await novaPagina();
    const { page, registro } = cenario;
    const resposta = portao();
    const repetida = portao();
    let requisicoes = 0;
    await page.route(CONFIG, async (rota) => {
      requisicoes++;
      if (requisicoes === 1) return rota.fulfill({ status: 503, body: 'Indisponível' });
      repetida.liberar();
      await resposta.promessa;
      return rota.fulfill({ json: regras });
    });
    await abrir(page);
    await page.locator('#hu05-tentar').waitFor();
    const navegacoes = registro.navegacoes;
    assert.match(await page.locator('#hu05-status').innerText(), /Não foi possível/);
    assert.equal(await page.locator('#hu05-form button[type="submit"]').isDisabled(), true);
    await preencher(page);
    await enviarRepetidamente(page);
    await conferirEtapa(page, 1);
    await page.locator('#hu05-tentar').click();
    await repetida.promessa;
    await page.evaluate(() => {
      for (let tentativa = 0; tentativa < 5; tentativa++) {
        document.querySelector('#hu05-tentar').dispatchEvent(new Event('click'));
      }
    });
    await enviarRepetidamente(page);
    assert.equal(requisicoes, 2, 'retry protegido contra chamadas concorrentes');
    assert.equal(await page.locator('#hu05-form').getAttribute('aria-busy'), 'true');
    await conferirCampos(page);
    resposta.liberar();
    await esperarPremissas(page);
    await conferirCampos(page);
    await page.locator('#hu05-form button[type="submit"]').click();
    await conferirEtapa(page, 2, 'hu05-result-title');
    assert.equal(await page.locator('#hu05-average').innerText(), moeda(200));
    assert.equal(registro.navegacoes, navegacoes);
    await concluir(cenario, 'HTTP 503: retry único, sem recarga, com preservação das três contas');
  }

  // 3. JSON malformado, configuração nula, tipo incorreto e taxas inválidas nunca liberam o cálculo.
  for (const [nome, corpo] of [
    ['JSON malformado', '{'],
    ['JSON nulo', 'null'],
    ['tipo de conferência', JSON.stringify({ tipo: 'conferencia_economia', percentualMaximo: 15 })],
    ['percentual acima de 15', JSON.stringify({ ...regras, percentualMaximo: 16 })],
    ['percentual em texto', JSON.stringify({ ...regras, percentualMaximo: '15' })]
  ]) {
    const cenario = await novaPagina();
    const { page, registro } = cenario;
    let requisicoes = 0;
    await page.route(CONFIG, (rota) => {
      requisicoes++;
      return requisicoes === 1
        ? rota.fulfill({ status: 200, contentType: 'application/json', body: corpo })
        : rota.fulfill({ json: regras });
    });
    await abrir(page);
    await page.locator('#hu05-tentar').waitFor();
    const navegacoes = registro.navegacoes;
    await preencher(page);
    await enviarRepetidamente(page);
    assert.equal(await page.locator('#hu05-form button[type="submit"]').isDisabled(), true);
    await conferirEtapa(page, 1);
    assert.equal(await page.locator('#hu05-saving').textContent(), '—');
    await page.locator('#hu05-tentar').click();
    await esperarPremissas(page);
    await conferirCampos(page);
    assert.equal(requisicoes, 2);
    assert.equal(registro.navegacoes, navegacoes);
    await concluir(cenario, nome + ': cálculo bloqueado e recuperação por retry');
  }

  // 4. Validações monetárias, exatamente três meses, sequência e ordem permanecem ativas.
  {
    const cenario = await novaPagina();
    const { page } = cenario;
    await abrir(page);
    await esperarPremissas(page);
    await page.locator('#hu05-form button[type="submit"]').click();
    await conferirEtapa(page, 1);
    for (const [alteracoes, mensagem] of [
      [{ valor1: '0' }, /valores entre/],
      [{ valor1: '-1' }, /valores entre/],
      [{ valor1: '1000000.01' }, /valores entre/],
      [{ valor1: '12.345' }, /duas casas/],
      [{ periodo3: '' }, /período de consumo/],
      [{ periodo2: '2026-08' }, /diferentes/],
      [{ periodo1: '2026-07' }, /consecutivos/],
      [{ periodo1: '2026-10', periodo3: '2026-08' }, /ordem/]
    ]) {
      await preencher(page, { ...campos, ...alteracoes });
      await page.locator('#hu05-form button[type="submit"]').click();
      await conferirEtapa(page, 1);
      assert.match(await page.locator('#hu05-feedback').innerText(), mensagem);
    }
    await preencher(page, { ...campos, periodo1: '2025-11', periodo2: '2025-12', periodo3: '2026-01' });
    await page.locator('#hu05-form button[type="submit"]').click();
    await conferirEtapa(page, 2, 'hu05-result-title');
    await concluir(cenario, 'Validações de moeda e três meses preservadas, incluindo a virada do ano');
  }

  // 5. Fluxo completo em três larguras, foco, rolagem interna, detalhes, retorno e reset.
  for (const largura of [320, 390, 768]) {
    const cenario = await novaPagina(largura);
    const { page, registro } = cenario;
    await abrir(page);
    await esperarPremissas(page);
    const navegacoes = registro.navegacoes;
    await conferirEtapa(page, 1);
    await page.screenshot({ path: `${evidencias}/formulario-${largura}.png` });
    await preencher(page);
    await page.locator('.hu05-content').evaluate((el) => { el.scrollTop = el.scrollHeight; });
    await page.locator('#hu05-form button[type="submit"]').click();
    await conferirEtapa(page, 2, 'hu05-result-title');
    assert.equal(await page.locator('#hu05-average').innerText(), moeda(200));
    assert.equal(await page.locator('#hu05-saving').innerText(), moeda(30));
    assert.equal(await page.locator('#hu05-projected').innerText(), moeda(170));
    assert.match(await page.locator('#hu05-step-2').innerText(), /Não é cotação ou cálculo oficial/);
    await page.screenshot({ path: `${evidencias}/resultado-${largura}.png` });
    await page.locator('#hu05-details').click();
    await conferirEtapa(page, 3, 'hu05-detail-title');
    assert.equal(await page.locator('#hu05-detail-base').innerText(), moeda(200));
    assert.equal(await page.locator('#hu05-detail-saving').innerText(), moeda(30));
    assert.equal(await page.locator('#hu05-detail-total').innerText(), moeda(170));
    assert.equal(await page.locator('#hu05-detail-rate').innerText(), 'Até 15%');
    assert.match(await page.locator('#hu05-step-3').innerText(), /pode ser menor ou inexistente/);
    assert.equal(await page.locator('#hu05-contract').isVisible(), true);
    await page.screenshot({ path: `${evidencias}/detalhamento-${largura}.png` });
    await enviarRepetidamente(page);
    await conferirEtapa(page, 3, 'hu05-detail-title');
    await page.locator('#hu05-back').click();
    await conferirEtapa(page, 2, 'hu05-result-title');
    await page.locator('#hu05-restart').click();
    await conferirEtapa(page, 1, 'hu05-title');
    await conferirCampos(page, Object.fromEntries(Object.keys(campos).map((nome) => [nome, ''])));
    assert.equal(await page.locator('#hu05-saving').textContent(), '—');
    assert.equal(await page.locator('#hu05-detail-total').textContent(), '—');
    assert.equal(await page.locator('#hu05-feedback').textContent(), '');
    assert.equal(await page.locator('#hu05-form button[type="submit"]').isEnabled(), true);
    // Eventos em botões ocultos não ressuscitam o resultado limpo.
    await page.locator('#hu05-details').dispatchEvent('click');
    await page.locator('#hu05-back').dispatchEvent('click');
    await conferirEtapa(page, 1, 'hu05-title');
    await preencher(page, { ...campos, valor1: '400', valor2: '400', valor3: '400' });
    await enviarRepetidamente(page);
    await conferirEtapa(page, 2, 'hu05-result-title');
    assert.equal(await page.locator('#hu05-saving').innerText(), moeda(60));
    assert.equal(registro.navegacoes, navegacoes);
    assert.equal(page.url(), ORIGIN + PAGINA);
    await concluir(cenario, `Fluxo completo em ${largura}px: cálculo, detalhes, foco, retorno e nova simulação`);
  }

  writeFileSync(`${evidencias}/resultado.json`, JSON.stringify({ verificacoes, total: verificacoes.length }, null, 2));
  console.log(`HU05 simulador: ${verificacoes.length} grupos de verificação aprovados.`);
} finally {
  await browser.close();
}
