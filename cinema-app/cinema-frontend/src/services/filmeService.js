// src/services/filmeService.js

const API_URL = 'http://localhost:3000/filmes';

// GET - Buscar todos os filmes
export const getFilmes = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao buscar filmes.');
    return await response.json();
  } catch (error) {
    console.error("Erro em getFilmes:", error);
    return [];
  }
};

// GET - Buscar filme por ID
export const getFilmeById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Erro ao buscar filme.');
    return await response.json();
  } catch (error) {
    console.error("Erro em getFilmeById:", error);
    throw error;
  }
};

// POST - Adicionar novo filme
export const addFilme = async (filmeData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filmeData),
    });
    if (!response.ok) throw new Error('Erro ao adicionar filme.');
    return await response.json();
  } catch (error) {
    console.error("Erro em addFilme:", error);
    throw error;
  }
};

// PUT - Atualizar filme
export const updateFilme = async (id, filmeAtualizado) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filmeAtualizado),
    });
    if (!response.ok) throw new Error('Erro ao atualizar filme.');
    return await response.json();
  } catch (error) {
    console.error("Erro em updateFilme:", error);
    throw error;
  }
};

// DELETE - Deletar filme
export const deleteFilme = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao deletar filme.');
    return true;
  } catch (error) {
    console.error("Erro em deleteFilme:", error);
    throw error;
  }
};
