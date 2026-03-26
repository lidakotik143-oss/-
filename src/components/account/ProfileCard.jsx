import React, { useState } from "react";
import { FaUser, FaExchangeAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useApp } from "../../context/AppContext";

export default function ProfileCard() {
  const {
    t, theme, fontSize,
    userData, unitSystem,
    handleStartEditProfile, handleLogout, toggleUnitSystem,
    getDisplayWeight, getDisplayHeight
  } = useApp();

  const [expanded, setExpanded] = useState(false);

  const getGenderLabel = () => {
    const g = (userData.gender || '').toLowerCase();
    if (g === 'male' || g.includes('муж')) return t('Мужской', 'Male');
    if (g === 'female' || g.includes('жен')) return t('Женский', 'Female');
    return null;
  };

  const genderLabel = getGenderLabel();

  return (
    <div className={`${theme.cardBg} p-6 rounded-xl shadow`}>
      {/* Всегда видимая шапка */}
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setExpanded(o => !o)}
      >
        <div className="flex gap-4 items-center">
          {userData.avatarURL ? (
            <img src={userData.avatarURL} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className={`w-16 h-16 rounded-full ${theme.accent} flex items-center justify-center text-white text-2xl font-bold flex-shrink-0`}>
              {(userData.name || "U").charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h2 className={`${fontSize.subheading} font-bold`}>{userData.name || t("Пользователь", "User")}</h2>
            <p className={`${theme.textSecondary} ${fontSize.small}`}>{userData.email || t("email не указан", "no email")}</p>
          </div>
        </div>
        <div className={`${theme.textSecondary} ml-3`}>
          {expanded ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
        </div>
      </div>

      {/* Раскрывающаяся часть */}
      {expanded && (
        <div className="mt-5">
          {/* Кнопки управления */}
          <div className="flex gap-2 mb-5 justify-end">
            <button
              onClick={toggleUnitSystem}
              className={`px-3 py-2 rounded-xl ${fontSize.small} ${theme.accent} ${theme.accentHover} text-white flex items-center gap-2`}
            >
              <FaExchangeAlt />
              {unitSystem === "metric" ? t("Метрическая", "Metric") : t("Имперская", "Imperial")}
            </button>
            <button
              onClick={handleStartEditProfile}
              className={`px-4 py-2 rounded-xl ${fontSize.small} ${theme.accent} ${theme.accentHover} text-white`}
            >
              {t("Редактировать", "Edit")}
            </button>
            <button
              onClick={handleLogout}
              className={`px-4 py-2 rounded-xl ${fontSize.small} bg-red-500 hover:bg-red-600 text-white`}
            >
              {t("Выйти", "Logout")}
            </button>
          </div>

          {/* Данные профиля */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: t("Пол", "Gender"),           value: genderLabel },
              { label: t("Возраст", "Age"),           value: userData.age },
              { label: t("Вес", "Weight"),            value: getDisplayWeight() },
              { label: t("Рост", "Height"),           value: getDisplayHeight() },
              { label: t("Цель", "Goal"),             value: userData.goal },
              { label: t("Образ жизни", "Lifestyle"), value: userData.lifestyle },
              { label: t("Аллергии", "Allergies"),    value: userData.allergies || t("Нет", "None") },
            ].map((item, idx) =>
              item.value ? (
                <div key={idx} className={`p-3 ${theme.border} border rounded-lg`}>
                  <div className={`${fontSize.small} ${theme.textSecondary} mb-1`}>{item.label}</div>
                  <div className={`${fontSize.body} font-semibold`}>{item.value}</div>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );
}
