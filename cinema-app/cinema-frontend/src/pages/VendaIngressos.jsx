// src/pages/VendaIngressos.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Alert, Card, Spinner, Button as BsButton, Badge, Modal, Image } from 'react-bootstrap';
import AppButton from '../components/common/AppButton';
import IngressosForm from '../features/ingressos/IngressosForm';
import { addIngresso, getIngressosBySessao } from '../services/ingressoService';
import { getSessaoById, getSessoes } from '../services/sessaoService';
import { getFilmes } from '../services/filmeService';
import { getSalas } from '../services/salaService';
import { FaTicketAlt, FaChair, FaShoppingCart, FaExclamationTriangle, FaLock } from 'react-icons/fa';

const seatStyles = {
  seat: {
    width: '40px',
    height: '40px',
    margin: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#ccc', // <- isolado
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    userSelect: 'none',
  },
  available: { backgroundColor: '#f0f0f0', color: '#333' },
  selected: { backgroundColor: '#28a745', color: 'white', borderColor: '#1e7e34' },
  sold: { backgroundColor: '#dc3545', color: 'white', cursor: 'not-allowed', borderColor: '#bd2130' },
};

const gerarLayoutAssentos = (capacidade, assentosPorFileira = 10) => {
  const layout = [];
  const nomeFileiras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let contador = 0;
  for (const f of nomeFileiras) {
    for (let j = 1; j <= assentosPorFileira; j++) {
      if (contador >= capacidade) break;
      layout.push(`${f}${j}`);
      contador++;
    }
    if (contador >= capacidade) break;
  }
  return layout;
};

function VendaIngressos() {
  const { sessaoId: sessaoIdFromParams } = useParams();
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

  const formatarDataHora = useCallback((iso) => {
    if (!iso) return 'N/A';
    const d = new Date(iso);
    if (isNaN(d)) return 'N/A';
    const pad = n => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }, []);

  const carregarDadosParaModalVenda = useCallback(async (s) => {
    if (!s?.id) return setShowVendaModal(false);
    setLoadingModalDetalhes(true);
    setMessage({ type: '', text: '' });
    setAssentosSelecionadosModal([]);

    try {
      const [sessao, filmes, salas, ingressos] = await Promise.all([
        getSessaoById(s.id),
        getFilmes(),
        getSalas(),
        getIngressosBySessao(s.id),
      ]);
      const filme = filmes.find(f => f.id === sessao.filmeId);
      const sala = salas.find(x => x.id === sessao.salaId);
      const agora = new Date();
      const isEnc = new Date(sessao.dataHora) < agora;
      const isLot = sala ? ingressos.length >= sala.capacidade : false;

      setSessaoAtivaNoModal({
        ...sessao,
        filmeTitulo: filme?.titulo || 'N/A',
        filmeCartazBase64: filme?.cartazBase64 || null,
        salaNome: sala?.nome || 'N/A',
        dataHoraFormatada: formatarDataHora(sessao.dataHora),
        precoNumerico: parseFloat(sessao.preco),
        precoFormatado: parseFloat(sessao.preco).toFixed(2).replace('.', ','),
        isEncerrada: isEnc,
        isLotada: isLot,
      });

      setSalaDoModal(sala || null);
      if (sala?.capacidade > 0) {
        setLayoutAssentosModal(gerarLayoutAssentos(sala.capacidade));
        setAssentosVendidosModal(ingressos.map(i => i.assento));
      } else {
        setLayoutAssentosModal([]);
        setAssentosVendidosModal([]);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'warning', text: 'Erro ao carregar detalhes da sessão.' });
    } finally {
      setLoadingModalDetalhes(false);
    }
  }, [formatarDataHora]);

  const carregarSessoesParaListagem = useCallback(async () => {
    setLoadingPage(true);
    try {
      const [sess, filmes, salas] = await Promise.all([getSessoes(), getFilmes(), getSalas()]);
      if (!Array.isArray(sess)) throw new Error('getSessoes retornou inválido');

      const completo = await Promise.all(sess.map(async s => {
        const sala = salas.find(x => x.id === s.salaId);
        const ingressos = sala ? await getIngressosBySessao(s.id) : [];
        const agora = new Date();
        return {
          ...s,
          filmeTitulo: filmes.find(f => f.id === s.filmeId)?.titulo || 'N/A',
          filmeCartazBase64: filmes.find(f => f.id === s.filmeId)?.cartazBase64 || null,
          salaNome: sala?.nome || 'N/A',
          isEncerrada: new Date(s.dataHora) < agora,
          isLotada: sala ? ingressos.length >= sala.capacidade : false,
          preco: s.preco,
        };
      }));

      completo.sort((a, b) => {
        if (a.isEncerrada !== b.isEncerrada) return a.isEncerrada ? 1 : -1;
        if (a.isLotada !== b.isLotada) return a.isLotada ? 1 : -1;
        return new Date(a.dataHora) - new Date(b.dataHora);
      });

      setSessoesParaListar(completo);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'danger', text: 'Erro ao carregar sessões.' });
    } finally {
      setLoadingPage(false);
    }
  }, []);

  useEffect(() => {
    carregarSessoesParaListagem();

    if (sessaoIdFromParams) {
      getSessoes().then(sess => {
        if (!Array.isArray(sess)) return setMessage({ type: 'danger', text: 'Erro ao buscar sessões.' });
        const s = sess.find(x => x.id.toString() === sessaoIdFromParams);
        if (s) {
          carregarDadosParaModalVenda(s);
          setShowVendaModal(true);
        } else {
          setMessage({ type: 'danger', text: `Sessão ID ${sessaoIdFromParams} não encontrada.` });
        }
      }).catch(err => {
        console.error(err);
        setMessage({ type: 'danger', text: 'Erro ao buscar sessões.' });
      });
    }
  }, [sessaoIdFromParams, carregarDadosParaModalVenda, carregarSessoesParaListagem]);

  const handleAbrirVendaModal = s => {
    if (s.isEncerrada || s.isLotada) {
      setMessage({ type: 'warning', text: `Sessão "${s.filmeTitulo}" encerrada ou lotada.` });
      return;
    }
    carregarDadosParaModalVenda(s);
    setShowVendaModal(true);
    setIngressoFormKeyModal(Date.now());
  };

  const processarVendaModal = async formData => {
    if (!sessaoAtivaNoModal || !Array.isArray(assentosSelecionadosModal) || assentosSelecionadosModal.length === 0) return;

    setIsProcessingSale(true);
    try {
      const cpf = formData.cpfCliente.replace(/\D/g, '');
      let vendidas = 0;
      for (const seat of assentosSelecionadosModal) {
        await addIngresso({
          sessaoId: sessaoAtivaNoModal.id,
          nomeCliente: formData.nomeCliente,
          cpfCliente: cpf,
          assento: seat,
          tipoPagamento: formData.tipoPagamento,
        });
        vendidas++;
      }
      setMessage({ type: 'success', text: `${vendidas} ingresso(s) vendidos com sucesso!` });
      setShowVendaModal(false);
      carregarSessoesParaListagem();
    } catch (err) {
      console.error(err);
      setMessage({ type: 'danger', text: 'Erro ao processar venda.' });
    } finally {
      setIsProcessingSale(false);
    }
  };

  return (
    <div className="pb-5">
      <h2><FaTicketAlt className="me-2 text-success" /> Venda de Ingressos</h2>

      {!showVendaModal && message.text && (
        <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
          {message.text}
        </Alert>
      )}

      {loadingPage && (
        <div className="text-center my-4">
          <Spinner animation="border" /><p>Carregando sessões...</p>
        </div>
      )}

      {!loadingPage && Array.isArray(sessoesParaListar) && sessoesParaListar.length === 0 && (
        <Alert variant="info">Nenhuma sessão disponível.</Alert>
      )}

      {!loadingPage && Array.isArray(sessoesParaListar) && sessoesParaListar.length > 0 && !showVendaModal && (
        <Row xs={1} md={2} lg={3} className="g-4">
          {sessoesParaListar.map(s => (
            <Col key={s.id}>
              <Card
                className={`h-100 shadow-sm ${s.filmeCartazBase64 ? 'text-white' : ''}`}
                style={{
                  background: s.filmeCartazBase64
                    ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${s.filmeCartazBase64}) center/cover`
                    : '#fff'
                }}
              >
                <Card.Body className="d-flex flex-column">
                  <Card.Title>
                    {s.filmeTitulo}
                    {s.isEncerrada && <Badge bg="secondary" className="ms-2"><FaExclamationTriangle /></Badge>}
                    {s.isLotada && <Badge bg="danger" className="ms-2"><FaLock /></Badge>}
                  </Card.Title>
                  <Card.Subtitle>Sala: {s.salaNome}</Card.Subtitle>
                  <Card.Text className="flex-grow-1">
                    <strong>Data:</strong> {formatarDataHora(s.dataHora)}<br />
                    <strong>Preço:</strong> R$ {parseFloat(s.preco).toFixed(2).replace('.', ',')}
                  </Card.Text>
                  <AppButton
                    variant="success"
                    onClick={() => handleAbrirVendaModal(s)}
                    disabled={s.isEncerrada || s.isLotada || isProcessingSale}
                    className="mt-auto"
                  >
                    <FaShoppingCart className="me-2" /> Comprar Ingresso
                  </AppButton>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showVendaModal} size="xl" centered onHide={() => setShowVendaModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Comprar Ingressos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingModalDetalhes && (
            <div className="text-center my-3">
              <Spinner animation="border" /><p>Carregando detalhes...</p>
            </div>
          )}

          {sessaoAtivaNoModal && (
            <>
              <Card className="mb-3">
                <Card.Body>
                  <Row>
                    <Col md={8}>
                      <Card.Title>{sessaoAtivaNoModal.filmeTitulo}</Card.Title>
                      <Card.Text>
                        <strong>Sala:</strong> {sessaoAtivaNoModal.salaNome}<br />
                        <strong>Data/Hora:</strong> {sessaoAtivaNoModal.dataHoraFormatada}<br />
                        <strong>Preço:</strong> R$ {sessaoAtivaNoModal.precoFormatado}
                      </Card.Text>
                      {(sessaoAtivaNoModal.isEncerrada || sessaoAtivaNoModal.isLotada) && (
                        <Alert variant={sessaoAtivaNoModal.isLotada ? 'danger' : 'secondary'}>
                          {sessaoAtivaNoModal.isEncerrada ? 'Sessão Encerrada' : 'Sessão Lotada'}
                        </Alert>
                      )}
                    </Col>
                    {sessaoAtivaNoModal.filmeCartazBase64 && (
                      <Col md={4} className="text-center">
                        <Image src={sessaoAtivaNoModal.filmeCartazBase64} fluid thumbnail />
                      </Col>
                    )}
                  </Row>
                </Card.Body>
              </Card>

              <Card className="mb-3">
                <Card.Header><FaChair /> Selecionar Assentos</Card.Header>
                <Card.Body
                  className="d-flex flex-wrap gap-2 justify-content-start"
                  style={{ maxHeight: '250px', overflowY: 'auto' }}
                >
                  {layoutAssentosModal.map(seat => {
                    const status = assentosVendidosModal.includes(seat)
                      ? 'sold'
                      : assentosSelecionadosModal.includes(seat)
                        ? 'selected'
                        : 'available';
                    return (
                      <button
                        key={seat}
                        type="button"
                        style={{ ...seatStyles.seat, ...seatStyles[status] }}
                        onClick={() => {
                          if (status === 'sold' || sessaoAtivaNoModal.isEncerrada) return;
                          setAssentosSelecionadosModal(prev =>
                            prev.includes(seat) ? prev.filter(x => x !== seat) : [...prev, seat]
                          );
                        }}
                        disabled={status === 'sold' || sessaoAtivaNoModal.isEncerrada}
                      >
                        {seat}
                      </button>
                    );
                  })}
                </Card.Body>
                <Card.Footer>
                  {assentosSelecionadosModal.length > 0
                    ? `Assentos: ${assentosSelecionadosModal.join(', ')}`
                    : 'Nenhum assento selecionado.'}
                </Card.Footer>
              </Card>

              {assentosSelecionadosModal.length > 0 && (
                <IngressosForm
                  key={ingressoFormKeyModal}
                  onVendaSubmit={processarVendaModal}
                  onFormCancel={() => setShowVendaModal(false)}
                  submittingLock={isProcessingSale}
                  selectedSeatsCount={assentosSelecionadosModal.length}
                />
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <BsButton variant="secondary" onClick={() => setShowVendaModal(false)} disabled={isProcessingSale}>
            Fechar
          </BsButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default VendaIngressos;
