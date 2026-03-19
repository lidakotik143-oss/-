// =================== БЛОК 1: Импорты и примерные данные ===================
import React, { useState, useEffect, useMemo } from "react";
import { FaTimes, FaPlus, FaMinus } from "react-icons/fa";
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
import AddRecipeModal from "./components/AddRecipeModal";

// 🔥 Firebase
import { auth } from './firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import {
  getUserProfile,
  getMealHistory,
  saveMealHistory,
  getWeeklyPlan,
  saveWeeklyPlan,
  getRecipes,
} from './firebase.js';

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
  "обед": { ru: "Обед", en: "Lunch", color: "bg-[#8B7355]" },
  "ужин": { ru: "Ужин", en: "Dinner", color: "bg-[#6B8E23]" },
  "перекус": { ru: "Перекус", en: "Snack", color: "bg-[#DAA520]" },
  "десерт": { ru: "Десерт", en: "Dessert", color: "bg-[#CD853F]" }
};

const DIET_LABELS = {
  "веган": { ru: "Веган", en: "Vegan" },
  "вегетарианское": { ru: "Вегетарианское", en: "Vegetarian" },
  "низкокалорийное": { ru: "Низкокалорийное", en: "Low calorie" }
};

const DIFFICULTY_LABELS = {
  "легкий": { ru: "Легкий", en: "Easy" },
  "средний": { ru: "Средний", en: "Medium" },
  "сложный": { ru: "Сложный", en: "Hard" }
};

const getTimeCategory = (minutes) => {
  const time = parseInt(minutes, 10);
  if (time <= 15) return { category: "fast", emoji: "⚡", label_ru: "Быстро", label_en: "Fast", color: "#10B981" };
  if (time <= 40) return { category: "medium", emoji: "⏱️", label_ru: "Средне", label_en: "Medium", color: "#F59E0B" };
  return { category: "slow", emoji: "🕐", label_ru: "Не спеша", label_en: "Slow", color: "#EF4444" };
};

const FONTS = {
  inter: { name: "Inter", nameRu: "Inter", class: "font-sans" },
  roboto: { name: "Roboto", nameRu: "Roboto", class: "font-roboto" },
  opensans: { name: "Open Sans", nameRu: "Open Sans", class: "font-opensans" },
  lato: { name: "Lato", nameRu: "Lato", class: "font-lato" },
  montserrat: { name: "Montserrat", nameRu: "Montserrat", class: "font-montserrat" },
  poppins: { name: "Poppins", nameRu: "Poppins", class: "font-poppins" }
};

const FONT_SIZES = {
  small: { name: "Обычный", nameEn: "Normal", body: "text-base", heading: "text-3xl", subheading: "text-xl", cardTitle: "text-lg", small: "text-sm", tiny: "text-xs" },
  medium: { name: "Увеличенный", nameEn: "Large", body: "text-lg", heading: "text-4xl", subheading: "text-2xl", cardTitle: "text-xl", small: "text-base", tiny: "text-sm" },
  large: { name: "Крупный", nameEn: "Extra Large", body: "text-xl", heading: "text-5xl", subheading: "text-3xl", cardTitle: "text-2xl", small: "text-lg", tiny: "text-base" }
};

const THEMES = {
  olive: { name: "Оливковая", nameEn: "Olive", bg: "bg-[#FEFAE0]", cardBg: "bg-white", text: "text-[#283618]", textSecondary: "text-[#606C38]", border: "border-[#DDA15E]", input: "bg-white border-[#DDA15E] text-[#283618] placeholder-[#606C38]", headerText: "text-[#606C38]", accentText: "text-[#BC6C25]", accent: "bg-[#606C38]", accentHover: "hover:bg-[#283618]", preview: "bg-gradient-to-br from-[#FEFAE0] via-[#DDA15E] to-[#606C38]" },
  sage: { name: "Шалфейная", nameEn: "Sage", bg: "bg-[#F0EAD2]", cardBg: "bg-[#DDE5B6]", text: "text-[#6C584C]", textSecondary: "text-[#A98467]", border: "border-[#A98467]", input: "bg-[#F0EAD2] border-[#DDE5B6] text-[#6C584C] placeholder-[#A98467]", headerText: "text-[#6C584C]", accentText: "text-[#A98467]", accent: "bg-[#A98467]", accentHover: "hover:bg-[#6C584C]", preview: "bg-gradient-to-br from-[#F0EAD2] via-[#DDE5B6] to-[#A98467]" },
  forest: { name: "Лесная", nameEn: "Forest", bg: "bg-[#172815]", cardBg: "bg-[#3E5622]", text: "text-[#EDEEC9]", textSecondary: "text-[#95B46A]", border: "border-[#709255]", input: "bg-[#3E5622] border-[#709255] text-[#EDEEC9] placeholder-[#95B46A]", headerText: "text-[#95B46A]", accentText: "text-[#83781B]", accent: "bg-[#709255]", accentHover: "hover:bg-[#95B46A]", preview: "bg-gradient-to-br from-[#172815] via-[#3E5622] to-[#709255]" }
};

const CUISINES_RU = ["американская", "вьетнамская", "греческая", "грузинская", "индийская", "испанская", "итальянская", "китайская", "корейская", "мексиканская", "русская", "средиземноморская", "тайская", "турецкая", "украинская", "французская", "японская"];
const CUISINES_EN = ["American", "Chinese", "French", "Georgian", "Greek", "Indian", "Italian", "Japanese", "Korean", "Mediterranean", "Mexican", "Russian", "Spanish", "Thai", "Turkish", "Ukrainian", "Vietnamese"];

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
  const lastDay = new Date(weekDays[6]);
  if (language === "ru") {
    return `${firstDay.getDate()} ${MONTH_NAMES_RU[firstDay.getMonth()].toLowerCase().slice(0, 3)} — ${lastDay.getDate()} ${MONTH_NAMES_RU[lastDay.getMonth()].toLowerCase().slice(0, 3)} ${lastDay.getFullYear()}`;
  } else {
    return `${MONTH_NAMES_EN[firstDay.getMonth()].slice(0, 3)} ${firstDay.getDate()} — ${MONTH_NAMES_EN[lastDay.getMonth()].slice(0, 3)} ${lastDay.getDate()}, ${lastDay.getFullYear()}`;
  }
};

const addDays = (dateStr, days) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return getDateKey(d);
};

const addWeeks = (dateStr, weeks) => addDays(dateStr, weeks * 7);

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

const categorizeIngredient = (ingredientName) => {
  const ing = (ingredientName || '').toLowerCase();
  if (/(помидор|огурец|перец|лук|чеснок|морковь|капуста|картофель|баклажан|кабачок|тыква|свекла|редис|салат|шпинат|петрушка|укроп|базилик|кинза|руккола|авокадо|яблок|банан|апельсин|лимон|груша|персик|ягод|клубник|малин|черник|виноград|киви|манго|ананас|арбуз|дыня)/i.test(ing)) return "Овощи и фрукты";
  if (/(мясо|курица|говядина|свинина|баранина|индейка|утка|фарш|филе|рыба|лосось|тунец|форель|семга|треска|креветк|кальмар|мидии|краб)/i.test(ing)) return "Мясо и рыба";
  if (/(молоко|сливки|сметана|йогурт|кефир|творог|сыр|масло сливочное|ряженка|простокваша)/i.test(ing)) return "Молочные продукты";
  if (/(соль|перец|специи|приправ|пряност|зелень|трав|орегано|тимьян|розмарин|паприка|куркума|карри|имбирь|корица|ваниль|мускатный|кориандр|тмин|анис|гвоздика|лавровый|майоран)/i.test(ing)) return "Зелень и приправы";
  if (/(рис|гречка|овсянка|пшено|перловка|манка|кукурузная крупа|киноа|булгур|макарон|паста|спагетти|лапша|вермишель)/i.test(ing)) return "Крупы и макароны";
  return "Продукты";
};

const NotificationModal = ({ isOpen, onClose, title, message, theme, fontSize, language }) => {
  if (!isOpen) return null;
  const btnText = language === "ru" ? "Закрыть" : "Close";
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className={`${theme.cardBg} ${theme.text} ${fontSize.body} rounded-2xl max-w-lg w-full p-6 shadow-2xl border-2 ${theme.border}`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <h3 className={`${fontSize.subheading} font-bold ${theme.headerText}`}>{title}</h3>
          <button onClick={onClose} className={`${theme.textSecondary} hover:${theme.text} transition`}><FaTimes size={20} /></button>
        </div>
        <p className={`${fontSize.body} ${theme.text} mb-6`}>{message}</p>
        <div className="flex justify-end">
          <button onClick={onClose} className={`px-6 py-3 rounded-xl ${theme.accent} ${theme.accentHover} text-white font-semibold transition ${fontSize.body}`}>{btnText}</button>
        </div>
      </div>
    </div>
  );
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
  const [registered, setRegistered] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // 🔥 Рецепты из Firestore (пользовательские)
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
  const [mealHistory, setMealHistory] = useState([]);
  const [viewPeriod, setViewPeriod] = useState("day");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [addMealCategory, setAddMealCategory] = useState("breakfast");
  const [selectedWeekDay, setSelectedWeekDay] = useState(null);

  const [accountTab, setAccountTab] = useState("history");
  const [plannerWeekDate, setPlannerWeekDate] = useState(getDateKey(new Date()));
  const [weeklyPlan, setWeeklyPlan] = useState({});
  const [showPlannerModal, setShowPlannerModal] = useState(false);
  const [plannerModalDate, setPlannerModalDate] = useState(null);
  const [plannerModalCategory, setPlannerModalCategory] = useState("breakfast");

  const [shoppingList, setShoppingList] = useState([]);
  const [showVariantSelectionModal, setShowVariantSelectionModal] = useState(false);
  const [variantSelectionRecipe, setVariantSelectionRecipe] = useState(null);
  const [variantSelectionCallback, setVariantSelectionCallback] = useState(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  // 🔥 Загружаем рецепты сообщества из Firestore при старте
  useEffect(() => {
    getRecipes()
      .then(recipes => setCommunityRecipes(recipes))
      .catch(() => setCommunityRecipes([]));
  }, []);

  // Объединённый список рецептов: статичные + из Firestore
  const allRecipes = useMemo(() => {
    return [
      ...SAMPLE_RECIPES,
      ...communityRecipes.map(r => ({
        ...r,
        servings: r.servings ?? 2,
        caloriesPerServing: r.caloriesPerServing ?? r.calories ?? 0,
        variants: r.variants || []
      }))
    ];
  }, [communityRecipes]);

  // Обработчик кнопки «Добавить рецепт»
  const handleAddRecipeClick = () => {
    if (!firebaseUser) {
      setNotificationTitle(language === 'ru' ? 'Нужен аккаунт' : 'Account required');
      setNotificationMessage(language === 'ru'
        ? 'Чтобы добавить рецепт, войдите в аккаунт или зарегистрируйтесь.'
        : 'Please sign in or create an account to add a recipe.');
      setShowNotificationModal(true);
      return;
    }
    setShowAddRecipeModal(true);
  };

  // 🔥 Firebase Auth слушатель
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseUser(user);
        setRegistered(true);
        try {
          const profile = await getUserProfile(user.uid);
          if (profile) {
            setUserData({ ...profile, email: user.email, uid: user.uid });
          } else {
            setUserData({ email: user.email, uid: user.uid, login: user.email });
          }
        } catch (e) {
          setUserData({ email: user.email, uid: user.uid, login: user.email });
        }

        try {
          const [firestoreHistory, firestorePlan] = await Promise.all([
            getMealHistory(user.uid),
            getWeeklyPlan(user.uid)
          ]);
          setMealHistory(firestoreHistory);
          setWeeklyPlan(firestorePlan);
        } catch (e) {
          const savedMealHistory = localStorage.getItem(`cookify_mealHistory_${user.uid}`);
          const savedWeeklyPlan = localStorage.getItem(`cookify_weeklyPlan_${user.uid}`);
          if (savedMealHistory) setMealHistory(JSON.parse(savedMealHistory));
          if (savedWeeklyPlan) setWeeklyPlan(JSON.parse(savedWeeklyPlan));
        }

        const savedLanguage = localStorage.getItem("cookify_language");
        const savedUnitSystem = localStorage.getItem("cookify_unitSystem");
        const savedTheme = localStorage.getItem("cookify_theme");
        const savedFont = localStorage.getItem("cookify_font");
        const savedFontSize = localStorage.getItem("cookify_fontSize");
        const savedMealPlan = localStorage.getItem("cookify_mealPlan");
        const savedShoppingList = localStorage.getItem(`cookify_shoppingList_${user.uid}`);
        if (savedLanguage) setLanguage(savedLanguage);
        if (savedUnitSystem) setUnitSystem(savedUnitSystem);
        if (savedTheme) setCurrentTheme(savedTheme);
        if (savedFont) setCurrentFont(savedFont);
        if (savedFontSize) setCurrentFontSize(savedFontSize);
        if (savedMealPlan) setMealPlan(JSON.parse(savedMealPlan));
        if (savedShoppingList) setShoppingList(JSON.parse(savedShoppingList));
        setUserSubstitutions(loadUserSubstitutions());
      } else {
        setFirebaseUser(null);
        setRegistered(false);
        setUserData(null);
        const savedLanguage = localStorage.getItem("cookify_language");
        const savedTheme = localStorage.getItem("cookify_theme");
        const savedFont = localStorage.getItem("cookify_font");
        const savedFontSize = localStorage.getItem("cookify_fontSize");
        if (savedLanguage) setLanguage(savedLanguage);
        if (savedTheme) setCurrentTheme(savedTheme);
        if (savedFont) setCurrentFont(savedFont);
        if (savedFontSize) setCurrentFontSize(savedFontSize);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => { localStorage.setItem("cookify_language", language); }, [language]);
  useEffect(() => { localStorage.setItem("cookify_unitSystem", unitSystem); }, [unitSystem]);
  useEffect(() => { localStorage.setItem("cookify_theme", currentTheme); }, [currentTheme]);
  useEffect(() => { localStorage.setItem("cookify_font", currentFont); }, [currentFont]);
  useEffect(() => { localStorage.setItem("cookify_fontSize", currentFontSize); }, [currentFontSize]);
  useEffect(() => { localStorage.setItem("cookify_mealPlan", JSON.stringify(mealPlan)); }, [mealPlan]);

  useEffect(() => {
    if (!firebaseUser?.uid) return;
    const uid = firebaseUser.uid;
    const timeout = setTimeout(() => {
      saveMealHistory(uid, mealHistory).catch(() => {
        localStorage.setItem(`cookify_mealHistory_${uid}`, JSON.stringify(mealHistory));
      });
    }, 800);
    return () => clearTimeout(timeout);
  }, [mealHistory, firebaseUser]);

  useEffect(() => {
    if (!firebaseUser?.uid) return;
    const uid = firebaseUser.uid;
    const timeout = setTimeout(() => {
      saveWeeklyPlan(uid, weeklyPlan).catch(() => {
        localStorage.setItem(`cookify_weeklyPlan_${uid}`, JSON.stringify(weeklyPlan));
      });
    }, 800);
    return () => clearTimeout(timeout);
  }, [weeklyPlan, firebaseUser]);

  useEffect(() => {
    if (firebaseUser?.uid) {
      localStorage.setItem(`cookify_shoppingList_${firebaseUser.uid}`, JSON.stringify(shoppingList));
    }
  }, [shoppingList, firebaseUser]);

  useEffect(() => { if (language === "en") setUnitSystem("imperial"); else setUnitSystem("metric"); }, [language]);
  useEffect(() => { setOpenSubPicker(null); }, [selectedRecipe, selectedRecipeVariantKey]);
  useEffect(() => { if (selectedRecipe) setCurrentServings(selectedRecipe.servings ?? 2); }, [selectedRecipe]);

  const GOALS = language === "ru" ? GOAL_OPTIONS_RU : GOAL_OPTIONS_EN;
  const LIFESTYLE = language === "ru" ? LIFESTYLE_RU : LIFESTYLE_EN;
  const MEAL_LABELS = language === "ru" ? MEAL_LABELS_RU : MEAL_LABELS_EN;
  const WEEKDAY_NAMES = language === "ru" ? WEEKDAY_NAMES_RU : WEEKDAY_NAMES_EN;
  const WEEKDAY_SHORT = language === "ru" ? WEEKDAY_SHORT_RU : WEEKDAY_SHORT_EN;
  const MONTH_NAMES = language === "ru" ? MONTH_NAMES_RU : MONTH_NAMES_EN;

  const CUISINE_OPTIONS = CUISINES_RU.map((ruName, idx) => ({ value: ruName, label: language === "ru" ? ruName : (CUISINES_EN[idx] || ruName) }));

  const normalize = (s) => (s || "").toString().toLowerCase();
  const TYPE_OPTIONS = Object.keys(DISH_TYPE_LABELS);
  const DIET_OPTIONS = Array.from(new Set((allRecipes || []).map(r => (r.diet || "").trim()).filter(Boolean)));
  const DIFFICULTY_OPTIONS = Array.from(new Set((allRecipes || []).map(r => (r.difficulty || "").trim()).filter(Boolean)));
  const TAG_OPTIONS = Array.from(new Set((allRecipes || []).flatMap(r => r.tags || []))).filter(Boolean);

  const theme = THEMES[currentTheme];
  const font = FONTS[currentFont];
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
    const unit = unitSystem === "metric" ? (language === "ru" ? "кг" : "kg") : "lb";
    return `${value} ${unit}`;
  };

  const getDisplayHeight = () => {
    if (!userData?.height) return "";
    const value = unitSystem === "metric" ? userData.height : convertHeight(userData.height, "metric");
    const unit = unitSystem === "metric" ? (language === "ru" ? "см" : "cm") : "in";
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
  };

  const handleStartEditProfile = () => { setIsEditingProfile(true); setShowRegisterForm(true); };

  const handleLogout = async () => {
    const uid = firebaseUser?.uid;
    const login = userData?.login;
    if (uid) {
      try {
        await Promise.all([
          saveMealHistory(uid, mealHistory),
          saveWeeklyPlan(uid, weeklyPlan)
        ]);
      } catch (e) {
        localStorage.setItem(`cookify_mealHistory_${uid}`, JSON.stringify(mealHistory));
        localStorage.setItem(`cookify_weeklyPlan_${uid}`, JSON.stringify(weeklyPlan));
      }
      localStorage.setItem(`cookify_shoppingList_${uid}`, JSON.stringify(shoppingList));
    }
    if (login) {
      localStorage.setItem(`cookify_userdata_${login}`, JSON.stringify(userData));
      const water = localStorage.getItem('cookify_waterIntake');
      if (water) localStorage.setItem(`cookify_waterIntake_${login}`, water);
      const waterGoal = localStorage.getItem('cookify_waterGoal');
      if (waterGoal) localStorage.setItem(`cookify_waterGoal_${login}`, waterGoal);
    }
    try { await auth.signOut(); } catch (e) { console.error(e); }
    setUserData(null); setFirebaseUser(null); setRegistered(false); setShowRegisterForm(false); setIsEditingProfile(false);
    setMealPlan({ breakfast: [], lunch: [], snack: [], dinner: [] });
    setMealHistory([]); setWeeklyPlan({}); setShoppingList([]); setUserSubstitutions({});
    localStorage.removeItem("cookify_user"); localStorage.removeItem("cookify_mealPlan");
    localStorage.removeItem("cookify_mealHistory"); localStorage.removeItem("cookify_weeklyPlan");
    localStorage.removeItem("cookify_shoppingList"); localStorage.removeItem(SUBSTITUTIONS_STORAGE_KEY);
    localStorage.removeItem("cookify_waterIntake"); localStorage.removeItem("cookify_waterGoal");
  };

  const toggleUnitSystem = () => { setUnitSystem(prev => prev === "metric" ? "imperial" : "metric"); };

  const addToMealPlan = (recipe, category) => { setMealPlan(prev => ({ ...prev, [category]: [...prev[category], recipe] })); };

  const addMealToHistory = (recipe, category, date = new Date().toISOString().split('T')[0], variantKey = null) => {
    if (recipe.variants && recipe.variants.length > 0 && !variantKey) {
      setVariantSelectionRecipe(recipe);
      setVariantSelectionCallback(() => (selectedVariantKey) => {
        addMealToHistory(recipe, category, date, selectedVariantKey);
        setShowVariantSelectionModal(false);
      });
      setShowVariantSelectionModal(true);
      return;
    }
    const newEntry = { id: Date.now(), date, category, recipe, variantKey, timestamp: new Date().toISOString() };
    setMealHistory(prev => [...prev, newEntry]);
  };

  const removeMealFromHistory = (entryId) => { setMealHistory(prev => prev.filter(entry => entry.id !== entryId)); };

  const getFilteredHistory = () => {
    const selectedDateObj = new Date(selectedDate);
    return mealHistory.filter(entry => {
      const entryDate = new Date(entry.date);
      if (viewPeriod === "day") return getDateKey(entryDate) === getDateKey(selectedDateObj);
      if (viewPeriod === "week") return getWeekKey(entryDate) === getWeekKey(selectedDateObj);
      if (viewPeriod === "month") return getMonthKey(entryDate) === getMonthKey(selectedDateObj);
      return true;
    });
  };

  const getMealsForDay = (dateKey) => mealHistory.filter(entry => getDateKey(new Date(entry.date)) === dateKey);

  const calculateDayCalories = (dateKey) => {
    const dayMeals = getMealsForDay(dateKey);
    return dayMeals.reduce((sum, entry) => {
      let activeRecipe = entry.recipe;
      if (entry.variantKey && entry.recipe.variants) {
        const variant = entry.recipe.variants.find(v => v.key === entry.variantKey);
        if (variant) activeRecipe = variant;
      }
      const servings = entry.recipe.servings || 2;
      const nutritionInfo = calculateRecipeNutrition(activeRecipe.ingredients || [], servings);
      const calories = nutritionInfo.total.calories || (activeRecipe.caloriesPerServing || activeRecipe.calories || entry.recipe.caloriesPerServing || entry.recipe.calories || 0) * servings;
      return sum + calories;
    }, 0);
  };

  const calculatePeriodNutrition = () => {
    const filtered = getFilteredHistory();
    let totalCalories = 0, totalProtein = 0, totalFat = 0, totalCarbs = 0;
    filtered.forEach(entry => {
      let activeRecipe = entry.recipe;
      if (entry.variantKey && entry.recipe.variants) {
        const variant = entry.recipe.variants.find(v => v.key === entry.variantKey);
        if (variant) activeRecipe = variant;
      }
      const servings = entry.recipe.servings || 2;
      const nutritionInfo = calculateRecipeNutrition(activeRecipe.ingredients || [], servings);
      totalCalories += nutritionInfo.total.calories || (activeRecipe.caloriesPerServing || activeRecipe.calories || 0) * servings;
      totalProtein += nutritionInfo.total.protein || 0;
      totalFat += nutritionInfo.total.fat || 0;
      totalCarbs += nutritionInfo.total.carbs || 0;
    });
    return {
      totalCalories: Math.round(totalCalories),
      totalProtein: Math.round(totalProtein),
      totalFat: Math.round(totalFat),
      totalCarbs: Math.round(totalCarbs)
    };
  };

  const calculatePeriodStats = () => {
    const filtered = getFilteredHistory();
    const { totalCalories } = calculatePeriodNutrition();
    const getDaysInPeriod = () => {
      if (viewPeriod === "day") return 1;
      if (viewPeriod === "week") return 7;
      if (viewPeriod === "month") {
        const d = new Date(selectedDate);
        return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
      }
      return 1;
    };
    return { totalMeals: filtered.length, totalCalories, avgCaloriesPerDay: viewPeriod === "day" ? totalCalories : Math.round(totalCalories / getDaysInPeriod()) };
  };

  const todayNutrition = useMemo(() => {
    const todayKey = getDateKey(new Date());
    const todayMeals = mealHistory.filter(entry => getDateKey(new Date(entry.date)) === todayKey);
    let totalCalories = 0, totalProtein = 0, totalFat = 0, totalCarbs = 0;
    todayMeals.forEach(entry => {
      let activeRecipe = entry.recipe;
      if (entry.variantKey && entry.recipe.variants) {
        const variant = entry.recipe.variants.find(v => v.key === entry.variantKey);
        if (variant) activeRecipe = variant;
      }
      const servings = entry.recipe.servings || 2;
      const nutritionInfo = calculateRecipeNutrition(activeRecipe.ingredients || [], servings);
      totalCalories += nutritionInfo.total.calories || (activeRecipe.caloriesPerServing || activeRecipe.calories || 0) * servings;
      totalProtein += nutritionInfo.total.protein || 0;
      totalFat += nutritionInfo.total.fat || 0;
      totalCarbs += nutritionInfo.total.carbs || 0;
    });
    return {
      totalCalories: Math.round(totalCalories),
      totalProtein: Math.round(totalProtein),
      totalFat: Math.round(totalFat),
      totalCarbs: Math.round(totalCarbs)
    };
  }, [mealHistory]);

  const addRecipeToPlanner = (dateKey, category, recipeIdOrRecipe, variantKey = null) => {
    const recipe = typeof recipeIdOrRecipe === 'object' ? recipeIdOrRecipe : allRecipes.find(r => r.id === recipeIdOrRecipe);
    const recipeId = typeof recipeIdOrRecipe === 'object' ? recipeIdOrRecipe.id : recipeIdOrRecipe;
    if (recipe && recipe.variants && recipe.variants.length > 0 && !variantKey) {
      setVariantSelectionRecipe(recipe);
      setVariantSelectionCallback(() => (selectedVariantKey) => {
        addRecipeToPlanner(dateKey, category, recipeId, selectedVariantKey);
        setShowVariantSelectionModal(false);
      });
      setShowVariantSelectionModal(true);
      return;
    }
    setWeeklyPlan(prev => {
      const dayPlan = prev[dateKey] || { breakfast: [], lunch: [], snack: [], dinner: [] };
      const planEntry = { recipeId, variantKey };
      return { ...prev, [dateKey]: { ...dayPlan, [category]: [...(dayPlan[category] || []), planEntry] } };
    });
  };

  const removeRecipeFromPlanner = (dateKey, category, index) => {
    setWeeklyPlan(prev => {
      const dayPlan = prev[dateKey];
      if (!dayPlan) return prev;
      const newCategoryItems = [...(dayPlan[category] || [])];
      newCategoryItems.splice(index, 1);
      return { ...prev, [dateKey]: { ...dayPlan, [category]: newCategoryItems } };
    });
  };

  const getPlannerRecipes = (dateKey, category) => {
    const dayPlan = weeklyPlan[dateKey];
    if (!dayPlan) return [];
    const entries = dayPlan[category] || [];
    return entries.map(entry => {
      const recipeId = typeof entry === 'object' ? entry.recipeId : entry;
      const variantKey = typeof entry === 'object' ? entry.variantKey : null;
      const recipe = allRecipes.find(r => r.id == recipeId);
      return recipe ? { ...recipe, _variantKey: variantKey } : null;
    }).filter(Boolean);
  };

  const getDishTypeInfo = (type) => {
    const key = normalize(type || "");
    const info = DISH_TYPE_LABELS[key];
    if (!info) return { label: type || "", color: "bg-gray-400" };
    return { label: language === "ru" ? info.ru : info.en, color: info.color };
  };

  const allergyList = (userData?.allergies || "").toLowerCase().split(",").map(s => s.trim()).filter(Boolean);

  const filteredResults = useMemo(() => {
    let results = allRecipes;
    const query = normalize(searchQuery);
    const exclude = excludeIngredients.toLowerCase().split(",").map(s => s.trim()).filter(Boolean);

    if (searchMode === "name") {
      if (query) {
        results = results.filter(r =>
          normalize(r.title).includes(query) ||
          (r.tags || []).some(tag => normalize(tag).includes(query)) ||
          normalize(r.cuisine || "").includes(query) ||
          normalize(r.type || "").includes(query)
        );
      }
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

    if (selectedFilters.type) results = results.filter(r => normalize(r.type) === normalize(selectedFilters.type));
    if (selectedFilters.diet) results = results.filter(r => normalize(r.diet) === normalize(selectedFilters.diet));
    if (selectedFilters.cuisine) results = results.filter(r => normalize(r.cuisine) === normalize(selectedFilters.cuisine));
    if (selectedFilters.difficulty) results = results.filter(r => normalize(r.difficulty) === normalize(selectedFilters.difficulty));
    if (selectedFilters.tag) results = results.filter(r => (r.tags || []).some(tag => normalize(tag) === normalize(selectedFilters.tag)));
    if (selectedFilters.timeRange) {
      results = results.filter(r => {
        const time = parseInt(r.time, 10);
        if (selectedFilters.timeRange === "short") return time <= 15;
        if (selectedFilters.timeRange === "medium") return time > 15 && time <= 40;
        if (selectedFilters.timeRange === "long") return time > 40;
        return true;
      });
    }

    return results;
  }, [allRecipes, searchQuery, searchMode, excludeIngredients, selectedFilters]);

  if (authLoading) {
    return (
      <div className={`min-h-screen ${THEMES.olive.bg} flex items-center justify-center`}>
        <div className="text-[#606C38] text-xl">Загрузка...</div>
      </div>
    );
  }

  const commonProps = {
    t,
    language, setLanguage,
    unitSystem, setUnitSystem, toggleUnitSystem,
    theme, font, fontSize,
    currentTheme, setCurrentTheme,
    currentFont, setCurrentFont,
    currentFontSize, setCurrentFontSize,
    showCustomization, setShowCustomization,
    registered, setRegistered,
    userData, setUserData,
    firebaseUser,
    showRegisterForm, setShowRegisterForm,
    isEditingProfile, setIsEditingProfile,
    handleRegister, handleStartEditProfile, handleLogout,
    handleAvatarUpload,
    getDisplayWeight, getDisplayHeight,
    selectedRecipe, setSelectedRecipe,
    selectedRecipeVariantKey, setSelectedRecipeVariantKey,
    currentServings, setCurrentServings,
    userSubstitutions, setUserSubstitutions,
    openSubPicker, setOpenSubPicker,
    getRecipeSubKey, getEffectiveIngredientName, saveUserSubstitutions,
    searchMode, setSearchMode,
    searchQuery, setSearchQuery,
    excludeIngredients, setExcludeIngredients,
    showFilters, setShowFilters,
    selectedFilters, setSelectedFilters,
    TYPE_OPTIONS, DIET_OPTIONS, DIFFICULTY_OPTIONS, TAG_OPTIONS, CUISINE_OPTIONS,
    DISH_TYPE_LABELS, DIET_LABELS, DIFFICULTY_LABELS,
    normalize, getDishTypeInfo,
    filteredResults, allergyList,
    mealPlan, setMealPlan, addToMealPlan,
    mealHistory, setMealHistory, addMealToHistory, removeMealFromHistory,
    getFilteredHistory, getMealsForDay, calculateDayCalories,
    calculatePeriodNutrition, calculatePeriodStats, todayNutrition,
    viewPeriod, setViewPeriod,
    selectedDate, setSelectedDate,
    showAddMealModal, setShowAddMealModal,
    addMealCategory, setAddMealCategory,
    selectedWeekDay, setSelectedWeekDay,
    accountTab, setAccountTab,
    plannerWeekDate, setPlannerWeekDate,
    weeklyPlan, setWeeklyPlan,
    showPlannerModal, setShowPlannerModal,
    plannerModalDate, setPlannerModalDate,
    plannerModalCategory, setPlannerModalCategory,
    addRecipeToPlanner, removeRecipeFromPlanner, getPlannerRecipes,
    getWeekDays, getWeekRange, getDateKey, getWeekKey, getMonthKey, formatDate,
    addDays, addWeeks, addMonths, setMonthYear,
    MEAL_LABELS, WEEKDAY_NAMES, WEEKDAY_SHORT, MONTH_NAMES,
    shoppingList, setShoppingList,
    categorizeIngredient,
    convertToGrams,
    calculateRecipeNutrition,
    PRODUCTS_BY_ID,
    getTimeCategory,
    showVariantSelectionModal, setShowVariantSelectionModal,
    variantSelectionRecipe, setVariantSelectionRecipe,
    variantSelectionCallback, setVariantSelectionCallback,
    onAddRecipeClick: handleAddRecipeClick,
    allRecipes,
    GOALS, LIFESTYLE,
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} ${font.class} p-4`}>
      <Header
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        fontSize={fontSize}
      />

      {activeScreen === "home" && <HomeScreen {...commonProps} setActiveScreen={setActiveScreen} SAMPLE_RECIPES={allRecipes} />}
      {activeScreen === "search" && <SearchScreen {...commonProps} setActiveScreen={setActiveScreen} />}
      {activeScreen === "account" && <AccountScreen {...commonProps} />}

      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        title={notificationTitle}
        message={notificationMessage}
        theme={theme}
        fontSize={fontSize}
        language={language}
      />

      {showAddRecipeModal && firebaseUser && (
        <AddRecipeModal
          theme={theme}
          fontSize={fontSize}
          language={language}
          firebaseUser={firebaseUser}
          onClose={() => setShowAddRecipeModal(false)}
          onAdded={() => {
            // Перезагружаем рецепты сообщества после добавления
            getRecipes()
              .then(recipes => setCommunityRecipes(recipes))
              .catch(() => {});
          }}
        />
      )}
    </div>
  );
}
