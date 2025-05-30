import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SessoesDisponiveis() {
  const [sessoes, setSessoes] = useState([]);
  const [filmes, setFilmes] = useState([]);
  const [salas, setSalas] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    setSessoes(JSON.parse(localStorage.getItem('sessoes')) || []);
    setFilmes(JSON.parse(localStorage.getItem('filmes')) || []);
    setSalas(JSON.parse(localStorage.getItem('salas')) || []);
  }, []);

  const getFilme = (id) => filmes.find(f => f.id === id);
  const getSala = (id) => salas.find(s => s.id === id);

  const redirecionarParaVenda = (sessaoId) => {
    navigate('/venda-ingressos', { state: { sessaoSelecionada: sessaoId } });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Sessões Disponíveis</h2>

      {sessoes.length === 0 && <p>Nenhuma sessão encontrada.</p>}

      <div className="row">
        {sessoes.map(sessao => {
          const filme = getFilme(sessao.filmeId);
          const sala = getSala(sessao.salaId);

          return (
            <div key={sessao.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                {filme?.imagemUrl && (
                  <img
                    src={filme.imagemUrl}
                    alt={filme.titulo}
                    className="card-img-top"
                    style={{ height: '250px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{filme?.titulo || 'Filme Desconhecido'}</h5>
                  <p className="card-text mb-1"><strong>Sala:</strong> {sala?.nome || 'Desconhecida'}</p>
                  <p className="card-text mb-1"><strong>Data e Hora:</strong> {sessao.dataHora.replace('T', ' às ')}</p>
                  <p className="card-text mb-3"><strong>Preço:</strong> R$ {parseFloat(sessao.preco).toFixed(2)}</p>
                  <button className="btn btn-primary mt-auto" onClick={() => redirecionarParaVenda(sessao.id)}>
                    Comprar Ingresso
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
