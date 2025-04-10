// Atualiza a tabela de filmes
function refreshFilmesTable() {
  let filmes = JSON.parse(localStorage.getItem('filmes')) || [];
  const tbody = document.getElementById('filmesTableBody');
  tbody.innerHTML = '';
  filmes.forEach((filme, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${filme.titulo}</td>
      <td>${filme.descricao}</td>
      <td>${filme.genero}</td>
      <td>${filme.classificacao}</td>
      <td>${filme.duracao}</td>
      <td>${filme.estreia}</td>
      <td>
        <div class="d-flex">
          <button class="btn btn-sm btn-warning me-1" onclick="editFilme(${index})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="deleteFilme(${index})">Excluir</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Função auxiliar para ler a imagem e retornar uma Promise com o DataURL
function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      resolve(e.target.result);
    };
    reader.onerror = function(e) {
      reject(e);
    };
    reader.readAsDataURL(file);
  });
}

// Ao submeter o formulário, salva ou atualiza o filme (com imagem, se selecionada) e fecha a modal automaticamente
document.getElementById('formFilmeModal').addEventListener('submit', async function(e) {
  e.preventDefault();

  const filme = {
    titulo: document.getElementById('titulo').value,
    descricao: document.getElementById('descricao').value,
    genero: document.getElementById('genero').value,
    classificacao: document.getElementById('classificacao').value,
    duracao: document.getElementById('duracao').value,
    estreia: document.getElementById('estreia').value,
    imagem: "" // Será preenchido se houver imagem
  };

  const imagemInput = document.getElementById('imagemFilme');
  if (imagemInput.files && imagemInput.files[0]) {
    try {
      filme.imagem = await readImageFile(imagemInput.files[0]);
    } catch (error) {
      console.error("Erro ao ler a imagem:", error);
    }
  }

  let filmes = JSON.parse(localStorage.getItem('filmes')) || [];
  const index = document.getElementById('filmeIndex').value;
  if (index === "") {
    filmes.push(filme);
  } else {
    filmes[index] = filme;
  }
  localStorage.setItem('filmes', JSON.stringify(filmes));
  refreshFilmesTable();
  document.getElementById('formFilmeModal').reset();
  document.getElementById('filmeIndex').value = "";
  // Fecha a modal automaticamente
  const modalElem = document.getElementById('filmeModal');
  const modalInstance = bootstrap.Modal.getInstance(modalElem);
  if (modalInstance) modalInstance.hide();
});

function editFilme(index) {
  let filmes = JSON.parse(localStorage.getItem('filmes')) || [];
  const filme = filmes[index];
  document.getElementById('filmeIndex').value = index;
  document.getElementById('titulo').value = filme.titulo;
  document.getElementById('descricao').value = filme.descricao;
  document.getElementById('genero').value = filme.genero;
  document.getElementById('classificacao').value = filme.classificacao;
  document.getElementById('duracao').value = filme.duracao;
  document.getElementById('estreia').value = filme.estreia;
  // Nota: o campo de imagem não é preenchido automaticamente por questões de segurança.
  document.getElementById('filmeModalLabel').innerText = "Editar Filme";
  const myModal = new bootstrap.Modal(document.getElementById('filmeModal'));
  myModal.show();
}

function deleteFilme(index) {
  if (confirm("Deseja realmente excluir este filme?")) {
    let filmes = JSON.parse(localStorage.getItem('filmes')) || [];
    filmes.splice(index, 1);
    localStorage.setItem('filmes', JSON.stringify(filmes));
    refreshFilmesTable();
  }
}

document.addEventListener('DOMContentLoaded', function() {
  refreshFilmesTable();
});
