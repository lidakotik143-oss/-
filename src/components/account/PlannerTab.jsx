import React from "react";
import { FaUtensils, FaChevronLeft, FaChevronRight, FaPlus, FaTimes } from "react-icons/fa";

export default function PlannerTab({
  t,
  theme,
  fontSize,
  language,
  WEEKDAY_SHORT,
  MEAL_CATEGORIES,
  MEAL_LABELS,
  plannerWeekDate,
  setPlannerWeekDate,
  getWeekDays,
  getWeekRange,
  addWeeks,
  getPlannerRecipes,
  calculatePlannerDayCalories,
  removeRecipeFromPlanner,
  setSelectedRecipe,
  setSelectedRecipeVariantKey,
  setPlannerModalDate,
  setPlannerModalCategory,
  setShowPlannerModal
}) {
  return (
    <div className={`${theme.cardBg} p-6 rounded-xl shadow`}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className={`${fontSize.subheading} font-semibold flex items-center gap-2`}>
          <FaUtensils />
          {t("План меню", "Menu Planner")}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPlannerWeekDate(addWeeks(plannerWeekDate, -1))}
            className={`p-2 rounded-lg ${theme.accent} ${theme.accentHover} text-white`}
            title={t("Предыдущая неделя", "Previous week")}
          >
            <FaChevronLeft size={18} />
          </button>
          <div className={`${fontSize.small} font-semibold ${theme.headerText}`}>
            {getWeekRange(plannerWeekDate, language)}
          </div>
          <button
            onClick={() => setPlannerWeekDate(addWeeks(plannerWeekDate, 1))}
            className={`p-2 rounded-lg ${theme.accent} ${theme.accentHover} text-white`}
            title={t("Следующая неделя", "Next week")}
          >
            <FaChevronRight size={18} />
          </button>
        </div>
      </div>

      {(() => {
        const weekDays = getWeekDays(plannerWeekDate);

        return (
          <div className="overflow-x-auto">
            <table className={`w-full border-collapse ${fontSize.small}`}>
              <thead>
                <tr>
                  <th className={`p-2 text-left ${theme.textSecondary}`}>{t("Приём", "Meal")}</th>
                  {weekDays.map(dayKey => {
                    const date = new Date(dayKey);
                    const dow = date.getDay();
                    return (
                      <th key={dayKey} className={`p-2 text-center ${theme.textSecondary}`}>
                        <div className="font-semibold">{WEEKDAY_SHORT[dow]}</div>
                        <div className="text-xs">{date.getDate()}</div>
                      </th>
                    );
                  })}
                </tr>
                <tr>
                  <th className={`p-2 text-left ${theme.textSecondary}`}>{t("Ккал", "Kcal")}</th>
                  {weekDays.map(dayKey => (
                    <th key={dayKey} className={`p-2 text-center ${theme.accentText} font-bold`}>
                      {calculatePlannerDayCalories(dayKey)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MEAL_CATEGORIES.map(cat => (
                  <tr key={cat} className={`${theme.border} border-t`}>
                    <td className="p-2 align-top font-semibold whitespace-nowrap">{MEAL_LABELS[cat]}</td>
                    {weekDays.map(dayKey => {
                      const recipes = getPlannerRecipes(dayKey, cat);
                      return (
                        <td key={`${dayKey}-${cat}`} className="p-2 align-top min-w-[200px]">
                          <div className="space-y-2">
                            {recipes.map((r, index) => {
                              // 🔥 ИСПРАВЛЕНО: Учитываем данные варианта
                              let displayTime = r.time;
                              let displayCalories = r.caloriesPerServing || r.calories || 0;
                              let displayTitle = r.title;

                              // Если выбран вариант, используем его данные
                              if (r.selectedVariantKey && r.variants) {
                                const variant = r.variants.find(v => v.key === r.selectedVariantKey);
                                if (variant) {
                                  displayTime = variant.time ?? r.time;
                                  displayCalories = variant.caloriesPerServing ?? variant.calories ?? r.caloriesPerServing ?? r.calories ?? 0;
                                  const variantLabel = language === "ru" ? (variant.labelRu || variant.key) : (variant.labelEn || variant.key);
                                  displayTitle = `${r.title} (${variantLabel})`;
                                }
                              }

                              return (
                                <div key={`${r.id}-${index}`} className={`flex items-center justify-between gap-2 p-2 rounded-lg ${theme.border} border`}>
                                  <button
                                    onClick={() => {
                                      setSelectedRecipe(r);
                                      setSelectedRecipeVariantKey(r.selectedVariantKey || r?.variants?.[0]?.key || null);
                                    }}
                                    className="text-left flex-1"
                                  >
                                    <div className="font-semibold leading-snug">{displayTitle}</div>
                                    <div className={`text-xs ${theme.textSecondary}`}>{displayCalories} {t("ккал", "kcal")} • {displayTime} {t("мин", "min")}</div>
                                  </button>
                                  <button
                                    onClick={() => removeRecipeFromPlanner(dayKey, cat, index)}
                                    className="text-red-500 hover:text-red-700"
                                    title={t("Удалить", "Remove")}
                                  >
                                    <FaTimes />
                                  </button>
                                </div>
                              );
                            })}

                            <button
                              onClick={() => {
                                setPlannerModalDate(dayKey);
                                setPlannerModalCategory(cat);
                                setShowPlannerModal(true);
                              }}
                              className={`w-full px-3 py-2 rounded-lg ${fontSize.small} ${theme.accent} ${theme.accentHover} text-white flex items-center justify-center gap-2`}
                            >
                              <FaPlus />
                              {t("Добавить", "Add")}
                            </button>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })()}
    </div>
  );
}
