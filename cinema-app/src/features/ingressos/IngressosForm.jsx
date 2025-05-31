// src/features/ingressos/IngressosForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Alert } from 'react-bootstrap';
import AppInputField from '../../components/common/AppInputField';
import AppSelectField from '../../components/common/AppSelectField';
import AppButton from '../../components/common/AppButton';
import { FaCheckCircle } from 'react-icons/fa';

// Função para formatar o CPF
const formatCPF = (value) => {
  if (!value) return "";
  const cpf = value.replace(/\D/g, '').substring(0, 11);
  let formattedCPF = cpf;
  if (cpf.length > 9) {
    formattedCPF = `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-${cpf.substring(9)}`;
  } else if (cpf.length > 6) {
    formattedCPF = `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6)}`;
  } else if (cpf.length > 3) {
    formattedCPF = `${cpf.substring(0, 3)}.${cpf.substring(3)}`;
  }
  return formattedCPF;
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
    setFormData({ nomeCliente: '', cpfCliente: '', tipoPagamento: ''});
    setFormError('');
  }, []); 


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cpfCliente') {
      setFormData((prev) => ({ ...prev, cpfCliente: formatCPF(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.nomeCliente.trim() || !formData.cpfCliente.trim() || !formData.tipoPagamento) {
      setFormError('Todos os campos de cliente e pagamento são obrigatórios.');
      return;
    }
    if (formData.cpfCliente.replace(/\D/g, '').length !== 11) {
      setFormError('CPF inválido. Deve conter 11 dígitos.');
      return;
    }
    onVendaSubmit(formData); 
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