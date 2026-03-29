import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaSearch, FaUtensils } from 'react-icons/fa';
import { deleteRecipe, getRecipes } from '../../firebase.js';
import { useApp } from '../../context/AppContext';
import AddRecipeModal from '../AddRecipeModal';

const RECIPE_PLACEHOLDER = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120&h=80&fit=crop&auto=format';

export default function MyRecipesTab() {
  const { t, theme, fontSize, language, firebaseUser, getDishTypeInfo, setSelectedRecipe, setSelectedRecipeVariantKey } = useApp();

  const [myRecipes, setMyRecipes]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [deletingId, setDeletingId]   = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [search, setSearch]           = useState('');

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

  // После сохранения перезагружаем список чтобы отобразить изменения
  const handleAdded = () => {
    loadMyRecipes();
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

      {/* Используем единый AddRecipeModal с editingRecipe пропом — как из поиска */}
      {editingRecipe && (
        <AddRecipeModal
          editingRecipe={editingRecipe}
          onClose={() => setEditingRecipe(null)}
          onAdded={handleAdded}
          theme={theme}
          fontSize={fontSize}
          language={language}
          firebaseUser={firebaseUser}
        />
      )}
    </div>
  );
}
