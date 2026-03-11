import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaLeaf } from 'react-icons/fa';

export default function AuthScreen({ onLogin, onRegister, theme, fontSize, language }) {
  const [mode, setMode] = useState('choice'); // 'choice' | 'login' | 'register'
  const [loginForm, setLoginForm] = useState({ login: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ login: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const t = (ru, en) => language === 'ru' ? ru : en;

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    const result = onLogin(loginForm.login.trim(), loginForm.password);
    if (!result.ok) setError(result.message);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    if (registerForm.password !== registerForm.confirmPassword) {
      setError(t('Пароли не совпадают', 'Passwords do not match'));
      return;
    }
    if (registerForm.login.trim().length < 3) {
      setError(t('Логин должен быть не менее 3 символов', 'Login must be at least 3 characters'));
      return;
    }
    if (registerForm.password.length < 4) {
      setError(t('Пароль должен быть не менее 4 символов', 'Password must be at least 4 characters'));
      return;
    }
    const result = onRegister(registerForm.login.trim(), registerForm.password);
    if (!result.ok) setError(result.message);
  };

  return (
    <div className="min-h-screen bg-[#FEFAE0] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Лого */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#606C38] mb-4">
            <FaLeaf className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl font-bold text-[#283618]">Cookify</h1>
          <p className="text-[#606C38] mt-1 text-sm">{t('Персонализированное питание', 'Personalized Nutrition')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">

          {/* Выбор: войти или зарегистрироваться */}
          {mode === 'choice' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#283618] text-center mb-6">
                {t('Добро пожаловать!', 'Welcome!')}
              </h2>
              <button
                onClick={() => { setMode('login'); setError(''); }}
                className="w-full py-3 px-6 rounded-xl bg-[#606C38] hover:bg-[#283618] text-white font-semibold text-base transition"
              >
                {t('Войти в аккаунт', 'Sign In')}
              </button>
              <button
                onClick={() => { setMode('register'); setError(''); }}
                className="w-full py-3 px-6 rounded-xl border-2 border-[#606C38] text-[#606C38] hover:bg-[#FEFAE0] font-semibold text-base transition"
              >
                {t('Зарегистрироваться', 'Create Account')}
              </button>
            </div>
          )}

          {/* Форма входа */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <h2 className="text-xl font-semibold text-[#283618] text-center mb-6">
                {t('Вход в аккаунт', 'Sign In')}
              </h2>

              <div>
                <label className="block text-sm font-medium text-[#606C38] mb-1">{t('Логин', 'Login')}</label>
                <input
                  type="text"
                  required
                  value={loginForm.login}
                  onChange={e => setLoginForm(p => ({ ...p, login: e.target.value }))}
                  placeholder={t('Введите логин', 'Enter login')}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DDA15E] bg-white text-[#283618] placeholder-[#606C38] placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-[#606C38]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#606C38] mb-1">{t('Пароль', 'Password')}</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={loginForm.password}
                    onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                    placeholder={t('Введите пароль', 'Enter password')}
                    className="w-full px-4 py-2.5 pr-10 rounded-xl border border-[#DDA15E] bg-white text-[#283618] placeholder-[#606C38] placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-[#606C38]"
                  />
                  <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#606C38]">
                    {showPass ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <button type="submit" className="w-full py-3 rounded-xl bg-[#606C38] hover:bg-[#283618] text-white font-semibold transition">
                {t('Войти', 'Sign In')}
              </button>

              <p className="text-center text-sm text-[#606C38] mt-2">
                {t('Нет аккаунта?', "Don't have an account?")}{' '}
                <button type="button" onClick={() => { setMode('register'); setError(''); }} className="font-semibold underline">
                  {t('Зарегистрироваться', 'Register')}
                </button>
              </p>
              <button type="button" onClick={() => { setMode('choice'); setError(''); }} className="w-full text-center text-sm text-[#606C38] opacity-60 hover:opacity-100 transition mt-1">
                ← {t('Назад', 'Back')}
              </button>
            </form>
          )}

          {/* Форма регистрации */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <h2 className="text-xl font-semibold text-[#283618] text-center mb-6">
                {t('Создать аккаунт', 'Create Account')}
              </h2>

              <div>
                <label className="block text-sm font-medium text-[#606C38] mb-1">{t('Логин', 'Login')}</label>
                <input
                  type="text"
                  required
                  value={registerForm.login}
                  onChange={e => setRegisterForm(p => ({ ...p, login: e.target.value }))}
                  placeholder={t('Придумайте логин', 'Choose a login')}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DDA15E] bg-white text-[#283618] placeholder-[#606C38] placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-[#606C38]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#606C38] mb-1">{t('Пароль', 'Password')}</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={registerForm.password}
                    onChange={e => setRegisterForm(p => ({ ...p, password: e.target.value }))}
                    placeholder={t('Придумайте пароль (мин. 4 символа)', 'Choose password (min. 4 chars)')}
                    className="w-full px-4 py-2.5 pr-10 rounded-xl border border-[#DDA15E] bg-white text-[#283618] placeholder-[#606C38] placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-[#606C38]"
                  />
                  <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#606C38]">
                    {showPass ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#606C38] mb-1">{t('Повторите пароль', 'Confirm Password')}</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={registerForm.confirmPassword}
                  onChange={e => setRegisterForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder={t('Повторите пароль', 'Repeat password')}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DDA15E] bg-white text-[#283618] placeholder-[#606C38] placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-[#606C38]"
                />
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <button type="submit" className="w-full py-3 rounded-xl bg-[#606C38] hover:bg-[#283618] text-white font-semibold transition">
                {t('Зарегистрироваться', 'Register')}
              </button>

              <p className="text-center text-sm text-[#606C38] mt-2">
                {t('Уже есть аккаунт?', 'Already have an account?')}{' '}
                <button type="button" onClick={() => { setMode('login'); setError(''); }} className="font-semibold underline">
                  {t('Войти', 'Sign In')}
                </button>
              </p>
              <button type="button" onClick={() => { setMode('choice'); setError(''); }} className="w-full text-center text-sm text-[#606C38] opacity-60 hover:opacity-100 transition mt-1">
                ← {t('Назад', 'Back')}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
