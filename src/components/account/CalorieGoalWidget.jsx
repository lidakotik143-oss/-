import React, { useState } from "react";
import { useApp } from "../../context/AppContext";

export default function CalorieGoalWidget() {
  const {
    t, theme, fontSize,
    todayNutrition,
    calorieGoal, setCalorieGoal,
    saveCalorieGoal,
  } = useApp();

  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState("");

  const eaten = Math.round(todayNutrition?.totalCalories || 0);
  const goal  = calorieGoal || 0;
  const diff  = eaten - goal;
  const pct   = goal > 0 ? Math.min(Math.round((eaten / goal) * 100), 100) : 0;

  // цвет прогресс-бара и стрелки
  const isDeficit  = diff < -50;
  const isSurplus  = diff > 50;
  const isOnTarget = !isDeficit && !isSurplus;

  const barColor    = isDeficit ? "#22c55e" : isSurplus ? "#ef4444" : "#22c55e";
  const diffColor   = isDeficit ? "text-green-500" : isSurplus ? "text-red-500" : "text-green-500";
  const arrow       = isDeficit ? "↓" : isSurplus ? "↑" : "✓";
  const diffLabel   = isDeficit
    ? t(`Дефицит ${Math.abs(diff)} ккал`, `Deficit ${Math.abs(diff)} kcal`)
    : isSurplus
    ? t(`Профицит +${diff} ккал`, `Surplus +${diff} kcal`)
    : t("Точно в цели!", "Right on target!");

  const handleSave = () => {
    const val = parseInt(inputVal, 10);
    if (!isNaN(val) && val > 0) {
      setCalorieGoal(val);
      saveCalorieGoal(val);
    }
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") setEditing(false);
  };

  return (
    <div className={`${theme.cardBg} p-5 rounded-2xl shadow`}>
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={`${fontSize.subheading} font-bold ${theme.headerText}`}>
          {t("Калории сегодня", "Today's Calories")}
        </h3>
        <button
          onClick={() => { setInputVal(goal > 0 ? String(goal) : ""); setEditing(true); }}
          className={`px-3 py-1 rounded-xl ${fontSize.small} ${theme.accent} text-white hover:opacity-80 transition`}
        >
          {goal > 0 ? t("Изменить цель", "Edit goal") : t("Установить цель", "Set goal")}
        </button>
      </div>

      {/* Если цель не задана */}
      {goal === 0 && !editing && (
        <p className={`${fontSize.body} ${theme.textSecondary} text-center py-4`}>
          {t(
            "Установите дневную норму калорий, чтобы видеть дефицит или профицит.",
            "Set your daily calorie goal to track deficit or surplus."
          )}
        </p>
      )}

      {/* Форма ввода */}
      {editing && (
        <div className="flex gap-2 mb-4">
          <input
            type="number"
            min="500"
            max="9999"
            autoFocus
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("Ккал в день, напр. 2000", "kcal/day, e.g. 2000")}
            className={`flex-1 px-4 py-2 rounded-xl border ${theme.border} ${theme.input} focus:outline-none focus:ring-2 focus:ring-[#606C38] ${fontSize.body}`}
          />
          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded-xl ${theme.accent} text-white ${fontSize.body} hover:opacity-80 transition`}
          >
            {t("Сохранить", "Save")}
          </button>
          <button
            onClick={() => setEditing(false)}
            className={`px-4 py-2 rounded-xl border ${theme.border} ${fontSize.body} hover:opacity-80 transition`}
          >
            {t("Отмена", "Cancel")}
          </button>
        </div>
      )}

      {/* Основной виджет — показываем если цель задана */}
      {goal > 0 && (
        <>
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
                { label: t("Белки", "Protein"), val: Math.round(todayNutrition.totalProtein || 0), unit: t("г", "g"), color: "#3b82f6" },
                { label: t("Жиры", "Fat"),    val: Math.round(todayNutrition.totalFat     || 0), unit: t("г", "g"), color: "#f59e0b" },
                { label: t("Углеводы", "Carbs"), val: Math.round(todayNutrition.totalCarbs   || 0), unit: t("г", "g"), color: "#8b5cf6" },
              ].map(({ label, val, unit, color }) => (
                <div key={label} className={`p-3 rounded-xl border ${theme.border} text-center`}>
                  <div className={`${fontSize.tiny} ${theme.textSecondary} mb-1`}>{label}</div>
                  <div className={`${fontSize.body} font-bold`} style={{ color }}>{val}<span className={`${fontSize.tiny} ml-0.5`}>{unit}</span></div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
