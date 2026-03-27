import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaTimes, FaSearch, FaUtensils } from 'react-icons/fa';
import { deleteRecipe, getRecipes, db } from '../../firebase.js';
import { doc, updateDoc } from 'firebase/firestore';
import { useApp } from '../../context/AppContext';

const RECIPE_PLACEHOLDER = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120&h=80&fit=crop&auto=format';

const TYPES = ['завтрак', 'обед', 'ужин', 'перекус', 'десерт'];
const DIFFICULTIES = ['легкий', 'средний', 'сложный'];

function EditRecipeModal({ recipe, theme, fontSize, language, onClose, onSaved }) {
  const t = (ru, en) => language === 'ru' ? ru : en;

  const [title, setTitle] = useState(recipe.title || '');
  const [type, setType] = useState(recipe.type || '');
  const [difficulty, setDifficulty] = useState(recipe.difficulty || '');
  const [time, setTime] = useState(recipe.time || '');
  const [calories, setCalories] = useState(recipe.caloriesPerServing ?? recipe.calories ?? '');
  const [tags, setTags] = useState((recipe.tags || []).join(', '));
  const [ingredients, setIngredients] = useState(
    (recipe.ingredients || []).map(ing =>
      typeof ing === 'object' ? `${ing.name}${ing.quantity ? ' — ' + ing.quantity : ''}${ing.unit ? ' ' + ing.unit : ''}` : ing
    ).join('\n')
  );
  const [instructions, setInstructions] = useState((recipe.instructions || []).join('\n'));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const inputCls = `w-full px-3 py-2 rounded-xl border ${theme.border} ${theme.input} focus:outline-none focus:ring-2 focus:ring-[#606C38] ${fontSize.small}`;

  const handleSave = async () => {
    if (!title.trim()) { setError(t('Введите название', 'Enter title')); return; }
    setSaving(true); setError('');
    try {
      const ref = doc(db, 'recipes', recipe.id);
      const updatedData = {
        title: title.trim(),
        type,
        difficulty,
        time: Number(time) || 0,
        caloriesPerServing: Number(calories) || 0,
        calories: Number(calories) || 0,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        ingredients: ingredients.split('\n').map(line => line.trim()).filter(Boolean),
        instructions: instructions.split('\n').map(line => line.trim()).filter(Boolean),
        updatedAt: new Date().toISOString(),
      };
      await updateDoc(ref, updatedData);
      onSaved({ ...recipe, ...updatedData });
    } catch (e) {
      setError(t('Ошибка при сохранении', 'Save error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className={`${theme.cardBg} rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`${fontSize.subheading} font-bold ${theme.headerText}`}>
            {t('Редактировать рецепт', 'Edit recipe')}
          </h2>
          <button onClick={onClose} className={`${theme.textSecondary} hover:${theme.text}`}><FaTimes size={20} /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className={`block ${fontSize.small} font-medium ${theme.textSecondary} mb-1`}>{t('Название *', 'Title *')}</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block ${fontSize.small} font-medium ${theme.textSecondary} mb-1`}>{t('Тип', 'Type')}</label>
              <select value={type} onChange={e => setType(e.target.value)} className={inputCls}>
                <option value="">{t('— выберите —', '— select —')}</option>
                {TYPES.map(tp => <option key={tp} value={tp}>{tp}</option>)}
              </select>
            </div>
            <div>
              <label className={`block ${fontSize.small} font-medium ${theme.textSecondary} mb-1`}>{t('Сложность', 'Difficulty')}</label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className={inputCls}>
                <option value="">{t('— выберите —', '— select —')}</option>
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block ${fontSize.small} font-medium ${theme.textSecondary} mb-1`}>{t('Время (мин)', 'Time (min)')}</label>
              <input type="number" value={time} onChange={e => setTime(e.target.value)} className={inputCls} min="1" />
            </div>
            <div>
              <label className={`block ${fontSize.small} font-medium ${theme.textSecondary} mb-1`}>{t('Ккал/порция', 'Kcal/serving')}</label>
              <input type="number" value={calories} onChange={e => setCalories(e.target.value)} className={inputCls} min="0" />
            </div>
          </div>
          <div>
            <label className={`block ${fontSize.small} font-medium ${theme.textSecondary} mb-1`}>{t('Теги (через запятую)', 'Tags (comma separated)')}</label>
            <input value={tags} onChange={e => setTags(e.target.value)} className={inputCls} placeholder={t('вкусно, быстро', 'tasty, quick')} />
          </div>
          <div>
            <label className={`block ${fontSize.small} font-medium ${theme.textSecondary} mb-1`}>
              {t('Ингредиенты (каждый с новой строки)', 'Ingredients (one per line)')}
            </label>
            <textarea value={ingredients} onChange={e => setIngredients(e.target.value)} rows={5} className={`${inputCls} resize-none`}
              placeholder={t('Мука — 200 г\nЯйца — 2 шт', 'Flour — 200 g\nEggs — 2 pcs')} />
          </div>
          <div>
            <label className={`block ${fontSize.small} font-medium ${theme.textSecondary} mb-1`}>
              {t('Инструкции (каждый шаг с новой строки)', 'Instructions (one step per line)')}
            </label>
            <textarea value={instructions} onChange={e => setInstructions(e.target.value)} rows={5} className={`${inputCls} resize-none`}
              placeholder={t('Смешайте ингредиенты\nВыпекайте 30 минут', 'Mix ingredients\nBake 30 min')} />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className={`flex-1 py-2.5 rounded-xl border ${theme.border} ${theme.text} ${fontSize.small} font-semibold hover:opacity-70 transition`}>
              {t('Отмена', 'Cancel')}
            </button>
            <button onClick={handleSave} disabled={saving}
              className={`flex-1 py-2.5 rounded-xl ${theme.accent} text-white ${fontSize.small} font-semibold hover:opacity-80 transition ${saving ? 'opacity-60 cursor-not-allowed' : ''}`}>
              {saving ? t('Сохранение...', 'Saving...') : t('Сохранить', 'Save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyRecipesTab() {
  const { t, theme, fontSize, language, firebaseUser, getDishTypeInfo, setSelectedRecipe, setSelectedRecipeVariantKey } = useApp();

  const [myRecipes, setMyRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
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
            const kcal = r.caloriesPerServing ?? r.calories;
            const imgSrc = r.image || r.imageUrl || RECIPE_PLACEHOLDER;
            const isDeleting = deletingId === r.id;
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
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
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
