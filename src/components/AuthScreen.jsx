import React, { useState } from 'react';
import { FaUtensils, FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function AuthScreen({ theme, fontSize, language, onLogin, onGoRegister }) {
  const t = (ru, en) => (language === 'ru' ? ru : en);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!login.trim() || !password.trim()) {
      setError(t('Заполните логин и пароль', 'Enter login and password'));
      return;
    }
    const result = onLogin(login.trim(), password);
    if (!result) {
      setError(t('Неверный логин или пароль', 'Invalid login or password'));
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className={`${theme.cardBg} rounded-2xl shadow-xl p-8 w-full max-w-md`}>
        {/* Лого */}
        <div className="text-center mb-8">
          <div className={`w-16 h-16 rounded-2xl ${theme.accent} flex items-center justify-center mx-auto mb-3`}>
            <FaUtensils className="text-white w-8 h-8" />
          </div>
          <h1 className={`${fontSize.heading} font-bold ${theme.headerText}`}>Cookify</h1>
          <p className={`${theme.textSecondary} ${fontSize.small} mt-1`}>
            {t('Ваш персональный помощник по питанию', 'Your personal nutrition assistant')}
          </p>
        </div>

        <h2 className={`${fontSize.subheading} font-semibold ${theme.text} mb-6 text-center`}>
          {t('Вход в аккаунт', 'Sign In')}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`${fontSize.small} ${theme.textSecondary} block mb-1`}>
              {t('Логин', 'Login')}
            </label>
            <div className="relative">
              <FaUser className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.textSecondary}`} />
              <input
                type="text"
                value={login}
                onChange={e => { setLogin(e.target.value); setError(''); }}
                placeholder={t('Ваш логин', 'Your login')}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${theme.input} ${fontSize.body} outline-none focus:ring-2`}
              />
            </div>
          </div>

          <div>
            <label className={`${fontSize.small} ${theme.textSecondary} block mb-1`}>
              {t('Пароль', 'Password')}
            </label>
            <div className="relative">
              <FaLock className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.textSecondary}`} />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder={t('Ваш пароль', 'Your password')}
                className={`w-full pl-10 pr-10 py-3 rounded-xl border ${theme.input} ${fontSize.body} outline-none focus:ring-2`}
              />
              <button type="button" onClick={() => setShowPass(p => !p)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme.textSecondary}`}>
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && (
            <p className={`text-red-500 ${fontSize.small} text-center`}>{error}</p>
          )}

          <button
            type="submit"
            className={`w-full py-3 rounded-xl ${theme.accent} ${theme.accentHover} text-white font-semibold ${fontSize.body} transition`}
          >
            {t('Войти', 'Sign In')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className={`${theme.textSecondary} ${fontSize.small}`}>
            {t('Ещё нет аккаунта?', 'No account yet?')}
          </p>
          <button
            onClick={onGoRegister}
            className={`mt-2 ${fontSize.body} font-semibold ${theme.accentText} hover:underline transition`}
          >
            {t('Зарегистрироваться', 'Register')}
          </button>
        </div>
      </div>
    </div>
  );
}
