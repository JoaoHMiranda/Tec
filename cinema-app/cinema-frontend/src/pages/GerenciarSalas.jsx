import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Alert, Modal, Spinner, Card } from 'react-bootstrap';
import { getSalas, deleteSala, addSala, updateSala } from '../services/salaService';
import SalaForm from '../features/salas/SalaForm';
import { FaEdit, FaTrash, FaPlus, FaTv, FaPlusSquare } from 'react-icons/fa';

function GerenciarSalas() {
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [salaParaDeletar, setSalaParaDeletar] = useState(null);
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  const [showSalaModal, setShowSalaModal] = useState(false);
  const [salaEmEdicao, setSalaEmEdicao] = useState(null);
  const [isModalEditMode, setIsModalEditMode] = useState(false);

  const carregarSalas = async () => {
    setLoading(true);
    setError('');
    setMensagemSucesso('');
    try {
      const dadosSalas = await getSalas();
      if (!Array.isArray(dadosSalas)) throw new Error('Formato inválido retornado por getSalas()');
      setSalas(dadosSalas.sort((a, b) => a.nome.localeCompare(b.nome)));
    } catch (e) {
      setError('Falha ao carregar salas.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarSalas();
  }, []);

  const handleAbrirModalDelecao = (sala) => {
    setSalaParaDeletar(sala);
    setShowDeleteModal(true);
  };

  const handleFecharModalDelecao = () => {
    setSalaParaDeletar(null);
    setShowDeleteModal(false);
  };

  const handleConfirmarDelecao = async () => {
    if (salaParaDeletar) {
      setLoading(true);
      try {
        await deleteSala(salaParaDeletar.id);
        setMensagemSucesso(`Sala "${salaParaDeletar.nome}" deletada com sucesso!`);
        carregarSalas();
      } catch (e) {
        setError(`Erro ao deletar sala: ${e.message}`);
      } finally {
        handleFecharModalDelecao();
        setLoading(false);
        setTimeout(() => setMensagemSucesso(''), 3000);
      }
    }
  };

  const handleAbrirModalCadastroSala = () => {
    setSalaEmEdicao(null);
    setIsModalEditMode(false);
    setShowSalaModal(true);
  };

  const handleAbrirModalEdicaoSala = (sala) => {
    setSalaEmEdicao(sala);
    setIsModalEditMode(true);
    setShowSalaModal(true);
  };

  const handleFecharSalaModal = () => {
    setShowSalaModal(false);
    setSalaEmEdicao(null);
  };

  const handleSalvarSala = async (dataDaSala) => {
    setFormSubmitting(true);
    setError('');
    setMensagemSucesso('');
    try {
      if (isModalEditMode && salaEmEdicao) {
        await updateSala(salaEmEdicao.id, dataDaSala);
        setMensagemSucesso(`Sala "${dataDaSala.nome}" atualizada com sucesso!`);
      } else {
        await addSala(dataDaSala);
        setMensagemSucesso(`Sala "${dataDaSala.nome}" cadastrada com sucesso!`);
      }
      carregarSalas();
      handleFecharSalaModal();
    } catch (e) {
      setError(`Erro ao salvar sala: ${e.message}`);
      console.error("Erro ao salvar sala:", e);
    } finally {
      setFormSubmitting(false);
      setTimeout(() => setMensagemSucesso(''), 3000);
    }
  };

  if (loading && !salas.length) {
    return <div className="text-center mt-5"><Spinner animation="border" variant="primary" /><p className="mt-2">Carregando salas...</p></div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><FaTv className="me-2 text-warning" />Gerenciar Salas</h2>
        <Button variant="primary" onClick={handleAbrirModalCadastroSala}>
          <FaPlus className="me-2" /> Nova Sala
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {mensagemSucesso && <Alert variant="success" onClose={() => setMensagemSucesso('')} dismissible>{mensagemSucesso}</Alert>}

      {!loading && salas.length === 0 && !error && (
        <Alert variant="info">Nenhuma sala cadastrada ainda. Clique em "Nova Sala" para começar!</Alert>
      )}

      <Row xs={1} md={2} lg={3} xl={4} className="g-4">
        {salas.map((sala) => (
          <Col key={sala.id}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <Card.Title>{sala.nome}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Tipo: {sala.tipo}
                </Card.Subtitle>
                <Card.Text>
                  <strong>Capacidade:</strong> {sala.capacidade} assentos
                </Card.Text>
                <div className="mt-auto d-flex justify-content-end pt-2">
                  <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleAbrirModalEdicaoSala(sala)}>
                    <FaEdit className="me-1" /> Editar
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleAbrirModalDelecao(sala)}>
                    <FaTrash className="me-1" /> Deletar
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showSalaModal} onHide={handleFecharSalaModal} backdrop="static" keyboard={false} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {isModalEditMode ? (
              <><FaEdit className="me-2 text-info" /> Editar Sala</>
            ) : (
              <><FaPlusSquare className="me-2 text-primary" /> Cadastrar Nova Sala</>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SalaForm
            initialData={salaEmEdicao}
            onSubmit={handleSalvarSala}
            onCancel={handleFecharSalaModal}
            isEditMode={isModalEditMode}
            submitting={formSubmitting}
          />
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleFecharModalDelecao} centered>
        <Modal.Header closeButton>
          <Modal.Title><FaTrash className="me-2 text-danger" />Confirmar Deleção</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Você tem certeza que deseja deletar a sala: <strong>{salaParaDeletar?.nome}</strong>?<br />
          Se esta sala estiver associada a sessões, essas sessões podem ficar inconsistentes.<br />
          Esta ação não poderá ser desfeita.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleFecharModalDelecao}>Cancelar</Button>
          <Button variant="danger" onClick={handleConfirmarDelecao}>Deletar Sala</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default GerenciarSalas;
