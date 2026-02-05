// Ingredient canonicalization + allergen helpers

import { INGREDIENTS_DICTIONARY } from "../data/ingredientsDictionary";

const normalizeRu = (s) =>
  (s || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[()]/g, " ")
    .replace(/\s+/g, " ");

// Tries to reduce "соль, перец" / "соль и перец" etc. to tokens.
const splitCompound = (name) => {
  const n = normalizeRu(name);
  if (!n) return [];
  // split by commas and common conjunctions
  return n
    .split(/,|\sи\s|\s\/\s|\s&\s/)
    .map(x => x.trim())
    .filter(Boolean);
};

export const buildAliasIndex = () => {
  const idx = new Map();
  Object.values(INGREDIENTS_DICTIONARY).forEach(item => {
    (item.aliasesRu || []).forEach(a => {
      idx.set(normalizeRu(a), item.id);
    });
    idx.set(normalizeRu(item.nameRu), item.id);
  });
  return idx;
};

const ALIAS_INDEX = buildAliasIndex();

export const getIngredientIdByName = (name) => {
  const n = normalizeRu(name);
  if (!n) return null;

  // direct match
  if (ALIAS_INDEX.has(n)) return ALIAS_INDEX.get(n);

  // try compound split
  const parts = splitCompound(n);
  if (parts.length === 1 && ALIAS_INDEX.has(parts[0])) return ALIAS_INDEX.get(parts[0]);

  return null;
};

export const getAllergenTagsForIngredientName = (name) => {
  const id = getIngredientIdByName(name);
  if (!id) return [];
  return INGREDIENTS_DICTIONARY?.[id]?.allergenTags || [];
};

export const ingredientMatchesUserAllergens = (ingredientName, userAllergenTags = []) => {
  const tags = getAllergenTagsForIngredientName(ingredientName);
  if (!tags.length) return false;
  return tags.some(t => userAllergenTags.includes(t));
};
