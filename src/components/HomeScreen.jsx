import React from 'react';
import { FaSearch, FaUser, FaPlus } from 'react-icons/fa';
import { NutritionDashboard } from './NutritionVisuals';
import { calculateDailyGoals } from '../utils/nutrition';
import { useApp } from '../context/AppContext';

export default function HomeScreen({
  userData,
  language,
  setLanguage,
  setActiveScreen,
  theme,
  fontSize,
  todayNutrition,
  setShowAddMealModal,
  setAccountTab
}) {
  const t = (ru, en) => (language === 'ru' ? ru : en);
  const { featureFlags, homeWidgetsOrder } = useApp();
  const dailyGoals = calculateDailyGoals(userData);
  const isLoggedIn = !!(userData?.name);

  // Карта виджетов: id → компонент
  const widgetMap = {
    welcome: featureFlags.home_showWelcome && (
      <div key="welcome" className={`${theme.cardBg} p-6 rounded-xl shadow`}>
        <div className="flex items-center justify-between mb-3">
          <h2 className={`${fontSize.subheading} font-semibold ${theme.headerText}`}>
            {t('Добро пожаловать, ', 'Welcome, ')}{userData?.name || t('Пользователь', 'User')}!
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setLanguage('ru')}
              className={`px-3 py-1 rounded transition ${fontSize.small} ${
                language === 'ru' ? `${theme.accent} text-white` : `${theme.cardBg} border ${theme.border}`
              }`}
            >
              🇷🇺 RU
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded transition ${fontSize.small} ${
                language === 'en' ? `${theme.accent} text-white` : `${theme.cardBg} border ${theme.border}`
              }`}
            >
              🇬🇧 EN
            </button>
          </div>
        </div>
        <p className={`${theme.textSecondary} ${fontSize.body}`}>
          {t(
            'Используйте вкладки сверху для перехода по функциям приложения.',
            'Use the tabs above to navigate app features.'
          )}
        </p>
      </div>
    ),

    nutrition: featureFlags.home_showNutrition && isLoggedIn && (
      <div key="nutrition" className={`${theme.cardBg} p-6 rounded-xl shadow`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`${fontSize.subheading} font-semibold ${theme.headerText}`}>
            {t('Питание за сегодня', "Today's Nutrition")}
          </h3>
          {setShowAddMealModal && (
            <button
              onClick={() => {
                if (setAccountTab) setAccountTab('history');
                setActiveScreen('account');
                setTimeout(() => setShowAddMealModal(true), 100);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl ${fontSize.small} ${theme.accent} ${theme.accentHover} text-white`}
            >
              <FaPlus />
              {t('Добавить приём пищи', 'Add meal')}
            </button>
          )}
        </div>
        <NutritionDashboard
          calories={{ current: todayNutrition?.totalCalories || 0, goal: dailyGoals.calories }}
          macros={{ protein: todayNutrition?.totalProtein || 0, fat: todayNutrition?.totalFat || 0, carbs: todayNutrition?.totalCarbs || 0 }}
          goals={{ protein: dailyGoals.protein, fat: dailyGoals.fat, carbs: dailyGoals.carbs }}
          theme={theme} fontSize={fontSize} language={language}
        />
      </div>
    ),

    navCards: featureFlags.home_showNavCards && !isLoggedIn && (
      <div key="navCards" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: t('Поиск рецептов', 'Recipe Search'), content: t('Введите ингредиенты или используйте фильтры.', 'Enter ingredients or use filters.'), screen: 'search', icon: <FaSearch className={`${theme.accentText} w-6 h-6`} /> },
          { title: t('Мой аккаунт', 'My Account'), content: t('Настройте профиль и отслеживайте питание.', 'Set up profile and track nutrition.'), screen: 'account', icon: <FaUser className={`${theme.accentText} w-6 h-6`} /> },
        ].map((tip, idx) => (
          <div key={idx} onClick={() => setActiveScreen(tip.screen)}
            className={`${theme.cardBg} p-4 rounded-xl shadow border-l-4 ${theme.border} cursor-pointer flex items-start gap-3 hover:shadow-lg transition`}>
            {tip.icon}
            <div>
              <h4 className={`font-semibold ${fontSize.body} ${theme.headerText}`}>{tip.title}</h4>
              <p className={`${theme.textSecondary} ${fontSize.small} mt-1`}>{tip.content}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {homeWidgetsOrder.map(id => widgetMap[id] || null)}
    </div>
  );
}
