(() => {
  const stages = [
    {name:'Cadastro',status:'Cadastro concluído',description:'As informações iniciais do cliente foram registradas nesta etapa ilustrativa.',next:'Validação',nextDescription:'As informações seguem para conferência, conforme o fluxo que vier a ser confirmado pela Bulbe.',update:'Exemplo de atualização — dados reais ainda não conectados.'},
    {name:'Validação',status:'Validação concluída',description:'Esta etapa representa a conferência das informações necessárias para seguir com a adesão.',next:'Adesão',nextDescription:'Acompanhe a tela para consultar a situação da próxima etapa quando houver dados disponíveis.',update:'Exemplo de atualização — dados reais ainda não conectados.'},
    {name:'Adesão',status:'Adesão em andamento',description:'Seu processo está nesta etapa. Consulte as informações disponíveis e acompanhe as próximas atualizações por aqui.',next:'Ativação',nextDescription:'Acompanhe esta tela para consultar novas informações quando estiverem disponíveis.',update:'Conteúdo demonstrativo — integração de dados pendente'},
    {name:'Ativação',status:'Etapa de ativação',description:'Esta etapa ilustra o acompanhamento da ativação. O status real deve vir da fonte oficial da Bulbe.',next:'1ª fatura',nextDescription:'Quando a primeira fatura estiver disponível, o cliente deverá conseguir encontrar a informação por um caminho claro.',update:'Exemplo de atualização — dados reais ainda não conectados.'},
    {name:'1ª fatura',status:'Primeira fatura',description:'Esta etapa representa a consulta à primeira fatura, quando ela estiver disponível no sistema.',next:'Acompanhar informações',nextDescription:'Consulte as informações da fatura pelos canais oficiais da Bulbe quando estiverem disponíveis.',update:'Exemplo de atualização — dados reais ainda não conectados.'}
  ];
  const buttons = [...document.querySelectorAll('[data-stage]')];
  const title = document.getElementById('statusTitle');
  const description = document.getElementById('statusDescription');
  const nextHeading = document.getElementById('nextHeading');
  const nextDescription = document.getElementById('nextDescription');
  const lastUpdate = document.getElementById('lastUpdate');
  const fill = document.getElementById('progressFill');
  const dialog = document.getElementById('supportDialog');

  function selectStage(index) {
    const stage = stages[index];
    buttons.forEach((button, i) => {
      button.setAttribute('aria-pressed', String(i === index));
      button.classList.toggle('is-selected', i === index);
      button.classList.toggle('is-current', i === index);
    });
    title.textContent = stage.status;
    description.textContent = stage.description;
    nextHeading.textContent = 'Próxima etapa: ' + stage.next;
    nextDescription.textContent = stage.nextDescription;
    lastUpdate.textContent = stage.update;
    fill.style.width = (index / 4 * 100) + '%';
  }
  buttons.forEach(button => button.addEventListener('click', () => selectStage(Number(button.dataset.stage))));
  document.getElementById('backButton').addEventListener('click', () => {
    if (window.history.length > 1) window.history.back();
    else window.location.href = '../README.md';
  });
  document.getElementById('supportButton').addEventListener('click', () => {
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  });
  function closeDialog() {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }
  document.getElementById('closeSupport').addEventListener('click', closeDialog);
  document.getElementById('understoodButton').addEventListener('click', closeDialog);
  selectStage(2);
})();