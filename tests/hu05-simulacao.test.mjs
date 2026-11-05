import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  premissasSimulacaoValidas,
  carregarPremissasSimulacao,
  validarContasSimulacao,
  calcularSimulacao
} from '../assets/js/hu05-simulacao.js';

const regras = { tipo: 'simulacao_academica', percentualMaximo: 15 };
const contas = () => [
  { valor: 100, periodo: '2026-08' },
  { valor: 200, periodo: '2026-09' },
  { valor: 300, periodo: '2026-10' }
];

test('simulador: aceita somente configuração acadêmica com percentual numérico entre 0 e 15', () => {
  assert.equal(premissasSimulacaoValidas(regras), true);
  for (const percentualMaximo of [0, 7.5, 15]) {
    assert.equal(premissasSimulacaoValidas({ ...regras, percentualMaximo }), true);
  }
  for (const percentualMaximo of [undefined, null, '15', NaN, Infinity, -1, 15.01, 100]) {
    assert.equal(premissasSimulacaoValidas({ ...regras, percentualMaximo }), false);
  }
  for (const dados of [null, undefined, [], {}, { ...regras, tipo: 'conferencia_economia' }]) {
    assert.equal(premissasSimulacaoValidas(dados), false);
  }
});

test('simulador: o JSON real mantém a premissa acadêmica de 15%, sem fórmula oficial', async () => {
  const json = JSON.parse(await readFile(new URL('../data/hu05-simulacao.json', import.meta.url), 'utf8'));
  assert.equal(premissasSimulacaoValidas(json), true);
  assert.equal(json.percentualMaximo, 15);
  assert.equal(json.regrasCalculoConfirmadas, false);
  assert.match(json.aviso, /não representa fórmula oficial/i);
});

test('simulador: aguarda a resposta antes de disponibilizar as premissas', async () => {
  let liberar;
  let terminou = false;
  const pendente = carregarPremissasSimulacao(() => new Promise((resolve) => { liberar = resolve; }))
    .then((dados) => { terminou = true; return dados; });
  await Promise.resolve();
  assert.equal(terminou, false);
  liberar(regras);
  assert.deepEqual(await pendente, regras);
});

test('simulador: falha de rede não impede nova tentativa', async () => {
  let tentativas = 0;
  const buscar = async () => {
    tentativas++;
    if (tentativas === 1) throw new Error('HTTP 503');
    return regras;
  };
  await assert.rejects(carregarPremissasSimulacao(buscar), /HTTP 503/);
  assert.deepEqual(await carregarPremissasSimulacao(buscar), regras);
  assert.equal(tentativas, 2);
});

test('simulador: rejeita JSON malformado e premissas inválidas antes do cálculo', async () => {
  await assert.rejects(carregarPremissasSimulacao(async () => JSON.parse('{')), SyntaxError);
  for (const dados of [null, {}, { ...regras, percentualMaximo: 20 }, { ...regras, percentualMaximo: '15' }]) {
    await assert.rejects(carregarPremissasSimulacao(async () => dados), /premissas.*inválidas/i);
    assert.throws(() => calcularSimulacao(contas(), dados), /premissas.*inválidas/i);
  }
});

test('simulador: exige exatamente três contas com valores monetários válidos', () => {
  for (const entrada of [null, [], contas().slice(0, 2), [...contas(), contas()[0]]]) {
    assert.notEqual(validarContasSimulacao(entrada), '');
  }
  for (const valor of [undefined, null, '100', NaN, Infinity, -10, 0, 0.001, 1000000.01]) {
    const entrada = contas();
    entrada[0].valor = valor;
    assert.match(validarContasSimulacao(entrada), /valores entre/);
    assert.throws(() => calcularSimulacao(entrada, regras));
  }
});

test('simulador: rejeita mais de duas casas e aceita os limites e centavos usuais', () => {
  for (const valor of [12.345, 0.015, 999999.999]) {
    const entrada = contas();
    entrada[0].valor = valor;
    assert.match(validarContasSimulacao(entrada), /duas casas/);
  }
  for (const valor of [0.01, 0.29, 780.17, 1000000]) {
    const entrada = contas();
    entrada[0].valor = valor;
    assert.equal(validarContasSimulacao(entrada), '');
  }
});

test('simulador: rejeita períodos vazios ou inexistentes', () => {
  for (const periodo of ['', undefined, null, '2026-00', '2026-13', '2026-8', '0000-08', '2026-08-01']) {
    const entrada = contas();
    entrada[0].periodo = periodo;
    assert.notEqual(validarContasSimulacao(entrada), '');
  }
});

test('simulador: exige meses distintos, consecutivos e em ordem cronológica', () => {
  const duplicados = contas();
  duplicados[1].periodo = duplicados[0].periodo;
  assert.match(validarContasSimulacao(duplicados), /diferentes/);
  assert.match(validarContasSimulacao(contas().reverse()), /consecutivos.*ordem/);
  const comLacuna = contas();
  comLacuna[0].periodo = '2026-07';
  assert.match(validarContasSimulacao(comLacuna), /consecutivos/);
});

test('simulador: aceita a sequência de meses na virada do ano', () => {
  const entrada = contas().map((conta, indice) => ({
    ...conta,
    periodo: ['2025-11', '2025-12', '2026-01'][indice]
  }));
  assert.equal(validarContasSimulacao(entrada), '');
});

test('simulador: preserva média aritmética e aplicação ilustrativa dos 15%', () => {
  const entrada = contas();
  const resultado = calcularSimulacao(entrada, regras);
  assert.equal(resultado.media, 200);
  assert.equal(resultado.percentual, 15);
  assert.equal(resultado.economia, 30);
  assert.equal(resultado.projetado, 170);
  assert.deepEqual(entrada, contas(), 'não altera as contas de entrada');
});

test('simulador: submit já vem desabilitado no HTML, antes do JavaScript', async () => {
  const html = await readFile(new URL('../pages/simulacao-economia.html', import.meta.url), 'utf8');
  assert.match(html, /<button\b[^>]*type="submit"[^>]*\bdisabled[^>]*>Carregando premissas/);
  assert.match(html, /id="hu05-status"[^>]*role="status"/);
  assert.match(html, /id="hu05-tentar"[^>]*type="button"[^>]*hidden[^>]*disabled/);
  assert.match(html, /Esta é uma simulação acadêmica/);
  assert.match(html, /Não é cotação ou cálculo oficial da Bulbe/);
});
