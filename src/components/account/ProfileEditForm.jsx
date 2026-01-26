import React from "react";
import { FaTimes } from "react-icons/fa";

export default function ProfileEditForm({
  t,
  theme,
  fontSize,
  language,
  isEditingProfile,
  userData,
  unitSystem,
  GOALS,
  LIFESTYLE,
  handleRegister,
  handleAvatarUpload,
  convertWeight,
  convertHeight,
  onClose
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${theme.cardBg} rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`${fontSize.subheading} font-bold`}>
            {isEditingProfile ? t("Редактировать профиль", "Edit Profile") : t("Регистрация", "Registration")}
          </h2>
          <button onClick={onClose} className={`${theme.textSecondary} hover:${theme.text}`}>
            <FaTimes size={24} />
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Аватар */}
          <div className="text-center">
            {userData?.avatarURL && (
              <img src={userData.avatarURL} alt="Avatar" className="w-24 h-24 rounded-full object-cover mx-auto mb-2" />
            )}
            <label className={`block ${fontSize.body} font-semibold mb-2`}>{t("Фото профиля", "Profile Photo")}</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className={`w-full p-2 ${theme.input} ${fontSize.body} rounded-xl`}
            />
          </div>

          {/* Основные поля */}
          <div>
            <label className={`block ${fontSize.body} font-semibold mb-2`}>{t("Имя", "Name")} *</label>
            <input
              type="text"
              name="name"
              required
              defaultValue={userData?.name || ""}
              className={`w-full p-3 ${theme.input} ${fontSize.body} rounded-xl`}
            />
          </div>

          <div>
            <label className={`block ${fontSize.body} font-semibold mb-2`}>{t("Email", "Email")}</label>
            <input
              type="email"
              name="email"
              defaultValue={userData?.email || ""}
              className={`w-full p-3 ${theme.input} ${fontSize.body} rounded-xl`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={`block ${fontSize.body} font-semibold mb-2`}>{t("Возраст", "Age")}</label>
              <input
                type="number"
                name="age"
                defaultValue={userData?.age || ""}
                className={`w-full p-3 ${theme.input} ${fontSize.body} rounded-xl`}
              />
            </div>
            <div>
              <label className={`block ${fontSize.body} font-semibold mb-2`}>
                {t("Вес", "Weight")} ({unitSystem === "metric" ? (language === "ru" ? "кг" : "kg") : "lb"})
              </label>
              <input
                type="number"
                step="0.1"
                name="weight"
                defaultValue={
                  userData?.weight
                    ? (unitSystem === "metric" ? userData.weight : convertWeight(userData.weight, "metric"))
                    : ""
                }
                className={`w-full p-3 ${theme.input} ${fontSize.body} rounded-xl`}
              />
            </div>
            <div>
              <label className={`block ${fontSize.body} font-semibold mb-2`}>
                {t("Рост", "Height")} ({unitSystem === "metric" ? (language === "ru" ? "см" : "cm") : "in"})
              </label>
              <input
                type="number"
                step="0.1"
                name="height"
                defaultValue={
                  userData?.height
                    ? (unitSystem === "metric" ? userData.height : convertHeight(userData.height, "metric"))
                    : ""
                }
                className={`w-full p-3 ${theme.input} ${fontSize.body} rounded-xl`}
              />
            </div>
          </div>

          <div>
            <label className={`block ${fontSize.body} font-semibold mb-2`}>{t("Цель", "Goal")}</label>
            <select
              name="goal"
              defaultValue={userData?.goal || ""}
              className={`w-full p-3 ${theme.input} ${fontSize.body} rounded-xl`}
            >
              <option value="">{t("Выберите цель", "Select goal")}</option>
              {GOALS.map((g, i) => (
                <option key={i} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block ${fontSize.body} font-semibold mb-2`}>{t("Образ жизни", "Lifestyle")}</label>
            <select
              name="lifestyle"
              defaultValue={userData?.lifestyle || ""}
              className={`w-full p-3 ${theme.input} ${fontSize.body} rounded-xl`}
            >
              <option value="">{t("Выберите образ жизни", "Select lifestyle")}</option>
              {LIFESTYLE.map((l, i) => (
                <option key={i} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block ${fontSize.body} font-semibold mb-2`}>{t("Аллергии", "Allergies")}</label>
            <input
              type="text"
              name="allergies"
              defaultValue={userData?.allergies || ""}
              placeholder={t("Через запятую или точку с запятой", "Comma or semicolon separated")}
              className={`w-full p-3 ${theme.input} ${fontSize.body} rounded-xl`}
            />
          </div>

          <button
            type="submit"
            className={`w-full px-6 py-3 rounded-xl ${fontSize.body} ${theme.accent} ${theme.accentHover} text-white font-semibold`}
          >
            {isEditingProfile ? t("Сохранить изменения", "Save Changes") : t("Зарегистрироваться", "Register")}
          </button>
        </form>
      </div>
    </div>
  );
}
