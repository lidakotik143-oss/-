// =================== БЛОК 1: Импорты и примерные данные ===================
import React, { useState, useEffect } from "react";
import { FaSearch, FaUser, FaClipboardList, FaSun, FaMoon, FaPalette, FaFont, FaChevronDown, FaChevronUp, FaTimes, FaClock, FaExchangeAlt, FaPlus, FaCalendarAlt, FaChevronRight, FaChevronLeft } from "react-icons/fa";
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

  // ---------- Загрузка из localStorage ----------
  useEffect(() => {
    const savedUserData = localStorage.getItem("cookify_user");
    const savedLanguage = localStorage.getItem("cookify_language");
    const savedUnitSystem = localStorage.getItem("cookify_unitSystem");
    const savedTheme = localStorage.getItem("cookify_theme");
    const savedFont = localStorage.getItem("cookify_font");
    const savedFontSize = localStorage.getItem("cookify_fontSize");
    const savedMealHistory = localStorage.getItem("cookify_mealHistory");
    
    if (savedUserData) {
      const parsed = JSON.parse(savedUserData);
      setUserData(parsed);
      setRegistered(true);
    }
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedUnitSystem) setUnitSystem(savedUnitSystem);
    if (savedTheme) setCurrentTheme(savedTheme);
    if (savedFont) setCurrentFont(savedFont);
    if (savedFontSize) setCurrentFontSize(savedFontSize);
    if (savedMealHistory) setMealHistory(JSON.parse(savedMealHistory));
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
  const theme = THEMES[currentTheme];
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
    // Всегда сохраняем в метрической системе
    if (unitSystem === "imperial") {
      if (data.weight) {
        data.weight = convertWeight(data.weight, "imperial");
      }
      if (data.height) {
        data.height = convertHeight(data.height, "imperial");
      }
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
    setMealHistory([]);
    localStorage.removeItem("cookify_user");
    localStorage.removeItem("cookify_mealHistory");
  };

  const toggleUnitSystem = () => {
    setUnitSystem(prev => prev === "metric" ? "imperial" : "metric");
  };

  // ---------- План питания ----------
  const addToMealPlan = (recipe, category) => {
    setMealPlan(prev => ({ ...prev, [category]: [...prev[category], recipe] }));
  };
  const removeFromMealPlan = (category, recipeId) => {
    setMealPlan(prev => ({ ...prev, [category]: prev[category].filter(r => r.id !== recipeId) }));
  };
  const clearMealPlan = () => setMealPlan({ breakfast: [], lunch: [], snack: [], dinner: [] });

  // ---------- История приемов пищи ----------
  const addMealToHistory = (recipe, category, date = new Date().toISOString().split('T')[0]) => {
    const newEntry = {
      id: Date.now(),
      date,
      category,
      recipe,
      timestamp: new Date().toISOString()
    };
    setMealHistory(prev => [...prev, newEntry]);
  };

  const removeMealFromHistory = (entryId) => {
    setMealHistory(prev => prev.filter(entry => entry.id !== entryId));
  };

  // Фильтрация истории по периоду
  const getFilteredHistory = () => {
    const selectedDateObj = new Date(selectedDate);
    
    return mealHistory.filter(entry => {
      const entryDate = new Date(entry.date);
      
      if (viewPeriod === "day") {
        return getDateKey(entryDate) === getDateKey(selectedDateObj);
      } else if (viewPeriod === "week") {
        return getWeekKey(entryDate) === getWeekKey(selectedDateObj);
      } else if (viewPeriod === "month") {
        return getMonthKey(entryDate) === getMonthKey(selectedDateObj);
      }
      return true;
    });
  };

  // Получить приемы пищи для конкретного дня
  const getMealsForDay = (dateKey) => {
    return mealHistory.filter(entry => getDateKey(new Date(entry.date)) === dateKey);
  };

  // Подсчет калорий за день
  const calculateDayCalories = (dateKey) => {
    const dayMeals = getMealsForDay(dateKey);
    return dayMeals.reduce((sum, entry) => {
      const cal = entry.recipe.caloriesPerServing || entry.recipe.calories || 0;
      return sum + cal;
    }, 0);
  };

  // Подсчет калорий за период
  const calculatePeriodStats = () => {
    const filtered = getFilteredHistory();
    const totalCalories = filtered.reduce((sum, entry) => {
      const cal = entry.recipe.caloriesPerServing || entry.recipe.calories || 0;
      return sum + cal;
    }, 0);
    
    return {
      totalMeals: filtered.length,
      totalCalories,
      avgCaloriesPerDay: viewPeriod === "day" ? totalCalories : Math.round(totalCalories / getDaysInPeriod())
    };
  };

  const getDaysInPeriod = () => {
    if (viewPeriod === "day") return 1;
    if (viewPeriod === "week") return 7;
    if (viewPeriod === "month") {
      const d = new Date(selectedDate);
      return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    }
    return 1;
  };

  // ---------- Фильтрация рецептов ----------
  const filteredResults = SAMPLE_RECIPES.filter(r => {
    const baseIngStr = (r.ingredients || []).join(",").toLowerCase();
    const variantIngStrs = (r.variants || []).map(v => (v.ingredients || []).join(",").toLowerCase());

    // 1) Поисковый режим
    let matchesSearch = true;
    if (searchMode === "name" && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      matchesSearch = r.title.toLowerCase().includes(q) || (r.tags || []).some(t => t.toLowerCase().includes(q));
    } else if (searchMode === "ingredients" && searchQuery.trim()) {
      const terms = searchQuery.split(",").map(t => t.trim().toLowerCase()).filter(Boolean);
      const pools = [baseIngStr, ...variantIngStrs];
      matchesSearch = pools.some(pool => terms.every(term => pool.includes(term)));
    }

    // 2) Исключения (оставляем по умолчанию — по базовым ингредиентам)
    let matchesExclude = true;
    if (excludeIngredients.trim()) {
      const exs = excludeIngredients.split(",").map(t => t.trim().toLowerCase()).filter(Boolean);
      matchesExclude = !(r.ingredients || []).some(ing => exs.some(e => ing.toLowerCase().includes(e)));
    }

    // 3) Фильтры
    let matchesFilters = true;
    if (selectedFilters.type) {
      matchesFilters = matchesFilters && normalize(r.type) === normalize(selectedFilters.type);
    }
    if (selectedFilters.diet) {
      matchesFilters = matchesFilters && normalize(r.diet).includes(normalize(selectedFilters.diet));
    }
    if (selectedFilters.cuisine) {
      matchesFilters = matchesFilters && normalize(r.cuisine) === normalize(selectedFilters.cuisine);
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

  // Функция для получения названия и цвета типа блюда
  const getDishTypeInfo = (type) => {
    const normalized = normalize(type);
    const dishInfo = DISH_TYPE_LABELS[normalized];
    return {
      label: dishInfo?.[language] || type,
      color: dishInfo?.color || "bg-gray-500"
    };
  };

  // Получить текст для отображения выбранного периода
  const getPeriodDisplayText = () => {
    const d = new Date(selectedDate);
    
    if (viewPeriod === "day") {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      if (getDateKey(d) === getDateKey(today)) {
        return t("Сегодня", "Today");
      } else if (getDateKey(d) === getDateKey(yesterday)) {
        return t("Вчера", "Yesterday");
      } else if (getDateKey(d) === getDateKey(tomorrow)) {
        return t("Завтра", "Tomorrow");
      } else {
        return formatDate(selectedDate, language);
      }
    } else if (viewPeriod === "week") {
      return getWeekRange(selectedDate, language);
    } else if (viewPeriod === "month") {
      return `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
    }
    
    return formatDate(selectedDate, language);
  };

  // =================== БЛОК 3: JSX (UI) ===================
  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} ${font.class} ${fontSize.body} p-6 transition-all duration-500`}>
      {/* ------------------ БЛОК 3.1: Хедер ------------------ */}
      <header className="max-w-6xl mx-auto flex items-center justify-between mb-6">
        <div>
          <h1 className={`${fontSize.heading} font-bold ${theme.headerText}`}>Cookify</h1>
          <p className={`${fontSize.small} ${theme.textSecondary}`}>{t("Интерактивная имитация приложения", "Interactive demo")}</p>
        </div>

        <div className="flex gap-3 items-center">
          <nav className="flex gap-3">
            <button
              onClick={() => setActiveScreen("home")}
              className={`px-3 py-2 rounded ${fontSize.small} transition ${activeScreen === "home" ? `${theme.accent} ${theme.accentHover} text-white` : `${theme.cardBg} shadow-sm`}`}
            >{t("Главная", "Home")}</button>

            <button
              onClick={() => setActiveScreen("search")}
              className={`px-3 py-2 rounded ${fontSize.small} transition ${activeScreen === "search" ? `${theme.accent} ${theme.accentHover} text-white` : `${theme.cardBg} shadow-sm`}`}
            >{t("Поиск", "Search")}</button>

            <button
              onClick={() => setActiveScreen("account")}
              className={`px-3 py-2 rounded ${fontSize.small} transition ${activeScreen === "account" ? `${theme.accent} ${theme.accentHover} text-white` : `${theme.cardBg} shadow-sm`}`}
            >{t("Мой аккаунт", "My Account")}</button>
          </nav>
        </div>
      </header>

      {/* ------------------ БЛОК 3.2: Главная с подсказками ------------------ */}
      {activeScreen === "home" && (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className={`${theme.cardBg} p-6 rounded-xl shadow`}>
            <div className="flex items-center justify-between mb-3">
              <h2 className={`${fontSize.subheading} font-semibold ${theme.headerText}`}>
                {t("Добро пожаловать, ", "Welcome, ")}{userData?.name || t("Пользователь", "User")}!
              </h2>
              
              {/* Переключатель языка на главной */}
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
            <p className={`${theme.textSecondary} ${fontSize.body} mb-4`}>{t("Используйте вкладки сверху для перехода по функциям приложения.", "Use the tabs above to navigate app features.")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: t("Поиск рецептов", "Recipe Search"), content: t("Введите ингредиенты или используйте фильтры.", "Enter ingredients or use filters."), screen: "search" },
              { title: t("Мой аккаунт", "My Account"), content: t("Настройте профиль и отслеживайте питание.", "Set up profile and track nutrition."), screen: "account" },
            ].map((tip, idx) => (
              <div key={idx} onClick={() => setActiveScreen(tip.screen)} className={`${theme.cardBg} p-4 rounded-xl shadow border-l-4 ${theme.border} cursor-pointer flex items-start gap-3 hover:shadow-lg transition`}>
                <FaSearch className={`${theme.accentText} w-6 h-6`} />
                <div>
                  <h4 className={`font-semibold ${fontSize.body} ${theme.headerText}`}>{tip.title}</h4>
                  <p className={`${theme.textSecondary} ${fontSize.small} mt-1`}>{tip.content}</p>
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
          className={`w-full pl-10 pr-4 py-2 ${theme.input} ${fontSize.body} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#606C38]`}
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setSearchMode(prev => prev === "name" ? "ingredients" : "name")}
          className={`px-4 py-2 rounded-xl ${fontSize.small} text-white transition ${searchMode === "name" ? `${theme.accent} ${theme.accentHover}` : "bg-[#BC6C25] hover:bg-[#A98467]"}`}
        >
          {searchMode === "name" ? t("По ингредиентам", "By ingredients") : t("По названию", "By name")}
        </button>

        <button
          onClick={() => setShowFilters(prev => !prev)}
          className={`px-4 py-2 rounded-xl ${fontSize.small} transition ${theme.accent} ${theme.accentHover} text-white`}
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
        className={`w-full p-2 ${theme.input} ${fontSize.body} rounded-xl mb-2`}
      />
    </div>

    {/* Фильтры (скрываемые) */}
    {showFilters && (
      <div className={`${theme.cardBg} p-4 rounded-2xl shadow space-y-3`}>
        <div className="flex items-center justify-between gap-3">
          <h3 className={`${fontSize.cardTitle} font-semibold`}>{t("Фильтры", "Filters")}</h3>
          <button
            onClick={() => setSelectedFilters({ type: "", diet: "", timeRange: "", cuisine: "", difficulty: "", tag: "" })}
            className={`px-4 py-2 rounded-xl ${fontSize.small} ${theme.accent} ${theme.accentHover} text-white`}
          >
            {t("Сбросить", "Reset")}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Тип */}
          <select
            value={selectedFilters.type}
            onChange={(e) => setSelectedFilters(prev => ({ ...prev, type: e.target.value }))}
            className={`w-full p-2 ${theme.input} ${fontSize.body} rounded-xl`}
          >
            <option value="">{t("Тип блюда (все)", "Dish type (all)")}</option>
            {TYPE_OPTIONS.map(typeKey => (
              <option key={typeKey} value={typeKey}>
                {DISH_TYPE_LABELS[typeKey]?.[language] || typeKey}
              </option>
            ))}
          </select>

          {/* Диета */}
          <select
            value={selectedFilters.diet}
            onChange={(e) => setSelectedFilters(prev => ({ ...prev, diet: e.target.value }))}
            className={`w-full p-2 ${theme.input} ${fontSize.body} rounded-xl`}
          >
            <option value="">{t("Диета (все)", "Diet (all)")}</option>
            {DIET_OPTIONS.map(d => (
              <option key={d} value={d}>
                {DIET_LABELS[normalize(d)]?.[language] || d}
              </option>
            ))}
          </select>

          {/* Время */}
          <select
            value={selectedFilters.timeRange}
            onChange={(e) => setSelectedFilters(prev => ({ ...prev, timeRange: e.target.value }))}
            className={`w-full p-2 ${theme.input} ${fontSize.body} rounded-xl`}
          >
            <option value="">{t("Время (любое)", "Time (any)")}</option>
            <option value="short">{t("До 15 минут", "Up to 15 min")}</option>
            <option value="medium">{t("16–40 минут", "16–40 min")}</option>
            <option value="long">{t("Больше 40 минут", "Over 40 min")}</option>
          </select>

          {/* Кухня */}
          <select
            value={selectedFilters.cuisine}
            onChange={(e) => setSelectedFilters(prev => ({ ...prev, cuisine: e.target.value }))}
            className={`w-full p-2 ${theme.input} ${fontSize.body} rounded-xl`}
          >
            <option value="">{t("Кухня (все)", "Cuisine (all)")}</option>
            {CUISINE_OPTIONS.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>

          {/* Сложность */}
          <select
            value={selectedFilters.difficulty}
            onChange={(e) => setSelectedFilters(prev => ({ ...prev, difficulty: e.target.value }))}
            className={`w-full p-2 ${theme.input} ${fontSize.body} rounded-xl`}
          >
            <option value="">{t("Сложность (любая)", "Difficulty (any)")}</option>
            {DIFFICULTY_OPTIONS.map(d => (
              <option key={d} value={d}>
                {DIFFICULTY_LABELS[normalize(d)]?.[language] || d}
              </option>
            ))}
          </select>

          {/* Тег */}
          <select
            value={selectedFilters.tag}
            onChange={(e) => setSelectedFilters(prev => ({ ...prev, tag: e.target.value }))}
            className={`w-full p-2 ${theme.input} ${fontSize.body} rounded-xl`}
          >
            <option value="">{t("Тег (любой)", "Tag (any)")}</option>
            {TAG_OPTIONS.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>
    )}

    {/* Результаты поиска */}
    <div className={`${theme.cardBg} p-4 rounded-2xl shadow`}>
      <h2 className={`${fontSize.subheading} font-semibold mb-3`}>{t("Результаты", "Results")}</h2>
      {filteredResults.length === 0 ? (
        <p className={`${theme.textSecondary} ${fontSize.body}`}>{t("Ничего не найдено", "No recipes found")}</p>
      ) : (
        <div className="grid gap-3">
          {filteredResults.map(r => {
            const dishTypeInfo = getDishTypeInfo(r.type);
            const kcalPerServing = r.caloriesPerServing ?? r.calories;
            return (
              <div 
                key={r.id} 
                onClick={() => {
                  setSelectedRecipe(r);
                  setSelectedRecipeVariantKey(r?.variants?.[0]?.key || null);
                }}
                className={`p-4 ${theme.border} border rounded-lg cursor-pointer hover:shadow-lg transition`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`${fontSize.cardTitle} font-bold`}>{r.title}</h3>
                    <div className={`${fontSize.small} ${theme.textSecondary} mt-1`}>{r.time} {t("мин", "min")} • {kcalPerServing} {t("ккал (на 1 порцию)", "kcal (per serving)")}</div>
                  </div>
                  
                  {r.type && (
                    <span className={`${dishTypeInfo.color} text-white px-3 py-1 rounded-full ${fontSize.tiny} font-semibold ml-3 flex-shrink-0`}>
                      {dishTypeInfo.label}
                    </span>
                  )}
                </div>

                <div className={`mt-3 ${fontSize.small}`}>
                  <strong>{t("Ингредиенты:", "Ingredients:")}</strong>{" "}
                  {(r.ingredients || []).map((ing, i) => {
                    const low = ing.toLowerCase();
                    const isAllergy = allergyList.some(a => a && low.includes(a));
                    const isExcluded = excludeIngredients.toLowerCase().split(",").map(s => s.trim()).filter(Boolean).some(e => e && low.includes(e));
                    const cls = isAllergy || isExcluded ? "text-red-600 font-semibold" : "";
                    return <span key={i} className={`${cls} mr-2`}>{ing}{i < r.ingredients.length - 1 ? "," : ""}</span>;
                  })}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {(r.tags || []).map((tag, i) => <span key={i} className={`px-2 py-1 ${theme.accent} text-white rounded-full ${fontSize.tiny}`}>{tag}</span>)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
)}

      {/* ------------------ МОДАЛЬНОЕ ОКНО РЕЦЕПТА С ИНТЕРАКТИВНЫМ ВРЕМЕНЕМ ------------------ */}
      {selectedRecipe && (() => {
        const dishTypeInfo = getDishTypeInfo(selectedRecipe.type);

        const variants = Array.isArray(selectedRecipe.variants) ? selectedRecipe.variants : [];
        const activeVariant = variants.length
          ? (variants.find(v => v.key === selectedRecipeVariantKey) || variants[0])
          : null;
        const activeRecipe = activeVariant || selectedRecipe;

        const timeInfo = getTimeCategory(activeRecipe.time ?? selectedRecipe.time);
        const timeMinutes = parseInt(activeRecipe.time ?? selectedRecipe.time, 10);
        const progressPercentage = Math.min((timeMinutes / 120) * 100, 100); // Макс 120 мин = 100%

        const kcalPerServing = activeRecipe.caloriesPerServing ?? selectedRecipe.caloriesPerServing ?? activeRecipe.calories ?? selectedRecipe.calories;
        const servings = selectedRecipe.servings ?? 2;

        const closeModal = () => {
          setSelectedRecipe(null);
          setSelectedRecipeVariantKey(null);
        };
        
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={closeModal}>
            <div className={`${theme.cardBg} ${fontSize.body} rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6`} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className={`${fontSize.subheading} font-bold ${theme.headerText}`}>{selectedRecipe.title}</h2>
                  {selectedRecipe.type && (
                    <span className={`${dishTypeInfo.color} text-white px-3 py-1 rounded-full ${fontSize.tiny} font-semibold inline-block mt-2`}>
                      {dishTypeInfo.label}
                    </span>
                  )}

                  {variants.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {variants.map(v => {
                        const isActive = v.key === activeVariant?.key;
                        return (
                          <button
                            key={v.key}
                            onClick={() => setSelectedRecipeVariantKey(v.key)}
                            className={`px-3 py-1 rounded-full ${fontSize.small} transition ${isActive ? `${theme.accent} text-white` : `${theme.cardBg} border ${theme.border}`}`}
                          >
                            {language === "ru" ? (v.labelRu || v.key) : (v.labelEn || v.key)}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                <button onClick={closeModal} className={`${theme.textSecondary} hover:${theme.text} transition ml-4`}>
                  <FaTimes size={24} />
                </button>
              </div>

              <div className={`${theme.cardBg} border-2 rounded-xl p-4 mb-6 shadow-md`} style={{ borderColor: timeInfo.color }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{timeInfo.emoji}</span>
                    <div>
                      <div className={`${fontSize.body} font-bold`} style={{ color: timeInfo.color }}>
                        {timeMinutes} {t("минут", "minutes")}
                      </div>
                      <div className={`${fontSize.small} ${theme.textSecondary}`}>
                        {language === "ru" ? timeInfo.label_ru : timeInfo.label_en}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`${fontSize.tiny} ${theme.textSecondary} mb-1`}>{t("Калории (на 1 порцию)", "Calories (per serving)")}</div>
                    <div className={`${fontSize.body} font-bold ${theme.accentText}`}>{kcalPerServing} {t("ккал", "kcal")}</div>
                    <div className={`${fontSize.tiny} ${theme.textSecondary} mt-1`}>{t("Порции:", "Servings:")} {servings}</div>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div 
                    className="h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercentage}%`, backgroundColor: timeInfo.color }}
                  ></div>
                </div>
                <div className={`${fontSize.tiny} ${theme.textSecondary} text-center`}>
                  {t(`${timeMinutes <= 15 ? 'Быстрое приготовление!' : timeMinutes <= 40 ? 'Умеренное время' : 'Требуется терпение'}`, 
                     `${timeMinutes <= 15 ? 'Quick cooking!' : timeMinutes <= 40 ? 'Moderate time' : 'Takes patience'}`)}
                </div>
              </div>

              <div className={`${theme.textSecondary} ${fontSize.small} mb-4`}>
                {t("Сложность:", "Difficulty:")} {selectedRecipe.difficulty}
              </div>

              <div className="mb-6">
                <h3 className={`${fontSize.cardTitle} font-semibold mb-2 ${theme.headerText}`}>{t("Ингредиенты:", "Ingredients:")}</h3>
                <ul className={`list-disc list-inside space-y-1 ${fontSize.body}`}>
                  {(activeRecipe.ingredients || []).map((ing, i) => {
                    const low = ing.toLowerCase();
                    const isAllergy = allergyList.some(a => a && low.includes(a));
                    const cls = isAllergy ? "text-red-600 font-semibold" : "";
                    return <li key={i} className={cls}>{ing}</li>;
                  })}
                </ul>
              </div>

              <div>
                <h3 className={`${fontSize.cardTitle} font-semibold mb-3 ${theme.headerText}`}>{t("Как готовить:", "How to cook:")}</h3>
                <ol className={`space-y-3 ${fontSize.body}`}>
                  {(activeRecipe.instructions || []).map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className={`${theme.accent} text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 ${fontSize.small} font-bold`}>{i + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-6 flex gap-2 flex-wrap">
                {(selectedRecipe.tags || []).map((tag, i) => (
                  <span key={i} className={`px-3 py-1 ${theme.accent} text-white rounded-full ${fontSize.small}`}>{tag}</span>
                ))}
              </div>

              {/* Добавление в историю питания из модального окна */}
              {registered && (
                <div className="mt-6 border-t pt-4">
                  <h4 className={`${fontSize.body} font-semibold mb-3`}>{t("Добавить в историю питания:", "Add to meal history:")}</h4>
                  <div className="flex gap-2 flex-wrap">
                    {MEAL_CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => {
                          addMealToHistory(selectedRecipe, cat);
                          closeModal();
                        }}
                        className={`px-3 py-1 rounded ${fontSize.small} ${theme.accent} ${theme.accentHover} text-white`}
                      >
                        {MEAL_LABELS[cat]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ------------------ БЛОК 3.4: Мой аккаунт ------------------ */}
      {activeScreen === "account" && (
        <div className="max-w-5xl mx-auto space-y-6">
          {!registered ? (
            // Незарегистрированный пользователь
            <div className={`${theme.cardBg} p-6 rounded-xl shadow text-center`}>
              <FaUser className={`w-16 h-16 mx-auto ${theme.textSecondary} mb-4`} />
              <h2 className={`${fontSize.subheading} font-semibold mb-3`}>{t("Создайте свой профиль", "Create your profile")}</h2>
              <p className={`${theme.textSecondary} ${fontSize.body} mb-4`}>
                {t("Заполните данные, чтобы получать персонализированные рекомендации и управлять планом питания.", 
                   "Fill in your details to get personalized recommendations and manage your meal plan.")}
              </p>
              <button
                onClick={() => setShowRegisterForm(true)}
                className={`px-6 py-3 rounded-xl ${fontSize.body} ${theme.accent} ${theme.accentHover} text-white`}
              >
                {t("Начать", "Get Started")}
              </button>
            </div>
          ) : (
            // Зарегистрированный пользователь
            <>
              {/* Профиль */}
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

              {/* История питания с улучшенным навигатором */}
              <div className={`${theme.cardBg} p-6 rounded-xl shadow`}>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <h3 className={`${fontSize.subheading} font-semibold flex items-center gap-2`}>
                    <FaCalendarAlt />
                    {t("История питания", "Meal History")}
                  </h3>
                  <button
                    onClick={() => setShowAddMealModal(true)}
                    className={`px-4 py-2 rounded-xl ${fontSize.small} ${theme.accent} ${theme.accentHover} text-white flex items-center gap-2`}
                  >
                    <FaPlus />
                    {t("Добавить прием пищи", "Add meal")}
                  </button>
                </div>

                {/* Переключатель периодов */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  {['day', 'week', 'month'].map(period => (
                    <button
                      key={period}
                      onClick={() => {
                        setViewPeriod(period);
                        setSelectedWeekDay(null);
                      }}
                      className={`px-4 py-2 rounded-xl ${fontSize.small} transition ${viewPeriod === period ? `${theme.accent} text-white` : `${theme.border} border`}`}
                    >
                      {period === 'day' && t("День", "Day")}
                      {period === 'week' && t("Неделя", "Week")}
                      {period === 'month' && t("Месяц", "Month")}
                    </button>
                  ))}
                </div>

                {/* УЛУЧШЕННЫЙ НАВИГАТОР ПО ДАТАМ */}
                <div className={`mb-6 p-4 ${theme.border} border rounded-xl`}>
                  {viewPeriod === "day" && (
                    <div className="space-y-3">
                      {/* Быстрые кнопки для дня */}
                      <div className="flex gap-2 flex-wrap justify-center">
                        <button
                          onClick={() => setSelectedDate(addDays(selectedDate, -1))}
                          className={`px-3 py-2 rounded-lg ${fontSize.small} ${theme.accent} ${theme.accentHover} text-white flex items-center gap-1`}
                        >
                          ← {t("Вчера", "Yesterday")}
                        </button>
                        <button
                          onClick={() => setSelectedDate(getDateKey(new Date()))}
                          className={`px-4 py-2 rounded-lg ${fontSize.small} ${theme.cardBg} border-2 ${theme.border} font-semibold`}
                        >
                          {t("Сегодня", "Today")}
                        </button>
                        <button
                          onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                          className={`px-3 py-2 rounded-lg ${fontSize.small} ${theme.accent} ${theme.accentHover} text-white flex items-center gap-1`}
                        >
                          {t("Завтра", "Tomorrow")} →
                        </button>
                      </div>
                      
                      {/* Текущая выбранная дата */}
                      <div className={`text-center ${fontSize.cardTitle} font-bold ${theme.headerText}`}>
                        {getPeriodDisplayText()}
                      </div>
                    </div>
                  )}

                  {viewPeriod === "week" && (
                    <div className="flex items-center justify-between gap-4">
                      <button
                        onClick={() => setSelectedDate(addWeeks(selectedDate, -1))}
                        className={`p-2 rounded-lg ${theme.accent} ${theme.accentHover} text-white`}
                      >
                        <FaChevronLeft size={20} />
                      </button>
                      
                      <div className="text-center flex-1">
                        <div className={`${fontSize.cardTitle} font-bold ${theme.headerText}`}>
                          {getPeriodDisplayText()}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setSelectedDate(addWeeks(selectedDate, 1))}
                        className={`p-2 rounded-lg ${theme.accent} ${theme.accentHover} text-white`}
                      >
                        <FaChevronRight size={20} />
                      </button>
                    </div>
                  )}

                  {viewPeriod === "month" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <button
                          onClick={() => setSelectedDate(addMonths(selectedDate, -1))}
                          className={`p-2 rounded-lg ${theme.accent} ${theme.accentHover} text-white`}
                        >
                          <FaChevronLeft size={20} />
                        </button>
                        
                        <div className={`${fontSize.cardTitle} font-bold ${theme.headerText}`}>
                          {getPeriodDisplayText()}
                        </div>
                        
                        <button
                          onClick={() => setSelectedDate(addMonths(selectedDate, 1))}
                          className={`p-2 rounded-lg ${theme.accent} ${theme.accentHover} text-white`}
                        >
                          <FaChevronRight size={20} />
                        </button>
                      </div>
                      
                      {/* Селектор месяца и года */}
                      <div className="flex gap-2 justify-center">
                        <select
                          value={new Date(selectedDate).getMonth()}
                          onChange={(e) => {
                            const d = new Date(selectedDate);
                            setSelectedDate(setMonthYear(selectedDate, parseInt(e.target.value), d.getFullYear()));
                          }}
                          className={`px-3 py-2 rounded-lg ${theme.input} ${fontSize.small}`}
                        >
                          {MONTH_NAMES.map((month, idx) => (
                            <option key={idx} value={idx}>{month}</option>
                          ))}
                        </select>
                        
                        <select
                          value={new Date(selectedDate).getFullYear()}
                          onChange={(e) => {
                            const d = new Date(selectedDate);
                            setSelectedDate(setMonthYear(selectedDate, d.getMonth(), parseInt(e.target.value)));
                          }}
                          className={`px-3 py-2 rounded-lg ${theme.input} ${fontSize.small}`}
                        >
                          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Статистика за период */}
                {(() => {
                  const stats = calculatePeriodStats();
                  return (
                    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 ${theme.border} border rounded-xl`}>
                      <div>
                        <div className={`${fontSize.small} ${theme.textSecondary}`}>{t("Всего приемов пищи", "Total meals")}</div>
                        <div className={`${fontSize.cardTitle} font-bold ${theme.accentText}`}>{stats.totalMeals}</div>
                      </div>
                      <div>
                        <div className={`${fontSize.small} ${theme.textSecondary}`}>{t("Всего калорий", "Total calories")}</div>
                        <div className={`${fontSize.cardTitle} font-bold ${theme.accentText}`}>{stats.totalCalories} {t("ккал", "kcal")}</div>
                      </div>
                      <div>
                        <div className={`${fontSize.small} ${theme.textSecondary}`}>{t("Среднее в день", "Avg per day")}</div>
                        <div className={`${fontSize.cardTitle} font-bold ${theme.accentText}`}>{stats.avgCaloriesPerDay} {t("ккал", "kcal")}</div>
                      </div>
                    </div>
                  );
                })()}

                {/* Отображение в зависимости от периода */}
                {viewPeriod === "week" && !selectedWeekDay ? (
                  // Просмотр недели - показываем дни
                  (() => {
                    const weekDays = getWeekDays(selectedDate);
                    return (
                      <div className="space-y-2">
                        <h4 className={`${fontSize.cardTitle} font-semibold mb-3 ${theme.headerText}`}>
                          {t("Дни недели", "Week days")}
                        </h4>
                        {weekDays.map((dayKey, idx) => {
                          const dayMeals = getMealsForDay(dayKey);
                          const dayCalories = calculateDayCalories(dayKey);
                          const date = new Date(dayKey);
                          const dayOfWeek = date.getDay();
                          const dayName = WEEKDAY_NAMES[dayOfWeek];
                          const dayShort = WEEKDAY_SHORT[dayOfWeek];
                          
                          return (
                            <div
                              key={dayKey}
                              onClick={() => setSelectedWeekDay(dayKey)}
                              className={`p-4 ${theme.border} border rounded-xl cursor-pointer hover:shadow-lg transition flex items-center justify-between`}
                            >
                              <div className="flex-1">
                                <div className={`${fontSize.body} font-semibold`}>
                                  {dayName} ({dayShort})
                                </div>
                                <div className={`${fontSize.small} ${theme.textSecondary}`}>
                                  {formatDate(dayKey, language)}
                                </div>
                              </div>
                              <div className="text-right mr-4">
                                <div className={`${fontSize.small} ${theme.textSecondary}`}>{t("Приемов:", "Meals:")} {dayMeals.length}</div>
                                <div className={`${fontSize.body} font-bold ${theme.accentText}`}>{dayCalories} {t("ккал", "kcal")}</div>
                              </div>
                              <FaChevronRight className={theme.textSecondary} />
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()
                ) : (
                  // Детальный просмотр дня или обычный список
                  (() => {
                    const filteredHistory = selectedWeekDay 
                      ? getMealsForDay(selectedWeekDay)
                      : getFilteredHistory();
                    
                    if (filteredHistory.length === 0) {
                      return (
                        <p className={`${theme.textSecondary} ${fontSize.body} text-center py-8`}>
                          {t("Нет записей за выбранный период", "No meals recorded for this period")}
                        </p>
                      );
                    }

                    // Заголовок с кнопкой назад для детального просмотра
                    const detailHeader = selectedWeekDay && (
                      <div className="flex items-center gap-3 mb-4">
                        <button
                          onClick={() => setSelectedWeekDay(null)}
                          className={`px-3 py-2 rounded-xl ${fontSize.small} ${theme.accent} ${theme.accentHover} text-white`}
                        >
                          ← {t("Назад к неделе", "Back to week")}
                        </button>
                        <div className={`${fontSize.cardTitle} font-semibold`}>
                          {formatDate(selectedWeekDay, language)}
                        </div>
                      </div>
                    );

                    // Группируем по категориям
                    const groupedByCategory = MEAL_CATEGORIES.reduce((acc, cat) => {
                      acc[cat] = filteredHistory.filter(entry => entry.category === cat);
                      return acc;
                    }, {});

                    return (
                      <div>
                        {detailHeader}
                        <div className="space-y-4">
                          {MEAL_CATEGORIES.map(cat => {
                            const meals = groupedByCategory[cat];
                            if (meals.length === 0) return null;

                            return (
                              <div key={cat} className={`p-4 ${theme.border} border rounded-xl`}>
                                <h4 className={`${fontSize.cardTitle} font-semibold mb-3 ${theme.headerText}`}>
                                  {MEAL_LABELS[cat]} ({meals.length})
                                </h4>
                                <div className="space-y-2">
                                  {meals.map(entry => (
                                    <div key={entry.id} className={`flex items-center justify-between p-3 ${theme.cardBg} rounded-lg`}>
                                      <div className="flex-1">
                                        <div className={`${fontSize.body} font-semibold`}>{entry.recipe.title}</div>
                                        <div className={`${fontSize.small} ${theme.textSecondary}`}>
                                          {!selectedWeekDay && formatDate(entry.date, language)} {selectedWeekDay && ''} {entry.recipe.caloriesPerServing || entry.recipe.calories} {t("ккал", "kcal")}
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => removeMealFromHistory(entry.id)}
                                        className="text-red-500 hover:text-red-700 ml-3"
                                      >
                                        <FaTimes />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>

              {/* Кастомизация */}
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
            </>
          )}

          {/* Форма регистрации/редактирования */}
          {showRegisterForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className={`${theme.cardBg} rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`${fontSize.subheading} font-bold`}>
                    {isEditingProfile ? t("Редактировать профиль", "Edit Profile") : t("Регистрация", "Registration")}
                  </h2>
                  <button
                    onClick={() => {
                      setShowRegisterForm(false);
                      setIsEditingProfile(false);
                    }}
                    className={`${theme.textSecondary} hover:${theme.text}`}
                  >
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
          )}

          {/* Модальное окно добавления приема пищи */}
          {showAddMealModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className={`${theme.cardBg} rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`${fontSize.subheading} font-bold`}>{t("Добавить прием пищи", "Add Meal")}</h2>
                  <button
                    onClick={() => setShowAddMealModal(false)}
                    className={`${theme.textSecondary} hover:${theme.text}`}
                  >
                    <FaTimes size={24} />
                  </button>
                </div>

                {/* Выбор категории */}
                <div className="mb-4">
                  <label className={`block ${fontSize.body} font-semibold mb-2`}>{t("Тип приема пищи:", "Meal type:")}</label>
                  <div className="flex gap-2 flex-wrap">
                    {MEAL_CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setAddMealCategory(cat)}
                        className={`px-4 py-2 rounded-xl ${fontSize.small} transition ${addMealCategory === cat ? `${theme.accent} text-white` : `${theme.border} border`}`}
                      >
                        {MEAL_LABELS[cat]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Список рецептов для выбора */}
                <div>
                  <h3 className={`${fontSize.cardTitle} font-semibold mb-3`}>{t("Выберите рецепт:", "Select recipe:")}</h3>
                  <div className="grid gap-2 max-h-96 overflow-y-auto">
                    {SAMPLE_RECIPES.map(r => (
                      <div
                        key={r.id}
                        onClick={() => {
                          addMealToHistory(r, addMealCategory);
                          setShowAddMealModal(false);
                        }}
                        className={`p-3 ${theme.border} border rounded-lg cursor-pointer hover:shadow-lg transition`}
                      >
                        <div className={`${fontSize.body} font-semibold`}>{r.title}</div>
                        <div className={`${fontSize.small} ${theme.textSecondary}`}>
                          {r.caloriesPerServing || r.calories} {t("ккал", "kcal")} • {r.time} {t("мин", "min")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}