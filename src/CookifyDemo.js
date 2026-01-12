// =================== БЛОК 1: Импорты и примерные данные ===================
import React, { useState, useEffect } from "react";
import { FaSearch, FaUser, FaClipboardList, FaSun, FaMoon, FaPalette, FaFont, FaChevronDown, FaChevronUp } from "react-icons/fa";

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

// Доступные шрифты (только работающие)
const FONTS = {
  inter: { name: "Inter", nameRu: "Inter", class: "font-sans" },
  roboto: { name: "Roboto", nameRu: "Roboto", class: "font-['Roboto']" }
};

// Размеры шрифта
const FONT_SIZES = {
  small: { name: "Обычный", nameEn: "Normal", class: "text-base" },
  medium: { name: "Увеличенный", nameEn: "Large", class: "text-lg" },
  large: { name: "Крупный", nameEn: "Extra Large", class: "text-xl" }
};

// Цветовые темы на основе природных палитр
const THEMES = {
  olive: {
    name: "Оливковая",
    nameEn: "Olive",
    bg: "bg-[#FEFAE0]",
    cardBg: "bg-white",
    text: "text-[#283618]",
    textSecondary: "text-[#606C38]",
    border: "border-[#DDA15E]",
    input: "bg-white border-[#DDA15E] text-[#283618] placeholder-[#606C38]",
    headerText: "text-[#606C38]",
    accentText: "text-[#BC6C25]",
    accent: "bg-[#606C38]",
    accentHover: "hover:bg-[#283618]",
    preview: "bg-gradient-to-br from-[#FEFAE0] via-[#DDA15E] to-[#606C38]"
  },
  beige: {
    name: "Бежевая",
    nameEn: "Beige",
    bg: "bg-[#FEFAE0]",
    cardBg: "bg-[#FAEDCD]",
    text: "text-[#6C584C]",
    textSecondary: "text-[#A98467]",
    border: "border-[#D4A373]",
    input: "bg-[#FAEDCD] border-[#CCD5AE] text-[#6C584C] placeholder-[#A98467]",
    headerText: "text-[#A98467]",
    accentText: "text-[#D4A373]",
    accent: "bg-[#CCD5AE]",
    accentHover: "hover:bg-[#E9EDC9]",
    preview: "bg-gradient-to-br from-[#FEFAE0] via-[#FAEDCD] to-[#CCD5AE]"
  },
  sage: {
    name: "Шалфейная",
    nameEn: "Sage",
    bg: "bg-[#F0EAD2]",
    cardBg: "bg-[#DDE5B6]",
    text: "text-[#6C584C]",
    textSecondary: "text-[#A98467]",
    border: "border-[#A98467]",
    input: "bg-[#F0EAD2] border-[#DDE5B6] text-[#6C584C] placeholder-[#A98467]",
    headerText: "text-[#6C584C]",
    accentText: "text-[#A98467]",
    accent: "bg-[#A98467]",
    accentHover: "hover:bg-[#6C584C]",
    preview: "bg-gradient-to-br from-[#F0EAD2] via-[#DDE5B6] to-[#A98467]"
  },
  forest: {
    name: "Лесная",
    nameEn: "Forest",
    bg: "bg-[#172815]",
    cardBg: "bg-[#3E5622]",
    text: "text-[#EDEEC9]",
    textSecondary: "text-[#95B46A]",
    border: "border-[#709255]",
    input: "bg-[#3E5622] border-[#709255] text-[#EDEEC9] placeholder-[#95B46A]",
    headerText: "text-[#95B46A]",
    accentText: "text-[#83781B]",
    accent: "bg-[#709255]",
    accentHover: "hover:bg-[#95B46A]",
    preview: "bg-gradient-to-br from-[#172815] via-[#3E5622] to-[#709255]"
  }
};

// =================== БЛОК 2: Компонент приложения ===================
export default function CookifyDemo() {
  // ---------- Стейты ----------
  const [activeScreen, setActiveScreen] = useState("home"); // home, search, account
  const [language, setLanguage] = useState("ru");
  const [currentTheme, setCurrentTheme] = useState("olive"); // Текущая тема
  const [currentFont, setCurrentFont] = useState("inter"); // Текущий шрифт
  const [currentFontSize, setCurrentFontSize] = useState("small"); // Размер шрифта
  const [showCustomization, setShowCustomization] = useState(false); // Показ секции кастомизации
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

  // ---------- Текущая тема ----------
  const theme = THEMES[currentTheme];
  const font = FONTS[currentFont];
  const fontSize = FONT_SIZES[currentFontSize];

  // ---------- Обработчики профиля ----------
  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setUserData(prev => ({ ...prev, avatarURL: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    // Нормализуем пустые строки в undefined
    Object.keys(data).forEach(k => { if (data[k] === "") data[k] = ""; });
    // Сохраняем аватар если был
    if (userData?.avatarURL) {
      data.avatarURL = userData.avatarURL;
    }
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
    <div className={`min-h-screen ${theme.bg} ${theme.text} ${font.class} ${fontSize.class} p-6 transition-all duration-500`}>
      {/* ------------------ БЛОК 3.1: Хедер ------------------ */}
      <header className="max-w-6xl mx-auto flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-3xl font-bold ${theme.headerText}`}>Cookify</h1>
          <p className={`text-sm ${theme.textSecondary}`}>{t("Интерактивная имитация приложения", "Interactive demo")}</p>
        </div>

        <div className="flex gap-3 items-center">
          <nav className="flex gap-3">
            <button
              onClick={() => setActiveScreen("home")}
              className={`px-3 py-2 rounded text-sm transition ${activeScreen === "home" ? `${theme.accent} ${theme.accentHover} text-white` : `${theme.cardBg} shadow-sm`}`}
            >{t("Главная", "Home")}</button>

            <button
              onClick={() => setActiveScreen("search")}
              className={`px-3 py-2 rounded text-sm transition ${activeScreen === "search" ? `${theme.accent} ${theme.accentHover} text-white` : `${theme.cardBg} shadow-sm`}`}
            >{t("Поиск", "Search")}</button>

            <button
              onClick={() => setActiveScreen("account")}
              className={`px-3 py-2 rounded text-sm transition ${activeScreen === "account" ? `${theme.accent} ${theme.accentHover} text-white` : `${theme.cardBg} shadow-sm`}`}
            >{t("Мой аккаунт", "My Account")}</button>
          </nav>

          <select className={`${theme.input} p-1 rounded`} value={language} onChange={e => setLanguage(e.target.value)}>
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </div>
      </header>

      {/* ------------------ БЛОК 3.2: Главная с подсказками ------------------ */}
      {activeScreen === "home" && (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className={`${theme.cardBg} p-6 rounded-xl shadow`}>
            <h2 className={`text-xl font-semibold mb-3 ${theme.headerText}`}>
              {t("Добро пожаловать, ", "Welcome, ")}{userData?.name || t("Пользователь", "User")}!
            </h2>
            <p className={`${theme.textSecondary} mb-4`}>{t("Используйте вкладки сверху для перехода по функциям приложения.", "Use the tabs above to navigate app features.")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: t("Поиск рецептов", "Recipe Search"), content: t("Введите ингредиенты или используйте фильтры.", "Enter ingredients or use filters."), screen: "search" },
              { title: t("Мой аккаунт", "My Account"), content: t("Настройте профиль и добавьте план питания.", "Set up profile and add meal plan."), screen: "account" },
            ].map((tip, idx) => (
              <div key={idx} onClick={() => setActiveScreen(tip.screen)} className={`${theme.cardBg} p-4 rounded-xl shadow border-l-4 ${theme.border} cursor-pointer flex items-start gap-3 hover:shadow-lg transition`}>
                <FaSearch className={`${theme.accentText} w-6 h-6`} />
                <div>
                  <h4 className={`font-semibold ${theme.headerText}`}>{tip.title}</h4>
                  <p className={`${theme.textSecondary} text-sm mt-1`}>{tip.content}</p>
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
    <div className={`sticky top-4 ${theme.cardBg} z-20 p-4 rounded-2xl shadow flex flex-col md:flex-row gap-3 items-center`}>
      <div className="relative flex-1 w-full">
        <FaSearch className={`absolute left-3 top-3 ${theme.textSecondary}`} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={searchMode === "name" ? t("Введите название блюда или тег...", "Enter dish name or tag...") : t("Введите ингредиенты (через запятую)...", "Enter ingredients (comma separated)...")}
          className={`w-full pl-10 pr-4 py-2 ${theme.input} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#606C38]`}
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setSearchMode(prev => prev === "name" ? "ingredients" : "name")}
          className={`px-4 py-2 rounded-xl text-white transition ${searchMode === "name" ? `${theme.accent} ${theme.accentHover}` : "bg-[#BC6C25] hover:bg-[#A98467]"}`}
        >
          {searchMode === "name" ? t("По ингредиентам", "By ingredients") : t("По названию", "By name")}
        </button>

        <button
          onClick={() => setShowFilters(prev => !prev)}
          className={`px-4 py-2 rounded-xl transition ${theme.accent} ${theme.accentHover} text-white`}
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
        className={`w-full p-2 ${theme.input} rounded-xl mb-2`}
      />
    </div>

    {/* Фильтры (скрываемые) */}
    {showFilters && (
      <div className={`${theme.cardBg} p-4 rounded-2xl shadow space-y-3`}>
        <h3 className="text-lg font-semibold">{t("Фильтры", "Filters")}</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Тип блюда */}
          <select value={selectedFilters.type} onChange={(e) => setSelectedFilters(prev => ({ ...prev, type: e.target.value }))} className={`${theme.input} p-2 rounded`}>
            <option value="">{t("Тип блюда", "Dish type")}</option>
            <option value="завтрак">{t("Завтрак", "Breakfast")}</option>
            <option value="обед">{t("Обед", "Lunch")}</option>
            <option value="ужин">{t("Ужин", "Dinner")}</option>
            <option value="перекус">{t("Перекус", "Snack")}</option>
            <option value="десерт">{t("Десерт", "Dessert")}</option>
          </select>

          {/* Диетические предпочтения */}
          <select value={selectedFilters.diet} onChange={(e) => setSelectedFilters(prev => ({ ...prev, diet: e.target.value }))} className={`${theme.input} p-2 rounded`}>
            <option value="">{t("Диетические предпочтения", "Diet preferences")}</option>
            <option value="веган">{t("Веган", "Vegan")}</option>
            <option value="вегетарианское">{t("Вегетарианское", "Vegetarian")}</option>
            <option value="низкокалорийное">{t("Низкокалорийное", "Low calorie")}</option>
            <option value="безглютеновое">{t("Безглютеновое", "Gluten free")}</option>
          </select>

          {/* Время приготовления */}
          <select value={selectedFilters.timeRange} onChange={(e) => setSelectedFilters(prev => ({ ...prev, timeRange: e.target.value }))} className={`${theme.input} p-2 rounded`}>
            <option value="">{t("Время приготовления", "Cooking time")}</option>
            <option value="short">{t("до 15 мин", "up to 15 min")}</option>
            <option value="medium">{t("15–40 мин", "15–40 min")}</option>
            <option value="long">{t("свыше 40 мин", "40+ min")}</option>
          </select>

          {/* Кухни мира */}
          <select value={selectedFilters.cuisine} onChange={(e) => setSelectedFilters(prev => ({ ...prev, cuisine: e.target.value }))} className={`${theme.input} p-2 rounded`}>
            <option value="">{t("Кухни мира", "World cuisine")}</option>
            <option value="итальянская">{t("Итальянская", "Italian")}</option>
            <option value="азиатская">{t("Азиатская", "Asian")}</option>
            <option value="русская">{t("Русская", "Russian")}</option>
            <option value="средиземноморская">{t("Средиземноморская", "Mediterranean")}</option>
          </select>

          {/* Особые параметры */}
          <select value={selectedFilters.special} onChange={(e) => setSelectedFilters(prev => ({ ...prev, special: e.target.value }))} className={`${theme.input} p-2 rounded`}>
            <option value="">{t("Особые параметры", "Special parameters")}</option>
            <option value="безглютеновое">{t("Безглютеновое", "Gluten-free")}</option>
            <option value="низкокалорийное">{t("Низкокалорийное", "Low calorie")}</option>
          </select>

          {/* Уровень сложности */}
          <select value={selectedFilters.difficulty} onChange={(e) => setSelectedFilters(prev => ({ ...prev, difficulty: e.target.value }))} className={`${theme.input} p-2 rounded`}>
            <option value="">{t("Уровень сложности", "Difficulty")}</option>
            <option value="легкий">{t("Лёгкий", "Easy")}</option>
            <option value="средний">{t("Средний", "Medium")}</option>
            <option value="сложный">{t("Сложный", "Hard")}</option>
          </select>

          {/* Популярные теги */}
          <select value={selectedFilters.tag} onChange={(e) => setSelectedFilters(prev => ({ ...prev, tag: e.target.value }))} className={`${theme.input} p-2 rounded`}>
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
          }} className={`px-4 py-2 rounded transition ${theme.accent} ${theme.accentHover} text-white`}>{t("Сбросить фильтры", "Reset filters")}</button>
        </div>
      </div>
    )}

    {/* Результаты поиска */}
    <div className={`${theme.cardBg} p-4 rounded-2xl shadow`}>
      <h2 className="text-xl font-semibold mb-3">{t("Результаты", "Results")}</h2>
      {filteredResults.length === 0 ? (
        <p className={theme.textSecondary}>{t("Ничего не найдено", "No recipes found")}</p>
      ) : (
        <div className="grid gap-3">
          {filteredResults.map(r => (
            <div key={r.id} className={`p-4 ${theme.border} border rounded-lg`}>
              <div>
                <h3 className="text-lg font-bold">{r.title}</h3>
                <div className={`text-sm ${theme.textSecondary} mt-1`}>{r.time} {t("мин", "min")} • {r.calories} {t("ккал", "kcal")}</div>
              </div>

              {/* Ингредиенты с подсветкой аллергенов/исключений */}
              <div className="mt-3 text-sm">
                <strong>{t("Ингредиенты:", "Ingredients:")}</strong>{" "}
                {r.ingredients.map((ing, i) => {
                  const low = ing.toLowerCase();
                  const isAllergy = allergyList.some(a => a && low.includes(a));
                  const isExcluded = excludeIngredients.toLowerCase().split(",").map(s => s.trim()).filter(Boolean).some(e => e && low.includes(e));
                  const cls = isAllergy || isExcluded ? "text-red-600 font-semibold" : "";
                  return <span key={i} className={`${cls} mr-2`}>{ing}{i < r.ingredients.length - 1 ? "," : ""}</span>;
                })}
              </div>

              {/* Теги */}
              <div className="mt-3 flex flex-wrap gap-2">
                {(r.tags || []).map((tag, i) => <span key={i} className={`px-2 py-1 ${theme.accent} text-white rounded-full text-xs`}>{tag}</span>)}
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
          <h2 className={`text-3xl font-bold text-center ${theme.accentText}`}>{t("Мой аккаунт", "My Account")}</h2>

          {/* Если не зарегистрирован — показать кнопку/форму регистрации */}
          {!registered && !showRegisterForm && (
            <div className="text-center">
              <p className="mb-4">{t("Зарегистрируйтесь, чтобы заполнить анкету и управлять планом питания.", "Register to fill your profile and manage meal plan.")}</p>
              <button onClick={() => setShowRegisterForm(true)} className={`${theme.accent} ${theme.accentHover} text-white px-6 py-2 rounded-xl transition`}>{t("Создать аккаунт", "Create account")}</button>
            </div>
          )}

          {showRegisterForm && (
            <form onSubmit={handleRegister} className={`${theme.cardBg} p-6 rounded-xl shadow space-y-3`}>
              <h3 className="text-xl font-semibold">{t("Регистрация / Редактирование", "Register / Edit")}</h3>

              <div className="flex gap-2">
                <input defaultValue={userData?.name || ""} name="name" placeholder={t("Имя", "Name")} className={`flex-1 ${theme.input} p-2 rounded`} required />
                <select defaultValue={userData?.gender || ""} name="gender" className={`${theme.input} p-2 rounded`} required>
                  <option value="">{t("Пол", "Gender")}</option>
                  <option value="Мужской">{t("Мужской", "Male")}</option>
                  <option value="Женский">{t("Женский", "Female")}</option>
                </select>
              </div>

              <div className="flex gap-2">
                <input defaultValue={userData?.age || ""} name="age" type="number" min="0" placeholder={t("Возраст", "Age")} className={`flex-1 ${theme.input} p-2 rounded`} required />
                <div className="flex gap-2">
                  <input defaultValue={userData?.weight || ""} name="weight" type="number" min="0" placeholder={t("Вес", "Weight")} className={`w-32 ${theme.input} p-2 rounded`} />
                  <select defaultValue={userData?.weightUnit || "кг"} name="weightUnit" className={`${theme.input} p-2 rounded`}>
                    <option value="кг">кг</option>
                    <option value="фунты">ф</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <input defaultValue={userData?.height || ""} name="height" type="number" min="0" placeholder={t("Рост", "Height")} className={`flex-1 ${theme.input} p-2 rounded`} />
                <select defaultValue={userData?.heightUnit || "см"} name="heightUnit" className={`${theme.input} p-2 rounded`}>
                  <option value="см">см</option>
                  <option value="дюймы">in</option>
                </select>
              </div>

              <select defaultValue={userData?.goals || ""} name="goals" className={`w-full ${theme.input} p-2 rounded`}>
                <option value="">{t("Цели", "Goals")}</option>
                {GOALS.map((g,i) => <option key={i} value={g}>{g}</option>)}
              </select>

              <select defaultValue={userData?.lifestyle || ""} name="lifestyle" className={`w-full ${theme.input} p-2 rounded`}>
                <option value="">{t("Образ жизни", "Lifestyle")}</option>
                {LIFESTYLE.map((l,i) => <option key={i} value={l}>{l}</option>)}
              </select>

              <input defaultValue={userData?.allergies || ""} name="allergies" placeholder={t("Аллергии (через запятую)", "Allergies (comma-separated)") } className={`w-full ${theme.input} p-2 rounded`} />
              <input defaultValue={userData?.medical || ""} name="medical" placeholder={t("Медпоказания (опционально)", "Medical info (optional)") } className={`w-full ${theme.input} p-2 rounded`} />
              <input defaultValue={userData?.preferences || ""} name="preferences" placeholder={t("Предпочтения (опционально)", "Preferences (optional)") } className={`w-full ${theme.input} p-2 rounded`} />
              <input defaultValue={userData?.habits || ""} name="habits" placeholder={t("Привычки (опционально)", "Habits (optional)") } className={`w-full ${theme.input} p-2 rounded`} />

              <div>
                <label className="block text-sm mb-1">{t("Аватарка", "Avatar")}</label>
                <input onChange={handleAvatarUpload} type="file" accept="image/*" className={`w-full ${theme.input} p-2 rounded`} />
              </div>

              <div className="flex gap-2">
                <button type="submit" className={`${theme.accent} ${theme.accentHover} text-white px-4 py-2 rounded transition`}>{t("Сохранить", "Save")}</button>
                {registered && <button type="button" onClick={() => { setShowRegisterForm(false); setIsEditingProfile(false); }} className={`px-4 py-2 ${theme.border} border rounded`}>{t("Отмена", "Cancel")}</button>}
              </div>
            </form>
          )}

          {/* Просмотр профиля */}
          {registered && userData && !showRegisterForm && (
            <div className={`${theme.cardBg} p-6 rounded-xl shadow space-y-4`}>
              <div className="flex items-start gap-4">
                {userData.avatarURL ? <img src={userData.avatarURL} alt="avatar" className={`w-24 h-24 rounded-full object-cover ${theme.border} border-2`} /> : <div className={`w-24 h-24 rounded-full ${currentTheme === 'forest' ? 'bg-[#709255]' : 'bg-[#DDA15E]'} flex items-center justify-center text-white text-2xl font-bold`}>?</div>}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{userData.name}</h3>
                      <p className={`text-sm ${theme.textSecondary}`}>{userData.gender && <>{t("Пол", "Gender")}: {userData.gender} · </>}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setShowRegisterForm(true); setIsEditingProfile(true); }} className={`px-3 py-1 ${theme.border} border rounded transition hover:shadow`}>{t("Изменить профиль", "Edit profile")}</button>
                      <button onClick={handleLogout} className="px-3 py-1 bg-red-100 text-red-700 rounded transition hover:bg-red-200">{t("Выйти", "Logout")}</button>
                    </div>
                  </div>

                  <div className={`mt-3 ${theme.textSecondary} space-y-1`}>
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

              {/* План питания */}
              <div>
                <h4 className="font-semibold">{t("Мой план питания", "My Meal Plan")}</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-2">
                  {MEAL_CATEGORIES.map(cat => (
                    <div key={cat} className={`p-2 ${theme.border} border rounded`}>
                      <div className="font-medium mb-1">{language === "ru" ? MEAL_LABELS_RU[cat] : cat}</div>
                      {mealPlan[cat].length === 0 ? <div className={`text-sm ${theme.textSecondary}`}>{t("Пусто", "Empty")}</div> :
                        mealPlan[cat].map(m => <div key={m.id} className="text-sm">{m.title}</div>)}
                    </div>
                  ))}
                </div>
              </div>

              {/* КАСТОМИЗАЦИЯ АККАУНТА (складная секция) */}
              <div className={`${theme.cardBg} p-4 rounded-xl border ${theme.border}`}>
                <button 
                  onClick={() => setShowCustomization(!showCustomization)}
                  className="w-full flex items-center justify-between font-semibold mb-3"
                >
                  <span>{t("Кастомизация аккаунта", "Account Customization")}</span>
                  {showCustomization ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                
                {showCustomization && (
                  <div className="space-y-4 mt-4">
                    {/* Выбор темы */}
                    <div>
                      <label className="block text-sm font-medium mb-2">{t("Цветовая тема", "Color Theme")}</label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(THEMES).map(([key, themeItem]) => (
                          <button
                            key={key}
                            onClick={() => setCurrentTheme(key)}
                            className={`p-3 rounded-lg transition hover:scale-102 ${currentTheme === key ? 'ring-2 ring-[#606C38] shadow-md' : 'hover:shadow'}`}
                          >
                            <div className={`${themeItem.preview} h-12 rounded-md mb-2 shadow-inner`}></div>
                            <p className="text-xs font-medium text-center">{language === "ru" ? themeItem.name : themeItem.nameEn}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Выбор шрифта */}
                    <div>
                      <label className="block text-sm font-medium mb-2">{t("Шрифт", "Font")}</label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(FONTS).map(([key, fontItem]) => (
                          <button
                            key={key}
                            onClick={() => setCurrentFont(key)}
                            className={`p-3 rounded-lg transition hover:scale-102 text-left ${fontItem.class} ${theme.cardBg} border ${currentFont === key ? `${theme.border} ring-2 ring-[#606C38]` : 'border-transparent'}`}
                          >
                            <p className="text-sm font-medium">{language === "ru" ? fontItem.nameRu : fontItem.name}</p>
                            <p className="text-xs mt-1 opacity-70">Aa Бб Вв 123</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Размер шрифта */}
                    <div>
                      <label className="block text-sm font-medium mb-2">{t("Размер шрифта", "Font Size")}</label>
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(FONT_SIZES).map(([key, sizeItem]) => (
                          <button
                            key={key}
                            onClick={() => setCurrentFontSize(key)}
                            className={`p-3 rounded-lg transition hover:scale-102 ${theme.cardBg} border ${currentFontSize === key ? `${theme.border} ring-2 ring-[#606C38]` : 'border-transparent'}`}
                          >
                            <p className={`font-medium ${sizeItem.class}`}>{language === "ru" ? sizeItem.name : sizeItem.nameEn}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
