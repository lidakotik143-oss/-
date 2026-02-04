import React, { useMemo, useState } from "react";
import { FaTimes } from "react-icons/fa";

const DEFAULT_ALLERGY_SUGGESTIONS_RU = [
  "Молоко",
  "Яйца",
  "Орехи",
  "Арахис",
  "Пшеница",
  "Глютен",
  "Соя",
  "Рыба",
  "Морепродукты",
  "Кунжут"
];

const DEFAULT_ALLERGY_SUGGESTIONS_EN = [
  "Milk",
  "Eggs",
  "Tree nuts",
  "Peanuts",
  "Wheat",
  "Gluten",
  "Soy",
  "Fish",
  "Shellfish",
  "Sesame"
];

const splitAllergyTokens = (value) =>
  (value || "")
    .split(/[;,]+/)
    .map(s => s.trim())
    .filter(Boolean);

const buildAllergyValue = (tokens) => tokens.join(", ");

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
  const [allergyInput, setAllergyInput] = useState(userData?.allergies || "");
  const [showAllergySuggestions, setShowAllergySuggestions] = useState(false);

  const suggestions = language === "ru" ? DEFAULT_ALLERGY_SUGGESTIONS_RU : DEFAULT_ALLERGY_SUGGESTIONS_EN;

  const allergyTokens = useMemo(() => splitAllergyTokens(allergyInput), [allergyInput]);

  const currentQuery = useMemo(() => {
    const raw = (allergyInput || "").trim();
    // Ищем после последней запятой/точки с запятой
    const idxComma = raw.lastIndexOf(",");
    const idxSemi = raw.lastIndexOf(";");
    const idx = Math.max(idxComma, idxSemi);
    return (idx >= 0 ? raw.slice(idx + 1) : raw).trim();
  }, [allergyInput]);

  const filteredSuggestions = useMemo(() => {
    const q = currentQuery.toLowerCase();
    // Если пользователь ничего не вводит — показываем топ-список
    const base = q ? suggestions.filter(s => s.toLowerCase().includes(q)) : suggestions;

    // Не показываем то, что уже добавлено
    const existing = new Set(allergyTokens.map(x => x.toLowerCase()));
    return base.filter(s => !existing.has(s.toLowerCase())).slice(0, 8);
  }, [currentQuery, suggestions, allergyTokens]);

  const addAllergyToken = (token) => {
    const tokens = splitAllergyTokens(allergyInput);
    const next = buildAllergyValue([...tokens, token]);
    setAllergyInput(next);
    setShowAllergySuggestions(false);
  };

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

          <div className="relative">
            <label className={`block ${fontSize.body} font-semibold mb-2`}>{t("Аллергии", "Allergies")}</label>
            <input
              type="text"
              name="allergies"
              value={allergyInput}
              onChange={(e) => {
                setAllergyInput(e.target.value);
                setShowAllergySuggestions(true);
              }}
              onFocus={() => setShowAllergySuggestions(true)}
              onBlur={() => {
                // Даём кликнуть по подсказке
                setTimeout(() => setShowAllergySuggestions(false), 120);
              }}
              placeholder={t("Начните вводить (можно через запятую)", "Start typing (comma separated)")}
              className={`w-full p-3 ${theme.input} ${fontSize.body} rounded-xl`}
              autoComplete="off"
            />

            {showAllergySuggestions && filteredSuggestions.length > 0 && (
              <div className={`absolute left-0 right-0 mt-2 rounded-xl border ${theme.border} ${theme.cardBg} shadow-lg overflow-hidden z-10`}>
                {filteredSuggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => addAllergyToken(s)}
                    className={`w-full text-left px-4 py-3 ${fontSize.body} ${theme.text} hover:${theme.accent} hover:text-white transition`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {allergyTokens.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {allergyTokens.map((tok) => (
                  <span
                    key={tok}
                    className={`px-3 py-1 rounded-full ${fontSize.small} border ${theme.border} ${theme.textSecondary}`}
                  >
                    {tok}
                  </span>
                ))}
              </div>
            )}
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
