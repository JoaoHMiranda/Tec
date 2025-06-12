// src/services/salaService.js

const API_URL = 'http://localhost:3000/salas';

// GET - Buscar todas as salas
export const getSalas = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao buscar salas.');
    return await response.json();
  } catch (error) {
    console.error("Erro em getSalas:", error);
    return [];
  }
};

// GET - Buscar uma sala por ID
export const getSalaById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Erro ao buscar sala.');
    return await response.json();
  } catch (error) {
    console.error("Erro em getSalaById:", error);
    throw error;
  }
};

// POST - Criar nova sala
export const addSala = async (salaData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(salaData),
    });
    if (!response.ok) throw new Error('Erro ao adicionar sala.');
    return await response.json();
  } catch (error) {
    console.error("Erro em addSala:", error);
    throw error;
  }
};

// PUT - Atualizar sala
export const updateSala = async (id, salaAtualizada) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(salaAtualizada),
    });
    if (!response.ok) throw new Error('Erro ao atualizar sala.');
    return await response.json();
  } catch (error) {
    console.error("Erro em updateSala:", error);
    throw error;
  }
};

// DELETE - Remover sala
export const deleteSala = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao deletar sala.');
    return true;
  } catch (error) {
    console.error("Erro em deleteSala:", error);
    throw error;
  }
};
