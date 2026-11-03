import { buscarEconomiaHU05 } from './api.js';
import { iniciarLayout, carregarComEstados, formatarMoeda, formatarData } from './layout.js';

const alvo = document.querySelector('#hu05-exemplos');
const form = document.querySelector('#hu05-form');
const feedback = document.querySelector('#hu05-feedback');

function mostrarExemplos(dados) {
  alvo.innerHTML = '';
  dados.exemplos.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'hu05-exemplo';
    const titulo = document.createElement('strong');
    titulo.textContent = item.referencia;
    const valor = document.createElement('span');
    valor.textContent = typeof item.valor === 'number' ? formatarMoeda(item.valor) : 'Valor indisponível';
    const base = document.createElement('span');
    base.textContent = `Base: ${item.base}`;
    const periodo = document.createElement('span');
    periodo.textContent = item.data ? `Data: ${formatarData(item.data)}` : 'Data não informada';
    card.append(titulo, valor, base, periodo);
    alvo.appendChild(card);
  });

  if (dados.demonstracao) {
    const resultado = document.createElement('article');
    resultado.className = 'hu05-exemplo';
    const tituloResultado = document.createElement('strong');
    tituloResultado.textContent = 'Resultado da simulação fictícia';
    const calculo = document.createElement('span');
    calculo.textContent = dados.demonstracao.descricao;
    resultado.append(tituloResultado, calculo);
    alvo.appendChild(resultado);
  }

  const aviso = document.createElement('p');
  aviso.className = 'hu05-muted';
  aviso.textContent = dados.aviso;
  alvo.appendChild(aviso);
}

function mostrarFeedback(mensagem, tipo = 'aviso') {
  feedback.textContent = mensagem;
  feedback.className = tipo === 'erro' ? 'hu05-feedback hu05-feedback--erro' : 'hu05-feedback hu05-feedback--aviso';
}

function validarFormulario(dados) {
  const anterior = {
    data: form.elements.dataAnterior.value,
    valor: Number(form.elements.valorAnterior.value),
    base: form.elements.baseAnterior.value
  };
  const atual = {
    data: form.elements.dataAtual.value,
    valor: Number(form.elements.valorAtual.value),
    base: form.elements.baseAtual.value
  };

  if (!form.reportValidity()) return;
  if (anterior.data >= atual.data) {
    mostrarFeedback('O período atual precisa ser posterior ao período anterior.', 'erro');
    form.elements.dataAtual.focus();
    return;
  }
  if (anterior.base !== atual.base) {
    mostrarFeedback('As bases informadas são diferentes. Não é correto comparar esses valores como se representassem a mesma coisa.', 'erro');
    form.elements.baseAtual.focus();
    return;
  }
  if (!Number.isFinite(anterior.valor) || !Number.isFinite(atual.valor) || anterior.valor < 0 || atual.valor < 0) {
    mostrarFeedback('Confira os valores informados. Use números iguais ou maiores que zero.', 'erro');
    return;
  }

  const diferenca = anterior.valor - atual.valor;
  const percentual = anterior.valor > 0 ? (diferenca / anterior.valor) * 100 : 0;

  if (diferenca > 0) {
    mostrarFeedback(
      `Simulação fictícia: a diferença é de ${formatarMoeda(diferenca)} (${percentual.toFixed(1).replace('.', ',')}% a menos em relação ao período anterior). Esse resultado considera apenas os valores digitados e não é uma economia oficial ou garantida pela Bulbe.`,
      'aviso'
    );
  } else if (diferenca < 0) {
    mostrarFeedback(
      `Nesta simulação, o valor atual ficou ${formatarMoeda(Math.abs(diferenca))} maior que o anterior. Portanto, não há redução entre os valores informados. Isso não permite concluir, isoladamente, se houve economia real.`,
      'aviso'
    );
  } else {
    mostrarFeedback('Nesta simulação, os dois valores são iguais. A diferença calculada é R$ 0,00 (0%).', 'aviso');
  }
}

async function iniciar() {
  iniciarLayout();
  let dadosCarregados;
  const opcoes = {
    carregar: buscarEconomiaHU05,
    textoVazio: 'Ainda não há exemplos cadastrados.',
    mostrar: (dados) => {
      dadosCarregados = dados;
      mostrarExemplos(dados);
    }
  };
  await carregarComEstados(alvo, opcoes);

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    if (!dadosCarregados) {
      mostrarFeedback('Os dados de referência ainda não foram carregados. Tente novamente.', 'erro');
      return;
    }
    validarFormulario(dadosCarregados);
  });
  form.addEventListener('input', () => {
    feedback.textContent = '';
    feedback.className = 'hu05-feedback';
  });
}

iniciar();