import test from 'node:test';
import assert from 'node:assert/strict';
import { lerContextoAssistente, montarRetornoAssistente, validarEntrada, podeCalcularEconomia } from '../assets/js/hu05.js';
import { calcularSimulacao, validarContasSimulacao } from '../assets/js/hu05-simulacao.js';

test('retorno mantém a fatura; contexto ambíguo usa a home', () => {
  const contexto = lerContextoAssistente('?origem=assistente&origemAssistente=fatura&cenario=aguardando-creditos&id=202');
  assert.equal(montarRetornoAssistente(contexto), 'assistente.html?cenario=aguardando-creditos&id=202&origem=fatura');
  assert.equal(montarRetornoAssistente(lerContextoAssistente('?origem=assistente&origemAssistente=fatura&id=201&id=202')), '../index.html');
});

test('conferência valida períodos e nunca inventa economia oficial', () => {
  const dados = {
    anterior: { valor: 100, inicio: '2026-09-01', fim: '2026-09-30', base: 'total' },
    atual: { valor: 85, inicio: '2026-10-01', fim: '2026-10-30', base: 'total' }
  };
  assert.equal(validarEntrada(dados).valido, true);
  dados.atual.inicio = '2026-09-30';
  assert.equal(validarEntrada(dados).valido, false);
  assert.equal(podeCalcularEconomia({ regrasCalculoConfirmadas: true, metodologiaConfirmada: true, basesComparaveisConfirmadas: true }), false);
});

test('simulador aplica a premissa acadêmica apenas a três meses válidos', () => {
  const contas = ['2026-08', '2026-09', '2026-10'].map(periodo => ({ periodo, valor: 100 }));
  const resultado = calcularSimulacao(contas, { tipo: 'simulacao_academica', percentualMaximo: 15 });
  assert.equal(resultado.economia, 15);
  assert.equal(resultado.projetado, 85);
  contas[1].periodo = contas[0].periodo;
  assert.notEqual(validarContasSimulacao(contas), '');
});
