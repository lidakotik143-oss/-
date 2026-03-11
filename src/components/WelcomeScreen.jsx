import React from 'react';
import { FaUtensils, FaUserPlus, FaSignInAlt } from 'react-icons/fa';

export default function WelcomeScreen({ theme, fontSize, language, onLogin, onRegister }) {
  const t = (ru, en) => (language === 'ru' ? ru : en);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        {/* Лого и название */}
        <div className="text-center">
          <div className={`w-20 h-20 rounded-3xl ${theme.accent} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
            <FaUtensils className="text-white w-10 h-10" />
          </div>
          <h1 className={`${fontSize.heading} font-bold ${theme.headerText}`}>Cookify</h1>
          <p className={`${theme.textSecondary} ${fontSize.body} mt-2`}>
            {t('Персональный помощник по питанию с ИИ', 'AI-powered personal nutrition assistant')}
          </p>
        </div>

        {/* Кнопки */}
        <div className={`${theme.cardBg} rounded-2xl shadow-xl p-8 space-y-4`}>
          <h2 className={`${fontSize.subheading} font-semibold ${theme.text} text-center mb-2`}>
            {t('Добро пожаловать!', 'Welcome!')}
          </h2>
          <p className={`${theme.textSecondary} ${fontSize.small} text-center mb-4`}>
            {t(
              'Войдите в аккаунт или создайте новый для доступа к персональным рекомендациям.',
              'Sign in or create a new account to access personalized recommendations.'
            )}
          </p>

          <button
            onClick={onLogin}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl ${theme.accent} ${theme.accentHover} text-white font-semibold ${fontSize.body} transition shadow`}
          >
            <FaSignInAlt className="w-5 h-5" />
            {t('Войти в аккаунт', 'Sign In')}
          </button>

          <button
            onClick={onRegister}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl border-2 ${theme.border} ${theme.text} font-semibold ${fontSize.body} transition hover:shadow`}
          >
            <FaUserPlus className="w-5 h-5" />
            {t('Зарегистрироваться', 'Register')}
          </button>
        </div>

        <p className={`text-center ${theme.textSecondary} ${fontSize.tiny}`}>
          {t('Интерактивная имитация приложения', 'Interactive app simulation')}
        </p>
      </div>
    </div>
  );
}
