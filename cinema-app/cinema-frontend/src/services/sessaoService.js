const API_URL = 'http://localhost:3000/sessoes';

// Helper para garantir o tipo correto nos dados da sessão
const formatSessaoData = (data) => ({
  filmeId: Number(data.filmeId),
  salaId: Number(data.salaId),
  dataHora: new Date(data.dataHora).toISOString(),
  preco: parseFloat(data.preco),
  idioma: data.idioma,
  formato: data.formato,
});

// GET - Buscar todas as sessões
export const getSessoes = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao buscar sessões.');
    return await response.json();
  } catch (error) {
    console.error("Erro em getSessoes:", error);
    return [];
  }
};

// GET - Buscar sessão por ID
export const getSessaoById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Erro ao buscar sessão.');
    return await response.json();
  } catch (error) {
    console.error("Erro em getSessaoById:", error);
    throw error;
  }
};

// POST - Adicionar nova sessão
export const addSessao = async (sessaoData) => {
  try {
    const body = formatSessaoData(sessaoData);
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error('Erro ao adicionar sessão.');
    return await response.json();
  } catch (error) {
    console.error("Erro em addSessao:", error);
    throw error;
  }
};

// PUT - Atualizar sessão
export const updateSessao = async (id, sessaoAtualizada) => {
  try {
    const body = formatSessaoData(sessaoAtualizada);
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error('Erro ao atualizar sessão.');
    return await response.json();
  } catch (error) {
    console.error("Erro em updateSessao:", error);
    throw error;
  }
};

// DELETE - Deletar sessão
export const deleteSessao = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao deletar sessão.');
    return true;
  } catch (error) {
    console.error("Erro em deleteSessao:", error);
    throw error;
  }
};
