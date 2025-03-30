let alunos = [];

const formAluno = document.getElementById("formAluno");
const tabelaAlunos = document.getElementById("tabelaAlunos");
const relatorio = document.getElementById("relatorio");

// CADASTRO DE ALUNOS (CREATE/UPDATE)
formAluno.addEventListener("submit", (event) => {
  event.preventDefault();
  
  const aluno = {
    nome: document.getElementById("nome").value.trim(),
    idade: Number(document.getElementById("idade").value),
    curso: document.getElementById("curso").value,
    notaFinal: parseFloat(document.getElementById("notaFinal").value)
  };
  
  // Verifica duplicado: mesmo nome + mesmo curso
  const duplicado = alunos.find(a => 
    a.nome.toLowerCase() === aluno.nome.toLowerCase() &&
    a.curso === aluno.curso
  );
  if (duplicado) {
    alert("Este aluno já está cadastrado neste curso. Edite ou exclua o registro existente.");
    return;
  }
  
  alunos.push(aluno);
  alert("Aluno cadastrado com sucesso!");
  renderTabela();
  formAluno.reset();
});

// RENDERIZA A TABELA PRINCIPAL (READ)
function renderTabela() {
  tabelaAlunos.innerHTML = "";
  alunos.forEach((aluno, index) => {
    const tr = document.createElement("tr");
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

  // Atribui eventos de Edição e Exclusão aos botões criados
  document.querySelectorAll(".excluir").forEach(button => {
    button.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      alunos.splice(index, 1); // DELETE
      alert("Aluno excluído com sucesso!");
      renderTabela();
    });
  });

  document.querySelectorAll(".editar").forEach(button => {
    button.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      const aluno = alunos[index];
      
      // Preenche o formulário com os dados do aluno
      document.getElementById("nome").value = aluno.nome;
      document.getElementById("idade").value = aluno.idade;
      document.getElementById("curso").value = aluno.curso;
      document.getElementById("notaFinal").value = aluno.notaFinal;
      
      // Remove o aluno do array para permitir atualização
      alunos.splice(index, 1);
      alert("Editando aluno. Faça as alterações e clique em Cadastrar.");
      renderTabela();
    });
  });
}

// LISTAR ALUNOS APROVADOS (≥ 7)
document.getElementById("btnAprovados").addEventListener("click", () => {
  const aprovados = alunos.filter(a => a.notaFinal >= 7);

  let html = "<h3>Alunos Aprovados</h3>";
  
  if (aprovados.length === 0) {
    html += "<p>Nenhum aluno aprovado.</p>";
  } else {
    html += `
      <table border="1">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Idade</th>
            <th>Curso</th>
            <th>Nota Final</th>
          </tr>
        </thead>
        <tbody>
    `;
    aprovados.forEach((aluno) => {
      html += `
        <tr>
          <td>${aluno.nome}</td>
          <td>${aluno.idade}</td>
          <td>${aluno.curso}</td>
          <td>${aluno.notaFinal}</td>
        </tr>
      `;
    });
    html += "</tbody></table>";
  }
  
  relatorio.innerHTML = html;
});

// MÉDIA DAS NOTAS FINAIS
document.getElementById("btnMediaNotas").addEventListener("click", () => {
  if (alunos.length === 0) {
    relatorio.innerHTML = "<h3>Média das Notas Finais</h3><p>Nenhum aluno cadastrado.</p>";
    return;
  }
  
  const somaNotas = alunos.reduce((acc, a) => acc + a.notaFinal, 0);
  const mediaNotas = somaNotas / alunos.length;
  
  relatorio.innerHTML = `
    <h3>Média das Notas Finais</h3>
    <p>${mediaNotas.toFixed(2)}</p>
  `;
});

// MÉDIA DAS IDADES
document.getElementById("btnMediaIdades").addEventListener("click", () => {
  if (alunos.length === 0) {
    relatorio.innerHTML = "<h3>Média das Idades</h3><p>Nenhum aluno cadastrado.</p>";
    return;
  }
  
  const somaIdades = alunos.reduce((acc, a) => acc + a.idade, 0);
  const mediaIdades = somaIdades / alunos.length;
  
  relatorio.innerHTML = `
    <h3>Média das Idades</h3>
    <p>${mediaIdades.toFixed(2)}</p>
  `;
});

// LISTA DE NOMES EM ORDEM ALFABÉTICA, SEM REPETIÇÃO
document.getElementById("btnNomesOrdem").addEventListener("click", () => {
  if (alunos.length === 0) {
    relatorio.innerHTML = "<h3>Nomes em Ordem Alfabética</h3><p>Nenhum aluno cadastrado.</p>";
    return;
  }
  
  // Coleta todos os nomes
  const todosNomes = alunos.map(a => a.nome);
  
  // Remove duplicados, ignorando maiúsculas/minúsculas
  const nomesUnicos = [];
  todosNomes.forEach(nome => {
    if (!nomesUnicos.some(n => n.toLowerCase() === nome.toLowerCase())) {
      nomesUnicos.push(nome);
    }
  });

  // Ordena ignorando maiúsculas/minúsculas
  nomesUnicos.sort((a, b) => a.localeCompare(b, "pt-BR", { sensitivity: "base" }));
  
  let html = "<h3>Nomes em Ordem Alfabética</h3><ul>";
  nomesUnicos.forEach(nome => {
    html += `<li>${nome}</li>`;
  });
  html += "</ul>";
  
  relatorio.innerHTML = html;
});

// CONTAGEM DE ALUNOS POR CURSO
document.getElementById("btnContagemCurso").addEventListener("click", () => {
  if (alunos.length === 0) {
    relatorio.innerHTML = "<h3>Contagem por Curso</h3><p>Nenhum aluno cadastrado.</p>";
    return;
  }
  
  const contagem = alunos.reduce((acc, a) => {
    acc[a.curso] = (acc[a.curso] || 0) + 1;
    return acc;
  }, {});
  
  let html = "<h3>Contagem por Curso</h3>";
  for (const curso in contagem) {
    html += `<p>${curso}: ${contagem[curso]}</p>`;
  }
  
  relatorio.innerHTML = html;
});
