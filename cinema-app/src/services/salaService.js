// src/services/salaService.js
import { addItemToArray, getItems, saveData } from './localStorageService';

const SALAS_STORAGE_KEY = 'salas';

export const addSala = (salaData) => { 
  const newSala = { id: Date.now(), ...salaData };
  addItemToArray(SALAS_STORAGE_KEY, newSala);
  return newSala;
};
export const getSalas = () => getItems(SALAS_STORAGE_KEY);
export const getSalaById = (id) => getSalas().find(s => s.id.toString() === id.toString());
export const updateSala = (id, salaAtualizada) => {
  let salas = getSalas();
  const index = salas.findIndex(s => s.id.toString() === id.toString());
  if (index !== -1) {
    salas[index] = { ...salas[index], ...salaAtualizada, id: salas[index].id };
    saveData(SALAS_STORAGE_KEY, salas);
    return salas[index];
  }
  return null;
};
export const deleteSala = (idToDelete) => {
  let salasAtuais = getSalas();
  const salasFiltradas = salasAtuais.filter(sala => sala.id.toString() !== idToDelete.toString());
  if (salasFiltradas.length < salasAtuais.length) {
    saveData(SALAS_STORAGE_KEY, salasFiltradas);
    return true;
  }
  return false;
};