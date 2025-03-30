function mostrarNome() {
    let nome = document.getElementById('nome').value;
    let resposta = document.getElementById('resposta');
    resposta.textContent = 'Olá, ' + nome.toUpperCase() + '!';
}
let botao = document.getElementById('botao');
botao.addEventListener('click', mostrarNome);