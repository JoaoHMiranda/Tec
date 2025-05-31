// src/features/filmes/FilmeForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Alert, Image } from 'react-bootstrap';
import AppInputField from '../../components/common/AppInputField';
import AppTextAreaField from '../../components/common/AppTextAreaField';
import AppSelectField from '../../components/common/AppSelectField';
import AppButton from '../../components/common/AppButton';

// Estas constantes podem ficar fora do componente se não mudam
const generosOptions = [
  { value: 'acao', label: 'Ação' }, { value: 'aventura', label: 'Aventura' },
  { value: 'comedia', label: 'Comédia' }, { value: 'drama', label: 'Drama' },
  { value: 'ficcao_cientifica', label: 'Ficção Científica' }, { value: 'terror', label: 'Terror' },
  { value: 'romance', label: 'Romance' }, { value: 'thriller', label: 'Thriller' },
  { value: 'animacao', label: 'Animação' }, { value: 'documentario', label: 'Documentário' },
  { value: 'outro', label: 'Outro' },
];

const classificacoesOptions = [
  { value: 'L', label: 'Livre (L)' }, { value: '10', label: '10 anos' },
  { value: '12', label: '12 anos' }, { value: '14', label: '14 anos' },
  { value: '16', label: '16 anos' }, { value: '18', label: '18 anos' },
];

function FilmeForm({ initialData, onSubmit, onCancel, isEditMode, submitting }) {
  const initialFormState = {
    titulo: '', 
    descricao: '', 
    genero: '', 
    classificacaoIndicativa: '',
    duracao: '', 
    dataEstreia: '',
    cartazBase64: '', // Para a imagem em Base64
  };

  const [filme, setFilme] = useState(initialFormState);
  const [formError, setFormError] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');

  useEffect(() => {
    if (isEditMode && initialData) {
      const dataFormatada = initialData.dataEstreia
        ? new Date(initialData.dataEstreia).toISOString().split('T')[0]
        : '';
      setFilme({ 
        ...initialFormState, // Garante que todos os campos existam no estado
        ...initialData, 
        dataEstreia: dataFormatada, 
        cartazBase64: initialData.cartazBase64 || '' 
      });
      setSelectedFileName(initialData.cartazBase64 ? 'Imagem carregada anteriormente' : '');
    } else {
      setFilme(initialFormState);
      setSelectedFileName('');
    }
  }, [initialData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilme((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Validação de tamanho: Máximo 2MB
        setFormError('A imagem é muito grande. Máximo de 2MB permitido.');
        setSelectedFileName('');
        setFilme(prev => ({ ...prev, cartazBase64: '' }));
        e.target.value = null; // Limpa o input de arquivo para permitir nova seleção
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilme(prev => ({ ...prev, cartazBase64: reader.result }));
        setSelectedFileName(file.name);
        setFormError(''); 
      };
      reader.onerror = () => {
        setFormError('Erro ao ler o arquivo da imagem.');
        setSelectedFileName('');
        setFilme(prev => ({ ...prev, cartazBase64: '' }));
      }
      reader.readAsDataURL(file);
    } else {
      // Se nenhum arquivo for selecionado (ex: o usuário cancela a seleção)
      // Mantém o valor anterior de cartazBase64 se estiver editando e já houver uma imagem
      // Ou limpa se for um novo cadastro ou se o usuário explicitamente remover o arquivo (difícil de detectar sem JS adicional)
      // Para simplificar, se o usuário desselecionar (o que é raro), vamos limpar.
      // Se estiver em modo de edição e quiser manter a imagem anterior, o usuário não deve interagir com o input de arquivo.
      if (!isEditMode || (isEditMode && !initialData?.cartazBase64)) { // Limpa se for novo ou se não havia imagem antes na edição
          setFilme(prev => ({ ...prev, cartazBase64: '' }));
      }
      setSelectedFileName('');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormError(''); 

    if (!filme.titulo.trim() || !filme.genero || !filme.classificacaoIndicativa || !filme.duracao || !filme.dataEstreia) {
      setFormError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    if (isNaN(parseInt(filme.duracao, 10)) || parseInt(filme.duracao, 10) <= 0) {
      setFormError('A duração deve ser um número inteiro positivo.');
      return;
    }
    // O campo de imagem (cartazBase64) é opcional, então não precisa de validação de obrigatoriedade aqui.
    onSubmit(filme); 
  };

  return (
    <Form onSubmit={handleFormSubmit} noValidate>
      {formError && <Alert variant="danger" onClose={() => setFormError('')} dismissible>{formError}</Alert>}
      
      <AppInputField 
        controlId="modalFilmeTitulo" 
        label="Título" 
        type="text" 
        name="titulo" 
        value={filme.titulo} 
        onChange={handleChange} 
        required 
        disabled={submitting} 
      />
      
      <Form.Group controlId="modalFilmeCartaz" className="mb-3">
        <Form.Label>Cartaz do Filme (Opcional, máx. 2MB)</Form.Label>
        <Form.Control 
          type="file" 
          name="cartazFile"
          accept="image/png, image/jpeg, image/gif, image/webp" 
          onChange={handleImageChange}
          disabled={submitting}
        />
        {selectedFileName && <Form.Text className="text-muted mt-1 d-block">Arquivo: {selectedFileName}</Form.Text>}
      </Form.Group>
      
      {filme.cartazBase64 && (
        <div className="mb-3 text-center">
          <p className="mb-1"><small>Pré-visualização:</small></p>
          <Image 
            src={filme.cartazBase64} 
            alt="Pré-visualização do cartaz" 
            thumbnail 
            style={{ maxHeight: '150px', width: 'auto', objectFit: 'contain' }}
          />
        </div>
      )}

      <Row>
        <Col md={6}>
          <AppInputField 
            controlId="modalFilmeDataEstreia" 
            label="Data de Estreia" 
            type="date" 
            name="dataEstreia" 
            value={filme.dataEstreia} 
            onChange={handleChange} 
            required 
            disabled={submitting} 
          />
        </Col>
        <Col md={6}>
          <AppInputField 
            controlId="modalFilmeDuracao" 
            label="Duração (min)" 
            type="number" 
            name="duracao" 
            value={filme.duracao} 
            onChange={handleChange} 
            required 
            min="1" 
            disabled={submitting} 
          />
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <AppSelectField 
            controlId="modalFilmeGenero" 
            label="Gênero" 
            name="genero" 
            value={filme.genero} 
            onChange={handleChange} 
            options={generosOptions} 
            placeholder="Selecione..." 
            required 
            disabled={submitting} 
          />
        </Col>
        <Col md={6}>
          <AppSelectField 
            controlId="modalFilmeClassificacao" 
            label="Classificação Indicativa"
            name="classificacaoIndicativa" 
            value={filme.classificacaoIndicativa} 
            onChange={handleChange} 
            options={classificacoesOptions} 
            placeholder="Selecione..." 
            required 
            disabled={submitting} 
          />
        </Col>
      </Row>
      
      <AppTextAreaField 
        controlId="modalFilmeDescricao" 
        label="Descrição" 
        name="descricao" 
        value={filme.descricao} 
        onChange={handleChange} 
        rows={3} 
        disabled={submitting} 
      />

      <div className="mt-3 d-flex justify-content-end">
        <AppButton variant="outline-secondary" onClick={onCancel} className="me-2" disabled={submitting}>
          Cancelar
        </AppButton>
        <AppButton type="submit" variant={isEditMode ? "info" : "primary"} disabled={submitting}>
          {submitting ? (isEditMode ? 'Atualizando...' : 'Salvando...') : (isEditMode ? 'Salvar Alterações' : 'Salvar Filme')}
        </AppButton>
      </div>
    </Form>
  );
}

export default FilmeForm;