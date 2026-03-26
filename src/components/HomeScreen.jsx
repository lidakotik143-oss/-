import React from 'react';
import { FaSearch, FaUser, FaPlus, FaTint, FaShoppingCart, FaCalendarAlt } from 'react-icons/fa';
import { NutritionDashboard } from './NutritionVisuals';
import { calculateDailyGoals } from '../utils/nutrition';
import { useApp } from '../context/AppContext';

export default function HomeScreen({
  userData, language, setLanguage, setActiveScreen,
  theme, fontSize, todayNutrition, setShowAddMealModal, setAccountTab
}) {
  const t = (ru, en) => (language === 'ru' ? ru : en);
  const {
    featureFlags, homeWidgetsOrder,
    mealHistory, shoppingList, weeklyPlan, plannerWeekDate,
    todayIntake, dailyGoal, addWater,
  } = useApp();

  const dailyGoals = calculateDailyGoals(userData);
  const isLoggedIn = !!(userData?.name);

  // ── Топ блюд за 7 дней из истории питания
  const getTopDishes = () => {
    const counts = {};
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    mealHistory.forEach(entry => {
      const d = new Date(entry.date);
      if (d >= weekAgo) {
        const title = entry.recipe?.title || '';
        if (title) counts[title] = (counts[title] || 0) + 1;
      }
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3);
  };

  // ── План на сегодня из планировщика
  const getTodayPlan = () => {
    const d = new Date();
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    return weeklyPlan?.[key] || {};
  };

  const todayPlan = getTodayPlan();
  const hasTodayPlan = Object.values(todayPlan).some(arr => arr?.length > 0);
  const topDishes = getTopDishes();
  const waterProgress = Math.min((todayIntake / dailyGoal) * 100, 100);
  const calorieDeficit = (dailyGoals.calories || 0) - (todayNutrition?.totalCalories || 0);

  const MEAL_LABELS = { breakfast: t('Завтрак', 'Breakfast'), lunch: t('Обед', 'Lunch'), snack: t('Перекус', 'Snack'), dinner: t('Ужин', 'Dinner') };

  const widgetMap = {
    // ── Существующие ──────────────────────────────────────────────────
    welcome: featureFlags.home_showWelcome && (
      <div key="welcome" className={`${theme.cardBg} p-6 rounded-xl shadow`}>
        <div className="flex items-center justify-between mb-3">
          <h2 className={`${fontSize.subheading} font-semibold ${theme.headerText}`}>
            {t('Добро пожаловать, ', 'Welcome, ')}{userData?.name || t('Пользователь', 'User')}!
          </h2>
          <div className="flex gap-2">
            <button onClick={() => setLanguage('ru')} className={`px-3 py-1 rounded transition ${fontSize.small} ${language === 'ru' ? `${theme.accent} text-white` : `${theme.cardBg} border ${theme.border}`}`}>🇷🇺 RU</button>
            <button onClick={() => setLanguage('en')} className={`px-3 py-1 rounded transition ${fontSize.small} ${language === 'en' ? `${theme.accent} text-white` : `${theme.cardBg} border ${theme.border}`}`}>🇬🇧 EN</button>
          </div>
        </div>
        <p className={`${theme.textSecondary} ${fontSize.body}`}>
          {t('Используйте вкладки сверху для перехода по функциям приложения.',
            'Use the tabs above to navigate app features.')}
        </p>
      </div>
    ),

    nutrition: featureFlags.home_showNutrition && isLoggedIn && (
      <div key="nutrition" className={`${theme.cardBg} p-6 rounded-xl shadow`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`${fontSize.subheading} font-semibold ${theme.headerText}`}>{t('Питание за сегодня', "Today's Nutrition")}</h3>
          {setShowAddMealModal && (
            <button onClick={() => { if (setAccountTab) setAccountTab('history'); setActiveScreen('account'); setTimeout(() => setShowAddMealModal(true), 100); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl ${fontSize.small} ${theme.accent} ${theme.accentHover} text-white`}>
              <FaPlus />{t('Добавить приём пищи', 'Add meal')}
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

    // ── Новые виджеты ────────────────────────────────────────────────
    water: featureFlags.home_showWater && (
      <div key="water" className={`${theme.cardBg} p-5 rounded-xl shadow`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FaTint className="text-blue-500 text-xl" />
            <h3 className={`${fontSize.cardTitle} font-semibold ${theme.headerText}`}>{t('Трекер воды', 'Water Tracker')}</h3>
          </div>
          <button onClick={() => { if (setAccountTab) setAccountTab('water'); setActiveScreen('account'); }}
            className={`${fontSize.tiny} ${theme.textSecondary} underline`}>{t('подробнее', 'details')}</button>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className={`${fontSize.small} ${theme.textSecondary}`}>{todayIntake} {t('мл', 'ml')}</span>
              <span className={`${fontSize.small} ${theme.textSecondary}`}>{dailyGoal} {t('мл', 'ml')}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="h-3 rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${waterProgress}%` }} />
            </div>
            <p className={`${fontSize.tiny} ${theme.textSecondary} mt-1`}>
              {waterProgress >= 100 ? `🎉 ${t('Цель достигнута!', 'Goal achieved!')}` : t(`Осталось: ${Math.max(dailyGoal - todayIntake, 0)} мл`, `Remaining: ${Math.max(dailyGoal - todayIntake, 0)} ml`)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {[250, 500, 1000].map(amt => (
            <button key={amt} onClick={() => addWater(amt)}
              className={`flex-1 py-2 rounded-xl ${theme.accent} text-white ${fontSize.small} font-semibold hover:opacity-80 transition`}>
              +{amt}
            </button>
          ))}
        </div>
      </div>
    ),

    calorieBalance: featureFlags.home_showCalorieBalance && isLoggedIn && (
      <div key="calorieBalance" className={`${theme.cardBg} p-5 rounded-xl shadow`}>
        <h3 className={`${fontSize.cardTitle} font-semibold ${theme.headerText} mb-4`}>{t('Баланс калорий', 'Calorie Balance')}</h3>
        <div className="flex items-center justify-around">
          <div className="text-center">
            <div className={`${fontSize.subheading} font-bold ${theme.accentText}`}>{dailyGoals.calories || 0}</div>
            <div className={`${fontSize.tiny} ${theme.textSecondary}`}>{t('Цель', 'Goal')}</div>
          </div>
          <div className="text-center">
            <div className={`${fontSize.subheading} font-bold`}>{todayNutrition?.totalCalories || 0}</div>
            <div className={`${fontSize.tiny} ${theme.textSecondary}`}>{t('Съедено', 'Eaten')}</div>
          </div>
          <div className="text-center">
            <div className={`${fontSize.subheading} font-bold ${calorieDeficit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {calorieDeficit >= 0 ? calorieDeficit : Math.abs(calorieDeficit)}
            </div>
            <div className={`${fontSize.tiny} ${theme.textSecondary}`}>
              {calorieDeficit >= 0 ? t('Остаток', 'Remaining') : t('Профицит', 'Surplus')}
            </div>
          </div>
        </div>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
          <div className={`h-2.5 rounded-full transition-all ${(todayNutrition?.totalCalories || 0) > (dailyGoals.calories || 1) ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${Math.min(((todayNutrition?.totalCalories || 0) / (dailyGoals.calories || 1)) * 100, 100)}%` }} />
        </div>
      </div>
    ),

    topDishes: featureFlags.home_showTopDishes && isLoggedIn && topDishes.length > 0 && (
      <div key="topDishes" className={`${theme.cardBg} p-5 rounded-xl shadow`}>
        <h3 className={`${fontSize.cardTitle} font-semibold ${theme.headerText} mb-4`}>🏆 {t('Топ блюд за 7 дней', 'Top dishes this week')}</h3>
        <div className="space-y-2">
          {topDishes.map(([title, count], i) => (
            <div key={title} className={`flex items-center gap-3 p-3 rounded-xl border ${theme.border}`}>
              <span className={`${fontSize.body} font-bold ${theme.accentText} w-6`}>{i + 1}</span>
              <span className={`flex-1 ${fontSize.small} ${theme.text} truncate`}>{title}</span>
              <span className={`${fontSize.tiny} ${theme.textSecondary}`}>{count}×</span>
            </div>
          ))}
        </div>
      </div>
    ),

    shoppingPreview: featureFlags.home_showShoppingPreview && shoppingList?.length > 0 && (
      <div key="shoppingPreview" className={`${theme.cardBg} p-5 rounded-xl shadow`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FaShoppingCart className={theme.accentText} />
            <h3 className={`${fontSize.cardTitle} font-semibold ${theme.headerText}`}>{t('Список покупок', 'Shopping List')}</h3>
          </div>
          <button onClick={() => { if (setAccountTab) setAccountTab('shopping'); setActiveScreen('account'); }}
            className={`${fontSize.tiny} ${theme.textSecondary} underline`}>{t('все пункты', 'see all')}</button>
        </div>
        <div className="space-y-1">
          {shoppingList.slice(0, 5).map((item, i) => (
            <div key={i} className={`flex items-center gap-2 py-1.5 border-b ${theme.border} last:border-0`}>
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.checked ? 'bg-green-500' : theme.accent.replace('bg-', 'bg-')}`} />
              <span className={`${fontSize.small} ${item.checked ? 'line-through ' + theme.textSecondary : theme.text} flex-1 truncate`}>{item.name}</span>
              {item.amount && <span className={`${fontSize.tiny} ${theme.textSecondary}`}>{item.amount}</span>}
            </div>
          ))}
          {shoppingList.length > 5 && (
            <p className={`${fontSize.tiny} ${theme.textSecondary} text-center pt-1`}>+{shoppingList.length - 5} {t('ещё', 'more')}</p>
          )}
        </div>
      </div>
    ),

    plannerPreview: featureFlags.home_showPlannerPreview && hasTodayPlan && (
      <div key="plannerPreview" className={`${theme.cardBg} p-5 rounded-xl shadow`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className={theme.accentText} />
            <h3 className={`${fontSize.cardTitle} font-semibold ${theme.headerText}`}>{t('План на сегодня', "Today's Plan")}</h3>
          </div>
          <button onClick={() => { if (setAccountTab) setAccountTab('planner'); setActiveScreen('account'); }}
            className={`${fontSize.tiny} ${theme.textSecondary} underline`}>{t('подробнее', 'details')}</button>
        </div>
        <div className="space-y-2">
          {Object.entries(todayPlan).map(([cat, recipes]) => {
            if (!recipes?.length) return null;
            return (
              <div key={cat} className={`p-3 rounded-xl border ${theme.border}`}>
                <div className={`${fontSize.tiny} ${theme.textSecondary} font-semibold uppercase mb-1`}>{MEAL_LABELS[cat] || cat}</div>
                {recipes.slice(0, 2).map((r, i) => (
                  <div key={i} className={`${fontSize.small} ${theme.text} truncate`}>{r.title || r}</div>
                ))}
                {recipes.length > 2 && <div className={`${fontSize.tiny} ${theme.textSecondary}`}>+{recipes.length - 2} {t('ещё', 'more')}</div>}
              </div>
            );
          })}
        </div>
      </div>
    ),
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {homeWidgetsOrder.map(id => widgetMap[id] || null)}
    </div>
  );
}
