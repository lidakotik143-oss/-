import React from "react";
import { FaCalendarAlt, FaPlus, FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { NutritionDashboard } from "../NutritionVisuals";

export default function HistoryTab({
  t,
  theme,
  fontSize,
  language,
  viewPeriod,
  setViewPeriod,
  selectedDate,
  setSelectedDate,
  selectedWeekDay,
  setSelectedWeekDay,
  setShowAddMealModal,
  MONTH_NAMES,
  WEEKDAY_NAMES,
  WEEKDAY_SHORT,
  MEAL_CATEGORIES,
  MEAL_LABELS,
  getFilteredHistory,
  getMealsForDay,
  calculateDayCalories,
  calculatePeriodStats,
  calculatePeriodNutrition,
  getWeekDays,
  formatDate,
  getPeriodDisplayText,
  addDays,
  addWeeks,
  addMonths,
  setMonthYear,
  removeMealFromHistory,
  userData
}) {
  // Формула Миффлина - Сан Жеора + КБЖУ по цели
  const calculateDailyGoals = () => {
    const weight = parseFloat(userData?.weight);
    const height = parseFloat(userData?.height);
    const age = parseFloat(userData?.age);

    if (!weight) {
      return { calories: 2000, protein: 150, fat: 70, carbs: 250 };
    }

    const genderLower = (userData?.gender || '').toLowerCase();
    const isMale = genderLower.includes('муж') || genderLower.includes('male') || genderLower.includes('м');

    const h = height || 170;
    const a = age || 25;

    let bmr;
    if (isMale) {
      bmr = 10 * weight + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * weight + 6.25 * h - 5 * a - 161;
    }

    // Коэффициент активности (TDEE)
    let activityFactor = 1.2;
    if (userData?.lifestyle) {
      const lf = userData.lifestyle.toLowerCase();
      if (lf.includes('умеренн') || lf.includes('moderate')) {
        activityFactor = 1.55;
      } else if (lf.includes('высок') || lf.includes('активн') || lf.includes('active')) {
        activityFactor = 1.725;
      } else if (lf.includes('очень') || lf.includes('very')) {
        activityFactor = 1.9;
      } else if (lf.includes('лёгк') || lf.includes('легк') || lf.includes('light')) {
        activityFactor = 1.375;
      }
    }

    let calorieGoal = bmr * activityFactor;

    // Коррекция по цели + соотношение КБЖУ
    let proteinRatio = 0.30;
    let fatRatio = 0.25;
    let carbsRatio = 0.45;

    if (userData?.goal) {
      const gl = userData.goal.toLowerCase();
      if (gl.includes('снижен') || gl.includes('похуд') || gl.includes('weight loss') || gl.includes('loss')) {
        calorieGoal *= 0.8;
        // Похудение: больше белка, меньше углеводов
        proteinRatio = 0.35;
        fatRatio = 0.30;
        carbsRatio = 0.35;
      } else if (gl.includes('набор') || gl.includes('muscle') || gl.includes('gain')) {
        calorieGoal *= 1.15;
        // Набор массы: больше углеводов, меньше жиров
        proteinRatio = 0.30;
        fatRatio = 0.20;
        carbsRatio = 0.50;
      }
      // Поддержание: стандартное соотношение (30/25/45) уже установлено
    }

    calorieGoal = Math.round(calorieGoal);

    return {
      calories: calorieGoal,
      protein: Math.round((calorieGoal * proteinRatio) / 4),
      fat: Math.round((calorieGoal * fatRatio) / 9),
      carbs: Math.round((calorieGoal * carbsRatio) / 4)
    };
  };

  const dailyGoals = calculateDailyGoals();

  return (
    <div className="space-y-6">
      {(() => {
        const stats = calculatePeriodStats();
        const nutrition = calculatePeriodNutrition ? calculatePeriodNutrition() : null;
        
        if ((viewPeriod === 'day' || selectedWeekDay) && nutrition) {
          return (
            <NutritionDashboard
              calories={{
                current: stats.totalCalories,
                goal: dailyGoals.calories
              }}
              macros={{
                protein: nutrition.totalProtein,
                fat: nutrition.totalFat,
                carbs: nutrition.totalCarbs
              }}
              goals={{
                protein: dailyGoals.protein,
                fat: dailyGoals.fat,
                carbs: dailyGoals.carbs
              }}
              theme={theme}
              fontSize={fontSize}
              language={language}
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
          <button
            onClick={() => setShowAddMealModal(true)}
            className={`px-4 py-2 rounded-xl ${fontSize.small} ${theme.accent} ${theme.accentHover} text-white flex items-center gap-2`}
          >
            <FaPlus />
            {t("Добавить прием пищи", "Add meal")}
          </button>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {['day', 'week', 'month'].map(period => (
            <button
              key={period}
              onClick={() => {
                setViewPeriod(period);
                setSelectedWeekDay(null);
              }}
              className={`px-4 py-2 rounded-xl ${fontSize.small} transition ${viewPeriod === period ? `${theme.accent} text-white` : `${theme.border} border`}`}
            >
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
                <button
                  onClick={() => setSelectedDate(addDays(selectedDate, -1))}
                  className={`px-3 py-2 rounded-lg ${fontSize.small} ${theme.accent} ${theme.accentHover} text-white flex items-center gap-1`}
                >
                  ← {t("Вчера", "Yesterday")}
                </button>
                <button
                  onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                  className={`px-4 py-2 rounded-lg ${fontSize.small} ${theme.cardBg} border-2 ${theme.border} font-semibold`}
                >
                  {t("Сегодня", "Today")}
                </button>
                <button
                  onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                  className={`px-3 py-2 rounded-lg ${fontSize.small} ${theme.accent} ${theme.accentHover} text-white flex items-center gap-1`}
                >
                  {t("Завтра", "Tomorrow")} →
                </button>
              </div>
              <div className={`text-center ${fontSize.cardTitle} font-bold ${theme.headerText}`}>
                {getPeriodDisplayText()}
              </div>
            </div>
          )}

          {viewPeriod === "week" && (
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => setSelectedDate(addWeeks(selectedDate, -1))}
                className={`p-2 rounded-lg ${theme.accent} ${theme.accentHover} text-white`}
              >
                <FaChevronLeft size={20} />
              </button>
              <div className="text-center flex-1">
                <div className={`${fontSize.cardTitle} font-bold ${theme.headerText}`}>
                  {getPeriodDisplayText()}
                </div>
              </div>
              <button
                onClick={() => setSelectedDate(addWeeks(selectedDate, 1))}
                className={`p-2 rounded-lg ${theme.accent} ${theme.accentHover} text-white`}
              >
                <FaChevronRight size={20} />
              </button>
            </div>
          )}

          {viewPeriod === "month" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => setSelectedDate(addMonths(selectedDate, -1))}
                  className={`p-2 rounded-lg ${theme.accent} ${theme.accentHover} text-white`}
                >
                  <FaChevronLeft size={20} />
                </button>
                <div className={`${fontSize.cardTitle} font-bold ${theme.headerText}`}>
                  {getPeriodDisplayText()}
                </div>
                <button
                  onClick={() => setSelectedDate(addMonths(selectedDate, 1))}
                  className={`p-2 rounded-lg ${theme.accent} ${theme.accentHover} text-white`}
                >
                  <FaChevronRight size={20} />
                </button>
              </div>
              <div className="flex gap-2 justify-center">
                <select
                  value={new Date(selectedDate).getMonth()}
                  onChange={(e) => {
                    const d = new Date(selectedDate);
                    setSelectedDate(setMonthYear(selectedDate, parseInt(e.target.value), d.getFullYear()));
                  }}
                  className={`px-3 py-2 rounded-lg ${theme.input} ${fontSize.small}`}
                >
                  {MONTH_NAMES.map((month, idx) => (
                    <option key={idx} value={idx}>{month}</option>
                  ))}
                </select>
                <select
                  value={new Date(selectedDate).getFullYear()}
                  onChange={(e) => {
                    const d = new Date(selectedDate);
                    setSelectedDate(setMonthYear(selectedDate, d.getMonth(), parseInt(e.target.value)));
                  }}
                  className={`px-3 py-2 rounded-lg ${theme.input} ${fontSize.small}`}
                >
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
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
              <div>
                <div className={`${fontSize.small} ${theme.textSecondary}`}>{t("Всего приемов пищи", "Total meals")}</div>
                <div className={`${fontSize.cardTitle} font-bold ${theme.accentText}`}>{stats.totalMeals}</div>
              </div>
              <div>
                <div className={`${fontSize.small} ${theme.textSecondary}`}>{t("Всего калорий", "Total calories")}</div>
                <div className={`${fontSize.cardTitle} font-bold ${theme.accentText}`}>{stats.totalCalories} {t("ккал", "kcal")}</div>
              </div>
              <div>
                <div className={`${fontSize.small} ${theme.textSecondary}`}>{t("Среднее в день", "Avg per day")}</div>
                <div className={`${fontSize.cardTitle} font-bold ${theme.accentText}`}>{stats.avgCaloriesPerDay} {t("ккал", "kcal")}</div>
              </div>
              {nutrition && (
                <>
                  <div>
                    <div className={`${fontSize.small} ${theme.textSecondary}`}>{t("Белки", "Protein")}</div>
                    <div className={`${fontSize.cardTitle} font-bold ${theme.accentText}`}>{nutrition.totalProtein}{t("г", "g")}</div>
                  </div>
                  <div>
                    <div className={`${fontSize.small} ${theme.textSecondary}`}>{t("Жиры", "Fat")}</div>
                    <div className={`${fontSize.cardTitle} font-bold ${theme.accentText}`}>{nutrition.totalFat}{t("г", "g")}</div>
                  </div>
                  <div>
                    <div className={`${fontSize.small} ${theme.textSecondary}`}>{t("Углеводы", "Carbs")}</div>
                    <div className={`${fontSize.cardTitle} font-bold ${theme.accentText}`}>{nutrition.totalCarbs}{t("г", "g")}</div>
                  </div>
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
                <h4 className={`${fontSize.cardTitle} font-semibold mb-3 ${theme.headerText}`}>
                  {t("Дни недели", "Week days")}
                </h4>
                {weekDays.map((dayKey) => {
                  const dayMeals = getMealsForDay(dayKey);
                  const dayCalories = calculateDayCalories(dayKey);
                  const date = new Date(dayKey);
                  const dayOfWeek = date.getDay();
                  const dayName = WEEKDAY_NAMES[dayOfWeek];
                  const dayShort = WEEKDAY_SHORT[dayOfWeek];
                  return (
                    <div
                      key={dayKey}
                      onClick={() => setSelectedWeekDay(dayKey)}
                      className={`p-4 ${theme.border} border rounded-xl cursor-pointer hover:shadow-lg transition flex items-center justify-between`}
                    >
                      <div className="flex-1">
                        <div className={`${fontSize.body} font-semibold`}>{dayName} ({dayShort})</div>
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
            const filteredHistory = selectedWeekDay
              ? getMealsForDay(selectedWeekDay)
              : getFilteredHistory();

            if (filteredHistory.length === 0) {
              return (
                <p className={`${theme.textSecondary} ${fontSize.body} text-center py-8`}>
                  {t("Нет записей за выбранный период", "No meals recorded for this period")}
                </p>
              );
            }

            const detailHeader = selectedWeekDay && (
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setSelectedWeekDay(null)}
                  className={`px-3 py-2 rounded-xl ${fontSize.small} ${theme.accent} ${theme.accentHover} text-white`}
                >
                  ← {t("Назад к неделе", "Back to week")}
                </button>
                <div className={`${fontSize.cardTitle} font-semibold`}>
                  {formatDate(selectedWeekDay, language)}
                </div>
              </div>
            );

            const groupedByCategory = MEAL_CATEGORIES.reduce((acc, cat) => {
              acc[cat] = filteredHistory.filter(entry => entry.category === cat);
              return acc;
            }, {});

            return (
              <div>
                {detailHeader}
                <div className="space-y-4">
                  {MEAL_CATEGORIES.map(cat => {
                    const meals = groupedByCategory[cat];
                    if (meals.length === 0) return null;
                    return (
                      <div key={cat} className={`p-4 ${theme.border} border rounded-xl`}>
                        <h4 className={`${fontSize.cardTitle} font-semibold mb-3 ${theme.headerText}`}>
                          {MEAL_LABELS[cat]} ({meals.length})
                        </h4>
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
                                  <div className={`${fontSize.small} ${theme.textSecondary}`}>
                                    {!selectedWeekDay && formatDate(entry.date, language)} {selectedWeekDay && ''} {displayCalories} {t("ккал", "kcal")}
                                  </div>
                                </div>
                                <button
                                  onClick={() => removeMealFromHistory(entry.id)}
                                  className="text-red-500 hover:text-red-700 ml-3"
                                >
                                  <FaTimes />
                                </button>
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
