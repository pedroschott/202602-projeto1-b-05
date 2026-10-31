import { buscarBoasVindas } from './api.js';
import { iniciarLayout, carregarComEstados } from './layout.js';

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
  anterior.disabled = atual === 0;
  proximo.textContent = atual === slides.length - 1 ? 'Começar' : 'Continuar';
}

function avancar() {
  if (atual === slides.length - 1) {
    // O login real ainda não faz parte desta primeira versão.
    window.location.href = '../index.html';
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
  inicioDoGesto = evento.changedTouches[0].clientX;
}, { passive: true });
slide.addEventListener('touchend', (evento) => {
  if (inicioDoGesto === null || slides.length === 0) return;
  const distancia = evento.changedTouches[0].clientX - inicioDoGesto;
  inicioDoGesto = null;
  if (distancia < -50 && atual < slides.length - 1) {
    atual++;
    mostrarSlide();
  } else if (distancia > 50 && atual > 0) {
    atual--;
    mostrarSlide();
  }
}, { passive: true });

iniciarLayout();
carregarComEstados(slide, {
  carregar: buscarBoasVindas,
  textoVazio: 'A apresentação ainda não tem conteúdo. Você pode pular para a demonstração.',
  mostrar: (dados) => {
    if (!Array.isArray(dados) || dados.some((item) => !item || typeof item.titulo !== 'string' || typeof item.texto !== 'string')) {
      throw new Error('Conteúdo da apresentação inválido');
    }
    slides = dados;
    atual = 0;
    mostrarSlide();
    controles.hidden = false;
  }
});
