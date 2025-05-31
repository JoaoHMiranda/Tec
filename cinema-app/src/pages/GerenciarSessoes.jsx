// src/pages/GerenciarSessoes.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Button, Alert, Modal, Spinner, Card, Badge } from 'react-bootstrap';
import { getSessoes, deleteSessao, addSessao, updateSessao } from '../services/sessaoService';
import { getFilmes } from '../services/filmeService';
import { getSalas } from '../services/salaService';
import { getIngressosPorSessao } from '../services/ingressoService';
import SessaoForm from '../features/sessoes/SessaoForm';
import { FaEdit, FaTrash, FaPlus, FaCalendarCheck, FaPlusSquare, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

function GerenciarSessoes() {
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
  
  const formatarDataHora = useCallback((dataHoraISO) => {
    if (!dataHoraISO) return '-';
    try {
      const data = new Date(dataHoraISO);
      if (isNaN(data.getTime())) return 'Data/Hora inválida';
      const dia = String(data.getDate()).padStart(2, '0');
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const ano = data.getFullYear();
      const horas = String(data.getHours()).padStart(2, '0');
      const minutos = String(data.getMinutes()).padStart(2, '0');
      return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
    } catch { return 'Data inválida'; }
  }, []);

  const carregarDadosIniciais = useCallback(() => {
    setLoading(true);
    setError('');
    // Não limpar mensagem de sucesso aqui para ser vista após ação
    try {
      const todosFilmes = getFilmes();
      const todasSalas = getSalas();

      setFilmesOptions(
        todosFilmes.map(filme => ({ value: filme.id.toString(), label: filme.titulo }))
      );
      setSalasOptions(
        todasSalas.map(sala => ({ value: sala.id.toString(), label: `${sala.nome} (Cap: ${sala.capacidade}, Tipo: ${sala.tipo})` }))
      );

      const todasSessoes = getSessoes();
      const agora = new Date();

      const comDetalhes = todasSessoes.map(sessao => {
        const filme = todosFilmes.find(f => f.id.toString() === sessao.filmeId.toString());
        const sala = todasSalas.find(s => s.id.toString() === sessao.salaId.toString());
        
        const ingressosDaSessao = getIngressosPorSessao(sessao.id);
        const ingressosVendidos = ingressosDaSessao.length;
        const capacidadeDaSala = sala ? parseInt(sala.capacidade, 10) : 0; // Garante que é número
        const isLotada = sala ? ingressosVendidos >= capacidadeDaSala : false;
        const isEncerrada = new Date(sessao.dataHora) < agora;

        return {
          ...sessao,
          filmeTitulo: filme ? filme.titulo : `Filme ID: ${sessao.filmeId} (Não enc.)`,
          filmeCartazBase64: filme ? filme.cartazBase64 : null, 
          salaNome: sala ? sala.nome : `Sala ID: ${sessao.salaId} (Não enc.)`,
          salaCapacidade: capacidadeDaSala,
          ingressosVendidos: ingressosVendidos,
          isLotada: isLotada,
          isEncerrada: isEncerrada,
        };
      }).sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));
      setSessoesComDetalhes(comDetalhes);

    } catch (e) {
      setError('Falha ao carregar dados para gerenciamento de sessões.');
      console.error("Erro em carregarDadosIniciais:", e);
    } finally {
      setLoading(false);
    }
  }, []); // Removido formatarDataHora se não for diretamente usado no corpo de useCallback

  useEffect(() => {
    carregarDadosIniciais();
  }, [carregarDadosIniciais]);

  const handleAbrirModalDelecao = (sessao) => {
    setSessaoParaDeletar(sessao);
    setShowDeleteModal(true);
  };
  const handleFecharModalDelecao = () => {
    setSessaoParaDeletar(null);
    setShowDeleteModal(false);
  };
  const handleConfirmarDelecao = () => {
    if (sessaoParaDeletar && typeof sessaoParaDeletar.id !== 'undefined') {
      setLoading(true); 
      try {
        const deletadoComSucesso = deleteSessao(sessaoParaDeletar.id);
        if (deletadoComSucesso) {
          setMensagemSucesso(`Sessão para "${sessaoParaDeletar.filmeTitulo}" deletada com sucesso!`);
          carregarDadosIniciais(); // Recarrega para atualizar a lista e status
        } else {
          setError(`Sessão para "${sessaoParaDeletar.filmeTitulo}" não pôde ser deletada.`);
        }
      } catch (e) {
        setError(`Erro ao deletar sessão: ${e.message}`);
        console.error("Erro em handleConfirmarDelecao:", e);
      } finally {
        handleFecharModalDelecao();
        setLoading(false);
        setTimeout(() => { setMensagemSucesso(''); setError(''); }, 3000);
      }
    } else {
      setError("Erro: Nenhuma sessão selecionada para deleção ou ID ausente.");
      console.error("[GerenciarSessoes] sessaoParaDeletar ou seu ID é nulo/undefined em handleConfirmarDelecao");
      handleFecharModalDelecao();
    }
  };

  const handleAbrirModalCadastroSessao = () => {
    setSessaoEmEdicao(null);
    setIsModalEditMode(false);
    setShowSessaoModal(true);
  };

  const handleAbrirModalEdicaoSessao = (sessao) => {
    const sessaoOriginal = getSessoes().find(s => s.id.toString() === sessao.id.toString());
    setSessaoEmEdicao(sessaoOriginal || sessao); 
    setIsModalEditMode(true);
    setShowSessaoModal(true);
  };

  const handleFecharSessaoModal = () => {
    setShowSessaoModal(false);
    setSessaoEmEdicao(null);
  };

  const handleSalvarSessao = async (dataDaSessao) => {
    setFormSubmitting(true);
    setError('');
    // Não limpar mensagemSucesso aqui para ser vista
    try {
      if (isModalEditMode && sessaoEmEdicao) {
        updateSessao(sessaoEmEdicao.id, dataDaSessao);
        setMensagemSucesso('Sessão atualizada com sucesso!');
      } else {
        addSessao(dataDaSessao);
        setMensagemSucesso('Sessão cadastrada com sucesso!');
      }
      carregarDadosIniciais(); // Recarrega para atualizar a lista e status
      handleFecharSessaoModal();
    } catch (e) {
      setError(`Erro ao salvar sessão: ${e.message}`);
      console.error("Erro ao salvar sessão:", e);
    } finally {
      setFormSubmitting(false);
      setTimeout(() => {setMensagemSucesso(''); setError(''); }, 3000);
    }
  };
  
  if (loading && !sessoesComDetalhes.length && !mensagemSucesso && !error) {
    return <div className="text-center mt-5"><Spinner animation="border" variant="primary" /><p className="mt-2">Carregando dados...</p></div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><FaCalendarCheck className="me-2 text-primary"/>Gerenciar Sessões</h2>
        <Button variant="primary" onClick={handleAbrirModalCadastroSessao}>
          <FaPlus className="me-2" /> Nova Sessão
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {mensagemSucesso && <Alert variant="success" onClose={() => setMensagemSucesso('')} dismissible>{mensagemSucesso}</Alert>}

      {!loading && sessoesComDetalhes.length === 0 && !error && (
        <Alert variant="info">Nenhuma sessão cadastrada. Clique em "Nova Sessão" para começar!</Alert>
      )}

      <Row xs={1} md={2} lg={3} className="g-4">
        {sessoesComDetalhes.map((sessao) => {
          const temImagemFilme = sessao.filmeCartazBase64 && sessao.filmeCartazBase64.startsWith('data:image');
          const cardClasses = `h-100 shadow-sm ${temImagemFilme ? 'text-white' : ''}`;
          const cardStyle = temImagemFilme ? {
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${sessao.filmeCartazBase64})`,
            backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
            minHeight: '360px', 
          } : {
            minHeight: '360px', backgroundColor: '#fff',
          };
          
          const subtitleColor = temImagemFilme ? 'rgba(255,255,255,0.85)' : '';
          const textColor = temImagemFilme ? 'rgba(255,255,255,0.9)' : '';

          let statusBadge = null;
          if (sessao.isEncerrada) {
            statusBadge = <Badge bg="secondary" pill className="ms-2"><FaExclamationCircle className="me-1"/>Encerrada</Badge>;
          } else if (sessao.isLotada) {
            statusBadge = <Badge bg="danger" pill className="ms-2"><FaExclamationCircle className="me-1"/>Lotada</Badge>;
          } else {
            statusBadge = <Badge bg="success" pill className="ms-2"><FaCheckCircle className="me-1"/>Disponível</Badge>;
          }

          return (
            <Col key={sessao.id}>
              <Card className={cardClasses} style={cardStyle}>
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={temImagemFilme ? { textShadow: '1px 1px 2px rgba(0,0,0,0.8)' } : {}}>
                    {sessao.filmeTitulo}
                    <span className="d-block d-sm-inline mt-1 mt-sm-0">{statusBadge}</span>
                  </Card.Title>
                  <Card.Subtitle className={`mb-2 ${!temImagemFilme ? 'text-muted' : ''}`} style={temImagemFilme ? { color: subtitleColor } : {}}>
                    Sala: {sessao.salaNome}
                  </Card.Subtitle>
                  <Card.Text style={{ fontSize: '0.9rem', color: textColor, flexGrow: 1 }} className="mb-2">
                    <strong>Data e Hora:</strong> {formatarDataHora(sessao.dataHora)}<br />
                    <strong>Preço:</strong> R$ {parseFloat(sessao.preco).toFixed(2).replace('.', ',')}<br />
                    <strong>Idioma:</strong> {sessao.idioma ? sessao.idioma.charAt(0).toUpperCase() + sessao.idioma.slice(1) : '-'}<br />
                    <strong>Formato:</strong> {sessao.formato}<br/>
                    <strong>Vagas:</strong> {sessao.isEncerrada ? 'N/A' : (sessao.isLotada ? 0 : (sessao.salaCapacidade - sessao.ingressosVendidos))} / {sessao.salaCapacidade}
                  </Card.Text>
                                    
                  <div className="mt-auto d-flex justify-content-end pt-2">
                    <Button 
                      variant={temImagemFilme ? "light" : "outline-primary"} 
                      size="sm" className="me-2" 
                      onClick={() => handleAbrirModalEdicaoSessao(sessao)} 
                      title="Editar Sessão"
                      disabled={sessao.isEncerrada} // Desabilita edição se encerrada
                    >
                      <FaEdit className="me-1" /> Editar
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => handleAbrirModalDelecao(sessao)} 
                      title="Deletar Sessão"
                    >
                      <FaTrash className="me-1" /> Deletar
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      <Modal show={showSessaoModal} onHide={handleFecharSessaoModal} backdrop="static" keyboard={false} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {isModalEditMode ? 
              <><FaEdit className="me-2 text-info"/> Editar Sessão</> : 
              <><FaPlusSquare className="me-2 text-primary"/> Cadastrar Nova Sessão</>
            }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SessaoForm
            initialData={sessaoEmEdicao}
            onSubmit={handleSalvarSessao}
            onCancel={handleFecharSessaoModal}
            isEditMode={isModalEditMode}
            submitting={formSubmitting}
            filmesOptions={filmesOptions}
            salasOptions={salasOptions}
          />
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleFecharModalDelecao} centered>
        <Modal.Header closeButton><Modal.Title><FaTrash className="me-2 text-danger"/>Confirmar Deleção de Sessão</Modal.Title></Modal.Header>
        <Modal.Body>
          Você tem certeza que deseja deletar a sessão do filme <strong>{sessaoParaDeletar?.filmeTitulo}</strong> <br/>
          na sala <strong>{sessaoParaDeletar?.salaNome}</strong> em {formatarDataHora(sessaoParaDeletar?.dataHora)}?
          <br/><br/>
          <strong className="text-danger">Atenção:</strong> Esta ação não poderá ser desfeita.
          Se houver ingressos vendidos para esta sessão, eles podem se tornar inconsistentes.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleFecharModalDelecao}>Cancelar</Button>
          <Button variant="danger" onClick={handleConfirmarDelecao}>Confirmar Deleção</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default GerenciarSessoes;