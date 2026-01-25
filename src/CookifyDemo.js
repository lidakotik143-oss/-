// =================== БЛОК 1: Импорты и примерные данные ===================
import React, { useState, useEffect } from "react";
import { FaSearch, FaUser, FaClipboardList, FaSun, FaMoon, FaPalette, FaFont, FaChevronDown, FaChevronUp, FaTimes, FaClock, FaExchangeAlt, FaPlus, FaCalendarAlt, FaChevronRight, FaChevronLeft, FaUtensils } from "react-icons/fa";
import { RECIPES_DATABASE } from './recipesData';

// Используем импортированную базу данных вместо примеров
// По умолчанию считаем, что рецепты рассчитаны на 2 порции,
// а поле calories (если не задано caloriesPerServing) — это ккал на 1 порцию.
const SAMPLE_RECIPES = (RECIPES_DATABASE || []).map(r => ({
  ...r,
  servings: r.servings ?? 2,
  caloriesPerServing: r.caloriesPerServing ?? r.calories
}));

// Константы
const GOAL_OPTIONS_RU = ["Снижение веса", "Набор массы", "Поддержание здоровья"];
const GOAL_OPTIONS_EN = ["Weight loss", "Muscle gain", "Health maintenance"];
const LIFESTYLE_RU = ["Сидячий", "Умеренно активный", "Активный"];
const LIFESTYLE_EN = ["Sedentary", "Moderately active", "Active"];

const MEAL_CATEGORIES = ["breakfast", "lunch", "snack", "dinner"];
const MEAL_LABELS_RU = { breakfast: "Завтрак", lunch: "Обед", snack: "Перекус", dinner: "Ужин" };
const MEAL_LABELS_EN = { breakfast: "Breakfast", lunch: "Lunch", snack: "Snack", dinner: "Dinner" };

const WEEKDAY_NAMES_RU = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
const WEEKDAY_NAMES_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKDAY_SHORT_RU = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const WEEKDAY_SHORT_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTH_NAMES_RU = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const MONTH_NAMES_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Константы конвертации
const CM_TO_INCH = 0.393701;
const KG_TO_LB = 2.20462;
const INCH_TO_CM = 2.54;
const LB_TO_KG = 0.453592;

// Маппинг типов блюд на русском с уникальными цветами
const DISH_TYPE_LABELS = {
  "завтрак": { 
    ru: "Завтрак", 
    en: "Breakfast",
    color: "bg-[#F4A460]" // Sandy Brown - утренний теплый оттенок
  },
  "обед": { 
    ru: "Обед", 
    en: "Lunch",
    color: "bg-[#8B7355]" // Burlywood Dark - сытный коричневый
  },
  "ужин": { 
    ru: "Ужин", 
    en: "Dinner",
    color: "bg-[#6B8E23]" // Olive Drab - вечерний зеленый
  },
  "перекус": { 
    ru: "Перекус", 
    en: "Snack",
    color: "bg-[#DAA520]" // Goldenrod - золотистый
  },
  "десерт": { 
    ru: "Десерт", 
    en: "Dessert",
    color: "bg-[#CD853F]" // Peru - сладкий персиковый
  }
};

// Маппинг диет (для более приятного отображения в EN)
const DIET_LABELS = {
  "веган": { ru: "Веган", en: "Vegan" },
  "вегетарианское": { ru: "Вегетарианское", en: "Vegetarian" },
  "низкокалорийное": { ru: "Низкокалорийное", en: "Low calorie" }
};

// Маппинг сложности (для более приятного отображения в EN)
const DIFFICULTY_LABELS = {
  "легкий": { ru: "Легкий", en: "Easy" },
  "средний": { ru: "Средний", en: "Medium" },
  "сложный": { ru: "Сложный", en: "Hard" }
};

// Функция для определения скорости приготовления и эмодзи
const getTimeCategory = (minutes) => {
  const time = parseInt(minutes, 10);
  if (time <= 15) return { category: "fast", emoji: "⚡", label_ru: "Быстро", label_en: "Fast", color: "#10B981" };
  if (time <= 40) return { category: "medium", emoji: "⏱️", label_ru: "Средне", label_en: "Medium", color: "#F59E0B" };
  return { category: "slow", emoji: "🕐", label_ru: "Не спеша", label_en: "Slow", color: "#EF4444" };
};

// Доступные шрифты (только работающие)
const FONTS = {
  inter: { name: "Inter", nameRu: "Inter", class: "font-sans" },
  roboto: { name: "Roboto", nameRu: "Roboto", class: "font-['Roboto']" }
};

// Размеры шрифта (применяется КО ВСЕМУ ТЕКСТУ)
const FONT_SIZES = {
  small: { 
    name: "Обычный", 
    nameEn: "Normal", 
    body: "text-base",
    heading: "text-3xl",
    subheading: "text-xl",
    cardTitle: "text-lg",
    small: "text-sm",
    tiny: "text-xs"
  },
  medium: { 
    name: "Увеличенный", 
    nameEn: "Large", 
    body: "text-lg",
    heading: "text-4xl",
    subheading: "text-2xl",
    cardTitle: "text-xl",
    small: "text-base",
    tiny: "text-sm"
  },
  large: { 
    name: "Крупный", 
    nameEn: "Extra Large", 
    body: "text-xl",
    heading: "text-5xl",
    subheading: "text-3xl",
    cardTitle: "text-2xl",
    small: "text-lg",
    tiny: "text-base"
  }
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

// Список кухонь (сортированный по алфавиту)
const CUISINES_RU = [
  "американская",
  "вьетнамская",
  "греческая",
  "грузинская",
  "индийская",
  "испанская",
  "итальянская",
  "китайская",
  "корейская",
  "мексиканская",
  "русская",
  "средиземноморская",
  "тайская",
  "турецкая",
  "украинская",
  "французская",
  "японская"
];

const CUISINES_EN = [
  "American",
  "Chinese",
  "French",
  "Georgian",
  "Greek",
  "Indian",
  "Italian",
  "Japanese",
  "Korean",
  "Mediterranean",
  "Mexican",
  "Russian",
  "Spanish",
  "Thai",
  "Turkish",
  "Ukrainian",
  "Vietnamese"
];

// Утилиты для работы с датами
const getDateKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const getWeekKey = (date) => {
  const d = new Date(date);
  const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
  const pastDaysOfYear = (d - firstDayOfYear) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
};

const getMonthKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const formatDate = (dateStr, language) => {
  const d = new Date(dateStr);
  if (language === "ru") {
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
};

// Получить все дни недели для заданной даты
const getWeekDays = (date) => {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Воскресенье, 1 = Понедельник и т.д.
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Приводим к понедельнику
  const monday = new Date(d.setDate(diff));
  
  const days = [];
  for (let i = 0; i < 7; i++) {
    const current = new Date(monday);
    current.setDate(monday.getDate() + i);
    days.push(getDateKey(current));
  }
  return days;
};

// Получить диапазон недели
const getWeekRange = (date, language) => {
  const weekDays = getWeekDays(date);
  const firstDay = new Date(weekDays[0]);
  const lastDay = new Date(weekDays[6]);
  
  if (language === "ru") {
    return `${firstDay.getDate()} ${MONTH_NAMES_RU[firstDay.getMonth()].toLowerCase().slice(0, 3)} — ${lastDay.getDate()} ${MONTH_NAMES_RU[lastDay.getMonth()].toLowerCase().slice(0, 3)} ${lastDay.getFullYear()}`;
  } else {
    return `${MONTH_NAMES_EN[firstDay.getMonth()].slice(0, 3)} ${firstDay.getDate()} — ${MONTH_NAMES_EN[lastDay.getMonth()].slice(0, 3)} ${lastDay.getDate()}, ${lastDay.getFullYear()}`;
  }
};

// Функции навигации по датам
const addDays = (dateStr, days) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return getDateKey(d);
};

const addWeeks = (dateStr, weeks) => {
  return addDays(dateStr, weeks * 7);
};

const addMonths = (dateStr, months) => {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return getDateKey(d);
};

// Установить конкретный месяц и год
const setMonthYear = (dateStr, month, year) => {
  const d = new Date(dateStr);
  d.setFullYear(year);
  d.setMonth(month);
  return getDateKey(d);
};

// =================== БЛОК 2: Компонент приложения ===================
export default function CookifyDemo() {
  // ---------- Стейты ----------
  const [activeScreen, setActiveScreen] = useState("home"); // home, search, account
  const [language, setLanguage] = useState("ru");
  const [unitSystem, setUnitSystem] = useState("metric"); // metric | imperial
  const [currentTheme, setCurrentTheme] = useState("olive"); // Текущая тема
  const [currentFont, setCurrentFont] = useState("inter"); // Текущий шрифт
  const [currentFontSize, setCurrentFontSize] = useState("small"); // Размер шрифта
  const [showCustomization, setShowCustomization] = useState(false); // Показ секции кастомизации
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [userData, setUserData] = useState(null); // объект профиля
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Модальное окно рецепта
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedRecipeVariantKey, setSelectedRecipeVariantKey] = useState(null);

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
    difficulty: "",
    tag: ""
  });

  // План питания и история
  const [mealPlan, setMealPlan] = useState({
    breakfast: [],
    lunch: [],
    snack: [],
    dinner: []
  });
  const [mealHistory, setMealHistory] = useState([]); // [{date, category, recipe, timestamp}]
  const [viewPeriod, setViewPeriod] = useState("day"); // day | week | month
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [addMealCategory, setAddMealCategory] = useState("breakfast");
  const [selectedWeekDay, setSelectedWeekDay] = useState(null); // Для детального просмотра дня в неделе

  // Планировщик меню
  const [accountTab, setAccountTab] = useState("history"); // history | planner
  const [plannerWeekDate, setPlannerWeekDate] = useState(getDateKey(new Date()));
  const [weeklyPlan, setWeeklyPlan] = useState({}); // { "YYYY-MM-DD": { breakfast:[id], lunch:[id], ... } }
  const [showPlannerModal, setShowPlannerModal] = useState(false);
  const [plannerModalDate, setPlannerModalDate] = useState(null);
  const [plannerModalCategory, setPlannerModalCategory] = useState("breakfast");

  // ---------- Загрузка из localStorage ----------
  useEffect(() => {
    const savedUserData = localStorage.getItem("cookify_user");
    const savedLanguage = localStorage.getItem("cookify_language");
    const savedUnitSystem = localStorage.getItem("cookify_unitSystem");
    const savedTheme = localStorage.getItem("cookify_theme");
    const savedFont = localStorage.getItem("cookify_font");
    const savedFontSize = localStorage.getItem("cookify_fontSize");
    const savedMealHistory = localStorage.getItem("cookify_mealHistory");
    const savedWeeklyPlan = localStorage.getItem("cookify_weeklyPlan");
    
    if (savedUserData) {
      const parsed = JSON.parse(savedUserData);
      setUserData(parsed);
      setRegistered(true);
    }
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedUnitSystem) setUnitSystem(savedUnitSystem);
    if (savedTheme && THEMES[savedTheme]) setCurrentTheme(savedTheme);
    if (savedFont) setCurrentFont(savedFont);
    if (savedFontSize) setCurrentFontSize(savedFontSize);
    if (savedMealHistory) setMealHistory(JSON.parse(savedMealHistory));
    if (savedWeeklyPlan) setWeeklyPlan(JSON.parse(savedWeeklyPlan));
  }, []);

  // ---------- Сохранение в localStorage ----------
  useEffect(() => {
    if (userData) {
      localStorage.setItem("cookify_user", JSON.stringify(userData));
    }
  }, [userData]);

  useEffect(() => {
    localStorage.setItem("cookify_language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("cookify_unitSystem", unitSystem);
  }, [unitSystem]);

  useEffect(() => {
    localStorage.setItem("cookify_theme", currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem("cookify_font", currentFont);
  }, [currentFont]);

  useEffect(() => {
    localStorage.setItem("cookify_fontSize", currentFontSize);
  }, [currentFontSize]);

  useEffect(() => {
    localStorage.setItem("cookify_mealHistory", JSON.stringify(mealHistory));
  }, [mealHistory]);

  useEffect(() => {
    localStorage.setItem("cookify_weeklyPlan", JSON.stringify(weeklyPlan));
  }, [weeklyPlan]);

  // ---------- Автоматическое переключение системы измерений при смене языка ----------
  useEffect(() => {
    if (language === "en") {
      setUnitSystem("imperial");
    } else {
      setUnitSystem("metric");
    }
  }, [language]);

  // Вспомогательные
  const GOALS = language === "ru" ? GOAL_OPTIONS_RU : GOAL_OPTIONS_EN;
  const LIFESTYLE = language === "ru" ? LIFESTYLE_RU : LIFESTYLE_EN;
  const MEAL_LABELS = language === "ru" ? MEAL_LABELS_RU : MEAL_LABELS_EN;
  const WEEKDAY_NAMES = language === "ru" ? WEEKDAY_NAMES_RU : WEEKDAY_NAMES_EN;
  const WEEKDAY_SHORT = language === "ru" ? WEEKDAY_SHORT_RU : WEEKDAY_SHORT_EN;
  const MONTH_NAMES = language === "ru" ? MONTH_NAMES_RU : MONTH_NAMES_EN;

  // Для фильтров по кухне всегда храним RU значение (так как в базе кухни на RU),
  // но отображаем подписи в зависимости от языка.
  const CUISINE_OPTIONS = CUISINES_RU.map((ruName, idx) => ({
    value: ruName,
    label: language === "ru" ? ruName : (CUISINES_EN[idx] || ruName)
  }));

  // Опции для селектов фильтров
  const normalize = (s) => (s || "").toString().toLowerCase();
  const TYPE_OPTIONS = Object.keys(DISH_TYPE_LABELS);
  const DIET_OPTIONS = Array.from(new Set((SAMPLE_RECIPES || []).map(r => (r.diet || "").trim()).filter(Boolean)));
  const DIFFICULTY_OPTIONS = Array.from(new Set((SAMPLE_RECIPES || []).map(r => (r.difficulty || "").trim()).filter(Boolean)));
  const TAG_OPTIONS = Array.from(new Set((SAMPLE_RECIPES || []).flatMap(r => r.tags || []))).filter(Boolean);

  // ---------- Текущая тема ----------
  const theme = THEMES[currentTheme] || THEMES.olive;
  const font = FONTS[currentFont];
  const fontSize = FONT_SIZES[currentFontSize];

  // ---------- Функции конвертации единиц ----------
  const convertWeight = (value, fromUnit) => {
    if (!value) return value;
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    if (fromUnit === "metric") {
      return (num * KG_TO_LB).toFixed(1);
    } else {
      return (num * LB_TO_KG).toFixed(1);
    }
  };

  const convertHeight = (value, fromUnit) => {
    if (!value) return value;
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    if (fromUnit === "metric") {
      return (num * CM_TO_INCH).toFixed(1);
    } else {
      return (num * INCH_TO_CM).toFixed(1);
    }
  };

  const getDisplayWeight = () => {
    if (!userData?.weight) return "";
    const value = unitSystem === "metric" ? userData.weight : convertWeight(userData.weight, "metric");
    const unit = unitSystem === "metric" ? (language === "ru" ? "кг" : "kg") : "lb";
    return `${value} ${unit}`;
  };

  const getDisplayHeight = () => {
    if (!userData?.height) return "";
    const value = unitSystem === "metric" ? userData.height : convertHeight(userData.height, "metric");
    const unit = unitSystem === "metric" ? (language === "ru" ? "см" : "cm") : "in";
    return `${value} ${unit}`;
  };

  // ... остальной файл без изменений ...
}
