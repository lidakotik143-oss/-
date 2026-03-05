// src/utils/nutritionCalculator.js
// Утилита для автоматического расчета КБЖУ рецепта из ингредиентов

import { getProductById } from '../data/productsNutritionById.js';

/**
 * Конвертирует количество ингредиента в граммы
 * @param {string|number} quantity - количество (например, "200", "1-2", "")
 * @param {string} unit - единица измерения
 * @param {number} productId - ID продукта для стандартного веса штучных продуктов
 * @returns {number} - вес в граммах
 */
function convertToGrams(quantity, unit, productId) {
  // Если количество пустое или не указано, возвращаем 0
  if (!quantity || quantity === '') return 0;
  
  // Парсим количество (берем среднее, если диапазон типа "1-2")
  let amount = 0;
  const qtyStr = String(quantity).trim();
  
  if (qtyStr.includes('-')) {
    const [min, max] = qtyStr.split('-').map(s => parseFloat(s.trim()));
    amount = (min + max) / 2;
  } else {
    amount = parseFloat(qtyStr);
  }
  
  if (isNaN(amount)) return 0;
  
  const unitLower = (unit || '').toLowerCase().trim();
  
  // Стандартные веса для штучных продуктов
  const standardWeights = {
    601: 50,   // яйцо ~ 50г
    1708: 120, // банан ~ 120г
    1333: 75,  // луковица ~ 75г
    1347: 100, // помидор ~ 100г
    1344: 150, // перец болгарский ~ 150г
    1337: 75,  // морковь средняя ~ 75г
    1703: 200, // авокадо ~ 200г
    1719: 100, // лимон ~ 100г
    1370: 5,   // зубчик чеснока ~ 5г
  };
  
  // Если уже в граммах
  if (unitLower === 'г' || unitLower === 'гр' || unitLower === 'грамм') {
    return amount;
  }
  
  // Миллилитры примерно равны граммам для жидкостей
  if (unitLower === 'мл' || unitLower === 'миллилитр') {
    return amount;
  }
  
  // Штучные продукты
  if (unitLower === 'шт' || unitLower === 'штук' || unitLower === 'штука') {
    const standardWeight = standardWeights[productId] || 100; // по умолчанию 100г
    return amount * standardWeight;
  }
  
  // Ложки (примерные значения)
  if (unitLower.includes('ст.') || unitLower.includes('столов')) {
    return amount * 15; // столовая ложка ~ 15г
  }
  if (unitLower.includes('ч.') || unitLower.includes('чайн')) {
    return amount * 5; // чайная ложка ~ 5г
  }
  
  // Стаканы
  if (unitLower === 'стакан' || unitLower === 'стак') {
    return amount * 200; // стакан ~ 200мл/г
  }
  
  // Если единица не распознана, но есть productId, используем стандартный вес
  if (productId && standardWeights[productId]) {
    return amount * standardWeights[productId];
  }
  
  // По умолчанию считаем, что это граммы
  return amount;
}

/**
 * Рассчитывает КБЖУ для списка ингредиентов
 * @param {Array} ingredients - массив ингредиентов рецепта
 * @returns {Object} - объект с калориями, белками, жирами, углеводами
 */
export function calculateNutrition(ingredients) {
  if (!ingredients || !Array.isArray(ingredients)) {
    return { calories: 0, protein: 0, fats: 0, carbs: 0 };
  }
  
  let totalCalories = 0;
  let totalProtein = 0;
  let totalFats = 0;
  let totalCarbs = 0;
  
  ingredients.forEach(ingredient => {
    const { productId, quantity, unit } = ingredient;
    
    // Пропускаем ингредиенты без productId (соль, специи и т.д.)
    if (!productId) return;
    
    // Получаем данные о продукте
    const product = getProductById(productId);
    if (!product) return;
    
    // Конвертируем количество в граммы
    const grams = convertToGrams(quantity, unit, productId);
    if (grams === 0) return;
    
    // Рассчитываем КБЖУ (все значения в базе указаны на 100г)
    const factor = grams / 100;
    
    totalCalories += (product.calories || 0) * factor;
    totalProtein += (product.protein || 0) * factor;
    totalFats += (product.fats || 0) * factor;
    totalCarbs += (product.carbs || 0) * factor;
  });
  
  return {
    calories: Math.round(totalCalories),
    protein: Math.round(totalProtein * 10) / 10, // округляем до 1 знака
    fats: Math.round(totalFats * 10) / 10,
    carbs: Math.round(totalCarbs * 10) / 10
  };
}

/**
 * Рассчитывает КБЖУ для рецепта с учетом порций
 * @param {Object} recipe - объект рецепта
 * @param {Array} ingredients - массив ингредиентов (если не используются основные)
 * @returns {Object} - объект с общим и порционным КБЖУ
 */
export function calculateRecipeNutrition(recipe, ingredients = null) {
  const ingredientsToUse = ingredients || recipe.ingredients;
  const servings = recipe.servings || 1;
  
  const total = calculateNutrition(ingredientsToUse);
  
  return {
    total,
    perServing: {
      calories: Math.round(total.calories / servings),
      protein: Math.round((total.protein / servings) * 10) / 10,
      fats: Math.round((total.fats / servings) * 10) / 10,
      carbs: Math.round((total.carbs / servings) * 10) / 10
    }
  };
}

/**
 * Рассчитывает КБЖУ для варианта рецепта
 * @param {Object} recipe - основной рецепт
 * @param {Object} variant - вариант приготовления
 * @returns {Object} - объект с КБЖУ варианта
 */
export function calculateVariantNutrition(recipe, variant) {
  return calculateRecipeNutrition(
    { ...recipe, servings: recipe.servings },
    variant.ingredients
  );
}

export default {
  calculateNutrition,
  calculateRecipeNutrition,
  calculateVariantNutrition
};
