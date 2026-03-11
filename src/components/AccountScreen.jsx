import React, { useState } from "react";
import { FaUser, FaCalendarAlt, FaUtensils, FaShoppingCart, FaTint, FaEye, FaEyeSlash, FaLeaf } from "react-icons/fa";
import ProfileCard from "./account/ProfileCard";
import ProfileEditForm from "./account/ProfileEditForm";
import CustomizationPanel from "./account/CustomizationPanel";
import AddMealModal from "./account/AddMealModal";
import PlannerModal from "./account/PlannerModal";
import HistoryTab from "./account/HistoryTab";
import PlannerTab from "./account/PlannerTab";
import ShoppingListTab from "./account/ShoppingListTab";
import WaterTracker from "./WaterTracker";

// Мини-компонент аутентификации внутри вкладки
function AuthPanel({ t, theme, fontSize, handleRegister, language }) {
  const [mode, setMode] = useState('choice'); // 'choice' | 'login' | 'register'
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const getAccounts = () => {
    try { return JSON.parse(localStorage.getItem('cookify_accounts') || '[]'); } catch { return []; }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    const accounts = getAccounts();
    const acc = accounts.find(a => a.login === login.trim() && a.password === password);
    if (!acc) {
      setError(t('Неверный логин или пароль', 'Wrong login or password'));
      return;
    }
    // Передаём через синтетический submit event
    const fakeForm = document.createElement('form');
    const fakeData = { name: acc.name || acc.login, login: acc.login };
    Object.entries(fakeData).forEach(([k, v]) => {
      const input = document.createElement('input');
      input.name = k; input.value = v;
      fakeForm.appendChild(input);
    });
    // Используем handleRegister через прямое сохранение
    const userData = { name: acc.name || acc.login, login: acc.login };
    localStorage.setItem('cookify_user', JSON.stringify(userData));
    window.location.reload();
  };

  const handleReg = (e) => {
    e.preventDefault();
    setError('');
    if (login.trim().length < 3) { setError(t('Логин мин. 3 символа', 'Login min 3 chars')); return; }
    if (password.length < 4) { setError(t('Пароль мин. 4 символа', 'Password min 4 chars')); return; }
    if (password !== confirmPassword) { setError(t('Пароли не совпадают', 'Passwords do not match')); return; }
    const accounts = getAccounts();
    if (accounts.some(a => a.login === login.trim())) { setError(t('Логин уже занят', 'Login already taken')); return; }
    const newUser = { login: login.trim(), password, name: login.trim() };
    const newAccounts = [...accounts, newUser];
    localStorage.setItem('cookify_accounts', JSON.stringify(newAccounts));
    localStorage.setItem('cookify_user', JSON.stringify({ name: newUser.name, login: newUser.login }));
    window.location.reload();
  };

  const inputCls = `w-full px-4 py-2.5 rounded-xl border ${theme.border} ${theme.input} focus:outline-none focus:ring-2 focus:ring-[#606C38] ${fontSize.body}`;
  const btnPrimary = `w-full py-3 rounded-xl ${theme.accent} ${theme.accentHover} text-white font-semibold transition ${fontSize.body}`;
  const btnOutline = `w-full py-3 rounded-xl border-2 ${theme.border} ${theme.text} font-semibold transition hover:opacity-80 ${fontSize.body}`;

  return (
    <div className={`${theme.cardBg} p-8 rounded-xl shadow max-w-md mx-auto`}>
      {/* Лого */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${theme.accent} mb-3`}>
          <FaLeaf className="text-white text-2xl" />
        </div>
        <h2 className={`${fontSize.subheading} font-bold ${theme.headerText}`}>
          {mode === 'choice' ? t('Мой аккаунт', 'My Account')
            : mode === 'login' ? t('Вход в аккаунт', 'Sign In')
            : t('Регистрация', 'Register')}
        </h2>
      </div>

      {/* Выбор */}
      {mode === 'choice' && (
        <div className="space-y-3">
          <button onClick={() => { setMode('login'); setError(''); }} className={btnPrimary}>
            {t('Войти в аккаунт', 'Sign In')}
          </button>
          <button onClick={() => { setMode('register'); setError(''); }} className={btnOutline}>
            {t('Зарегистрироваться', 'Create Account')}
          </button>
        </div>
      )}

      {/* Форма входа */}
      {mode === 'login' && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className={`block ${fontSize.small} font-medium ${theme.textSecondary} mb-1`}>{t('Логин', 'Login')}</label>
            <input type="text" required value={login} onChange={e => setLogin(e.target.value)}
              placeholder={t('Введите логин', 'Enter login')} className={inputCls} />
          </div>
          <div>
            <label className={`block ${fontSize.small} font-medium ${theme.textSecondary} mb-1`}>{t('Пароль', 'Password')}</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                placeholder={t('Введите пароль', 'Enter password')} className={`${inputCls} pr-10`} />
              <button type="button" onClick={() => setShowPass(p => !p)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme.textSecondary}`}>
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" className={btnPrimary}>{t('Войти', 'Sign In')}</button>
          <p className={`text-center ${fontSize.small} ${theme.textSecondary}`}>
            {t('Нет аккаунта?', "Don't have an account?")}{' '}
            <button type="button" onClick={() => { setMode('register'); setError(''); }} className="font-semibold underline">
              {t('Зарегистрироваться', 'Register')}
            </button>
          </p>
          <button type="button" onClick={() => { setMode('choice'); setError(''); }} className={`w-full text-center ${fontSize.small} ${theme.textSecondary} opacity-60 hover:opacity-100 transition`}>
            ← {t('Назад', 'Back')}
          </button>
        </form>
      )}

      {/* Форма регистрации */}
      {mode === 'register' && (
        <form onSubmit={handleReg} className="space-y-4">
          <div>
            <label className={`block ${fontSize.small} font-medium ${theme.textSecondary} mb-1`}>{t('Логин', 'Login')}</label>
            <input type="text" required value={login} onChange={e => setLogin(e.target.value)}
              placeholder={t('Придумайте логин', 'Choose a login')} className={inputCls} />
          </div>
          <div>
            <label className={`block ${fontSize.small} font-medium ${theme.textSecondary} mb-1`}>{t('Пароль', 'Password')}</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                placeholder={t('Мин. 4 символа', 'Min 4 chars')} className={`${inputCls} pr-10`} />
              <button type="button" onClick={() => setShowPass(p => !p)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme.textSecondary}`}>
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div>
            <label className={`block ${fontSize.small} font-medium ${theme.textSecondary} mb-1`}>{t('Повторите пароль', 'Confirm Password')}</label>
            <input type={showPass ? 'text' : 'password'} required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              placeholder={t('Повторите пароль', 'Repeat password')} className={inputCls} />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" className={btnPrimary}>{t('Зарегистрироваться', 'Register')}
          </button>
          <p className={`text-center ${fontSize.small} ${theme.textSecondary}`}>
            {t('Уже есть аккаунт?', 'Already have an account?')}{' '}
            <button type="button" onClick={() => { setMode('login'); setError(''); }} className="font-semibold underline">
              {t('Войти', 'Sign In')}
            </button>
          </p>
          <button type="button" onClick={() => { setMode('choice'); setError(''); }} className={`w-full text-center ${fontSize.small} ${theme.textSecondary} opacity-60 hover:opacity-100 transition`}>
            ← {t('Назад', 'Back')}
          </button>
        </form>
      )}
    </div>
  );
}

export default function AccountScreen(props) {
  const {
    t,
    theme,
    fontSize,
    registered,
    setShowRegisterForm,
    accountTab,
    setAccountTab,
    showRegisterForm,
    setIsEditingProfile,
    showAddMealModal,
    setShowAddMealModal,
    showPlannerModal,
    setShowPlannerModal,
    language,
    userData,
    handleRegister
  } = props;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {!registered ? (
        <AuthPanel
          t={t}
          theme={theme}
          fontSize={fontSize}
          handleRegister={handleRegister}
          language={language}
        />
      ) : (
        <>
          <ProfileCard {...props} />

          {/* Табы: История / План меню / Список покупок / Трекер воды */}
          <div className={`${theme.cardBg} p-3 rounded-xl shadow flex gap-2 overflow-x-auto`}>
            <button
              onClick={() => setAccountTab("history")}
              className={`flex-1 min-w-fit px-4 py-2 rounded-xl ${fontSize.small} transition flex items-center justify-center gap-2 ${accountTab === "history" ? `${theme.accent} text-white` : `${theme.border} border`}`}
            >
              <FaCalendarAlt />
              {t("История питания", "Meal history")}
            </button>
            <button
              onClick={() => setAccountTab("planner")}
              className={`flex-1 min-w-fit px-4 py-2 rounded-xl ${fontSize.small} transition flex items-center justify-center gap-2 ${accountTab === "planner" ? `${theme.accent} text-white` : `${theme.border} border`}`}
            >
              <FaUtensils />
              {t("План меню", "Menu plan")}
            </button>
            <button
              onClick={() => setAccountTab("shopping")}
              className={`flex-1 min-w-fit px-4 py-2 rounded-xl ${fontSize.small} transition flex items-center justify-center gap-2 ${accountTab === "shopping" ? `${theme.accent} text-white` : `${theme.border} border`}`}
            >
              <FaShoppingCart />
              {t("Покупки", "Shopping")}
            </button>
            <button
              onClick={() => setAccountTab("water")}
              className={`flex-1 min-w-fit px-4 py-2 rounded-xl ${fontSize.small} transition flex items-center justify-center gap-2 ${accountTab === "water" ? `${theme.accent} text-white` : `${theme.border} border`}`}
            >
              <FaTint />
              {t("Вода", "Water")}
            </button>
          </div>

          {accountTab === "history" && <HistoryTab {...props} />}
          {accountTab === "planner" && <PlannerTab {...props} />}
          {accountTab === "shopping" && <ShoppingListTab {...props} />}
          {accountTab === "water" && <WaterTracker theme={theme} fontSize={fontSize} language={language} userData={userData} />}

          <CustomizationPanel {...props} />
        </>
      )}

      {showRegisterForm && (
        <ProfileEditForm
          {...props}
          onClose={() => {
            setShowRegisterForm(false);
            setIsEditingProfile(false);
          }}
        />
      )}

      {showAddMealModal && (
        <AddMealModal
          {...props}
          onClose={() => setShowAddMealModal(false)}
        />
      )}

      {showPlannerModal && (
        <PlannerModal
          {...props}
          onClose={() => setShowPlannerModal(false)}
        />
      )}
    </div>
  );
}
