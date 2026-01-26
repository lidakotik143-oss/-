import React from 'react';
import { FaSearch } from 'react-icons/fa';

export default function HomeScreen({ 
  userData, 
  language, 
  setLanguage,
  setActiveScreen,
  theme,
  fontSize 
}) {
  const t = (ru, en) => (language === "ru" ? ru : en);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className={`${theme.cardBg} p-6 rounded-xl shadow`}>
        <div className="flex items-center justify-between mb-3">
          <h2 className={`${fontSize.subheading} font-semibold ${theme.headerText}`}>
            {t("Добро пожаловать, ", "Welcome, ")}{userData?.name || t("Пользователь", "User")}!
          </h2>
          
          <div className="flex gap-2">
            <button
              onClick={() => setLanguage("ru")}
              className={`px-3 py-1 rounded transition ${fontSize.small} ${language === "ru" ? `${theme.accent} text-white` : `${theme.cardBg} border ${theme.border}`}`}
            >
              🇷🇺 RU
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1 rounded transition ${fontSize.small} ${language === "en" ? `${theme.accent} text-white` : `${theme.cardBg} border ${theme.border}`}`}
            >
              🇬🇧 EN
            </button>
          </div>
        </div>
        <p className={`${theme.textSecondary} ${fontSize.body} mb-4`}>
          {t("Используйте вкладки сверху для перехода по функциям приложения.", "Use the tabs above to navigate app features.")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: t("Поиск рецептов", "Recipe Search"), content: t("Введите ингредиенты или используйте фильтры.", "Enter ingredients or use filters."), screen: "search" },
          { title: t("Мой аккаунт", "My Account"), content: t("Настройте профиль и отслеживайте питание.", "Set up profile and track nutrition."), screen: "account" },
        ].map((tip, idx) => (
          <div 
            key={idx} 
            onClick={() => setActiveScreen(tip.screen)} 
            className={`${theme.cardBg} p-4 rounded-xl shadow border-l-4 ${theme.border} cursor-pointer flex items-start gap-3 hover:shadow-lg transition`}
          >
            <FaSearch className={`${theme.accentText} w-6 h-6`} />
            <div>
              <h4 className={`font-semibold ${fontSize.body} ${theme.headerText}`}>{tip.title}</h4>
              <p className={`${theme.textSecondary} ${fontSize.small} mt-1`}>{tip.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}