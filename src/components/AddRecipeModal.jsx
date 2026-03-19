import React, { useState } from 'react';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { addRecipe } from '../firebase.js';

const TYPES = ['завтрак', 'обед', 'ужин', 'перекус', 'десерт'];
const DIETS = ['', 'веган', 'вегетарианское', 'низкокалорийное'];
const DIFFICULTIES = ['легкий', 'средний', 'сложный'];
const CUISINES = ['русская', 'итальянская', 'китайская', 'японская', 'французская', 'американская', 'индийская', 'мексиканская', 'другая'];

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
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: 'г' }]);
  const [instructions, setInstructions] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field, val) => setForm(p => ({ ...p, [field]: val }));

  const addIngredient = () => setIngredients(p => [...p, { name: '', quantity: '', unit: 'г' }]);
  const removeIngredient = (i) => setIngredients(p => p.filter((_, idx) => idx !== i));
  const setIngredient = (i, field, val) => setIngredients(p => p.map((ing, idx) => idx === i ? { ...ing, [field]: val } : ing));

  const addStep = () => setInstructions(p => [...p, '']);
  const removeStep = (i) => setInstructions(p => p.filter((_, idx) => idx !== i));
  const setStep = (i, val) => setInstructions(p => p.map((s, idx) => idx === i ? val : s));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError(t('Введите название', 'Enter a title')); return; }
    if (ingredients.filter(i => i.name.trim()).length === 0) { setError(t('Добавьте хотя бы один ингредиент', 'Add at least one ingredient')); return; }
    if (instructions.filter(s => s.trim()).length === 0) { setError(t('Добавьте хотя бы один шаг', 'Add at least one step')); return; }
    setLoading(true);
    setError('');
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
        ingredients: ingredients.filter(i => i.name.trim()).map(i => ({ name: i.name.trim(), quantity: i.quantity, unit: i.unit, productId: null })),
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
        {/* Шапка */}
        <div className={`flex items-center justify-between p-5 border-b ${theme.border}`}>
          <h2 className={`${fontSize.subheading} font-bold ${theme.headerText}`}>
            {t('Добавить рецепт', 'Add Recipe')}
          </h2>
          <button onClick={onClose} className={`${theme.textSecondary} hover:${theme.text} transition`}><FaTimes size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">

          {/* Основная информация */}
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
              <label className={`${fontSize.body} font-semibold ${theme.headerText}`}>{t('Ингредиенты*', 'Ingredients*')}</label>
              <button type="button" onClick={addIngredient} className={`flex items-center gap-1 px-3 py-1 rounded-lg ${theme.accent} text-white ${fontSize.small}`}>
                <FaPlus size={11} /> {t('Добавить', 'Add')}
              </button>
            </div>
            <div className="space-y-2">
              {ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input value={ing.name} onChange={e => setIngredient(i, 'name', e.target.value)} placeholder={t('Название', 'Name')} className={`${inputCls} flex-1`} />
                  <input value={ing.quantity} onChange={e => setIngredient(i, 'quantity', e.target.value)} placeholder={t('Кол-во', 'Qty')} className={`${inputCls} w-20`} />
                  <input value={ing.unit} onChange={e => setIngredient(i, 'unit', e.target.value)} placeholder="г" className={`${inputCls} w-16`} />
                  {ingredients.length > 1 && (
                    <button type="button" onClick={() => removeIngredient(i)} className="text-red-400 hover:text-red-600 transition flex-shrink-0">
                      <FaTrash size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Инструкции */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`${fontSize.body} font-semibold ${theme.headerText}`}>{t('Шаги приготовления*', 'Steps*')}</label>
              <button type="button" onClick={addStep} className={`flex items-center gap-1 px-3 py-1 rounded-lg ${theme.accent} text-white ${fontSize.small}`}>
                <FaPlus size={11} /> {t('Добавить шаг', 'Add step')}
              </button>
            </div>
            <div className="space-y-2">
              {instructions.map((step, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className={`${fontSize.small} ${theme.textSecondary} mt-2 font-semibold w-5 flex-shrink-0`}>{i + 1}.</span>
                  <textarea
                    rows={2}
                    value={step}
                    onChange={e => setStep(i, e.target.value)}
                    placeholder={t('Опишите шаг...', 'Describe the step...')}
                    className={`${inputCls} flex-1 resize-none`}
                  />
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
            <button type="button" onClick={onClose} className={`flex-1 py-3 rounded-xl border ${theme.border} ${theme.text} font-semibold transition hover:opacity-70 ${fontSize.body}`}>
              {t('Отмена', 'Cancel')}
            </button>
            <button type="submit" disabled={loading} className={`flex-1 py-3 rounded-xl ${theme.accent} text-white font-semibold transition hover:opacity-90 ${fontSize.body} ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}>
              {loading ? t('Сохранение...', 'Saving...') : t('Опубликовать', 'Publish')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
