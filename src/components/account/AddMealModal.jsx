import React, { useState, useMemo, useEffect, useRef } from "react";
import { FaTimes, FaPlus, FaSearch, FaPencilAlt, FaAppleAlt } from "react-icons/fa";
import { useApp } from "../../context/AppContext";
import { PRODUCTS_BY_NAME } from "../../data/productsNutritionById";

export default function AddMealModal({ onClose }) {
  const {
    t, theme, fontSize,
    MEAL_CATEGORIES, MEAL_LABELS,
    allRecipes,
    addMealCategory, setAddMealCategory,
    addMealToHistory,
    onAddRecipeClick,
  } = useApp();

  const [tab, setTab] = useState("recipe");
  const [query, setQuery] = useState("");

  // Форма продукта
  const [ingName, setIngName]         = useState("");
  const [ingWeight, setIngWeight]     = useState("");
  const [ingCalories, setIngCalories] = useState("");
  const [ingProtein, setIngProtein]   = useState("");
  const [ingFat, setIngFat]           = useState("");
  const [ingCarbs, setIngCarbs]       = useState("");
  const [ingError, setIngError]       = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSug, setShowSug]         = useState(false);
  const [autoFilled, setAutoFilled]   = useState(false); // заполнено из базы?
  const [dbProduct, setDbProduct]     = useState(null);  // ссылка на продукт из БД
  const nameRef = useRef(null);

  // Подсказки: ищем по PRODUCTS_BY_NAME
  useEffect(() => {
    const q = ingName.trim().toLowerCase();
    if (!q || q.length < 2 || autoFilled) { setSuggestions([]); return; }
    const matches = Object.keys(PRODUCTS_BY_NAME)
      .filter(k => k.includes(q))
      .slice(0, 8);
    setSuggestions(matches);
    setShowSug(matches.length > 0);
  }, [ingName, autoFilled]);

  // Пересчёт при изменении веса (если загружен продукт из БД)
  useEffect(() => {
    if (!dbProduct || !ingWeight) return;
    const w = parseFloat(ingWeight);
    if (isNaN(w) || w <= 0) return;
    const factor = w / 100;
    setIngCalories(Math.round(dbProduct.calories * factor).toString());
    setIngProtein((Math.round(dbProduct.protein * factor * 10) / 10).toString());
    setIngFat((Math.round(dbProduct.fat * factor * 10) / 10).toString());
    setIngCarbs((Math.round(dbProduct.carbs * factor * 10) / 10).toString());
  }, [ingWeight, dbProduct]);

  const selectSuggestion = (name) => {
    const prod = PRODUCTS_BY_NAME[name];
    setIngName(prod.name || name);
    setDbProduct(prod);
    setAutoFilled(true);
    setShowSug(false);
    setSuggestions([]);
    // Если вес уже введён — сразу заполнить КБЖУ
    if (ingWeight) {
      const w = parseFloat(ingWeight);
      if (!isNaN(w) && w > 0) {
        const factor = w / 100;
        setIngCalories(Math.round(prod.calories * factor).toString());
        setIngProtein((Math.round(prod.protein * factor * 10) / 10).toString());
        setIngFat((Math.round(prod.fat * factor * 10) / 10).toString());
        setIngCarbs((Math.round(prod.carbs * factor * 10) / 10).toString());
      }
    }
  };

  const clearIngredient = () => {
    setIngName(""); setIngWeight(""); setIngCalories("");
    setIngProtein(""); setIngFat(""); setIngCarbs("");
    setIngError(""); setAutoFilled(false); setDbProduct(null);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allRecipes;
    return allRecipes.filter(r =>
      (r.title || "").toLowerCase().includes(q) ||
      (r.tags || []).some(tag => tag.toLowerCase().includes(q)) ||
      (r.type || "").toLowerCase().includes(q)
    );
  }, [allRecipes, query]);

  const handleCreateRecipe = () => { onClose(); onAddRecipeClick(); };

  const handleAddIngredient = () => {
    if (!ingName.trim()) { setIngError(t("Введите название продукта", "Enter product name")); return; }
    if (!ingCalories && !ingWeight) { setIngError(t("Укажите калории или вес", "Enter calories or weight")); return; }
    setIngError("");
    const kcal = ingCalories ? parseFloat(ingCalories) : 0;
    const weight = ingWeight ? parseFloat(ingWeight) : null;
    const label = weight ? `${ingName.trim()} (${weight} г)` : ingName.trim();
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
        protein:  ingProtein ? parseFloat(ingProtein) : 0,
        fat:      ingFat     ? parseFloat(ingFat)     : 0,
        carbs:    ingCarbs   ? parseFloat(ingCarbs)   : 0,
      },
    };
    addMealToHistory(pseudoRecipe, addMealCategory);
    onClose();
  };

  const tabBtn = (id, label) => (
    <button onClick={() => setTab(id)}
      className={`flex-1 py-2 rounded-xl ${fontSize.small} font-semibold transition ${
        tab === id ? `${theme.accent} text-white shadow` : `${theme.border} border`
      }`}>
      {label}
    </button>
  );

  const inputCls = `w-full px-3 py-2.5 rounded-xl border ${theme.border} ${theme.input} focus:outline-none focus:ring-2 focus:ring-[#606C38] ${fontSize.body}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className={`${theme.cardBg} rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6`} onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between mb-4">
          <h2 className={`${fontSize.subheading} font-bold`}>{t("Добавить прием пищи", "Add Meal")}</h2>
          <button onClick={onClose} className={`${theme.textSecondary} hover:${theme.text} transition`}><FaTimes size={24} /></button>
        </div>

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

        <div className="flex gap-2 mb-5">
          {tabBtn("recipe", `🍳 ${t("Рецепт", "Recipe")}`)}
          {tabBtn("ingredient", `🥑 ${t("Продукт", "Product")}`)}
        </div>

        {/* ── вкладка Рецепт ── */}
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
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl ${theme.accent} ${theme.accentHover} text-white font-semibold ${fontSize.body} transition shadow-md`}>
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

        {/* ── вкладка Продукт ── */}
        {tab === "ingredient" && (
          <div className="space-y-4">
            <p className={`${fontSize.small} ${theme.textSecondary}`}>
              {t("Добавьте отдельный продукт — например, один огурец или кусочек сыра", "Add a single product — e.g. one cucumber or a slice of cheese")}
            </p>

            {/* Название + подсказки */}
            <div className="relative">
              <label className={`block ${fontSize.small} font-semibold mb-1`}>
                {t("Название продукта", "Product name")} *
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FaSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.textSecondary} pointer-events-none`} />
                  <input
                    ref={nameRef}
                    type="text"
                    value={ingName}
                    onChange={e => { setIngName(e.target.value); setAutoFilled(false); setDbProduct(null); setIngError(""); }}
                    onFocus={() => suggestions.length > 0 && setShowSug(true)}
                    onBlur={() => setTimeout(() => setShowSug(false), 150)}
                    placeholder={t("Например: Огурец", "E.g.: Cucumber")}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border ${theme.border} ${theme.input} focus:outline-none focus:ring-2 focus:ring-[#606C38] ${fontSize.body}`}
                    autoFocus
                  />
                  {/* Дропдаун подсказок */}
                  {showSug && suggestions.length > 0 && (
                    <ul className={`absolute z-50 left-0 right-0 top-full mt-1 rounded-xl border ${theme.border} ${theme.cardBg} shadow-xl max-h-48 overflow-y-auto`}>
                      {suggestions.map(name => (
                        <li key={name}>
                          <button
                            type="button"
                            onMouseDown={() => selectSuggestion(name)}
                            className={`w-full text-left px-4 py-2.5 ${fontSize.small} hover:${theme.accent} hover:text-white transition flex items-center justify-between gap-3`}
                          >
                            <span>{PRODUCTS_BY_NAME[name].name || name}</span>
                            <span className={`${theme.textSecondary} ${fontSize.tiny} whitespace-nowrap`}>
                              {PRODUCTS_BY_NAME[name].calories} {t("ккал/100г", "kcal/100g")}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {ingName && (
                  <button onClick={clearIngredient}
                    className={`px-3 rounded-xl border ${theme.border} ${theme.textSecondary} hover:text-red-500 transition`}
                    title={t("Очистить", "Clear")}>
                    <FaTimes />
                  </button>
                )}
              </div>
              {/* Бэдж "Из базы" */}
              {autoFilled && (
                <p className={`mt-1.5 ${fontSize.tiny} text-green-600 font-semibold`}>
                  ✅ {t("КБЖУ загружено из базы продуктов — введите вес для пересчёта", "Nutrition loaded from database — enter weight to recalculate")}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block ${fontSize.small} font-semibold mb-1`}>{t("Вес, г", "Weight, g")}</label>
                <input type="number" min="0" value={ingWeight}
                  onChange={e => { setIngWeight(e.target.value); setIngError(""); }}
                  placeholder="100"
                  className={inputCls} />
              </div>
              <div>
                <label className={`block ${fontSize.small} font-semibold mb-1`}>
                  {t("Ккал", "kcal")} *
                  {autoFilled && ingWeight && <span className={`ml-1 text-green-600 ${fontSize.tiny}`}>({t("авто", "auto")})</span>}
                </label>
                <input type="number" min="0" value={ingCalories}
                  onChange={e => { setIngCalories(e.target.value); setIngError(""); }}
                  placeholder="15"
                  className={inputCls} />
              </div>
            </div>

            <div>
              <label className={`block ${fontSize.small} font-semibold mb-2 ${theme.textSecondary}`}>
                {t("Макронутриенты (необязательно), г", "Macros (optional), g")}
                {autoFilled && ingWeight && <span className={`ml-1 text-green-600 ${fontSize.tiny}`}>({t("авто", "auto")})</span>}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  [t("Белки", "Protein"), ingProtein, setIngProtein],
                  [t("Жиры", "Fat"), ingFat, setIngFat],
                  [t("Углеводы", "Carbs"), ingCarbs, setIngCarbs],
                ].map(([label, val, setter]) => (
                  <div key={label}>
                    <label className={`block ${fontSize.tiny} ${theme.textSecondary} mb-1`}>{label}</label>
                    <input type="number" min="0" step="0.1" value={val}
                      onChange={e => setter(e.target.value)}
                      placeholder="0" className={inputCls} />
                  </div>
                ))}
              </div>
            </div>

            {ingError && <p className={`text-red-500 ${fontSize.small}`}>{ingError}</p>}

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
