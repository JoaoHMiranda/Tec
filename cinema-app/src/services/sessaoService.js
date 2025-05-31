// src/services/sessaoService.js
import { addItemToArray, getItems, saveData } from './localStorageService';

const SESSOES_STORAGE_KEY = 'sessoes';

export const addSessao = (sessaoData) => { 
  const newSessao = { id: Date.now(), ...sessaoData };
  addItemToArray(SESSOES_STORAGE_KEY, newSessao);
  return newSessao;
};
export const getSessoes = () => getItems(SESSOES_STORAGE_KEY);
export const getSessaoById = (id) => getSessoes().find(s => s.id.toString() === id.toString());
export const updateSessao = (id, sessaoAtualizada) => {
  let sessoes = getSessoes();
  const index = sessoes.findIndex(s => s.id.toString() === id.toString());
  if (index !== -1) {
    sessoes[index] = { ...sessoes[index], ...sessaoAtualizada, id: sessoes[index].id };
    saveData(SESSOES_STORAGE_KEY, sessoes);
    return sessoes[index];
  }
  return null;
};
export const deleteSessao = (idToDelete) => {
  let sessoesAtuais = getSessoes();
  const sessoesFiltradas = sessoesAtuais.filter(sessao => sessao.id.toString() !== idToDelete.toString());
  if (sessoesFiltradas.length < sessoesAtuais.length) {
    saveData(SESSOES_STORAGE_KEY, sessoesFiltradas);
    return true;
  }
  return false;
};