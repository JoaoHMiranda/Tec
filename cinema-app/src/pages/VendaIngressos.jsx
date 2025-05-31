// src/pages/VendaIngressos.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
// Certifique-se de que 'Image' está importado corretamente de 'react-bootstrap'
import { Form, Row, Col, Alert, Card, Spinner, Button as BsButton, Badge, Modal, Image } from 'react-bootstrap';

// Componentes Comuns
import AppButton from '../components/common/AppButton';
import IngressosForm from '../features/ingressos/IngressosForm';

// Serviços
import { addIngresso, getIngressosPorSessao } from '../services/ingressoService';
import { getSessaoById, getSessoes } from '../services/sessaoService';
import { getFilmes } from '../services/filmeService';
import { getSalas } from '../services/salaService';

// Ícones
import { 
  FaTicketAlt, FaInfoCircle, FaCheckCircle, FaArrowLeft, 
  FaChair, FaDollarSign, FaShoppingCart, FaExclamationTriangle, 
  FaLock, FaCreditCard 
} from 'react-icons/fa';

// Estilos para os assentos
const seatStyles = {
  seat: {
    width: '40px', height: '40px', margin: '4px', display: 'flex',
    alignItems: 'center', justifyContent: 'center', border: '1px solid #ccc',
    borderRadius: '5px', cursor: 'pointer', fontSize: '0.75rem',
    fontWeight: 'bold', userSelect: 'none',
  },
  available: { backgroundColor: '#f0f0f0', color: '#333' },
  selected: { backgroundColor: '#28a745', color: 'white', borderColor: '#1e7e34' },
  sold: { backgroundColor: '#dc3545', color: 'white', cursor: 'not-allowed', borderColor: '#bd2130' }
};

// Função para gerar o layout dos assentos
const gerarLayoutAssentos = (capacidade, assentosPorFileira = 10) => {
  const layout = []; 
  const nomeFileiras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let contadorAssentos = 0;
  for (let i = 0; i < nomeFileiras.length; i++) {
    const fileira = nomeFileiras[i];
    for (let j = 1; j <= assentosPorFileira; j++) {
      if (contadorAssentos < capacidade) { 
        layout.push(`${fileira}${j}`); 
        contadorAssentos++; 
      } else break;
    }
    if (contadorAssentos >= capacidade) break;
  }
  return layout;
};

function VendaIngressos() {
  const { sessaoId: sessaoIdFromParams } = useParams();
  
  const initialIngressoContext = useMemo(() => ({
    sessaoId: sessaoIdFromParams || '',
    assento: [],
  }), [sessaoIdFromParams]);

  const [ingressoContext, setIngressoContext] = useState(initialIngressoContext);
  const [sessoesParaListar, setSessoesParaListar] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true); 
  const [message, setMessage] = useState({ type: '', text: '' });

  const [showVendaModal, setShowVendaModal] = useState(false);
  const [sessaoAtivaNoModal, setSessaoAtivaNoModal] = useState(null); 
  const [salaDoModal, setSalaDoModal] = useState(null);
  const [assentosVendidosModal, setAssentosVendidosModal] = useState([]);
  const [layoutAssentosModal, setLayoutAssentosModal] = useState([]);
  const [assentosSelecionadosModal, setAssentosSelecionadosModal] = useState([]);
  const [loadingModalDetalhes, setLoadingModalDetalhes] = useState(false);
  const [isProcessingSale, setIsProcessingSale] = useState(false);
  const [ingressoFormKeyModal, setIngressoFormKeyModal] = useState(Date.now());

  const formatarDataHora = useCallback((dataHoraISO) => {
    if (!dataHoraISO) return 'N/A';
    try { 
      const data = new Date(dataHoraISO); 
      if (isNaN(data.getTime())) return 'N/A';
      const dia = String(data.getDate()).padStart(2, '0'); 
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const ano = data.getFullYear(); 
      const horas = String(data.getHours()).padStart(2, '0');
      const minutos = String(data.getMinutes()).padStart(2, '0');
      return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
    } catch { return 'N/A'; }
  }, []);
  
  const carregarDadosParaModalVenda = useCallback(async (sessaoParaModal) => {
    if (!sessaoParaModal || !sessaoParaModal.id) {
      setSessaoAtivaNoModal(null); setSalaDoModal(null);
      setAssentosVendidosModal([]); setLayoutAssentosModal([]);
      setAssentosSelecionadosModal([]);
      return;
    }
    setLoadingModalDetalhes(true); 
    setMessage({ type: '', text: '' }); 
    setAssentosSelecionadosModal([]); 

    const sessaoCompleta = getSessaoById(sessaoParaModal.id) || sessaoParaModal; 
    if (sessaoCompleta) {
      const todosFilmes = getFilmes(); 
      const todasSalas = getSalas();
      const filme = todosFilmes.find(f => f.id.toString() === sessaoCompleta.filmeId.toString());
      const salaObj = todasSalas.find(s => s.id.toString() === sessaoCompleta.salaId.toString());
      const agora = new Date();
      const isEncerrada = new Date(sessaoCompleta.dataHora) < agora;
      let isLotada = false; 
      let ingressosDaSessao = [];
      if (salaObj && salaObj.capacidade > 0) {
        ingressosDaSessao = getIngressosPorSessao(sessaoCompleta.id);
        isLotada = ingressosDaSessao.length >= salaObj.capacidade;
      }
      
      setSessaoAtivaNoModal({
        ...sessaoCompleta, 
        filmeTitulo: filme ? filme.titulo : 'Filme N/A',
        filmeCartazBase64: filme ? filme.cartazBase64 : null,
        salaNome: salaObj ? salaObj.nome : 'Sala N/A',
        dataHoraFormatada: formatarDataHora(sessaoCompleta.dataHora),
        precoFormatado: parseFloat(sessaoCompleta.preco).toFixed(2).replace('.', ','),
        precoNumerico: parseFloat(sessaoCompleta.preco), 
        isEncerrada, 
        isLotada      
      });
      setSalaDoModal(salaObj);

      if (salaObj && salaObj.capacidade > 0) {
        setLayoutAssentosModal(gerarLayoutAssentos(salaObj.capacidade));
        setAssentosVendidosModal(ingressosDaSessao.map(ing => ing.assento));
      } else { 
        setLayoutAssentosModal([]); 
        setAssentosVendidosModal([]); 
      }
    } else { 
      setSessaoAtivaNoModal(null); 
      setSalaDoModal(null);
      setLayoutAssentosModal([]); 
      setAssentosVendidosModal([]);
      setMessage({ type: 'warning', text: 'Detalhes da sessão não encontrados para o modal.'})
    }
    setLoadingModalDetalhes(false);
  }, [formatarDataHora]);

  const carregarSessoesParaListagem = useCallback(() => {
    setLoadingPage(true);
    try {
        const todasSessoes = getSessoes(); 
        const todosFilmes = getFilmes(); 
        const todasSalas = getSalas();
        const agora = new Date();
        const sessoesParaCards = todasSessoes.map(s => {
        const filme = todosFilmes.find(f => f.id.toString() === s.filmeId.toString());
        const sala = todasSalas.find(sl => sl.id.toString() === s.salaId.toString());
        const isEncerrada = new Date(s.dataHora) < agora;
        let isLotada = false;
        if (sala && sala.capacidade > 0) { 
            isLotada = getIngressosPorSessao(s.id).length >= sala.capacidade; 
        }
        return { ...s, filmeTitulo: filme ? filme.titulo : 'Filme N/A', filmeCartazBase64: filme ? filme.cartazBase64 : null, salaNome: sala ? sala.nome : 'Sala N/A', isEncerrada, isLotada, salaCapacidade: sala ? sala.capacidade : 0, ingressosVendidosCount: getIngressosPorSessao(s.id).length };
        }).sort((a,b) => {
            if (a.isEncerrada && !b.isEncerrada) return 1; 
            if (!a.isEncerrada && b.isEncerrada) return -1;
            if (a.isLotada && !b.isLotada) return 1; 
            if (!a.isLotada && b.isLotada) return -1;
            return new Date(a.dataHora) - new Date(b.dataHora);
        });
        setSessoesParaListar(sessoesParaCards);
    } catch (e) {
        console.error("Erro ao carregar sessões para listagem:", e);
        setMessage({type: 'danger', text: 'Erro ao carregar sessões.'});
    } finally {
        setLoadingPage(false);
    }
  }, [formatarDataHora]); 

  useEffect(() => {
    carregarSessoesParaListagem();
    if (sessaoIdFromParams) {
      const sessaoAlvo = getSessoes().find(s => s.id.toString() === sessaoIdFromParams);
      if (sessaoAlvo) {
        // Prepara os dados completos para o modal
        const filme = getFilmes().find(f => f.id.toString() === sessaoAlvo.filmeId.toString());
        const sala = getSalas().find(sl => sl.id.toString() === sessaoAlvo.salaId.toString());
        const agora = new Date();
        const isEncerrada = new Date(sessaoAlvo.dataHora) < agora;
        let isLotada = false;
        if (sala && sala.capacidade > 0) { isLotada = getIngressosPorSessao(sessaoAlvo.id).length >= sala.capacidade; }

        handleAbrirVendaModal({ 
            ...sessaoAlvo, 
            filmeTitulo: filme ? filme.titulo : 'Filme N/A', 
            filmeCartazBase64: filme ? filme.cartazBase64 : null, 
            salaNome: sala ? sala.nome : 'Sala N/A', 
            isEncerrada, 
            isLotada 
        });
      } else {
        setMessage({ type: 'danger', text: `Sessão com ID ${sessaoIdFromParams} não encontrada.` });
        setLoadingPage(false); 
      }
    }
  }, [sessaoIdFromParams, carregarSessoesParaListagem]); // carregarDadosParaModalVenda é chamado por handleAbrirVendaModal

  const handleAbrirVendaModal = (sessaoDoCard) => {
    if (sessaoDoCard.isEncerrada || sessaoDoCard.isLotada) {
        setMessage({type: 'warning', text: `A sessão para "${sessaoDoCard.filmeTitulo}" está ${sessaoDoCard.isEncerrada ? 'encerrada' : 'lotada'}.`});
        setTimeout(() => setMessage({type: '', text: ''}), 4000);
        return;
    }
    carregarDadosParaModalVenda(sessaoDoCard); 
    setShowVendaModal(true);
    setIngressoFormKeyModal(Date.now()); 
  };

  const handleFecharVendaModal = () => {
    setShowVendaModal(false);
    setSessaoAtivaNoModal(null); 
    setAssentosSelecionadosModal([]); 
  };

  const handleSeatSelectModal = (seatId) => {
    if (assentosVendidosModal.includes(seatId) || (sessaoAtivaNoModal && (sessaoAtivaNoModal.isEncerrada || sessaoAtivaNoModal.isLotada))) return; 
    setAssentosSelecionadosModal(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(s => s !== seatId);
      } else { return [...prev, seatId]; }
    });
  };
  
  const precoTotalModal = useMemo(() => {
    if (sessaoAtivaNoModal && sessaoAtivaNoModal.precoNumerico && assentosSelecionadosModal) {
      return (assentosSelecionadosModal.length * sessaoAtivaNoModal.precoNumerico).toFixed(2);
    }
    return "0.00";
  }, [assentosSelecionadosModal, sessaoAtivaNoModal]);

  const processarVendaModal = (customerFormData) => {
    if (!sessaoAtivaNoModal || !sessaoAtivaNoModal.id || assentosSelecionadosModal.length === 0) {
      alert('Sessão ou assentos não selecionados corretamente para o modal.');
      return; 
    }
    if (sessaoAtivaNoModal.isEncerrada || sessaoAtivaNoModal.isLotada) {
        alert('Não é possível vender para sessão encerrada ou lotada.');
        return;
    }

    setIsProcessingSale(true);
    let vendasBemSucedidas = 0;
    const cpfApenasDigitos = customerFormData.cpfCliente.replace(/\D/g, '');
    try {
      assentosSelecionadosModal.forEach(assentoId => {
        addIngresso({
          sessaoId: sessaoAtivaNoModal.id,
          nomeCliente: customerFormData.nomeCliente, cpfCliente: cpfApenasDigitos,
          assento: assentoId, tipoPagamento: customerFormData.tipoPagamento,
        });
        vendasBemSucedidas++;
      });
      setMessage({ type: 'success', text: `${vendasBemSucedidas} ingresso(s) para ${customerFormData.nomeCliente} (CPF: ${customerFormData.cpfCliente}) vendido(s) com sucesso! Total: R$ ${precoTotalModal.replace('.', ',')}` });
      handleFecharVendaModal(); 
      carregarSessoesParaListagem(); 
    } catch (error) {
      setMessage({ type: 'danger', text: 'Erro ao processar a venda dos ingressos.' }); 
      console.error("Erro em processarVendaModal:", error);
    } finally {
      setIsProcessingSale(false); 
      setTimeout(() => { if (!showVendaModal) setMessage({ type: '', text: '' }) }, 7000);
    }
  };
  
  const vendaBloqueadaModal = sessaoAtivaNoModal && (sessaoAtivaNoModal.isEncerrada || sessaoAtivaNoModal.isLotada);

  if (loadingPage && !sessaoIdFromParams && !sessoesParaListar.length) {
    return <div className="text-center mt-5"><Spinner animation="border" variant="primary" /><p>Carregando sessões...</p></div>;
  }
  if (sessaoIdFromParams && loadingPage && !sessaoAtivaNoModal && showVendaModal) { // Mostra loading se modal deve abrir via URL e dados ainda não carregaram
    return <div className="text-center mt-5"><Spinner animation="border" variant="primary" /><p>Carregando sessão...</p></div>;
  }

  return (
    <div className="pb-5">
      <h2><FaTicketAlt className="me-2 text-success"/>Venda de Ingressos</h2>
      {!showVendaModal && message.text && <Alert variant={message.type} onClose={() => setMessage({ type: '', text: '' })} dismissible>{message.text}</Alert>}

      {!sessaoIdFromParams && !showVendaModal && (
        <>
          <h3 className="my-4">Escolha uma Sessão:</h3>
          {sessoesParaListar.length === 0 && !loadingPage && 
            <Alert variant="info">Nenhuma sessão disponível para venda no momento.</Alert>
          }
          {!loadingPage && sessoesParaListar.length > 0 && (
            <Row xs={1} md={2} lg={3} className="g-4">
              {sessoesParaListar.map(sessaoCard => {
                const temImagemFilme = sessaoCard.filmeCartazBase64 && sessaoCard.filmeCartazBase64.startsWith('data:image');
                const cardClasses = `h-100 shadow-sm ${temImagemFilme ? 'text-white' : ''}`;
                const cardStyle = temImagemFilme ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${sessaoCard.filmeCartazBase64})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '320px',} : { minHeight: '320px', backgroundColor: '#fff' };
                const subtitleColor = temImagemFilme ? {color: 'rgba(255,255,255,0.85)'} : {};
                const textColor = temImagemFilme ? {color: 'rgba(255,255,255,0.9)'} : {};
                let statusBadge = null;
                if (sessaoCard.isEncerrada) { statusBadge = <Badge bg="secondary" pill><FaExclamationTriangle className="me-1"/>Encerrada</Badge>; }
                else if (sessaoCard.isLotada) { statusBadge = <Badge bg="danger" pill><FaLock className="me-1"/>Lotada</Badge>; }
                return (
                  <Col key={sessaoCard.id} className="d-flex">
                    <Card className={cardClasses} style={cardStyle}>
                      <Card.Body className="d-flex flex-column">
                        <Card.Title style={temImagemFilme ? { textShadow: '1px 1px 2px rgba(0,0,0,0.8)' } : {}}>{sessaoCard.filmeTitulo} {statusBadge}</Card.Title>
                        <Card.Subtitle className={`mb-2 ${!temImagemFilme ? 'text-muted': ''}`} style={subtitleColor}>Sala: {sessaoCard.salaNome}</Card.Subtitle>
                        <Card.Text style={{fontSize: '0.9rem', ...textColor, flexGrow: 1}} className="mb-2"><strong>Data:</strong> {formatarDataHora(sessaoCard.dataHora)}<br/><strong>Preço:</strong> R$ {parseFloat(sessaoCard.preco).toFixed(2).replace('.',',')}</Card.Text>
                        <AppButton variant={temImagemFilme ? "light" : "success"} onClick={() => handleAbrirVendaModal(sessaoCard)} disabled={sessaoCard.isEncerrada || sessaoCard.isLotada || isProcessingSale || loadingModalDetalhes} className="mt-auto w-100"><FaShoppingCart className="me-2"/> Comprar Ingresso</AppButton>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </>
      )}
      
      <Modal show={showVendaModal} onHide={handleFecharVendaModal} backdrop="static" keyboard={false} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaShoppingCart className="me-2" /> Comprar Ingressos para: {sessaoAtivaNoModal?.filmeTitulo || 'Sessão'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Mensagem de erro/sucesso DENTRO do modal, se houver, relacionada ao processo do modal */}
          {showVendaModal && message.text && <Alert variant={message.type} onClose={() => setMessage({ type: '', text: '' })} dismissible>{message.text}</Alert>}

          {loadingModalDetalhes && <div className="text-center my-3"><Spinner animation="border" /><p>Carregando detalhes da sessão...</p></div>}
          
          {sessaoAtivaNoModal && !loadingModalDetalhes && (
            <>
              <Card className="mb-3 shadow-sm"> 
                <Card.Body>
                  <Row>
                    <Col md={sessaoAtivaNoModal.filmeCartazBase64 ? 8 : 12}>
                      <Card.Title as="h5">{sessaoAtivaNoModal.filmeTitulo}</Card.Title>
                      <Card.Text>
                        <strong>Sala:</strong> {sessaoAtivaNoModal.salaNome}<br />
                        <strong>Data e Hora:</strong> {sessaoAtivaNoModal.dataHoraFormatada}<br />
                        <strong>Preço por assento:</strong> R$ {sessaoAtivaNoModal.precoFormatado}
                      </Card.Text>
                      {sessaoAtivaNoModal.isEncerrada && <Alert variant="secondary" className="py-1 mt-2"><FaExclamationTriangle className="me-2"/>Sessão Encerrada</Alert>}
                      {sessaoAtivaNoModal.isLotada && !sessaoAtivaNoModal.isEncerrada && <Alert variant="danger" className="py-1 mt-2"><FaLock className="me-2"/>Sessão Lotada</Alert>}
                    </Col>
                    {sessaoAtivaNoModal.filmeCartazBase64 && typeof sessaoAtivaNoModal.filmeCartazBase64 === 'string' && (
                        <Col md={4} className="text-center">
                            <Image src={sessaoAtivaNoModal.filmeCartazBase64} alt="Cartaz do Filme" fluid thumbnail style={{maxHeight: '150px'}}/>
                        </Col>
                    )}
                  </Row>
                </Card.Body>
              </Card>

              {!vendaBloqueadaModal && (
                <Card className="mb-3 shadow-sm">
                  <Card.Header as="h6"><FaChair className="me-2"/>Selecione os Assentos</Card.Header>
                  <Card.Body className="d-flex flex-wrap justify-content-center p-2" style={{ maxHeight: '250px', overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
                    {salaDoModal && salaDoModal.capacidade > 0 && layoutAssentosModal.length > 0 ? (
                      layoutAssentosModal.map(seatId => {
                        let cKey = 'available'; let dis = false;
                        if (assentosVendidosModal.includes(seatId)) { cKey = 'sold'; dis = true; }
                        else if (assentosSelecionadosModal.includes(seatId)) { cKey = 'selected'; }
                        return ( <button key={seatId} type="button" style={{ ...seatStyles.seat, ...seatStyles[cKey] }} onClick={() => handleSeatSelectModal(seatId)} disabled={dis || isProcessingSale} title={dis ? `Ocupado` : `Assento ${seatId}`} className={`fw-bold`} > {seatId} </button> );
                      })
                    ) : ( <p className="text-danger m-2">Layout de assentos indisponível.</p> )}
                  </Card.Body>
                  <Card.Footer className="text-center bg-light py-2">
                    {assentosSelecionadosModal.length > 0 ? (
                      <>Assentos: <span className="mt-2 d-block">Preço Total: R$ {precoTotalModal.replace('.', ',')}</span></>
                    ) : ( <span className="text-muted">Nenhum assento selecionado.</span> )}
                  </Card.Footer>
                </Card>
              )}

              {assentosSelecionadosModal.length > 0 && !vendaBloqueadaModal && (
                <IngressosForm
                  key={ingressoFormKeyModal}
                  onVendaSubmit={processarVendaModal}
                  onFormCancel={handleFecharVendaModal} 
                  submittingLock={isProcessingSale} 
                  selectedSeatsCount={assentosSelecionadosModal.length}
                />
              )}
            </>
          )}
        </Modal.Body>
         <Modal.Footer>
            <BsButton variant="secondary" onClick={handleFecharVendaModal} disabled={isProcessingSale}>
                Fechar
            </BsButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default VendaIngressos;