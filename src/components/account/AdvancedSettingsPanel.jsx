import React, { useState } from "react";
import { FaSlidersH, FaChevronUp, FaChevronDown } from "react-icons/fa";
import { useApp } from "../../context/AppContext";

const Toggle = ({ checked, onChange, theme }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
      checked ? theme.accent : "bg-gray-300"
    }`}
  >
    <span
      className={`inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${
        checked ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

export default function AdvancedSettingsPanel() {
  const { t, theme, fontSize, featureFlags, setFeatureFlags } = useApp();
  const [open, setOpen] = useState(false);

  const toggle = (key) =>
    setFeatureFlags(prev => ({ ...prev, [key]: !prev[key] }));

  const items = [
    {
      key: "showCalorieBalance",
      icon: "🎯",
      label: t("Баланс калорий за сегодня", "Today's calorie balance"),
      desc:  t("Виджет дефицит / профицит на странице аккаунта", "Deficit / surplus widget on account page"),
    },
    {
      key: "showTopDishes",
      icon: "🏆",
      label: t("Топ блюд за неделю", "Top dishes this week"),
      desc:  t("Рейтинг самых частых блюд во вкладке История", "Most frequent dishes in History tab"),
    },
    {
      key: "showNutritionDashboard",
      icon: "📊",
      label: t("Дашборд БЖУ", "Nutrition dashboard"),
      desc:  t("График белков, жиров и углеводов в истории питания", "Protein, fat and carbs chart in meal history"),
    },
    {
      key: "showHistoryTab",
      icon: "📅",
      label: t("Вкладка «История питания»", "Meal history tab"),
      desc:  t("Лог всех приёмов пищи по дням / неделям / месяцам", "Log of all meals by day / week / month"),
    },
    {
      key: "showPlannerTab",
      icon: "📋",
      label: t("Вкладка «Планировщик меню»", "Meal planner tab"),
      desc:  t("Составление меню на неделю вперёд", "Plan your weekly menu in advance"),
    },
    {
      key: "showShoppingTab",
      icon: "🛒",
      label: t("Вкладка «Список покупок»", "Shopping list tab"),
      desc:  t("Автоматический список продуктов из планировщика", "Auto shopping list from the planner"),
    },
    {
      key: "showFavoritesTab",
      icon: "❤️",
      label: t("Вкладка «Избранное»", "Favorites tab"),
      desc:  t("Сохранённые рецепты", "Saved recipes"),
    },
    {
      key: "showWaterTracker",
      icon: "💧",
      label: t("Трекер воды", "Water tracker"),
      desc:  t("Контроль суточного потребления воды", "Daily water intake tracker"),
    },
  ];

  const enabledCount = items.filter(i => featureFlags[i.key]).length;

  return (
    <div className={`${theme.cardBg} p-6 rounded-xl shadow`}>
      {/* Шапка */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-2">
          <FaSlidersH className={theme.accentText} />
          <span className={`${fontSize.cardTitle} font-semibold`}>
            {t("Расширенные настройки", "Advanced settings")}
          </span>
          <span className={`ml-2 px-2 py-0.5 rounded-full ${fontSize.tiny} ${theme.accent} text-white`}>
            {enabledCount}/{items.length}
          </span>
        </div>
        {open ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {open && (
        <div className="mt-5 space-y-1">
          <p className={`${fontSize.small} ${theme.textSecondary} mb-4`}>
            {t(
              "Включите или выключите любые модули приложения. Изменения сохраняются автоматически.",
              "Enable or disable any app modules. Changes are saved automatically."
            )}
          </p>

          {items.map(item => (
            <div
              key={item.key}
              className={`flex items-center justify-between p-3 rounded-xl transition ${
                featureFlags[item.key] ? `${theme.border} border` : "opacity-50"
              }`}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
                <div className="min-w-0">
                  <div className={`${fontSize.small} font-semibold truncate`}>{item.label}</div>
                  <div className={`${fontSize.tiny} ${theme.textSecondary} mt-0.5`}>{item.desc}</div>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0">
                <Toggle
                  checked={!!featureFlags[item.key]}
                  onChange={() => toggle(item.key)}
                  theme={theme}
                />
              </div>
            </div>
          ))}

          {/* Кнопка сброса */}
          <button
            onClick={() =>
              setFeatureFlags({
                showCalorieBalance:     true,
                showTopDishes:          true,
                showNutritionDashboard: true,
                showHistoryTab:         true,
                showPlannerTab:         true,
                showShoppingTab:        true,
                showFavoritesTab:       true,
                showWaterTracker:       true,
              })
            }
            className={`mt-4 w-full py-2 rounded-xl ${fontSize.small} border ${theme.border} ${theme.textSecondary} hover:opacity-80 transition`}
          >
            {t("↺ Включить всё", "↺ Enable all")}
          </button>
        </div>
      )}
    </div>
  );
}
