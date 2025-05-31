// src/services/localStorageService.js
export const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`[LS_SVC] Erro ao salvar dados para chave "${key}":`, error);
  }
};

export const loadData = (key) => {
  try {
    const dataString = localStorage.getItem(key);
    return dataString ? JSON.parse(dataString) : null;
  } catch (error) {
    console.error(`[LS_SVC] Erro ao carregar dados da chave "${key}":`, error);
    return null;
  }
};

export const addItemToArray = (key, item) => {
  try {
    const existingArray = loadData(key) || [];
    if (Array.isArray(existingArray)) {
      existingArray.push(item);
      saveData(key, existingArray);
    } else {
      console.error(`[LS_SVC] Valor para "${key}" não é array. Iniciando novo array.`);
      saveData(key, [item]);
    }
  } catch (error) {
    console.error(`[LS_SVC] Erro ao adicionar item ao array da chave "${key}":`, error);
  }
};

export const getItems = (key) => {
  const data = loadData(key);
  return Array.isArray(data) ? data : [];
};