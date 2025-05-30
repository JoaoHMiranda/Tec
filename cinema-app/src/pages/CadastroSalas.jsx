import { useState, useEffect } from 'react';

export default function CadastroSalas() {
  const [salas, setSalas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [idEdicao, setIdEdicao] = useState(null);

  const [sala, setSala] = useState({
    nome: '',
    capacidade: '',
    tipo: ''
  });

  useEffect(() => {
    setSalas(JSON.parse(localStorage.getItem('salas')) || []);
  }, []);

  const salvarSala = () => {
    if (!sala.nome.trim()) return alert('Nome da sala é obrigatório.');
    if (!sala.capacidade || parseInt(sala.capacidade) <= 0) return alert('Capacidade inválida.');
    if (!sala.tipo) return alert('Tipo da sala obrigatório.');

    const atualizadas = [...salas];

    if (modoEdicao && idEdicao) {
      const index = atualizadas.findIndex(s => s.id === idEdicao);
      atualizadas[index] = { ...sala, id: idEdicao };
    } else {
      atualizadas.push({ ...sala, id: crypto.randomUUID() });
    }

    localStorage.setItem('salas', JSON.stringify(atualizadas));
    setSalas(atualizadas);
    alert(modoEdicao ? 'Sala editada!' : 'Sala cadastrada!');
    fecharFormulario();
  };

  const editar = (s) => {
    setSala(s);
    setIdEdicao(s.id);
    setModoEdicao(true);
    setMostrarFormulario(true);
  };

  const deletar = (id) => {
    if (!window.confirm('Deseja excluir esta sala?')) return;
    const atualizadas = salas.filter(s => s.id !== id);
    localStorage.setItem('salas', JSON.stringify(atualizadas));
    setSalas(atualizadas);
  };

  const fecharFormulario = () => {
    setSala({ nome: '', capacidade: '', tipo: '' });
    setMostrarFormulario(false);
    setModoEdicao(false);
    setIdEdicao(null);
  };

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
      <h2 className="mb-4">Salas Cadastradas</h2>

      {salas.length === 0 && <p>Nenhuma sala cadastrada ainda.</p>}

      <div className="row">
        {salas.map(s => (
          <div key={s.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{s.nome}</h5>
                <p className="card-text mb-3">
                  <strong>Capacidade:</strong> {s.capacidade}<br />
                  <strong>Tipo:</strong> {s.tipo}
                </p>
                <div className="d-flex justify-content-between mt-auto">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => editar(s)}>Editar</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => deletar(s.id)}>Excluir</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!mostrarFormulario && (
        <button className="btn btn-primary" style={estiloBotaoFlutuante} onClick={() => setMostrarFormulario(true)}>
          +
        </button>
      )}

      {mostrarFormulario && (
        <div style={estiloModalOverlay}>
          <div style={estiloModalCard}>
            <h4 className="mb-3">{modoEdicao ? 'Editar Sala' : 'Nova Sala'}</h4>

            <input type="text" className="form-control mb-2" placeholder="Nome da Sala" value={sala.nome} onChange={e => setSala({ ...sala, nome: e.target.value })} />
            <input type="number" className="form-control mb-2" placeholder="Capacidade" min="1" value={sala.capacidade} onChange={e => setSala({ ...sala, capacidade: e.target.value })} />

            <select className="form-control mb-3" value={sala.tipo} onChange={e => setSala({ ...sala, tipo: e.target.value })}>
              <option value="">Tipo</option>
              <option>2D</option>
              <option>3D</option>
              <option>IMAX</option>
            </select>

            <div className="d-flex justify-content-between">
              <button className="btn btn-secondary" onClick={fecharFormulario}>Cancelar</button>
              <button className="btn btn-success" onClick={salvarSala}>
                {modoEdicao ? 'Salvar Alterações' : 'Salvar Sala'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
