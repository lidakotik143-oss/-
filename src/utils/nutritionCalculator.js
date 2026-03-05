import { PRODUCTS_BY_ID } from "../data/productsNutritionById";

// Конвертация единиц измерения в граммы
const convertToGrams = (quantity, unit = "г") => {
  const num = parseFloat(String(quantity).replace(",", ".")) || 0;

  const conversions = {
    "г": 1,
    "гр": 1,
    "кг": 1000,
    "мл": 1,      // грубо для воды/молока
    "л": 1000,
    "ст. л.": 15,
    "ст.л.": 15,
    "ч. л.": 5,
    "ч.л.": 5,
    "стакан": 200,
    "шт": 50
  };

  const key = unit.toLowerCase().trim();
  return num * (conversions[key] || 50);
};

// Расчёт КБЖУ для одного ингредиента
export const calculateIngredientNutrition = (ingredient) => {
  if (!ingredient?.productId || !ingredient.quantity) {
    return { calories: 0, protein: 0, fat: 0, carbs: 0, weight: 0 };
  }

  const product = PRODUCTS_BY_ID[ingredient.productId];
  if (!product) {
    return { calories: 0, protein: 0, fat: 0, carbs: 0, weight: 0 };
  }

  const weight = convertToGrams(ingredient.quantity, ingredient.unit || "г");
  const ratio = weight / 100; // КБЖУ указаны на 100г

  return {
    calories: Math.round((product.calories || 0) * ratio),
    protein: Math.round((product.protein || 0) * ratio * 10) / 10,
    fat: Math.round((product.fat || 0) * ratio * 10) / 10,
    carbs: Math.round((product.carbs || 0) * ratio * 10) / 10,
    weight: Math.round(weight)
  };
};

// Расчёт КБЖУ для всего рецепта
export const calculateRecipeNutrition = (ingredients = [], servings = 1) => {
  const total = ingredients.reduce(
    (acc, ing) => {
      const n = calculateIngredientNutrition(ing);
      return {
        calories: acc.calories + n.calories,
        protein: acc.protein + n.protein,
        fat: acc.fat + n.fat,
        carbs: acc.carbs + n.carbs,
        weight: acc.weight + n.weight
      };
    },
    { calories: 0, protein: 0, fat: 0, carbs: 0, weight: 0 }
  );

  const s = servings || 1;

  const perServing = {
    calories: Math.round(total.calories / s),
    protein: Math.round((total.protein / s) * 10) / 10,
    fat: Math.round((total.fat / s) * 10) / 10,
    carbs: Math.round((total.carbs / s) * 10) / 10,
    weight: Math.round(total.weight / s)
  };

  return { total, perServing };
};
