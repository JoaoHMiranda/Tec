// Classe Funcionario com métodos de acesso, setters e toString()
class Funcionario {
    constructor(nome, idade, cargo, salario) {
      this._nome = nome;
      this._idade = idade;
      this._cargo = cargo;
      this._salario = salario;
    }
    
    // Getters
    get nome() {
      return this._nome;
    }
    get idade() {
      return this._idade;
    }
    get cargo() {
      return this._cargo;
    }
    get salario() {
      return this._salario;
    }
    
    // Setters
    set nome(nome) {
      this._nome = nome;
    }
    set idade(idade) {
      this._idade = idade;
    }
    set cargo(cargo) {
      this._cargo = cargo;
    }
    set salario(salario) {
      this._salario = salario;
    }
    
    // Método que retorna os dados do funcionário como string
    toString() {
      return `Nome: ${this._nome}, Idade: ${this._idade}, Cargo: ${this._cargo}, Salário: ${this._salario}`;
    }
  }
  
  let funcionarios = [];
  let indiceEdicao = -1; // -1 indica que não está em modo de edição
  
  // Seleciona os elementos do HTML
  const formFuncionario = document.getElementById("formFuncionario");
  const tabelaFuncionarios = document.getElementById("tabelaFuncionarios").getElementsByTagName("tbody")[0];
  
  // Evento do formulário
  formFuncionario.addEventListener("submit", (event) => {
    event.preventDefault();
    
    // Coleta dos valores do formulário
    const nome = document.getElementById("nome").value.trim();
    const idade = Number(document.getElementById("idade").value);
    const cargo = document.getElementById("cargo").value.trim();
    const salario = parseFloat(document.getElementById("salario").value);
    
    if (indiceEdicao >= 0) {
      // Atualiza os dados do funcionário utilizando setters
      funcionarios[indiceEdicao].nome = nome;
      funcionarios[indiceEdicao].idade = idade;
      funcionarios[indiceEdicao].cargo = cargo;
      funcionarios[indiceEdicao].salario = salario;
      alert("Funcionário atualizado com sucesso!");
      indiceEdicao = -1;
    } else {
      // Verifica duplicidade: mesmo nome e cargo
      const duplicado = funcionarios.find(f => 
        f.nome.toLowerCase() === nome.toLowerCase() &&
        f.cargo.toLowerCase() === cargo.toLowerCase()
      );
      if (duplicado) {
        alert("Funcionário já cadastrado com este nome e cargo. Edite ou exclua o registro existente.");
        return;
      }
      
      // Cria e adiciona um novo funcionário
      const funcionario = new Funcionario(nome, idade, cargo, salario);
      funcionarios.push(funcionario);
      alert("Funcionário cadastrado com sucesso!");
    }
    
    renderTabela();
    formFuncionario.reset();
  });
  
  // Renderiza a tabela de funcionários
  function renderTabela() {
    tabelaFuncionarios.innerHTML = "";
    funcionarios.forEach((funcionario, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${funcionario.nome}</td>
        <td>${funcionario.idade}</td>
        <td>${funcionario.cargo}</td>
        <td>${funcionario.salario}</td>
        <td>
          <button onclick="(function(){ editar(${index}); })()">Editar</button>
          <button onclick="(function(){ excluir(${index}); })()">Excluir</button>
        </td>
      `;
      tabelaFuncionarios.appendChild(tr);
    });
  }
  
  // Função para excluir funcionário
  function excluir(index) {
    funcionarios.splice(index, 1);
    alert("Funcionário excluído com sucesso!");
    renderTabela();
  }
  
  // Função para carregar os dados do funcionário no formulário para edição
  function editar(index) {
    const funcionario = funcionarios[index];
    document.getElementById("nome").value = funcionario.nome;
    document.getElementById("idade").value = funcionario.idade;
    document.getElementById("cargo").value = funcionario.cargo;
    document.getElementById("salario").value = funcionario.salario;
    
    indiceEdicao = index;
    alert("Editando funcionário. Faça as alterações e clique em Cadastrar / Atualizar.");
  }
  