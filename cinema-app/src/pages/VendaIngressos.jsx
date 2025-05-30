import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function VendaIngressos() {
  const location = useLocation();

  const [sessaoId, setSessaoId] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');
  const [cpf, setCpf] = useState('');
  const [assentosSelecionados, setAssentosSelecionados] = useState([]);
  const [pagamento, setPagamento] = useState('');

  const [sessoes, setSessoes] = useState([]);
  const [filmes, setFilmes] = useState([]);
  const [salas, setSalas] = useState([]);
  const [ingressos, setIngressos] = useState([]);

  const [capacidadeSala, setCapacidadeSala] = useState(0);
  const [assentosOcupados, setAssentosOcupados] = useState([]);
  const [precoIngresso, setPrecoIngresso] = useState(0);

  useEffect(() => {
    setSessoes(JSON.parse(localStorage.getItem('sessoes')) || []);
    setFilmes(JSON.parse(localStorage.getItem('filmes')) || []);
    setSalas(JSON.parse(localStorage.getItem('salas')) || []);
    setIngressos(JSON.parse(localStorage.getItem('ingressos')) || []);
  }, []);

  useEffect(() => {
    if (location.state?.sessaoSelecionada) {
      setSessaoId(location.state.sessaoSelecionada.toString());
    }
  }, [location]);

  useEffect(() => {
    if (sessaoId) {
      const sessao = sessoes.find(s => s.id === sessaoId);
      if (sessao) {
        const sala = salas.find(sl => sl.id === sessao.salaId);
        setCapacidadeSala(parseInt(sala?.capacidade || 0));
        setPrecoIngresso(parseFloat(sessao.preco || 0));
        const ocupados = ingressos
          .filter(i => i.sessaoId === sessaoId)
          .map(i => parseInt(i.assento));
        setAssentosOcupados(ocupados);
      }
    } else {
      setCapacidadeSala(0);
      setPrecoIngresso(0);
      setAssentosOcupados([]);
    }
  }, [sessaoId, ingressos, salas, sessoes]);

  const salvarIngressos = () => {
    if (!sessaoId) return alert('Selecione a sessão.');
    if (!nomeCliente.trim()) return alert('Informe o nome do cliente.');
    if (!cpf || cpf.length !== 11 || !/^[0-9]{11}$/.test(cpf)) return alert('CPF inválido. Use 11 números.');
    if (assentosSelecionados.length === 0) return alert('Selecione pelo menos um assento.');
    if (!pagamento) return alert('Selecione o tipo de pagamento.');

    const novosIngressos = assentosSelecionados.map(num => ({
      id: crypto.randomUUID(),
      sessaoId,
      nomeCliente,
      cpf,
      assento: num.toString(),
      pagamento
    }));

    const atualizados = [...ingressos, ...novosIngressos];
    localStorage.setItem('ingressos', JSON.stringify(atualizados));
    setIngressos(atualizados);

    alert(`Ingressos para assento(s) ${assentosSelecionados.join(', ')} vendidos com sucesso!`);
    limpar();
  };

  const limpar = () => {
    setSessaoId('');
    setNomeCliente('');
    setCpf('');
    setAssentosSelecionados([]);
    setPagamento('');
  };

  const getDescricaoSessao = (s) => {
    const filme = filmes.find(f => f.id === s.filmeId);
    const sala = salas.find(sl => sl.id === s.salaId);
    return `${filme?.titulo || 'Filme'} - ${sala?.nome || 'Sala'} - ${s.dataHora.replace('T', ' às ')}`;
  };

  const renderAssentos = () => {
    const botoes = [];
    for (let i = 1; i <= capacidadeSala; i++) {
      const ocupado = assentosOcupados.includes(i);
      const selecionado = assentosSelecionados.includes(i);
      botoes.push(
        <button
          key={i}
          className={`btn btn-sm m-1 ${ocupado ? 'btn-danger' : selecionado ? 'btn-primary' : 'btn-outline-secondary'}`}
          disabled={ocupado}
          onClick={() => {
            setAssentosSelecionados(prev =>
              prev.includes(i) ? prev.filter(a => a !== i) : [...prev, i]
            );
          }}
        >
          {i}
        </button>
      );
    }
    return <div className="d-flex flex-wrap">{botoes}</div>;
  };

  const total = (assentosSelecionados.length * precoIngresso).toFixed(2);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Venda de Ingressos</h2>

      <div className="card p-4">
        <div className="mb-3">
          <label className="form-label">Sessão</label>
          <select className="form-control" value={sessaoId} onChange={e => setSessaoId(e.target.value)}>
            <option value="">Selecione</option>
            {sessoes.map(s => (
              <option key={s.id} value={s.id}>{getDescricaoSessao(s)}</option>
            ))}
          </select>
        </div>

        {capacidadeSala > 0 && (
          <>
            <div className="mb-3">
              <label className="form-label">Assentos disponíveis</label>
              {renderAssentos()}
            </div>
            <div className="mb-3">
              <strong>Preço unitário:</strong> R$ {precoIngresso.toFixed(2)}<br />
              <strong>Assentos selecionados:</strong> {assentosSelecionados.join(', ') || 'nenhum'}<br />
              <strong>Total:</strong> R$ {total}
            </div>
          </>
        )}

        <div className="mb-3">
          <label className="form-label">Nome do Cliente</label>
          <input className="form-control" value={nomeCliente} onChange={e => setNomeCliente(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">CPF</label>
          <input className="form-control" maxLength={11} value={cpf} onChange={e => setCpf(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Tipo de Pagamento</label>
          <select className="form-control" value={pagamento} onChange={e => setPagamento(e.target.value)}>
            <option value="">Selecione</option>
            <option value="Cartão">Cartão</option>
            <option value="Pix">Pix</option>
            <option value="Dinheiro">Dinheiro</option>
          </select>
        </div>

        <div className="d-flex justify-content-end">
          <button className="btn btn-secondary me-2" onClick={limpar}>Limpar</button>
          <button className="btn btn-success" onClick={salvarIngressos}>Confirmar Venda</button>
        </div>
      </div>
    </div>
  );
}
