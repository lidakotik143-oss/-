import React, { useState, useMemo } from "react";
import { FaTimes, FaPlus, FaSearch, FaPencilAlt } from "react-icons/fa";
import { useApp } from "../../context/AppContext";

export default function AddMealModal({ onClose }) {
  const {
    t, theme, fontSize,
    MEAL_CATEGORIES, MEAL_LABELS,
    allRecipes,
    addMealCategory, setAddMealCategory,
    addMealToHistory,
    firebaseUser,
    setShowAddRecipeModal,
    onAddRecipeClick,
  } = useApp();

  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allRecipes;
    return allRecipes.filter(r =>
      (r.title || "").toLowerCase().includes(q) ||
      (r.tags || []).some(tag => tag.toLowerCase().includes(q)) ||
      (r.type || "").toLowerCase().includes(q)
    );
  }, [allRecipes, query]);

  const handleCreateRecipe = () => {
    onClose();
    onAddRecipeClick();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className={`${theme.cardBg} rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`${fontSize.subheading} font-bold`}>{t("Добавить прием пищи", "Add Meal")}</h2>
          <button onClick={onClose} className={`${theme.textSecondary} hover:${theme.text} transition`}>
            <FaTimes size={24} />
          </button>
        </div>

        <div className="mb-4">
          <label className={`block ${fontSize.body} font-semibold mb-2`}>{t("Тип приема пищи:", "Meal type:")}</label>
          <div className="flex gap-2 flex-wrap">
            {MEAL_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setAddMealCategory(cat)}
                className={`px-4 py-2 rounded-xl ${fontSize.small} transition ${
                  addMealCategory === cat ? `${theme.accent} text-white shadow-lg` : `${theme.border} border hover:shadow`
                }`}
              >
                {MEAL_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 relative">
          <FaSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.textSecondary} pointer-events-none`} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t("Поиск рецепта...", "Search recipe...")}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${theme.border} ${theme.input} focus:outline-none focus:ring-2 focus:ring-[#606C38] ${fontSize.body}`}
            autoFocus
          />
        </div>

        <div>
          <h3 className={`${fontSize.cardTitle} font-semibold mb-3`}>
            {t("Выберите рецепт:", "Select recipe:")}
            <span className={`ml-2 ${fontSize.small} ${theme.textSecondary} font-normal`}>
              {filtered.length} {t("рецептов", "recipes")}
            </span>
          </h3>

          <div className="grid gap-2 max-h-96 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className={`flex flex-col items-center py-10 gap-4`}>
                <p className={`${theme.textSecondary} ${fontSize.body}`}>
                  {t(
                    `По запросу «${query}» ничего не найдено`,
                    `No results for "${query}"`
                  )}
                </p>
                <p className={`${theme.textSecondary} ${fontSize.small} opacity-70`}>
                  {t("Попробуйте другое название или создайте свой рецепт:", "Try a different name or create your own recipe:")}
                </p>
                <button
                  onClick={handleCreateRecipe}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl ${theme.accent} ${theme.accentHover} text-white font-semibold ${fontSize.body} transition shadow-md hover:shadow-lg`}
                >
                  <FaPencilAlt />
                  {t("Создать рецепт «", "Create recipe “")}{query}{t("»", "”")}
                </button>
              </div>
            ) : (
              filtered.map(r => (
                <div
                  key={r.id}
                  className={`p-3 ${theme.border} border rounded-lg hover:shadow-lg transition flex items-center justify-between`}
                >
                  <div className="flex-1">
                    <div className={`${fontSize.body} font-semibold`}>{r.title}</div>
                    <div className={`${fontSize.small} ${theme.textSecondary}`}>
                      {r.caloriesPerServing || r.calories} {t("ккал", "kcal")} • {r.time} {t("мин", "min")}
                    </div>
                  </div>
                  <button
                    onClick={() => { addMealToHistory(r, addMealCategory); onClose(); }}
                    className={`ml-3 px-4 py-2 rounded-xl ${fontSize.small} ${theme.accent} ${theme.accentHover} text-white flex items-center gap-2 flex-shrink-0`}
                  >
                    <FaPlus />
                    {t("Добавить", "Add")}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
