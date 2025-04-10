document.getElementById('formSalaModal').addEventListener('submit', function(e) {
  e.preventDefault();
  const sala = {
    nome: document.getElementById('nomeSala').value,
    capacidade: document.getElementById('capacidade').value,
    tipo: document.getElementById('tipoSala').value
  };
  
  let salas = JSON.parse(localStorage.getItem('salas')) || [];
  const index = document.getElementById('salaIndex').value;
  if (index === "") {
    salas.push(sala);
  } else {
    salas[index] = sala;
  }
  localStorage.setItem('salas', JSON.stringify(salas));
  refreshSalasTable();
  document.getElementById('formSalaModal').reset();
  document.getElementById('salaIndex').value = "";
  const modalElem = document.getElementById('salaModal');
  const modalInstance = bootstrap.Modal.getInstance(modalElem);
  if (modalInstance) modalInstance.hide();
});

function refreshSalasTable() {
  const salas = JSON.parse(localStorage.getItem('salas')) || [];
  const tbody = document.getElementById('salasTableBody');
  tbody.innerHTML = '';
  salas.forEach((sala, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${sala.nome}</td>
      <td>${sala.capacidade}</td>
      <td>${sala.tipo}</td>
      <td>
        <div class="d-flex">
          <button class="btn btn-sm btn-warning me-1" onclick="editSala(${index})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="deleteSala(${index})">Excluir</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function editSala(index) {
  const salas = JSON.parse(localStorage.getItem('salas')) || [];
  const sala = salas[index];
  document.getElementById('salaIndex').value = index;
  document.getElementById('nomeSala').value = sala.nome;
  document.getElementById('capacidade').value = sala.capacidade;
  document.getElementById('tipoSala').value = sala.tipo;
  document.getElementById('salaModalLabel').innerText = "Editar Sala";
  const myModal = new bootstrap.Modal(document.getElementById('salaModal'));
  myModal.show();
}

function deleteSala(index) {
  if (confirm("Deseja realmente excluir esta sala?")) {
    let salas = JSON.parse(localStorage.getItem('salas')) || [];
    salas.splice(index, 1);
    localStorage.setItem('salas', JSON.stringify(salas));
    refreshSalasTable();
  }
}

document.addEventListener('DOMContentLoaded', function() {
  refreshSalasTable();
});
