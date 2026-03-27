import React, { useState, useEffect, useRef } from 'react';
import { FaTrash, FaEdit, FaTimes, FaSearch, FaUtensils, FaPlus } from 'react-icons/fa';
import { deleteRecipe, getRecipes, db } from '../../firebase.js';
import { doc, updateDoc } from 'firebase/firestore';
import { useApp } from '../../context/AppContext';
import { PRODUCTS_BY_NAME } from '../../data/productsNutritionById.js';

const RECIPE_PLACEHOLDER = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120&h=80&fit=crop&auto=format';

const TYPES        = ['завтрак', 'обед', 'ужин', 'перекус', 'десерт'];
const DIETS        = ['', 'веган', 'вегетарианское', 'низкокалорийное'];
const DIFFICULTIES = ['легкий', 'средний', 'сложный'];
const CUISINES     = ['русская', 'итальянская', 'китайская', 'японская', 'французская', 'американская', 'индийская', 'мексиканская', 'другая'];
const UNITS = [
  { value: '',         label_ru: '— без единицы',          label_en: '— no unit' },
  { value: 'шт',       label_ru: 'шт (штук)',               label_en: 'pcs' },
  { value: 'пучок',    label_ru: 'пучок',                   label_en: 'bunch' },
  { value: 'пачка',    label_ru: 'пачка',                   label_en: 'pack' },
  { value: 'стакан',   label_ru: 'стакан',                  label_en: 'cup' },
  { value: 'ст.л',     label_ru: 'ст.л (столовая ложка)',   label_en: 'tbsp' },
  { value: 'ч.л',      label_ru: 'ч.л (чайная ложка)',      label_en: 'tsp' },
  { value: 'мл',       label_ru: 'мл',                      label_en: 'ml' },
  { value: 'кг',       label_ru: 'кг',                      label_en: 'kg' },
  { value: 'щепотка',  label_ru: 'щепотка',                 label_en: 'pinch' },
  { value: 'ломтик',   label_ru: 'ломтик',                  label_en: 'slice' },
  { value: 'капля',    label_ru: 'капля',                   label_en: 'drop' },
];

// ── IngredientRow (идентично AddRecipeModal) ─────────────────────────────────
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
        {showSug && suggestions.length > 0 && (
          <ul className={`absolute z-50 left-0 right-0 top-full mt-1 rounded-xl border ${theme.border} ${theme.cardBg} shadow-xl max-h-44 overflow-y-auto`}>
            {suggestions.map(key => (
              <li key={key}>
                <button type="button" onMouseDown={() => selectSuggestion(key)}
                  className={`w-full text-left px-3 py-2 ${fontSize.small} hover:${theme.accent} hover:text-white transition flex items-center justify-between gap-2`}>
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
          <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-green-600 ${fontSize.tiny} font-semibold pointer-events-none`}>✅</span>
        )}
      </div>
      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <input type="number" min="0" step="any"
            value={ing.quantity}
            onChange={e => onChange(idx, 'quantity', e.target.value)}
            placeholder={t('Граммы', 'Grams')}
            className={inputCls} />
          <span className={`${fontSize.tiny} ${theme.textSecondary} ml-1`}>{t('г', 'g')}</span>
        </div>
        <div className="flex-1">
          <select value={ing.unit} onChange={e => onChange(idx, 'unit', e.target.value)} className={inputCls}>
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

// ── EditRecipeModal (все поля как в AddRecipeModal) ───────────────────────────
function EditRecipeModal({ recipe, theme, fontSize, language, onClose, onSaved }) {
  const t = (ru, en) => language === 'ru' ? ru : en;

  // Парсим ингредиенты из формата объектов в массив { name, quantity, unit }
  const parseIngredients = (raw) => {
    if (!raw || raw.length === 0) return [{ name: '', quantity: '', unit: '' }];
    return raw.map(ing => {
      if (typeof ing === 'object') return { name: ing.name || '', quantity: ing.quantity || '', unit: ing.unit || '' };
      return { name: ing, quantity: '', unit: '' };
    });
  };

  const [form, setForm] = useState({
    title:      recipe.title      || '',
    time:       recipe.time       || '',
    calories:   recipe.caloriesPerServing ?? recipe.calories ?? '',
    servings:   recipe.servings   || '2',
    type:       recipe.type       || 'ужин',
    diet:       recipe.diet       || '',
    cuisine:    recipe.cuisine    || 'русская',
    difficulty: recipe.difficulty || 'легкий',
    tags:       (recipe.tags || []).join(', '),
  });
  const [ingredients, setIngredients] = useState(() => parseIngredients(recipe.ingredients));
  const [instructions, setInstructions] = useState(
    recipe.instructions?.length ? recipe.instructions : ['']
  );
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');

  const set = (field, val) => setForm(p => ({ ...p, [field]: val }));

  const addIngredient    = () => setIngredients(p => [...p, { name: '', quantity: '', unit: '' }]);
  const removeIngredient = (i) => setIngredients(p => p.filter((_, idx) => idx !== i));
  const setIngredient    = (i, field, val) => setIngredients(p => p.map((ing, idx) => idx === i ? { ...ing, [field]: val } : ing));

  const addStep    = () => setInstructions(p => [...p, '']);
  const removeStep = (i) => setInstructions(p => p.filter((_, idx) => idx !== i));
  const setStep    = (i, val) => setInstructions(p => p.map((s, idx) => idx === i ? val : s));

  const handleSave = async () => {
    if (!form.title.trim()) { setError(t('Введите название', 'Enter title')); return; }
    if (ingredients.filter(i => i.name.trim()).length === 0) { setError(t('Добавьте хотя бы один ингредиент', 'Add at least one ingredient')); return; }
    if (instructions.filter(s => s.trim()).length === 0) { setError(t('Добавьте хотя бы один шаг', 'Add at least one step')); return; }
    setSaving(true); setError('');
    try {
      const ref = doc(db, 'recipes', recipe.id);
      const updatedData = {
        title:            form.title.trim(),
        time:             form.time || '30',
        calories:         Number(form.calories) || 0,
        caloriesPerServing: Number(form.calories) || 0,
        servings:         parseInt(form.servings) || 2,
        type:             form.type,
        diet:             form.diet,
        cuisine:          form.cuisine,
        difficulty:       form.difficulty,
        tags:             form.tags ? form.tags.split(',').map(s => s.trim()).filter(Boolean) : [],
        ingredients:      ingredients
          .filter(i => i.name.trim())
          .map(i => ({ name: i.name.trim(), quantity: i.quantity, unit: i.unit || 'г', productId: null })),
        instructions:     instructions.filter(s => s.trim()),
        updatedAt:        new Date().toISOString(),
      };
      await updateDoc(ref, updatedData);
      onSaved({ ...recipe, ...updatedData });
    } catch {
      setError(t('Ошибка при сохранении', 'Save error'));
    } finally {
      setSaving(false);
    }
  };

  const inputCls = `w-full px-3 py-2 rounded-xl border ${theme.border} ${theme.input} focus:outline-none focus:ring-2 focus:ring-[#606C38] ${fontSize.small}`;
  const labelCls = `block ${fontSize.small} font-medium ${theme.textSecondary} mb-1`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-start justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
      <div className={`${theme.cardBg} ${theme.text} rounded-2xl w-full max-w-xl my-4 shadow-2xl border ${theme.border}`} onClick={e => e.stopPropagation()}>

        <div className={`flex items-center justify-between p-5 border-b ${theme.border}`}>
          <h2 className={`${fontSize.subheading} font-bold ${theme.headerText}`}>
            {t('Редактировать рецепт', 'Edit Recipe')}
          </h2>
          <button onClick={onClose} className={`${theme.textSecondary} hover:${theme.text} transition`}><FaTimes size={20} /></button>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelCls}>{t('Название*', 'Title*')}</label>
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder={t('Например: Борщ', 'E.g. Beef Stew')} className={inputCls} />
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
                  key={i} ing={ing} idx={i}
                  onChange={setIngredient} onRemove={removeIngredient}
                  canRemove={ingredients.length > 1}
                  theme={theme} fontSize={fontSize} language={language}
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
            <button onClick={onClose}
              className={`flex-1 py-3 rounded-xl border ${theme.border} ${theme.text} font-semibold transition hover:opacity-70 ${fontSize.body}`}>
              {t('Отмена', 'Cancel')}
            </button>
            <button onClick={handleSave} disabled={saving}
              className={`flex-1 py-3 rounded-xl ${theme.accent} text-white font-semibold transition hover:opacity-90 ${fontSize.body} ${saving ? 'opacity-60 cursor-not-allowed' : ''}`}>
              {saving ? t('Сохранение...', 'Saving...') : t('Сохранить', 'Save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Основная вкладка ──────────────────────────────────────────────────────────
export default function MyRecipesTab() {
  const { t, theme, fontSize, language, firebaseUser, getDishTypeInfo, setSelectedRecipe, setSelectedRecipeVariantKey } = useApp();

  const [myRecipes, setMyRecipes] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [search, setSearch] = useState('');

  const loadMyRecipes = () => {
    if (!firebaseUser?.uid) return;
    setLoading(true);
    getRecipes()
      .then(all => setMyRecipes(all.filter(r => String(r.authorId) === String(firebaseUser.uid))))
      .catch(() => setMyRecipes([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadMyRecipes(); }, [firebaseUser?.uid]);

  const handleDelete = async (e, recipe) => {
    e.stopPropagation();
    if (!window.confirm(t(`Удалить рецепт «${recipe.title}»?`, `Delete "${recipe.title}"?`))) return;
    setDeletingId(recipe.id);
    try {
      await deleteRecipe(recipe.id, firebaseUser.uid);
      setMyRecipes(prev => prev.filter(r => r.id !== recipe.id));
    } catch {
      alert(t('Ошибка при удалении', 'Delete error'));
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaved = (updated) => {
    setMyRecipes(prev => prev.map(r => r.id === updated.id ? updated : r));
    setEditingRecipe(null);
  };

  const filtered = myRecipes.filter(r =>
    r.title?.toLowerCase().includes(search.toLowerCase()) ||
    (r.tags || []).some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className={`${theme.cardBg} p-8 rounded-2xl shadow text-center`}>
        <p className={`${theme.textSecondary} ${fontSize.body}`}>{t('Загрузка...', 'Loading...')}</p>
      </div>
    );
  }

  if (myRecipes.length === 0) {
    return (
      <div className={`${theme.cardBg} p-10 rounded-2xl shadow text-center`}>
        <FaUtensils className={`mx-auto text-5xl ${theme.textSecondary} mb-4 opacity-30`} />
        <p className={`${fontSize.body} ${theme.textSecondary} mb-1`}>
          {t('Вы ещё не добавляли рецепты', "You haven't added any recipes yet")}
        </p>
        <p className={`${fontSize.small} ${theme.textSecondary} opacity-60`}>
          {t('Добавьте первый рецепт через поиск', 'Add your first recipe via the search screen')}
        </p>
      </div>
    );
  }

  return (
    <div className={`${theme.cardBg} p-4 rounded-2xl shadow`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`${fontSize.subheading} font-semibold`}>{t('Мои рецепты', 'My Recipes')}</h2>
        <span className={`${fontSize.small} ${theme.textSecondary}`}>{filtered.length} {t('рецептов', 'recipes')}</span>
      </div>

      <div className="relative mb-4">
        <FaSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.textSecondary} pointer-events-none`} size={13} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('Поиск по названию или тегу...', 'Search by name or tag...')}
          className={`w-full pl-9 pr-4 py-2 rounded-xl border ${theme.border} ${theme.input} ${fontSize.small} focus:outline-none focus:ring-2 focus:ring-[#606C38]`}
        />
      </div>

      {filtered.length === 0 ? (
        <p className={`${theme.textSecondary} ${fontSize.small} text-center py-6`}>{t('Ничего не найдено', 'Nothing found')}</p>
      ) : (
        <div className="grid gap-3">
          {filtered.map(r => {
            const dishTypeInfo = getDishTypeInfo(r.type);
            const kcal        = r.caloriesPerServing ?? r.calories;
            const imgSrc      = r.image || r.imageUrl || RECIPE_PLACEHOLDER;
            const isDeleting  = deletingId === r.id;
            return (
              <div key={r.id}
                onClick={() => { setSelectedRecipe(r); setSelectedRecipeVariantKey(r?.variants?.[0]?.key || null); }}
                className={`p-4 border ${theme.border} rounded-xl cursor-pointer hover:shadow-lg transition ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <img src={imgSrc} alt={r.title} className="w-20 h-16 object-cover rounded-xl flex-shrink-0 bg-gray-100"
                    onError={e => { e.target.src = RECIPE_PLACEHOLDER; }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className={`${fontSize.cardTitle} font-bold truncate`}>{r.title}</h3>
                        <div className={`${fontSize.small} ${theme.textSecondary} mt-0.5`}>
                          {r.time} {t('мин', 'min')} • {kcal} {t('ккал/порц.', 'kcal/srv')}
                          {r.difficulty && <span> • {r.difficulty}</span>}
                        </div>
                        <div className={`${fontSize.tiny} ${theme.textSecondary} mt-0.5 opacity-60`}>
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString(
                            language === 'ru' ? 'ru-RU' : 'en-US',
                            { day: 'numeric', month: 'long', year: 'numeric' }
                          ) : ''}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {r.type && (
                          <span className={`${dishTypeInfo.color} text-white px-2 py-0.5 rounded-full ${fontSize.tiny} font-semibold hidden sm:inline`}>
                            {dishTypeInfo.label}
                          </span>
                        )}
                        <button onClick={e => { e.stopPropagation(); setEditingRecipe(r); }}
                          className="p-2 rounded-full transition hover:scale-110 text-blue-400 hover:text-blue-600"
                          title={t('Редактировать', 'Edit')}>
                          <FaEdit size={14} />
                        </button>
                        <button onClick={e => handleDelete(e, r)} disabled={isDeleting}
                          className={`p-2 rounded-full transition hover:scale-110 text-red-400 hover:text-red-600 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title={t('Удалить', 'Delete')}>
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                    {(r.tags || []).length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {r.tags.slice(0, 5).map((tag, i) => (
                          <span key={i} className={`px-2 py-0.5 ${theme.accent} text-white rounded-full ${fontSize.tiny}`}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editingRecipe && (
        <EditRecipeModal
          recipe={editingRecipe} theme={theme} fontSize={fontSize} language={language}
          onClose={() => setEditingRecipe(null)} onSaved={handleSaved}
        />
      )}
    </div>
  );
}
