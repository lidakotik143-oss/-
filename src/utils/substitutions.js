// utils for ingredient substitutions with productId support

import { PRODUCTS_BY_ID } from '../data/productsNutritionById.js';

// Build stable key for substitutions storage.
// If variantKey is provided, substitutions are per-variant.
export const getRecipeSubKey = (recipeId, variantKey = null) => {
  if (!recipeId) return "";
  return variantKey ? `recipe:${recipeId}|variant:${variantKey}` : `recipe:${recipeId}`;
};

export const SUBSTITUTIONS_STORAGE_KEY = "cookify_substitutions_v1";

export const loadUserSubstitutions = () => {
  try {
    const raw = localStorage.getItem(SUBSTITUTIONS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

export const saveUserSubstitutions = (allSubs) => {
  try {
    localStorage.setItem(SUBSTITUTIONS_STORAGE_KEY, JSON.stringify(allSubs || {}));
  } catch {
    // ignore
  }
};

// ✅ UPDATED: Returns the effective ingredient name after applying user substitutions.
// Now supports:
// - string ingredient
// - object ingredient with name
// - object ingredient with productId (looks up name from database)
export const getEffectiveIngredientName = (ingredient, recipeSubs = {}) => {
  if (!ingredient) return "";
  
  // If it's a string, return as is
  if (typeof ingredient === "string") return ingredient;
  
  // Get base name
  let baseName = ingredient.name;
  
  // If name is missing but productId exists, get name from database
  if (!baseName && ingredient.productId) {
    const product = PRODUCTS_BY_ID[ingredient.productId];
    if (product) {
      baseName = product.name;
    } else {
      console.warn(`⚠️ Product with ID ${ingredient.productId} not found in database`);
      baseName = `Product #${ingredient.productId}`;
    }
  }
  
  if (!baseName) return "";
  
  // Apply user substitutions if available
  const subId = ingredient.subId;
  if (!subId) return baseName;
  
  const chosen = recipeSubs?.[subId];
  return chosen || baseName;
};

// ✅ NEW: Get product object from ingredient (for KBJU calculations)
export const getProductFromIngredient = (ingredient) => {
  if (!ingredient || typeof ingredient === "string") return null;
  
  if (ingredient.productId) {
    return PRODUCTS_BY_ID[ingredient.productId] || null;
  }
  
  return null;
};
