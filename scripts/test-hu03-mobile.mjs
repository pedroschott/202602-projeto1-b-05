// Teste do ajuste mobile da HU03 (etapas em lista vertical até 400 px).
// Só confere layout: a lógica e os dados da HU03 são testados em test-hu03.mjs.
// Servidor: python3 -m http.server 4173 --bind 127.0.0.1
// Teste:    node scripts/test-hu03-mobile.mjs
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const ORIGIN = process.env.BULBE_BASE_URL || 'http://127.0.0.1:4173';
const evidencias = process.env.BULBE_EVIDENCE_DIR || 'artifacts/hu03-mobile';
mkdirSync(evidencias, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ locale: 'pt-BR' });
page.setDefaultTimeout(10000);
const erros = [];
page.on('pageerror', (erro) => erros.push(erro.message));

// Mede cada rótulo de etapa: linhas ocupadas, fonte e se cabe no card.
async function medirEtapas() {
  return page.evaluate(() => {
    const card = document.querySelector('.hu03-steps').getBoundingClientRect();
    const intervalo = document.createRange();
    const etapas = [];
    for (const botao of document.querySelectorAll('.hu03-step')) {
      const rotulo = botao.lastElementChild;
      intervalo.selectNodeContents(rotulo);
      const caixa = rotulo.getBoundingClientRect();
      etapas.push({
        texto: rotulo.textContent.trim(),
        linhas: intervalo.getClientRects().length,
        palavras: rotulo.textContent.trim().split(/\s+/).length,
        fonte: parseFloat(getComputedStyle(botao).fontSize),
        dentro: caixa.left >= card.left - 0.5 && caixa.right <= card.right + 0.5
      });
    }
    return {
      etapas,
      trilha: getComputedStyle(document.querySelector('.hu03-track')).display,
      semRolagem: document.documentElement.scrollWidth <= window.innerWidth
    };
  });
}

try {
  for (const [largura, vertical] of [[320, true], [360, true], [375, true], [390, true], [400, true], [401, false], [430, false], [1280, false]]) {
    await page.setViewportSize({ width: largura, height: 900 });
    await page.goto(ORIGIN + '/pages/adesao.html');
    await page.locator('[data-etapa]').first().waitFor();
    const medida = await medirEtapas();
    assert.equal(medida.semRolagem, true, `${largura}px sem rolagem horizontal`);
    assert.equal(medida.etapas.length, 5);
    for (const etapa of medida.etapas) {
      // Uma palavra deve ocupar uma linha só (nada de "Cadast-ro").
      assert(etapa.linhas <= etapa.palavras, `${largura}px: "${etapa.texto}" quebrou no meio`);
      assert(etapa.fonte >= 12, `${largura}px: "${etapa.texto}" com fonte menor que 12px`);
      assert.equal(etapa.dentro, true, `${largura}px: "${etapa.texto}" saiu do card`);
    }
    assert.equal(medida.trilha === 'none', vertical, `${largura}px: layout ${vertical ? 'vertical' : 'horizontal'}`);
    await page.locator('.hu03-steps').screenshot({ path: `${evidencias}/hu03-etapas-${largura}.png` });
    console.log(`OK: ${largura}px — ${vertical ? 'vertical' : 'horizontal'}, rótulos inteiros, fonte >= 12px`);
  }

  // Seleção de outra etapa continua funcionando no layout vertical.
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto(ORIGIN + '/pages/adesao.html');
  await page.locator('[data-etapa="4"]').click();
  assert.equal(await page.locator('.hu03-step.is-selected').getAttribute('data-etapa'), '4');
  assert.equal(await page.locator('.hu03-step.is-current').count(), 1);
  console.log('OK: 320px — selecionar etapa mantém uma única etapa atual');

  assert.deepEqual(erros, [], 'sem erros JavaScript');
  console.log(`HU03 mobile: aprovado. Capturas em ${evidencias}.`);
} finally {
  await browser.close();
}
