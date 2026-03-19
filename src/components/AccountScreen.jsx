import React, { useState } from "react";
import { FaCalendarAlt, FaUtensils, FaShoppingCart, FaTint, FaEye, FaEyeSlash, FaLeaf } from "react-icons/fa";
import { auth } from '../firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setUserProfile } from '../firebase.js';
import ProfileCard from "./account/ProfileCard";
import ProfileEditForm from "./account/ProfileEditForm";
import CustomizationPanel from "./account/CustomizationPanel";
import AddMealModal from "./account/AddMealModal";
import PlannerModal from "./account/PlannerModal";
import HistoryTab from "./account/HistoryTab";
import PlannerTab from "./account/PlannerTab";
import ShoppingListTab from "./account/ShoppingListTab";
import WaterTracker from "./WaterTracker";

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
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError(t('Пароли не совпадают', 'Passwords do not match')); return; }
    if (password.length < 6) { setError(t('Пароль мин. 6 символов', 'Password min 6 characters')); return; }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await setUserProfile(cred.user.uid, { email: cred.user.email, login: cred.user.email, createdAt: new Date().toISOString() });
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const inputCls = `w-full px-4 py-2.5 rounded-xl border ${theme.border} ${theme.input} focus:outline-none focus:ring-2 focus:ring-[#606C38] ${fontSize.body}`;
  const btnPrimary = `w-full py-3 rounded-xl ${theme.accent} ${theme.accentHover} text-white font-semibold transition ${fontSize.body} ${loading ? 'opacity-60 cursor-not-allowed' : ''}`;
  const btnOutline = `w-full py-3 rounded-xl border-2 ${theme.border} ${theme.text} font-semibold transition hover:opacity-80 ${fontSize.body}`;

  return (
    <div className={`${theme.cardBg} p-8 rounded-xl shadow max-w-md mx-auto`}>
      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${theme.accent} mb-3`}>
          <FaLeaf className="text-white text-2xl" />
        </div>
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
              <button type="button" onClick={() => setShowPass(p => !p)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme.textSecondary}`}>{showPass ? <FaEyeSlash /> : <FaEye />}</button>
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
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder={t('Мин. 6 символов', 'Min 6 characters')} className={`${inputCls} pr-10`} />
              <button type="button" onClick={() => setShowPass(p => !p)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme.textSecondary}`}>{showPass ? <FaEyeSlash /> : <FaEye />}</button>
            </div>
          </div>
          <div>
            <label className={`block ${fontSize.small} font-medium ${theme.textSecondary} mb-1`}>{t('Повторите пароль', 'Confirm Password')}</label>
            <input type={showPass ? 'text' : 'password'} required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder={t('Повторите пароль', 'Repeat password')} className={inputCls} />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" disabled={loading} className={btnPrimary}>{loading ? t('Регистрация...', 'Registering...') : t('Зарегистрироваться', 'Create Account')}</button>
          <p className={`text-center ${fontSize.small} ${theme.textSecondary}`}>
            {t('Уже есть аккаунт?', 'Already have an account?')}{' '}
            <button type="button" onClick={() => { setMode('login'); setError(''); }} className="font-semibold underline">{t('Войти', 'Sign In')}</button>
          </p>
          <button type="button" onClick={() => { setMode('choice'); setError(''); }} className={`w-full text-center ${fontSize.small} ${theme.textSecondary} opacity-60 hover:opacity-100 transition`}>← {t('Назад', 'Back')}</button>
        </form>
      )}
    </div>
  );
}

export default function AccountScreen(props) {
  const {
    t, theme, fontSize, registered, setShowRegisterForm, accountTab, setAccountTab,
    showRegisterForm, setIsEditingProfile, showAddMealModal, setShowAddMealModal,
    showPlannerModal, setShowPlannerModal, language, userData,
    setUserData, setRegistered, setMealHistory, setWeeklyPlan, setShoppingList
  } = props;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {!registered ? (
        <FirebaseAuthPanel t={t} theme={theme} fontSize={fontSize} language={language} />
      ) : (
        <>
          <ProfileCard {...props} />
          <div className={`${theme.cardBg} p-3 rounded-xl shadow flex gap-2 overflow-x-auto`}>
            <button onClick={() => setAccountTab("history")} className={`flex-1 min-w-fit px-4 py-2 rounded-xl ${fontSize.small} transition flex items-center justify-center gap-2 ${accountTab === "history" ? `${theme.accent} text-white` : `${theme.border} border`}`}>
              <FaCalendarAlt /> {t("История питания", "Meal history")}
            </button>
            <button onClick={() => setAccountTab("planner")} className={`flex-1 min-w-fit px-4 py-2 rounded-xl ${fontSize.small} transition flex items-center justify-center gap-2 ${accountTab === "planner" ? `${theme.accent} text-white` : `${theme.border} border`}`}>
              <FaUtensils /> {t("План меню", "Menu plan")}
            </button>
            <button onClick={() => setAccountTab("shopping")} className={`flex-1 min-w-fit px-4 py-2 rounded-xl ${fontSize.small} transition flex items-center justify-center gap-2 ${accountTab === "shopping" ? `${theme.accent} text-white` : `${theme.border} border`}`}>
              <FaShoppingCart /> {t("Покупки", "Shopping")}
            </button>
            <button onClick={() => setAccountTab("water")} className={`flex-1 min-w-fit px-4 py-2 rounded-xl ${fontSize.small} transition flex items-center justify-center gap-2 ${accountTab === "water" ? `${theme.accent} text-white` : `${theme.border} border`}`}>
              <FaTint /> {t("Вода", "Water")}
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
        <ProfileEditForm {...props} onClose={() => { setShowRegisterForm(false); setIsEditingProfile(false); }} />
      )}
      {showAddMealModal && <AddMealModal {...props} onClose={() => setShowAddMealModal(false)} />}
      {showPlannerModal && <PlannerModal {...props} onClose={() => setShowPlannerModal(false)} />}
    </div>
  );
}
