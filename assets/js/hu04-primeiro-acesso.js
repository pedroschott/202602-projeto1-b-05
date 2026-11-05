// HU04: controle de primeiro acesso da apresentação "Conheça a Bulbe".
//
// A marca fica no localStorage DESTE navegador. Ela NÃO é login, não identifica
// a pessoa e não vale em outro navegador, aba anônima ou dispositivo.
// Se o armazenamento estiver bloqueado, a apresentação não abre sozinha
// (melhor não mostrar do que prender a pessoa num redirecionamento).

export const CHAVE_APRESENTACAO = 'bulbe.hu04.apresentacaoVista';

// Retorna 'vista', 'nao-vista' ou 'indisponivel'.
export function situacaoDaApresentacao() {
  try {
    if (window.localStorage.getItem(CHAVE_APRESENTACAO) === 'sim') {
      return 'vista';
    }
    // Confere se dá para gravar antes de redirecionar (evita repetir a apresentação).
    window.localStorage.setItem(CHAVE_APRESENTACAO + '.teste', 'sim');
    window.localStorage.removeItem(CHAVE_APRESENTACAO + '.teste');
    return 'nao-vista';
  } catch (erro) {
    return 'indisponivel';
  }
}

// Grava que a apresentação já foi aberta neste navegador. Retorna true se gravou.
export function marcarApresentacaoVista() {
  try {
    window.localStorage.setItem(CHAVE_APRESENTACAO, 'sim');
    return true;
  } catch (erro) {
    return false;
  }
}

// Chamado pela home. Só redireciona quem abre a home "limpa": endereços com
// ?cenario=, ?id= ou qualquer outro parâmetro são links de demonstração e
// continuam abrindo a home direto.
export function abrirApresentacaoNoPrimeiroAcesso(raiz = './') {
  if (window.location.search !== '') {
    return false;
  }
  if (situacaoDaApresentacao() !== 'nao-vista') {
    return false;
  }
  // Marca antes de sair: mesmo se a apresentação falhar, a home não redireciona de novo.
  if (!marcarApresentacaoVista()) {
    return false;
  }
  // replace: o botão "voltar" não cai de novo na home que redireciona.
  window.location.replace(raiz + 'pages/boas-vindas.html');
  return true;
}
