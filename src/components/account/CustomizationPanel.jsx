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
        <div className="mt-4 space-y-4">
          {/* Тема */}
          <div>
            <label className={`block ${fontSize.body} font-semibold mb-2`}>{t("Цветовая тема", "Color Theme")}</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.keys(THEMES).map(key => (
                <button
                  key={key}
                  onClick={() => setCurrentTheme(key)}
                  className={`p-3 rounded-xl border-2 ${currentTheme === key ? `${theme.border} border-4` : "border-transparent"}`}
                >
                  <div className={`${THEMES[key].preview} h-12 rounded mb-2`}></div>
                  <div className={`${fontSize.small} text-center`}>{THEMES[key][language === "ru" ? "name" : "nameEn"]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Шрифт */}
          <div>
            <label className={`block ${fontSize.body} font-semibold mb-2`}>{t("Шрифт", "Font")}</label>
            <div className="flex gap-2">
              {Object.keys(FONTS).map(key => (
                <button
                  key={key}
                  onClick={() => setCurrentFont(key)}
                  className={`px-4 py-2 rounded-xl ${fontSize.small} ${currentFont === key ? `${theme.accent} text-white` : `${theme.border} border`}`}
                >
                  {FONTS[key][language === "ru" ? "nameRu" : "name"]}
                </button>
              ))}
            </div>
          </div>

          {/* Размер текста */}
          <div>
            <label className={`block ${fontSize.body} font-semibold mb-2`}>{t("Размер текста", "Text Size")}</label>
            <div className="flex gap-2">
              {Object.keys(FONT_SIZES).map(key => (
                <button
                  key={key}
                  onClick={() => setCurrentFontSize(key)}
                  className={`px-4 py-2 rounded-xl ${fontSize.small} ${currentFontSize === key ? `${theme.accent} text-white` : `${theme.border} border`}`}
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
