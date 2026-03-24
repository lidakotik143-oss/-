import { useState, useEffect } from 'react';
import { saveWeeklyPlan } from '../firebase.js';

const MEAL_CATEGORIES = ['breakfast', 'lunch', 'snack', 'dinner'];

/**
 * useWeeklyPlanner — хук планировщика меню на неделю.
 *
 * Инкапсулирует:
 *   - weeklyPlan и его мутации
 *   - автосохранение в Firestore с дебаунсом 800ms
 *   - addRecipeToPlanner / removeRecipeFromPlanner
 *   - getPlannerRecipes / calculatePlannerDayCalories
 *
 * Параметры:
 *   firebaseUser      — объект пользователя Firebase (или null)
 *   allRecipes        — объединённый массив рецептов
 *   onVariantRequired — колбэк (recipe, onSelect) для показа модалки вариантов
 */
export function useWeeklyPlanner(firebaseUser, allRecipes, onVariantRequired) {
  const [weeklyPlan, setWeeklyPlan]         = useState({});
  const [plannerWeekDate, setPlannerWeekDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [showPlannerModal, setShowPlannerModal]       = useState(false);
  const [plannerModalDate, setPlannerModalDate]       = useState(null);
  const [plannerModalCategory, setPlannerModalCategory] = useState('breakfast');

  // Автосохранение в Firestore с дебаунсом 800ms
  useEffect(() => {
    if (!firebaseUser?.uid) return;
    const uid = firebaseUser.uid;
    const timer = setTimeout(() => {
      saveWeeklyPlan(uid, weeklyPlan).catch(() => {
        localStorage.setItem(`cookify_weeklyPlan_${uid}`, JSON.stringify(weeklyPlan));
      });
    }, 800);
    return () => clearTimeout(timer);
  }, [weeklyPlan, firebaseUser]);

  // ── Мутации ────────────────────────────────────────────────────────────────

  const addRecipeToPlanner = (dateKey, category, recipeIdOrRecipe, variantKey = null) => {
    const recipe   = typeof recipeIdOrRecipe === 'object'
      ? recipeIdOrRecipe
      : allRecipes.find(r => r.id === recipeIdOrRecipe);
    const recipeId = typeof recipeIdOrRecipe === 'object'
      ? recipeIdOrRecipe.id
      : recipeIdOrRecipe;

    if (recipe && recipe.variants && recipe.variants.length > 0 && !variantKey) {
      onVariantRequired?.(recipe, (selectedVariantKey) => {
        addRecipeToPlanner(dateKey, category, recipeId, selectedVariantKey);
      });
      return;
    }

    setWeeklyPlan(prev => {
      const dayPlan   = prev[dateKey] || { breakfast: [], lunch: [], snack: [], dinner: [] };
      const planEntry = { recipeId, variantKey };
      return { ...prev, [dateKey]: { ...dayPlan, [category]: [...(dayPlan[category] || []), planEntry] } };
    });
  };

  const removeRecipeFromPlanner = (dateKey, category, index) => {
    setWeeklyPlan(prev => {
      const dayPlan = prev[dateKey];
      if (!dayPlan) return prev;
      const newItems = [...(dayPlan[category] || [])];
      newItems.splice(index, 1);
      return { ...prev, [dateKey]: { ...dayPlan, [category]: newItems } };
    });
  };

  // ── Геттеры ────────────────────────────────────────────────────────────────

  const getPlannerRecipes = (dateKey, category) => {
    const dayPlan = weeklyPlan[dateKey];
    if (!dayPlan) return [];
    return (dayPlan[category] || []).map(entry => {
      const recipeId  = typeof entry === 'object' ? entry.recipeId  : entry;
      const variantKey = typeof entry === 'object' ? entry.variantKey : null;
      const recipe    = allRecipes.find(r => r.id == recipeId);
      return recipe ? { ...recipe, selectedVariantKey: variantKey } : null;
    }).filter(Boolean);
  };

  const calculatePlannerDayCalories = (dateKey) => {
    const dayPlan = weeklyPlan[dateKey];
    if (!dayPlan) return 0;
    let total = 0;
    MEAL_CATEGORIES.forEach(cat => {
      getPlannerRecipes(dateKey, cat).forEach(r => {
        if (r.selectedVariantKey && r.variants) {
          const variant = r.variants.find(v => v.key === r.selectedVariantKey);
          if (variant) {
            total += variant.caloriesPerServing || variant.calories || r.caloriesPerServing || r.calories || 0;
            return;
          }
        }
        total += r.caloriesPerServing || r.calories || 0;
      });
    });
    return total;
  };

  return {
    weeklyPlan,
    setWeeklyPlan,
    plannerWeekDate,
    setPlannerWeekDate,
    showPlannerModal,
    setShowPlannerModal,
    plannerModalDate,
    setPlannerModalDate,
    plannerModalCategory,
    setPlannerModalCategory,
    addRecipeToPlanner,
    removeRecipeFromPlanner,
    getPlannerRecipes,
    calculatePlannerDayCalories,
  };
}
