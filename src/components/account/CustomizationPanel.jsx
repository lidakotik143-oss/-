import React from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

export default function CustomizationPanel({
  t,
  theme,
  fontSize,
  language,
  showCustomization,
  setShowCustomization,
  currentTheme,
  setCurrentTheme,
  currentFont,
  setCurrentFont,
  currentFontSize,
  setCurrentFontSize,
  THEMES,
  FONTS,
  FONT_SIZES
}) {
  return (
    <div className={`${theme.cardBg} p-6 rounded-xl shadow`}>
      <button
        onClick={() => setShowCustomization(!showCustomization)}
        className={`flex items-center justify-between w-full ${fontSize.cardTitle} font-semibold`}
      >
        <span>{t("Настройки интерфейса", "Interface Settings")}</span>
        {showCustomization ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {showCustomization && (
        <div className="mt-4 space-y-6">
          {/* Тема */}
          <div className="text-center">
            <label className={`block ${fontSize.body} font-semibold mb-3`}>{t("Цветовая тема", "Color Theme")}</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
              {Object.keys(THEMES).map(key => (
                <button
                  key={key}
                  onClick={() => setCurrentTheme(key)}
                  className={`p-3 rounded-xl border-2 transition-all ${currentTheme === key ? `${theme.border} border-4 shadow-lg` : "border-transparent hover:border-gray-300"}`}
                >
                  <div className={`${THEMES[key].preview} h-12 rounded mb-2`}></div>
                  <div className={`${fontSize.small} text-center`}>{THEMES[key][language === "ru" ? "name" : "nameEn"]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Шрифт */}
          <div className="text-center">
            <label className={`block ${fontSize.body} font-semibold mb-3`}>{t("Шрифт", "Font")}</label>
            <div className="flex gap-2 justify-center flex-wrap">
              {Object.keys(FONTS).map(key => (
                <button
                  key={key}
                  onClick={() => setCurrentFont(key)}
                  className={`px-6 py-3 rounded-xl ${fontSize.small} transition ${currentFont === key ? `${theme.accent} text-white shadow-lg` : `${theme.border} border hover:shadow`}`}
                >
                  {FONTS[key][language === "ru" ? "nameRu" : "name"]}
                </button>
              ))}
            </div>
          </div>

          {/* Размер текста */}
          <div className="text-center">
            <label className={`block ${fontSize.body} font-semibold mb-3`}>{t("Размер текста", "Text Size")}</label>
            <div className="flex gap-2 justify-center flex-wrap">
              {Object.keys(FONT_SIZES).map(key => (
                <button
                  key={key}
                  onClick={() => setCurrentFontSize(key)}
                  className={`px-6 py-3 rounded-xl ${fontSize.small} transition ${currentFontSize === key ? `${theme.accent} text-white shadow-lg` : `${theme.border} border hover:shadow`}`}
                >
                  {FONT_SIZES[key][language === "ru" ? "name" : "nameEn"]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
