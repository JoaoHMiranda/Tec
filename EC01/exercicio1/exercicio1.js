const alunos = [];

document.getElementById('formAluno').addEventListener('submit', function(event) {
  event.preventDefault();
  const nome = document.getElementById('nome').value;
  const idade = parseInt(document.getElementById('idade').value);
  const curso = document.getElementById('curso').value;
  const notaFinal = parseFloat(document.getElementById('notaFinal').value);

  // Verifica se já existe um aluno com o mesmo nome e curso
  const alunoExistente = alunos.find(a => a.nome === nome && a.curso === curso);
  if (alunoExistente) {
    alert("Este aluno já tem uma nota cadastrada para esse curso. " +
          "Exclua ou edite o registro antes de inserir novamente.");
    return; // Interrompe o cadastro
  }

  // Caso não exista, prossegue normalmente
  const aluno = { nome, idade, curso, notaFinal };
  alunos.push(aluno);
  renderTabela();
  this.reset();
});

function renderTabela() {
  const tbody = document.getElementById('tabelaAlunos');
  tbody.innerHTML = '';

  alunos.forEach((aluno, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${aluno.nome}</td>
      <td>${aluno.idade}</td>
      <td>${aluno.curso}</td>
      <td>${aluno.notaFinal}</td>
      <td>
        <button onclick="editarAluno(${index})">Editar</button>
        <button onclick="excluirAluno(${index})">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function excluirAluno(index) {
  alunos.splice(index, 1);
  renderTabela();
}

function editarAluno(index) {
  const aluno = alunos[index];
  document.getElementById('nome').value = aluno.nome;
  document.getElementById('idade').value = aluno.idade;
  document.getElementById('curso').value = aluno.curso;
  document.getElementById('notaFinal').value = aluno.notaFinal;

  // Remove o registro antigo para que o novo cadastro seja atualizado
  alunos.splice(index, 1);
  renderTabela();
}
