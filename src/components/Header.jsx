import React from 'react';
import { FaHome, FaSearch, FaUser } from 'react-icons/fa';

export default function Header({ 
  activeScreen, 
  setActiveScreen, 
  language, 
  setLanguage,
  theme,
  fontSize 
}) {
  const t = (ru, en) => (language === "ru" ? ru : en);

  const navItems = [
    { key: 'home', icon: <FaHome />, labelRu: 'Главная', labelEn: 'Home' },
    { key: 'search', icon: <FaSearch />, labelRu: 'Поиск', labelEn: 'Search' },
    { key: 'account', icon: <FaUser />, labelRu: 'Аккаунт', labelEn: 'Account' },
  ];

  return (
    <header className={`sticky top-0 z-50 ${theme.bg} max-w-6xl mx-auto mb-6 py-4`}>
      <div className="flex items-center justify-between">
        {/* Лого */}
        <div className="min-w-0">
          <h1 className={`${fontSize.heading} font-bold ${theme.headerText} leading-tight`}>Cookify</h1>
          <p className={`${fontSize.small} ${theme.textSecondary} hidden sm:block`}>
            {t("Интерактивная имитация приложения", "Interactive demo")}
          </p>
        </div>

        {/* Навигация */}
        <nav className="flex items-center gap-1 sm:gap-3">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => setActiveScreen(item.key)}
              className={`flex flex-col sm:flex-row items-center gap-1 px-3 py-2 rounded-xl transition ${
                activeScreen === item.key
                  ? `${theme.accent} text-white`
                  : `${theme.cardBg} ${theme.text} shadow-sm hover:opacity-80`
              }`}
            >
              <span className="text-lg sm:text-base">{item.icon}</span>
              <span className={`text-xs sm:${fontSize.small} leading-none`}>
                {t(item.labelRu, item.labelEn)}
              </span>
            </button>
          ))}

          {/* Переключатель языка */}
          <button
            onClick={() => setLanguage(l => l === 'ru' ? 'en' : 'ru')}
            className={`ml-1 sm:ml-2 px-2 py-1.5 rounded-lg ${theme.cardBg} ${theme.text} shadow-sm hover:opacity-80 transition text-xs sm:${fontSize.small} font-semibold border ${theme.border}`}
          >
            {language === 'ru' ? 'EN' : 'RU'}
          </button>
        </nav>
      </div>
    </header>
  );
}
