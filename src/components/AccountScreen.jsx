import React from "react";
import {
  FaUser,
  FaCalendarAlt,
  FaUtensils,
  FaExchangeAlt,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaTimes
} from "react-icons/fa";

export default function AccountScreen({
  // i18n / UI
  t,
  theme,
  fontSize,
  language,

  // profile state
  registered,
  userData,
  unitSystem,
  currentTheme,
  currentFont,
  currentFontSize,
  showCustomization,
  setShowCustomization,
  showRegisterForm,
  isEditingProfile,
  GOALS,
  LIFESTYLE,

  // account tabs
  accountTab,
  setAccountTab,

  // period/history
  viewPeriod,
  setViewPeriod,
  selectedDate,
  setSelectedDate,
  selectedWeekDay,
  setSelectedWeekDay,
  MONTH_NAMES,
  WEEKDAY_NAMES,
  WEEKDAY_SHORT,
  MEAL_CATEGORIES,
  MEAL_LABELS,

  // history + planner data
  SAMPLE_RECIPES,
  getFilteredHistory,
  getMealsForDay,
  calculateDayCalories,
  calculatePeriodStats,
  getWeekDays,
  getWeekRange,
  formatDate,
  getPeriodDisplayText,
  addDays,
  addWeeks,
  addMonths,
  setMonthYear,

  plannerWeekDate,
  setPlannerWeekDate,
  weeklyPlan,
  getPlannerRecipes,
  calculatePlannerDayCalories,

  // modals
  showAddMealModal,
  setShowAddMealModal,
  addMealCategory,
  setAddMealCategory,
  showPlannerModal,
  setShowPlannerModal,
  plannerModalDate,
  setPlannerModalDate,
  plannerModalCategory,
  setPlannerModalCategory,
  getSortedRecipesForPlanner,

  // actions
  handleStartEditProfile,
  handleLogout,
  toggleUnitSystem,
  handleRegister,
  handleAvatarUpload,
  setCurrentTheme,
  setCurrentFont,
  setCurrentFontSize,
  getDisplayWeight,
  getDisplayHeight,
  removeMealFromHistory,
  addMealToHistory,
  addRecipeToPlanner,
  removeRecipeFromPlanner,

  // recipe modal launcher
  setSelectedRecipe,
  setSelectedRecipeVariantKey
}) {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {!registered ? (
        <div className={`${theme.cardBg} p-6 rounded-xl shadow text-center`}>
          <FaUser className={`w-16 h-16 mx-auto ${theme.textSecondary} mb-4`} />
          <h2 className={`${fontSize.subheading} font-semibold mb-3`}>
            {t("Создайте свой профиль", "Create your profile")}
          </h2>
          <p className={`${theme.textSecondary} ${fontSize.body} mb-4`}>
            {t(
              "Заполните данные, чтобы получать персонализированные рекомендации и управлять планом питания.",
              "Fill in your details to get personalized recommendations and manage your meal plan."
            )}
          </p>
          <button
            onClick={() => setShowRegisterForm(true)}
            className={`px-6 py-3 rounded-xl ${fontSize.body} ${theme.accent} ${theme.accentHover} text-white`}
          >
            {t("Начать", "Get Started")}
          </button>
        </div>
      ) : (
        <>
          <div className={`${theme.cardBg} p-6 rounded-xl shadow`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-4 items-center">
                {userData?.avatarURL ? (
                  <img
                    src={userData.avatarURL}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-20 h-20 rounded-full ${theme.accent} flex items-center justify-center text-white text-3xl font-bold`}
                  >
                    {(userData?.name || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className={`${fontSize.subheading} font-bold`}>
                    {userData?.name || t("Пользователь", "User")}
                  </h2>
                  <p className={`${theme.textSecondary} ${fontSize.small}`}>
                    {userData?.email || t("email не указан", "no email")}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleStartEditProfile}
                  className={`px-4 py-2 rounded-xl ${fontSize.small} ${theme.accent} ${theme.accentHover} text-white`}
                >
                  {t("Редактировать", "Edit")}
                </button>
                <button
                  onClick={handleLogout}
                  className={`px-4 py-2 rounded-xl ${fontSize.small} bg-red-500 hover:bg-red-600 text-white`}
                >
                  {t("Выйти", "Logout")}
                </button>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-end gap-2">
              <span className={`${fontSize.small} ${theme.textSecondary}`}>
                {unitSystem === "metric"
                  ? t("Метрическая", "Metric")
                  : t("Имперская", "Imperial")}
              </span>
              <button
                onClick={toggleUnitSystem}
                className={`px-3 py-1 rounded-xl ${fontSize.small} ${theme.accent} ${theme.accentHover} text-white flex items-center gap-2`}
              >
                <FaExchangeAlt />
                {t("Переключить", "Switch")}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {[
                { label: t("Возраст", "Age"), value: userData?.age },
                { label: t("Вес", "Weight"), value: getDisplayWeight?.() },
                { label: t("Рост", "Height"), value: getDisplayHeight?.() },
                { label: t("Цель", "Goal"), value: userData?.goal },
                { label: t("Образ жизни", "Lifestyle"), value: userData?.lifestyle },
                {
                  label: t("Аллергии", "Allergies"),
                  value: userData?.allergies || t("Нет", "None")
                }
              ].map(
                (item, idx) =>
                  item.value && (
                    <div key={idx} className={`p-3 ${theme.border} border rounded-lg`}>
                      <div className={`${fontSize.small} ${theme.textSecondary} mb-1`}>
                        {item.label}
                      </div>
                      <div className={`${fontSize.body} font-semibold`}>{item.value}</div>
                    </div>
                  )
              )}
            </div>
          </div>

          <div className={`${theme.cardBg} p-3 rounded-xl shadow flex gap-2`}>
            <button
              onClick={() => setAccountTab("history")}
              className={`flex-1 px-4 py-2 rounded-xl ${fontSize.small} transition flex items-center justify-center gap-2 ${
                accountTab === "history"
                  ? `${theme.accent} text-white`
                  : `${theme.border} border`
              }`}
            >
              <FaCalendarAlt />
              {t("История питания", "Meal history")}
            </button>
            <button
              onClick={() => setAccountTab("planner")}
              className={`flex-1 px-4 py-2 rounded-xl ${fontSize.small} transition flex items-center justify-center gap-2 ${
                accountTab === "planner"
                  ? `${theme.accent} text-white`
                  : `${theme.border} border`
              }`}
            >
              <FaUtensils />
              {t("План меню", "Menu plan")}
            </button>
          </div>

          {accountTab === "history" && (
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
                {["day", "week", "month"].map((period) => (
                  <button
                    key={period}
                    onClick={() => {
                      setViewPeriod(period);
                      setSelectedWeekDay(null);
                    }}
                    className={`px-4 py-2 rounded-xl ${fontSize.small} transition ${
                      viewPeriod === period
                        ? `${theme.accent} text-white`
                        : `${theme.border} border`
                    }`}
                  >
                    {period === "day" && t("День", "Day")}
                    {period === "week" && t("Неделя", "Week")}
                    {period === "month" && t("Месяц", "Month")}
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
                        onClick={() => setSelectedDate(new Date().toISOString().split("T")[0])}
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
                          setSelectedDate(
                            setMonthYear(
                              selectedDate,
                              parseInt(e.target.value, 10),
                              d.getFullYear()
                            )
                          );
                        }}
                        className={`px-3 py-2 rounded-lg ${theme.input} ${fontSize.small}`}
                      >
                        {MONTH_NAMES.map((month, idx) => (
                          <option key={idx} value={idx}>
                            {month}
                          </option>
                        ))}
                      </select>

                      <select
                        value={new Date(selectedDate).getFullYear()}
                        onChange={(e) => {
                          const d = new Date(selectedDate);
                          setSelectedDate(
                            setMonthYear(
                              selectedDate,
                              d.getMonth(),
                              parseInt(e.target.value, 10)
                            )
                          );
                        }}
                        className={`px-3 py-2 rounded-lg ${theme.input} ${fontSize.small}`}
                      >
                        {Array.from(
                          { length: 10 },
                          (_, i) => new Date().getFullYear() - 5 + i
                        ).map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {(() => {
                const stats = calculatePeriodStats();
                return (
                  <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 ${theme.border} border rounded-xl`}>
                    <div>
                      <div className={`${fontSize.small} ${theme.textSecondary}`}>
                        {t("Всего приемов пищи", "Total meals")}
                      </div>
                      <div className={`${fontSize.cardTitle} font-bold ${theme.accentText}`}>
                        {stats.totalMeals}
                      </div>
                    </div>
                    <div>
                      <div className={`${fontSize.small} ${theme.textSecondary}`}>
                        {t("Всего калорий", "Total calories")}
                      </div>
                      <div className={`${fontSize.cardTitle} font-bold ${theme.accentText}`}>
                        {stats.totalCalories} {t("ккал", "kcal")}
                      </div>
                    </div>
                    <div>
                      <div className={`${fontSize.small} ${theme.textSecondary}`}>
                        {t("Среднее в день", "Avg per day")}
                      </div>
                      <div className={`${fontSize.cardTitle} font-bold ${theme.accentText}`}>
                        {stats.avgCaloriesPerDay} {t("ккал", "kcal")}
                      </div>
                    </div>
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
                              <div className={`${fontSize.body} font-semibold`}>
                                {dayName} ({dayShort})
                              </div>
                              <div className={`${fontSize.small} ${theme.textSecondary}`}>
                                {formatDate(dayKey, language)}
                              </div>
                            </div>
                            <div className="text-right mr-4">
                              <div className={`${fontSize.small} ${theme.textSecondary}`}>
                                {t("Приемов:", "Meals:")} {dayMeals.length}
                              </div>
                              <div className={`${fontSize.body} font-bold ${theme.accentText}`}>
                                {dayCalories} {t("ккал", "kcal")}
                              </div>
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
                        {t(
                          "Нет записей за выбранный период",
                          "No meals recorded for this period"
                        )}
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
                    acc[cat] = filteredHistory.filter((entry) => entry.category === cat);
                    return acc;
                  }, {});

                  return (
                    <div>
                      {detailHeader}
                      <div className="space-y-4">
                        {MEAL_CATEGORIES.map((cat) => {
                          const meals = groupedByCategory[cat] || [];
                          if (meals.length === 0) return null;

                          return (
                            <div key={cat} className={`p-4 ${theme.border} border rounded-xl`}>
                              <h4 className={`${fontSize.cardTitle} font-semibold mb-3 ${theme.headerText}`}>
                                {MEAL_LABELS[cat]} ({meals.length})
                              </h4>
                              <div className="space-y-2">
                                {meals.map((entry) => (
                                  <div
                                    key={entry.id}
                                    className={`flex items-center justify-between p-3 ${theme.cardBg} rounded-lg`}
                                  >
                                    <div className="flex-1">
                                      <div className={`${fontSize.body} font-semibold`}>
                                        {entry.recipe.title}
                                      </div>
                                      <div className={`${fontSize.small} ${theme.textSecondary}`}>
                                        {!selectedWeekDay ? formatDate(entry.date, language) : ""}{" "}
                                        {(entry.recipe.caloriesPerServing || entry.recipe.calories) || 0} {t("ккал", "kcal")}
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => removeMealFromHistory(entry.id)}
                                      className="text-red-500 hover:text-red-700 ml-3"
                                    >
                                      <FaTimes />
                                    </button>
                                  </div>
                                ))}
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
          )}

          {accountTab === "planner" && (
            <div className={`${theme.cardBg} p-6 rounded-xl shadow`}>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <h3 className={`${fontSize.subheading} font-semibold flex items-center gap-2`}>
                  <FaUtensils />
                  {t("План меню", "Menu Planner")}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPlannerWeekDate(addWeeks(plannerWeekDate, -1))}
                    className={`p-2 rounded-lg ${theme.accent} ${theme.accentHover} text-white`}
                    title={t("Предыдущая неделя", "Previous week")}
                  >
                    <FaChevronLeft size={18} />
                  </button>
                  <div className={`${fontSize.small} font-semibold ${theme.headerText}`}>
                    {getWeekRange(plannerWeekDate, language)}
                  </div>
                  <button
                    onClick={() => setPlannerWeekDate(addWeeks(plannerWeekDate, 1))}
                    className={`p-2 rounded-lg ${theme.accent} ${theme.accentHover} text-white`}
                    title={t("Следующая неделя", "Next week")}
                  >
                    <FaChevronRight size={18} />
                  </button>
                </div>
              </div>

              {(() => {
                const weekDays = getWeekDays(plannerWeekDate);

                return (
                  <div className="overflow-x-auto">
                    <table className={`w-full border-collapse ${fontSize.small}`}>
                      <thead>
                        <tr>
                          <th className={`p-2 text-left ${theme.textSecondary}`}>
                            {t("Приём", "Meal")}
                          </th>
                          {weekDays.map((dayKey) => {
                            const date = new Date(dayKey);
                            const dow = date.getDay();
                            return (
                              <th key={dayKey} className={`p-2 text-center ${theme.textSecondary}`}>
                                <div className="font-semibold">{WEEKDAY_SHORT[dow]}</div>
                                <div className="text-xs">{date.getDate()}</div>
                              </th>
                            );
                          })}
                        </tr>
                        <tr>
                          <th className={`p-2 text-left ${theme.textSecondary}`}>
                            {t("Ккал", "Kcal")}
                          </th>
                          {weekDays.map((dayKey) => (
                            <th key={dayKey} className={`p-2 text-center ${theme.accentText} font-bold`}>
                              {calculatePlannerDayCalories(dayKey)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {MEAL_CATEGORIES.map((cat) => (
                          <tr key={cat} className={`${theme.border} border-t`}>
                            <td className="p-2 align-top font-semibold whitespace-nowrap">
                              {MEAL_LABELS[cat]}
                            </td>
                            {weekDays.map((dayKey) => {
                              const recipes = getPlannerRecipes(dayKey, cat);
                              return (
                                <td key={`${dayKey}-${cat}`} className="p-2 align-top min-w-[200px]">
                                  <div className="space-y-2">
                                    {recipes.map((r) => (
                                      <div
                                        key={r.id}
                                        className={`flex items-center justify-between gap-2 p-2 rounded-lg ${theme.border} border`}
                                      >
                                        <button
                                          onClick={() => {
                                            setSelectedRecipe(r);
                                            setSelectedRecipeVariantKey(r?.variants?.[0]?.key || null);
                                          }}
                                          className="text-left flex-1"
                                        >
                                          <div className="font-semibold leading-snug">{r.title}</div>
                                          <div className={`text-xs ${theme.textSecondary}`}>
                                            {(r.caloriesPerServing || r.calories) || 0} {t("ккал", "kcal")} • {r.time}{" "}
                                            {t("мин", "min")}
                                          </div>
                                        </button>
                                        <button
                                          onClick={() => removeRecipeFromPlanner(dayKey, cat, r.id)}
                                          className="text-red-500 hover:text-red-700"
                                          title={t("Удалить", "Remove")}
                                        >
                                          <FaTimes />
                                        </button>
                                      </div>
                                    ))}

                                    <button
                                      onClick={() => {
                                        setPlannerModalDate(dayKey);
                                        setPlannerModalCategory(cat);
                                        setShowPlannerModal(true);
                                      }}
                                      className={`w-full px-3 py-2 rounded-lg ${fontSize.small} ${theme.accent} ${theme.accentHover} text-white flex items-center justify-center gap-2`}
                                    >
                                      <FaPlus />
                                      {t("Добавить", "Add")}
                                    </button>
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          )}

          <div className={`${theme.cardBg} p-6 rounded-xl shadow`}>
            <button
              onClick={() => setShowCustomization(!showCustomization)}
              className={`flex items-center justify-between w-full ${fontSize.cardTitle} font-semibold`}
            >
              <span>{t("Настройки интерфейса", "Interface settings")}</span>
              <span className={theme.textSecondary}>
                {showCustomization ? "▲" : "▼"}
              </span>
            </button>

            {showCustomization && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <div className={`${fontSize.small} ${theme.textSecondary} mb-1`}>
                      {t("Тема", "Theme")}
                    </div>
                    <select
                      value={currentTheme}
                      onChange={(e) => setCurrentTheme(e.target.value)}
                      className={`w-full p-2 rounded-xl ${theme.input} ${fontSize.body}`}
                    >
                      {Object.keys(THEMES || {}).map((key) => (
                        <option key={key} value={key}>
                          {language === "ru" ? THEMES[key].name : THEMES[key].nameEn}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div className={`${fontSize.small} ${theme.textSecondary} mb-1`}>
                      {t("Шрифт", "Font")}
                    </div>
                    <select
                      value={currentFont}
                      onChange={(e) => setCurrentFont(e.target.value)}
                      className={`w-full p-2 rounded-xl ${theme.input} ${fontSize.body}`}
                    >
                      {Object.keys(FONTS || {}).map((key) => (
                        <option key={key} value={key}>
                          {language === "ru" ? FONTS[key].nameRu : FONTS[key].name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div className={`${fontSize.small} ${theme.textSecondary} mb-1`}>
                      {t("Размер", "Size")}
                    </div>
                    <select
                      value={currentFontSize}
                      onChange={(e) => setCurrentFontSize(e.target.value)}
                      className={`w-full p-2 rounded-xl ${theme.input} ${fontSize.body}`}
                    >
                      {Object.keys(FONT_SIZES || {}).map((key) => (
                        <option key={key} value={key}>
                          {language === "ru" ? FONT_SIZES[key].name : FONT_SIZES[key].nameEn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
