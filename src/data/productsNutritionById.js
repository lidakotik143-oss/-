// src/data/productsNutritionById.js
// Индекс продуктов по ID для быстрого доступа

import { PRODUCTS_NUTRITION } from './productsNutrition.js';

// Создаем индексы для быстрого поиска
export const PRODUCTS_BY_ID = {};
export const PRODUCTS_BY_NAME = {};

Object.entries(PRODUCTS_NUTRITION).forEach(([name, data]) => {
  PRODUCTS_BY_ID[data.id] = { 
    ...data, 
    name: name  // сохраняем название для отображения
  };
  PRODUCTS_BY_NAME[name.toLowerCase()] = { 
    ...data, 
    name: name 
  };
});

// Вспомогательные функции для удобства
export function getProductById(id) {
  return PRODUCTS_BY_ID[id] || null;
}

export function getProductNameById(id) {
  return PRODUCTS_BY_ID[id]?.name || null;
}

export function findProductByName(name) {
  if (!name) return null;
  return PRODUCTS_BY_NAME[name.toLowerCase().trim()] || null;
}

// Экспорт для обратной совместимости
export default {
  PRODUCTS_BY_ID,
  PRODUCTS_BY_NAME,
  getProductById,
  getProductNameById,
  findProductByName
};
