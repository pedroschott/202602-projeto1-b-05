// Testes do fluxo integrado ATUAL, sem alterar as implementações individuais.
// Não certificam o aceite das HUs. Lacunas conhecidas: docs/implementacao-2.md.
// HTTP: python3 -m http.server 4173 --bind 127.0.0.1
// Teste: npm install --no-save playwright@1.56.1 && node scripts/test-integracao.mjs
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const ORIGIN = process.env.BULBE_BASE_URL || 'http://127.0.0.1:4173';
const evidencias = process.env.BULBE_EVIDENCE_DIR || 'artifacts/mvp';
mkdirSync(evidencias, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {})
});
const context = await browser.newContext({ viewport: { width: 360, height: 800 }, locale: 'pt-BR' });
// HU04: a home abre a apresentação no primeiro acesso; este teste parte de quem já a viu.
await context.addInitScript(() => {
  try { localStorage.setItem('bulbe.hu04.apresentacaoVista', 'sim'); } catch (erro) { /* sem armazenamento */ }
});
const page = await context.newPage();
const erros = [];
const verificacoes = [];
page.on('pageerror', erro => erros.push(erro.message));
page.setDefaultTimeout(10000);

async function abrir(caminho, seletor) {
  const resposta = await page.goto(ORIGIN + caminho, { waitUntil: 'domcontentloaded' });
  assert.equal(resposta.status(), 200, caminho);
  await page.locator(seletor).first().waitFor({ state: 'visible' });
  if (caminho.includes('/calculo-economia.html')) {
    await page.waitForFunction(() => !document.querySelector('#hu05-form button[type="submit"]').disabled);
    assert.equal(await page.locator('#hu05-tentar').isVisible(), false);
  }
}
async function registrar(nome) {
  verificacoes.push(nome);
  console.log('OK: ' + nome);
}
async function preencherFaturas() {
  const campos = { anteriorValor: '100', anteriorInicio: '2026-09-01', anteriorFim: '2026-09-30',
    atualValor: '85', atualInicio: '2026-10-01', atualFim: '2026-10-30' };
  for (const [nome, valor] of Object.entries(campos)) {
    await page.locator(`[name="${nome}"]`).fill(valor);
  }
}

try {
  // As cinco histórias são alcançáveis a partir da home pelo menu compartilhado.
  for (const [nome, destino, pronto] of [
    ['A caminho da economia', 'acompanhamento.html', '.linha-tempo'],
    ['Acompanhar adesão', 'adesao.html', '#hu03-titulo'],
    ['Conheça a Bulbe', 'boas-vindas.html', '#slide article'],
    ['Assistente virtual', 'assistente.html', '.hu01-perguntas'],
    ['Conferir economia', 'calculo-economia.html', '#hu05-form'],
    ['Simular economia', 'simulacao-economia.html', '#hu05-form']
  ]) {
    await abrir('/index.html', '.card-espera');
    await page.getByRole('button', { name: 'Abrir menu' }).click();
    await page.getByRole('link', { name: new RegExp('^' + nome) }).click();
    await page.locator(pronto).waitFor();
    if (destino === 'calculo-economia.html') {
      await page.waitForFunction(() => !document.querySelector('#hu05-form button[type="submit"]').disabled);
      assert.equal(await page.locator('#hu05-tentar').isVisible(), false);
    }
    assert.equal(new URL(page.url()).pathname, '/pages/' + destino);
  }
  await registrar('Home e menu alcançam as cinco histórias');

  // HU02 e HU01 compartilham a mesma fatura e preservam cenário/id no retorno.
  for (const id of ['201', '202']) {
    await abrir(`/pages/fatura.html?cenario=aguardando-creditos&id=${id}`, '.hu01-fatura-total');
    const valor = await page.locator('.hu01-fatura-total').innerText();
    await page.getByRole('link', { name: 'Perguntar sobre esta fatura' }).click();
    await page.locator('.hu01-perguntas').waitFor();
    assert((await page.locator('#contexto-hu01').innerText()).includes(valor));
    await page.getByRole('link', { name: 'Voltar à fatura' }).click();
    await page.locator('.hu01-fatura-total').waitFor();
    assert.equal(new URL(page.url()).searchParams.get('id'), id);
    assert.equal(new URL(page.url()).searchParams.get('cenario'), 'aguardando-creditos');
    assert.equal(await page.locator('.hu01-fatura-total').innerText(), valor);
  }
  await registrar('Fatura atual e histórica → assistente → mesma fatura');

  await abrir('/pages/assistente.html', '.hu01-perguntas');
  await page.locator('#pergunta-input').fill('<img src=x onerror=alert(1)>');
  await page.getByRole('button', { name: 'Enviar', exact: true }).click();
  assert.equal(await page.locator('#conteudo-hu01 img').count(), 0);
  assert.equal(await page.locator('.hu01-minha').textContent(), '<img src=x onerror=alert(1)>');
  await page.locator('#destino-resposta').click();
  await page.locator('dialog[open]').waitFor();
  assert.match(await page.locator('dialog').innerText(), /Nenhuma mensagem é enviada/);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('dialog[open]').count(), 0);
  await page.locator('#outra-pergunta').click();
  await page.locator('.hu01-perguntas').waitFor();
  await registrar('Pergunta não cadastrada, escape de HTML, suporte e fechamento');

  // Carrossel: primeiro acesso e armazenamento são cobertos pela suíte HU04 dedicada.
  await abrir('/pages/boas-vindas.html', '#slide article');
  assert.equal(await page.locator('#anterior').isDisabled(), true);
  await page.locator('#proximo').click();
  assert.equal(await page.locator('#posicao').innerText(), '2 de 3');
  await page.locator('#anterior').click();
  assert.equal(await page.locator('#posicao').innerText(), '1 de 3');
  await page.locator('#proximo').click();
  await page.locator('#proximo').click();
  assert.equal(await page.locator('#proximo').innerText(), 'Começar');
  await page.locator('#proximo').click();
  await page.locator('.card-espera').waitFor();
  await abrir('/pages/boas-vindas.html', '#slide article');
  await page.getByRole('link', { name: 'Pular apresentação' }).click();
  await page.locator('.card-espera').waitFor();
  await registrar('HU04: anterior, próximo, concluir e pular no fluxo atual');

  await abrir('/pages/calculo-economia.html', '#hu05-form');
  await page.waitForFunction(() => !document.querySelector('#hu05-form button[type="submit"]').disabled);
  await page.locator('#hu05-form button[type="submit"]').click();
  assert(await page.locator('#hu05-step-1').isVisible());
  assert.equal(await page.locator('[name="anteriorValor"]').evaluate(el => el.validity.valid), false);
  await preencherFaturas();
  // Erros de entrada continuam bloqueando; diferenças de comparabilidade são avisos.
  for (const [inicio, fim, mensagem] of [
    ['2026-10-30', '2026-10-01', /data inicial/],
    ['2026-08-01', '2026-08-30', /deve começar antes/],
    ['2026-09-30', '2026-10-29', /se sobrepõem/]
  ]) {
    await page.locator('[name="atualInicio"]').fill(inicio);
    await page.locator('[name="atualFim"]').fill(fim);
    await page.locator('#hu05-form button[type="submit"]').click();
    assert(await page.locator('#hu05-step-1').isVisible());
    assert.match(await page.locator('#hu05-feedback').innerText(), mensagem);
  }
  await preencherFaturas();
  await page.locator('[name="atualBase"]').selectOption('energia');
  await page.locator('[name="atualFim"]').fill('2026-10-31');
  await page.locator('#hu05-form button[type="submit"]').click();
  await page.locator('#hu05-step-2').waitFor();
  assert.match(await page.locator('#hu05-resumo').innerText(), /bases selecionadas são diferentes/);
  assert.match(await page.locator('#hu05-resumo').innerText(), /durações dos períodos são diferentes/);
  assert.equal(await page.evaluate(() => document.activeElement.id), 'hu05-result-title');
  assert.equal(await page.locator('.bulbe-content').evaluate(el => el.scrollTop), 0);
  await page.locator('#hu05-edit').click();
  await page.locator('[name="atualBase"]').selectOption('total');
  await page.locator('[name="atualFim"]').fill('2026-10-30');
  assert.equal(await page.locator('#hu05-resumo').innerText(), '');
  await page.locator('#hu05-form button[type="submit"]').click();
  await page.locator('#hu05-step-2').waitFor();
  assert.match(await page.locator('#hu05-resumo').innerText(), /100,00/);
  assert.match(await page.locator('#hu05-bloqueio').innerText(), /não há metodologia oficial/);
  assert(await page.locator('#hu05-bloqueio').isVisible());
  const comparacao = await page.locator('#hu05-step-2').innerText();
  const moedas = (comparacao.match(/R\$\s*[\d.,]+/g) || []).map(texto => texto.replace(/\s+/g, ' '));
  assert.deepEqual(moedas, ['R$ 100,00', 'R$ 85,00'], 'Somente os dois valores informados, sem economia monetária');
  assert.doesNotMatch(comparacao, /\d(?:[.,]\d+)?\s*%/, 'Sem economia percentual inferida');
  await page.locator('#hu05-edit').click();
  assert.equal(await page.locator('[name="atualValor"]').inputValue(), '85');
  await page.locator('[name="atualValor"]').fill('70');
  await page.locator('#hu05-form button[type="submit"]').click();
  assert.match(await page.locator('#hu05-resumo').innerText(), /70,00/);
  await page.locator('#hu05-details').click();
  await page.locator('#hu05-step-3').waitFor();
  assert.doesNotMatch(await page.locator('#hu05-step-3').innerText(), /R\$\s*\d|\d(?:[.,]\d+)?\s*%/);
  await page.locator('#hu05-back').click();
  await page.locator('#hu05-step-2').waitFor();
  await page.locator('#hu05-details').click();
  await page.locator('#hu05-restart').click();
  assert.equal(await page.locator('[name="atualValor"]').inputValue(), '');
  assert.equal(await page.locator('#hu05-resumo').innerText(), '');
  await registrar('HU05: validações atuais, conferência sem fórmula, edição e reinício');

  // Loading e envio precoce não navegam nem habilitam a conferência.
  let liberarResposta;
  const esperaResposta = new Promise(resolve => { liberarResposta = resolve; });
  const rotaHU05 = '**/data/hu05-economia.json';
  await page.route(rotaHU05, async route => {
    await esperaResposta;
    await route.continue();
  });
  await page.goto(ORIGIN + '/pages/calculo-economia.html', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelector('#hu05-status').getAttribute('aria-busy') === 'true');
  assert.equal(await page.locator('#hu05-form button[type="submit"]').isDisabled(), true);
  await page.locator('#hu05-form').evaluate(form => {
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
  assert.match(await page.locator('#hu05-feedback').innerText(), /Aguarde/);
  assert.equal(new URL(page.url()).pathname, '/pages/calculo-economia.html');
  liberarResposta();
  await page.waitForFunction(() => !document.querySelector('#hu05-form button[type="submit"]').disabled);
  await page.unroute(rotaHU05);
  for (const corpo of ['{ inválido', '{"tipo":"simulacao_academica"}']) {
    await page.route(rotaHU05, route => route.fulfill({ contentType: 'application/json', body: corpo }));
    await page.reload();
    await page.locator('#hu05-tentar').waitFor();
    assert.equal(await page.locator('#hu05-form button[type="submit"]').isDisabled(), true);
    await page.unroute(rotaHU05);
    await page.locator('#hu05-tentar').click();
    await page.waitForFunction(() => !document.querySelector('#hu05-form button[type="submit"]').disabled);
  }
  // Nem flags verdadeiras liberam um cálculo que não existe.
  await page.route(rotaHU05, route => route.fulfill({ contentType: 'application/json', body: JSON.stringify({
    tipo: 'conferencia_economia', regrasCalculoConfirmadas: true,
    basesComparaveisConfirmadas: true, metodologiaConfirmada: true
  }) }));
  await abrir('/pages/calculo-economia.html?origem=assistente&origemAssistente=fatura&cenario=aguardando-creditos&id=202', '#hu05-form');
  await preencherFaturas();
  await page.locator('#hu05-form button[type="submit"]').click();
  assert(await page.locator('#hu05-bloqueio').isVisible());
  assert.doesNotMatch(await page.locator('#hu05-step-2').innerText(), /\d(?:[.,]\d+)?\s*%/);
  await page.locator('#hu05-retorno').click();
  await page.locator('.hu01-perguntas').waitFor();
  assert.equal(new URL(page.url()).searchParams.get('id'), '202');
  assert.equal(new URL(page.url()).searchParams.get('origem'), 'fatura');
  assert.equal(new URL(page.url()).searchParams.get('cenario'), 'aguardando-creditos');
  await page.unroute(rotaHU05);
  await registrar('HU05: carga lenta, envio repetido, JSON inválido, flags sem fórmula e retorno contextual');

  // Simulador herdado da main: exemplo acadêmico separado da conferência oficial.
  await abrir('/pages/simulacao-economia.html', '#hu05-form');
  await page.waitForLoadState('networkidle');
  assert.equal(await page.locator('#hu05-form button[type="submit"]').isDisabled(), false);
  for (const [numero, mes] of [[1, '2026-07'], [2, '2026-08'], [3, '2026-09']]) {
    await page.locator(`[name="valor${numero}"]`).fill('100');
    await page.locator(`[name="periodo${numero}"]`).fill(mes);
  }
  await page.locator('#hu05-form button[type="submit"]').click();
  await page.locator('#hu05-step-2').waitFor();
  assert.match(await page.locator('#hu05-saving').innerText(), /15,00/);
  assert.match(await page.locator('#hu05-percent').innerText(), /Até 15%/);
  assert.match(await page.locator('#hu05-step-2').innerText(), /ilustrativ|acadêmic|premissa/i);
  await registrar('Simulador separado: exemplo de três meses e premissa ilustrativa de até 15%');

  // Falha/retry em cada fonte JSON. Os erros injetados são esperados, não falhas de produção.
  for (const [caminho, json, pronto, tentar] of [
    ['/index.html', 'hu02-acompanhamento.json', '.card-espera', '[data-tentar]'],
    ['/pages/assistente.html', 'hu01-assistente.json', '.hu01-perguntas', '[data-tentar]'],
    ['/pages/adesao.html', 'hu03-adesao.json', '#hu03-titulo', '[data-tentar]'],
    ['/pages/boas-vindas.html', 'hu04-boas-vindas.json', '#slide article', '[data-tentar]'],
    ['/pages/calculo-economia.html', 'hu05-economia.json', '#hu05-form', '#hu05-tentar']
  ]) {
    const rota = '**/data/' + json;
    await page.route(rota, route => route.fulfill({ status: 503, body: '{}' }));
    await page.goto(ORIGIN + caminho, { waitUntil: 'domcontentloaded' });
    await page.locator(tentar).waitFor();
    await page.unroute(rota);
    await page.locator(tentar).click();
    await page.locator(pronto).waitFor();
    if (json.startsWith('hu05')) {
      await page.waitForFunction(() => !document.querySelector('#hu05-form button[type="submit"]').disabled);
      assert.equal(await page.locator(tentar).isVisible(), false);
    } else {
      assert.equal(await page.locator('[data-tentar]').count(), 0);
    }
  }
  await registrar('Cinco fontes JSON: falha HTTP e recuperação por nova tentativa');

  const telas = [
    ['home', '/index.html', '.card-espera'],
    ['hu01', '/pages/assistente.html', '.hu01-perguntas'],
    ['fatura', '/pages/fatura.html?id=201', '.hu01-fatura-total'],
    ['hu02', '/pages/acompanhamento.html', '.linha-tempo'],
    ['hu03', '/pages/adesao.html', '#hu03-titulo'],
    ['hu04', '/pages/boas-vindas.html', '#slide article'],
    ['hu05', '/pages/calculo-economia.html', '#hu05-form'],
    ['simulador', '/pages/simulacao-economia.html', '#hu05-form']
  ];
  for (const width of [320, 360, 390]) {
    await page.setViewportSize({ width, height: 844 });
    for (const [nome, caminho, pronto] of telas) {
      await abrir(caminho, pronto);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false,
        `${nome}: largura da página em ${width}px`);
      const conteudo = page.locator('main.bulbe-content');
      assert.equal(await conteudo.evaluate(el => el.scrollWidth > el.clientWidth + 1), false,
        `${nome}: rolagem horizontal interna em ${width}px`);
      await page.screenshot({ path: `${evidencias}/${nome}-${width}.png`, animations: 'disabled' });
    }
  }
  await registrar('Oito telas em 320, 360 e 390 px: sem rolagem horizontal, capturas geradas');
  assert.deepEqual(erros, [], 'Nenhum erro JavaScript não tratado');
} catch (erro) {
  await page.screenshot({ path: `${evidencias}/falha.png`, animations: 'disabled' }).catch(() => {});
  throw erro;
} finally {
  writeFileSync(`${evidencias}/resultado.json`, JSON.stringify({ verificacoes, erros,
    observacao: 'Cobertura de integração atual; não substitui aceite das HUs nem revisão visual humana.' }, null, 2));
  await browser.close();
}
