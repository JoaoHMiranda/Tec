import { Link } from 'react-router-dom';

export default function Home() {
  const botoes = [
    { caminho: '/cadastro-filmes', texto: 'Cadastro de Filmes', cor: 'btn-danger' },
    { caminho: '/cadastro-salas', texto: 'Cadastro de Salas', cor: 'btn-secondary' },
    { caminho: '/cadastro-sessoes', texto: 'Cadastro de Sessões', cor: 'btn-warning' },
    { caminho: '/venda-ingressos', texto: 'Venda de Ingressos', cor: 'btn-success' },
    { caminho: '/sessoes', texto: 'Listagem de Sessões', cor: 'btn-info' }
  ];

  return (
    <div className="text-center">
      <h1 className="mb-4">Bem-vindo ao Sistema de Cinema</h1>
      <div className="d-grid gap-3 col-10 col-sm-8 col-md-6 col-lg-4 mx-auto">
        {botoes.map((btn, index) => (
          <Link to={btn.caminho} key={index} className={`btn ${btn.cor} btn-lg`}>
            {btn.texto}
          </Link>
        ))}
      </div>
    </div>
  );
}
