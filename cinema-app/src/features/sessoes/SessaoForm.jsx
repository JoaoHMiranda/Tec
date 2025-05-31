// src/features/sessoes/SessaoForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Alert } from 'react-bootstrap';
import AppInputField from '../../components/common/AppInputField';
import AppSelectField from '../../components/common/AppSelectField';
import AppButton from '../../components/common/AppButton';

// Opções fixas para Idioma e Formato
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
        // Formata dataHora para o input datetime-local
        const dateObj = new Date(initialData.dataHora);
        if (!isNaN(dateObj.getTime())) {
          const year = dateObj.getFullYear();
          const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
          const day = dateObj.getDate().toString().padStart(2, '0');
          const hours = dateObj.getHours().toString().padStart(2, '0');
          const minutes = dateObj.getMinutes().toString().padStart(2, '0');
          dataHoraFormatada = `${year}-${month}-${day}T${hours}:${minutes}`;
        }
      } catch (e) {
        console.warn("Não foi possível formatar a dataHora para o input ao editar:", initialData.dataHora, e);
      }
      
      // Formata preço para exibição no formulário (ex: 30.00)
      const precoCarregado = (initialData.preco !== undefined && initialData.preco !== null && initialData.preco !== '')
                             ? parseFloat(initialData.preco).toFixed(2) 
                             : '';

      setSessao({ 
        ...initialFormState,
        ...initialData, 
        dataHora: dataHoraFormatada,
        preco: precoCarregado
      });
    } else {
      setSessao(initialFormState);
    }
  }, [initialData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'preco') {
      let valorPreco = value;

      // Permite apenas números e um separador decimal (ponto ou vírgula)
      // Remove outros caracteres não numéricos, exceto o primeiro separador decimal
      const partes = valorPreco.split(/[.,]/);
      let parteInteira = partes[0].replace(/[^0-9]/g, '');
      let parteDecimal = partes.length > 1 ? partes[1].replace(/[^0-9]/g, '') : '';

      if (parteDecimal.length > 2) {
        parteDecimal = parteDecimal.substring(0, 2); // Trunca para 2 casas decimais
      }
      
      if (partes.length > 1) { // Se tinha um separador decimal
        valorPreco = `${parteInteira}.${parteDecimal}`;
      } else {
        valorPreco = parteInteira;
      }
      
      // Evita que o campo fique apenas com "." se o usuário apagar os números
      if (valorPreco === '.') {
          valorPreco = '0.';
      }
      // Evita múltiplos zeros à esquerda, a menos que seja "0."
      if (valorPreco.startsWith('0') && valorPreco.length > 1 && valorPreco[1] !== '.') {
        valorPreco = valorPreco.substring(1);
      }


      setSessao((prev) => ({ ...prev, [name]: valorPreco }));
    } else {
      setSessao((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormError(''); 

    if (!sessao.filmeId || !sessao.salaId || !sessao.dataHora || !sessao.preco || !sessao.idioma || !sessao.formato) {
      setFormError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const precoNumerico = parseFloat(sessao.preco);
    if (isNaN(precoNumerico) || precoNumerico <= 0) {
      setFormError('O preço deve ser um número positivo e válido (ex: 25.50).');
      return;
    }
    
    const dataSessao = new Date(sessao.dataHora);
    const agora = new Date();
    // Remove segundos e milissegundos para uma comparação mais justa, 
    // pois o input datetime-local não lida com eles por padrão.
    agora.setSeconds(0,0); 
    if (dataSessao < agora) {
        setFormError('A data e hora da sessão não podem estar no passado.');
        return;
    }

    const dadosSessaoParaSalvar = {
      ...sessao,
      preco: precoNumerico.toFixed(2) // Garante que o preço salvo tenha duas casas decimais como string
    };

    onSubmit(dadosSessaoParaSalvar); 
  };

  return (
    <Form onSubmit={handleFormSubmit} noValidate>
      {formError && <Alert variant="danger" onClose={() => setFormError('')} dismissible>{formError}</Alert>}
      
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