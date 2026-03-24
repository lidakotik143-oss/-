import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaPlus, FaTrash, FaSearch } from 'react-icons/fa';
import { addRecipe } from '../firebase.js';
import { PRODUCTS_BY_NAME } from '../data/productsNutritionById.js';

const TYPES = ['завтрак', 'обед', 'ужин', 'перекус', 'десерт'];
const DIETS = ['', 'веган', 'вегетарианское', 'низкокалорийное'];
const DIFFICULTIES = ['легкий', 'средний', 'сложный'];
const CUISINES = ['русская', 'итальянская', 'китайская', 'японская', 'французская', 'американская', 'индийская', 'мексиканская', 'другая'];

// Единицы измерения — опциональные
const UNITS = [
  { value: '', label_ru: '— без единицы', label_en: '— no unit' },
  { value: 'шт', label_ru: 'шт (штук)', label_en: 'pcs' },
  { value: 'пучок', label_ru: 'пучок', label_en: 'bunch' },
  { value: 'пачка', label_ru: 'пачка', label_en: 'pack' },
  { value: 'стакан', label_ru: 'стакан', label_en: 'cup' },
  { value: 'ст.л', label_ru: 'ст.л (столовая ложка)', label_en: 'tbsp' },
  { value: 'ч.л', label_ru: 'ч.л (чайная ложка)', label_en: 'tsp' },
  { value: 'мл', label_ru: 'мл', label_en: 'ml' },
  { value: 'кг', label_ru: 'кг', label_en: 'kg' },
  { value: 'щепотка', label_ru: 'щепотка', label_en: 'pinch' },
  { value: 'ломтик', label_ru: 'ломтик', label_en: 'slice' },
  { value: 'капля', label_ru: 'капля', label_en: 'drop' },
];

// Компонент одной строки ингредиента
function IngredientRow({ ing, idx, onChange, onRemove, canRemove, theme, fontSize, language }) {
  const t = (ru, en) => language === 'ru' ? ru : en;
  const [suggestions, setSuggestions] = useState([]);
  const [showSug, setShowSug]         = useState(false);
  const [autoFilled, setAutoFilled]   = useState(false);
  const nameRef = useRef(null);

  useEffect(() => {
    const q = (ing.name || '').trim().toLowerCase();
    if (!q || q.length < 2 || autoFilled) { setSuggestions([]); return; }
    const matches = Object.keys(PRODUCTS_BY_NAME).filter(k => k.includes(q)).slice(0, 7);
    setSuggestions(matches);
    setShowSug(matches.length > 0);
  }, [ing.name, autoFilled]);

  const selectSuggestion = (key) => {
    const prod = PRODUCTS_BY_NAME[key];
    onChange(idx, 'name', prod.name || key);
    setAutoFilled(true);
    setShowSug(false);
    setSuggestions([]);
    nameRef.current?.focus();
  };

  const inputCls = `w-full px-3 py-2 rounded-xl border ${theme.border} ${theme.input} focus:outline-none focus:ring-2 focus:ring-[#606C38] ${fontSize.small}`;

  return (
    <div className={`rounded-xl border ${theme.border} p-3 space-y-2 relative`}>
      {/* Строка 1: название */}
      <div className="relative">
        <FaSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.textSecondary} pointer-events-none`} size={12} />
        <input
          ref={nameRef}
          value={ing.name}
          onChange={e => { onChange(idx, 'name', e.target.value); setAutoFilled(false); }}
          onFocus={() => suggestions.length > 0 && setShowSug(true)}
          onBlur={() => setTimeout(() => setShowSug(false), 150)}
          placeholder={t('Название ингредиента...', 'Ingredient name...')}
          className={`${inputCls} pl-8`}
        />
        {/* дропдаун */}
        {showSug && suggestions.length > 0 && (
          <ul className={`absolute z-50 left-0 right-0 top-full mt-1 rounded-xl border ${theme.border} ${theme.cardBg} shadow-xl max-h-44 overflow-y-auto`}>
            {suggestions.map(key => (
              <li key={key}>
                <button
                  type="button"
                  onMouseDown={() => selectSuggestion(key)}
                  className={`w-full text-left px-3 py-2 ${fontSize.small} hover:${theme.accent} hover:text-white transition flex items-center justify-between gap-2`}
                >
                  <span>{PRODUCTS_BY_NAME[key].name || key}</span>
                  <span className={`${theme.textSecondary} ${fontSize.tiny} whitespace-nowrap`}>
                    {PRODUCTS_BY_NAME[key].calories} {t('ккал/100г', 'kcal/100g')}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {autoFilled && (
          <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-green-600 ${fontSize.tiny} font-semibold pointer-events-none`}>
            ✅
          </span>
        )}
      </div>

      {/* Строка 2: кол-во в граммах + опцион. единица + удалить */}
      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <input
            type="number" min="0" step="any"
            value={ing.quantity}
            onChange={e => onChange(idx, 'quantity', e.target.value)}
            placeholder={t('Граммы', 'Grams')}
            className={inputCls}
          />
          <span className={`${fontSize.tiny} ${theme.textSecondary} ml-1`}>{t('г', 'g')}</span>
        </div>
        <div className="flex-1">
          <select
            value={ing.unit}
            onChange={e => onChange(idx, 'unit', e.target.value)}
            className={inputCls}
          >
            {UNITS.map(u => (
              <option key={u.value} value={u.value}>
                {language === 'ru' ? u.label_ru : u.label_en}
              </option>
            ))}
          </select>
          <span className={`${fontSize.tiny} ${theme.textSecondary} ml-1`}>{t('ед. изм. (необ.)', 'unit (opt.)')}</span>
        </div>
        {canRemove && (
          <button type="button" onClick={() => onRemove(idx)} className="text-red-400 hover:text-red-600 transition flex-shrink-0 pb-4">
            <FaTrash size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function AddRecipeModal({ onClose, onAdded, theme, fontSize, language, firebaseUser }) {
  const t = (ru, en) => language === 'ru' ? ru : en;

  const [form, setForm] = useState({
    title: '',
    time: '',
    calories: '',
    servings: '2',
    type: 'ужин',
    diet: '',
    cuisine: 'русская',
    difficulty: 'легкий',
    tags: '',
  });
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);
  const [instructions, setInstructions] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field, val) => setForm(p => ({ ...p, [field]: val }));

  const addIngredient    = () => setIngredients(p => [...p, { name: '', quantity: '', unit: '' }]);
  const removeIngredient = (i) => setIngredients(p => p.filter((_, idx) => idx !== i));
  const setIngredient    = (i, field, val) => setIngredients(p => p.map((ing, idx) => idx === i ? { ...ing, [field]: val } : ing));

  const addStep    = () => setInstructions(p => [...p, '']);
  const removeStep = (i) => setInstructions(p => p.filter((_, idx) => idx !== i));
  const setStep    = (i, val) => setInstructions(p => p.map((s, idx) => idx === i ? val : s));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError(t('Введите название', 'Enter a title')); return; }
    if (ingredients.filter(i => i.name.trim()).length === 0) { setError(t('Добавьте хотя бы один ингредиент', 'Add at least one ingredient')); return; }
    if (instructions.filter(s => s.trim()).length === 0) { setError(t('Добавьте хотя бы один шаг', 'Add at least one step')); return; }
    setLoading(true); setError('');
    try {
      const calories = parseInt(form.calories) || 0;
      const recipe = {
        title: form.title.trim(),
        time: form.time || '30',
        calories,
        caloriesPerServing: calories,
        servings: parseInt(form.servings) || 2,
        type: form.type,
        diet: form.diet,
        cuisine: form.cuisine,
        difficulty: form.difficulty,
        tags: form.tags ? form.tags.split(',').map(s => s.trim()).filter(Boolean) : [],
        ingredients: ingredients
          .filter(i => i.name.trim())
          .map(i => ({
            name: i.name.trim(),
            quantity: i.quantity,          // в граммах
            unit: i.unit || 'г',            // если единица не выбрана — по умолчанию 'г'
            productId: null
          })),
        instructions: instructions.filter(s => s.trim()),
        variants: [],
        source: 'user',
      };
      await addRecipe(recipe, firebaseUser);
      onAdded();
      onClose();
    } catch (err) {
      setError(t('Ошибка при сохранении. Попробуйте ещё раз.', 'Save error. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const inputCls = `w-full px-3 py-2 rounded-xl border ${theme.border} ${theme.input} focus:outline-none focus:ring-2 focus:ring-[#606C38] ${fontSize.small}`;
  const labelCls = `block ${fontSize.small} font-medium ${theme.textSecondary} mb-1`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className={`${theme.cardBg} ${theme.text} rounded-2xl w-full max-w-xl my-4 shadow-2xl border ${theme.border}`}>

        <div className={`flex items-center justify-between p-5 border-b ${theme.border}`}>
          <h2 className={`${fontSize.subheading} font-bold ${theme.headerText}`}>
            {t('Добавить рецепт', 'Add Recipe')}
          </h2>
          <button onClick={onClose} className={`${theme.textSecondary} hover:${theme.text} transition`}><FaTimes size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelCls}>{t('Название*', 'Title*')}</label>
              <input required value={form.title} onChange={e => set('title', e.target.value)} placeholder={t('Например: Борщ', 'E.g. Beef Stew')} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{t('Время (мин)', 'Time (min)')}</label>
              <input type="number" min="1" value={form.time} onChange={e => set('time', e.target.value)} placeholder="30" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{t('Калорий на порцию', 'Calories per serving')}</label>
              <input type="number" min="0" value={form.calories} onChange={e => set('calories', e.target.value)} placeholder="300" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{t('Порций', 'Servings')}</label>
              <input type="number" min="1" value={form.servings} onChange={e => set('servings', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{t('Тип блюда', 'Meal type')}</label>
              <select value={form.type} onChange={e => set('type', e.target.value)} className={inputCls}>
                {TYPES.map(tp => <option key={tp} value={tp}>{tp}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>{t('Диета', 'Diet')}</label>
              <select value={form.diet} onChange={e => set('diet', e.target.value)} className={inputCls}>
                {DIETS.map(d => <option key={d} value={d}>{d || t('Не указано', 'None')}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>{t('Кухня', 'Cuisine')}</label>
              <select value={form.cuisine} onChange={e => set('cuisine', e.target.value)} className={inputCls}>
                {CUISINES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>{t('Сложность', 'Difficulty')}</label>
              <select value={form.difficulty} onChange={e => set('difficulty', e.target.value)} className={inputCls}>
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>{t('Теги (через запятую)', 'Tags (comma separated)')}</label>
              <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder={t('быстро, популярное', 'quick, popular')} className={inputCls} />
            </div>
          </div>

          {/* Ингредиенты */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`${fontSize.body} font-semibold ${theme.headerText}`}>
                {t('Ингредиенты*', 'Ingredients*')}
              </label>
              <button type="button" onClick={addIngredient}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg ${theme.accent} text-white ${fontSize.small}`}>
                <FaPlus size={11} /> {t('Добавить', 'Add')}
              </button>
            </div>
            <p className={`${fontSize.tiny} ${theme.textSecondary} mb-3`}>
              {t(
                'Введите название — подходящие будут предложены автоматически. Количество — всегда в граммах; единица измерения — по желанию.',
                'Type a name — suggestions appear automatically. Quantity is always in grams; unit is optional.'
              )}
            </p>
            <div className="space-y-3">
              {ingredients.map((ing, i) => (
                <IngredientRow
                  key={i}
                  ing={ing}
                  idx={i}
                  onChange={setIngredient}
                  onRemove={removeIngredient}
                  canRemove={ingredients.length > 1}
                  theme={theme}
                  fontSize={fontSize}
                  language={language}
                />
              ))}
            </div>
          </div>

          {/* Шаги */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`${fontSize.body} font-semibold ${theme.headerText}`}>{t('Шаги приготовления*', 'Steps*')}</label>
              <button type="button" onClick={addStep}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg ${theme.accent} text-white ${fontSize.small}`}>
                <FaPlus size={11} /> {t('Добавить шаг', 'Add step')}
              </button>
            </div>
            <div className="space-y-2">
              {instructions.map((step, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className={`${fontSize.small} ${theme.textSecondary} mt-2 font-semibold w-5 flex-shrink-0`}>{i + 1}.</span>
                  <textarea rows={2} value={step} onChange={e => setStep(i, e.target.value)}
                    placeholder={t('Опишите шаг...', 'Describe the step...')}
                    className={`${inputCls} flex-1 resize-none`} />
                  {instructions.length > 1 && (
                    <button type="button" onClick={() => removeStep(i)} className="text-red-400 hover:text-red-600 transition flex-shrink-0 mt-2">
                      <FaTrash size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className={`flex-1 py-3 rounded-xl border ${theme.border} ${theme.text} font-semibold transition hover:opacity-70 ${fontSize.body}`}>
              {t('Отмена', 'Cancel')}
            </button>
            <button type="submit" disabled={loading}
              className={`flex-1 py-3 rounded-xl ${theme.accent} text-white font-semibold transition hover:opacity-90 ${fontSize.body} ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}>
              {loading ? t('Сохранение...', 'Saving...') : t('Опубликовать', 'Publish')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
