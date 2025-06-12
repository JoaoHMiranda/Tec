import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Button, Alert, Modal, Spinner, Card } from 'react-bootstrap';
import { getFilmes, deleteFilme, addFilme, updateFilme } from '../services/filmeService'; 
import FilmeForm from '../features/filmes/FilmeForm';
import { FaEdit, FaTrash, FaPlus, FaPhotoVideo, FaPlusSquare, FaImage } from 'react-icons/fa';

function GerenciarFilmes() { 
  const [filmes, setFilmes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filmeParaDeletar, setFilmeParaDeletar] = useState(null);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [showFilmeModal, setShowFilmeModal] = useState(false);
  const [filmeEmEdicao, setFilmeEmEdicao] = useState(null);
  const [isModalEditMode, setIsModalEditMode] = useState(false);

  const carregarFilmes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const dadosFilmes = await getFilmes();
      setFilmes(dadosFilmes.sort((a, b) => a.titulo.localeCompare(b.titulo)));
    } catch (e) {
      setError('Falha ao carregar filmes do servidor. Verifique se o backend está rodando.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarFilmes();
  }, [carregarFilmes]);

  const handleAbrirModalDelecao = (filme) => {
    setFilmeParaDeletar(filme);
    setShowDeleteModal(true);
  };

  const handleFecharModalDelecao = () => {
    setFilmeParaDeletar(null);
    setShowDeleteModal(false);
  };

  const handleConfirmarDelecao = async () => {
    if (filmeParaDeletar && filmeParaDeletar.id) {
      setLoading(true);
      try {
        await deleteFilme(filmeParaDeletar.id);
        setMensagemSucesso(`Filme "${filmeParaDeletar.titulo}" deletado com sucesso!`);
        await carregarFilmes();
      } catch (e) {
        setError(e.message || 'Erro ao deletar filme.');
      } finally {
        handleFecharModalDelecao();
        setLoading(false);
        setTimeout(() => setMensagemSucesso(''), 4000);
      }
    }
  };

  const handleAbrirModalCadastro = () => {
    setFilmeEmEdicao(null);
    setIsModalEditMode(false);
    setShowFilmeModal(true);
  };

  const handleAbrirModalEdicao = (filme) => {
    setFilmeEmEdicao(filme);
    setIsModalEditMode(true);
    setShowFilmeModal(true);
  };

  const handleFecharFilmeModal = () => {
    setShowFilmeModal(false);
    setFilmeEmEdicao(null); 
  };

  // ✅ Corrigido: função definida dentro do componente
  const handleSalvarFilme = async (dataDoFilme) => {
    setFormSubmitting(true);
    setError('');
    try {
      const filmeCorrigido = {
        ...dataDoFilme,
        duracao: parseInt(dataDoFilme.duracao, 10),
        dataEstreia: new Date(dataDoFilme.dataEstreia), 
      };

      if (isModalEditMode && filmeEmEdicao) {
        await updateFilme(filmeEmEdicao.id, filmeCorrigido);
        setMensagemSucesso(`Filme "${dataDoFilme.titulo}" atualizado com sucesso!`);
      } else {
        await addFilme(filmeCorrigido);
        setMensagemSucesso(`Filme "${dataDoFilme.titulo}" cadastrado com sucesso!`);
      }

      await carregarFilmes();
      handleFecharFilmeModal();
    } catch (e) {
      setError(e.message || 'Erro ao salvar filme. Verifique o console do backend.');
      console.error("Erro ao salvar filme:", e);
    } finally {
      setFormSubmitting(false);
      setTimeout(() => {
        if (!showFilmeModal) {
          setMensagemSucesso('');
          setError('');
        }
      }, 4000);
    }
  };

  const formatarData = (dataISO) => {
    if (!dataISO) return '-';
    try {
      const data = new Date(dataISO);
      if (isNaN(data.getTime())) return 'Data inválida';
      const dia = String(data.getDate()).padStart(2, '0');
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const ano = data.getFullYear();
      return `${dia}/${mes}/${ano}`;
    } catch {
      return 'Data inválida';
    }
  };

  if (loading && !filmes.length) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Carregando filmes do servidor...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><FaPhotoVideo className="me-2 text-info" />Gerenciar Filmes</h2>
        <Button variant="primary" onClick={handleAbrirModalCadastro}>
          <FaPlus className="me-2" /> Cadastrar Filme
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {mensagemSucesso && <Alert variant="success" onClose={() => setMensagemSucesso('')} dismissible>{mensagemSucesso}</Alert>}

      {!loading && filmes.length === 0 && !error && (
        <Alert variant="info">Nenhum filme encontrado. Clique em "Cadastrar Filme" para começar!</Alert>
      )}

      <Row xs={1} md={2} lg={3} xl={4} className="g-4">
        {filmes.map((filme) => {
          const temImagem = filme.cartazBase64?.startsWith('data:image');
          const cardStyle = temImagem
            ? {
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${filme.cartazBase64})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '350px'
              }
            : {
                minHeight: '350px',
                backgroundColor: '#fff'
              };

          return (
            <Col key={filme.id}>
              <Card className={`h-100 shadow-sm ${temImagem ? 'text-white' : ''}`} style={cardStyle}>
                <Card.Body className="d-flex flex-column">
                  {!temImagem && (
                    <div className="text-center mb-3 flex-grow-1 d-flex flex-column justify-content-center align-items-center">
                      <FaImage size={50} className="text-muted" />
                    </div>
                  )}
                  <Card.Title>{filme.titulo}</Card.Title>
                  <Card.Subtitle className="mb-2">
                    {filme.genero} | {filme.duracao} min
                  </Card.Subtitle>
                  <Card.Text style={{ fontSize: '0.9rem' }}>
                    <strong>Classificação:</strong> {filme.classificacaoIndicativa}<br />
                    <strong>Estreia:</strong> {formatarData(filme.dataEstreia)}
                  </Card.Text>
                  <small className="mb-auto text-muted" style={{ minHeight: '54px' }}>
                    <i>{filme.descricao}</i>
                  </small>
                  <div className="mt-2 d-flex justify-content-end pt-2">
                    <Button variant={temImagem ? "light" : "outline-primary"} size="sm" className="me-2" onClick={() => handleAbrirModalEdicao(filme)} title="Editar Filme"><FaEdit className="me-1" /> Editar</Button>
                    <Button variant="danger" size="sm" onClick={() => handleAbrirModalDelecao(filme)} title="Deletar Filme"><FaTrash className="me-1" /> Deletar</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      <Modal show={showFilmeModal} onHide={handleFecharFilmeModal} backdrop="static" keyboard={false} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {isModalEditMode ? 
              <><FaEdit className="me-2 text-info"/> Editar Filme</> : 
              <><FaPlusSquare className="me-2 text-primary"/> Cadastrar Novo Filme</>
            }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FilmeForm
            initialData={filmeEmEdicao}
            onSubmit={handleSalvarFilme}
            onCancel={handleFecharFilmeModal}
            isEditMode={isModalEditMode}
            submitting={formSubmitting}
          />
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleFecharModalDelecao} centered>
        <Modal.Header closeButton><Modal.Title><FaTrash className="me-2 text-danger" />Confirmar Deleção</Modal.Title></Modal.Header>
        <Modal.Body>Tem certeza que deseja excluir o filme <strong>{filmeParaDeletar?.titulo}</strong>?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleFecharModalDelecao}>Cancelar</Button>
          <Button variant="danger" onClick={handleConfirmarDelecao}>Deletar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default GerenciarFilmes;
