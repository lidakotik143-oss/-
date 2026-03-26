// =================== БЛОК 1: Импорты и примерные данные ===================
import React, { useState, useEffect, useMemo } from "react";
import { FaTimes, FaPlus, FaMinus, FaHeart, FaRegHeart } from "react-icons/fa";
import { RECIPES_DATABASE } from './recipesData';

import {
  SUBSTITUTIONS_STORAGE_KEY,
  loadUserSubstitutions,
  saveUserSubstitutions,
  getRecipeSubKey,
  getEffectiveIngredientName
} from "./utils/substitutions";

import { PRODUCTS_BY_ID } from './data/productsNutritionById.js';
import { calculateRecipeNutrition } from "./utils/nutritionCalculator";
import { convertToGrams } from './unitConverter';

// Вынесенные компоненты
import Header from "./components/Header";
import HomeScreen from "./components/HomeScreen";
import SearchScreen from "./components/SearchScreen";
import AccountScreen from "./components/AccountScreen";
import SettingsScreen from "./components/SettingsScreen";
import AddRecipeModal from "./components/AddRecipeModal";
import NotificationModal from "./components/NotificationModal";
import RecipeVariantModal from "./components/RecipeVariantModal";

// 🌐 Context
import { AppContext } from './context/AppContext';

// ✅ Кастомные хуки
import { useAuth }          from './hooks/useAuth';
import { useMealPlan }      from './hooks/useMealPlan';
import { useWeeklyPlanner } from './hooks/useWeeklyPlanner';
import { useShoppingList }  from './hooks/useShoppingList';
import { useFavorites }     from './hooks/useFavorites';

// 🔥 Firebase
import { auth } from './firebase.js';
import { getRecipes, setUserProfile } from './firebase.js';

// 🔧 Временные точечные исправления некорректных типов блюд из базы рецептов
const RECIPE_TYPE_FIXES = {
  "паста карбонара": "обед",
  "куриные грудки с овощами": "ужин"
};

const SAMPLE_RECIPES = (RECIPES_DATABASE || []).map(r => {
  const key = (r.title || "").toString().toLowerCase().trim();
  return {
    ...r,
    type: RECIPE_TYPE_FIXES[key] ?? r.type,
    servings: r.servings ?? 2,
    caloriesPerServing: r.caloriesPerServing ?? r.calories
  };
});

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

const CM_TO_INCH = 0.393701;
const KG_TO_LB = 2.20462;
const INCH_TO_CM = 2.54;
const LB_TO_KG = 0.453592;

const DISH_TYPE_LABELS = {
  "завтрак": { ru: "Завтрак", en: "Breakfast", color: "bg-[#F4A460]" },
  "обед":    { ru: "Обед",    en: "Lunch",      color: "bg-[#8B7355]" },
  "ужин":    { ru: "Ужин",    en: "Dinner",     color: "bg-[#6B8E23]" },
  "перекус": { ru: "Перекус", en: "Snack",      color: "bg-[#DAA520]" },
  "десерт":  { ru: "Десерт",  en: "Dessert",    color: "bg-[#CD853F]" }
};

const DIET_LABELS = {
  "веган":            { ru: "Веган",            en: "Vegan"       },
  "вегетарианское":   { ru: "Вегетарианское",    en: "Vegetarian"  },
  "низкокалорийное":  { ru: "Низкокалорийное",   en: "Low calorie" }
};

const DIFFICULTY_LABELS = {
  "легкий":  { ru: "Легкий",  en: "Easy"   },
  "средний": { ru: "Средний", en: "Medium" },
  "сложный": { ru: "Сложный", en: "Hard"   }
};

const getTimeCategory = (minutes) => {
  const time = parseInt(minutes, 10);
  if (time <= 15) return { category: "fast",   emoji: "⚡",  label_ru: "Быстро",   label_en: "Fast",   color: "#10B981" };
  if (time <= 40) return { category: "medium", emoji: "⏱️", label_ru: "Средне",   label_en: "Medium", color: "#F59E0B" };
  return             { category: "slow",   emoji: "🕐",  label_ru: "Не спеша", label_en: "Slow",   color: "#EF4444" };
};

const FONTS = {
  inter:      { name: "Inter",      nameRu: "Inter",      class: "font-sans"       },
  roboto:     { name: "Roboto",     nameRu: "Roboto",     class: "font-roboto"     },
  opensans:   { name: "Open Sans",  nameRu: "Open Sans",  class: "font-opensans"   },
  lato:       { name: "Lato",       nameRu: "Lato",       class: "font-lato"       },
  montserrat: { name: "Montserrat", nameRu: "Montserrat", class: "font-montserrat" },
  poppins:    { name: "Poppins",    nameRu: "Poppins",    class: "font-poppins"    }
};

const FONT_SIZES = {
  small:  { name: "Обычный",     nameEn: "Normal",      body: "text-base", heading: "text-3xl", subheading: "text-xl",  cardTitle: "text-lg",  small: "text-sm",   tiny: "text-xs"  },
  medium: { name: "Увеличенный", nameEn: "Large",       body: "text-lg",   heading: "text-4xl", subheading: "text-2xl", cardTitle: "text-xl",  small: "text-base", tiny: "text-sm"  },
  large:  { name: "Крупный",     nameEn: "Extra Large", body: "text-xl",   heading: "text-5xl", subheading: "text-3xl", cardTitle: "text-2xl", small: "text-lg",   tiny: "text-base" }
};

const THEMES = {
  olive:  { name: "Оливковая", nameEn: "Olive",  bg: "bg-[#FEFAE0]", cardBg: "bg-white",      text: "text-[#283618]", textSecondary: "text-[#606C38]", border: "border-[#DDA15E]", input: "bg-white border-[#DDA15E] text-[#283618] placeholder-[#606C38]",       headerText: "text-[#606C38]", accentText: "text-[#BC6C25]", accent: "bg-[#606C38]", accentHover: "hover:bg-[#283618]", preview: "bg-gradient-to-br from-[#FEFAE0] via-[#DDA15E] to-[#606C38]" },
  sage:   { name: "Шалфейная", nameEn: "Sage",   bg: "bg-[#F0EAD2]", cardBg: "bg-[#DDE5B6]", text: "text-[#6C584C]", textSecondary: "text-[#A98467]",  border: "border-[#A98467]",  input: "bg-[#F0EAD2] border-[#DDE5B6] text-[#6C584C] placeholder-[#A98467]",   headerText: "text-[#6C584C]", accentText: "text-[#A98467]",  accent: "bg-[#A98467]", accentHover: "hover:bg-[#6C584C]",  preview: "bg-gradient-to-br from-[#F0EAD2] via-[#DDE5B6] to-[#A98467]" },
  forest: { name: "Лесная",    nameEn: "Forest", bg: "bg-[#172815]", cardBg: "bg-[#3E5622]", text: "text-[#EDEEC9]", textSecondary: "text-[#95B46A]",  border: "border-[#709255]",  input: "bg-[#3E5622] border-[#709255] text-[#EDEEC9] placeholder-[#95B46A]",   headerText: "text-[#95B46A]", accentText: "text-[#83781B]", accent: "bg-[#709255]", accentHover: "hover:bg-[#95B46A]",  preview: "bg-gradient-to-br from-[#172815] via-[#3E5622] to-[#709255]" }
};

const CUISINES_RU = ["американская","вьетнамская","греческая","грузинская","индийская","испанская","итальянская","китайская","корейская","мексиканская","русская","средиземноморская","тайская","турецкая","украинская","французская","японская"];
const CUISINES_EN = ["American","Chinese","French","Georgian","Greek","Indian","Italian","Japanese","Korean","Mediterranean","Mexican","Russian","Spanish","Thai","Turkish","Ukrainian","Vietnamese"];

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
  if (language === "ru") return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
};

const getWeekDays = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  const days = [];
  for (let i = 0; i < 7; i++) {
    const current = new Date(monday);
    current.setDate(monday.getDate() + i);
    days.push(getDateKey(current));
  }
  return days;
};

const getWeekRange = (date, language) => {
  const weekDays = getWeekDays(date);
  const firstDay = new Date(weekDays[0]);
  const lastDay  = new Date(weekDays[6]);
  if (language === "ru") {
    return `${firstDay.getDate()} ${MONTH_NAMES_RU[firstDay.getMonth()].toLowerCase().slice(0, 3)} — ${lastDay.getDate()} ${MONTH_NAMES_RU[lastDay.getMonth()].toLowerCase().slice(0, 3)} ${lastDay.getFullYear()}`;
  }
  return `${MONTH_NAMES_EN[firstDay.getMonth()].slice(0, 3)} ${firstDay.getDate()} — ${MONTH_NAMES_EN[lastDay.getMonth()].slice(0, 3)} ${lastDay.getDate()}, ${lastDay.getFullYear()}`;
};

const addDays = (dateStr, days) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return getDateKey(d);
};

const addWeeks  = (dateStr, weeks)  => addDays(dateStr, weeks * 7);

const addMonths = (dateStr, months) => {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return getDateKey(d);
};

const setMonthYear = (dateStr, month, year) => {
  const d = new Date(dateStr);
  d.setFullYear(year);
  d.setMonth(month);
  return getDateKey(d);
};

// =================== ДЕФОЛТНЫЕ ФЛАГИ ФИЧ ===================
const DEFAULT_FEATURE_FLAGS = {
  // Вкладки аккаунта
  showCalorieBalance:    true,
  showTopDishes:         true,
  showNutritionDashboard:true,
  showHistoryTab:        true,
  showPlannerTab:        true,
  showShoppingTab:       true,
  showFavoritesTab:      true,
  showWaterTracker:      true,
  // Виджеты главного экрана (видимость)
  home_showWelcome:      true,
  home_showNutrition:    true,
  home_showNavCards:     true,
};

// Порядок виджетов главного экрана по умолчанию
const DEFAULT_HOME_ORDER = ["welcome", "nutrition", "navCards"];
const HOME_WIDGETS_ORDER_KEY = "cookify_homeWidgetsOrder";

// Порядок виджетов экрана аккаунта по умолчанию
const DEFAULT_ACCOUNT_ORDER = [
  "showCalorieBalance",
  "showTopDishes",
  "showNutritionDashboard",
  "showHistoryTab",
  "showPlannerTab",
  "showShoppingTab",
  "showFavoritesTab",
  "showWaterTracker"
];
const ACCOUNT_WIDGETS_ORDER_KEY = "cookify_accountWidgetsOrder";

const loadHomeWidgetsOrder = () => {
  try {
    const saved = localStorage.getItem(HOME_WIDGETS_ORDER_KEY);
    if (!saved) return DEFAULT_HOME_ORDER;
    const parsed = JSON.parse(saved);
    const merged = [...parsed];
    DEFAULT_HOME_ORDER.forEach(id => { if (!merged.includes(id)) merged.push(id); });
    return merged;
  } catch {
    return DEFAULT_HOME_ORDER;
  }
};

const loadAccountWidgetsOrder = () => {
  try {
    const saved = localStorage.getItem(ACCOUNT_WIDGETS_ORDER_KEY);
    if (!saved) return DEFAULT_ACCOUNT_ORDER;
    const parsed = JSON.parse(saved);
    const merged = [...parsed];
    DEFAULT_ACCOUNT_ORDER.forEach(id => { if (!merged.includes(id)) merged.push(id); });
    return merged;
  } catch {
    return DEFAULT_ACCOUNT_ORDER;
  }
};

const FEATURE_FLAGS_KEY = "cookify_featureFlags";

const loadFeatureFlags = () => {
  try {
    const saved = localStorage.getItem(FEATURE_FLAGS_KEY);
    if (!saved) return DEFAULT_FEATURE_FLAGS;
    return { ...DEFAULT_FEATURE_FLAGS, ...JSON.parse(saved) };
  } catch {
    return DEFAULT_FEATURE_FLAGS;
  }
};

// =================== БЛОК 2: Компонент приложения ===================
export default function CookifyDemo() {
  const [activeScreen, setActiveScreen] = useState("home");
  const [language, setLanguage] = useState("ru");
  const [unitSystem, setUnitSystem] = useState("metric");
  const [currentTheme, setCurrentTheme] = useState("olive");
  const [currentFont, setCurrentFont] = useState("inter");
  const [currentFontSize, setCurrentFontSize] = useState("small");
  const [showCustomization, setShowCustomization] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [featureFlags, setFeatureFlags] = useState(loadFeatureFlags);
  const [homeWidgetsOrder, setHomeWidgetsOrder] = useState(loadHomeWidgetsOrder);
  const [accountWidgetsOrder, setAccountWidgetsOrder] = useState(loadAccountWidgetsOrder);

  const [communityRecipes, setCommunityRecipes] = useState([]);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);

  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedRecipeVariantKey, setSelectedRecipeVariantKey] = useState(null);
  const [currentServings, setCurrentServings] = useState(2);
  const [userSubstitutions, setUserSubstitutions] = useState({});
  const [openSubPicker, setOpenSubPicker] = useState(null);

  const [searchMode, setSearchMode] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [excludeIngredients, setExcludeIngredients] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    type: "", diet: "", timeRange: "", cuisine: "", difficulty: "", tag: ""
  });

  const [mealPlan, setMealPlan] = useState({ breakfast: [], lunch: [], snack: [], dinner: [] });
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [addMealCategory, setAddMealCategory] = useState("breakfast");
  const [selectedWeekDay, setSelectedWeekDay] = useState(null);
  const [accountTab, setAccountTab] = useState("history");

  const [showVariantSelectionModal, setShowVariantSelectionModal] = useState(false);
  const [variantSelectionRecipe, setVariantSelectionRecipe] = useState(null);
  const [variantSelectionCallback, setVariantSelectionCallback] = useState(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  const [initialFavorites, setInitialFavorites] = useState(null);

  const openVariantModal = (recipe, onSelect) => {
    setVariantSelectionRecipe(recipe);
    setVariantSelectionCallback(() => (key) => {
      onSelect(key);
      setShowVariantSelectionModal(false);
    });
    setShowVariantSelectionModal(true);
  };

  const handleNotify = (title, message) => {
    setNotificationTitle(title);
    setNotificationMessage(message);
    setShowNotificationModal(true);
  };

  const {
    firebaseUser, setFirebaseUser,
    userData, setUserData,
    registered, setRegistered,
    authLoading,
  } = useAuth({
    onLoggedIn: ({ user, firestoreHistory, firestorePlan, substitutions, firestoreFavorites }) => {
      setMealHistory(firestoreHistory);
      setWeeklyPlan(firestorePlan);
      setUserSubstitutions(substitutions);
      if (Array.isArray(firestoreFavorites) && firestoreFavorites.length > 0) {
        setInitialFavorites(firestoreFavorites);
      }
      const sl = localStorage.getItem(`cookify_shoppingList_${user.uid}`);
      if (sl) setShoppingList(JSON.parse(sl));
      const savedLanguage   = localStorage.getItem("cookify_language");
      const savedUnitSystem = localStorage.getItem("cookify_unitSystem");
      const savedTheme      = localStorage.getItem("cookify_theme");
      const savedFont       = localStorage.getItem("cookify_font");
      const savedFontSize   = localStorage.getItem("cookify_fontSize");
      const savedMealPlan   = localStorage.getItem("cookify_mealPlan");
      if (savedLanguage)   setLanguage(savedLanguage);
      if (savedUnitSystem) setUnitSystem(savedUnitSystem);
      if (savedTheme)      setCurrentTheme(savedTheme);
      if (savedFont)       setCurrentFont(savedFont);
      if (savedFontSize)   setCurrentFontSize(savedFontSize);
      if (savedMealPlan)   setMealPlan(JSON.parse(savedMealPlan));
    },
    onLoggedOut: () => {
      setInitialFavorites(null);
      const savedLanguage = localStorage.getItem("cookify_language");
      const savedTheme    = localStorage.getItem("cookify_theme");
      const savedFont     = localStorage.getItem("cookify_font");
      const savedFontSize = localStorage.getItem("cookify_fontSize");
      if (savedLanguage) setLanguage(savedLanguage);
      if (savedTheme)    setCurrentTheme(savedTheme);
      if (savedFont)     setCurrentFont(savedFont);
      if (savedFontSize) setCurrentFontSize(savedFontSize);
    },
  });

  const {
    mealHistory, setMealHistory,
    addMealToHistory, removeMealFromHistory,
    viewPeriod, setViewPeriod,
    selectedDate, setSelectedDate,
    getFilteredHistory, getMealsForDay,
    calculateDayCalories, calculatePeriodNutrition,
    calculatePeriodStats, todayNutrition,
  } = useMealPlan(firebaseUser, openVariantModal);

  const allRecipes = useMemo(() => [
    ...SAMPLE_RECIPES,
    ...communityRecipes.map(r => ({
      ...r,
      servings: r.servings ?? 2,
      caloriesPerServing: r.caloriesPerServing ?? r.calories ?? 0,
      variants: r.variants || []
    }))
  ], [communityRecipes]);

  const {
    weeklyPlan, setWeeklyPlan,
    plannerWeekDate, setPlannerWeekDate,
    showPlannerModal, setShowPlannerModal,
    plannerModalDate, setPlannerModalDate,
    plannerModalCategory, setPlannerModalCategory,
    addRecipeToPlanner, removeRecipeFromPlanner,
    getPlannerRecipes, calculatePlannerDayCalories,
  } = useWeeklyPlanner(firebaseUser, allRecipes, openVariantModal);

  const {
    shoppingList, setShoppingList,
    generateShoppingListFromPlanner,
  } = useShoppingList({
    firebaseUser,
    getPlannerRecipes,
    plannerWeekDate,
    userSubstitutions,
    language,
    onNotify: handleNotify,
    getWeekDays,
  });

  const { favorites, toggleFav, isFavorite } = useFavorites(firebaseUser, initialFavorites);

  useEffect(() => {
    getRecipes()
      .then(r => setCommunityRecipes(r))
      .catch(() => setCommunityRecipes([]));
  }, []);

  const handleAddRecipeClick = () => {
    if (!firebaseUser) {
      handleNotify(
        language === 'ru' ? 'Нужен аккаунт' : 'Account required',
        language === 'ru'
          ? 'Чтобы добавить рецепт, войдите в аккаунт или зарегистрируйтесь.'
          : 'Please sign in or create an account to add a recipe.'
      );
      return;
    }
    setShowAddRecipeModal(true);
  };

  useEffect(() => { localStorage.setItem("cookify_language",  language); }, [language]);
  useEffect(() => { localStorage.setItem("cookify_unitSystem", unitSystem); }, [unitSystem]);
  useEffect(() => { localStorage.setItem("cookify_theme",      currentTheme); }, [currentTheme]);
  useEffect(() => { localStorage.setItem("cookify_font",       currentFont); }, [currentFont]);
  useEffect(() => { localStorage.setItem("cookify_fontSize",   currentFontSize); }, [currentFontSize]);
  useEffect(() => { localStorage.setItem("cookify_mealPlan",   JSON.stringify(mealPlan)); }, [mealPlan]);
  useEffect(() => { localStorage.setItem(FEATURE_FLAGS_KEY,    JSON.stringify(featureFlags)); }, [featureFlags]);
  useEffect(() => { localStorage.setItem(HOME_WIDGETS_ORDER_KEY, JSON.stringify(homeWidgetsOrder)); }, [homeWidgetsOrder]);
  useEffect(() => { localStorage.setItem(ACCOUNT_WIDGETS_ORDER_KEY, JSON.stringify(accountWidgetsOrder)); }, [accountWidgetsOrder]);

  useEffect(() => { if (language === "en") setUnitSystem("imperial"); else setUnitSystem("metric"); }, [language]);
  useEffect(() => { setOpenSubPicker(null); }, [selectedRecipe, selectedRecipeVariantKey]);
  useEffect(() => { if (selectedRecipe) setCurrentServings(selectedRecipe.servings ?? 2); }, [selectedRecipe]);

  const GOALS     = language === "ru" ? GOAL_OPTIONS_RU : GOAL_OPTIONS_EN;
  const LIFESTYLE = language === "ru" ? LIFESTYLE_RU    : LIFESTYLE_EN;
  const MEAL_LABELS   = language === "ru" ? MEAL_LABELS_RU   : MEAL_LABELS_EN;
  const WEEKDAY_NAMES = language === "ru" ? WEEKDAY_NAMES_RU : WEEKDAY_NAMES_EN;
  const WEEKDAY_SHORT = language === "ru" ? WEEKDAY_SHORT_RU : WEEKDAY_SHORT_EN;
  const MONTH_NAMES   = language === "ru" ? MONTH_NAMES_RU   : MONTH_NAMES_EN;

  const CUISINE_OPTIONS = CUISINES_RU.map((ruName, idx) => ({ value: ruName, label: language === "ru" ? ruName : (CUISINES_EN[idx] || ruName) }));

  const normalize = (s) => (s || "").toString().toLowerCase();
  const TYPE_OPTIONS       = Object.keys(DISH_TYPE_LABELS);
  const DIET_OPTIONS       = Array.from(new Set((allRecipes || []).map(r => (r.diet        || "").trim()).filter(Boolean)));
  const DIFFICULTY_OPTIONS = Array.from(new Set((allRecipes || []).map(r => (r.difficulty  || "").trim()).filter(Boolean)));
  const TAG_OPTIONS        = Array.from(new Set((allRecipes || []).flatMap(r => r.tags || []))).filter(Boolean);

  const theme    = THEMES[currentTheme];
  const font     = FONTS[currentFont];
  const fontSize = FONT_SIZES[currentFontSize];
  const t = (ru, en) => language === "ru" ? ru : en;

  const convertWeight = (value, fromUnit) => {
    if (!value) return value;
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return fromUnit === "metric" ? (num * KG_TO_LB).toFixed(1) : (num * LB_TO_KG).toFixed(1);
  };

  const convertHeight = (value, fromUnit) => {
    if (!value) return value;
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return fromUnit === "metric" ? (num * CM_TO_INCH).toFixed(1) : (num * INCH_TO_CM).toFixed(1);
  };

  const getDisplayWeight = () => {
    if (!userData?.weight) return "";
    const value = unitSystem === "metric" ? userData.weight : convertWeight(userData.weight, "metric");
    const unit  = unitSystem === "metric" ? (language === "ru" ? "кг" : "kg") : "lb";
    return `${value} ${unit}`;
  };

  const getDisplayHeight = () => {
    if (!userData?.height) return "";
    const value = unitSystem === "metric" ? userData.height : convertHeight(userData.height, "metric");
    const unit  = unitSystem === "metric" ? (language === "ru" ? "см" : "cm") : "in";
    return `${value} ${unit}`;
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => { setUserData(prev => ({ ...prev, avatarURL: reader.result })); };
    reader.readAsDataURL(file);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    Object.keys(data).forEach(k => { if (data[k] === "") data[k] = ""; });
    if (userData?.avatarURL) data.avatarURL = userData.avatarURL;
    if (unitSystem === "imperial") {
      if (data.weight) data.weight = convertWeight(data.weight, "imperial");
      if (data.height) data.height = convertHeight(data.height, "imperial");
    }
    if (!data.login && userData?.login) data.login = userData.login;
    if (firebaseUser?.uid) data.uid = firebaseUser.uid;
    setUserData(data);
    setRegistered(true);
    setShowRegisterForm(false);
    setIsEditingProfile(false);
    if (data.login) {
      localStorage.setItem(`cookify_userdata_${data.login}`, JSON.stringify(data));
    }
    if (firebaseUser?.uid) {
      setUserProfile(firebaseUser.uid, data).catch(err => {
        console.error('Ошибка сохранения профиля в Firestore:', err);
      });
    }
  };

  const handleStartEditProfile = () => { setIsEditingProfile(true); setShowRegisterForm(true); };

  const handleLogout = async () => {
    const uid   = firebaseUser?.uid;
    const login = userData?.login;
    if (uid) {
      try {
        await Promise.all([
          import('./firebase.js').then(m => m.saveMealHistory(uid, mealHistory)),
          import('./firebase.js').then(m => m.saveWeeklyPlan(uid, weeklyPlan)),
        ]);
      } catch {
        localStorage.setItem(`cookify_mealHistory_${uid}`, JSON.stringify(mealHistory));
        localStorage.setItem(`cookify_weeklyPlan_${uid}`,  JSON.stringify(weeklyPlan));
      }
      localStorage.setItem(`cookify_shoppingList_${uid}`, JSON.stringify(shoppingList));
    }
    if (login) {
      localStorage.setItem(`cookify_userdata_${login}`, JSON.stringify(userData));
      const water     = localStorage.getItem('cookify_waterIntake');
      const waterGoal = localStorage.getItem('cookify_waterGoal');
      if (water)     localStorage.setItem(`cookify_waterIntake_${login}`, water);
      if (waterGoal) localStorage.setItem(`cookify_waterGoal_${login}`, waterGoal);
    }
    try { await auth.signOut(); } catch (e) { console.error(e); }
    setUserData(null); setFirebaseUser(null); setRegistered(false);
    setShowRegisterForm(false); setIsEditingProfile(false);
    setMealPlan({ breakfast: [], lunch: [], snack: [], dinner: [] });
    setMealHistory([]); setWeeklyPlan({}); setShoppingList([]); setUserSubstitutions({});
    setInitialFavorites(null);
    localStorage.removeItem("cookify_user");         localStorage.removeItem("cookify_mealPlan");
    localStorage.removeItem("cookify_mealHistory");  localStorage.removeItem("cookify_weeklyPlan");
    localStorage.removeItem("cookify_shoppingList"); localStorage.removeItem(SUBSTITUTIONS_STORAGE_KEY);
    localStorage.removeItem("cookify_waterIntake");  localStorage.removeItem("cookify_waterGoal");
  };

  const toggleUnitSystem = () => { setUnitSystem(prev => prev === "metric" ? "imperial" : "metric"); };
  const addToMealPlan = (recipe, category) => { setMealPlan(prev => ({ ...prev, [category]: [...prev[category], recipe] })); };

  const getSortedRecipesForPlanner = (category) => {
    const categoryTypeMap = { breakfast: ["завтрак"], lunch: ["обед"], snack: ["перекус", "десерт"], dinner: ["ужин"] };
    const preferredTypes  = categoryTypeMap[category] || [];
    return [...allRecipes].sort((a, b) => {
      const aMatch = preferredTypes.some(t => normalize(t) === normalize(a.type));
      const bMatch = preferredTypes.some(t => normalize(t) === normalize(b.type));
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });
  };

  const getDishTypeInfo = (type) => {
    const key  = normalize(type || "");
    const info = DISH_TYPE_LABELS[key];
    if (!info) return { label: type || "", color: "bg-gray-400" };
    return { label: language === "ru" ? info.ru : info.en, color: info.color };
  };

  const getPeriodDisplayText = () => {
    const d         = new Date(selectedDate);
    const today     = new Date();
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow  = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    if (viewPeriod === "day") {
      if (getDateKey(d) === getDateKey(today))     return t("Сегодня",  "Today");
      if (getDateKey(d) === getDateKey(yesterday)) return t("Вчера",    "Yesterday");
      if (getDateKey(d) === getDateKey(tomorrow))  return t("Завтра",   "Tomorrow");
      return formatDate(selectedDate, language);
    }
    if (viewPeriod === "week")  return getWeekRange(selectedDate, language);
    if (viewPeriod === "month") return `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
    return formatDate(selectedDate, language);
  };

  const allergyList = (userData?.allergies || "").toLowerCase().split(",").map(s => s.trim()).filter(Boolean);

  const filteredResults = useMemo(() => {
    let results = allRecipes;
    const query   = normalize(searchQuery);
    const exclude = excludeIngredients.toLowerCase().split(",").map(s => s.trim()).filter(Boolean);
    if (searchMode === "name") {
      if (query) results = results.filter(r =>
        normalize(r.title).includes(query) ||
        (r.tags || []).some(tag => normalize(tag).includes(query)) ||
        normalize(r.cuisine || "").includes(query) ||
        normalize(r.type    || "").includes(query)
      );
    } else {
      if (query) {
        const queryIngredients = query.split(",").map(s => s.trim()).filter(Boolean);
        results = results.filter(r =>
          queryIngredients.every(qi =>
            (r.ingredients || []).some(ing => {
              const name = typeof ing === 'object' ? ing.name : ing;
              return normalize(name).includes(qi);
            })
          )
        );
      }
    }
    if (exclude.length > 0) {
      results = results.filter(r =>
        !(r.ingredients || []).some(ing => {
          const name = typeof ing === 'object' ? ing.name : ing;
          return exclude.some(e => normalize(name).includes(e));
        })
      );
    }
    if (selectedFilters.type)       results = results.filter(r => normalize(r.type)       === normalize(selectedFilters.type));
    if (selectedFilters.diet)       results = results.filter(r => normalize(r.diet)       === normalize(selectedFilters.diet));
    if (selectedFilters.cuisine)    results = results.filter(r => normalize(r.cuisine)    === normalize(selectedFilters.cuisine));
    if (selectedFilters.difficulty) results = results.filter(r => normalize(r.difficulty) === normalize(selectedFilters.difficulty));
    if (selectedFilters.tag)        results = results.filter(r => (r.tags || []).some(tag => normalize(tag) === normalize(selectedFilters.tag)));
    if (selectedFilters.timeRange) {
      results = results.filter(r => {
        const time = parseInt(r.time, 10);
        if (selectedFilters.timeRange === "short")  return time <= 15;
        if (selectedFilters.timeRange === "medium") return time > 15 && time <= 40;
        if (selectedFilters.timeRange === "long")   return time > 40;
        return true;
      });
    }
    return results;
  }, [allRecipes, searchQuery, searchMode, excludeIngredients, selectedFilters]);

  // =================== ЗНАЧЕНИЕ КОНТЕКСТА ===================
  const contextValue = {
    theme, font, fontSize, language, setLanguage, unitSystem, setUnitSystem, toggleUnitSystem,
    currentTheme, setCurrentTheme, currentFont, setCurrentFont, currentFontSize, setCurrentFontSize,
    showCustomization, setShowCustomization, THEMES, FONTS, FONT_SIZES, t,
    featureFlags, setFeatureFlags,
    homeWidgetsOrder, setHomeWidgetsOrder, DEFAULT_HOME_ORDER,
    accountWidgetsOrder, setAccountWidgetsOrder, DEFAULT_ACCOUNT_ORDER,
    firebaseUser, userData, setUserData, registered, setRegistered,
    isEditingProfile, setIsEditingProfile, showRegisterForm, setShowRegisterForm,
    handleRegister, handleStartEditProfile, handleLogout, handleAvatarUpload,
    getDisplayWeight, getDisplayHeight, convertWeight, convertHeight, GOALS, LIFESTYLE, allergyList,
    activeScreen, setActiveScreen, accountTab, setAccountTab,
    allRecipes, DISH_TYPE_LABELS, DIET_LABELS, DIFFICULTY_LABELS, getDishTypeInfo,
    normalize, TYPE_OPTIONS, DIET_OPTIONS, DIFFICULTY_OPTIONS, TAG_OPTIONS, CUISINE_OPTIONS,
    getSortedRecipesForPlanner, onAddRecipeClick: handleAddRecipeClick,
    searchQuery, setSearchQuery, searchMode, setSearchMode, excludeIngredients, setExcludeIngredients,
    showFilters, setShowFilters, selectedFilters, setSelectedFilters, filteredResults,
    selectedRecipe, setSelectedRecipe, selectedRecipeVariantKey, setSelectedRecipeVariantKey,
    currentServings, setCurrentServings, userSubstitutions, setUserSubstitutions, openSubPicker, setOpenSubPicker,
    mealHistory, setMealHistory, addMealToHistory, removeMealFromHistory,
    viewPeriod, setViewPeriod, selectedDate, setSelectedDate, selectedWeekDay, setSelectedWeekDay,
    getFilteredHistory, getMealsForDay, calculateDayCalories, calculatePeriodNutrition,
    calculatePeriodStats, getPeriodDisplayText, todayNutrition,
    showAddMealModal, setShowAddMealModal, addMealCategory, setAddMealCategory,
    weeklyPlan, setWeeklyPlan, plannerWeekDate, setPlannerWeekDate,
    showPlannerModal, setShowPlannerModal, plannerModalDate, setPlannerModalDate,
    plannerModalCategory, setPlannerModalCategory, addRecipeToPlanner, removeRecipeFromPlanner,
    getPlannerRecipes, calculatePlannerDayCalories,
    shoppingList, setShoppingList, generateShoppingListFromPlanner,
    MEAL_CATEGORIES, MEAL_LABELS, WEEKDAY_NAMES, WEEKDAY_SHORT, MONTH_NAMES,
    getWeekDays, getWeekRange, formatDate, addDays, addWeeks, addMonths, setMonthYear,
    showNotificationModal, setShowNotificationModal, notificationTitle, setNotificationTitle,
    notificationMessage, setNotificationMessage,
    showVariantSelectionModal, setShowVariantSelectionModal, variantSelectionRecipe,
    setVariantSelectionRecipe, variantSelectionCallback, setVariantSelectionCallback,
    showAddRecipeModal, setShowAddRecipeModal,
    mealPlan, setMealPlan, addToMealPlan,
    favorites, toggleFav, isFavorite,
  };

  if (authLoading) {
    return (
      <div className={`min-h-screen ${THEMES.olive.bg} flex items-center justify-center`}>
        <div className="text-[#606C38] text-xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={contextValue}>
      <div className={`min-h-screen ${theme.bg} ${theme.text} ${font.class} p-4`}>
        <Header
          activeScreen={activeScreen} setActiveScreen={setActiveScreen}
          language={language} setLanguage={setLanguage}
          theme={theme} fontSize={fontSize}
        />

        <NotificationModal
          isOpen={showNotificationModal}
          onClose={() => setShowNotificationModal(false)}
          title={notificationTitle} message={notificationMessage}
          theme={theme} fontSize={fontSize} language={language}
        />

        <RecipeVariantModal
          isOpen={showVariantSelectionModal}
          onClose={() => setShowVariantSelectionModal(false)}
          recipe={variantSelectionRecipe}
          onSelect={variantSelectionCallback}
          theme={theme} fontSize={fontSize} language={language}
        />

        {selectedRecipe && (() => {
          const dishTypeInfo = getDishTypeInfo(selectedRecipe.type);
          const variants     = Array.isArray(selectedRecipe.variants) ? selectedRecipe.variants : [];
          const activeVariant = variants.length ? (variants.find(v => v.key === selectedRecipeVariantKey) || variants[0]) : null;
          const activeRecipe  = activeVariant || selectedRecipe;
          const subsKey       = getRecipeSubKey(selectedRecipe.id, activeVariant?.key || null);
          const recipeSubs    = userSubstitutions?.[subsKey] || {};
          const recipeTime    = activeVariant?.time ?? selectedRecipe.time;
          const recipeCalories = activeVariant?.caloriesPerServing ?? activeVariant?.calories ?? selectedRecipe.caloriesPerServing ?? selectedRecipe.calories;
          const timeInfo      = getTimeCategory(recipeTime);
          const timeMinutes   = parseInt(recipeTime, 10);
          const progressPercentage = Math.min((timeMinutes / 120) * 100, 100);
          const baseServings  = selectedRecipe.servings ?? 2;
          const closeModal    = () => { setSelectedRecipe(null); setSelectedRecipeVariantKey(null); };
          const servingsMultiplier = currentServings / baseServings;
          const nutritionInfo = calculateRecipeNutrition(activeRecipe.ingredients || [], baseServings);
          const totalKcal    = Math.round((nutritionInfo.total.calories || recipeCalories * baseServings || 0) * servingsMultiplier);
          const totalProtein = Math.round((nutritionInfo.total.protein  || 0) * servingsMultiplier);
          const totalFat     = Math.round((nutritionInfo.total.fat      || 0) * servingsMultiplier);
          const totalCarbs   = Math.round((nutritionInfo.total.carbs    || 0) * servingsMultiplier);
          const fav          = isFavorite(selectedRecipe.id);

          const updateSubstitution = (subId, value) => {
            setUserSubstitutions(prev => {
              const all = { ...(prev || {}) };
              const curRecipeSubs = { ...(all[subsKey] || {}) };
              if (!value) { delete curRecipeSubs[subId]; } else { curRecipeSubs[subId] = value; }
              if (Object.keys(curRecipeSubs).length === 0) { delete all[subsKey]; } else { all[subsKey] = curRecipeSubs; }
              saveUserSubstitutions(all);
              return all;
            });
          };

          const toggleSubPicker = (subId) => { setOpenSubPicker(prev => (prev === subId ? null : subId)); };

          const scaleIngredientQuantity = (quantity) => {
            if (!quantity) return '';
            const num = parseFloat(quantity.toString().replace(',', '.'));
            if (isNaN(num)) return quantity;
            const scaled = num * servingsMultiplier;
            return scaled % 1 === 0 ? scaled.toString() : scaled.toFixed(1).replace('.', ',');
          };

          return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={closeModal}>
              <div className={`${theme.cardBg} ${fontSize.body} rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6`} onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className={`${fontSize.subheading} font-bold ${theme.headerText}`}>{selectedRecipe.title}</h2>
                    {selectedRecipe.type && <span className={`${dishTypeInfo.color} text-white px-3 py-1 rounded-full ${fontSize.tiny} font-semibold inline-block mt-2`}>{dishTypeInfo.label}</span>}
                    {variants.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {variants.map(v => {
                          const isActive = v.key === activeVariant?.key;
                          return (
                            <button key={v.key} onClick={() => setSelectedRecipeVariantKey(v.key)}
                              className={`px-3 py-1 rounded-full ${fontSize.small} transition ${isActive ? `${theme.accent} text-white` : `${theme.cardBg} border ${theme.border}`}`}>
                              {language === "ru" ? (v.labelRu || v.key) : (v.labelEn || v.key)}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFav(selectedRecipe.id); }}
                    className={`p-2 rounded-full transition hover:scale-110 mr-2 ${
                      fav ? 'text-red-500' : theme.textSecondary
                    }`}
                    title={fav ? t('Удалить из избранного', 'Remove from favorites') : t('В избранное', 'Add to favorites')}
                  >
                    {fav ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
                  </button>
                  <button onClick={closeModal} className={`${theme.textSecondary} hover:${theme.text} transition`}><FaTimes size={24} /></button>
                </div>

                <div className={`${theme.cardBg} border-2 rounded-xl p-4 mb-6 shadow-md`} style={{ borderColor: timeInfo.color }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{timeInfo.emoji}</span>
                      <div>
                        <div className={`${fontSize.body} font-bold`} style={{ color: timeInfo.color }}>{timeMinutes} {t("минут", "minutes")}</div>
                        <div className={`${fontSize.small} ${theme.textSecondary}`}>{language === "ru" ? timeInfo.label_ru : timeInfo.label_en}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`${fontSize.tiny} ${theme.textSecondary} mb-1`}>{t("Всего", "Total")}</div>
                      <div className={`${fontSize.body} font-bold ${theme.accentText}`}>{totalKcal} {t("ккал", "kcal")}</div>
                      <div className="flex items-center justify-end gap-2 mt-2">
                        <button onClick={() => setCurrentServings(Math.max(1, currentServings - 1))} className={`w-6 h-6 flex items-center justify-center rounded-full ${theme.accent} text-white hover:opacity-80 transition`} disabled={currentServings <= 1}><FaMinus size={10} /></button>
                        <span className={`${fontSize.small} font-semibold ${theme.text} min-w-[60px] text-center`}>{currentServings} {t(currentServings === 1 ? "порция" : "порции", currentServings === 1 ? "serving" : "servings")}</span>
                        <button onClick={() => setCurrentServings(currentServings + 1)} className={`w-6 h-6 flex items-center justify-center rounded-full ${theme.accent} text-white hover:opacity-80 transition`}><FaPlus size={10} /></button>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className={`${theme.cardBg} rounded-lg p-2 text-center border ${theme.border}`}><div className={`${fontSize.tiny} ${theme.textSecondary}`}>{t("Белки", "Protein")}</div><div className={`${fontSize.small} font-bold ${theme.text}`}>{totalProtein}{t("г", "g")}</div></div>
                    <div className={`${theme.cardBg} rounded-lg p-2 text-center border ${theme.border}`}><div className={`${fontSize.tiny} ${theme.textSecondary}`}>{t("Жиры", "Fat")}</div><div className={`${fontSize.small} font-bold ${theme.text}`}>{totalFat}{t("г", "g")}</div></div>
                    <div className={`${theme.cardBg} rounded-lg p-2 text-center border ${theme.border}`}><div className={`${fontSize.tiny} ${theme.textSecondary}`}>{t("Углеводы", "Carbs")}</div><div className={`${fontSize.small} font-bold ${theme.text}`}>{totalCarbs}{t("г", "g")}</div></div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div className="h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%`, backgroundColor: timeInfo.color }}></div>
                  </div>
                  <div className={`${fontSize.tiny} ${theme.textSecondary} text-center`}>{t(`${timeMinutes <= 15 ? 'Быстрое приготовление!' : timeMinutes <= 40 ? 'Умеренное время' : 'Требуется терпение'}`, `${timeMinutes <= 15 ? 'Quick cooking!' : timeMinutes <= 40 ? 'Moderate time' : 'Takes patience'}`)}</div>
                </div>

                <div className={`${theme.textSecondary} ${fontSize.small} mb-4`}>{t("Сложность:", "Difficulty:")} {selectedRecipe.difficulty}</div>

                <div className="mb-6">
                  <h3 className={`${fontSize.cardTitle} font-semibold mb-2 ${theme.headerText}`}>{t("Ингредиенты:", "Ingredients:")}</h3>
                  <ul className={`space-y-2 ${fontSize.body}`}>
                    {(activeRecipe.ingredients || []).map((ing, i) => {
                      const effectiveName = getEffectiveIngredientName(ing, recipeSubs);
                      const low           = (effectiveName || "").toLowerCase();
                      const isAllergy     = allergyList.some(a => a && low.includes(a));
                      const isObj         = typeof ing === 'object';
                      const hasSubs       = isObj && ing.subId && Array.isArray(ing.substitutes) && ing.substitutes.length > 0;
                      const currentChoice = isObj && ing.subId ? (recipeSubs?.[ing.subId] || "") : "";
                      const meta          = isObj ? (ing.meta || "") : "";
                      const scaledQuantity = isObj && ing.quantity ? scaleIngredientQuantity(ing.quantity) : '';
                      const scaledUnit    = isObj ? (ing.unit || '') : '';
                      let displayText = '';
                      if (scaledQuantity && scaledUnit) {
                        const converted = convertToGrams(scaledQuantity, scaledUnit, effectiveName);
                        displayText = converted.displayText;
                      }
                      const canToggle = hasSubs && !isAllergy;
                      const isOpen    = hasSubs && openSubPicker === ing.subId;
                      return (
                        <li key={i} className={isAllergy ? "text-red-600 font-semibold" : ""}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 text-left">
                              <div className="flex flex-wrap items-baseline gap-2">
                                <span>{effectiveName}</span>
                                {meta && <span className={`inline-flex items-center px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 ${fontSize.tiny} font-medium`}>{meta}</span>}
                                {displayText && <span className={`${theme.textSecondary}`}>— {displayText}</span>}
                              </div>
                            </div>
                            {hasSubs && (
                              <div className="flex items-center gap-2">
                                <button type="button" onClick={() => canToggle && toggleSubPicker(ing.subId)} disabled={!canToggle}
                                  className={canToggle ? `w-7 h-7 flex items-center justify-center rounded-full border ${theme.border} ${theme.cardBg} hover:opacity-80 transition` : `w-7 h-7 flex items-center justify-center rounded-full border ${theme.border} opacity-40 cursor-not-allowed`}
                                  title={canToggle ? t("Показать варианты", "Show options") : t("Недоступно для аллергенов", "Unavailable for allergens")}>
                                  <span className={`${fontSize.small} leading-none`}>{isOpen ? "▴" : "▾"}</span>
                                </button>
                                <span className={`${fontSize.tiny} ${theme.textSecondary} mt-1 whitespace-nowrap`}>{currentChoice ? t("Заменено", "Replaced") : t("Можно заменить", "Replaceable")}</span>
                              </div>
                            )}
                          </div>
                          {hasSubs && isOpen && (
                            <div className={`mt-2 ml-1 p-3 rounded-xl border ${theme.border} ${theme.cardBg}`}>
                              <div className={`mb-2 ${fontSize.small} ${theme.textSecondary}`}>{t("Выберите замену:", "Choose a substitution:")}</div>
                              <div className="flex flex-wrap gap-2">
                                <button type="button" onClick={() => { updateSubstitution(ing.subId, ""); setOpenSubPicker(null); }} className={`px-3 py-1 rounded-full border ${theme.border} ${fontSize.small} hover:opacity-80 transition`}>{t("Не заменять", "No substitution")}</button>
                                {ing.substitutes.map((opt) => (
                                  <button key={opt} type="button" onClick={() => { updateSubstitution(ing.subId, opt); setOpenSubPicker(null); }} className={`px-3 py-1 rounded-full ${theme.accent} ${theme.accentHover} text-white ${fontSize.small} transition`}>{opt}</button>
                                ))}
                              </div>
                              {currentChoice && <div className={`mt-2 ${fontSize.tiny} ${theme.textSecondary}`}>{t("Текущая замена:", "Current:")} {currentChoice}</div>}
                            </div>
                          )}
                        </li>
                      );
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
                  {(selectedRecipe.tags || []).map((tag, i) => <span key={i} className={`px-3 py-1 ${theme.accent} text-white rounded-full ${fontSize.small}`}>{tag}</span>)}
                </div>

                {registered && (
                  <div className="mt-6 border-t pt-4">
                    <h4 className={`${fontSize.body} font-semibold mb-3`}>{t("Добавить в историю питания:", "Add to meal history:")}</h4>
                    <div className="flex gap-2 flex-wrap">
                      {MEAL_CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => { addMealToHistory(selectedRecipe, cat, new Date().toISOString().split('T')[0], selectedRecipeVariantKey); closeModal(); }}
                          className={`px-3 py-1 rounded ${fontSize.small} ${theme.accent} ${theme.accentHover} text-white`}>{MEAL_LABELS[cat]}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {activeScreen === "home" && (
          <HomeScreen
            t={t} theme={theme} fontSize={fontSize} language={language} setLanguage={setLanguage}
            setActiveScreen={setActiveScreen} userData={userData} todayNutrition={todayNutrition}
            setShowAddMealModal={setShowAddMealModal} setAccountTab={setAccountTab}
            SAMPLE_RECIPES={allRecipes}
          />
        )}

        {activeScreen === "search" && (
          <SearchScreen
            t={t} theme={theme} fontSize={fontSize} searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            searchMode={searchMode} setSearchMode={setSearchMode} excludeIngredients={excludeIngredients}
            setExcludeIngredients={setExcludeIngredients} showFilters={showFilters} setShowFilters={setShowFilters}
            selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} TYPE_OPTIONS={TYPE_OPTIONS}
            DIET_OPTIONS={DIET_OPTIONS} DIFFICULTY_OPTIONS={DIFFICULTY_OPTIONS} TAG_OPTIONS={TAG_OPTIONS}
            CUISINE_OPTIONS={CUISINE_OPTIONS} DISH_TYPE_LABELS={DISH_TYPE_LABELS} DIET_LABELS={DIET_LABELS}
            DIFFICULTY_LABELS={DIFFICULTY_LABELS} language={language} normalize={normalize} filteredResults={filteredResults}
            getDishTypeInfo={getDishTypeInfo} allergyList={allergyList} setSelectedRecipe={setSelectedRecipe}
            setSelectedRecipeVariantKey={setSelectedRecipeVariantKey} userSubstitutions={userSubstitutions}
            onAddRecipeClick={handleAddRecipeClick}
            isFavorite={isFavorite} toggleFav={toggleFav}
          />
        )}

        {activeScreen === "account" && (
          <AccountScreen
            t={t} theme={theme} fontSize={fontSize} language={language} registered={registered} userData={userData}
            unitSystem={unitSystem} currentTheme={currentTheme} currentFont={currentFont} currentFontSize={currentFontSize}
            showCustomization={showCustomization} setShowCustomization={setShowCustomization}
            showRegisterForm={showRegisterForm} setShowRegisterForm={setShowRegisterForm}
            isEditingProfile={isEditingProfile} setIsEditingProfile={setIsEditingProfile} GOALS={GOALS} LIFESTYLE={LIFESTYLE}
            accountTab={accountTab} setAccountTab={setAccountTab} viewPeriod={viewPeriod} setViewPeriod={setViewPeriod}
            selectedDate={selectedDate} setSelectedDate={setSelectedDate} selectedWeekDay={selectedWeekDay}
            setSelectedWeekDay={setSelectedWeekDay} MONTH_NAMES={MONTH_NAMES} WEEKDAY_NAMES={WEEKDAY_NAMES}
            WEEKDAY_SHORT={WEEKDAY_SHORT} MEAL_CATEGORIES={MEAL_CATEGORIES} MEAL_LABELS={MEAL_LABELS}
            SAMPLE_RECIPES={allRecipes} getFilteredHistory={getFilteredHistory} getMealsForDay={getMealsForDay}
            calculateDayCalories={calculateDayCalories} calculatePeriodStats={calculatePeriodStats}
            calculatePeriodNutrition={calculatePeriodNutrition} getWeekDays={getWeekDays} getWeekRange={getWeekRange}
            formatDate={formatDate} getPeriodDisplayText={getPeriodDisplayText} addDays={addDays} addWeeks={addWeeks}
            addMonths={addMonths} setMonthYear={setMonthYear} plannerWeekDate={plannerWeekDate}
            setPlannerWeekDate={setPlannerWeekDate} weeklyPlan={weeklyPlan} getPlannerRecipes={getPlannerRecipes}
            calculatePlannerDayCalories={calculatePlannerDayCalories} showAddMealModal={showAddMealModal}
            setShowAddMealModal={setShowAddMealModal} addMealCategory={addMealCategory} setAddMealCategory={setAddMealCategory}
            showPlannerModal={showPlannerModal} setShowPlannerModal={setShowPlannerModal} plannerModalDate={plannerModalDate}
            setPlannerModalDate={setPlannerModalDate} plannerModalCategory={plannerModalCategory}
            setPlannerModalCategory={setPlannerModalCategory} getSortedRecipesForPlanner={getSortedRecipesForPlanner}
            handleStartEditProfile={handleStartEditProfile} handleLogout={handleLogout} toggleUnitSystem={toggleUnitSystem}
            handleRegister={handleRegister} handleAvatarUpload={handleAvatarUpload} setCurrentTheme={setCurrentTheme}
            setCurrentFont={setCurrentFont} setCurrentFontSize={setCurrentFontSize} getDisplayWeight={getDisplayWeight}
            getDisplayHeight={getDisplayHeight} removeMealFromHistory={removeMealFromHistory}
            addMealToHistory={addMealToHistory} addRecipeToPlanner={addRecipeToPlanner}
            removeRecipeFromPlanner={removeRecipeFromPlanner} setSelectedRecipe={setSelectedRecipe}
            setSelectedRecipeVariantKey={setSelectedRecipeVariantKey} DISH_TYPE_LABELS={DISH_TYPE_LABELS}
            normalize={normalize} THEMES={THEMES} FONTS={FONTS} FONT_SIZES={FONT_SIZES}
            convertWeight={convertWeight} convertHeight={convertHeight} shoppingList={shoppingList}
            setShoppingList={setShoppingList} generateShoppingListFromPlanner={generateShoppingListFromPlanner}
            setUserData={setUserData} setRegistered={setRegistered} setMealHistory={setMealHistory}
            setWeeklyPlan={setWeeklyPlan}
            favorites={favorites} toggleFav={toggleFav} isFavorite={isFavorite}
          />
        )}

        {activeScreen === "settings" && <SettingsScreen />}

        {showAddRecipeModal && firebaseUser && (
          <AddRecipeModal
            theme={theme} fontSize={fontSize} language={language} firebaseUser={firebaseUser}
            onClose={() => setShowAddRecipeModal(false)}
            onAdded={() => { getRecipes().then(r => setCommunityRecipes(r)).catch(() => {}); }}
          />
        )}
      </div>
    </AppContext.Provider>
  );
}
