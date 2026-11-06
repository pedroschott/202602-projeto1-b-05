import { buscarBoasVindas } from './api.js';
import { iniciarLayout, carregarComEstados } from './layout.js';
import { marcarApresentacaoVista } from './hu04-primeiro-acesso.js';

// Abrir esta página (pelo primeiro acesso, pelo menu ou direto) conta como
// "já viu": a home não abre a apresentação sozinha de novo neste navegador.
// Se o armazenamento estiver bloqueado, nada é gravado e a página funciona igual.
marcarApresentacaoVista();

const slide = document.querySelector('#slide');
const controles = document.querySelector('#controles');
const anterior = document.querySelector('#anterior');
const proximo = document.querySelector('#proximo');
let slides = [];
let atual = 0;

function mostrarSlide() {
  const dados = slides[atual];
  slide.replaceChildren();
  const artigo = document.createElement('article');
  artigo.className = 'slide-boas-vindas';

  if (dados.imagem) {
    const imagem = document.createElement('img');
    imagem.src = dados.imagem;
    imagem.alt = dados.descricaoImagem || '';
    imagem.addEventListener('error', () => imagem.remove());
    artigo.appendChild(imagem);
  }

  const titulo = document.createElement('h2');
  titulo.textContent = dados.titulo;
  const texto = document.createElement('p');
  texto.textContent = dados.texto;
  artigo.append(titulo, texto);
  slide.appendChild(artigo);

  document.querySelector('#posicao').textContent = `${atual + 1} de ${slides.length}`;
  // Se o foco estava no "Voltar" e ele ficou desabilitado (primeiro slide),
  // leva o foco ao "Continuar" para quem usa teclado não ficar preso.
  const focoEstavaNoVoltar = document.activeElement === anterior;
  anterior.disabled = atual === 0;
  if (anterior.disabled && focoEstavaNoVoltar) {
    proximo.focus();
  }
  proximo.textContent = atual === slides.length - 1 ? 'Começar' : 'Continuar';
}

function avancar() {
  if (atual === slides.length - 1) {
    // Entrada visual do protótipo, sem autenticação ou dados reais.
    window.location.href = 'login.html';
    return;
  }
  atual++;
  mostrarSlide();
}

anterior.addEventListener('click', () => {
  if (atual > 0) {
    atual--;
    mostrarSlide();
  }
});
proximo.addEventListener('click', avancar);

// Navegação pelo gesto no celular, além dos botões.
let inicioDoGesto = null;
slide.addEventListener('touchstart', (evento) => {
  const toque = evento.changedTouches[0];
  inicioDoGesto = { x: toque.clientX, y: toque.clientY };
}, { passive: true });
slide.addEventListener('touchend', (evento) => {
  if (inicioDoGesto === null || slides.length === 0) return;
  const toque = evento.changedTouches[0];
  const distancia = toque.clientX - inicioDoGesto.x;
  const distanciaVertical = toque.clientY - inicioDoGesto.y;
  inicioDoGesto = null;
  // Arrasto mais vertical que horizontal é rolagem da página, não troca de slide.
  if (Math.abs(distanciaVertical) >= Math.abs(distancia)) return;
  if (distancia < -50 && atual < slides.length - 1) {
    atual++;
    mostrarSlide();
  } else if (distancia > 50 && atual > 0) {
    atual--;
    mostrarSlide();
  }
}, { passive: true });

// Navegação pelas setas do teclado, além dos botões e do gesto.
// A seta para a direita não sai da apresentação no último slide:
// para sair, a pessoa usa o botão "Começar" ou "Pular apresentação".
document.addEventListener('keydown', (evento) => {
  if (slides.length === 0) return;
  if (evento.key === 'ArrowRight' && atual < slides.length - 1) {
    atual++;
    mostrarSlide();
  } else if (evento.key === 'ArrowLeft' && atual > 0) {
    atual--;
    mostrarSlide();
  }
});

// Confere se cada slide do JSON tem título e texto em formato de texto.
function conteudoValido(dados) {
  if (!Array.isArray(dados)) {
    return false;
  }
  for (const item of dados) {
    if (!item) {
      return false;
    }
    if (typeof item.titulo !== 'string') {
      return false;
    }
    if (typeof item.texto !== 'string') {
      return false;
    }
  }
  return true;
}

iniciarLayout();
carregarComEstados(slide, {
  carregar: buscarBoasVindas,
  textoVazio: 'A apresentação ainda não tem conteúdo. Você pode seguir para o acesso demonstrativo.',
  mostrar: (dados) => {
    if (!conteudoValido(dados)) {
      throw new Error('Conteúdo da apresentação inválido');
    }
    slides = dados;
    atual = 0;
    mostrarSlide();
    controles.hidden = false;
  }
});
