import React from "react";
import { FaArrowUp, FaArrowDown, FaBullseye } from "react-icons/fa";
import { useApp } from "../../context/AppContext";

export default function CalorieBalanceWidget() {
  const { t, theme, fontSize, userData, todayNutrition } = useApp();

  const goal = parseInt(userData?.calorieGoal || 0);
  const eaten = Math.round(todayNutrition?.totalCalories || 0);

  // Если норма не задана — предлагаем задать
  if (!goal) {
    return (
      <div className={`${theme.cardBg} p-4 rounded-2xl shadow border ${theme.border} flex items-center justify-between gap-4`}>
        <div className="flex items-center gap-3">
          <FaBullseye className="text-2xl text-gray-400" />
          <div>
            <div className={`${fontSize.body} font-semibold`}>{t("Дефицит / профицит калорий", "Calorie balance")}</div>
            <div className={`${fontSize.small} ${theme.textSecondary}`}>
              {t("Задайте норму ккал в профиле →", "Set your calorie goal in profile →")}
            </div>
          </div>
        </div>
        <span className={`${fontSize.small} ${theme.textSecondary} whitespace-nowrap`}>
          {eaten} {t("ккал съедено", "kcal eaten")}
        </span>
      </div>
    );
  }

  const diff = eaten - goal;
  const isDeficit  = diff < 0;
  const isOnTarget = diff === 0;
  const percent    = Math.min(Math.round((eaten / goal) * 100), 200);
  const barWidth   = Math.min(percent, 100);

  // Цвет зависит от контекста:
  // дефицит — зелёный (хорошо для похудения)
  // профицит — красный
  const barColor    = isOnTarget ? "bg-green-500" : isDeficit ? "bg-green-400" : percent > 110 ? "bg-red-500" : "bg-yellow-400";
  const textColor   = isOnTarget ? "text-green-600" : isDeficit ? "text-green-600" : percent > 110 ? "text-red-500" : "text-yellow-600";
  const bgBadge     = isOnTarget ? "bg-green-100" : isDeficit ? "bg-green-100" : percent > 110 ? "bg-red-100" : "bg-yellow-100";

  const label = isOnTarget
    ? t("Точно в цели! ✅", "Exactly on target! ✅")
    : isDeficit
    ? t(`Дефицит ${Math.abs(diff)} ккал`, `Deficit ${Math.abs(diff)} kcal`)
    : t(`Профицит +${diff} ккал`, `Surplus +${diff} kcal`);

  const sublabel = isOnTarget
    ? t("Норма выполнена идеально", "Goal achieved perfectly")
    : isDeficit
    ? t("До нормы ещё есть место", "Still room to eat more")
    : percent > 110
    ? t("Норма превышена", "Daily limit exceeded")
    : t("Немного выше нормы", "Slightly above goal");

  return (
    <div className={`${theme.cardBg} p-5 rounded-2xl shadow border ${theme.border}`}>
      {/* Шапка */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FaBullseye className={`text-xl ${textColor}`} />
          <span className={`${fontSize.body} font-semibold`}>
            {t("Баланс калорий за сегодня", "Today's calorie balance")}
          </span>
        </div>
        {/* Бейдж */}
        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${fontSize.small} font-bold ${textColor} ${bgBadge}`}>
          {!isOnTarget && (isDeficit
            ? <FaArrowDown size={12} />
            : <FaArrowUp size={12} />
          )}
          {label}
        </span>
      </div>

      {/* Прогресс-бар */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${barWidth}%` }}
        />
      </div>

      {/* Подпись */}
      <div className="flex items-center justify-between">
        <span className={`${fontSize.small} ${theme.textSecondary}`}>{sublabel}</span>
        <span className={`${fontSize.small} ${theme.textSecondary}`}>
          <span className={`font-bold ${textColor}`}>{eaten}</span>
          {" / "}{goal} {t("ккал", "kcal")}
          <span className={`ml-1 ${fontSize.tiny}`}>({percent}%)</span>
        </span>
      </div>
    </div>
  );
}
