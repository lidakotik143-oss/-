import React from "react";
import { FaCalendarAlt, FaPlus, FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { NutritionDashboard } from "../NutritionVisuals";
import { calculateDailyGoals } from "../../utils/nutrition";
import { useApp } from "../../context/AppContext";

export default function HistoryTab() {
  const {
    t, theme, fontSize, language,
    viewPeriod, setViewPeriod,
    selectedDate, setSelectedDate,
    selectedWeekDay, setSelectedWeekDay,
    setShowAddMealModal,
    MONTH_NAMES, WEEKDAY_NAMES, WEEKDAY_SHORT,
    MEAL_CATEGORIES, MEAL_LABELS,
    getFilteredHistory, getMealsForDay,
    calculateDayCalories, calculatePeriodStats,
    calculatePeriodNutrition,
    getWeekDays, formatDate, getPeriodDisplayText,
    addDays, addWeeks, addMonths, setMonthYear,
    removeMealFromHistory, userData
  } = useApp();

  const dailyGoals = calculateDailyGoals(userData);

  return (
    <div className="space-y-6">
      {(() => {
        const stats = calculatePeriodStats();
        const nutrition = calculatePeriodNutrition ? calculatePeriodNutrition() : null;
        if ((viewPeriod === 'day' || selectedWeekDay) && nutrition) {
          return (
            <NutritionDashboard
              calories={{ current: stats.totalCalories, goal: dailyGoals.calories }}
              macros={{ protein: nutrition.totalProtein, fat: nutrition.totalFat, carbs: nutrition.totalCarbs }}
              goals={{ protein: dailyGoals.protein, fat: dailyGoals.fat, carbs: dailyGoals.carbs }}
              theme={theme} fontSize={fontSize} language={language}
            />
          );
        }
        return null;
      })()}

      <div className={`${theme.cardBg} p-6 rounded-xl shadow`}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className={`${fontSize.subheading} font-semibold flex items-center gap-2`}>
            <FaCalendarAlt />
            {t("История питания", "Meal History")}
          </h3>
          <button onClick={() => setShowAddMealModal(true)} className={`px-4 py-2 rounded-xl ${fontSize.small} ${theme.accent} ${theme.accentHover} text-white flex items-center gap-2`}>
            <FaPlus />{t("Добавить прием пищи", "Add meal")}
          </button>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {['day', 'week', 'month'].map(period => (
            <button key={period} onClick={() => { setViewPeriod(period); setSelectedWeekDay(null); }}
              className={`px-4 py-2 rounded-xl ${fontSize.small} transition ${viewPeriod === period ? `${theme.accent} text-white` : `${theme.border} border`}`}>
              {period === 'day' && t("День", "Day")}
              {period === 'week' && t("Неделя", "Week")}
              {period === 'month' && t("Месяц", "Month")}
            </button>
          ))}
        </div>

        <div className={`mb-6 p-4 ${theme.border} border rounded-xl`}>
          {viewPeriod === "day" && (
            <div className="space-y-3">
              <div className="flex gap-2 flex-wrap justify-center">
                <button onClick={() => setSelectedDate(addDays(selectedDate, -1))} className={`px-3 py-2 rounded-lg ${fontSize.small} ${theme.accent} ${theme.accentHover} text-white flex items-center gap-1`}>← {t("Вчера", "Yesterday")}</button>
                <button onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])} className={`px-4 py-2 rounded-lg ${fontSize.small} ${theme.cardBg} border-2 ${theme.border} font-semibold`}>{t("Сегодня", "Today")}</button>
                <button onClick={() => setSelectedDate(addDays(selectedDate, 1))} className={`px-3 py-2 rounded-lg ${fontSize.small} ${theme.accent} ${theme.accentHover} text-white flex items-center gap-1`}>{t("Завтра", "Tomorrow")} →</button>
              </div>
              <div className={`text-center ${fontSize.cardTitle} font-bold ${theme.headerText}`}>{getPeriodDisplayText()}</div>
            </div>
          )}
          {viewPeriod === "week" && (
            <div className="flex items-center justify-between gap-4">
              <button onClick={() => setSelectedDate(addWeeks(selectedDate, -1))} className={`p-2 rounded-lg ${theme.accent} ${theme.accentHover} text-white`}><FaChevronLeft size={20} /></button>
              <div className="text-center flex-1"><div className={`${fontSize.cardTitle} font-bold ${theme.headerText}`}>{getPeriodDisplayText()}</div></div>
              <button onClick={() => setSelectedDate(addWeeks(selectedDate, 1))} className={`p-2 rounded-lg ${theme.accent} ${theme.accentHover} text-white`}><FaChevronRight size={20} /></button>
            </div>
          )}
          {viewPeriod === "month" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <button onClick={() => setSelectedDate(addMonths(selectedDate, -1))} className={`p-2 rounded-lg ${theme.accent} ${theme.accentHover} text-white`}><FaChevronLeft size={20} /></button>
                <div className={`${fontSize.cardTitle} font-bold ${theme.headerText}`}>{getPeriodDisplayText()}</div>
                <button onClick={() => setSelectedDate(addMonths(selectedDate, 1))} className={`p-2 rounded-lg ${theme.accent} ${theme.accentHover} text-white`}><FaChevronRight size={20} /></button>
              </div>
              <div className="flex gap-2 justify-center">
                <select value={new Date(selectedDate).getMonth()} onChange={(e) => { const d = new Date(selectedDate); setSelectedDate(setMonthYear(selectedDate, parseInt(e.target.value), d.getFullYear())); }} className={`px-3 py-2 rounded-lg ${theme.input} ${fontSize.small}`}>
                  {MONTH_NAMES.map((month, idx) => (<option key={idx} value={idx}>{month}</option>))}
                </select>
                <select value={new Date(selectedDate).getFullYear()} onChange={(e) => { const d = new Date(selectedDate); setSelectedDate(setMonthYear(selectedDate, d.getMonth(), parseInt(e.target.value))); }} className={`px-3 py-2 rounded-lg ${theme.input} ${fontSize.small}`}>
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (<option key={year} value={year}>{year}</option>))}
                </select>
              </div>
            </div>
          )}
        </div>

        {viewPeriod !== 'day' && !selectedWeekDay && (() => {
          const stats = calculatePeriodStats();
          const nutrition = calculatePeriodNutrition ? calculatePeriodNutrition() : null;
          return (
            <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6 p-4 ${theme.border} border rounded-xl`}>
              <div><div className={`${fontSize.small} ${theme.textSecondary}`}>{t("Всего приемов пищи", "Total meals")}</div><div className={`${fontSize.cardTitle} font-bold ${theme.accentText}`}>{stats.totalMeals}</div></div>
              <div><div className={`${fontSize.small} ${theme.textSecondary}`}>{t("Всего калорий", "Total calories")}</div><div className={`${fontSize.cardTitle} font-bold ${theme.accentText}`}>{stats.totalCalories} {t("ккал", "kcal")}</div></div>
              <div><div className={`${fontSize.small} ${theme.textSecondary}`}>{t("Среднее в день", "Avg per day")}</div><div className={`${fontSize.cardTitle} font-bold ${theme.accentText}`}>{stats.avgCaloriesPerDay} {t("ккал", "kcal")}</div></div>
              {nutrition && (
                <>
                  <div><div className={`${fontSize.small} ${theme.textSecondary}`}>{t("Белки", "Protein")}</div><div className={`${fontSize.cardTitle} font-bold ${theme.accentText}`}>{nutrition.totalProtein}{t("г", "g")}</div></div>
                  <div><div className={`${fontSize.small} ${theme.textSecondary}`}>{t("Жиры", "Fat")}</div><div className={`${fontSize.cardTitle} font-bold ${theme.accentText}`}>{nutrition.totalFat}{t("г", "g")}</div></div>
                  <div><div className={`${fontSize.small} ${theme.textSecondary}`}>{t("Углеводы", "Carbs")}</div><div className={`${fontSize.cardTitle} font-bold ${theme.accentText}`}>{nutrition.totalCarbs}{t("г", "g")}</div></div>
                </>
              )}
            </div>
          );
        })()}

        {viewPeriod === "week" && !selectedWeekDay ? (
          (() => {
            const weekDays = getWeekDays(selectedDate);
            return (
              <div className="space-y-2">
                <h4 className={`${fontSize.cardTitle} font-semibold mb-3 ${theme.headerText}`}>{t("Дни недели", "Week days")}</h4>
                {weekDays.map((dayKey) => {
                  const dayMeals = getMealsForDay(dayKey);
                  const dayCalories = calculateDayCalories(dayKey);
                  const date = new Date(dayKey);
                  const dayOfWeek = date.getDay();
                  return (
                    <div key={dayKey} onClick={() => setSelectedWeekDay(dayKey)} className={`p-4 ${theme.border} border rounded-xl cursor-pointer hover:shadow-lg transition flex items-center justify-between`}>
                      <div className="flex-1">
                        <div className={`${fontSize.body} font-semibold`}>{WEEKDAY_NAMES[dayOfWeek]} ({WEEKDAY_SHORT[dayOfWeek]})</div>
                        <div className={`${fontSize.small} ${theme.textSecondary}`}>{formatDate(dayKey, language)}</div>
                      </div>
                      <div className="text-right mr-4">
                        <div className={`${fontSize.small} ${theme.textSecondary}`}>{t("Приемов:", "Meals:")} {dayMeals.length}</div>
                        <div className={`${fontSize.body} font-bold ${theme.accentText}`}>{dayCalories} {t("ккал", "kcal")}</div>
                      </div>
                      <FaChevronRight className={theme.textSecondary} />
                    </div>
                  );
                })}
              </div>
            );
          })()
        ) : (
          (() => {
            const filteredHistory = selectedWeekDay ? getMealsForDay(selectedWeekDay) : getFilteredHistory();
            if (filteredHistory.length === 0) {
              return (<p className={`${theme.textSecondary} ${fontSize.body} text-center py-8`}>{t("Нет записей за выбранный период", "No meals recorded for this period")}</p>);
            }
            const detailHeader = selectedWeekDay && (
              <div className="flex items-center gap-3 mb-4">
                <button onClick={() => setSelectedWeekDay(null)} className={`px-3 py-2 rounded-xl ${fontSize.small} ${theme.accent} ${theme.accentHover} text-white`}>← {t("Назад к неделе", "Back to week")}</button>
                <div className={`${fontSize.cardTitle} font-semibold`}>{formatDate(selectedWeekDay, language)}</div>
              </div>
            );
            const groupedByCategory = MEAL_CATEGORIES.reduce((acc, cat) => { acc[cat] = filteredHistory.filter(entry => entry.category === cat); return acc; }, {});
            return (
              <div>
                {detailHeader}
                <div className="space-y-4">
                  {MEAL_CATEGORIES.map(cat => {
                    const meals = groupedByCategory[cat];
                    if (meals.length === 0) return null;
                    return (
                      <div key={cat} className={`p-4 ${theme.border} border rounded-xl`}>
                        <h4 className={`${fontSize.cardTitle} font-semibold mb-3 ${theme.headerText}`}>{MEAL_LABELS[cat]} ({meals.length})</h4>
                        <div className="space-y-2">
                          {meals.map(entry => {
                            let displayTitle = entry.recipe.title;
                            let displayCalories = entry.recipe.caloriesPerServing || entry.recipe.calories || 0;
                            if (entry.variantKey && entry.recipe.variants) {
                              const variant = entry.recipe.variants.find(v => v.key === entry.variantKey);
                              if (variant) {
                                displayCalories = variant.caloriesPerServing ?? variant.calories ?? entry.recipe.caloriesPerServing ?? entry.recipe.calories ?? 0;
                                const variantLabel = language === "ru" ? (variant.labelRu || variant.key) : (variant.labelEn || variant.key);
                                displayTitle = `${entry.recipe.title} (${variantLabel})`;
                              }
                            }
                            return (
                              <div key={entry.id} className={`flex items-center justify-between p-3 ${theme.cardBg} rounded-lg`}>
                                <div className="flex-1">
                                  <div className={`${fontSize.body} font-semibold`}>{displayTitle}</div>
                                  <div className={`${fontSize.small} ${theme.textSecondary}`}>{!selectedWeekDay && formatDate(entry.date, language)} {displayCalories} {t("ккал", "kcal")}</div>
                                </div>
                                <button onClick={() => removeMealFromHistory(entry.id)} className="text-red-500 hover:text-red-700 ml-3"><FaTimes /></button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
}
