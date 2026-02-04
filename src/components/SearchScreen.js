import React from "react";
import { FaSearch } from "react-icons/fa";
import { getRecipeSubKey, getEffectiveIngredientName } from "../utils/substitutions";

export default function SearchScreen({
  // i18n
  t,

  // theme & typography
  theme,
  fontSize,

  // search state
  searchQuery,
  setSearchQuery,
  searchMode,
  setSearchMode,
  excludeIngredients,
  setExcludeIngredients,

  // filters
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

  // results
  filteredResults,
  getDishTypeInfo,
  allergyList,

  // substitutions
  userSubstitutions,

  // modal open
  setSelectedRecipe,
  setSelectedRecipeVariantKey
}) {
  const subs = userSubstitutions || {};

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Верхняя поисковая панель */}
      <div className={`sticky top-4 ${theme.cardBg} z-20 p-4 rounded-2xl shadow flex flex-col md:flex-row gap-3 items-center`}>
        <div className="relative flex-1 w-full">
          <FaSearch className={`absolute left-3 top-3 ${theme.textSecondary}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              searchMode === "name"
                ? t("Введите название блюда или тег...", "Enter dish name or tag...")
                : t("Введите ингредиенты (через запятую)...", "Enter ingredients (comma separated)...")
            }
            className={`w-full pl-10 pr-4 py-2 ${theme.input} ${fontSize.body} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#606C38]`}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSearchMode((prev) => (prev === "name" ? "ingredients" : "name"))}
            className={`px-4 py-2 rounded-xl ${fontSize.small} text-white transition ${
              searchMode === "name"
                ? `${theme.accent} ${theme.accentHover}`
                : "bg-[#BC6C25] hover:bg-[#A98467]"
            }`}
          >
            {searchMode === "name" ? t("По ингредиентам", "By ingredients") : t("По названию", "By name")}
          </button>

          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className={`px-4 py-2 rounded-xl ${fontSize.small} transition ${theme.accent} ${theme.accentHover} text-white`}
          >
            {showFilters ? t("Скрыть фильтры", "Hide filters") : t("Показать фильтры", "Show filters")}
          </button>
        </div>
      </div>

      {/* Поля исключений */}
      <div className="max-w-6xl mx-auto">
        <input
          type="text"
          value={excludeIngredients}
          onChange={(e) => setExcludeIngredients(e.target.value)}
          placeholder={t("Исключить ингредиенты (через запятую)", "Exclude ingredients (comma-separated)")}
          className={`w-full p-2 ${theme.input} ${fontSize.body} rounded-xl mb-2`}
        />
      </div>

      {/* Фильтры (скрываемые) */}
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
            {/* Тип */}
            <select
              value={selectedFilters.type}
              onChange={(e) => setSelectedFilters((prev) => ({ ...prev, type: e.target.value }))}
              className={`w-full p-2 ${theme.input} ${fontSize.body} rounded-xl`}
            >
              <option value="">{t("Тип блюда (все)", "Dish type (all)")}</option>
              {TYPE_OPTIONS.map((typeKey) => (
                <option key={typeKey} value={typeKey}>
                  {DISH_TYPE_LABELS[typeKey]?.[language] || typeKey}
                </option>
              ))}
            </select>

            {/* Диета */}
            <select
              value={selectedFilters.diet}
              onChange={(e) => setSelectedFilters((prev) => ({ ...prev, diet: e.target.value }))}
              className={`w-full p-2 ${theme.input} ${fontSize.body} rounded-xl`}
            >
              <option value="">{t("Диета (все)", "Diet (all)")}</option>
              {DIET_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {DIET_LABELS[normalize(d)]?.[language] || d}
                </option>
              ))}
            </select>

            {/* Время */}
            <select
              value={selectedFilters.timeRange}
              onChange={(e) => setSelectedFilters((prev) => ({ ...prev, timeRange: e.target.value }))}
              className={`w-full p-2 ${theme.input} ${fontSize.body} rounded-xl`}
            >
              <option value="">{t("Время (любое)", "Time (any)")}</option>
              <option value="short">{t("До 15 минут", "Up to 15 min")}</option>
              <option value="medium">{t("16–40 минут", "16–40 min")}</option>
              <option value="long">{t("Больше 40 минут", "Over 40 min")}</option>
            </select>

            {/* Кухня */}
            <select
              value={selectedFilters.cuisine}
              onChange={(e) => setSelectedFilters((prev) => ({ ...prev, cuisine: e.target.value }))}
              className={`w-full p-2 ${theme.input} ${fontSize.body} rounded-xl`}
            >
              <option value="">{t("Кухня (все)", "Cuisine (all)")}</option>
              {CUISINE_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            {/* Сложность */}
            <select
              value={selectedFilters.difficulty}
              onChange={(e) => setSelectedFilters((prev) => ({ ...prev, difficulty: e.target.value }))}
              className={`w-full p-2 ${theme.input} ${fontSize.body} rounded-xl`}
            >
              <option value="">{t("Сложность (любая)", "Difficulty (any)")}</option>
              {DIFFICULTY_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {DIFFICULTY_LABELS[normalize(d)]?.[language] || d}
                </option>
              ))}
            </select>

            {/* Тег */}
            <select
              value={selectedFilters.tag}
              onChange={(e) => setSelectedFilters((prev) => ({ ...prev, tag: e.target.value }))}
              className={`w-full p-2 ${theme.input} ${fontSize.body} rounded-xl`}
            >
              <option value="">{t("Тег (любой)", "Tag (any)")}</option>
              {TAG_OPTIONS.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Результаты поиска */}
      <div className={`${theme.cardBg} p-4 rounded-2xl shadow`}>
        <h2 className={`${fontSize.subheading} font-semibold mb-3`}>{t("Результаты", "Results")}</h2>
        {filteredResults.length === 0 ? (
          <p className={`${theme.textSecondary} ${fontSize.body}`}>{t("Ничего не найдено", "No recipes found")}</p>
        ) : (
          <div className="grid gap-3">
            {filteredResults.map((r) => {
              const dishTypeInfo = getDishTypeInfo(r.type);
              const kcalPerServing = r.caloriesPerServing ?? r.calories;

              // В списке результатов показываем базовые ингредиенты с заменами
              // (по договорённости substitutions привязаны к recipeId + variantKey,
              // а в списке вариантов нет, поэтому берём ключ для base-версии)
              const recipeSubs = subs[getRecipeSubKey(r.id, null)] || {};

              return (
                <div
                  key={r.id}
                  onClick={() => {
                    setSelectedRecipe(r);
                    setSelectedRecipeVariantKey(r?.variants?.[0]?.key || null);
                  }}
                  className={`p-4 ${theme.border} border rounded-lg cursor-pointer hover:shadow-lg transition`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`${fontSize.cardTitle} font-bold`}>{r.title}</h3>
                      <div className={`${fontSize.small} ${theme.textSecondary} mt-1`}>
                        {r.time} {t("мин", "min")} • {kcalPerServing} {t("ккал (на 1 порцию)", "kcal (per serving)")}
                      </div>
                    </div>

                    {r.type && (
                      <span className={`${dishTypeInfo.color} text-white px-3 py-1 rounded-full ${fontSize.tiny} font-semibold ml-3 flex-shrink-0`}>
                        {dishTypeInfo.label}
                      </span>
                    )}
                  </div>

                  <div className={`mt-3 ${fontSize.small}`}>
                    <strong>{t("Ингредиенты:", "Ingredients:")}</strong>{" "}
                    {(r.ingredients || []).map((ing, i) => {
                      const effectiveName = getEffectiveIngredientName(ing, recipeSubs);
                      const low = (effectiveName || "").toLowerCase();

                      const isAllergy = allergyList.some((a) => a && low.includes(a));
                      const isExcluded =
                        excludeIngredients
                          .toLowerCase()
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                          .some((e) => e && low.includes(e));
                      const cls = isAllergy || isExcluded ? "text-red-600 font-semibold" : "";

                      const displayText = typeof ing === 'object'
                        ? `${effectiveName} ${ing.quantity ? `— ${ing.quantity}` : ''} ${ing.unit || ''}`.trim()
                        : (effectiveName || "");

                      return (
                        <span key={i} className={`${cls} mr-2`}>
                          {displayText}
                          {i < r.ingredients.length - 1 ? "," : ""}
                        </span>
                      );
                    })}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {(r.tags || []).map((tag, i) => (
                      <span key={i} className={`px-2 py-1 ${theme.accent} text-white rounded-full ${fontSize.tiny}`}>
                        {tag}
                      </span>
                    ))}
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
