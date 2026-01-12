// =================== БЛОК 1: Импорты и примерные данные ===================
import React, { useState, useEffect } from "react";
import { FaSearch, FaUser, FaClipboardList } from "react-icons/fa";

/*
  Пример расширенных рецептов (добавлены поля для фильтров):
  - type: тип блюда (завтрак/обед/ужин/десерт/перекус)
  - diet: диетические метки (vegan, vegetarian, lowcal)
  - time: время в минутах (строкой или числом — используем парсинг)
  - cuisine: кухня
  - special: особые параметры (например "безглютеновое")
  - difficulty: уровень сложности
  - tags: популярные теги
*/
const SAMPLE_RECIPES = [
  {
    id: 1,
    title: "Курица с томатами и базиликом",
    time: "30",
    calories: 420,
    type: "обед",
    diet: "",
    cuisine: "итальянская",
    special: "",
    difficulty: "средний",
    tags: ["низкокалорийное", "популярное"],
    ingredients: ["курица", "помидоры", "базилик", "оливковое масло", "чеснок"]
  },
  {
    id: 2,
    title: "Овсяноблин с ягодами",
    time: "15",
    calories: 250,
    type: "завтрак",
    diet: "веган",
    cuisine: "русская",
    special: "низкокалорийное",
    difficulty: "легкий",
    tags: ["веган", "быстро"],
    ingredients: ["овсянка", "вода", "ягоды", "мёд"]
  },
  {
    id: 3,
    title: "Паста с грибным соусом",
    time: "25",
    calories: 560,
    type: "ужин",
    diet: "вегетарианское",
    cuisine: "итальянская",
    special: "",
    difficulty: "средний",
    tags: ["вегетарианское"],
    ingredients: ["паста", "грибы", "сливки", "пармезан"]
  },
  {
    id: 4,
    title: "Салат с авокадо",
    time: "10",
    calories: 180,
    type: "перекус",
    diet: "веган",
    cuisine: "средиземноморская",
    special: "безглютеновое",
    difficulty: "легкий",
    tags: ["свежо", "летнее"],
    ingredients: ["авокадо", "помидоры", "листья салата", "оливковое масло"]
  }
];

// Константы
const GOAL_OPTIONS_RU = ["Снижение веса", "Набор массы", "Поддержание здоровья"];
const GOAL_OPTIONS_EN = ["Weight loss", "Muscle gain", "Health maintenance"];
const LIFESTYLE_RU = ["Сидячий", "Умеренно активный", "Активный"];
const LIFESTYLE_EN = ["Sedentary", "Moderately active", "Active"];

const MEAL_CATEGORIES = ["breakfast", "lunch", "snack", "dinner"];
const MEAL_LABELS_RU = { breakfast: "Завтрак", lunch: "Обед", snack: "Перекус", dinner: "Ужин" };

// =================== БЛОК 2: Компонент приложения ===================
export default function CookifyDemo() {
  // ---------- Стейты ----------
  const [activeScreen, setActiveScreen] = useState("home"); // home, search, account
  const [language, setLanguage] = useState("ru");
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [userData, setUserData] = useState(null); // объект профиля
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Поиск
  const [searchMode, setSearchMode] = useState("name"); // name | ingredients
  const [searchQuery, setSearchQuery] = useState("");
  const [excludeIngredients, setExcludeIngredients] = useState("");

  // Фильтры UI
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    type: "",
    diet: "",
    timeRange: "", // short / medium / long
    cuisine: "",
    special: "",
    difficulty: "",
    tag: ""
  });

  // План питания
  const [mealPlan, setMealPlan] = useState({
    breakfast: [],
    lunch: [],
    snack: [],
    dinner: []
  });
  const [planPeriod, setPlanPeriod] = useState("day"); // day|week|month

  // Вспомогательные
  const GOALS = language === "ru" ? GOAL_OPTIONS_RU : GOAL_OPTIONS_EN;
  const LIFESTYLE = language === "ru" ? LIFESTYLE_RU : LIFESTYLE_EN;

  // ---------- Обработчики профиля ----------
  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const avatarURL = URL.createObjectURL(file);
    setUserData(prev => ({ ...prev, avatarURL }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    // Нормализуем пустые строки в undefined
    Object.keys(data).forEach(k => { if (data[k] === "") data[k] = ""; });
    setUserData(data);
    setRegistered(true);
    setShowRegisterForm(false);
    setIsEditingProfile(false);
  };

  const handleStartEditProfile = () => {
    setIsEditingProfile(true);
    setShowRegisterForm(true);
  };

  const handleLogout = () => {
    setUserData(null);
    setRegistered(false);
    setShowRegisterForm(false);
    setIsEditingProfile(false);
    setMealPlan({ breakfast: [], lunch: [], snack: [], dinner: [] });
  };

  // ---------- План питания ----------
  const addToMealPlan = (recipe, category) => {
    setMealPlan(prev => ({ ...prev, [category]: [...prev[category], recipe] }));
  };
  const removeFromMealPlan = (category, recipeId) => {
    setMealPlan(prev => ({ ...prev, [category]: prev[category].filter(r => r.id !== recipeId) }));
  };
  const clearMealPlan = () => setMealPlan({ breakfast: [], lunch: [], snack: [], dinner: [] });

  // ---------- Фильтрация рецептов ----------
  const normalize = (s) => (s || "").toString().toLowerCase();

  const filteredResults = SAMPLE_RECIPES.filter(r => {
    const ingStr = r.ingredients.join(",").toLowerCase();

    // 1) Поисковый режим
    let matchesSearch = true;
    if (searchMode === "name" && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      matchesSearch = r.title.toLowerCase().includes(q) || (r.tags || []).some(t => t.toLowerCase().includes(q));
    } else if (searchMode === "ingredients" && searchQuery.trim()) {
      const terms = searchQuery.split(",").map(t => t.trim().toLowerCase()).filter(Boolean);
      matchesSearch = terms.every(t => ingStr.includes(t));
    }

    // 2) Исключения
    let matchesExclude = true;
    if (excludeIngredients.trim()) {
      const exs = excludeIngredients.split(",").map(t => t.trim().toLowerCase()).filter(Boolean);
      matchesExclude = !r.ingredients.some(ing => exs.some(e => ing.toLowerCase().includes(e)));
    }

    // 3) Фильтры
    let matchesFilters = true;
    if (selectedFilters.type) {
      matchesFilters = matchesFilters && normalize(r.type) === normalize(selectedFilters.type);
    }
    if (selectedFilters.diet) {
      matchesFilters = matchesFilters && normalize(r.diet) === normalize(selectedFilters.diet);
    }
    if (selectedFilters.cuisine) {
      matchesFilters = matchesFilters && normalize(r.cuisine) === normalize(selectedFilters.cuisine);
    }
    if (selectedFilters.special) {
      matchesFilters = matchesFilters && normalize(r.special).includes(normalize(selectedFilters.special));
    }
    if (selectedFilters.difficulty) {
      matchesFilters = matchesFilters && normalize(r.difficulty) === normalize(selectedFilters.difficulty);
    }
    if (selectedFilters.tag) {
      matchesFilters = matchesFilters && (r.tags || []).map(t => t.toLowerCase()).includes(selectedFilters.tag.toLowerCase());
    }
    if (selectedFilters.timeRange) {
      const t = parseInt(r.time || "0", 10);
      if (selectedFilters.timeRange === "short") matchesFilters = matchesFilters && t <= 15;
      if (selectedFilters.timeRange === "medium") matchesFilters = matchesFilters && t > 15 && t <= 40;
      if (selectedFilters.timeRange === "long") matchesFilters = matchesFilters && t > 40;
    }

    return matchesSearch && matchesExclude && matchesFilters;
  });

  // ---------- Аллергены подсветка ----------
  const getAllergyList = () => {
    if (!userData?.allergies) return [];
    return userData.allergies.toLowerCase().split(/[;,]+/).map(s => s.trim()).filter(Boolean);
  };
  const allergyList = getAllergyList();

  // ---------- Утилиты UI ----------
  const t = (ru, en) => (language === "ru" ? ru : en);

  // =================== БЛОК 3: JSX (UI) ===================
  return (
    <div className="min-h-screen bg-[#f8f3eb] p-6 font-sans">
      {/* ------------------ БЛОК 3.1: Хедер ------------------ */}
      <header className="max-w-6xl mx-auto flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-800">Cookify</h1>
          <p className="text-sm text-gray-600">{t("Интерактивная имитация приложения", "Interactive demo")}</p>
        </div>

        <div className="flex gap-3 items-center">
          <nav className="flex gap-3">
            <button
              onClick={() => setActiveScreen("home")}
              className={`px-3 py-2 rounded text-sm ${activeScreen === "home" ? "bg-green-500 text-white" : "bg-white shadow-sm text-blue-700"}`}
            >{t("Главная", "Home")}</button>

            <button
              onClick={() => setActiveScreen("search")}
              className={`px-3 py-2 rounded text-sm ${activeScreen === "search" ? "bg-green-500 text-white" : "bg-white shadow-sm text-blue-700"}`}
            >{t("Поиск", "Search")}</button>

            <button
              onClick={() => setActiveScreen("account")}
              className={`px-3 py-2 rounded text-sm ${activeScreen === "account" ? "bg-green-500 text-white" : "bg-white shadow-sm text-blue-700"}`}
            >{t("Мой аккаунт", "My Account")}</button>
          </nav>

          <select className="border p-1 rounded" value={language} onChange={e => setLanguage(e.target.value)}>
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </div>
      </header>

      {/* ------------------ БЛОК 3.2: Главная с подсказками ------------------ */}
      {activeScreen === "home" && (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-3 text-blue-800">
              {t("Добро пожаловать, ", "Welcome, ")}{userData?.name || t("Пользователь", "User")}!
            </h2>
            <p className="text-gray-700 mb-4">{t("Используйте вкладки сверху для перехода по функциям приложения.", "Use the tabs above to navigate app features.")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: t("Поиск рецептов", "Recipe Search"), content: t("Введите ингредиенты или используйте фильтры.", "Enter ingredients or use filters."), screen: "search" },
              { title: t("Мой аккаунт", "My Account"), content: t("Настройте профиль и добавьте план питания.", "Set up profile and add meal plan."), screen: "account" },
            ].map((tip, idx) => (
              <div key={idx} onClick={() => setActiveScreen(tip.screen)} className="bg-white p-4 rounded shadow border-l-4 border-green-500 cursor-pointer flex items-start gap-3 hover:shadow-lg transition">
                <FaSearch className="text-blue-600 w-6 h-6" />
                <div>
                  <h4 className="font-semibold text-blue-700">{tip.title}</h4>
                  <p className="text-gray-700 text-sm mt-1">{tip.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

  
     {/* ------------------ БЛОК 3.3: Поиск (с панелью, режимами, фильтрами) ------------------ */}
{activeScreen === "search" && (
  <div className="max-w-6xl mx-auto space-y-4">
    {/* Верхняя поисковая панель */}
    <div className="sticky top-4 bg-[#fdf8f3] z-20 p-4 rounded-2xl shadow flex flex-col md:flex-row gap-3 items-center">
      <div className="relative flex-1 w-full">
        <FaSearch className="absolute left-3 top-3 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={searchMode === "name" ? t("Введите название блюда или тег...", "Enter dish name or tag...") : t("Введите ингредиенты (через запятую)...", "Enter ingredients (comma separated)...")}
          className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setSearchMode(prev => prev === "name" ? "ingredients" : "name")}
          className={`px-4 py-2 rounded-xl text-white ${searchMode === "name" ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"}`}
        >
          {searchMode === "name" ? t("По ингредиентам", "By ingredients") : t("По названию", "By name")}
        </button>

        <button
          onClick={() => setShowFilters(prev => !prev)}
          className="px-4 py-2 rounded-xl bg-green-100 text-green-800 hover:bg-green-200"
        >
          {showFilters ? t("Скрыть фильтры", "Hide filters") : t("Показать фильтры", "Show filters")}
        </button>
      </div>
    </div>

    {/* Поля исключений */}
    <div className="max-w-6xl mx-auto">
      <input
        type="text"
        value={excludeIngredients}
        onChange={(e) => setExcludeIngredients(e.target.value)}
        placeholder={t("Исключить ингредиенты (через запятую)", "Exclude ingredients (comma-separated)")}
        className="w-full p-2 border rounded mb-2"
      />
    </div>

    {/* Фильтры (скрываемые) */}
    {showFilters && (
      <div className="bg-white p-4 rounded-2xl shadow space-y-3">
        <h3 className="text-lg font-semibold">{t("Фильтры", "Filters")}</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Здесь все селекты фильтров остаются без изменений */}
          {/* Тип блюда */}
          <select value={selectedFilters.type} onChange={(e) => setSelectedFilters(prev => ({ ...prev, type: e.target.value }))} className="border p-2 rounded">
            <option value="">{t("Тип блюда", "Dish type")}</option>
            <option value="завтрак">{t("Завтрак", "Breakfast")}</option>
            <option value="обед">{t("Обед", "Lunch")}</option>
            <option value="ужин">{t("Ужин", "Dinner")}</option>
            <option value="перекус">{t("Перекус", "Snack")}</option>
            <option value="десерт">{t("Десерт", "Dessert")}</option>
          </select>

          {/* Диетические предпочтения */}
          <select value={selectedFilters.diet} onChange={(e) => setSelectedFilters(prev => ({ ...prev, diet: e.target.value }))} className="border p-2 rounded">
            <option value="">{t("Диетические предпочтения", "Diet preferences")}</option>
            <option value="веган">{t("Веган", "Vegan")}</option>
            <option value="вегетарианское">{t("Вегетарианское", "Vegetarian")}</option>
            <option value="низкокалорийное">{t("Низкокалорийное", "Low calorie")}</option>
            <option value="безглютеновое">{t("Безглютеновое", "Gluten free")}</option>
          </select>

          {/* Время приготовления */}
          <select value={selectedFilters.timeRange} onChange={(e) => setSelectedFilters(prev => ({ ...prev, timeRange: e.target.value }))} className="border p-2 rounded">
            <option value="">{t("Время приготовления", "Cooking time")}</option>
            <option value="short">{t("до 15 мин", "up to 15 min")}</option>
            <option value="medium">{t("15–40 мин", "15–40 min")}</option>
            <option value="long">{t("свыше 40 мин", "40+ min")}</option>
          </select>

          {/* Кухни мира */}
          <select value={selectedFilters.cuisine} onChange={(e) => setSelectedFilters(prev => ({ ...prev, cuisine: e.target.value }))} className="border p-2 rounded">
            <option value="">{t("Кухни мира", "World cuisine")}</option>
            <option value="итальянская">{t("Итальянская", "Italian")}</option>
            <option value="азиатская">{t("Азиатская", "Asian")}</option>
            <option value="русская">{t("Русская", "Russian")}</option>
            <option value="средиземноморская">{t("Средиземноморская", "Mediterranean")}</option>
          </select>

          {/* Особые параметры */}
          <select value={selectedFilters.special} onChange={(e) => setSelectedFilters(prev => ({ ...prev, special: e.target.value }))} className="border p-2 rounded">
            <option value="">{t("Особые параметры", "Special parameters")}</option>
            <option value="безглютеновое">{t("Безглютеновое", "Gluten-free")}</option>
            <option value="низкокалорийное">{t("Низкокалорийное", "Low calorie")}</option>
          </select>

          {/* Уровень сложности */}
          <select value={selectedFilters.difficulty} onChange={(e) => setSelectedFilters(prev => ({ ...prev, difficulty: e.target.value }))} className="border p-2 rounded">
            <option value="">{t("Уровень сложности", "Difficulty")}</option>
            <option value="легкий">{t("Лёгкий", "Easy")}</option>
            <option value="средний">{t("Средний", "Medium")}</option>
            <option value="сложный">{t("Сложный", "Hard")}</option>
          </select>

          {/* Популярные теги */}
          <select value={selectedFilters.tag} onChange={(e) => setSelectedFilters(prev => ({ ...prev, tag: e.target.value }))} className="border p-2 rounded">
            <option value="">{t("Популярные теги", "Popular tags")}</option>
            <option value="веган">веган</option>
            <option value="быстро">быстро</option>
            <option value="низкокалорийное">низкокалорийное</option>
            <option value="популярное">популярное</option>
          </select>
        </div>

        {/* Сброс фильтров */}
        <div className="flex gap-2 justify-end mt-2">
          <button onClick={() => {
            setSelectedFilters({ type: "", diet: "", timeRange: "", cuisine: "", special: "", difficulty: "", tag: "" });
            setSearchQuery("");
            setExcludeIngredients("");
          }} className="px-4 py-2 bg-green-100 text-green-800 rounded">{t("Сбросить фильтры", "Reset filters")}</button>
        </div>
      </div>
    )}

    {/* Результаты поиска */}
    <div className="bg-white p-4 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-3">{t("Результаты", "Results")}</h2>
      {filteredResults.length === 0 ? (
        <p className="text-gray-600">{t("Ничего не найдено", "No recipes found")}</p>
      ) : (
        <div className="grid gap-3">
          {filteredResults.map(r => (
            <div key={r.id} className="p-4 border rounded-lg">
              <div>
                <h3 className="text-lg font-bold">{r.title}</h3>
                <div className="text-sm text-gray-600 mt-1">{r.time} {t("мин", "min")} • {r.calories} {t("ккал", "kcal")}</div>
              </div>

              {/* Ингредиенты с подсветкой аллергенов/исключений */}
              <div className="mt-3 text-sm">
                <strong>{t("Ингредиенты:", "Ingredients:")}</strong>{" "}
                {r.ingredients.map((ing, i) => {
                  const low = ing.toLowerCase();
                  const isAllergy = allergyList.some(a => a && low.includes(a));
                  const isExcluded = excludeIngredients.toLowerCase().split(",").map(s => s.trim()).filter(Boolean).some(e => e && low.includes(e));
                  const cls = isAllergy || isExcluded ? "text-red-600 font-semibold" : "text-gray-800";
                  return <span key={i} className={`${cls} mr-2`}>{ing}{i < r.ingredients.length - 1 ? "," : ""}</span>;
                })}
              </div>

              {/* Теги */}
              <div className="mt-3 flex flex-wrap gap-2">
                {(r.tags || []).map((tag, i) => <span key={i} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">{tag}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}

      {/* ------------------ БЛОК 3.4: Аккаунт / Профиль ------------------ */}
      {activeScreen === "account" && (
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-center text-[#2a8c82]">{t("Мой аккаунт", "My Account")}</h2>

          {/* Если не зарегистрирован — показать кнопку/форму регистрации */}
          {!registered && !showRegisterForm && (
            <div className="text-center">
              <p className="mb-4">{t("Зарегистрируйтесь, чтобы заполнить анкету и управлять планом питания.", "Register to fill your profile and manage meal plan.")}</p>
              <button onClick={() => setShowRegisterForm(true)} className="bg-[#2a8c82] text-white px-6 py-2 rounded">{t("Создать аккаунт", "Create account")}</button>
            </div>
          )}

          {showRegisterForm && (
            <form onSubmit={handleRegister} className="bg-white p-6 rounded-xl shadow space-y-3">
              <h3 className="text-xl font-semibold">{t("Регистрация / Редактирование", "Register / Edit")}</h3>

              <div className="flex gap-2">
                <input defaultValue={userData?.name || ""} name="name" placeholder={t("Имя", "Name")} className="flex-1 border p-2 rounded" required />
                <select defaultValue={userData?.gender || ""} name="gender" className="border p-2 rounded" required>
                  <option value="">{t("Пол", "Gender")}</option>
                  <option value="Мужской">{t("Мужской", "Male")}</option>
                  <option value="Женский">{t("Женский", "Female")}</option>
                </select>
              </div>

              <div className="flex gap-2">
                <input defaultValue={userData?.age || ""} name="age" type="number" min="0" placeholder={t("Возраст", "Age")} className="flex-1 border p-2 rounded" required />
                <div className="flex gap-2">
                  <input defaultValue={userData?.weight || ""} name="weight" type="number" min="0" placeholder={t("Вес", "Weight")} className="w-32 border p-2 rounded" />
                  <select defaultValue={userData?.weightUnit || "кг"} name="weightUnit" className="border p-2 rounded">
                    <option value="кг">кг</option>
                    <option value="фунты">ф</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <input defaultValue={userData?.height || ""} name="height" type="number" min="0" placeholder={t("Рост", "Height")} className="flex-1 border p-2 rounded" />
                <select defaultValue={userData?.heightUnit || "см"} name="heightUnit" className="border p-2 rounded">
                  <option value="см">см</option>
                  <option value="дюймы">in</option>
                </select>
              </div>

              <select defaultValue={userData?.goals || ""} name="goals" className="w-full border p-2 rounded">
                <option value="">{t("Цели", "Goals")}</option>
                {GOALS.map((g,i) => <option key={i} value={g}>{g}</option>)}
              </select>

              <select defaultValue={userData?.lifestyle || ""} name="lifestyle" className="w-full border p-2 rounded">
                <option value="">{t("Образ жизни", "Lifestyle")}</option>
                {LIFESTYLE.map((l,i) => <option key={i} value={l}>{l}</option>)}
              </select>

              <input defaultValue={userData?.allergies || ""} name="allergies" placeholder={t("Аллергии (через запятую)", "Allergies (comma-separated)") } className="w-full border p-2 rounded" />
              <input defaultValue={userData?.medical || ""} name="medical" placeholder={t("Медпоказания (опционально)", "Medical info (optional)") } className="w-full border p-2 rounded" />
              <input defaultValue={userData?.preferences || ""} name="preferences" placeholder={t("Предпочтения (опционально)", "Preferences (optional)") } className="w-full border p-2 rounded" />
              <input defaultValue={userData?.habits || ""} name="habits" placeholder={t("Привычки (опционально)", "Habits (optional)") } className="w-full border p-2 rounded" />

              <div>
                <label className="block text-sm mb-1">{t("Аватарка", "Avatar")}</label>
                <input onChange={handleAvatarUpload} type="file" accept="image/*" className="w-full border p-2 rounded" />
              </div>

              <div className="flex gap-2">
                <button type="submit" className="bg-[#2a8c82] text-white px-4 py-2 rounded">{t("Сохранить", "Save")}</button>
                {registered && <button type="button" onClick={() => { setShowRegisterForm(false); setIsEditingProfile(false); }} className="px-4 py-2 border rounded">{t("Отмена", "Cancel")}</button>}
              </div>
            </form>
          )}

          {/* Просмотр профиля */}
          {registered && userData && !showRegisterForm && (
            <div className="bg-white p-6 rounded-xl shadow space-y-4">
              <div className="flex items-start gap-4">
                {userData.avatarURL ? <img src={userData.avatarURL} alt="avatar" className="w-24 h-24 rounded-full object-cover border" /> : <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">?</div>}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{userData.name}</h3>
                      <p className="text-sm text-gray-600">{userData.gender && <>{t("Пол", "Gender")}: {userData.gender} · </>}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setShowRegisterForm(true); setIsEditingProfile(true); }} className="px-3 py-1 border rounded">{t("Изменить профиль", "Edit profile")}</button>
                      <button onClick={handleLogout} className="px-3 py-1 bg-red-100 text-red-700 rounded">{t("Выйти", "Logout")}</button>
                    </div>
                  </div>

                  <div className="mt-3 text-gray-700 space-y-1">
                    {userData.age && <div><strong>{t("Возраст", "Age")}: </strong>{userData.age}</div>}
                    {userData.weight && <div><strong>{t("Вес", "Weight")}: </strong>{userData.weight} {userData.weightUnit || "кг"}</div>}
                    {userData.height && <div><strong>{t("Рост", "Height")}: </strong>{userData.height} {userData.heightUnit || "см"}</div>}
                    {userData.goals && <div><strong>{t("Цели", "Goals")}: </strong>{userData.goals}</div>}
                    {userData.lifestyle && <div><strong>{t("Образ жизни", "Lifestyle")}: </strong>{userData.lifestyle}</div>}
                    {userData.allergies && <div><strong>{t("Аллергии", "Allergies")}: </strong>{userData.allergies}</div>}
                    {userData.medical && <div><strong>{t("Медпоказания", "Medical info")}: </strong>{userData.medical}</div>}
                    {userData.preferences && <div><strong>{t("Предпочтения", "Preferences")}: </strong>{userData.preferences}</div>}
                    {userData.habits && <div><strong>{t("Привычки", "Habits")}: </strong>{userData.habits}</div>}
                  </div>
                </div>
              </div>

              {/* Здесь можно добавить отдельный просмотр плана питания --- подробный */}
              <div>
                <h4 className="font-semibold">{t("Мой план питания", "My Meal Plan")}</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-2">
                  {MEAL_CATEGORIES.map(cat => (
                    <div key={cat} className="p-2 border rounded">
                      <div className="font-medium mb-1">{language === "ru" ? MEAL_LABELS_RU[cat] : cat}</div>
                      {mealPlan[cat].length === 0 ? <div className="text-sm text-gray-500">{t("Пусто", "Empty")}</div> :
                        mealPlan[cat].map(m => <div key={m.id} className="text-sm">{m.title}</div>)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
