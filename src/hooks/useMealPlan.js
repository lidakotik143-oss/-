import { useState, useEffect, useMemo } from 'react';
import { saveMealHistory } from '../firebase.js';
import { calculateRecipeNutrition } from '../utils/nutritionCalculator';

const getDateKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const getWeekKey = (date) => {
  const d = new Date(date);
  const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
  const pastDaysOfYear = (d - firstDayOfYear) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
};

const getMonthKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

/**
 * useMealPlan — хук истории питания.
 *
 * Инкапсулирует:
 *   - mealHistory и его мутации
 *   - автосохранение в Firestore с дебаунсом 800ms
 *   - viewPeriod / selectedDate для фильтрации
 *   - вспомогательные функции: getFilteredHistory, getMealsForDay,
 *     calculateDayCalories, calculatePeriodNutrition, calculatePeriodStats,
 *     todayNutrition (useMemo)
 *
 * Параметры:
 *   firebaseUser       — объект пользователя Firebase (или null)
 *   onVariantRequired  — колбэк, вызываемый когда рецепт имеет варианты
 *                        и нужно показать модалку выбора варианта.
 *                        Сигнатура: (recipe, onSelect) => void
 */
export function useMealPlan(firebaseUser, onVariantRequired) {
  const [mealHistory, setMealHistory] = useState([]);
  const [viewPeriod, setViewPeriod]   = useState('day');
  const [selectedDate, setSelectedDate] = useState(getDateKey(new Date()));

  // Автосохранение в Firestore с дебаунсом 800ms
  useEffect(() => {
    if (!firebaseUser?.uid) return;
    const uid = firebaseUser.uid;
    const timer = setTimeout(() => {
      saveMealHistory(uid, mealHistory).catch(() => {
        localStorage.setItem(`cookify_mealHistory_${uid}`, JSON.stringify(mealHistory));
      });
    }, 800);
    return () => clearTimeout(timer);
  }, [mealHistory, firebaseUser]);

  // ── Мутации ───────────────────────────────────────────────────────────────

  const addMealToHistory = (recipe, category, date = getDateKey(new Date()), variantKey = null) => {
    if (recipe.variants && recipe.variants.length > 0 && !variantKey) {
      onVariantRequired?.(recipe, (selectedVariantKey) => {
        addMealToHistory(recipe, category, date, selectedVariantKey);
      });
      return;
    }
    const entry = {
      id: Date.now(),
      date,
      category,
      recipe,
      variantKey,
      timestamp: new Date().toISOString(),
    };
    setMealHistory(prev => [...prev, entry]);
  };

  const removeMealFromHistory = (entryId) =>
    setMealHistory(prev => prev.filter(e => e.id !== entryId));

  // ── Вспомогательные функции ───────────────────────────────────────────────

  const getFilteredHistory = () => {
    const selectedDateObj = new Date(selectedDate);
    return mealHistory.filter(entry => {
      const entryDate = new Date(entry.date);
      if (viewPeriod === 'day')   return getDateKey(entryDate)  === getDateKey(selectedDateObj);
      if (viewPeriod === 'week')  return getWeekKey(entryDate)  === getWeekKey(selectedDateObj);
      if (viewPeriod === 'month') return getMonthKey(entryDate) === getMonthKey(selectedDateObj);
      return true;
    });
  };

  const getMealsForDay = (dateKey) =>
    mealHistory.filter(entry => getDateKey(new Date(entry.date)) === dateKey);

  const _calcEntryNutrition = (entry) => {
    let activeRecipe = entry.recipe;
    if (entry.variantKey && entry.recipe.variants) {
      const variant = entry.recipe.variants.find(v => v.key === entry.variantKey);
      if (variant) activeRecipe = variant;
    }
    const servings = entry.recipe.servings || 2;
    const info = calculateRecipeNutrition(activeRecipe.ingredients || [], servings);
    return {
      calories: info.total.calories || (activeRecipe.caloriesPerServing || activeRecipe.calories || entry.recipe.caloriesPerServing || entry.recipe.calories || 0) * servings,
      protein:  info.total.protein  || 0,
      fat:      info.total.fat      || 0,
      carbs:    info.total.carbs    || 0,
    };
  };

  const calculateDayCalories = (dateKey) =>
    getMealsForDay(dateKey).reduce((sum, entry) => sum + _calcEntryNutrition(entry).calories, 0);

  const calculatePeriodNutrition = () => {
    const filtered = getFilteredHistory();
    const totals = filtered.reduce(
      (acc, entry) => {
        const n = _calcEntryNutrition(entry);
        return { calories: acc.calories + n.calories, protein: acc.protein + n.protein, fat: acc.fat + n.fat, carbs: acc.carbs + n.carbs };
      },
      { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );
    return {
      totalCalories: Math.round(totals.calories),
      totalProtein:  Math.round(totals.protein),
      totalFat:      Math.round(totals.fat),
      totalCarbs:    Math.round(totals.carbs),
    };
  };

  const calculatePeriodStats = () => {
    const filtered = getFilteredHistory();
    const { totalCalories } = calculatePeriodNutrition();
    const getDaysInPeriod = () => {
      if (viewPeriod === 'day')   return 1;
      if (viewPeriod === 'week')  return 7;
      if (viewPeriod === 'month') {
        const d = new Date(selectedDate);
        return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
      }
      return 1;
    };
    return {
      totalMeals: filtered.length,
      totalCalories,
      avgCaloriesPerDay: viewPeriod === 'day' ? totalCalories : Math.round(totalCalories / getDaysInPeriod()),
    };
  };

  // Питание за сегодня (пересчитывается только при изменении mealHistory)
  const todayNutrition = useMemo(() => {
    const todayKey = getDateKey(new Date());
    const todayMeals = mealHistory.filter(e => getDateKey(new Date(e.date)) === todayKey);
    const totals = todayMeals.reduce(
      (acc, entry) => {
        const n = _calcEntryNutrition(entry);
        return { calories: acc.calories + n.calories, protein: acc.protein + n.protein, fat: acc.fat + n.fat, carbs: acc.carbs + n.carbs };
      },
      { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );
    return {
      totalCalories: Math.round(totals.calories),
      totalProtein:  Math.round(totals.protein),
      totalFat:      Math.round(totals.fat),
      totalCarbs:    Math.round(totals.carbs),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mealHistory]);

  return {
    mealHistory,
    setMealHistory,
    addMealToHistory,
    removeMealFromHistory,
    viewPeriod,
    setViewPeriod,
    selectedDate,
    setSelectedDate,
    getFilteredHistory,
    getMealsForDay,
    calculateDayCalories,
    calculatePeriodNutrition,
    calculatePeriodStats,
    todayNutrition,
  };
}
