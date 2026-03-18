import React, { useEffect, useState } from 'react';
import { FaUtensils, FaUserPlus, FaSignInAlt, FaDroplet, FaSearch, FaChartPie } from 'react-icons/fa6';

const features = [
  {
    icon: FaSearch,
    ru: 'Тысячи рецептов',
    en: 'Thousands of recipes',
    descRu: 'Найди блюдо по ингредиентам или калориям',
    descEn: 'Find dishes by ingredients or calories',
  },
  {
    icon: FaDroplet,
    ru: 'Трекер воды',
    en: 'Water Tracker',
    descRu: 'Следи за потреблением воды каждый день',
    descEn: 'Track your daily water intake',
  },
  {
    icon: FaChartPie,
    ru: 'Нутриенты',
    en: 'Nutrition',
    descRu: 'Графики КБЖУ и анализ питания',
    descEn: 'Macro charts and nutrition analysis',
  },
];

export default function WelcomeScreen({ theme, fontSize, language, onLogin, onRegister }) {
  const t = (ru, en) => (language === 'ru' ? ru : en);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="min-h-[80vh] flex items-center justify-center px-4"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      <div className="w-full max-w-md space-y-6">

        {/* Hero */}
        <div className="text-center space-y-3">
          <div
            className={`w-24 h-24 rounded-[2rem] ${theme.accent} flex items-center justify-center mx-auto shadow-2xl`}
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
          >
            <FaUtensils className="text-white w-12 h-12" />
          </div>
          <h1 className={`text-4xl font-extrabold tracking-tight ${theme.headerText}`}>
            Cookify
          </h1>
          <p className={`${theme.textSecondary} ${fontSize.body}`}>
            {t(
              'Персональный помощник по питанию с ИИ',
              'Your AI-powered nutrition companion'
            )}
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3">
          {features.map(({ icon: Icon, ru, en, descRu, descEn }, i) => (
            <div
              key={i}
              className={`${theme.cardBg} rounded-2xl p-3 flex flex-col items-center text-center gap-2 shadow`}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(12px)',
                transition: `opacity 0.5s ease ${0.1 + i * 0.1}s, transform 0.5s ease ${0.1 + i * 0.1}s`,
              }}
            >
              <div className={`w-10 h-10 rounded-xl ${theme.accent} flex items-center justify-center`}>
                <Icon className="text-white w-5 h-5" />
              </div>
              <span className={`font-semibold ${theme.text} text-xs leading-tight`}>
                {t(ru, en)}
              </span>
              <span className={`${theme.textSecondary} text-[10px] leading-tight`}>
                {t(descRu, descEn)}
              </span>
            </div>
          ))}
        </div>

        {/* Auth card */}
        <div className={`${theme.cardBg} rounded-2xl shadow-xl p-6 space-y-4`}>
          <div className="text-center">
            <h2 className={`${fontSize.subheading} font-bold ${theme.text}`}>
              {t('Добро пожаловать!', 'Welcome back!')}
            </h2>
            <p className={`${theme.textSecondary} ${fontSize.small} mt-1`}>
              {t(
                'Войдите или создайте аккаунт для персональных рекомендаций',
                'Sign in or register for personalized recommendations'
              )}
            </p>
          </div>

          <button
            onClick={onLogin}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl ${theme.accent} ${theme.accentHover} text-white font-bold ${fontSize.body} transition-all shadow-lg active:scale-95`}
          >
            <FaSignInAlt className="w-5 h-5" />
            {t('Войти в аккаунт', 'Sign In')}
          </button>

          <button
            onClick={onRegister}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl border-2 ${theme.border} ${theme.text} font-bold ${fontSize.body} transition-all hover:shadow active:scale-95`}
          >
            <FaUserPlus className="w-5 h-5" />
            {t('Создать аккаунт', 'Create Account')}
          </button>
        </div>

        <p className={`text-center ${theme.textSecondary} ${fontSize.tiny} pb-2`}>
          {t('Интерактивная имитация приложения', 'Interactive app simulation')}
        </p>
      </div>
    </div>
  );
}
