// Função para formatar a data e hora no formato brasileiros
function formatBrazilianDateTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear().toString().substring(0, 4); // 4 dígitos
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// Funções para recuperar os dados do localStorage
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

// Calcula a quantidade de assentos disponíveis para uma sessão
function getAvailableSeatsCount(sessionIndex) {
  const sessoes = getSessoes();
  const salas = getSalas();
  const ingressos = getIngressos();
  const sessao = sessoes[sessionIndex];
  if (!sessao) return 0;
  const sala = salas[sessao.salaIndex];
  const capacity = parseInt(sala.capacidade);
  let sold = 0;
  ingressos.forEach(ing => {
    if (ing.sessaoIndex == sessionIndex) {
      if (Array.isArray(ing.assentos))
        sold += ing.assentos.length;
      else
        sold += 1;
    }
  });
  return Math.max(capacity - sold, 0);
}

// Cria os cartões para cada sessão e os insere no container
function refreshSessoesDisponiveisCards() {
  const sessoes = getSessoes();
  const filmes = getFilmes();
  const salas = getSalas();
  const container = document.getElementById('sessoesDisponiveisContainer');
  container.innerHTML = "";
  
  sessoes.forEach((sessao, index) => {
    const filme = filmes[sessao.filmeIndex];
    const filmeTitulo = filme ? filme.titulo : "Filme não encontrado";
    const salaNome = salas[sessao.salaIndex] ? salas[sessao.salaIndex].nome : "Sala não encontrada";
    const formattedDateTime = formatBrazilianDateTime(sessao.dataHora);
    const available = getAvailableSeatsCount(index);
    
    let actionHtml = "";
    if (available > 0) {
      // Ao clicar em "Comprar", o usuário é redirecionado para a página de compra
      actionHtml = `<button class="btn btn-sm btn-success" onclick="openCompraModal(${index})">Comprar</button>`;
    } else {
      actionHtml = `<span class="text-danger fw-bold">Esgotado</span>`;
    }
    
    // Se o filme possuir uma imagem cadastrada, use-a como fundo
    let cardContent = "";
    if (filme && filme.imagem) {
      cardContent = `
        <img src="${filme.imagem}" class="card-img" alt="${filmeTitulo}" style="object-fit: cover; height: 100%;">
        <div class="card-img-overlay-custom">
          <h5 class="card-title">${filmeTitulo}</h5>
          <p class="card-text"><strong>Sala:</strong> ${salaNome}</p>
          <p class="card-text"><strong>Data/Hora:</strong> ${formattedDateTime}</p>
          <p class="card-text"><strong>Preço:</strong> R$ ${sessao.preco}</p>
          <p class="card-text"><strong>Disponíveis:</strong> ${available}</p>
          <div class="text-center mt-2">
            ${actionHtml}
          </div>
        </div>
      `;
    } else {
      // Se não houver imagem, utilize um card tradicional com fundo padrão
      cardContent = `
        <div class="card-body card-no-image">
          <h5 class="card-title">${filmeTitulo}</h5>
          <p class="card-text"><strong>Sala:</strong> ${salaNome}</p>
          <p class="card-text"><strong>Data/Hora:</strong> ${formattedDateTime}</p>
          <p class="card-text"><strong>Preço:</strong> R$ ${sessao.preco}</p>
          <p class="card-text"><strong>Disponíveis:</strong> ${available}</p>
        </div>
        <div class="card-footer text-center">
          ${actionHtml}
        </div>
      `;
    }
    
    // Cria uma coluna para o cartão
    const colDiv = document.createElement('div');
    colDiv.className = "col-md-4 mb-3";
    
    const cardDiv = document.createElement('div');
    cardDiv.className = "card h-100 shadow-sm";
    cardDiv.innerHTML = cardContent;
    
    colDiv.appendChild(cardDiv);
    container.appendChild(colDiv);
  });
}

// Função que, ao clicar em "Comprar", redireciona diretamente para a tela de compra com a sessão selecionada
function openCompraModal(sessionIndex) {
  window.location.href = `venda-ingressos.html?sessao=${sessionIndex}`;
}

document.addEventListener('DOMContentLoaded', function(){
  refreshSessoesDisponiveisCards();
});
