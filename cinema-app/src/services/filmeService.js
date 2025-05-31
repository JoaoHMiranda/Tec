// src/services/filmeService.js
import { addItemToArray, getItems, saveData } from './localStorageService'; 

const FILMES_STORAGE_KEY = 'filmes';

export const addFilme = (filmeData) => { 
  const newFilme = { id: Date.now(), ...filmeData };
  addItemToArray(FILMES_STORAGE_KEY, newFilme);
  return newFilme;
};
export const getFilmes = () => getItems(FILMES_STORAGE_KEY);
export const getFilmeById = (id) => getFilmes().find(f => f.id.toString() === id.toString());
export const updateFilme = (id, filmeAtualizado) => {
  let filmes = getFilmes();
  const index = filmes.findIndex(f => f.id.toString() === id.toString());
  if (index !== -1) {
    filmes[index] = { ...filmes[index], ...filmeAtualizado, id: filmes[index].id };
    saveData(FILMES_STORAGE_KEY, filmes);
    return filmes[index];
  }
  return null;
};
export const deleteFilme = (idToDelete) => {
  let filmesAtuais = getFilmes();
  const filmesFiltrados = filmesAtuais.filter(filme => filme.id.toString() !== idToDelete.toString());
  if (filmesFiltrados.length < filmesAtuais.length) {
    saveData(FILMES_STORAGE_KEY, filmesFiltrados);
    return true; 
  }
  return false; 
};