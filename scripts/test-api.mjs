// Verifica a integração dos cinco conjuntos de dados, sem dependências externas.
// Executar: node --test scripts/test-api.mjs scripts/test-hu02.mjs
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import test from 'node:test';
import * as api from '../assets/js/api.js';

const raiz = new URL('../', import.meta.url);
const consultas = [
  ['HU01', 'hu01-assistente.json', api.buscarFAQHU01],
  ['HU02', 'hu02-acompanhamento.json', api.buscarAcompanhamentoHU02],
  ['HU03', 'hu03-adesao.json', api.buscarAcompanhamentoHU03],
  ['HU04', 'hu04-boas-vindas.json', api.buscarBoasVindas],
  ['HU05', 'hu05-economia.json', api.buscarEconomiaHU05]
];

for (const [hu, arquivo, consultar] of consultas) {
  test(`${hu}: consulta o JSON versionado via fetch`, async (t) => {
    const esperado = JSON.parse(await readFile(new URL(`data/${arquivo}`, raiz)));
    const fetchMock = t.mock.method(globalThis, 'fetch', async (url) => {
      assert.equal(String(url), String(new URL(`data/${arquivo}`, raiz)));
      return { ok: true, json: async () => esperado };
    });
    const resultado = await consultar();
    assert.deepEqual(resultado, hu === 'HU02' ? esperado.cenarios[esperado.cenarioPadrao] : esperado);
    assert.equal(fetchMock.mock.callCount(), 1);
  });

  test(`${hu}: não transforma falha HTTP em dados válidos`, async (t) => {
    t.mock.method(globalThis, 'fetch', async () => ({ ok: false, status: 503 }));
    await assert.rejects(consultar(), /503/);
  });

  test(`${hu}: propaga erro de parsing JSON`, async (t) => {
    t.mock.method(globalThis, 'fetch', async () => ({
      ok: true, json: async () => { throw new SyntaxError('JSON inválido'); }
    }));
    await assert.rejects(consultar(), SyntaxError);
  });
}

test('HTML das telas aponta para arquivos locais existentes', async () => {
  const paginas = ['index.html', ...['acompanhamento', 'adesao', 'assistente',
    'boas-vindas', 'calculo-economia', 'fatura', 'modelo'].map(p => `pages/${p}.html`)];
  for (const pagina of paginas) {
    const url = new URL(pagina, raiz);
    // O modelo inclui exemplos comentados de arquivos que cada colega criará.
    const html = (await readFile(url, 'utf8')).replace(/<!--[\s\S]*?-->/g, '');
    assert.match(html, /<html\s+lang="pt-BR"/i, pagina);
    assert.match(html, /name="viewport"/i, pagina);
    for (const [, caminho] of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
      if (/^(https?:|data:|mailto:)/.test(caminho)) continue;
      const recurso = new URL(caminho, url);
      recurso.hash = ''; recurso.search = '';
      await access(recurso);
    }
  }
});

test('HU05 continua sem anunciar metodologia oficial confirmada', async () => {
  const regras = JSON.parse(await readFile(new URL('data/hu05-economia.json', raiz)));
  assert.equal(regras.tipo, 'conferencia_economia');
  assert.equal(regras.regrasCalculoConfirmadas, false);
  assert.equal(regras.basesComparaveisConfirmadas, false);
  assert.equal(regras.metodologiaConfirmada, false);
  assert.match(regras.mensagemSemCalculo, /não.*calcul|não.*confirm/i);
});
