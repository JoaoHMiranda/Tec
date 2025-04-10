// index.js

// Executa quando o documento estiver totalmente carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log("Página inicial carregada com sucesso!");
  
    // Se desejar adicionar alguma funcionalidade interativa à página inicial,
    // como exibir uma mensagem de boas-vindas, configurar eventos dos botões, etc.,
    // você pode fazer isso aqui. Por exemplo:
  
    // Exemplo: Configuração de um botão para redirecionamento (se existir um com id "btnCompra")
    const btnCompra = document.getElementById('btnCompra');
    if (btnCompra) {
      btnCompra.addEventListener('click', function() {
        // Redireciona para a página de venda de ingressos
        window.location.href = 'venda-ingressos.html';
      });
    }
    
    // Outras funções podem ser adicionadas conforme o crescimento do seu projeto
  });
  