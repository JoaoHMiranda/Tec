let alunos = [];

const formAluno = document.getElementById('formAluno');
const tabelaAlunos = document.getElementById('tabelaAlunos');

formAluno.addEventListener('submit', (event) => {
  event.preventDefault();

  const aluno = {
    nome: document.getElementById('nome').value,
    idade: Number(document.getElementById('idade').value),
    curso: document.getElementById('curso').value,
    notaFinal: parseFloat(document.getElementById('notaFinal').value)
  };

  // Verifica se já existe um aluno com o mesmo nome e curso
  const alunoExistente = alunos.find(a => a.nome === aluno.nome && a.curso === aluno.curso);
  if (alunoExistente) {
    alert("Este aluno já tem uma nota cadastrada para esse curso. " +
          "Exclua ou edite o registro antes de inserir novamente.");
    return; // Interrompe o cadastro se for duplicado
  }

  // Caso não seja duplicado, cadastra normalmente
  alunos.push(aluno);
  alert('Aluno cadastrado com sucesso!');
  renderTabela();
  formAluno.reset();
});

const renderTabela = () => {
  tabelaAlunos.innerHTML = '';
  
  alunos.forEach((aluno, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${aluno.nome}</td>
      <td>${aluno.idade}</td>
      <td>${aluno.curso}</td>
      <td>${aluno.notaFinal}</td>
      <td>
        <button class="editar" data-index="${index}">Editar</button>
        <button class="excluir" data-index="${index}">Excluir</button>
      </td>
    `;
    tabelaAlunos.appendChild(tr);
  });

  // Evento para Excluir
  document.querySelectorAll('.excluir').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      alunos.splice(index, 1);
      alert('Aluno excluído!');
      renderTabela();
    });
  });

  // Evento para Editar
  document.querySelectorAll('.editar').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      const aluno = alunos[index];
      
      // Preenche o formulário com os dados do aluno
      document.getElementById('nome').value = aluno.nome;
      document.getElementById('idade').value = aluno.idade;
      document.getElementById('curso').value = aluno.curso;
      document.getElementById('notaFinal').value = aluno.notaFinal;

      // Remove o registro antigo
      alunos.splice(index, 1);
      alert('Editando aluno. Faça as alterações e cadastre novamente.');
      renderTabela();
    });
  });
};
