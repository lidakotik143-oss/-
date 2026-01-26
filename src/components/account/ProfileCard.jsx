import React from "react";
import { FaUser, FaExchangeAlt } from "react-icons/fa";

export default function ProfileCard({
  t,
  theme,
  fontSize,
  userData,
  unitSystem,
  handleStartEditProfile,
  handleLogout,
  toggleUnitSystem,
  getDisplayWeight,
  getDisplayHeight
}) {
  return (
    <div className={`${theme.cardBg} p-6 rounded-xl shadow`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-4 items-center">
          {userData.avatarURL ? (
            <img src={userData.avatarURL} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className={`w-20 h-20 rounded-full ${theme.accent} flex items-center justify-center text-white text-3xl font-bold`}>
              {(userData.name || "U").charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h2 className={`${fontSize.subheading} font-bold`}>{userData.name || t("Пользователь", "User")}</h2>
            <p className={`${theme.textSecondary} ${fontSize.small}`}>{userData.email || t("email не указан", "no email")}</p>
          </div>
        </div>
        <div className="flex gap-2">
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
      </div>

      {/* Переключатель единиц измерения */}
      <div className="mb-4 flex items-center justify-end gap-2">
        <span className={`${fontSize.small} ${theme.textSecondary}`}>
          {unitSystem === "metric" ? t("Метрическая", "Metric") : t("Имперская", "Imperial")}
        </span>
        <button
          onClick={toggleUnitSystem}
          className={`px-3 py-1 rounded-xl ${fontSize.small} ${theme.accent} ${theme.accentHover} text-white flex items-center gap-2`}
        >
          <FaExchangeAlt />
          {t("Переключить", "Switch")}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {[
          { label: t("Возраст", "Age"), value: userData.age },
          { label: t("Вес", "Weight"), value: getDisplayWeight() },
          { label: t("Рост", "Height"), value: getDisplayHeight() },
          { label: t("Цель", "Goal"), value: userData.goal },
          { label: t("Образ жизни", "Lifestyle"), value: userData.lifestyle },
          { label: t("Аллергии", "Allergies"), value: userData.allergies || t("Нет", "None") }
        ].map((item, idx) => (
          item.value && (
            <div key={idx} className={`p-3 ${theme.border} border rounded-lg`}>
              <div className={`${fontSize.small} ${theme.textSecondary} mb-1`}>{item.label}</div>
              <div className={`${fontSize.body} font-semibold`}>{item.value}</div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
