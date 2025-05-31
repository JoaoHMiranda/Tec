// src/services/ingressoService.js
import { addItemToArray, getItems } from './localStorageService';

const INGRESSOS_STORAGE_KEY = 'ingressos';

export const addIngresso = (ingressoData) => { 
  const newIngresso = { id: Date.now(), dataVenda: new Date().toISOString(), ...ingressoData };
  addItemToArray(INGRESSOS_STORAGE_KEY, newIngresso);
  return newIngresso;
};
export const getIngressosVendidos = () => getItems(INGRESSOS_STORAGE_KEY);
export const getIngressosPorSessao = (sessaoId) => {
    const todosIngressos = getIngressosVendidos();
    return todosIngressos.filter(ingresso => ingresso.sessaoId.toString() === sessaoId.toString());
};