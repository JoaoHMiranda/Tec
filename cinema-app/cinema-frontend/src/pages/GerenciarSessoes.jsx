import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Button, Alert, Modal, Spinner, Card, Badge } from 'react-bootstrap';
import { getSessoes, deleteSessao, addSessao, updateSessao } from '../services/sessaoService';
import { getFilmes } from '../services/filmeService';
import { getSalas } from '../services/salaService';
import { getIngressosBySessao } from '../services/ingressoService';
import SessaoForm from '../features/sessoes/SessaoForm';
import {
  FaEdit, FaTrash, FaPlus, FaCalendarCheck,
  FaPlusSquare, FaExclamationCircle, FaCheckCircle
} from 'react-icons/fa';

function GerenciarSessoes() {
  // Estados
  const [sessoesComDetalhes, setSessoesComDetalhes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sessaoParaDeletar, setSessaoParaDeletar] = useState(null);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [showSessaoModal, setShowSessaoModal] = useState(false);
  const [sessaoEmEdicao, setSessaoEmEdicao] = useState(null);
  const [isModalEditMode, setIsModalEditMode] = useState(false);
  const [filmesOptions, setFilmesOptions] = useState([]);
  const [salasOptions, setSalasOptions] = useState([]);

  // Formata data-hora para exibir
  const formatarDataHora = useCallback((iso) => {
    if (!iso) return '-';
    const d = new Date(iso);
    if (isNaN(d)) return 'Data/Hora inválida';
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  }, []);

  // Carrega sessões, filmes, salas e ingressos
  const carregarDadosIniciais = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [filmes, salas, sessoes] = await Promise.all([
        getFilmes(), getSalas(), getSessoes()
      ]);
      
      // Prepara options
      setFilmesOptions(filmes.map(f => ({ value: String(f.id), label: f.titulo })));
      setSalasOptions(salas.map(s => ({ value: String(s.id), label: `${s.nome} (Cap: ${s.capacidade}, Tipo: ${s.tipo})` })));

      const agora = new Date();
      const detalhes = await Promise.all(sessoes.map(async sessao => {
        const filme = filmes.find(f => f.id === sessao.filmeId);
        const sala = salas.find(s => s.id === sessao.salaId);
        const ingressos = await getIngressosBySessao(sessao.id) || [];
        const vendidos = ingressos.length;
        const capacidade = sala ? Number(sala.capacidade) : 0;
        return {
          ...sessao,
          filmeTitulo: filme?.titulo || `ID ${sessao.filmeId}`,
          filmeCartazBase64: filme?.cartazBase64,
          salaNome: sala?.nome || `ID ${sessao.salaId}`,
          salaCapacidade: capacidade,
          ingressosVendidos: vendidos,
          isLotada: capacidade > 0 && vendidos >= capacidade,
          isEncerrada: new Date(sessao.dataHora) < agora
        };
      }));

      detalhes.sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));
      setSessoesComDetalhes(detalhes);
    } catch (e) {
      setError(`Erro ao carregar dados: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregarDadosIniciais(); }, [carregarDadosIniciais]);

  // Ações de CRUD
  const handleAbrirModalCadastro = () => {
    setSessaoEmEdicao(null);
    setIsModalEditMode(false);
    setShowSessaoModal(true);
  };
  
  const handleAbrirModalEdicao = sessao => {
    setSessaoEmEdicao(sessao);
    setIsModalEditMode(true);
    setShowSessaoModal(true);
  };
  
  const handleFecharModal = () => {
    setSessaoEmEdicao(null);
    setShowSessaoModal(false);
  };

  const handleConfirmarDelecao = async () => {
    if (!sessaoParaDeletar?.id) return;
    setLoading(true);
    try {
      await deleteSessao(sessaoParaDeletar.id);
      setMensagemSucesso('Sessão deletada com sucesso');
      carregarDadosIniciais();
    } catch (e) {
      setError(`Erro ao deletar: ${e.message}`);
    } finally {
      setShowDeleteModal(false);
      setLoading(false);
      setTimeout(() => setMensagemSucesso(''), 3000);
    }
  };

  const handleSalvarSessao = async (data) => {
    setFormSubmitting(true);
    setError('');
    try {
      // Converte tipos corretos
      const payload = {
        ...data,
        filmeId: Number(data.filmeId),
        salaId: Number(data.salaId),
        preco: Number(data.preco),
        dataHora: new Date(data.dataHora).toISOString()
      };

      if (isModalEditMode && sessaoEmEdicao?.id) {
        await updateSessao(sessaoEmEdicao.id, payload);
        setMensagemSucesso('Sessão atualizada com sucesso');
      } else {
        await addSessao(payload);
        setMensagemSucesso('Sessão cadastrada com sucesso');
      }

      carregarDadosIniciais();
      setShowSessaoModal(false);
    } catch (e) {
      setError(`Erro ao salvar: ${e.message}`);
    } finally {
      setFormSubmitting(false);
      setTimeout(() => setMensagemSucesso(''), 3000);
    }
  };

  // Loader inicial
  if (loading && sessoesComDetalhes.length === 0 && !mensagemSucesso && !error) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Carregando dados...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><FaCalendarCheck className="me-2 text-primary"/>Gerenciar Sessões</h2>
        <Button variant="primary" onClick={handleAbrirModalCadastro}>
          <FaPlus className="me-2" /> Nova Sessão
        </Button>
      </div>

      { error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert> }
      { mensagemSucesso && <Alert variant="success" dismissible onClose={() => setMensagemSucesso('')}>{mensagemSucesso}</Alert> }

      { !loading && sessoesComDetalhes.length === 0 && !error && (
        <Alert variant="info">Nenhuma sessão cadastrada. Clique em "Nova Sessão" para começar!</Alert>
      ) }

      <Row xs={1} md={2} lg={3} className="g-4">
        {sessoesComDetalhes.map((sessao) => {
          const temImagem = sessao.filmeCartazBase64?.startsWith('data:image');
          const cardStyle = temImagem ? {
            backgroundImage: `url(${sessao.filmeCartazBase64})`,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backgroundBlendMode: 'darken',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white'
          } : {};

          const badge = sessao.isEncerrada ? (
            <Badge bg="secondary"><FaExclamationCircle /> Encerrada</Badge>
          ) : sessao.isLotada ? (
            <Badge bg="danger"><FaExclamationCircle /> Lotada</Badge>
          ) : (
            <Badge bg="success"><FaCheckCircle /> Disponível</Badge>
          );

          return (
            <Col key={sessao.id}>
              <Card className="h-100 shadow-sm" style={cardStyle}>
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{sessao.filmeTitulo} <span className="ms-2">{badge}</span></Card.Title>
                  <Card.Subtitle className="mb-2">Sala: {sessao.salaNome}</Card.Subtitle>
                  <Card.Text className="flex-grow-1">
                    <strong>Data:</strong> {formatarDataHora(sessao.dataHora)}<br/>
                    <strong>Preço:</strong> R$ {sessao.preco.toFixed(2).replace('.', ',')}<br/>
                    <strong>Idioma:</strong> {sessao.idioma}<br/>
                    <strong>Formato:</strong> {sessao.formato}<br/>
                    <strong>Vagas:</strong> {!sessao.isEncerrada ? (sessao.salaCapacidade - sessao.ingressosVendidos) : '–'} / {sessao.salaCapacidade}
                  </Card.Text>
                  <div className="mt-auto d-flex justify-content-end">
                    <Button
                      variant="light" size="sm" className="me-2"
                      disabled={sessao.isEncerrada}
                      onClick={() => handleAbrirModalEdicao(sessao)}
                    >
                      <FaEdit /> Editar
                    </Button>
                    <Button
                      variant="danger" size="sm"
                      onClick={() => { setSessaoParaDeletar(sessao); setShowDeleteModal(true); }}
                    >
                      <FaTrash /> Deletar
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Modal de cadastro/edição */}
      <Modal show={showSessaoModal} onHide={handleFecharModal} size="lg" centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>
            {isModalEditMode ? <><FaEdit /> Editar Sessão</> : <><FaPlusSquare /> Nova Sessão</>}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SessaoForm
            initialData={sessaoEmEdicao}
            isEditMode={isModalEditMode}
            submitting={formSubmitting}
            onSubmit={handleSalvarSessao}
            onCancel={handleFecharModal}
            filmesOptions={filmesOptions}
            salasOptions={salasOptions}
          />
        </Modal.Body>
      </Modal>

      {/* Modal de deleção */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton><Modal.Title><FaTrash /> Confirmar Deleção</Modal.Title></Modal.Header>
        <Modal.Body>
          Deseja realmente deletar a sessão de <strong>{sessaoParaDeletar?.filmeTitulo}</strong> na sala <strong>{sessaoParaDeletar?.salaNome}</strong> em <strong>{formatarDataHora(sessaoParaDeletar?.dataHora)}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
          <Button variant="danger" onClick={handleConfirmarDelecao}>Deletar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default GerenciarSessoes;
