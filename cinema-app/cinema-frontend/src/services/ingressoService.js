// src/services/ingressoService.js

const API_URL = 'http://localhost:3000/ingressos';

// GET - Buscar todos os ingressos
export const getIngressos = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao buscar ingressos.');
    return await response.json();
  } catch (error) {
    console.error("Erro em getIngressos:", error);
    return [];
  }
};

// GET - Buscar ingressos por sessão
export const getIngressosBySessao = async (sessaoId) => {
  try {
    const response = await fetch(`${API_URL}/sessao/${sessaoId}`);
    if (!response.ok) throw new Error('Erro ao buscar ingressos da sessão.');
    return await response.json();
  } catch (error) {
    console.error("Erro em getIngressosBySessao:", error);
    return [];
  }
};

// POST - Adicionar novo ingresso
export const addIngresso = async (ingressoData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ingressoData),
    });
    if (!response.ok) throw new Error('Erro ao adicionar ingresso.');
    return await response.json();
  } catch (error) {
    console.error("Erro em addIngresso:", error);
    throw error;
  }
};

// DELETE - Deletar ingresso
export const deleteIngresso = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao deletar ingresso.');
    return true;
  } catch (error) {
    console.error("Erro em deleteIngresso:", error);
    throw error;
  }
};
