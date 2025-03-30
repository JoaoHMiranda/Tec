// Definição da classe Funcionario com construtor, getters, setters e toString()
class Funcionario {
    constructor(nome, idade, cargo, salario) {
      this._nome = nome;
      this._idade = idade;
      this._cargo = cargo;
      this._salario = salario;
    }
    
    // Métodos de acesso (getters)
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
    
    // Métodos de acesso (setters)
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
  
  // Seleciona os elementos do HTML
  const formFuncionario = document.getElementById("formFuncionario");
  const tabelaFuncionarios = document.getElementById("tabelaFuncionarios").getElementsByTagName("tbody")[0];
  
  // Evento de cadastro de funcionário
  formFuncionario.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const nome = document.getElementById("nome").value.trim();
    const idade = Number(document.getElementById("idade").value);
    const cargo = document.getElementById("cargo").value.trim();
    const salario = parseFloat(document.getElementById("salario").value);
    
    // Verifica duplicidade: mesmo nome e mesmo cargo
    const duplicado = funcionarios.find(f => 
      f.nome.toLowerCase() === nome.toLowerCase() && 
      f.cargo.toLowerCase() === cargo.toLowerCase()
    );
    
    if (duplicado) {
      alert("Funcionário já cadastrado com este nome e cargo. Edite ou exclua o registro existente.");
      return;
    }
    
    const funcionario = new Funcionario(nome, idade, cargo, salario);
    funcionarios.push(funcionario);
    alert("Funcionário cadastrado com sucesso!");
    renderTabela();
    formFuncionario.reset();
  });
  
  // Função para renderizar a tabela de funcionários
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
          <button class="editar" data-index="${index}">Editar</button>
          <button class="excluir" data-index="${index}">Excluir</button>
        </td>
      `;
      tabelaFuncionarios.appendChild(tr);
    });
  
    // Eventos para exclusão
    document.querySelectorAll(".excluir").forEach(button => {
      button.addEventListener("click", (e) => {
        const index = e.target.getAttribute("data-index");
        funcionarios.splice(index, 1);
        alert("Funcionário excluído com sucesso!");
        renderTabela();
      });
    });
  
    // Eventos para edição
    document.querySelectorAll(".editar").forEach(button => {
      button.addEventListener("click", (e) => {
        const index = e.target.getAttribute("data-index");
        const funcionario = funcionarios[index];
        
        // Preenche o formulário com os dados do funcionário para edição
        document.getElementById("nome").value = funcionario.nome;
        document.getElementById("idade").value = funcionario.idade;
        document.getElementById("cargo").value = funcionario.cargo;
        document.getElementById("salario").value = funcionario.salario;
        
        // Remove o funcionário do array para permitir a atualização
        funcionarios.splice(index, 1);
        alert("Editando funcionário. Faça as alterações e clique em Cadastrar.");
        renderTabela();
      });
    });
  }
  