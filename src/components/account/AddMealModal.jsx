import React, { useState, useMemo } from "react";
import { FaTimes, FaPlus, FaSearch, FaPencilAlt, FaAppleAlt } from "react-icons/fa";
import { useApp } from "../../context/AppContext";

export default function AddMealModal({ onClose }) {
  const {
    t, theme, fontSize,
    MEAL_CATEGORIES, MEAL_LABELS,
    allRecipes,
    addMealCategory, setAddMealCategory,
    addMealToHistory,
    onAddRecipeClick,
  } = useApp();

  const [tab, setTab] = useState("recipe"); // "recipe" | "ingredient"
  const [query, setQuery] = useState("");

  // Форма отдельного продукта
  const [ingName, setIngName]       = useState("");
  const [ingWeight, setIngWeight]   = useState("");
  const [ingCalories, setIngCalories] = useState("");
  const [ingProtein, setIngProtein] = useState("");
  const [ingFat, setIngFat]         = useState("");
  const [ingCarbs, setIngCarbs]     = useState("");
  const [ingError, setIngError]     = useState("");

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

  const handleAddIngredient = () => {
    if (!ingName.trim()) { setIngError(t("Введите название продукта", "Enter product name")); return; }
    if (!ingCalories && !ingWeight) { setIngError(t("Укажите калории или вес", "Enter calories or weight")); return; }
    setIngError("");

    const kcal = ingCalories ? parseFloat(ingCalories) : 0;
    const weight = ingWeight ? parseFloat(ingWeight) : null;
    const label = weight ? `${ingName.trim()} (${weight} г)` : ingName.trim();

    // Собираем псевдо-рецепт по формату addMealToHistory
    const pseudoRecipe = {
      id: `ingredient_${Date.now()}`,
      title: label,
      time: 0,
      servings: 1,
      caloriesPerServing: kcal,
      calories: kcal,
      ingredients: [],
      instructions: [],
      tags: [t("Продукт", "Product")],
      type: "",
      _isIngredient: true,
      _nutrition: {
        calories: kcal,
        protein:  ingProtein  ? parseFloat(ingProtein)  : 0,
        fat:      ingFat      ? parseFloat(ingFat)      : 0,
        carbs:    ingCarbs    ? parseFloat(ingCarbs)    : 0,
      },
    };
    addMealToHistory(pseudoRecipe, addMealCategory);
    onClose();
  };

  const tabBtn = (id, label) => (
    <button
      onClick={() => setTab(id)}
      className={`flex-1 py-2 rounded-xl ${fontSize.small} font-semibold transition ${
        tab === id ? `${theme.accent} text-white shadow` : `${theme.border} border`
      }`}
    >
      {label}
    </button>
  );

  const inputCls = `w-full px-3 py-2.5 rounded-xl border ${theme.border} ${theme.input} focus:outline-none focus:ring-2 focus:ring-[#606C38] ${fontSize.body}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className={`${theme.cardBg} rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6`} onClick={e => e.stopPropagation()}>

        {/* Шапка */}
        <div className="flex items-center justify-between mb-4">
          <h2 className={`${fontSize.subheading} font-bold`}>{t("Добавить прием пищи", "Add Meal")}</h2>
          <button onClick={onClose} className={`${theme.textSecondary} hover:${theme.text} transition`}><FaTimes size={24} /></button>
        </div>

        {/* Тип приёма */}
        <div className="mb-4">
          <label className={`block ${fontSize.body} font-semibold mb-2`}>{t("Тип приема пищи:", "Meal type:")}</label>
          <div className="flex gap-2 flex-wrap">
            {MEAL_CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setAddMealCategory(cat)}
                className={`px-4 py-2 rounded-xl ${fontSize.small} transition ${
                  addMealCategory === cat ? `${theme.accent} text-white shadow-lg` : `${theme.border} border hover:shadow`
                }`}>
                {MEAL_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* Вкладки */}
        <div className="flex gap-2 mb-5">
          {tabBtn("recipe", `🍳 ${t("Рецепт", "Recipe")}`)}
          {tabBtn("ingredient", `🥑 ${t("Продукт", "Product")}`)}
        </div>

        {/* ── Вкладка Рецепт ── */}
        {tab === "recipe" && (
          <div>
            <div className="mb-4 relative">
              <FaSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.textSecondary} pointer-events-none`} />
              <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder={t("Поиск рецепта...", "Search recipe...")}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${theme.border} ${theme.input} focus:outline-none focus:ring-2 focus:ring-[#606C38] ${fontSize.body}`}
                autoFocus />
            </div>
            <h3 className={`${fontSize.cardTitle} font-semibold mb-3`}>
              {t("Выберите рецепт:", "Select recipe:")}
              <span className={`ml-2 ${fontSize.small} ${theme.textSecondary} font-normal`}>
                {filtered.length} {t("рецептов", "recipes")}
              </span>
            </h3>
            <div className="grid gap-2 max-h-80 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center py-10 gap-4">
                  <p className={`${theme.textSecondary} ${fontSize.body}`}>
                    {t(`По запросу «${query}» ничего не найдено`, `No results for "${query}"`)}
                  </p>
                  <p className={`${theme.textSecondary} ${fontSize.small} opacity-70`}>
                    {t("Попробуйте другое название или создайте рецепт:", "Try a different name or create your own recipe:")}
                  </p>
                  <button onClick={handleCreateRecipe}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl ${theme.accent} ${theme.accentHover} text-white font-semibold ${fontSize.body} transition shadow-md hover:shadow-lg`}>
                    <FaPencilAlt />
                    {t("Создать рецепт «", "Create recipe “")}{query}{t("»", "”")}
                  </button>
                </div>
              ) : (
                filtered.map(r => (
                  <div key={r.id} className={`p-3 ${theme.border} border rounded-lg hover:shadow-lg transition flex items-center justify-between`}>
                    <div className="flex-1">
                      <div className={`${fontSize.body} font-semibold`}>{r.title}</div>
                      <div className={`${fontSize.small} ${theme.textSecondary}`}>
                        {r.caloriesPerServing || r.calories} {t("ккал", "kcal")} • {r.time} {t("мин", "min")}
                      </div>
                    </div>
                    <button onClick={() => { addMealToHistory(r, addMealCategory); onClose(); }}
                      className={`ml-3 px-4 py-2 rounded-xl ${fontSize.small} ${theme.accent} ${theme.accentHover} text-white flex items-center gap-2 flex-shrink-0`}>
                      <FaPlus /> {t("Добавить", "Add")}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── Вкладка Продукт ── */}
        {tab === "ingredient" && (
          <div className="space-y-4">
            <p className={`${fontSize.small} ${theme.textSecondary}`}>
              {t(
                "Добавьте отдельный продукт — например, один огурец или кусочек сыра",
                "Add a single product \u2014 e.g. one cucumber or a slice of cheese"
              )}
            </p>

            <div>
              <label className={`block ${fontSize.small} font-semibold mb-1`}>{t("Название продукта", "Product name")} *</label>
              <input type="text" value={ingName} onChange={e => { setIngName(e.target.value); setIngError(""); }}
                placeholder={t("Например: Огурец", "E.g.: Cucumber")}
                className={inputCls} autoFocus />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block ${fontSize.small} font-semibold mb-1`}>{t("Вес, г", "Weight, g")}</label>
                <input type="number" min="0" value={ingWeight} onChange={e => { setIngWeight(e.target.value); setIngError(""); }}
                  placeholder="100" className={inputCls} />
              </div>
              <div>
                <label className={`block ${fontSize.small} font-semibold mb-1`}>{t("Ккал", "kcal")} *</label>
                <input type="number" min="0" value={ingCalories} onChange={e => { setIngCalories(e.target.value); setIngError(""); }}
                  placeholder="15" className={inputCls} />
              </div>
            </div>

            <div>
              <label className={`block ${fontSize.small} font-semibold mb-2 ${theme.textSecondary}`}>
                {t("Макронутриенты (необязательно), г", "Macros (optional), g")}
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={`block ${fontSize.tiny} ${theme.textSecondary} mb-1`}>{t("Белки", "Protein")}</label>
                  <input type="number" min="0" step="0.1" value={ingProtein} onChange={e => setIngProtein(e.target.value)}
                    placeholder="0" className={inputCls} />
                </div>
                <div>
                  <label className={`block ${fontSize.tiny} ${theme.textSecondary} mb-1`}>{t("Жиры", "Fat")}</label>
                  <input type="number" min="0" step="0.1" value={ingFat} onChange={e => setIngFat(e.target.value)}
                    placeholder="0" className={inputCls} />
                </div>
                <div>
                  <label className={`block ${fontSize.tiny} ${theme.textSecondary} mb-1`}>{t("Углеводы", "Carbs")}</label>
                  <input type="number" min="0" step="0.1" value={ingCarbs} onChange={e => setIngCarbs(e.target.value)}
                    placeholder="0" className={inputCls} />
                </div>
              </div>
            </div>

            {ingError && (
              <p className={`text-red-500 ${fontSize.small}`}>{ingError}</p>
            )}

            <button onClick={handleAddIngredient}
              className={`w-full py-3 rounded-xl ${theme.accent} ${theme.accentHover} text-white font-semibold ${fontSize.body} flex items-center justify-center gap-2 transition`}>
              <FaAppleAlt />
              {t("Добавить продукт", "Add product")}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
