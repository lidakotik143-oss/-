import React from 'react';
import { FaTimes } from 'react-icons/fa';

/**
 * RecipeVariantModal — модалка выбора варианта рецепта.
 *
 * Props:
 *   isOpen      {boolean}  — показывать ли
 *   onClose     {Function} — закрыть без выбора
 *   recipe      {object}   — рецепт с полем variants[]
 *   onSelect    {Function} — колбэк(variantKey)
 *   theme       {object}   — объект темы из THEMES
 *   fontSize    {object}   — объект размеров шрифта из FONT_SIZES
 *   language    {string}   — 'ru' | 'en'
 */
export default function RecipeVariantModal({ isOpen, onClose, recipe, onSelect, theme, fontSize, language }) {
  if (!isOpen || !recipe) return null;

  const title = language === 'ru' ? 'Выберите вариант рецепта' : 'Choose recipe variant';

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className={`${theme.cardBg} ${fontSize.body} rounded-2xl max-w-md w-full p-6`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className={`${fontSize.cardTitle} font-bold ${theme.headerText}`}>{title}</h3>
          <button onClick={onClose} className={`${theme.textSecondary} hover:${theme.text} transition`}>
            <FaTimes size={20} />
          </button>
        </div>

        <p className={`${fontSize.small} ${theme.textSecondary} mb-4`}>{recipe.title}</p>

        <div className="space-y-2">
          {(recipe.variants || []).map((variant) => (
            <button
              key={variant.key}
              onClick={() => onSelect && onSelect(variant.key)}
              className={`w-full p-3 rounded-lg ${theme.accent} ${theme.accentHover} text-white transition ${fontSize.body}`}
            >
              {language === 'ru' ? (variant.labelRu || variant.key) : (variant.labelEn || variant.key)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
