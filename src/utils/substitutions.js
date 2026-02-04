// utils for ingredient substitutions

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

// Returns the effective ingredient name after applying user substitutions.
// Supports both string ingredient and object ingredient { name, subId, substitutes }.
export const getEffectiveIngredientName = (ingredient, recipeSubs = {}) => {
  if (!ingredient) return "";
  if (typeof ingredient === "string") return ingredient;
  const baseName = ingredient.name || "";
  const subId = ingredient.subId;
  if (!subId) return baseName;
  const chosen = recipeSubs?.[subId];
  return chosen || baseName;
};
