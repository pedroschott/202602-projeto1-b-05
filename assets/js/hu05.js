import { iniciarLayout, formatarMoeda, formatarData } from './layout.js';
import { buscarEconomiaHU05 } from './api.js';

const CENARIOS_VALIDOS = new Set([
  'aguardando-creditos',
  'previsao-confirmada',
  'pendencia-cliente',
  'dados-incompletos',
  'desconto-lancado'
]);
const BASES_VALIDAS = new Set(['total', 'energia']);
const MENSAGEM_BLOQUEIO = 'Ainda não calculamos a economia: falta a metodologia oficial da Bulbe para comparar as faturas. Estes dados servem só para conferência.';

export function dataISOValida(valor) {
  if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  const [ano, mes, dia] = valor.split('-').map(Number);
  const data = new Date(Date.UTC(ano, mes - 1, dia));
  return data.getUTCFullYear() === ano && data.getUTCMonth() === mes - 1 && data.getUTCDate() === dia;
}

export function diasDoPeriodo(inicio, fim) {
  if (!dataISOValida(inicio) || !dataISOValida(fim) || inicio > fim) return null;
  const a = Date.parse(inicio + 'T00:00:00Z');
  const b = Date.parse(fim + 'T00:00:00Z');
  return Math.round((b - a) / 86400000) + 1;
}

export function avaliarComparabilidade(entrada) {
  const anterior = entrada.anterior;
  const atual = entrada.atual;
  const duracaoAnterior = diasDoPeriodo(anterior.inicio, anterior.fim);
  const duracaoAtual = diasDoPeriodo(atual.inicio, atual.fim);
  const diferencas = [];

  if (anterior.base !== atual.base) diferencas.push('As bases selecionadas são diferentes.');
  if (duracaoAnterior !== duracaoAtual) diferencas.push('As durações dos períodos são diferentes.');
  if (anterior.base === atual.base) diferencas.push('O mesmo nome de base não comprova que os componentes considerados sejam equivalentes.');
  if (duracaoAnterior === duracaoAtual) diferencas.push('A mesma duração não comprova que os períodos sejam comparáveis.');
  diferencas.push('Não há regra oficial confirmada para determinar a comparabilidade entre essas faturas.');

  return { comparavel: false, diferencas, duracaoAnterior, duracaoAtual };
}

export function validarEntrada(entrada) {
  const erros = [];
  for (const [nome, conta] of Object.entries(entrada)) {
    const rotulo = nome === 'anterior' ? 'anterior' : 'atual';
    if (!Number.isFinite(conta.valor) || conta.valor <= 0 || conta.valor > 1000000) {
      erros.push('Informe um valor maior que zero e de até R$ 1.000.000,00 para a fatura ' + rotulo + '.');
    } else if (Math.abs(conta.valor * 100 - Math.round(conta.valor * 100)) > 1e-7) {
      erros.push('Informe valores monetários com até duas casas decimais para a fatura ' + rotulo + '.');
    }
    if (!dataISOValida(conta.inicio) || !dataISOValida(conta.fim)) {
      erros.push('Informe datas válidas para o período da fatura ' + rotulo + '.');
    } else if (conta.inicio > conta.fim) {
      erros.push('A data inicial da fatura ' + rotulo + ' deve ser anterior ou igual à data final.');
    }
    if (!BASES_VALIDAS.has(conta.base)) {
      erros.push('Selecione uma base válida para a fatura ' + rotulo + '.');
    }
  }

  const datasAnterioresValidas = dataISOValida(entrada.anterior.inicio) && dataISOValida(entrada.anterior.fim) && entrada.anterior.inicio <= entrada.anterior.fim;
  const datasAtuaisValidas = dataISOValida(entrada.atual.inicio) && dataISOValida(entrada.atual.fim) && entrada.atual.inicio <= entrada.atual.fim;
  if (datasAnterioresValidas && datasAtuaisValidas) {
    if (entrada.anterior.inicio >= entrada.atual.inicio) {
      erros.push('O período da fatura anterior deve começar antes do período da fatura atual.');
    }
    // Datas inclusivas: terminar no mesmo dia em que o outro período começa também é sobreposição.
    const periodosSeSobrepoem = entrada.anterior.inicio <= entrada.atual.fim && entrada.atual.inicio <= entrada.anterior.fim;
    if (periodosSeSobrepoem) {
      erros.push('Os períodos se sobrepõem. A data final da fatura anterior deve ser anterior ao início da fatura atual.');
    }
  }

  return {
    valido: erros.length === 0,
    erros,
    comparabilidade: erros.length === 0 ? avaliarComparabilidade(entrada) : null
  };
}

export function lerContextoAssistente(search) {
  const params = new URLSearchParams(search);
  if (['origem', 'origemAssistente', 'cenario', 'id'].some(chave => params.getAll(chave).length > 1)) return null;
  if (params.get('origem') !== 'assistente') return null;

  const origemAssistente = params.get('origemAssistente');
  if (!['fatura', 'home'].includes(origemAssistente)) return null;

  const cenarioRecebido = params.get('cenario');
  const idRecebido = params.get('id');
  if (params.has('cenario') && !CENARIOS_VALIDOS.has(cenarioRecebido)) return null;
  if (params.has('id') && !/^[1-9]\d{0,8}$/.test(idRecebido)) return null;
  if (origemAssistente === 'fatura' && !idRecebido) return null;

  return {
    origemAssistente,
    cenario: cenarioRecebido || null,
    id: idRecebido || null
  };
}

export function montarRetornoAssistente(contexto) {
  if (!contexto) return '../index.html';
  const params = new URLSearchParams();
  if (contexto.cenario && CENARIOS_VALIDOS.has(contexto.cenario)) params.set('cenario', contexto.cenario);
  if (contexto.id && /^[1-9]\d{0,8}$/.test(contexto.id)) params.set('id', contexto.id);
  params.set('origem', contexto.origemAssistente === 'fatura' ? 'fatura' : 'home');
  return 'assistente.html?' + params.toString();
}

// Flags do JSON nunca autorizam cálculo sem metodologia oficial confirmada e implementada.
export function podeCalcularEconomia() {
  return false;
}

export function configuracaoValida(configuracao) {
  return Boolean(configuracao && configuracao.tipo === 'conferencia_economia');
}

export async function buscarConfiguracaoHU05(fetcher = fetch) {
  const configuracao = await buscarEconomiaHU05(fetcher);
  if (!configuracaoValida(configuracao)) throw new Error('JSON de conferência inválido');
  return configuracao;
}

function lerDados(form) {
  const campos = (prefixo) => ({
    valor: Number(form.elements[prefixo + 'Valor'].value),
    inicio: form.elements[prefixo + 'Inicio'].value,
    fim: form.elements[prefixo + 'Fim'].value,
    base: form.elements[prefixo + 'Base'].value
  });
  return { anterior: campos('anterior'), atual: campos('atual') };
}

function criarElemento(tag, texto, classe) {
  const elemento = document.createElement(tag);
  if (texto !== undefined) elemento.textContent = texto;
  if (classe) elemento.className = classe;
  return elemento;
}

function prepararRetorno() {
  const link = document.querySelector('#hu05-retorno');
  const contexto = lerContextoAssistente(window.location.search);
  link.href = montarRetornoAssistente(contexto);
  // A seta do cabeçalho leva de volta à origem; o nome acessível acompanha o destino.
  link.setAttribute('aria-label', contexto ? 'Voltar ao assistente' : 'Voltar para o início');
}

function iniciar() {
  const form = document.querySelector('#hu05-form');
  const feedback = document.querySelector('#hu05-feedback');
  const status = document.querySelector('#hu05-status');
  const retry = document.querySelector('#hu05-tentar');
  const submit = form.querySelector('button[type="submit"]');
  const content = document.querySelector('.bulbe-content');
  const etapas = [...document.querySelectorAll('.hu05-step')];
  const marcadores = [...document.querySelectorAll('[data-step-label]')];
  const resumo = document.querySelector('#hu05-resumo');
  const bloqueio = document.querySelector('#hu05-bloqueio');
  const detalhe = document.querySelector('#hu05-detalhe');
  let regrasDisponiveis = false;
  let carregando = false;
  let etapaAtual = 1;
  let dados = null;

  iniciarLayout();
  prepararRetorno();

  function mostrarEtapa(numero) {
    etapaAtual = numero;
    etapas.forEach((etapa, indice) => { etapa.hidden = indice !== numero - 1; });
    marcadores.forEach((marcador, indice) => {
      marcador.classList.toggle('is-active', indice === numero - 1);
      marcador.classList.toggle('is-done', indice < numero - 1);
      if (indice === numero - 1) marcador.setAttribute('aria-current', 'step');
      else marcador.removeAttribute('aria-current');
    });
    // A rolagem pertence ao contêiner interno, não à janela.
    content.scrollTo({ top: 0, behavior: 'auto' });
    etapas[numero - 1].querySelector('.hu05-title').focus({ preventScroll: true });
  }

  function mostrarErro(mensagem) {
    feedback.textContent = mensagem;
    feedback.className = 'hu05-feedback hu05-feedback--erro';
  }

  function limparErro() {
    feedback.textContent = '';
    feedback.className = 'hu05-feedback';
  }

  function invalidarRevisao() {
    if (dados) {
      dados = null;
      resumo.replaceChildren();
      bloqueio.textContent = 'Os dados foram alterados. Envie novamente para atualizar a conferência.';
      detalhe.textContent = MENSAGEM_BLOQUEIO;
    }
    limparErro();
  }

  function preencherComparacao(entrada, comparabilidade) {
    resumo.replaceChildren();
    const linha = criarElemento('div', undefined, 'hu05-comparison-row');
    const contas = [
      ['Fatura anterior à Bulbe', entrada.anterior],
      ['Primeira fatura após a Bulbe', entrada.atual]
    ];
    contas.forEach(([rotulo, conta]) => {
      const cartao = criarElemento('div');
      cartao.append(
        criarElemento('span', rotulo),
        criarElemento('strong', formatarMoeda(conta.valor)),
        criarElemento('small', formatarData(conta.inicio) + ' a ' + formatarData(conta.fim)),
        criarElemento('small', 'Base informada: ' + (conta.base === 'total' ? 'Valor total da fatura' : 'Componente de energia informado')),
        criarElemento('small', 'Duração informada: ' + diasDoPeriodo(conta.inicio, conta.fim) + ' dias')
      );
      linha.appendChild(cartao);
    });
    resumo.appendChild(linha);

    const titulo = criarElemento('h3', 'Pontos de atenção');
    const lista = criarElemento('ul', undefined, 'hu05-check-list');
    comparabilidade.diferencas.forEach(mensagem => lista.appendChild(criarElemento('li', mensagem)));
    resumo.append(titulo, lista);

    bloqueio.textContent = MENSAGEM_BLOQUEIO;
    detalhe.textContent = MENSAGEM_BLOQUEIO;
  }

  async function carregarRegras() {
    if (carregando || regrasDisponiveis) return;
    carregando = true;
    submit.disabled = true;
    retry.disabled = true;
    retry.hidden = true;
    status.className = 'hu05-status';
    status.textContent = 'Carregando regras de conferência…';
    status.setAttribute('aria-busy', 'true');
    try {
      await buscarConfiguracaoHU05();
      regrasDisponiveis = true;
      status.className = 'hu05-status hu05-status--ok';
      status.textContent = 'Regras de conferência carregadas.';
      submit.disabled = false;
    } catch (erro) {
      regrasDisponiveis = false;
      status.className = 'hu05-status hu05-status--erro';
      status.textContent = 'Não foi possível carregar os dados de conferência. Confira a conexão ou o JSON e tente novamente.';
      retry.hidden = false;
    } finally {
      carregando = false;
      status.removeAttribute('aria-busy');
      retry.disabled = false;
    }
  }

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    if (etapaAtual !== 1) return;
    if (!regrasDisponiveis || carregando) {
      mostrarErro('Aguarde o carregamento dos dados de conferência antes de continuar.');
      return;
    }
    const entrada = lerDados(form);
    const validacao = validarEntrada(entrada);
    if (!validacao.valido) {
      mostrarErro(validacao.erros.join(' '));
      const primeiroInvalido = [...form.elements].find(campo => campo.willValidate && !campo.checkValidity());
      if (primeiroInvalido) {
        primeiroInvalido.focus({ preventScroll: true });
        primeiroInvalido.scrollIntoView({ block: 'center', behavior: 'auto' });
      }
      return;
    }
    const campoNativoInvalido = [...form.elements].find(campo => campo.willValidate && !campo.checkValidity());
    if (campoNativoInvalido) {
      mostrarErro('Confira os valores informados. Use valores monetários com até duas casas decimais.');
      form.reportValidity();
      campoNativoInvalido.focus({ preventScroll: true });
      campoNativoInvalido.scrollIntoView({ block: 'center', behavior: 'auto' });
      return;
    }
    dados = entrada;
    preencherComparacao(dados, validacao.comparabilidade);
    mostrarEtapa(2);
  });

  form.addEventListener('input', invalidarRevisao);
  form.addEventListener('change', invalidarRevisao);
  retry.addEventListener('click', carregarRegras);
  document.querySelector('#hu05-details').addEventListener('click', () => {
    if (dados) mostrarEtapa(3);
  });
  document.querySelector('#hu05-edit').addEventListener('click', () => mostrarEtapa(1));
  document.querySelector('#hu05-back').addEventListener('click', () => {
    if (dados) mostrarEtapa(2);
  });
  document.querySelector('#hu05-restart').addEventListener('click', () => {
    form.reset();
    dados = null;
    resumo.replaceChildren();
    bloqueio.textContent = MENSAGEM_BLOQUEIO;
    detalhe.textContent = MENSAGEM_BLOQUEIO;
    limparErro();
    mostrarEtapa(1);
  });

  bloqueio.textContent = MENSAGEM_BLOQUEIO;
  detalhe.textContent = MENSAGEM_BLOQUEIO;
  carregarRegras();
}

if (typeof document !== 'undefined') {
  const paginaHU05 = document.querySelector('#hu05-form');
  if (paginaHU05) iniciar();
}
