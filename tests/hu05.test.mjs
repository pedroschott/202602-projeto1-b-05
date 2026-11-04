import test from 'node:test';
import assert from 'node:assert/strict';
import {
  dataISOValida,
  diasDoPeriodo,
  validarEntrada,
  avaliarComparabilidade,
  lerContextoAssistente,
  montarRetornoAssistente,
  podeCalcularEconomia,
  configuracaoValida,
  buscarConfiguracaoHU05
} from '../assets/js/hu05.js';

function entrada(overrides = {}) {
  return {
    anterior: {
      valor: 780,
      inicio: '2026-09-01',
      fim: '2026-09-30',
      base: 'total',
      ...(overrides.anterior || {})
    },
    atual: {
      valor: 720,
      inicio: '2026-10-01',
      fim: '2026-10-30',
      base: 'total',
      ...(overrides.atual || {})
    }
  };
}

test('valida datas ISO e rejeita dias inexistentes', () => {
  assert.equal(dataISOValida('2026-02-28'), true);
  assert.equal(dataISOValida('2026-02-30'), false);
  assert.equal(dataISOValida('2026-2-03'), false);
  assert.equal(diasDoPeriodo('2026-09-01', '2026-09-30'), 30);
  assert.equal(diasDoPeriodo('2026-09-30', '2026-09-01'), null);
});

test('rejeita campos vazios, zero, negativos e valores acima do limite', () => {
  for (const valor of [0, -1, NaN, 1000000.01]) {
    assert.equal(validarEntrada(entrada({ anterior: { valor } })).valido, false);
  }
  assert.equal(validarEntrada(entrada({ anterior: { inicio: '' } })).valido, false);
  assert.equal(validarEntrada(entrada({ atual: { fim: '' } })).valido, false);
});

test('rejeita valores monetários com mais de duas casas', () => {
  assert.equal(validarEntrada(entrada({ anterior: { valor: 12.345 } })).valido, false);
});

test('rejeita datas invertidas dentro de cada período', () => {
  const anterior = validarEntrada(entrada({ anterior: { inicio: '2026-09-30', fim: '2026-09-01' } }));
  const atual = validarEntrada(entrada({ atual: { inicio: '2026-10-31', fim: '2026-10-01' } }));
  assert.match(anterior.erros.join(' '), /data inicial.*anterior ou igual/i);
  assert.match(atual.erros.join(' '), /data inicial.*anterior ou igual/i);
});

test('rejeita períodos fora da ordem cronológica', () => {
  const resultado = validarEntrada(entrada({
    anterior: { inicio: '2026-11-01', fim: '2026-11-20' },
    atual: { inicio: '2026-10-01', fim: '2026-10-30' }
  }));
  assert.equal(resultado.valido, false);
  assert.match(resultado.erros.join(' '), /fatura anterior deve começar antes/i);
  assert.doesNotMatch(resultado.erros.join(' '), /se sobrepõem/i);
});

test('rejeita sobreposição e contato no limite inclusivo', () => {
  const resultado = validarEntrada(entrada({
    anterior: { inicio: '2026-09-01', fim: '2026-10-01' },
    atual: { inicio: '2026-10-01', fim: '2026-10-30' }
  }));
  assert.equal(resultado.valido, false);
  assert.match(resultado.erros.join(' '), /se sobrepõem/i);
});

test('aceita entrada cronológica sem sobreposição, mas mantém cálculo bloqueado', () => {
  const resultado = validarEntrada(entrada());
  assert.equal(resultado.valido, true);
  assert.equal(resultado.comparabilidade.comparavel, false);
  assert.equal(podeCalcularEconomia({
    regrasCalculoConfirmadas: true,
    metodologiaConfirmada: true,
    basesComparaveisConfirmadas: true
  }), false);
});

test('bases e durações diferentes são avisos de comparabilidade, não erros de entrada', () => {
  const resultado = validarEntrada(entrada({
    anterior: { base: 'total', inicio: '2026-09-01', fim: '2026-09-30' },
    atual: { base: 'energia', inicio: '2026-10-01', fim: '2026-10-31' }
  }));
  assert.equal(resultado.valido, true);
  assert.equal(resultado.comparabilidade.comparavel, false);
  assert.match(resultado.comparabilidade.diferencas.join(' '), /bases selecionadas são diferentes/i);
  assert.match(resultado.comparabilidade.diferencas.join(' '), /durações dos períodos são diferentes/i);
});

test('mesma base e duração não comprovam comparabilidade', () => {
  const resultado = avaliarComparabilidade(entrada());
  assert.equal(resultado.comparavel, false);
  assert.match(resultado.diferencas.join(' '), /mesmo nome de base não comprova/i);
  assert.match(resultado.diferencas.join(' '), /mesma duração não comprova/i);
});

test('preserva contexto de fatura e restaura origem=fatura no retorno', () => {
  const contexto = lerContextoAssistente('?origem=assistente&origemAssistente=fatura&cenario=aguardando-creditos&id=202');
  assert.deepEqual(contexto, { origemAssistente: 'fatura', cenario: 'aguardando-creditos', id: '202' });
  assert.equal(montarRetornoAssistente(contexto), 'assistente.html?cenario=aguardando-creditos&id=202&origem=fatura');
});

test('preserva contexto da home usando caminho local', () => {
  const contexto = lerContextoAssistente('?origem=assistente&origemAssistente=home&cenario=desconto-lancado');
  assert.equal(montarRetornoAssistente(contexto), 'assistente.html?cenario=desconto-lancado&origem=home');
});

test('entrada direta e parâmetros inválidos usam retorno local seguro', () => {
  assert.equal(lerContextoAssistente(''), null);
  assert.equal(lerContextoAssistente('?origem=assistente&origemAssistente=outro'), null);
  assert.equal(lerContextoAssistente('?origem=assistente&origemAssistente=fatura&id=202&cenario=nao-existe'), null);
  assert.equal(lerContextoAssistente('?origem=assistente&origemAssistente=fatura&id=javascript:alert(1)'), null);
  assert.equal(montarRetornoAssistente(null), '../index.html');
});

test('configuração HU05 inválida ou JSON malformado não habilita a conferência', () => {
  assert.equal(configuracaoValida({ tipo: 'conferencia_economia' }), true);
  assert.equal(configuracaoValida({ tipo: 'simulacao_academica', regrasCalculoConfirmadas: true }), false);
  assert.equal(configuracaoValida(null), false);
  assert.throws(() => JSON.parse('{"tipo":'), SyntaxError);
});

test('falha no fetch permite nova tentativa; flags verdadeiras não liberam cálculo', async () => {
  let tentativas = 0;
  const fetchSimulado = async () => {
    tentativas += 1;
    if (tentativas === 1) return { ok: false, status: 503 };
    return {
      ok: true,
      json: async () => ({
        tipo: 'conferencia_economia',
        regrasCalculoConfirmadas: true,
        basesComparaveisConfirmadas: true,
        metodologiaConfirmada: true
      })
    };
  };
  await assert.rejects(buscarConfiguracaoHU05(fetchSimulado), /HTTP 503/);
  const configuracao = await buscarConfiguracaoHU05(fetchSimulado);
  assert.equal(tentativas, 2);
  assert.equal(configuracaoValida(configuracao), true);
  assert.equal(podeCalcularEconomia(configuracao), false);
});

test('JSON malformado e estrutura incorreta continuam como falha de carregamento', async () => {
  await assert.rejects(
    buscarConfiguracaoHU05(async () => ({ ok: true, json: async () => { throw new SyntaxError('JSON inválido'); } })),
    SyntaxError
  );
  await assert.rejects(
    buscarConfiguracaoHU05(async () => ({ ok: true, json: async () => ({ tipo: 'simulacao_academica' }) })),
    /JSON de conferência inválido/
  );
});
