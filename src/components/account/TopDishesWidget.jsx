import React, { useMemo, useState } from "react";
import { FaTrophy, FaFire } from "react-icons/fa";
import { useApp } from "../../context/AppContext";

export default function TopDishesWidget() {
  const { t, theme, fontSize, language, mealHistory, selectedDate, getWeekDays } = useApp();
  const [tab, setTab] = useState("count"); // 'count' | 'calories'

  // Собираем записи за текущую неделю
  const weekDays = useMemo(() => new Set(getWeekDays(selectedDate)), [selectedDate, getWeekDays]);

  const weekEntries = useMemo(
    () => (mealHistory || []).filter(e => weekDays.has(e.date)),
    [mealHistory, weekDays]
  );

  // Агрегация по блюду (+ вариант)
  const aggregated = useMemo(() => {
    const map = new Map();
    weekEntries.forEach(e => {
      let title = e.recipe?.title || "";
      let kcal  = e.recipe?.caloriesPerServing ?? e.recipe?.calories ?? 0;
      if (e.variantKey && e.recipe?.variants) {
        const v = e.recipe.variants.find(v => v.key === e.variantKey);
        if (v) {
          kcal = v.caloriesPerServing ?? v.calories ?? kcal;
          const label = language === "ru" ? (v.labelRu || v.key) : (v.labelEn || v.key);
          title = `${title} (${label})`;
        }
      }
      if (!title) return;
      if (map.has(title)) {
        const cur = map.get(title);
        map.set(title, { title, count: cur.count + 1, totalKcal: cur.totalKcal + kcal });
      } else {
        map.set(title, { title, count: 1, totalKcal: kcal });
      }
    });
    return Array.from(map.values());
  }, [weekEntries, language]);

  const byCount   = useMemo(() => [...aggregated].sort((a, b) => b.count    - a.count).slice(0, 5), [aggregated]);
  const byCalories= useMemo(() => [...aggregated].sort((a, b) => b.totalKcal - a.totalKcal).slice(0, 5), [aggregated]);

  const list = tab === "count" ? byCount : byCalories;
  const maxVal = list.length ? (tab === "count" ? list[0].count : list[0].totalKcal) : 1;

  const medals = ["🥇", "🥈", "🥉"];

  if (weekEntries.length === 0) {
    return (
      <div className={`${theme.cardBg} p-5 rounded-2xl shadow border ${theme.border} text-center`}>
        <FaTrophy className={`mx-auto text-3xl mb-2 ${theme.textSecondary} opacity-40`} />
        <p className={`${fontSize.body} ${theme.textSecondary}`}>
          {t("За эту неделю приёмов пищи не найдено", "No meals found for this week")}
        </p>
      </div>
    );
  }

  return (
    <div className={`${theme.cardBg} p-5 rounded-2xl shadow border ${theme.border}`}>
      {/* Шапка */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <FaTrophy className="text-yellow-500 text-xl" />
          <span className={`${fontSize.body} font-semibold`}>
            {t("Топ блюд за неделю", "Top dishes this week")}
          </span>
        </div>
        {/* Переключатель */}
        <div className={`flex rounded-xl overflow-hidden border ${theme.border}`}>
          <button
            onClick={() => setTab("count")}
            className={`px-3 py-1 ${fontSize.small} transition ${
              tab === "count" ? `${theme.accent} text-white` : `${theme.cardBg} ${theme.text}`
            }`}>
            {t("Чаще всего", "By count")}
          </button>
          <button
            onClick={() => setTab("calories")}
            className={`px-3 py-1 ${fontSize.small} transition flex items-center gap-1 ${
              tab === "calories" ? `${theme.accent} text-white` : `${theme.cardBg} ${theme.text}`
            }`}>
            <FaFire size={11} /> {t("По калориям", "By calories")}
          </button>
        </div>
      </div>

      {/* Список */}
      <ol className="space-y-3">
        {list.map((item, idx) => {
          const value   = tab === "count" ? item.count : item.totalKcal;
          const barPct  = Math.round((value / maxVal) * 100);
          const medal   = medals[idx] || `${idx + 1}`;
          const valueLabel = tab === "count"
            ? `${item.count} ${t("раз", "times")}  •  ${item.totalKcal} ${t("ккал", "kcal")}`
            : `${item.totalKcal} ${t("ккал", "kcal")}  •  ${item.count} ${t("раз", "times")}`;
          return (
            <li key={item.title}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg w-6 text-center flex-shrink-0 leading-none">{medal}</span>
                <span className={`flex-1 ${fontSize.small} font-semibold truncate`} title={item.title}>
                  {item.title}
                </span>
                <span className={`${fontSize.tiny} ${theme.textSecondary} whitespace-nowrap`}>
                  {valueLabel}
                </span>
              </div>
              {/* Прогресс-бар */}
              <div className="ml-8 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    idx === 0 ? "bg-yellow-400" : idx === 1 ? "bg-gray-400" : idx === 2 ? "bg-amber-600" : "bg-green-400"
                  }`}
                  style={{ width: `${barPct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ol>

      <p className={`mt-3 ${fontSize.tiny} ${theme.textSecondary} text-right`}>
        {t(`Всего за неделю: ${weekEntries.length} приёмов пищи`, `Total this week: ${weekEntries.length} meals`)}
      </p>
    </div>
  );
}
