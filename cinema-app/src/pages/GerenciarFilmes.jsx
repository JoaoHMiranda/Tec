// src/pages/GerenciarFilmes.jsx
import React, { useState, useEffect } from 'react';
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

  const carregarFilmes = () => { 
    setLoading(true);
    setError('');
    // setMensagemSucesso(''); // Não limpar aqui, para a mensagem de deleção ser vista
    try {
      const dadosFilmes = getFilmes();
      console.log("[GerenciarFilmes] Filmes carregados em carregarFilmes():", dadosFilmes); // DEBUG
      setFilmes(dadosFilmes.sort((a,b) => a.titulo.localeCompare(b.titulo)));
    } catch (e) {
      setError('Falha ao carregar filmes.');
      console.error("[GerenciarFilmes] Erro em carregarFilmes:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    console.log("[GerenciarFilmes] Montando componente, chamando carregarFilmes..."); // DEBUG
    carregarFilmes();
  }, []);

  const handleAbrirModalDelecao = (filme) => { 
    console.log("[GerenciarFilmes] Abrindo modal de deleção para:", filme); // DEBUG
    setFilmeParaDeletar(filme);
    setShowDeleteModal(true);
  };
  const handleFecharModalDelecao = () => { 
    setFilmeParaDeletar(null);
    setShowDeleteModal(false);
  };

  const handleConfirmarDelecao = () => { 
    if (filmeParaDeletar && typeof filmeParaDeletar.id !== 'undefined') {
      console.log("[GerenciarFilmes] Confirmando deleção para filme ID:", filmeParaDeletar.id); // DEBUG
      setLoading(true); 
      try {
        const deletadoComSucesso = deleteFilme(filmeParaDeletar.id); 
        console.log("[GerenciarFilmes] Retorno de deleteFilme:", deletadoComSucesso); // DEBUG
        if (deletadoComSucesso) {
          setMensagemSucesso(`Filme "${filmeParaDeletar.titulo}" deletado com sucesso!`);
          carregarFilmes(); // Recarrega a lista para refletir a deleção
        } else {
          setError(`Filme "${filmeParaDeletar.titulo}" não pôde ser deletado ou não foi encontrado.`);
        }
      } catch (e) {
        setError(`Erro ao deletar: ${e.message}`);
        console.error("[GerenciarFilmes] Erro em handleConfirmarDelecao:", e);
      } finally {
        handleFecharModalDelecao();
        setLoading(false);
        setTimeout(() => {
            setMensagemSucesso('');
            setError(''); 
        }, 3000);
      }
    } else {
        console.error("[GerenciarFilmes] filmeParaDeletar ou filmeParaDeletar.id é nulo/undefined em handleConfirmarDelecao");
        setError("Erro: Nenhum filme selecionado para deleção ou ID do filme ausente.");
        handleFecharModalDelecao();
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
  const handleSalvarFilme = async (dataDoFilme) => { 
    setFormSubmitting(true);
    setError('');
    try {
      if (isModalEditMode && filmeEmEdicao) {
        updateFilme(filmeEmEdicao.id, dataDoFilme);
        setMensagemSucesso(`Filme "${dataDoFilme.titulo}" atualizado com sucesso!`);
      } else {
        addFilme(dataDoFilme);
        setMensagemSucesso(`Filme "${dataDoFilme.titulo}" cadastrado com sucesso!`);
      }
      carregarFilmes(); 
      handleFecharFilmeModal();
    } catch (e) {
      setError(`Erro ao salvar filme: ${e.message}`);
      console.error("[GerenciarFilmes] Erro ao salvar filme:", e);
    } finally {
      setFormSubmitting(false);
      setTimeout(() => {
        setMensagemSucesso('');
        setError('');
      }, 3000);
    }
  };
  
  const formatarData = (dataISO) => { /* ... (código da função) ... */ };

  if (loading && !filmes.length && !mensagemSucesso && !error) { 
    return <div className="text-center mt-5"><Spinner animation="border" variant="primary" /><p className="mt-2">Carregando filmes...</p></div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><FaPhotoVideo className="me-2 text-info"/>Gerenciar Filmes</h2> 
        <Button variant="primary" onClick={handleAbrirModalCadastro}>
          <FaPlus className="me-2" /> Cadastrar Filme
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {mensagemSucesso && <Alert variant="success" onClose={() => setMensagemSucesso('')} dismissible>{mensagemSucesso}</Alert>}

      {!loading && filmes.length === 0 && !error && (
        <Alert variant="info">Nenhum filme cadastrado ainda. Clique em "Cadastrar Filme" para começar!</Alert>
      )}

      <Row xs={1} md={2} lg={3} xl={4} className="g-4">
        {filmes.map((filme) => {
          // ... (código do card como você forneceu, com placeholder de imagem ou imagem de fundo) ...
          const temImagem = filme.cartazBase64 && filme.cartazBase64.startsWith('data:image');
          const cardClasses = `h-100 shadow-sm ${temImagem ? 'text-white' : ''}`;
          const cardStyle = temImagem ? {
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${filme.cartazBase64})`,
            backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
            minHeight: '350px',
          } : {
            minHeight: '350px', backgroundColor: '#fff',
          };
          const subtitleColor = temImagem ? 'rgba(255,255,255,0.85)' : ''; 
          const textColor = temImagem ? 'rgba(255,255,255,0.9)' : '';
          const descriptionColor = temImagem ? 'rgba(255,255,255,0.8)' : 'text-muted';

          return (
            <Col key={filme.id}>
              <Card className={cardClasses} style={cardStyle}>
                <Card.Body className="d-flex flex-column">
                  {!temImagem && (<div className="text-center mb-3 flex-grow-1 d-flex flex-column justify-content-center align-items-center"> <FaImage size={50} className="text-muted" /> <p className="text-muted mt-1"><small>Sem Imagem</small></p> </div> )}
                  <Card.Title style={temImagem ? { textShadow: '1px 1px 2px rgba(0,0,0,0.8)' } : {}}>{filme.titulo}</Card.Title>
                  <Card.Subtitle className="mb-2" style={temImagem ? { color: subtitleColor } : {}}>{filme.genero ? filme.genero.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '-'} | {filme.duracao} min</Card.Subtitle>
                  <Card.Text style={{ fontSize: '0.9rem', color: textColor }} className="mb-2"><strong>Classificação:</strong> {filme.classificacaoIndicativa || '-'}<br /><strong>Estreia:</strong> {formatarData(filme.dataEstreia)}</Card.Text>
                  {filme.descricao && ( <small className={`mb-auto ${!temImagem ? 'text-muted' : ''}`} style={{display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', minHeight: '54px', color: temImagem ? descriptionColor : undefined }}><i>{filme.descricao}</i></small> )}
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
            {isModalEditMode ? <><FaEdit className="me-2 text-info"/> Editar Filme</> : <><FaPlusSquare className="me-2 text-primary"/> Cadastrar Novo Filme</>}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body><FilmeForm initialData={filmeEmEdicao} onSubmit={handleSalvarFilme} onCancel={handleFecharFilmeModal} isEditMode={isModalEditMode} submitting={formSubmitting} /></Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleFecharModalDelecao} centered>
        <Modal.Header closeButton><Modal.Title><FaTrash className="me-2 text-danger"/>Confirmar Deleção</Modal.Title></Modal.Header>
        <Modal.Body>Você tem certeza que deseja deletar o filme: <strong>{filmeParaDeletar?.titulo}</strong>?<br/>Esta ação não poderá ser desfeita.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleFecharModalDelecao}>Cancelar</Button>
          <Button variant="danger" onClick={handleConfirmarDelecao}>Deletar Filme</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default GerenciarFilmes;