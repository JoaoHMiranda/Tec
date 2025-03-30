// Classe Funcionario
class Funcionario {
    constructor(nome, idade, cargo, salario) {
      this._nome = nome;
      this._idade = idade;
      this._cargo = cargo;
      this._salario = salario;
    }
    
    // Getters
    get nome() { return this._nome; }
    get idade() { return this._idade; }
    get cargo() { return this._cargo; }
    get salario() { return this._salario; }
    
    // Setters
    set nome(nome) { this._nome = nome; }
    set idade(idade) { this._idade = idade; }
    set cargo(cargo) { this._cargo = cargo; }
    set salario(salario) { this._salario = salario; }
    
    // Método para retornar os dados como string
    toString = () => `Nome: ${this._nome}, Idade: ${this._idade}, Cargo: ${this._cargo}, Salário: ${this._salario}`;
  }
  
  let funcionarios = [];
  let indiceEdicao = -1; // -1 significa que não está em modo de edição
  
  // Seleção dos elementos
  const formFuncionario = document.getElementById("formFuncionario");
  const tabelaFuncionarios = document.getElementById("tabelaFuncionarios").querySelector("tbody");
  
  // Evento de submit usando arrow function
  formFuncionario.addEventListener("submit", (event) => {
    event.preventDefault();
    
    // Coleta dos dados usando arrow functions para conversões
    const nome = document.getElementById("nome").value.trim();
    const idade = Number(document.getElementById("idade").value);
    const cargo = document.getElementById("cargo").value.trim();
    const salario = parseFloat(document.getElementById("salario").value);
    
    // Se estiver em modo de edição, atualiza utilizando os setters com arrow functions
    if (indiceEdicao >= 0) {
      funcionarios[indiceEdicao].nome = nome;
      funcionarios[indiceEdicao].idade = idade;
      funcionarios[indiceEdicao].cargo = cargo;
      funcionarios[indiceEdicao].salario = salario;
      alert("Funcionário atualizado com sucesso!");
      indiceEdicao = -1;
    } else {
      // Usando arrow function no método find para verificar duplicidade
      const duplicado = funcionarios.find(f => 
        f.nome.toLowerCase() === nome.toLowerCase() &&
        f.cargo.toLowerCase() === cargo.toLowerCase()
      );
      if (duplicado) {
        alert("Funcionário já cadastrado com este nome e cargo. Edite ou exclua o registro existente.");
        return;
      }
      // Cria um novo funcionário e adiciona ao array
      const funcionario = new Funcionario(nome, idade, cargo, salario);
      funcionarios.push(funcionario);
      alert("Funcionário cadastrado com sucesso!");
    }
    
    renderTabela();
    formFuncionario.reset();
  });
  
  // Função para renderizar a tabela utilizando arrow functions
  const renderTabela = () => {
    tabelaFuncionarios.innerHTML = "";
    funcionarios.forEach((funcionario, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${funcionario.nome}</td>
        <td>${funcionario.idade}</td>
        <td>${funcionario.cargo}</td>
        <td>${funcionario.salario}</td>
        <td>
          <button onclick="editar(${index})">Editar</button>
          <button onclick="excluir(${index})">Excluir</button>
        </td>
      `;
      tabelaFuncionarios.appendChild(tr);
    });
  };
  
  // Função para excluir um funcionário utilizando arrow function
  const excluir = (index) => {
    funcionarios = funcionarios.filter((_, i) => i !== index); // Arrow function no filter
    alert("Funcionário excluído com sucesso!");
    renderTabela();
  };
  
  // Função para editar um funcionário
  const editar = (index) => {
    const funcionario = funcionarios[index];
    document.getElementById("nome").value = funcionario.nome;
    document.getElementById("idade").value = funcionario.idade;
    document.getElementById("cargo").value = funcionario.cargo;
    document.getElementById("salario").value = funcionario.salario;
    
    indiceEdicao = index;
    alert("Editando funcionário. Faça as alterações e clique em Cadastrar / Atualizar.");
  };
  
  /*
  Exemplo de substituição de função anônima tradicional por arrow function:
  
  Tradicional:
  document.getElementById("btnExemplo").addEventListener("click", function() {
    console.log("Clique detectado!");
  });
  
  Arrow Function:
  document.getElementById("btnExemplo").addEventListener("click", () => {
    console.log("Clique detectado!");
  });
  */
  