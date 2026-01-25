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
    if (savedTheme) setCurrentTheme(savedTheme);
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
    setWeeklyPlan({});
    localStorage.removeItem("cookify_user");
    localStorage.removeItem("cookify_mealHistory");
    localStorage.removeItem("cookify_weeklyPlan");
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

  // ---------- Планировщик меню ----------
  const addRecipeToPlanner = (dateKey, category, recipeId) => {
    setWeeklyPlan(prev => {
      const dayPlan = prev[dateKey] || { breakfast: [], lunch: [], snack: [], dinner: [] };
      return {
        ...prev,
        [dateKey]: {
          ...dayPlan,
          [category]: [...(dayPlan[category] || []), recipeId]
        }
      };
    });
  };

  const removeRecipeFromPlanner = (dateKey, category, recipeId) => {
    setWeeklyPlan(prev => {
      const dayPlan = prev[dateKey];
      if (!dayPlan) return prev;
      return {
        ...prev,
        [dateKey]: {
          ...dayPlan,
          [category]: (dayPlan[category] || []).filter(id => id !== recipeId)
        }
      };
    });
  };

  const getPlannerRecipes = (dateKey, category) => {
    const dayPlan = weeklyPlan[dateKey];
    if (!dayPlan) return [];
    const ids = dayPlan[category] || [];
    return ids.map(id => SAMPLE_RECIPES.find(r => r.id === id)).filter(Boolean);
  };

  const calculatePlannerDayCalories = (dateKey) => {
    const dayPlan = weeklyPlan[dateKey];
    if (!dayPlan) return 0;
    let total = 0;
    MEAL_CATEGORIES.forEach(cat => {
      const recipes = getPlannerRecipes(dateKey, cat);
      recipes.forEach(r => {
        total += r.caloriesPerServing || r.calories || 0;
      });
    });
    return total;
  };

  const getSortedRecipesForPlanner = (category) => {
    const categoryTypeMap = {
      breakfast: ["завтрак"],
      lunch: ["обед"],
      snack: ["перекус", "десерт"],
      dinner: ["ужин"]
    };
    const preferredTypes = categoryTypeMap[category] || [];

    return [...SAMPLE_RECIPES].sort((a, b) => {
      const aType = normalize(a.type);
      const bType = normalize(b.type);

      const aMatch = preferredTypes.some(t => normalize(t) === aType);
      const bMatch = preferredTypes.some(t => normalize(t) === bType);

      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });
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

      {/* Пропускаю секцию поиска - она не изменилась */}
      
      {/* ... ВСЕ ОСТАЛЬНЫЕ СЕКЦИИ ДО "Кастомизация" НЕ ИЗМЕНЕНЫ ... */}

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
                  <div className="mt-4 space-y-6">
                    {/* Тема */}
                    <div>
                      <label className={`block ${fontSize.body} font-semibold mb-2 text-center`}>{t("Цветовая тема", "Color Theme")}</label>
                      <div className="flex justify-center gap-4">
                        {Object.keys(THEMES).map(key => (
                          <button
                            key={key}
                            onClick={() => setCurrentTheme(key)}
                            className={`p-3 rounded-xl border-2 ${currentTheme === key ? `${theme.border} border-4` : "border-transparent"}`}
                          >
                            <div className={`${THEMES[key].preview} h-12 w-24 rounded mb-2`}></div>
                            <div className={`${fontSize.small} text-center`}>{THEMES[key][language === "ru" ? "name" : "nameEn"]}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Шрифт */}
                    <div>
                      <label className={`block ${fontSize.body} font-semibold mb-2 text-center`}>{t("Шрифт", "Font")}</label>
                      <div className="flex justify-center gap-2">
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
                      <label className={`block ${fontSize.body} font-semibold mb-2 text-center`}>{t("Размер текста", "Text Size")}</label>
                      <div className="flex justify-center gap-2">
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
    </div>
  );
}
