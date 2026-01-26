import React from "react";
import { FaTimes } from "react-icons/fa";

export default function AddMealModal({
  t,
  theme,
  fontSize,
  MEAL_CATEGORIES,
  MEAL_LABELS,
  SAMPLE_RECIPES,
  addMealCategory,
  setAddMealCategory,
  addMealToHistory,
  onClose
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${theme.cardBg} rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`${fontSize.subheading} font-bold`}>{t("Добавить прием пищи", "Add Meal")}</h2>
          <button onClick={onClose} className={`${theme.textSecondary} hover:${theme.text}`}>
            <FaTimes size={24} />
          </button>
        </div>

        {/* Выбор категории */}
        <div className="mb-4">
          <label className={`block ${fontSize.body} font-semibold mb-2`}>{t("Тип приема пищи:", "Meal type:")}</label>
          <div className="flex gap-2 flex-wrap">
            {MEAL_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setAddMealCategory(cat)}
                className={`px-4 py-2 rounded-xl ${fontSize.small} transition ${addMealCategory === cat ? `${theme.accent} text-white` : `${theme.border} border`}`}
              >
                {MEAL_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* Список рецептов для выбора */}
        <div>
          <h3 className={`${fontSize.cardTitle} font-semibold mb-3`}>{t("Выберите рецепт:", "Select recipe:")}</h3>
          <div className="grid gap-2 max-h-96 overflow-y-auto">
            {SAMPLE_RECIPES.map(r => (
              <div
                key={r.id}
                onClick={() => {
                  addMealToHistory(r, addMealCategory);
                  onClose();
                }}
                className={`p-3 ${theme.border} border rounded-lg cursor-pointer hover:shadow-lg transition`}
              >
                <div className={`${fontSize.body} font-semibold`}>{r.title}</div>
                <div className={`${fontSize.small} ${theme.textSecondary}`}>
                  {r.caloriesPerServing || r.calories} {t("ккал", "kcal")} • {r.time} {t("мин", "min")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
