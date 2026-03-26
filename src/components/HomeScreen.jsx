import React from 'react';
import { FaSearch, FaUser, FaPlus, FaTint, FaShoppingCart, FaCalendarAlt, FaTrophy, FaBalanceScale } from 'react-icons/fa';
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
    mealHistory, shoppingList, weeklyPlan,
    todayIntake, dailyGoal, addWater,
  } = useApp();

  const dailyGoals = calculateDailyGoals(userData);
  const isLoggedIn = !!(userData?.name);

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

  const MEAL_LABELS = {
    breakfast: t('\u0417\u0430\u0432\u0442\u0440\u0430\u043a', 'Breakfast'),
    lunch:     t('\u041e\u0431\u0435\u0434', 'Lunch'),
    snack:     t('\u041f\u0435\u0440\u0435\u043a\u0443\u0441', 'Snack'),
    dinner:    t('\u0423\u0436\u0438\u043d', 'Dinner'),
  };

  const widgetMap = {
    welcome: featureFlags.home_showWelcome && (
      <div key="welcome" className={`${theme.cardBg} p-6 rounded-xl shadow`}>
        <div className="flex items-center justify-between mb-3">
          <h2 className={`${fontSize.subheading} font-semibold ${theme.headerText}`}>
            {t('\u0414\u043e\u0431\u0440\u043e \u043f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c, ', 'Welcome, ')}{userData?.name || t('\u041f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c', 'User')}!
          </h2>
          <div className="flex gap-2">
            <button onClick={() => setLanguage('ru')} className={`px-3 py-1 rounded transition ${fontSize.small} ${language === 'ru' ? `${theme.accent} text-white` : `${theme.cardBg} border ${theme.border}`}`}>RU</button>
            <button onClick={() => setLanguage('en')} className={`px-3 py-1 rounded transition ${fontSize.small} ${language === 'en' ? `${theme.accent} text-white` : `${theme.cardBg} border ${theme.border}`}`}>EN</button>
          </div>
        </div>
        <p className={`${theme.textSecondary} ${fontSize.body}`}>
          {t('\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0439\u0442\u0435 \u0432\u043a\u043b\u0430\u0434\u043a\u0438 \u0441\u0432\u0435\u0440\u0445\u0443 \u0434\u043b\u044f \u043f\u0435\u0440\u0435\u0445\u043e\u0434\u0430 \u043f\u043e \u0444\u0443\u043d\u043a\u0446\u0438\u044f\u043c \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f.',
            'Use the tabs above to navigate app features.')}
        </p>
      </div>
    ),

    nutrition: featureFlags.home_showNutrition && isLoggedIn && (
      <div key="nutrition" className={`${theme.cardBg} p-6 rounded-xl shadow`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`${fontSize.subheading} font-semibold ${theme.headerText}`}>{t('\u041f\u0438\u0442\u0430\u043d\u0438\u0435 \u0437\u0430 \u0441\u0435\u0433\u043e\u0434\u043d\u044f', "Today's Nutrition")}</h3>
          {setShowAddMealModal && (
            <button onClick={() => { if (setAccountTab) setAccountTab('history'); setActiveScreen('account'); setTimeout(() => setShowAddMealModal(true), 100); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl ${fontSize.small} ${theme.accent} ${theme.accentHover} text-white`}>
              <FaPlus />{t('\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043f\u0440\u0438\u0451\u043c \u043f\u0438\u0449\u0438', 'Add meal')}
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
          { title: t('\u041f\u043e\u0438\u0441\u043a \u0440\u0435\u0446\u0435\u043f\u0442\u043e\u0432', 'Recipe Search'), content: t('\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0438\u043d\u0433\u0440\u0435\u0434\u0438\u0435\u043d\u0442\u044b \u0438\u043b\u0438 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0439\u0442\u0435 \u0444\u0438\u043b\u044c\u0442\u0440\u044b.', 'Enter ingredients or use filters.'), screen: 'search', Icon: FaSearch },
          { title: t('\u041c\u043e\u0439 \u0430\u043a\u043a\u0430\u0443\u043d\u0442', 'My Account'), content: t('\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u0442\u0435 \u043f\u0440\u043e\u0444\u0438\u043b\u044c \u0438 \u043e\u0442\u0441\u043b\u0435\u0436\u0438\u0432\u0430\u0439\u0442\u0435 \u043f\u0438\u0442\u0430\u043d\u0438\u0435.', 'Set up profile and track nutrition.'), screen: 'account', Icon: FaUser },
        ].map((tip, idx) => (
          <div key={idx} onClick={() => setActiveScreen(tip.screen)}
            className={`${theme.cardBg} p-4 rounded-xl shadow border-l-4 ${theme.border} cursor-pointer flex items-start gap-3 hover:shadow-lg transition`}>
            <tip.Icon className={`${theme.accentText} w-6 h-6`} />
            <div>
              <h4 className={`font-semibold ${fontSize.body} ${theme.headerText}`}>{tip.title}</h4>
              <p className={`${theme.textSecondary} ${fontSize.small} mt-1`}>{tip.content}</p>
            </div>
          </div>
        ))}
      </div>
    ),

    water: featureFlags.home_showWater && (
      <div key="water" className={`${theme.cardBg} p-5 rounded-xl shadow`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FaTint className="text-blue-500" />
            <h3 className={`${fontSize.cardTitle} font-semibold ${theme.headerText}`}>{t('\u0422\u0440\u0435\u043a\u0435\u0440 \u0432\u043e\u0434\u044b', 'Water Tracker')}</h3>
          </div>
          <button onClick={() => { if (setAccountTab) setAccountTab('water'); setActiveScreen('account'); }}
            className={`${fontSize.tiny} ${theme.textSecondary} underline`}>{t('\u043f\u043e\u0434\u0440\u043e\u0431\u043d\u0435\u0435', 'details')}</button>
        </div>
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className={`${fontSize.small} ${theme.textSecondary}`}>{todayIntake} {t('\u043c\u043b', 'ml')}</span>
            <span className={`${fontSize.small} ${theme.textSecondary}`}>{dailyGoal} {t('\u043c\u043b', 'ml')}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="h-3 rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${waterProgress}%` }} />
          </div>
          <p className={`${fontSize.tiny} ${theme.textSecondary} mt-1`}>
            {waterProgress >= 100
              ? t('\u0426\u0435\u043b\u044c \u0434\u043e\u0441\u0442\u0438\u0433\u043d\u0443\u0442\u0430!', 'Goal achieved!')
              : t(`\u041e\u0441\u0442\u0430\u043b\u043e\u0441\u044c: ${Math.max(dailyGoal - todayIntake, 0)} \u043c\u043b`, `Remaining: ${Math.max(dailyGoal - todayIntake, 0)} ml`)}
          </p>
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
        <div className="flex items-center gap-2 mb-4">
          <FaBalanceScale className={theme.accentText} />
          <h3 className={`${fontSize.cardTitle} font-semibold ${theme.headerText}`}>{t('\u0411\u0430\u043b\u0430\u043d\u0441 \u043a\u0430\u043b\u043e\u0440\u0438\u0439', 'Calorie Balance')}</h3>
        </div>
        <div className="flex items-center justify-around">
          <div className="text-center">
            <div className={`${fontSize.subheading} font-bold ${theme.accentText}`}>{dailyGoals.calories || 0}</div>
            <div className={`${fontSize.tiny} ${theme.textSecondary}`}>{t('\u0426\u0435\u043b\u044c', 'Goal')}</div>
          </div>
          <div className="text-center">
            <div className={`${fontSize.subheading} font-bold`}>{todayNutrition?.totalCalories || 0}</div>
            <div className={`${fontSize.tiny} ${theme.textSecondary}`}>{t('\u0421\u044a\u0435\u0434\u0435\u043d\u043e', 'Eaten')}</div>
          </div>
          <div className="text-center">
            <div className={`${fontSize.subheading} font-bold ${calorieDeficit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {Math.abs(calorieDeficit)}
            </div>
            <div className={`${fontSize.tiny} ${theme.textSecondary}`}>
              {calorieDeficit >= 0 ? t('\u041e\u0441\u0442\u0430\u0442\u043e\u043a', 'Remaining') : t('\u041f\u0440\u043e\u0444\u0438\u0446\u0438\u0442', 'Surplus')}
            </div>
          </div>
        </div>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all ${
              (todayNutrition?.totalCalories || 0) > (dailyGoals.calories || 1) ? 'bg-red-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(((todayNutrition?.totalCalories || 0) / (dailyGoals.calories || 1)) * 100, 100)}%` }}
          />
        </div>
      </div>
    ),

    topDishes: featureFlags.home_showTopDishes && isLoggedIn && topDishes.length > 0 && (
      <div key="topDishes" className={`${theme.cardBg} p-5 rounded-xl shadow`}>
        <div className="flex items-center gap-2 mb-4">
          <FaTrophy className={theme.accentText} />
          <h3 className={`${fontSize.cardTitle} font-semibold ${theme.headerText}`}>{t('\u0422\u043e\u043f \u0431\u043b\u044e\u0434 \u0437\u0430 7 \u0434\u043d\u0435\u0439', 'Top dishes this week')}</h3>
        </div>
        <div className="space-y-2">
          {topDishes.map(([title, count], i) => (
            <div key={title} className={`flex items-center gap-3 p-3 rounded-xl border ${theme.border}`}>
              <span className={`${fontSize.body} font-bold ${theme.accentText} w-6`}>{i + 1}</span>
              <span className={`flex-1 ${fontSize.small} ${theme.text} truncate`}>{title}</span>
              <span className={`${fontSize.tiny} ${theme.textSecondary}`}>{count}x</span>
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
            <h3 className={`${fontSize.cardTitle} font-semibold ${theme.headerText}`}>{t('\u0421\u043f\u0438\u0441\u043e\u043a \u043f\u043e\u043a\u0443\u043f\u043e\u043a', 'Shopping List')}</h3>
          </div>
          <button onClick={() => { if (setAccountTab) setAccountTab('shopping'); setActiveScreen('account'); }}
            className={`${fontSize.tiny} ${theme.textSecondary} underline`}>{t('\u0432\u0441\u0435 \u043f\u0443\u043d\u043a\u0442\u044b', 'see all')}</button>
        </div>
        <div className="space-y-1">
          {shoppingList.slice(0, 5).map((item, i) => (
            <div key={i} className={`flex items-center gap-2 py-1.5 border-b ${theme.border} last:border-0`}>
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.checked ? 'bg-green-500' : theme.accent.replace('bg-[', 'bg-[')}`} />
              <span className={`${fontSize.small} ${item.checked ? 'line-through ' + theme.textSecondary : theme.text} flex-1 truncate`}>{item.name}</span>
              {item.amount && <span className={`${fontSize.tiny} ${theme.textSecondary}`}>{item.amount}</span>}
            </div>
          ))}
          {shoppingList.length > 5 && (
            <p className={`${fontSize.tiny} ${theme.textSecondary} text-center pt-1`}>+{shoppingList.length - 5} {t('\u0435\u0449\u0451', 'more')}</p>
          )}
        </div>
      </div>
    ),

    plannerPreview: featureFlags.home_showPlannerPreview && hasTodayPlan && (
      <div key="plannerPreview" className={`${theme.cardBg} p-5 rounded-xl shadow`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className={theme.accentText} />
            <h3 className={`${fontSize.cardTitle} font-semibold ${theme.headerText}`}>{t('\u041f\u043b\u0430\u043d \u043d\u0430 \u0441\u0435\u0433\u043e\u0434\u043d\u044f', "Today's Plan")}</h3>
          </div>
          <button onClick={() => { if (setAccountTab) setAccountTab('planner'); setActiveScreen('account'); }}
            className={`${fontSize.tiny} ${theme.textSecondary} underline`}>{t('\u043f\u043e\u0434\u0440\u043e\u0431\u043d\u0435\u0435', 'details')}</button>
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
                {recipes.length > 2 && <div className={`${fontSize.tiny} ${theme.textSecondary}`}>+{recipes.length - 2} {t('\u0435\u0449\u0451', 'more')}</div>}
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
