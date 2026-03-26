import React from "react";
import { useApp } from "../../context/AppContext";
import { calculateDailyGoals } from "../../utils/nutrition";

export default function CalorieGoalWidget() {
  const { t, theme, fontSize, userData, todayNutrition, setActiveScreen } = useApp();

  const dailyGoals = calculateDailyGoals(userData);
  const goal  = dailyGoals.calories || 0;
  const eaten = Math.round(todayNutrition?.totalCalories || 0);
  const diff  = eaten - goal;
  const pct   = goal > 0 ? Math.min(Math.round((eaten / goal) * 100), 100) : 0;

  const isDeficit  = diff < -50;
  const isSurplus  = diff > 50;

  const barColor  = isDeficit ? "#22c55e" : isSurplus ? "#ef4444" : "#22c55e";
  const diffColor = isDeficit ? "text-green-500" : isSurplus ? "text-red-500" : "text-green-500";
  const arrow     = isDeficit ? "↓" : isSurplus ? "↑" : "✓";
  const diffLabel = isDeficit
    ? t(`Дефицит ${Math.abs(diff)} ккал`, `Deficit ${Math.abs(diff)} kcal`)
    : isSurplus
    ? t(`Профицит +${diff} ккал`, `Surplus +${diff} kcal`)
    : t("Точно в цели!", "Right on target!");

  // Профиль не заполнен — невозможно рассчитать
  if (!goal) {
    return (
      <div className={`${theme.cardBg} p-5 rounded-2xl shadow`}>
        <h3 className={`${fontSize.subheading} font-bold ${theme.headerText} mb-3`}>
          {t("Калории сегодня", "Today's Calories")}
        </h3>
        <p className={`${fontSize.body} ${theme.textSecondary}`}>
          {t(
            "Заполните профиль (возраст, вес, рост, пол, активность) — норма рассчитается автоматически.",
            "Complete your profile (age, weight, height, gender, activity) — the goal will be calculated automatically."
          )}
        </p>
        <button
          onClick={() => setActiveScreen('account')}
          className={`mt-3 px-4 py-2 rounded-xl ${fontSize.small} ${theme.accent} text-white hover:opacity-80 transition`}
        >
          {t("Редактировать профиль →", "Edit profile →")}
        </button>
      </div>
    );
  }

  return (
    <div className={`${theme.cardBg} p-5 rounded-2xl shadow`}>
      {/* Шапка */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={`${fontSize.subheading} font-bold ${theme.headerText}`}>
          {t("Калории сегодня", "Today's Calories")}
        </h3>
        <span className={`${fontSize.small} ${theme.textSecondary} px-3 py-1 rounded-xl border ${theme.border}`}>
          {t("Норма: ", "Goal: ")}<span className="font-semibold">{goal} {t("ккал", "kcal")}</span>
        </span>
      </div>

      {/* Большие цифры */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <span className={`text-4xl font-bold ${theme.text}`}>{eaten}</span>
          <span className={`${fontSize.small} ${theme.textSecondary} ml-1`}>
            {t("/ ", "/ ")}{goal} {t("ккал", "kcal")}
          </span>
        </div>
        <div className={`text-2xl font-bold ${diffColor} flex items-center gap-1`}>
          <span>{arrow}</span>
          <span className={fontSize.body}>{diffLabel}</span>
        </div>
      </div>

      {/* Прогресс-бар */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
        <div
          className="h-3 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
      <div className={`flex justify-between ${fontSize.tiny} ${theme.textSecondary}`}>
        <span>0</span>
        <span className="font-semibold">{pct}%</span>
        <span>{goal} {t("ккал", "kcal")}</span>
      </div>

      {/* БЖУ сегодня */}
      {todayNutrition && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { label: t("Белки", "Protein"), val: Math.round(todayNutrition.totalProtein || 0), color: "#3b82f6" },
            { label: t("Жиры",   "Fat"),     val: Math.round(todayNutrition.totalFat     || 0), color: "#f59e0b" },
            { label: t("Углеводы", "Carbs"),  val: Math.round(todayNutrition.totalCarbs   || 0), color: "#8b5cf6" },
          ].map(({ label, val, color }) => (
            <div key={label} className={`p-3 rounded-xl border ${theme.border} text-center`}>
              <div className={`${fontSize.tiny} ${theme.textSecondary} mb-1`}>{label}</div>
              <div className={`${fontSize.body} font-bold`} style={{ color }}>
                {val}<span className={`${fontSize.tiny} ml-0.5`}>{t("г", "g")}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
