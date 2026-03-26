import React, { useState } from "react";
import { FaCalendarAlt, FaUtensils, FaShoppingCart, FaTint, FaHeart, FaRegHeart } from "react-icons/fa";
import { auth } from '../firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setUserProfile } from '../firebase.js';
import { useApp } from '../context/AppContext';
import ProfileCard from "./account/ProfileCard";
import ProfileEditForm from "./account/ProfileEditForm";
import CustomizationPanel from "./account/CustomizationPanel";
import AdvancedSettingsPanel from "./account/AdvancedSettingsPanel";
import AddMealModal from "./account/AddMealModal";
import PlannerModal from "./account/PlannerModal";
import HistoryTab from "./account/HistoryTab";
import PlannerTab from "./account/PlannerTab";
import ShoppingListTab from "./account/ShoppingListTab";
import WaterTracker from "./WaterTracker";
import CalorieBalanceWidget from "./account/CalorieBalanceWidget";

const RECIPE_PLACEHOLDER = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120&h=80&fit=crop&auto=format";

function FirebaseAuthPanel({ t, theme, fontSize, language }) {
  const [mode, setMode] = useState('choice');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getErrorMessage = (code) => {
    const errors = {
      'auth/email-already-in-use': t('Такой email уже зарегистрирован', 'This email is already registered'),
      'auth/invalid-email': t('Неверный формат email', 'Invalid email format'),
      'auth/weak-password': t('Пароль должен быть не менее 6 символов', 'Password must be at least 6 characters'),
      'auth/user-not-found': t('Пользователь с таким email не найден', 'No user found with this email'),
      'auth/wrong-password': t('Неверный пароль', 'Wrong password'),
      'auth/invalid-credential': t('Неверный email или пароль', 'Invalid email or password'),
      'auth/too-many-requests': t('Слишком много попыток. Попробуйте позже', 'Too many attempts. Try again later'),
    };
    return errors[code] || t('Произошла ошибка. Попробуйте ещё раз', 'An error occurred. Please try again');
  };

  const handleLogin = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await signInWithEmailAndPassword(auth, email.trim(), password); }
    catch (err) { setError(getErrorMessage(err.code)); }
    finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault(); setError('');
    if (password !== confirmPassword) { setError(t('Пароли не совпадают', 'Passwords do not match')); return; }
    if (password.length < 6) { setError(t('Пароль мин. 6 символов', 'Password min 6 characters')); return; }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await setUserProfile(cred.user.uid, { email: cred.user.email, login: cred.user.email, createdAt: new Date().toISOString() });
    } catch (err) { setError(getErrorMessage(err.code)); }
    finally { setLoading(false); }
  };

  const inputCls   = `w-full px-4 py-2.5 rounded-xl border ${theme.border} ${theme.input} focus:outline-none focus:ring-2 focus:ring-[#606C38] ${fontSize.body}`;
  const btnPrimary = `w-full py-3 rounded-xl ${theme.accent} ${theme.accentHover} text-white font-semibold transition ${fontSize.body} ${loading ? 'opacity-60 cursor-not-allowed' : ''}`;
  const btnOutline = `w-full py-3 rounded-xl border-2 ${theme.border} ${theme.text} font-semibold transition hover:opacity-80 ${fontSize.body}`;

  return (
    <div className={`${theme.cardBg} p-8 rounded-xl shadow max-w-md mx-auto`}>
      <div className="text-center mb-6">
        <h2 className={`${fontSize.subheading} font-bold ${theme.headerText}`}>
          {mode === 'choice' ? t('Мой аккаунт', 'My Account')
            : mode === 'login' ? t('Вход в аккаунт', 'Sign In')
            : t('Регистрация', 'Create Account')}
        </h2>
      </div>
      {mode === 'choice' && (
        <div className="space-y-3">
          <button onClick={() => { setMode('login'); setError(''); }} className={btnPrimary}>{t('Войти в аккаунт', 'Sign In')}</button>
          <button onClick={() => { setMode('register'); setError(''); }} className={btnOutline}>{t('Зарегистрироваться', 'Create Account')}</button>
        </div>
      )}
      {mode === 'login' && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className={`block ${fontSize.small} font-medium ${theme.textSecondary} mb-1`}>Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="example@mail.com" className={inputCls} />
          </div>
          <div>
            <label className={`block ${fontSize.small} font-medium ${theme.textSecondary} mb-1`}>{t('Пароль', 'Password')}</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder={t('Введите пароль', 'Enter password')} className={`${inputCls} pr-10`} />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" disabled={loading} className={btnPrimary}>{loading ? t('Вход...', 'Signing in...') : t('Войти', 'Sign In')}</button>
          <p className={`text-center ${fontSize.small} ${theme.textSecondary}`}>
            {t('Нет аккаунта?', "Don't have an account?")}{' '}
            <button type="button" onClick={() => { setMode('register'); setError(''); }} className="font-semibold underline">{t('Зарегистрироваться', 'Register')}</button>
          </p>
          <button type="button" onClick={() => { setMode('choice'); setError(''); }} className={`w-full text-center ${fontSize.small} ${theme.textSecondary} opacity-60 hover:opacity-100 transition`}>← {t('Назад', 'Back')}</button>
        </form>
      )}
      {mode === 'register' && (
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className={`block ${fontSize.small} font-medium ${theme.textSecondary} mb-1`}>Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="example@mail.com" className={inputCls} />
          </div>
          <div>
            <label className={`block ${fontSize.small} font-medium ${theme.textSecondary} mb-1`}>{t('Пароль', 'Password')}</label>
            <input type={showPass ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder={t('Мин. 6 символов', 'Min 6 characters')} className={inputCls} />
          </div>
          <div>
            <label className={`block ${fontSize.small} font-medium ${theme.textSecondary} mb-1`}>{t('Повторите пароль', 'Confirm Password')}</label>
            <input type={showPass ? 'text' : 'password'} required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder={t('Повторите пароль', 'Repeat password')} className={inputCls} />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" disabled={loading} className={btnPrimary}>{loading ? t('Регистрация...', 'Registering...') : t('Зарегистрироваться', 'Create Account')}</button>
          <button type="button" onClick={() => { setMode('choice'); setError(''); }} className={`w-full text-center ${fontSize.small} ${theme.textSecondary} opacity-60 hover:opacity-100 transition`}>← {t('Назад', 'Back')}</button>
        </form>
      )}
    </div>
  );
}

function FavoritesTab() {
  const {
    t, theme, fontSize, language,
    allRecipes,
    favorites, isFavorite, toggleFav,
    setSelectedRecipe, setSelectedRecipeVariantKey,
    getDishTypeInfo,
  } = useApp();

  const favoriteRecipes = (allRecipes || []).filter(r => isFavorite(r.id));

  if (favoriteRecipes.length === 0) {
    return (
      <div className={`${theme.cardBg} p-8 rounded-2xl shadow text-center`}>
        <FaRegHeart className={`mx-auto text-4xl ${theme.textSecondary} mb-3 opacity-40`} />
        <p className={`${fontSize.body} ${theme.textSecondary}`}>
          {t('Здесь будут ваши избранные рецепты', 'Your favourite recipes will appear here')}
        </p>
      </div>
    );
  }

  return (
    <div className={`${theme.cardBg} p-4 rounded-2xl shadow`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`${fontSize.subheading} font-semibold`}>{t('Избранное', 'Favorites')}</h2>
        <span className={`${fontSize.small} ${theme.textSecondary}`}>{favoriteRecipes.length} {t('рецептов', 'recipes')}</span>
      </div>
      <div className="grid gap-3">
        {favoriteRecipes.map(r => {
          const dishTypeInfo = getDishTypeInfo(r.type);
          const kcal = r.caloriesPerServing ?? r.calories;
          const imgSrc = r.image || r.imageUrl || RECIPE_PLACEHOLDER;
          const fav = isFavorite(r.id);
          return (
            <div key={r.id}
              onClick={() => { setSelectedRecipe(r); setSelectedRecipeVariantKey(r?.variants?.[0]?.key || null); }}
              className={`p-4 ${theme.border} border rounded-xl cursor-pointer hover:shadow-lg transition`}>
              <div className="flex items-start gap-4">
                <img src={imgSrc} alt={r.title} className="w-20 h-16 object-cover rounded-xl flex-shrink-0 bg-gray-100" onError={(e) => { e.target.src = RECIPE_PLACEHOLDER; }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className={`${fontSize.cardTitle} font-bold`}>{r.title}</h3>
                      <div className={`${fontSize.small} ${theme.textSecondary} mt-1`}>{r.time} {t('мин', 'min')} • {kcal} {t('ккал/порц.', 'kcal/srv')}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {r.type && <span className={`${dishTypeInfo.color} text-white px-3 py-1 rounded-full ${fontSize.tiny} font-semibold`}>{dishTypeInfo.label}</span>}
                      <button onClick={(e) => { e.stopPropagation(); toggleFav(r.id); }} className={`p-2 rounded-full transition hover:scale-110 ${fav ? 'text-red-500' : theme.textSecondary}`}>
                        {fav ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(r.tags || []).slice(0, 4).map((tag, i) => (<span key={i} className={`px-2 py-1 ${theme.accent} text-white rounded-full ${fontSize.tiny}`}>{tag}</span>))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AccountScreen(props) {
  const {
    t, theme, fontSize, registered, setShowRegisterForm, accountTab, setAccountTab,
    showRegisterForm, setIsEditingProfile, showAddMealModal, setShowAddMealModal,
    showPlannerModal, setShowPlannerModal, language, userData,
  } = props;

  const { featureFlags } = useApp();

  // Вкладки, отфильтрованные по флагам
  const allTabs = [
    featureFlags.showHistoryTab  && { id: "history",   icon: <FaCalendarAlt />, label: t("История питания", "Meal history") },
    featureFlags.showPlannerTab  && { id: "planner",   icon: <FaUtensils />,    label: t("План меню", "Menu plan") },
    featureFlags.showShoppingTab && { id: "shopping",  icon: <FaShoppingCart />,label: t("Покупки", "Shopping") },
    featureFlags.showFavoritesTab&& { id: "favorites", icon: <FaHeart />,       label: t("Избранное", "Favorites") },
    featureFlags.showWaterTracker&& { id: "water",     icon: <FaTint />,        label: t("Вода", "Water") },
  ].filter(Boolean);

  // Если текущая вкладка выключена, переключаемся на первую доступную
  const activeTab = allTabs.find(t => t.id === accountTab)?.id || allTabs[0]?.id || "history";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {!registered ? (
        <FirebaseAuthPanel t={t} theme={theme} fontSize={fontSize} language={language} />
      ) : (
        <>
          <ProfileCard {...props} />

          {/* ✨ Виджет баланса калорий */}
          {featureFlags.showCalorieBalance && <CalorieBalanceWidget />}

          {/* Вкладки */}
          {allTabs.length > 0 && (
            <div className={`${theme.cardBg} p-3 rounded-xl shadow flex gap-2 overflow-x-auto`}>
              {allTabs.map(tab => (
                <button key={tab.id} onClick={() => setAccountTab(tab.id)}
                  className={`flex-1 min-w-fit px-4 py-2 rounded-xl ${fontSize.small} transition flex items-center justify-center gap-2 ${
                    activeTab === tab.id ? `${theme.accent} text-white` : `${theme.border} border`
                  }`}>
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          )}

          {activeTab === "history"   && featureFlags.showHistoryTab   && <HistoryTab {...props} />}
          {activeTab === "planner"   && featureFlags.showPlannerTab   && <PlannerTab {...props} />}
          {activeTab === "shopping"  && featureFlags.showShoppingTab  && <ShoppingListTab {...props} />}
          {activeTab === "favorites" && featureFlags.showFavoritesTab && <FavoritesTab />}
          {activeTab === "water"     && featureFlags.showWaterTracker && <WaterTracker theme={theme} fontSize={fontSize} language={language} userData={userData} />}

          <CustomizationPanel {...props} />
          <AdvancedSettingsPanel />
        </>
      )}

      {showRegisterForm && (
        <ProfileEditForm {...props} onClose={() => { setShowRegisterForm(false); setIsEditingProfile(false); }} />
      )}
      {showAddMealModal  && <AddMealModal  {...props} onClose={() => setShowAddMealModal(false)} />}
      {showPlannerModal  && <PlannerModal  {...props} onClose={() => setShowPlannerModal(false)} />}
    </div>
  );
}
