import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaPlus, FaHeart, FaRegHeart, FaTrash } from "react-icons/fa";
import { deleteRecipe } from "../firebase.js";

export default function SearchScreen({
  t,
  theme,
  fontSize,
  searchQuery,
  setSearchQuery,
  searchMode,
  setSearchMode,
  excludeIngredients,
  setExcludeIngredients,
  showFilters,
  setShowFilters,
  selectedFilters,
  setSelectedFilters,
  TYPE_OPTIONS,
  DIET_OPTIONS,
  DIFFICULTY_OPTIONS,
  TAG_OPTIONS,
  CUISINE_OPTIONS,
  DISH_TYPE_LABELS,
  DIET_LABELS,
  DIFFICULTY_LABELS,
  language,
  normalize,
  filteredResults,
  getDishTypeInfo,
  allergyList,
  setSelectedRecipe,
  setSelectedRecipeVariantKey,
  firebaseUser,
  onAddRecipeClick,
  isFavorite,
  toggleFav,
  onRecipeDeleted,
}) {
  const [inputValue, setInputValue] = useState(searchQuery);
  const debounceTimer = useRef(null);

  useEffect(() => { setInputValue(searchQuery); }, [searchQuery]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setSearchQuery(val), 300);
  };

  const [excludeValue, setExcludeValue] = useState(excludeIngredients);
  const excludeTimer = useRef(null);

  useEffect(() => { setExcludeValue(excludeIngredients); }, [excludeIngredients]);

  const handleExcludeChange = (e) => {
    const val = e.target.value;
    setExcludeValue(val);
    if (excludeTimer.current) clearTimeout(excludeTimer.current);
    excludeTimer.current = setTimeout(() => setExcludeIngredients(val), 300);
  };

  const [deletingId, setDeletingId] = useState(null);

  // Проверяем владельца через authorId или uid, игнорируя статические рецепты (без id в Firestore)
  const isOwnerOf = (r) => {
    if (!firebaseUser?.uid) return false;
    if (!r.authorId) return false; // статичные рецепты без authorId
    return String(r.authorId) === String(firebaseUser.uid);
  };

  const handleDelete = async (e, recipe) => {
    e.stopPropagation();
    if (!firebaseUser) return;
    if (!window.confirm(t('Удалить рецепт «' + recipe.title + '»?', 'Delete recipe \"' + recipe.title + '\"?'))) return;
    setDeletingId(recipe.id);
    try {
      await deleteRecipe(recipe.id, firebaseUser.uid);
      if (onRecipeDeleted) onRecipeDeleted();
    } catch (err) {
      alert(t('Ошибка при удалении', 'Delete error'));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className={`sticky top-4 ${theme.cardBg} z-20 p-4 rounded-2xl shadow flex flex-col md:flex-row gap-3 items-center`}>
        <div className="relative flex-1 w-full">
          <FaSearch className={`absolute left-3 top-3 ${theme.textSecondary}`} />
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={
              searchMode === "name"
                ? t("Введите название блюда или тег...", "Enter dish name or tag...")
                : t("Введите ингредиенты (через запятую)...", "Enter ingredients (comma separated)...")
            }
            className={`w-full pl-10 pr-4 py-2 ${theme.input} ${fontSize.body} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#606C38]`}
          />
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <button
            onClick={() => setSearchMode((prev) => (prev === "name" ? "ingredients" : "name"))}
            className={`px-4 py-2 rounded-xl ${fontSize.small} text-white transition ${
              searchMode === "name" ? `${theme.accent} ${theme.accentHover}` : "bg-[#BC6C25] hover:bg-[#A98467]"
            }`}
          >
            {searchMode === "name" ? t("По ингредиентам", "By ingredients") : t("По названию", "By name")}
          </button>
          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className={`px-4 py-2 rounded-xl ${fontSize.small} transition ${theme.accent} ${theme.accentHover} text-white`}
          >
            {showFilters ? t("Скрыть фильтры", "Hide filters") : t("Фильтры", "Filters")}
          </button>
          <button
            onClick={onAddRecipeClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl ${fontSize.small} font-semibold transition bg-[#BC6C25] hover:bg-[#A98467] text-white`}
          >
            <FaPlus size={12} />
            {t("Добавить рецепт", "Add Recipe")}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <input
          type="text"
          value={excludeValue}
          onChange={handleExcludeChange}
          placeholder={t("Исключить ингредиенты (через запятую)", "Exclude ingredients (comma-separated)")}
          className={`w-full p-2 ${theme.input} ${fontSize.body} rounded-xl mb-2`}
        />
      </div>

      {showFilters && (
        <div className={`${theme.cardBg} p-4 rounded-2xl shadow space-y-3`}>
          <div className="flex items-center justify-between gap-3">
            <h3 className={`${fontSize.cardTitle} font-semibold`}>{t("Фильтры", "Filters")}</h3>
            <button
              onClick={() => setSelectedFilters({ type: "", diet: "", timeRange: "", cuisine: "", difficulty: "", tag: "" })}
              className={`px-4 py-2 rounded-xl ${fontSize.small} ${theme.accent} ${theme.accentHover} text-white`}
            >
              {t("Сбросить", "Reset")}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select value={selectedFilters.type} onChange={(e) => setSelectedFilters((prev) => ({ ...prev, type: e.target.value }))} className={`w-full p-2 ${theme.input} ${fontSize.body} rounded-xl`}>
              <option value="">{t("Тип блюда (все)", "Dish type (all)")}</option>
              {TYPE_OPTIONS.map((typeKey) => <option key={typeKey} value={typeKey}>{DISH_TYPE_LABELS[typeKey]?.[language] || typeKey}</option>)}
            </select>
            <select value={selectedFilters.diet} onChange={(e) => setSelectedFilters((prev) => ({ ...prev, diet: e.target.value }))} className={`w-full p-2 ${theme.input} ${fontSize.body} rounded-xl`}>
              <option value="">{t("Диета (все)", "Diet (all)")}</option>
              {DIET_OPTIONS.map((d) => <option key={d} value={d}>{DIET_LABELS[normalize(d)]?.[language] || d}</option>)}
            </select>
            <select value={selectedFilters.timeRange} onChange={(e) => setSelectedFilters((prev) => ({ ...prev, timeRange: e.target.value }))} className={`w-full p-2 ${theme.input} ${fontSize.body} rounded-xl`}>
              <option value="">{t("Время (любое)", "Time (any)")}</option>
              <option value="short">{t("До 15 минут", "Up to 15 min")}</option>
              <option value="medium">{t("16–40 минут", "16–40 min")}</option>
              <option value="long">{t("Больше 40 минут", "Over 40 min")}</option>
            </select>
            <select value={selectedFilters.cuisine} onChange={(e) => setSelectedFilters((prev) => ({ ...prev, cuisine: e.target.value }))} className={`w-full p-2 ${theme.input} ${fontSize.body} rounded-xl`}>
              <option value="">{t("Кухня (все)", "Cuisine (all)")}</option>
              {CUISINE_OPTIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <select value={selectedFilters.difficulty} onChange={(e) => setSelectedFilters((prev) => ({ ...prev, difficulty: e.target.value }))} className={`w-full p-2 ${theme.input} ${fontSize.body} rounded-xl`}>
              <option value="">{t("Сложность (любая)", "Difficulty (any)")}</option>
              {DIFFICULTY_OPTIONS.map((d) => <option key={d} value={d}>{DIFFICULTY_LABELS[normalize(d)]?.[language] || d}</option>)}
            </select>
            <select value={selectedFilters.tag} onChange={(e) => setSelectedFilters((prev) => ({ ...prev, tag: e.target.value }))} className={`w-full p-2 ${theme.input} ${fontSize.body} rounded-xl`}>
              <option value="">{t("Тег (любой)", "Tag (any)")}</option>
              {TAG_OPTIONS.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
            </select>
          </div>
        </div>
      )}

      <div className={`${theme.cardBg} p-4 rounded-2xl shadow`}>
        <div className="flex items-center justify-between mb-3">
          <h2 className={`${fontSize.subheading} font-semibold`}>{t("Результаты", "Results")}</h2>
          <span className={`${fontSize.small} ${theme.textSecondary}`}>{filteredResults.length} {t("рецептов", "recipes")}</span>
        </div>
        {filteredResults.length === 0 ? (
          <div className="text-center py-8">
            <p className={`${theme.textSecondary} ${fontSize.body} mb-3`}>{t("Ничего не найдено", "No recipes found")}</p>
            <button onClick={onAddRecipeClick} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl ${fontSize.small} font-semibold bg-[#BC6C25] hover:bg-[#A98467] text-white transition`}>
              <FaPlus size={12} /> {t("Добавить первый рецепт", "Add the first recipe")}
            </button>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredResults.map((r) => {
              const dishTypeInfo = getDishTypeInfo(r.type);
              const kcalPerServing = r.caloriesPerServing ?? r.calories;
              const fav = isFavorite ? isFavorite(r.id) : false;
              const imgSrc = r.image || r.imageUrl || null;
              const isOwner = isOwnerOf(r);
              return (
                <div
                  key={r.id}
                  onClick={() => { setSelectedRecipe(r); setSelectedRecipeVariantKey(r?.variants?.[0]?.key || null); }}
                  className={`p-4 ${theme.border} border rounded-lg cursor-pointer hover:shadow-lg transition`}
                >
                  <div className="flex items-start gap-4">
                    {imgSrc && (
                      <img
                        src={imgSrc}
                        alt={r.title}
                        className="w-20 h-16 object-cover rounded-xl flex-shrink-0 bg-gray-100"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={`${fontSize.cardTitle} font-bold`}>{r.title}</h3>
                            {r.source === 'user' && (
                              <span className={`px-2 py-0.5 rounded-full ${fontSize.tiny} bg-[#606C38] text-white flex-shrink-0`}>
                                {t('от сообщества', 'community')}
                              </span>
                            )}
                            {isOwner && (
                              <span className={`px-2 py-0.5 rounded-full ${fontSize.tiny} bg-[#BC6C25] text-white flex-shrink-0`}>
                                {t('мой рецепт', 'my recipe')}
                              </span>
                            )}
                          </div>
                          <div className={`${fontSize.small} ${theme.textSecondary} mt-1`}>
                            {r.time} {t("мин", "min")} • {kcalPerServing} {t("ккал/порц.", "kcal/srv")}
                            {r.authorName && !r.authorName.includes('@') && <span> • {r.authorName}</span>}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {r.type && (
                            <span className={`${dishTypeInfo.color} text-white px-3 py-1 rounded-full ${fontSize.tiny} font-semibold`}>
                              {dishTypeInfo.label}
                            </span>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleFav && toggleFav(r.id); }}
                            className={`p-2 rounded-full transition hover:scale-110 ${
                              fav ? 'text-red-500' : theme.textSecondary
                            }`}
                            title={fav ? t('Удалить из избранного', 'Remove from favorites') : t('Добавить в избранное', 'Add to favorites')}
                          >
                            {fav ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
                          </button>
                          {isOwner && (
                            <button
                              onClick={(e) => handleDelete(e, r)}
                              disabled={deletingId === r.id}
                              className={`p-2 rounded-full transition hover:scale-110 text-red-400 hover:text-red-600 ${
                                deletingId === r.id ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              title={t('Удалить рецепт', 'Delete recipe')}
                            >
                              <FaTrash size={14} />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className={`mt-2 ${fontSize.small}`}>
                        <strong>{t("Ингредиенты:", "Ingredients:")}</strong>{" "}
                        {(r.ingredients || []).map((ing, i) => {
                          const ingName = typeof ing === 'object' ? ing.name : ing;
                          const low = ingName.toLowerCase();
                          const isAllergy = allergyList.some((a) => a && low.includes(a));
                          const isExcluded = excludeIngredients.toLowerCase().split(",").map((s) => s.trim()).filter(Boolean).some((e) => e && low.includes(e));
                          const cls = isAllergy || isExcluded ? "text-red-600 font-semibold" : "";
                          const displayText = typeof ing === 'object' ? `${ing.name}${ing.quantity ? ` — ${ing.quantity}` : ''}${ing.unit ? ` ${ing.unit}` : ''}`.trim() : ing;
                          return <span key={i} className={`${cls} mr-1`}>{displayText}{i < r.ingredients.length - 1 ? "," : ""}</span>;
                        })}
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {(r.tags || []).map((tag, i) => (
                          <span key={i} className={`px-2 py-1 ${theme.accent} text-white rounded-full ${fontSize.tiny}`}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
