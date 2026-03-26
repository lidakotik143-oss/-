import React, { useState } from "react";
import { FaSlidersH, FaChevronUp, FaChevronDown, FaHome, FaUser } from "react-icons/fa";
import { useApp } from "../../context/AppContext";

const Toggle = ({ checked, onChange, theme }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
      checked ? theme.accent : "bg-gray-300"
    }`}
  >
    <span className={`inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${
      checked ? "translate-x-6" : "translate-x-1"
    }`} />
  </button>
);

const OrderButtons = ({ id, order, setOrder, theme }) => {
  const idx = order.indexOf(id);
  const move = (dir) => {
    const next = [...order];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setOrder(next);
  };
  return (
    <div className="flex flex-col gap-0.5 ml-2">
      <button onClick={() => move(-1)} disabled={idx === 0}
        className={`w-6 h-6 flex items-center justify-center rounded border ${theme.border} text-xs disabled:opacity-25 hover:opacity-70 transition`}>▲</button>
      <button onClick={() => move(1)} disabled={idx === order.length - 1}
        className={`w-6 h-6 flex items-center justify-center rounded border ${theme.border} text-xs disabled:opacity-25 hover:opacity-70 transition`}>▼</button>
    </div>
  );
};

export default function AdvancedSettingsPanel() {
  const {
    t, theme, fontSize, featureFlags, setFeatureFlags,
    homeWidgetsOrder, setHomeWidgetsOrder, DEFAULT_HOME_ORDER,
    accountWidgetsOrder, setAccountWidgetsOrder, DEFAULT_ACCOUNT_ORDER,
  } = useApp();
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState("account");

  const toggleFlag = (key) => setFeatureFlags(prev => ({ ...prev, [key]: !prev[key] }));

  const accountItems = [
    { key: "showCalorieBalance",     icon: "🎯", label: t("Баланс калорий за сегодня", "Today's calorie balance"),    desc: t("Виджет дефицит / профицит", "Deficit / surplus widget") },
    { key: "showTopDishes",          icon: "🏆", label: t("Топ блюд за неделю",          "Top dishes this week"),         desc: t("Рейтинг частых блюд",          "Most frequent dishes") },
    { key: "showNutritionDashboard", icon: "📊", label: t("Дашборд БЖУ",                  "Nutrition dashboard"),          desc: t("График белков, жиров и углеводов", "Protein, fat & carbs chart") },
    { key: "showHistoryTab",         icon: "📅", label: t("Вкладка «История питания»",   "Meal history tab"),             desc: t("Лог приёмов пищи",              "Meal log") },
    { key: "showPlannerTab",         icon: "📋", label: t("Вкладка «Планировщик меню»", "Meal planner tab"),             desc: t("Недельное меню заранее",        "Weekly menu in advance") },
    { key: "showShoppingTab",        icon: "🛒", label: t("Вкладка «Список покупок»",   "Shopping list tab"),            desc: t("Автоматический список из планировщика", "Auto list from planner") },
    { key: "showFavoritesTab",       icon: "❤️", label: t("Вкладка «Избранное»",         "Favorites tab"),                desc: t("Сохранённые рецепты",           "Saved recipes") },
    { key: "showWaterTracker",       icon: "💧", label: t("Трекер воды",                 "Water tracker"),                desc: t("Контроль суточного потребления воды", "Daily water intake") },
  ];

  // id совпадает с ключом в DEFAULT_HOME_ORDER и widgetMap в HomeScreen
  const homeItems = [
    { id: "welcome",          flagKey: "home_showWelcome",          icon: "👋", label: t("Приветствие",              "Welcome block"),          desc: t("Имя и переключатель языка",             "Name & language switcher") },
    { id: "calorieBalance",   flagKey: "home_showCalorieBalance",   icon: "⚖️", label: t("Баланс калорий",           "Calorie balance"),         desc: t("Цель / съедено / остаток на сегодня",    "Goal / eaten / remaining today") },
    { id: "nutrition",        flagKey: "home_showNutrition",        icon: "🥗", label: t("Питание за сегодня",       "Today's nutrition"),       desc: t("Только для авторизованных",              "For logged-in users only") },
    { id: "water",            flagKey: "home_showWater",            icon: "💧", label: t("Трекер воды",              "Water tracker"),           desc: t("Прогресс питья и быстрые кнопки +мл",   "Drinking progress & quick +ml buttons") },
    { id: "topDishes",        flagKey: "home_showTopDishes",        icon: "🏆", label: t("Топ блюд за 7 дней",      "Top dishes (7 days)"),     desc: t("3 самых частых блюда из истории",        "3 most frequent meals from history") },
    { id: "shoppingPreview",  flagKey: "home_showShoppingPreview",  icon: "🛒", label: t("Список покупок",           "Shopping list preview"),   desc: t("Первые 5 пунктов + переход к полному",   "First 5 items + link to full list") },
    { id: "plannerPreview",   flagKey: "home_showPlannerPreview",   icon: "📅", label: t("План питания на сегодня",  "Today's meal plan"),       desc: t("Блюда из планировщика на текущий день",  "Planner meals for today") },
    { id: "navCards",         flagKey: "home_showNavCards",         icon: "🗂️", label: t("Навигационные карточки",  "Nav cards"),               desc: t("Для незарегистрированных",               "For guests only") },
  ];

  const enabledAccount = accountItems.filter(i => featureFlags[i.key]).length;
  const enabledHome    = homeItems.filter(i => featureFlags[i.flagKey]).length;

  const resetAllHomeFlags = () => {
    const patch = {};
    homeItems.forEach(i => { patch[i.flagKey] = true; });
    setFeatureFlags(prev => ({ ...prev, ...patch }));
    setHomeWidgetsOrder(DEFAULT_HOME_ORDER);
  };

  const resetAllAccountFlags = () => {
    setFeatureFlags(prev => ({
      ...prev,
      showCalorieBalance: true, showTopDishes: true, showNutritionDashboard: true,
      showHistoryTab: true, showPlannerTab: true, showShoppingTab: true,
      showFavoritesTab: true, showWaterTracker: true,
    }));
    setAccountWidgetsOrder(DEFAULT_ACCOUNT_ORDER);
  };

  return (
    <div className={`${theme.cardBg} p-6 rounded-xl shadow`}>
      <button onClick={() => setOpen(o => !o)} className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <FaSlidersH className={theme.accentText} />
          <span className={`${fontSize.cardTitle} font-semibold`}>
            {t("Расширенные настройки", "Advanced settings")}
          </span>
        </div>
        {open ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {open && (
        <div className="mt-5">
          <p className={`${fontSize.small} ${theme.textSecondary} mb-4`}>
            {t("Управляйте видимостью и порядком модулей. Изменения сохраняются автоматически.",
               "Control visibility and order of modules. Changes are saved automatically.")}
          </p>

          {/* ── Табы ── */}
          <div className={`flex gap-2 mb-5 p-1 rounded-xl border ${theme.border}`}>
            <button onClick={() => setSection("account")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg ${fontSize.small} transition ${
                section === "account" ? `${theme.accent} text-white` : `${theme.textSecondary}`
              }`}>
              <FaUser size={12} /> {t("Аккаунт", "Account")}
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                section === "account" ? "bg-white/30 text-white" : `${theme.accent} text-white`
              }`}>{enabledAccount}/{accountItems.length}</span>
            </button>
            <button onClick={() => setSection("home")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg ${fontSize.small} transition ${
                section === "home" ? `${theme.accent} text-white` : `${theme.textSecondary}`
              }`}>
              <FaHome size={12} /> {t("Главный экран", "Home screen")}
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                section === "home" ? "bg-white/30 text-white" : `${theme.accent} text-white`
              }`}>{enabledHome}/{homeItems.length}</span>
            </button>
          </div>

          {/* ── Секция «Аккаунт» ── */}
          {section === "account" && (
            <div className="space-y-1">
              <p className={`${fontSize.tiny} ${theme.textSecondary} mb-3`}>
                {t("Кнопки ▲▼ меняют порядок виджетов на экране аккаунта.",
                   "Use ▲▼ buttons to reorder account screen widgets.")}
              </p>
              {accountWidgetsOrder.map((key) => {
                const item = accountItems.find(a => a.key === key);
                if (!item) return null;
                return (
                  <div key={key}
                    className={`flex items-center justify-between p-3 rounded-xl transition ${
                      featureFlags[key] ? `border ${theme.border}` : "opacity-50"
                    }`}>
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
                      <div className="min-w-0">
                        <div className={`${fontSize.small} font-semibold truncate`}>{item.label}</div>
                        <div className={`${fontSize.tiny} ${theme.textSecondary} mt-0.5`}>{item.desc}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                      <Toggle checked={!!featureFlags[key]} onChange={() => toggleFlag(key)} theme={theme} />
                      <OrderButtons id={key} order={accountWidgetsOrder} setOrder={setAccountWidgetsOrder} theme={theme} />
                    </div>
                  </div>
                );
              })}
              <button
                onClick={resetAllAccountFlags}
                className={`mt-4 w-full py-2 rounded-xl ${fontSize.small} border ${theme.border} ${theme.textSecondary} hover:opacity-80 transition`}>
                {t("↺ Включить всё и сбросить порядок", "↺ Enable all & reset order")}
              </button>
            </div>
          )}

          {/* ── Секция «Главный экран» ── */}
          {section === "home" && (
            <div className="space-y-1">
              <p className={`${fontSize.tiny} ${theme.textSecondary} mb-3`}>
                {t("Кнопки ▲▼ меняют порядок виджетов на главном экране.",
                   "Use ▲▼ buttons to reorder home screen widgets.")}
              </p>
              {homeWidgetsOrder.map((id) => {
                const item = homeItems.find(h => h.id === id);
                if (!item) return null;
                return (
                  <div key={id}
                    className={`flex items-center justify-between p-3 rounded-xl transition ${
                      featureFlags[item.flagKey] ? `border ${theme.border}` : "opacity-50"
                    }`}>
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
                      <div className="min-w-0">
                        <div className={`${fontSize.small} font-semibold truncate`}>{item.label}</div>
                        <div className={`${fontSize.tiny} ${theme.textSecondary} mt-0.5`}>{item.desc}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                      <Toggle checked={!!featureFlags[item.flagKey]} onChange={() => toggleFlag(item.flagKey)} theme={theme} />
                      <OrderButtons id={id} order={homeWidgetsOrder} setOrder={setHomeWidgetsOrder} theme={theme} />
                    </div>
                  </div>
                );
              })}
              <button
                onClick={resetAllHomeFlags}
                className={`mt-4 w-full py-2 rounded-xl ${fontSize.small} border ${theme.border} ${theme.textSecondary} hover:opacity-80 transition`}>
                {t("↺ Сбросить порядок и включить всё", "↺ Reset order & enable all")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
