// src/features/ingressos/IngressosForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Alert } from 'react-bootstrap';
import AppInputField from '../../components/common/AppInputField';
import AppSelectField from '../../components/common/AppSelectField';
import AppButton from '../../components/common/AppButton';
import { FaCheckCircle } from 'react-icons/fa';

const formatCPF = (value) => {
  if (!value) return '';
  const cpf = value.replace(/\D/g, '').substring(0, 11);
  if (cpf.length <= 3) return cpf;
  if (cpf.length <= 6) return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
  if (cpf.length <= 9) return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
  return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
};

const tipoPagamentoOptions = [
  { value: 'cartao_credito', label: 'Cartão de Crédito' },
  { value: 'cartao_debito', label: 'Cartão de Débito' },
  { value: 'pix', label: 'PIX' },
  { value: 'dinheiro', label: 'Dinheiro' },
];

function IngressosForm({ 
  onVendaSubmit, 
  onFormCancel, 
  submittingLock, 
  selectedSeatsCount = 0,
}) {
  const [formData, setFormData] = useState({
    nomeCliente: '',
    cpfCliente: '',
    tipoPagamento: '',
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    setFormData({ nomeCliente: '', cpfCliente: '', tipoPagamento: '' });
    setFormError('');
  }, [selectedSeatsCount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cpfCliente' ? formatCPF(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    const { nomeCliente, cpfCliente, tipoPagamento } = formData;
    const cpfLimpo = cpfCliente.replace(/\D/g, '');

    if (!nomeCliente.trim() || !cpfCliente.trim() || !tipoPagamento) {
      return setFormError('Todos os campos de cliente e pagamento são obrigatórios.');
    }

    if (cpfLimpo.length !== 11) {
      return setFormError('CPF inválido. Deve conter 11 dígitos.');
    }

    if (submittingLock) return;
    onVendaSubmit({ ...formData, cpfCliente: cpfLimpo });
  };

  return (
    <Form onSubmit={handleSubmit} noValidate>
      {formError && <Alert variant="danger" onClose={() => setFormError('')} dismissible>{formError}</Alert>}
      <Row>
        <Col md={6} className="mb-3">
          <AppInputField
            label="Nome do Cliente" name="nomeCliente" value={formData.nomeCliente}
            onChange={handleChange} placeholder="Nome completo" required disabled={submittingLock}
          />
        </Col>
        <Col md={6} className="mb-3">
          <AppInputField
            label="CPF do Cliente" type="text" name="cpfCliente" value={formData.cpfCliente}
            onChange={handleChange} placeholder="000.000.000-00" maxLength={14}
            inputMode="numeric" required disabled={submittingLock}
          />
        </Col>
      </Row>
      <Row>
        <Col md={12} className="mb-3">
          <AppSelectField
            label="Tipo de Pagamento" name="tipoPagamento" value={formData.tipoPagamento}
            onChange={handleChange} options={tipoPagamentoOptions}
            placeholder="Selecione o tipo de pagamento..." required disabled={submittingLock}
          />
        </Col>
      </Row>
      <div className="mt-4 d-flex justify-content-end">
        {onFormCancel && (
          <AppButton variant="outline-secondary" onClick={onFormCancel} className="me-2" disabled={submittingLock}>
            Cancelar Processo
          </AppButton>
        )}
        <AppButton
          type="submit" variant="success"
          disabled={submittingLock || selectedSeatsCount === 0}
        >
          <FaCheckCircle className="me-2" />
          {submittingLock ? 'Processando Pagamento...' : `Pagar (${selectedSeatsCount} assento(s))`}
        </AppButton>
      </div>
    </Form>
  );
}

export default IngressosForm;
