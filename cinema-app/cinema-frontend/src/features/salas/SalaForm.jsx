import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Alert } from 'react-bootstrap';
import AppInputField from '../../components/common/AppInputField';
import AppSelectField from '../../components/common/AppSelectField';
import AppButton from '../../components/common/AppButton';

// Opções para o campo select de tipo de sala
const tiposSalaOptions = [
  { value: '2D', label: '2D' },
  { value: '3D', label: '3D' },
  { value: 'IMAX', label: 'IMAX' },
  { value: 'VIP', label: 'VIP' },
];

function SalaForm({ initialData, onSubmit, onCancel, isEditMode, submitting }) {
  const initialFormState = {
    nome: '',
    capacidade: '',
    tipo: '',
  };

  const [sala, setSala] = useState(initialFormState);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isEditMode && initialData) {
      setSala(initialData);
    } else {
      setSala(initialFormState);
    }
  }, [initialData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSala((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!sala.nome.trim() || !sala.capacidade || !sala.tipo) {
      setFormError('Por favor, preencha todos os campos: Nome da Sala, Capacidade e Tipo.');
      return;
    }

    const capacidadeNumerica = parseInt(sala.capacidade, 10);
    if (isNaN(capacidadeNumerica) || capacidadeNumerica <= 0) {
      setFormError('A capacidade deve ser um número inteiro positivo.');
      return;
    }

    // Garante que a capacidade é enviada como número
    const dadosFormatados = {
      ...sala,
      capacidade: capacidadeNumerica,
    };

    onSubmit(dadosFormatados);
  };

  return (
    <Form onSubmit={handleFormSubmit} noValidate>
      {formError && <Alert variant="danger">{formError}</Alert>}

      <AppInputField
        controlId="modalSalaNome"
        label="Nome da Sala"
        type="text"
        name="nome"
        value={sala.nome}
        onChange={handleChange}
        placeholder="Ex: Sala 1 Prime, Sala Confort"
        required
        disabled={submitting}
      />

      <Row>
        <Col md={6}>
          <AppInputField
            controlId="modalSalaCapacidade"
            label="Capacidade (assentos)"
            type="number"
            name="capacidade"
            value={sala.capacidade}
            onChange={handleChange}
            placeholder="Ex: 120"
            required
            min="1"
            disabled={submitting}
          />
        </Col>
        <Col md={6}>
          <AppSelectField
            controlId="modalSalaTipo"
            label="Tipo da Sala"
            name="tipo"
            value={sala.tipo}
            onChange={handleChange}
            options={tiposSalaOptions}
            placeholder="Selecione o Tipo"
            required
            disabled={submitting}
          />
        </Col>
      </Row>

      <div className="mt-4 d-flex justify-content-end">
        <AppButton
          variant="outline-secondary"
          onClick={onCancel}
          className="me-2"
          disabled={submitting}
        >
          Cancelar
        </AppButton>
        <AppButton
          type="submit"
          variant={isEditMode ? 'info' : 'primary'}
          disabled={submitting}
        >
          {submitting
            ? isEditMode
              ? 'Atualizando...'
              : 'Salvando...'
            : isEditMode
            ? 'Salvar Alterações'
            : 'Salvar Sala'}
        </AppButton>
      </div>
    </Form>
  );
}

export default SalaForm;
