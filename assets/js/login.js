import { iniciarLayout } from './layout.js';
import { marcarApresentacaoVista } from './hu04-primeiro-acesso.js';

// Apenas evita repetir o carrossel ao entrar. Não cria sessão ou autenticação.
marcarApresentacaoVista();
iniciarLayout();
