/**
 * Возвращает приоритет совпадения (меньше = лучше):
 * 0 — строка начинается с запроса
 * 1 — одно из слов строки начинается с запроса
 * 2 — строка просто содержит запрос
 */
export function matchRank(str, query) {
  const s = (str || "").toLowerCase();
  const q = (query || "").toLowerCase();
  if (!q) return 2;
  if (s.startsWith(q)) return 0;
  if (s.split(/[\s,]+/).some(word => word.startsWith(q))) return 1;
  return 2;
}

/**
 * Фильтрует и сортирует массив строк-ключей по релевантности запроса.
 * Сначала идут те, что начинаются с query, потом слово начинается с query, потом просто содержат.
 */
export function rankFilterKeys(keys, query) {
  const q = (query || "").toLowerCase();
  if (!q) return keys;
  return keys
    .filter(k => k.toLowerCase().includes(q))
    .sort((a, b) => matchRank(a, q) - matchRank(b, q));
}

/**
 * Фильтрует и сортирует массив объектов рецептов по релевантности запроса к названию.
 */
export function rankFilterRecipes(recipes, query) {
  const q = (query || "").toLowerCase().trim();
  if (!q) return recipes;
  const matched = recipes.filter(r =>
    (r.title || "").toLowerCase().includes(q) ||
    (r.tags || []).some(tag => tag.toLowerCase().includes(q)) ||
    (r.type || "").toLowerCase().includes(q)
  );
  return matched.sort((a, b) => {
    return matchRank(a.title, q) - matchRank(b.title, q);
  });
}
