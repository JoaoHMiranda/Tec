// Classe Funcionario
class Funcionario {
    constructor(nome, idade, cargo, salario) {
      this._nome = nome;
      this._idade = idade;
      this._cargo = cargo;
      this._salario = salario;
    }
    
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
    
    // Método para retornar os dados em forma de string
    toString = () => `Nome: ${this._nome}, Idade: ${this._idade}, Cargo: ${this._cargo}, Salário: ${this._salario}`;
  }
  
  let funcionarios = [];
  
  // Seleciona os elementos do DOM
  const formFuncionario = document.getElementById("formFuncionario");
  const tabelaFuncionarios = document
    .getElementById("tabelaFuncionarios")
    .querySelector("tbody");
  const relatoriosDiv = document.getElementById("relatorios");
  
  // Evento para cadastro de funcionário
  formFuncionario.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const nome = document.getElementById("nome").value.trim();
    const idade = Number(document.getElementById("idade").value);
    const cargo = document.getElementById("cargo").value.trim();
    const salario = parseFloat(document.getElementById("salario").value);
    
    // Cria o objeto funcionário e adiciona ao array
    const funcionario = new Funcionario(nome, idade, cargo, salario);
    funcionarios.push(funcionario);
    
    alert("Funcionário cadastrado com sucesso!");
    renderTabela();
    formFuncionario.reset();
  });
  
  // Renderiza a tabela de funcionários
  const renderTabela = () => {
    tabelaFuncionarios.innerHTML = "";
    funcionarios.forEach((funcionario) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${funcionario.nome}</td>
        <td>${funcionario.idade}</td>
        <td>${funcionario.cargo}</td>
        <td>${funcionario.salario}</td>
      `;
      tabelaFuncionarios.appendChild(tr);
    });
  };
  
  // 1) Funcionários com salário > R$5000
  document.getElementById("btnSalarioMaior").addEventListener("click", () => {
    const resultado = funcionarios
      .filter(f => f.salario > 5000)
      .map(f => f.toString());
      
    relatoriosDiv.innerHTML = `<h3>Funcionários com salário > R$5000</h3>
      <p>${resultado.length > 0 ? resultado.join("<br>") : "Nenhum funcionário encontrado."}</p>`;
  });
  
  // 2) Média salarial dos funcionários
  document.getElementById("btnMediaSalarial").addEventListener("click", () => {
    if (funcionarios.length === 0) {
      relatoriosDiv.innerHTML = `<h3>Média Salarial</h3><p>Nenhum funcionário cadastrado.</p>`;
      return;
    }
    
    // Usando reduce para somar os salários e calcular a média
    const somaSalarial = funcionarios.reduce((acc, f) => acc + f.salario, 0);
    const mediaSalarial = somaSalarial / funcionarios.length;
    
    relatoriosDiv.innerHTML = `<h3>Média Salarial</h3>
      <p>${mediaSalarial.toFixed(2)}</p>`;
  });
  
  // 3) Funcionários que possuem cargo único (sem repetição)
  document.getElementById("btnCargosUnicos").addEventListener("click", () => {
    // Primeiro, conta a frequência de cada cargo
    const cargoFrequencias = funcionarios.reduce((acc, f) => {
      acc[f.cargo] = (acc[f.cargo] || 0) + 1;
      return acc;
    }, {});
    
    // Filtra apenas os funcionários cujo cargo aparece apenas 1 vez
    const funcionariosCargoUnico = funcionarios.filter(f => cargoFrequencias[f.cargo] === 1);
    
    let html = "<h3>Funcionários com Cargo Único</h3>";
    
    if (funcionariosCargoUnico.length === 0) {
      html += "<p>Nenhum funcionário com cargo único.</p>";
    } else {
      // Monta uma tabela com os funcionários de cargo único
      html += `
        <table border="1">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Idade</th>
              <th>Cargo</th>
              <th>Salário</th>
            </tr>
          </thead>
          <tbody>
      `;
      funcionariosCargoUnico.forEach((f) => {
        html += `
          <tr>
            <td>${f.nome}</td>
            <td>${f.idade}</td>
            <td>${f.cargo}</td>
            <td>${f.salario}</td>
          </tr>
        `;
      });
      html += "</tbody></table>";
    }
    
    relatoriosDiv.innerHTML = html;
  });
  
  // 4) Lista de nomes em maiúsculo, sem repetição
  document.getElementById("btnNomesMaiusculo").addEventListener("click", () => {
    if (funcionarios.length === 0) {
      relatoriosDiv.innerHTML = "<h3>Nomes em Maiúsculo</h3><p>Nenhum funcionário cadastrado.</p>";
      return;
    }
    
    // Mapeia para maiúsculo e remove duplicados com Set
    const nomesMaiusculo = [...new Set(funcionarios.map(f => f.nome.toUpperCase()))];
    
    if (nomesMaiusculo.length === 0) {
      relatoriosDiv.innerHTML = "<h3>Nomes em Maiúsculo</h3><p>Nenhum funcionário cadastrado.</p>";
      return;
    }
    
    // Exibe em uma lista
    let html = "<h3>Nomes em Maiúsculo </h3><ul>";
    nomesMaiusculo.forEach(nome => {
      html += `<li>${nome}</li>`;
    });
    html += "</ul>";
    
    relatoriosDiv.innerHTML = html;
  });
  