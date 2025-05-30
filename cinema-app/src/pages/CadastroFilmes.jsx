import { useState, useEffect } from 'react';

export default function CadastroFilmes() {
  const [filmes, setFilmes] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [idEdicao, setIdEdicao] = useState(null);

  const [filme, setFilme] = useState({
    titulo: '',
    descricao: '',
    genero: '',
    classificacao: '',
    duracao: '',
    dataEstreia: '',
    imagemUrl: ''
  });

  useEffect(() => {
    setFilmes(JSON.parse(localStorage.getItem('filmes')) || []);
  }, []);

  const salvarFilme = () => {
    if (!filme.titulo.trim()) return alert('Título obrigatório.');
    if (!filme.genero) return alert('Gênero obrigatório.');
    if (!filme.classificacao) return alert('Classificação obrigatória.');
    if (!filme.duracao || filme.duracao <= 0) return alert('Duração inválida.');
    if (!filme.dataEstreia) return alert('Data de estreia obrigatória.');
    if (!filme.imagemUrl) return alert('Selecione uma imagem.');

    const listaAtualizada = [...filmes];

    if (modoEdicao && idEdicao) {
      const index = listaAtualizada.findIndex(f => f.id === idEdicao);
      listaAtualizada[index] = { ...filme, id: idEdicao };
    } else {
      listaAtualizada.push({ ...filme, id: crypto.randomUUID() });
    }

    localStorage.setItem('filmes', JSON.stringify(listaAtualizada));
    setFilmes(listaAtualizada);
    alert(modoEdicao ? 'Filme editado!' : 'Filme cadastrado!');
    fecharFormulario();
  };

  const editar = (f) => {
    setFilme(f);
    setIdEdicao(f.id);
    setModoEdicao(true);
    setMostrarFormulario(true);
  };

  const deletar = (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este filme?')) return;
    const atualizados = filmes.filter(f => f.id !== id);
    localStorage.setItem('filmes', JSON.stringify(atualizados));
    setFilmes(atualizados);
  };

  const fecharFormulario = () => {
    setFilme({ titulo: '', descricao: '', genero: '', classificacao: '', duracao: '', dataEstreia: '', imagemUrl: '' });
    setMostrarFormulario(false);
    setModoEdicao(false);
    setIdEdicao(null);
  };

  const carregarImagem = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilme(prev => ({ ...prev, imagemUrl: reader.result }));
    };
    reader.readAsDataURL(file);
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
      <h2 className="mb-4">Filmes Cadastrados</h2>

      {filmes.length === 0 && <p>Nenhum filme cadastrado.</p>}

      <div className="row">
        {filmes.map(f => (
          <div key={f.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              {f.imagemUrl && (
                <img
                  src={f.imagemUrl}
                  alt={f.titulo}
                  className="card-img-top"
                  style={{ height: '250px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{f.titulo}</h5>
                <p className="card-text mb-3">
                  <strong>Gênero:</strong> {f.genero}<br />
                  <strong>Classificação:</strong> {f.classificacao}<br />
                  <strong>Duração:</strong> {f.duracao} min<br />
                  <strong>Estreia:</strong> {f.dataEstreia}
                </p>
                <div className="d-flex justify-content-between mt-auto">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => editar(f)}>Editar</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => deletar(f.id)}>Excluir</button>
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
            <h4 className="mb-3">{modoEdicao ? 'Editar Filme' : 'Novo Filme'}</h4>

            <input type="text" className="form-control mb-2" placeholder="Título" value={filme.titulo} onChange={e => setFilme({ ...filme, titulo: e.target.value })} />
            <textarea className="form-control mb-2" placeholder="Descrição" value={filme.descricao} onChange={e => setFilme({ ...filme, descricao: e.target.value })} />

            <select className="form-control mb-2" value={filme.genero} onChange={e => setFilme({ ...filme, genero: e.target.value })}>
              <option value="">Gênero</option>
              <option>Ação</option>
              <option>Comédia</option>
              <option>Drama</option>
              <option>Ficção Científica</option>
              <option>Terror</option>
              <option>Romance</option>
              <option>Documentário</option>
              <option>Fantasia</option>
            </select>

            <select className="form-control mb-2" value={filme.classificacao} onChange={e => setFilme({ ...filme, classificacao: e.target.value })}>
              <option value="">Classificação</option>
              <option>Livre</option>
              <option>10 anos</option>
              <option>12 anos</option>
              <option>14 anos</option>
              <option>16 anos</option>
              <option>18 anos</option>
            </select>

            <input type="number" className="form-control mb-2" placeholder="Duração (minutos)" min="1" value={filme.duracao} onChange={e => setFilme({ ...filme, duracao: e.target.value })} />
            <input type="date" className="form-control mb-2" value={filme.dataEstreia} onChange={e => setFilme({ ...filme, dataEstreia: e.target.value })} />
            <input type="file" className="form-control mb-3" accept="image/*" onChange={carregarImagem} />

            <div className="d-flex justify-content-between">
              <button className="btn btn-secondary" onClick={fecharFormulario}>Cancelar</button>
              <button className="btn btn-success" onClick={salvarFilme}>
                {modoEdicao ? 'Salvar Alterações' : 'Salvar Filme'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
