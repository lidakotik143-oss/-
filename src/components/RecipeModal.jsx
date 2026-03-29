import React, { useState } from 'react';
import { FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import { getTimeCategory, DISH_TYPE_LABELS, normalize } from '../utils/constants';
import { MEAL_CATEGORIES } from '../utils/constants';
import { useApp } from '../context/AppContext';
import { deleteRecipe } from '../firebase.js';
import StepTimer from './StepTimer';

export default function RecipeModal({ 
  recipe,
  variantKey,
  setVariantKey,
  onClose,
  registered,
  allergyList,
  addMealToHistory,
  language,
  theme,
  fontSize,
  MEAL_LABELS,
  onEditRecipe,
}) {
  if (!recipe) return null;

  const { firebaseUser } = useApp();
  const [deleting, setDeleting] = useState(false);

  const t = (ru, en) => (language === "ru" ? ru : en);

  const isMyRecipe = firebaseUser?.uid && String(recipe.authorId) === String(firebaseUser.uid);

  const variants = Array.isArray(recipe.variants) ? recipe.variants : [];
  const activeVariant = variants.length
    ? (variants.find(v => v.key === variantKey) || variants[0])
    : null;
  const activeRecipe = activeVariant || recipe;

  const timeInfo = getTimeCategory(activeRecipe.time ?? recipe.time);
  const timeMinutes = parseInt(activeRecipe.time ?? recipe.time, 10);
  const progressPercentage = Math.min((timeMinutes / 120) * 100, 100);

  const kcalPerServing = activeRecipe.caloriesPerServing ?? recipe.caloriesPerServing ?? activeRecipe.calories ?? recipe.calories;
  const servings = recipe.servings ?? 2;

  const dishTypeInfo = DISH_TYPE_LABELS[normalize(recipe.type)];
  const dishTypeLabel = dishTypeInfo?.[language] || recipe.type;
  const dishTypeColor = dishTypeInfo?.color || "bg-gray-500";

  const handleDelete = async () => {
    if (!window.confirm(t(`Удалить рецепт "${recipe.title}"?`, `Delete "${recipe.title}"?`))) return;
    setDeleting(true);
    try {
      await deleteRecipe(recipe.id, firebaseUser.uid);
      onClose();
    } catch {
      alert(t('Ошибка удаления', 'Delete error'));
      setDeleting(false);
    }
  };

  const formatIngredient = (ing) => {
    if (typeof ing === 'string') return ing;
    const name = ing.name || '';
    const qty  = ing.quantity ? String(ing.quantity).trim() : '';
    const unit = ing.unit ? ing.unit.trim() : '';
    if (!qty) return name;
    if (unit) return `${name} - ${qty} ${unit}`;
    return `${name} - ${qty} ${t('g', 'g')}`;
  };

  const normalizeStep = (step) => {
    if (typeof step === 'object' && step !== null) {
      return {
        text: step.text || '',
        image: step.image || '',
        timerMinutes: step.timerMinutes || null,
      };
    }
    return { text: step || '', image: '', timerMinutes: null };
  };

  const recipeImage = recipe.image || recipe.imageUrl || '';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className={`${theme.cardBg} ${fontSize.body} rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6`} onClick={(e) => e.stopPropagation()}>
        
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className={`${fontSize.subheading} font-bold ${theme.headerText}`}>{recipe.title}</h2>
            {recipe.type && (
              <span className={`${dishTypeColor} text-white px-3 py-1 rounded-full ${fontSize.tiny} font-semibold inline-block mt-2`}>
                {dishTypeLabel}
              </span>
            )}
            {variants.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {variants.map(v => {
                  const isActive = v.key === activeVariant?.key;
                  return (
                    <button
                      key={v.key}
                      onClick={() => setVariantKey(v.key)}
                      className={`px-3 py-1 rounded-full ${fontSize.small} transition ${isActive ? `${theme.accent} text-white` : `${theme.cardBg} border ${theme.border}`}`}
                    >
                      {language === "ru" ? (v.labelRu || v.key) : (v.labelEn || v.key)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 ml-4">
            {isMyRecipe && onEditRecipe && (
              <button
                onClick={() => { onClose(); onEditRecipe(recipe); }}
                className="p-2 rounded-full text-blue-400 hover:text-blue-600 hover:bg-blue-50 transition"
                title={t('Редактировать', 'Edit')}
              >
                <FaEdit size={18} />
              </button>
            )}
            {isMyRecipe && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className={`p-2 rounded-full text-red-400 hover:text-red-600 hover:bg-red-50 transition ${deleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={t('Удалить', 'Delete')}
              >
                <FaTrash size={18} />
              </button>
            )}
            <button onClick={onClose} className={`${theme.textSecondary} hover:${theme.text} transition`}>
              <FaTimes size={24} />
            </button>
          </div>
        </div>

        {recipeImage && (
          <div className="mb-5">
            <img
              src={recipeImage}
              alt={recipe.title}
              className={`w-full rounded-2xl border ${theme.border}`}
              style={{ maxHeight: '320px', objectFit: 'cover' }}
            />
          </div>
        )}

        <div className={`${theme.cardBg} border-2 rounded-xl p-4 mb-6 shadow-md`} style={{ borderColor: timeInfo.color }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{timeInfo.emoji}</span>
              <div>
                <div className={`${fontSize.body} font-bold`} style={{ color: timeInfo.color }}>
                  {timeMinutes} {t("минут", "minutes")}
                </div>
                <div className={`${fontSize.small} ${theme.textSecondary}`}>
                  {language === "ru" ? timeInfo.label_ru : timeInfo.label_en}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`${fontSize.tiny} ${theme.textSecondary} mb-1`}>{t("Калорий (на порцию)", "Calories (per serving)")}</div>
              <div className={`${fontSize.body} font-bold ${theme.accentText}`}>{kcalPerServing} {t("ккал", "kcal")}</div>
              <div className={`${fontSize.tiny} ${theme.textSecondary} mt-1`}>{t("Порций:", "Servings:")} {servings}</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div 
              className="h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercentage}%`, backgroundColor: timeInfo.color }}
            />
          </div>
          <div className={`${fontSize.tiny} ${theme.textSecondary} text-center`}>
            {t(
              timeMinutes <= 15 ? 'Быстрое приготовление!' : timeMinutes <= 40 ? 'Умеренное время' : 'Требуется терпение',
              timeMinutes <= 15 ? 'Quick cooking!' : timeMinutes <= 40 ? 'Moderate time' : 'Takes patience'
            )}
          </div>
        </div>

        <div className={`${theme.textSecondary} ${fontSize.small} mb-4`}>
          {t("Сложность:", "Difficulty:")} {recipe.difficulty}
        </div>

        <div className="mb-6">
          <h3 className={`${fontSize.cardTitle} font-semibold mb-2 ${theme.headerText}`}>{t("Ингредиенты:", "Ingredients:")}</h3>
          <ul className={`list-disc list-inside space-y-1 ${fontSize.body}`}>
            {(activeRecipe.ingredients || []).map((ing, i) => {
              const name = typeof ing === 'object' ? (ing.name || '') : ing;
              const low  = (name || '').toLowerCase();
              const isAllergy = allergyList.some(a => a && low.includes(a));
              return (
                <li key={i} className={isAllergy ? 'text-red-600 font-semibold' : ''}>
                  {formatIngredient(ing)}
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h3 className={`${fontSize.cardTitle} font-semibold mb-3 ${theme.headerText}`}>{t("Как готовить:", "How to cook:")}</h3>
          <ol className={`space-y-4 ${fontSize.body}`}>
            {(activeRecipe.instructions || []).map((rawStep, i) => {
              const step = normalizeStep(rawStep);
              const stepMins = step.timerMinutes ? parseInt(step.timerMinutes, 10) : 0;
              return (
                <li key={i} className={`rounded-xl border ${theme.border} p-3 flex flex-col gap-2`}>
                  <div className="flex gap-3">
                    <span className={`${theme.accent} text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 ${fontSize.small} font-bold mt-0.5`}>{i + 1}</span>
                    <span>{step.text}</span>
                  </div>
                  {stepMins > 0 && (
                    <div className="pl-9">
                      <StepTimer
                        minutes={stepMins}
                        stepText={step.text}
                        stepIndex={i}
                        theme={theme}
                        fontSize={fontSize}
                        t={t}
                      />
                    </div>
                  )}
                  {step.image && (
                    <img
                      src={step.image}
                      alt={`Шаг ${i + 1}`}
                      className={`rounded-xl border ${theme.border} w-full ml-9`}
                      style={{ maxHeight: '260px', objectFit: 'contain' }}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        {(recipe.tags || []).length > 0 && (
          <div className="mt-6 flex gap-2 flex-wrap">
            {recipe.tags.map((tag, i) => (
              <span key={i} className={`px-3 py-1 ${theme.accent} text-white rounded-full ${fontSize.small}`}>{tag}</span>
            ))}
          </div>
        )}

        {registered && (
          <div className="mt-6 border-t pt-4">
            <h4 className={`${fontSize.body} font-semibold mb-3`}>{t("Добавить в историю питания:", "Add to meal history:")}</h4>
            <div className="flex gap-2 flex-wrap">
              {MEAL_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => { addMealToHistory(recipe, cat); onClose(); }}
                  className={`px-3 py-1 rounded ${fontSize.small} ${theme.accent} ${theme.accentHover} text-white`}
                >
                  {MEAL_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
