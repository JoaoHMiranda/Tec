import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Alert } from 'react-bootstrap';
import AppInputField from '../../components/common/AppInputField';
import AppSelectField from '../../components/common/AppSelectField';
import AppButton from '../../components/common/AppButton';

const idiomaOptions = [
  { value: 'dublado', label: 'Dublado' },
  { value: 'legendado', label: 'Legendado' },
];

const formatoOptions = [
  { value: '2D', label: '2D' },
  { value: '3D', label: '3D' },
];

function SessaoForm({
  initialData,
  onSubmit,
  onCancel,
  isEditMode,
  submitting,
  filmesOptions = [],
  salasOptions = []
}) {
  const initialFormState = {
    filmeId: '',
    salaId: '',
    dataHora: '',
    preco: '',
    idioma: '',
    formato: '',
  };

  const [sessao, setSessao] = useState(initialFormState);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isEditMode && initialData) {
      let dataHoraFormatada = initialData.dataHora;
      try {
        const d = new Date(initialData.dataHora);
        if (!isNaN(d.getTime())) {
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          const hh = String(d.getHours()).padStart(2, '0');
          const mi = String(d.getMinutes()).padStart(2, '0');
          dataHoraFormatada = `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
        }
      } catch (e) {
        console.warn("Erro ao formatar dataHora:", e);
      }

      setSessao({
        ...initialFormState,
        ...initialData,
        dataHora: dataHoraFormatada,
        preco: parseFloat(initialData.preco).toFixed(2)
      });
    } else {
      setSessao(initialFormState);
    }
  }, [initialData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'preco') {
      const clean = value.replace(/[^\d.,]/g, '');
      const [int, dec] = clean.split(/[.,]/);
      const preco = dec ? `${int}.${dec.slice(0, 2)}` : int;
      setSessao(prev => ({ ...prev, [name]: preco }));
    } else {
      setSessao(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    const { filmeId, salaId, dataHora, preco, idioma, formato } = sessao;

    if (!filmeId || !salaId || !dataHora || !preco || !idioma || !formato) {
      setFormError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const precoNum = parseFloat(preco);
    if (isNaN(precoNum) || precoNum <= 0) {
      setFormError('Preço inválido. Deve ser maior que zero.');
      return;
    }

    const dataSessao = new Date(dataHora);
    const agora = new Date();
    agora.setSeconds(0, 0);

    if (dataSessao < agora) {
      setFormError('A data e hora da sessão não podem estar no passado.');
      return;
    }

    onSubmit({
      ...sessao,
      preco: precoNum.toFixed(2)
    });
  };

  return (
    <Form onSubmit={handleFormSubmit} noValidate>
      {formError && (
        <Alert variant="danger" onClose={() => setFormError('')} dismissible>
          {formError}
        </Alert>
      )}

      <Row className="mb-3">
        <Col md={6}>
          <AppSelectField
            controlId="modalSessaoFilme"
            label="Filme"
            name="filmeId"
            value={sessao.filmeId}
            onChange={handleChange}
            options={filmesOptions}
            placeholder="Selecione o Filme"
            required
            disabled={submitting}
          />
        </Col>
        <Col md={6}>
          <AppSelectField
            controlId="modalSessaoSala"
            label="Sala"
            name="salaId"
            value={sessao.salaId}
            onChange={handleChange}
            options={salasOptions}
            placeholder="Selecione a Sala"
            required
            disabled={submitting}
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <AppInputField
            controlId="modalSessaoDataHora"
            label="Data e Hora"
            type="datetime-local"
            name="dataHora"
            value={sessao.dataHora}
            onChange={handleChange}
            required
            disabled={submitting}
          />
        </Col>
        <Col md={6}>
          <AppInputField
            controlId="modalSessaoPreco"
            label="Preço (R$)"
            type="number"
            name="preco"
            value={sessao.preco}
            onChange={handleChange}
            placeholder="Ex: 30.00"
            required
            step="0.01"
            min="0.01"
            disabled={submitting}
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <AppSelectField
            controlId="modalSessaoIdioma"
            label="Idioma"
            name="idioma"
            value={sessao.idioma}
            onChange={handleChange}
            options={idiomaOptions}
            placeholder="Selecione o Idioma"
            required
            disabled={submitting}
          />
        </Col>
        <Col md={6}>
          <AppSelectField
            controlId="modalSessaoFormato"
            label="Formato de Exibição"
            name="formato"
            value={sessao.formato}
            onChange={handleChange}
            options={formatoOptions}
            placeholder="Selecione o Formato"
            required
            disabled={submitting}
          />
        </Col>
      </Row>

      <div className="mt-4 d-flex justify-content-end">
        <AppButton variant="outline-secondary" onClick={onCancel} className="me-2" disabled={submitting}>
          Cancelar
        </AppButton>
        <AppButton type="submit" variant={isEditMode ? "info" : "primary"} disabled={submitting}>
          {submitting ? (isEditMode ? 'Atualizando...' : 'Salvando...') : (isEditMode ? 'Salvar Alterações' : 'Salvar Sessão')}
        </AppButton>
      </div>
    </Form>
  );
}

export default SessaoForm;
