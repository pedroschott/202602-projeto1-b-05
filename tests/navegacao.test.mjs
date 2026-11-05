import test from 'node:test';
import assert from 'node:assert/strict';
import { lerContextoAssistente, montarRetornoAssistente } from '../assets/js/hu05.js';
import { consultasDoMenu } from '../assets/js/layout.js';

test('menu traduz contexto de conferência para o assistente e limpa a home', () => {
  const resultado = consultasDoMenu('?origem=assistente&origemAssistente=fatura&cenario=desconto-lancado&id=202', '/pages/calculo-economia.html');
  const assistente = new URLSearchParams(resultado.assistente);
  assert.equal(assistente.get('origem'), 'fatura');
  assert.equal(assistente.get('cenario'), 'desconto-lancado');
  assert.equal(assistente.get('id'), '202');
  assert.equal(assistente.has('origemAssistente'), false);
  const comum = new URLSearchParams(resultado.comum);
  assert.equal(comum.has('origem'), false);
  assert.equal(comum.has('origemAssistente'), false);
  assert.equal(comum.get('id'), '202');
});

test('menu da fatura abre assistente e conferência com origem da fatura', () => {
  const resultado = consultasDoMenu('?cenario=aguardando-creditos&id=201', '/pages/fatura.html');
  assert.equal(new URLSearchParams(resultado.assistente).get('origem'), 'fatura');
  const conferencia = new URLSearchParams(resultado.conferencia);
  assert.equal(conferencia.get('origem'), 'assistente');
  assert.equal(conferencia.get('origemAssistente'), 'fatura');
  assert.equal(conferencia.get('id'), '201');
});

test('menu do assistente preserva origem home e não inventa uma fatura', () => {
  const resultado = consultasDoMenu('?origem=home&cenario=pendencia-cliente', '/pages/assistente.html');
  const conferencia = new URLSearchParams(resultado.conferencia);
  assert.equal(conferencia.get('origemAssistente'), 'home');
  assert.equal(conferencia.has('id'), false);
  assert.equal(consultasDoMenu('', '/index.html').comum, '');
});


test('conferência rejeita contexto ambíguo ou explicitamente vazio sem escolher outra fatura', () => {
  for (const query of [
    '?origem=assistente&origemAssistente=fatura&id=202&id=201',
    '?origem=assistente&origem=home&origemAssistente=home',
    '?origem=assistente&origemAssistente=home&origemAssistente=fatura&id=201',
    '?origem=assistente&origemAssistente=home&cenario=',
    '?origem=assistente&origemAssistente=home&id=',
    '?origem=assistente&origemAssistente=home&cenario=aguardando-creditos&cenario=desconto-lancado'
  ]) {
    assert.equal(lerContextoAssistente(query), null, query);
    assert.equal(montarRetornoAssistente(lerContextoAssistente(query)), '../index.html');
  }
});
