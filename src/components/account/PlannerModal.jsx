import React from "react";
import { FaTimes } from "react-icons/fa";

export default function PlannerModal({
  t,
  theme,
  fontSize,
  language,
  MEAL_LABELS,
  plannerModalDate,
  plannerModalCategory,
  formatDate,
  getSortedRecipesForPlanner,
  addRecipeToPlanner,
  onClose
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${theme.cardBg} rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`${fontSize.subheading} font-bold`}>{t("Добавить в план", "Add to plan")}</h2>
            <div className={`${fontSize.small} ${theme.textSecondary}`}>
              {plannerModalDate ? formatDate(plannerModalDate, language) : ""} • {MEAL_LABELS[plannerModalCategory]}
            </div>
          </div>
          <button onClick={onClose} className={`${theme.textSecondary} hover:${theme.text}`}>
            <FaTimes size={24} />
          </button>
        </div>

        <div className={`${fontSize.small} ${theme.textSecondary} mb-3`}>
          {t("Подходящие блюда будут сверху, но можно выбрать любой рецепт.", "Best matches are on top, but you can pick any recipe.")}
        </div>

        <div className="grid gap-2 max-h-96 overflow-y-auto">
          {getSortedRecipesForPlanner(plannerModalCategory).map(r => (
            <div
              key={r.id}
              onClick={() => {
                if (!plannerModalDate) return;
                addRecipeToPlanner(plannerModalDate, plannerModalCategory, r.id);
                onClose();
              }}
              className={`p-3 ${theme.border} border rounded-lg cursor-pointer hover:shadow-lg transition`}
            >
              <div className={`${fontSize.body} font-semibold`}>{r.title}</div>
              <div className={`${fontSize.small} ${theme.textSecondary}`}>
                {(r.caloriesPerServing || r.calories) || 0} {t("ккал", "kcal")} • {r.time} {t("мин", "min")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
