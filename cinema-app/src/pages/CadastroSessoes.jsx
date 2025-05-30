import { useState, useEffect } from 'react';

export default function CadastroSessoes() {
  const [sessoes, setSessoes] = useState([]);
  const [filmes, setFilmes] = useState([]);
  const [salas, setSalas] = useState([]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [idEdicao, setIdEdicao] = useState(null);

  const [sessao, setSessao] = useState({
    filmeId: '',
    salaId: '',
    dataHora: '',
    preco: '',
    idioma: '',
    formato: ''
  });

  useEffect(() => {
    setSessoes(JSON.parse(localStorage.getItem('sessoes')) || []);
    setFilmes(JSON.parse(localStorage.getItem('filmes')) || []);
    setSalas(JSON.parse(localStorage.getItem('salas')) || []);
  }, []);

  const salvarSessao = () => {
    if (!sessao.filmeId || !sessao.salaId || !sessao.dataHora || !sessao.preco || !sessao.idioma || !sessao.formato) {
      return alert('Preencha todos os campos.');
    }

    const ano = parseInt(sessao.dataHora.slice(0, 4));
    if (isNaN(ano) || ano < 2024 || ano > 2100) {
      return alert('Ano inválido. Use entre 2024 e 2100.');
    }

    if (parseFloat(sessao.preco) <= 0 || !/^\d+(\.\d{1,2})?$/.test(sessao.preco)) {
      return alert('Preço inválido.');
    }

    let atualizadas = [...sessoes];

    if (modoEdicao && idEdicao) {
      atualizadas = atualizadas.map(s => (s.id === idEdicao ? { ...sessao, id: idEdicao } : s));
    } else {
      atualizadas.push({ ...sessao, id: crypto.randomUUID() });
    }

    localStorage.setItem('sessoes', JSON.stringify(atualizadas));
    setSessoes(atualizadas);
    alert(modoEdicao ? 'Sessão editada!' : 'Sessão cadastrada!');
    fecharFormulario();
  };

  const deletar = (id) => {
    if (!window.confirm('Deseja realmente excluir esta sessão?')) return;
    const atualizadas = sessoes.filter(s => s.id !== id);
    localStorage.setItem('sessoes', JSON.stringify(atualizadas));
    setSessoes(atualizadas);
  };

  const editarSessao = (s) => {
    setSessao(s);
    setIdEdicao(s.id);
    setModoEdicao(true);
    setMostrarFormulario(true);
  };

  const fecharFormulario = () => {
    setSessao({ filmeId: '', salaId: '', dataHora: '', preco: '', idioma: '', formato: '' });
    setModoEdicao(false);
    setIdEdicao(null);
    setMostrarFormulario(false);
  };

  const getFilme = (id) => filmes.find(f => f.id === id);
  const getSalaNome = (id) => salas.find(s => s.id === id)?.nome || 'Desconhecida';

  const estiloBotaoFlutuante = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 1000,
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    fontSize: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const estiloModalOverlay = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const estiloModalCard = {
    width: '90%',
    maxWidth: '600px',
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 0 20px rgba(0,0,0,0.3)',
    maxHeight: '90vh',
    overflowY: 'auto'
  };

  return (
    <div>
      <h2 className="mb-4">Sessões Cadastradas</h2>

      {sessoes.length === 0 && <p>Nenhuma sessão cadastrada ainda.</p>}
      <div className="row">
        {sessoes.map((s) => {
          const filme = getFilme(s.filmeId);
          return (
            <div className="col-md-6 col-lg-4 mb-4" key={s.id}>
              <div className="card h-100">
                {filme?.imagemUrl && (
                  <img
                    src={filme.imagemUrl}
                    alt={filme?.titulo}
                    className="card-img-top"
                    style={{ height: '220px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{filme?.titulo || 'Filme Desconhecido'}</h5>
                  <p className="card-text mb-3">
                    <strong>Sala:</strong> {getSalaNome(s.salaId)}<br />
                    <strong>Data e Hora:</strong> {s.dataHora.replace('T', ' às ')}<br />
                    <strong>Preço:</strong> R$ {parseFloat(s.preco).toFixed(2)}<br />
                    <strong>Idioma:</strong> {s.idioma}<br />
                    <strong>Formato:</strong> {s.formato}
                  </p>
                  <div className="d-flex justify-content-between mt-auto">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => editarSessao(s)}>Editar</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => deletar(s.id)}>Excluir</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!mostrarFormulario && (
        <button className="btn btn-primary" style={estiloBotaoFlutuante} onClick={() => {
          setModoEdicao(false);
          setMostrarFormulario(true);
          setSessao({ filmeId: '', salaId: '', dataHora: '', preco: '', idioma: '', formato: '' });
        }}>
          +
        </button>
      )}

      {mostrarFormulario && (
        <div style={estiloModalOverlay}>
          <div style={estiloModalCard}>
            <h4 className="mb-3">{modoEdicao ? 'Editar Sessão' : 'Nova Sessão'}</h4>

            <select className="form-control mb-2" value={sessao.filmeId} onChange={e => setSessao({ ...sessao, filmeId: e.target.value })}>
              <option value="">Selecione um Filme</option>
              {filmes.map(f => (
                <option key={f.id} value={f.id}>{f.titulo}</option>
              ))}
            </select>

            <select className="form-control mb-2" value={sessao.salaId} onChange={e => setSessao({ ...sessao, salaId: e.target.value })}>
              <option value="">Selecione uma Sala</option>
              {salas.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
            </select>

            <input
              type="datetime-local"
              className="form-control mb-2"
              value={sessao.dataHora}
              min="2024-01-01T00:00"
              max="2100-12-31T23:59"
              onChange={e => setSessao({ ...sessao, dataHora: e.target.value })}
            />

            <input
              type="number"
              className="form-control mb-2"
              placeholder="Preço do ingresso"
              min="0.01"
              step="0.01"
              value={sessao.preco}
              onChange={e => setSessao({ ...sessao, preco: e.target.value })}
            />

            <select className="form-control mb-2" value={sessao.idioma} onChange={e => setSessao({ ...sessao, idioma: e.target.value })}>
              <option value="">Idioma</option>
              <option value="Dublado">Dublado</option>
              <option value="Legendado">Legendado</option>
            </select>

            <select className="form-control mb-3" value={sessao.formato} onChange={e => setSessao({ ...sessao, formato: e.target.value })}>
              <option value="">Formato</option>
              <option value="2D">2D</option>
              <option value="3D">3D</option>
            </select>

            <div className="d-flex justify-content-between">
              <button className="btn btn-secondary" onClick={fecharFormulario}>Cancelar</button>
              <button className="btn btn-success" onClick={salvarSessao}>
                {modoEdicao ? 'Salvar Alterações' : 'Salvar Sessão'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
