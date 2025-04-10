// index.js

// Executa quando o documento estiver totalmente carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log("Página inicial carregada com sucesso!");
  
    const btnCompra = document.getElementById('btnCompra');
    if (btnCompra) {
      btnCompra.addEventListener('click', function() {
        // Redireciona para a página de venda de ingressos
        window.location.href = 'venda-ingressos.html';
      });
    }
  });
  