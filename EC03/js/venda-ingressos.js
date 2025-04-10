// Função para formatar a data/hora no formato brasileiro (DD/MM/AAAA HH:MM)
function formatBrazilianDateTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  let yearStr = date.getFullYear().toString();
  if (yearStr.length > 5) {
    yearStr = yearStr.substring(0, 5);
  }
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  return `${day}/${month}/${yearStr} ${hours}:${minutes}`;
}

// Funções auxiliares para recuperar e salvar dados no localStorage
function getSessoes() {
  return JSON.parse(localStorage.getItem('sessoes')) || [];
}

function getFilmes() {
  return JSON.parse(localStorage.getItem('filmes')) || [];
}

function getSalas() {
  return JSON.parse(localStorage.getItem('salas')) || [];
}

function getIngressos() {
  return JSON.parse(localStorage.getItem('ingressos')) || [];
}

function saveIngressos(ingressos) {
  localStorage.setItem('ingressos', JSON.stringify(ingressos));
}

// Atualiza a tabela de sessões disponíveis na página de venda
function refreshVendaTable() {
  const sessoes = getSessoes();
  const filmes = getFilmes();
  const salas = getSalas();
  const tbody = document.getElementById('vendaTableBody');
  tbody.innerHTML = '';
  
  sessoes.forEach((sessao, index) => {
    const filmeTitulo = filmes[sessao.filmeIndex] ? filmes[sessao.filmeIndex].titulo : 'Filme não encontrado';
    const salaNome = salas[sessao.salaIndex] ? salas[sessao.salaIndex].nome : 'Sala não encontrada';
    // Utiliza a função para formatar a data/hora
    const formattedDateTime = formatBrazilianDateTime(sessao.dataHora);
    
    // Verifica os assentos disponíveis para a sessão (sem considerar a seleção atual)
    const availableSeats = getAvailableSeatsForSession(index);
    let actionHtml = "";
    if (availableSeats.length > 0) {
      actionHtml = `<button class="btn btn-sm btn-success" onclick="openCompra(${index})">Comprar</button>`;
    } else {
      actionHtml = `<span class="text-danger fw-bold">Esgotado</span>`;
    }
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${filmeTitulo}</td>
      <td>${salaNome}</td>
      <td>${formattedDateTime}</td>
      <td>${sessao.preco}</td>
      <td>${actionHtml}</td>
    `;
    tbody.appendChild(tr);
  });
}

/* ======= FUNÇÕES PARA TRATAR ASSENTOS DISPONÍVEIS E SELEÇÃO MÚLTIPLA ======= */

// Variável global para os assentos selecionados nesta compra (array de strings)
let selectedSeats = [];

/**
 * Calcula os assentos disponíveis para uma sessão.
 * Usa a capacidade da sala (assumindo que os assentos são numerados de 1 até a capacidade)
 * e remove os assentos já vendidos e os que já foram selecionados nesta compra.
 */
function getAvailableSeatsForSession(sessionIndex) {
  const sessoes = getSessoes();
  const sessao = sessoes[sessionIndex];
  
  // Obter dados da sala da sessão
  const salas = getSalas();
  const sala = salas[sessao.salaIndex];
  const capacity = parseInt(sala.capacidade);
  
  // Gerar lista de todos os assentos (de "1" até a capacidade)
  let allSeats = [];
  for (let i = 1; i <= capacity; i++) {
    allSeats.push(i.toString());
  }
  
  // Filtrar os assentos já vendidos para essa sessão
  const ingressos = getIngressos();
  const purchasedSeats = ingressos
    .filter(ing => ing.sessaoIndex === sessionIndex.toString() || ing.sessaoIndex === sessionIndex)
    .flatMap(ing => Array.isArray(ing.assentos) ? ing.assentos : [ing.assento]);
    
  // Retorna os assentos disponíveis, excluindo também os já selecionados nesta compra
  const availableSeats = allSeats.filter(seat => 
    !purchasedSeats.includes(seat) && !selectedSeats.includes(seat)
  );
  return availableSeats;
}

/**
 * Atualiza a lista de sugestões de assentos disponíveis com base no input.
 * Se o campo estiver vazio, exibe todas as opções disponíveis.
 */
function updateAvailableSeatsList() {
  const inputValue = document.getElementById('assento').value;
  const sessionIndex = document.getElementById('sessaoIndexCompra').value;
  const container = document.getElementById('availableSeatsList');
  
  if (!sessionIndex) {
    container.innerHTML = '';
    return;
  }
  
  const availableSeats = getAvailableSeatsForSession(sessionIndex);
  
  // Se houver texto digitado, filtra os assentos; caso contrário, mostra todos disponíveis
  const filteredSeats = inputValue.trim() === "" 
    ? availableSeats 
    : availableSeats.filter(seat => seat.includes(inputValue));
  
  container.innerHTML = '';
  if (filteredSeats.length === 0) {
    container.innerHTML = '<small class="text-danger">Nenhum assento disponível com este padrão.</small>';
    return;
  }
  
  filteredSeats.forEach(seat => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-outline-secondary btn-sm me-1 mb-1';
    btn.innerText = seat;
    btn.onclick = () => {
      addSelectedSeat(seat);
      // Limpa o input e as sugestões após a seleção
      document.getElementById('assento').value = "";
      container.innerHTML = '';
    };
    container.appendChild(btn);
  });
}

/**
 * Atualiza a interface dos assentos selecionados, exibindo cada um como badge com botão "x" para remoção.
 * Também atualiza o valor total da compra.
 */
function updateSelectedSeatsUI() {
  const container = document.getElementById('selectedSeatsContainer');
  container.innerHTML = '';
  selectedSeats.forEach(seat => {
    const span = document.createElement('span');
    span.className = 'badge bg-primary me-1 mb-1';
    span.innerText = seat + " ";
    
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn-close btn-close-white btn-sm align-middle';
    removeBtn.onclick = () => {
      removeSelectedSeat(seat);
    };
    span.appendChild(removeBtn);
    container.appendChild(span);
  });
  // Atualiza o total da compra
  updateTotal();
}

/**
 * Calcula e exibe o valor total da compra: preço da sessão multiplicado pela quantidade de assentos selecionados.
 */
function updateTotal() {
  const sessionIndex = document.getElementById('sessaoIndexCompra').value;
  const totalContainer = document.getElementById('totalPrice');
  
  if (!sessionIndex) {
    totalContainer.innerText = "";
    return;
  }
  
  const sessoes = getSessoes();
  const sessao = sessoes[sessionIndex];
  const ticketPrice = parseFloat(sessao.preco);
  const total = selectedSeats.length * ticketPrice;
  totalContainer.innerText = "Total: R$ " + total.toFixed(2);
}

/**
 * Adiciona um assento ao array de selecionados (se não duplicado) e atualiza a interface.
 */
function addSelectedSeat(seat) {
  if (!selectedSeats.includes(seat)) {
    selectedSeats.push(seat);
    updateSelectedSeatsUI();
    updateAvailableSeatsList();
  }
}

/**
 * Remove um assento do array de selecionados e atualiza a interface.
 */
function removeSelectedSeat(seat) {
  selectedSeats = selectedSeats.filter(s => s !== seat);
  updateSelectedSeatsUI();
  updateAvailableSeatsList();
}

/* ======= FIM DAS FUNÇÕES DE ASSENTOS ======= */

// Abre a modal de compra: reseta a seleção e exibe os assentos disponíveis
function openCompra(index) {
  document.getElementById('sessaoIndexCompra').value = index;
  document.getElementById('assento').value = "";
  selectedSeats = [];
  updateSelectedSeatsUI();
  updateAvailableSeatsList();
  
  const myModal = new bootstrap.Modal(document.getElementById('ingressoModal'));
  myModal.show();
}

// Atualiza as sugestões enquanto o usuário digita no input
document.getElementById('assento').addEventListener('input', updateAvailableSeatsList);
// Ao focar no campo, se estiver vazio, exibe todas as opções disponíveis
document.getElementById('assento').addEventListener('focus', updateAvailableSeatsList);

// Evento de envio do formulário para compra de ingresso
document.getElementById('formIngressoModal').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Validação do CPF: somente números e exatamente 11 dígitos
  const cpf = document.getElementById('cpf').value.trim();
  if (!/^\d{11}$/.test(cpf)) {
    alert('Por favor, insira um CPF válido com 11 dígitos numéricos.');
    return;
  }
  
  // Verifica se pelo menos um assento foi selecionado
  if (selectedSeats.length === 0) {
    alert('Por favor, selecione ao menos um assento.');
    return;
  }
  
  const sessaoIndex = document.getElementById('sessaoIndexCompra').value;
  // Cria o ingresso com o array de assentos selecionados
  const ingresso = {
    sessaoIndex: sessaoIndex,
    nomeCliente: document.getElementById('nomeCliente').value,
    cpf: cpf,
    assentos: selectedSeats,
    pagamento: document.getElementById('pagamento').value
  };
  
  let ingressos = getIngressos();
  ingressos.push(ingresso);
  saveIngressos(ingressos);
  alert('Ingresso(s) comprado(s) com sucesso!');
  
  // Reseta o formulário, a seleção e o total exibido
  document.getElementById('formIngressoModal').reset();
  selectedSeats = [];
  updateSelectedSeatsUI();
  document.getElementById('availableSeatsList').innerHTML = '';
  document.getElementById('totalPrice').innerText = "";
  
  const modalElement = document.getElementById('ingressoModal');
  const modal = bootstrap.Modal.getInstance(modalElement);
  modal.hide();
});

// Quando a modal é fechada, reseta os campos, a seleção e o total
document.addEventListener('DOMContentLoaded', function() {
  refreshVendaTable();
  const ingressoModalEl = document.getElementById('ingressoModal');
  ingressoModalEl.addEventListener('hidden.bs.modal', function () {
    document.getElementById('formIngressoModal').reset();
    document.getElementById('sessaoIndexCompra').value = '';
    selectedSeats = [];
    updateSelectedSeatsUI();
    document.getElementById('availableSeatsList').innerHTML = '';
    document.getElementById('totalPrice').innerText = "";
  });
});
