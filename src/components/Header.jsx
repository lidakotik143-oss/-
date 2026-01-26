import React from 'react';
import { FaUser, FaSearch, FaClipboardList } from 'react-icons/fa';

export default function Header({ 
  activeScreen, 
  setActiveScreen, 
  language, 
  setLanguage,
  theme,
  fontSize 
}) {
  const t = (ru, en) => (language === "ru" ? ru : en);

  return (
    <header className={`sticky top-0 z-50 ${theme.bg} max-w-6xl mx-auto flex items-center justify-between mb-6 py-4`}>
      <div>
        <h1 className={`${fontSize.heading} font-bold ${theme.headerText}`}>Cookify</h1>
        <p className={`${fontSize.small} ${theme.textSecondary}`}>
          {t("Интерактивная имитация приложения", "Interactive demo")}
        </p>
      </div>

      <div className="flex gap-3 items-center">
        <nav className="flex gap-3">
          <button
            onClick={() => setActiveScreen("home")}
            className={`px-3 py-2 rounded ${fontSize.small} transition ${activeScreen === "home" ? `${theme.accent} ${theme.accentHover} text-white` : `${theme.cardBg} shadow-sm`}`}
          >
            {t("Главная", "Home")}
          </button>

          <button
            onClick={() => setActiveScreen("search")}
            className={`px-3 py-2 rounded ${fontSize.small} transition ${activeScreen === "search" ? `${theme.accent} ${theme.accentHover} text-white` : `${theme.cardBg} shadow-sm`}`}
          >
            {t("Поиск", "Search")}
          </button>

          <button
            onClick={() => setActiveScreen("account")}
            className={`px-3 py-2 rounded ${fontSize.small} transition ${activeScreen === "account" ? `${theme.accent} ${theme.accentHover} text-white` : `${theme.cardBg} shadow-sm`}`}
          >
            {t("Мой аккаунт", "My Account")}
          </button>
        </nav>
      </div>
    </header>
  );
}