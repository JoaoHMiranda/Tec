// Função para formatar a data e hora no formato brasileiro
function formatBrazilianDateTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear().toString().substring(0, 4);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// Funções para recuperar os dados do localStorage
function getFilmes() {
  return JSON.parse(localStorage.getItem('filmes')) || [];
}

function getSalas() {
  return JSON.parse(localStorage.getItem('salas')) || [];
}

function getSessoes() {
  return JSON.parse(localStorage.getItem('sessoes')) || [];
}

function saveSessoes(sessoes) {
  localStorage.setItem('sessoes', JSON.stringify(sessoes));
}

// Carrega os filmes no <select> da modal
function loadFilmes() {
  const filmes = getFilmes();
  const filmeSelect = document.getElementById('filmeSelect');
  filmeSelect.innerHTML = '<option value="">Selecione...</option>';
  filmes.forEach((filme, index) => {
    const option = document.createElement('option');
    option.value = index; // Índice utilizado para identificar o filme
    option.text = filme.titulo;
    filmeSelect.appendChild(option);
  });
}

// Carrega as salas no <select> da modal
function loadSalas() {
  const salas = getSalas();
  const salaSelect = document.getElementById('salaSelect');
  salaSelect.innerHTML = '<option value="">Selecione...</option>';
  salas.forEach((sala, index) => {
    const option = document.createElement('option');
    option.value = index; // Índice utilizado para identificar a sala
    option.text = sala.nome;
    salaSelect.appendChild(option);
  });
}

// Atualiza a tabela de sessões EXIBIDAS NA PÁGINA DE CADASTRO
function refreshSessoesTable() {
  // Recupera as sessões, filmes e salas
  let sessoes = getSessoes();
  const filmes = getFilmes();
  const salas = getSalas();

  // Filtra as sessões que são válidas: que tenham filme E sala existentes
  sessoes = sessoes.filter(sessao => {
    return typeof filmes[sessao.filmeIndex] !== 'undefined' && typeof salas[sessao.salaIndex] !== 'undefined';
  });
  // Salva a lista filtrada no localStorage para evitar exibir sessões "órfãs"
  saveSessoes(sessoes);

  // Atualiza a tabela na página
  const tbody = document.getElementById('sessoesTableBody');
  tbody.innerHTML = '';
  sessoes.forEach((sessao, index) => {
    const filmeTitulo = filmes[sessao.filmeIndex].titulo;
    const salaNome = salas[sessao.salaIndex].nome;
    const formattedDateTime = formatBrazilianDateTime(sessao.dataHora);
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${filmeTitulo}</td>
      <td>${salaNome}</td>
      <td>${formattedDateTime}</td>
      <td>${sessao.preco}</td>
      <td>${sessao.idioma}</td>
      <td>${sessao.formato}</td>
      <td>
        <div class="d-flex">
          <button class="btn btn-sm btn-warning me-1" onclick="editSessao(${index})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="deleteSessao(${index})">Excluir</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Manipulação do formulário de cadastro/edição de sessão
document.getElementById('formSessaoModal').addEventListener('submit', function(e) {
  e.preventDefault();
  const sessaoIndexField = document.getElementById('sessaoIndex').value;
  const novaSessao = {
    filmeIndex: document.getElementById('filmeSelect').value,
    salaIndex: document.getElementById('salaSelect').value,
    dataHora: document.getElementById('dataHora').value,
    preco: document.getElementById('preco').value,
    idioma: document.getElementById('idioma').value,
    formato: document.getElementById('formato').value
  };
  
  let sessoes = getSessoes();
  if (sessaoIndexField === "") {
    sessoes.push(novaSessao);
  } else {
    sessoes[sessaoIndexField] = novaSessao;
  }
  saveSessoes(sessoes);
  refreshSessoesTable();
  document.getElementById('formSessaoModal').reset();
  document.getElementById('sessaoIndex').value = "";
  // Fecha a modal automaticamente
  const modalElem = document.getElementById('sessaoModal');
  const modalInstance = bootstrap.Modal.getInstance(modalElem);
  if (modalInstance) modalInstance.hide();
});

function editSessao(index) {
  const sessoes = getSessoes();
  const sessao = sessoes[index];
  document.getElementById('sessaoIndex').value = index;
  loadFilmes();
  loadSalas();
  document.getElementById('filmeSelect').value = sessao.filmeIndex;
  document.getElementById('salaSelect').value = sessao.salaIndex;
  document.getElementById('dataHora').value = sessao.dataHora;
  document.getElementById('preco').value = sessao.preco;
  document.getElementById('idioma').value = sessao.idioma;
  document.getElementById('formato').value = sessao.formato;
  document.getElementById('sessaoModalLabel').innerText = "Editar Sessão";
  const myModal = new bootstrap.Modal(document.getElementById('sessaoModal'));
  myModal.show();
}

function deleteSessao(index) {
  if (confirm("Deseja realmente excluir esta sessão?")) {
    let sessoes = getSessoes();
    sessoes.splice(index, 1);
    saveSessoes(sessoes);
    refreshSessoesTable();
  }
}

// Ao fechar a modal, reseta os campos e o título
document.getElementById('sessaoModal').addEventListener('hidden.bs.modal', function () {
  document.getElementById('formSessaoModal').reset();
  document.getElementById('sessaoIndex').value = "";
  document.getElementById('sessaoModalLabel').innerText = "Cadastrar Sessão";
});

// Ao carregar a página, inicializa os selects e a tabela de sessões
document.addEventListener('DOMContentLoaded', function() {
  loadFilmes();
  loadSalas();
  refreshSessoesTable();
});
