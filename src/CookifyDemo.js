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

// 🔥 Firebase
import { auth } from './firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import {
  getUserProfile,
  getMealHistory,
  saveMealHistory,
  getWeeklyPlan,
  saveWeeklyPlan
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

  // 🔥 ЭТАП 4: Firebase Auth слушатель
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

        // 🔥 ЭТАП 5: Загружаем историю питания и план меню из Firestore
        try {
          const [firestoreHistory, firestorePlan] = await Promise.all([
            getMealHistory(user.uid),
            getWeeklyPlan(user.uid)
          ]);
          setMealHistory(firestoreHistory);
          setWeeklyPlan(firestorePlan);
        } catch (e) {
          // Если Firestore недоступен — fallback на localStorage
          const savedMealHistory = localStorage.getItem(`cookify_mealHistory_${user.uid}`);
          const savedWeeklyPlan = localStorage.getItem(`cookify_weeklyPlan_${user.uid}`);
          if (savedMealHistory) setMealHistory(JSON.parse(savedMealHistory));
          if (savedWeeklyPlan) setWeeklyPlan(JSON.parse(savedWeeklyPlan));
        }

        // Остальные настройки из localStorage
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

  // 🔥 ЭТАП 5: Сохраняем историю питания в Firestore при каждом изменении
  useEffect(() => {
    if (!firebaseUser?.uid) return;
    const uid = firebaseUser.uid;
    const timeout = setTimeout(() => {
      saveMealHistory(uid, mealHistory).catch(() => {
        // Fallback: дублируем в localStorage
        localStorage.setItem(`cookify_mealHistory_${uid}`, JSON.stringify(mealHistory));
      });
    }, 800); // дебаунс 800ms чтобы не спамить Firestore при каждом нажатии
    return () => clearTimeout(timeout);
  }, [mealHistory, firebaseUser]);

  // 🔥 ЭТАП 5: Сохраняем план меню в Firestore при каждом изменении
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
  const DIET_OPTIONS = Array.from(new Set((SAMPLE_RECIPES || []).map(r => (r.diet || "").trim()).filter(Boolean)));
  const DIFFICULTY_OPTIONS = Array.from(new Set((SAMPLE_RECIPES || []).map(r => (r.difficulty || "").trim()).filter(Boolean)));
  const TAG_OPTIONS = Array.from(new Set((SAMPLE_RECIPES || []).flatMap(r => r.tags || []))).filter(Boolean);

  const theme = THEMES[currentTheme];
  const font = FONTS[currentFont];
  const fontSize = FONT_SIZES[currentFontSize];

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
    // Финальное сохранение в Firestore перед выходом
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
    const recipe = typeof recipeIdOrRecipe === 'object' ? recipeIdOrRecipe : SAMPLE_RECIPES.find(r => r.id === recipeIdOrRecipe);
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
      const recipe = SAMPLE_RECIPES.find(r => r.id === recipeId);
      return recipe ? { ...recipe, selectedVariantKey: variantKey } : null;
    }).filter(Boolean);
  };

  const calculatePlannerDayCalories = (dateKey) => {
    const dayPlan = weeklyPlan[dateKey];
    if (!dayPlan) return 0;
    let total = 0;
    MEAL_CATEGORIES.forEach(cat => {
      const recipes = getPlannerRecipes(dateKey, cat);
      recipes.forEach(r => {
        if (r.selectedVariantKey && r.variants) {
          const variant = r.variants.find(v => v.key === r.selectedVariantKey);
          if (variant) { total += variant.caloriesPerServing || variant.calories || r.caloriesPerServing || r.calories || 0; return; }
        }
        total += r.caloriesPerServing || r.calories || 0;
      });
    });
    return total;
  };

  const generateShoppingListFromPlanner = () => {
    const weekDays = getWeekDays(plannerWeekDate);
    const allIngredients = [];
    weekDays.forEach(dateKey => {
      MEAL_CATEGORIES.forEach(cat => {
        const recipes = getPlannerRecipes(dateKey, cat);
        recipes.forEach(recipeWithVariant => {
          let ingredients = recipeWithVariant.ingredients || [];
          if (recipeWithVariant.selectedVariantKey && recipeWithVariant.variants) {
            const variant = recipeWithVariant.variants.find(v => v.key === recipeWithVariant.selectedVariantKey);
            if (variant && variant.ingredients) ingredients = variant.ingredients;
          }
          const subsKey = getRecipeSubKey(recipeWithVariant.id, recipeWithVariant.selectedVariantKey || null);
          const recipeSubs = userSubstitutions?.[subsKey] || {};
          ingredients.forEach(ing => {
            if (typeof ing === 'object' && ing.name) {
              const effectiveName = getEffectiveIngredientName(ing, recipeSubs);
              allIngredients.push({ name: effectiveName, quantity: ing.quantity || '', unit: ing.unit || 'шт' });
            } else if (typeof ing === 'string') {
              const parts = ing.split('—').map(s => s.trim());
              const name = parts[0] || ing;
              const quantityStr = parts[1] || '';
              const match = quantityStr.match(/(\d+(?:[.,]\d+)?)\s*([а-яА-Яa-zA-Z.\s]+)?/);
              const quantity = match ? match[1].replace(',', '.') : '';
              const unit = match && match[2] ? match[2].trim() : 'шт';
              allIngredients.push({ name, quantity, unit });
            }
          });
        });
      });
    });
    const uniqueIngredients = [];
    const seen = new Set();
    allIngredients.forEach(ing => {
      const key = (ing.name || '').toLowerCase();
      if (!seen.has(key)) { seen.add(key); uniqueIngredients.push(ing); }
    });
    const newItems = uniqueIngredients.map(ing => ({
      id: Date.now() + Math.random(), name: ing.name, quantity: ing.quantity, baseQuantity: ing.quantity,
      unit: ing.unit, category: categorizeIngredient(ing.name), checked: false, isManual: false
    }));
    setShoppingList(prev => {
      const existingNames = new Set(prev.map(item => item.name.toLowerCase()));
      const filtered = newItems.filter(item => !existingNames.has(item.name.toLowerCase()));
      return [...prev, ...filtered];
    });
    setNotificationTitle(language === "ru" ? "Готово" : "Done");
    setNotificationMessage(language === "ru" ? `Добавлено ${newItems.length} продуктов из плана меню на неделю!` : `Added ${newItems.length} items from your weekly meal plan!`);
    setShowNotificationModal(true);
  };

  const getSortedRecipesForPlanner = (category) => {
    const categoryTypeMap = { breakfast: ["завтрак"], lunch: ["обед"], snack: ["перекус", "десерт"], dinner: ["ужин"] };
    const preferredTypes = categoryTypeMap[category] || [];
    return [...SAMPLE_RECIPES].sort((a, b) => {
      const aMatch = preferredTypes.some(t => normalize(t) === normalize(a.type));
      const bMatch = preferredTypes.some(t => normalize(t) === normalize(b.type));
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });
  };

  const filteredResults = SAMPLE_RECIPES.filter(r => {
    const baseIngStr = (r.ingredients || []).map(ing => typeof ing === 'object' ? ing.name : ing).join(",").toLowerCase();
    const variantIngStrs = (r.variants || []).map(v => (v.ingredients || []).map(ing => typeof ing === 'object' ? ing.name : ing).join(",").toLowerCase());
    let matchesSearch = true;
    if (searchMode === "name" && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      matchesSearch = r.title.toLowerCase().includes(q) || (r.tags || []).some(t => t.toLowerCase().includes(q));
    } else if (searchMode === "ingredients" && searchQuery.trim()) {
      const terms = searchQuery.split(",").map(t => t.trim().toLowerCase()).filter(Boolean);
      const pools = [baseIngStr, ...variantIngStrs];
      matchesSearch = pools.some(pool => terms.every(term => pool.includes(term)));
    }
    let matchesExclude = true;
    if (excludeIngredients.trim()) {
      const exs = excludeIngredients.split(",").map(t => t.trim().toLowerCase()).filter(Boolean);
      matchesExclude = !(r.ingredients || []).some(ing => {
        const ingName = typeof ing === 'object' ? ing.name : ing;
        return exs.some(e => ingName.toLowerCase().includes(e));
      });
    }
    let matchesFilters = true;
    if (selectedFilters.type) matchesFilters = matchesFilters && normalize(r.type) === normalize(selectedFilters.type);
    if (selectedFilters.diet) matchesFilters = matchesFilters && normalize(r.diet).includes(normalize(selectedFilters.diet));
    if (selectedFilters.cuisine) matchesFilters = matchesFilters && normalize(r.cuisine) === normalize(selectedFilters.cuisine);
    if (selectedFilters.difficulty) matchesFilters = matchesFilters && normalize(r.difficulty) === normalize(selectedFilters.difficulty);
    if (selectedFilters.tag) matchesFilters = matchesFilters && (r.tags || []).map(t => t.toLowerCase().includes(selectedFilters.tag.toLowerCase()));
    if (selectedFilters.timeRange) {
      const tVal = parseInt(r.time || "0", 10);
      if (selectedFilters.timeRange === "short") matchesFilters = matchesFilters && tVal <= 15;
      if (selectedFilters.timeRange === "medium") matchesFilters = matchesFilters && tVal > 15 && tVal <= 40;
      if (selectedFilters.timeRange === "long") matchesFilters = matchesFilters && tVal > 40;
    }
    return matchesSearch && matchesExclude && matchesFilters;
  });

  const getAllergyList = () => {
    if (!userData?.allergies) return [];
    return userData.allergies.toLowerCase().split(/[;,]+/).map(s => s.trim()).filter(Boolean);
  };
  const allergyList = getAllergyList();

  const t = (ru, en) => (language === "ru" ? ru : en);

  const getDishTypeInfo = (type) => {
    const normalized = normalize(type);
    const dishInfo = DISH_TYPE_LABELS[normalized];
    return { label: dishInfo?.[language] || type, color: dishInfo?.color || "bg-gray-500" };
  };

  const getPeriodDisplayText = () => {
    const d = new Date(selectedDate);
    if (viewPeriod === "day") {
      const today = new Date();
      const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
      const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
      if (getDateKey(d) === getDateKey(today)) return t("Сегодня", "Today");
      if (getDateKey(d) === getDateKey(yesterday)) return t("Вчера", "Yesterday");
      if (getDateKey(d) === getDateKey(tomorrow)) return t("Завтра", "Tomorrow");
      return formatDate(selectedDate, language);
    } else if (viewPeriod === "week") {
      return getWeekRange(selectedDate, language);
    } else if (viewPeriod === "month") {
      return `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
    }
    return formatDate(selectedDate, language);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FEFAE0]">
        <div className="text-[#606C38] text-xl font-semibold">🍳 Загрузка Cookify...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} ${font.class} ${fontSize.body} p-6 transition-all duration-500`}>
      <Header activeScreen={activeScreen} setActiveScreen={setActiveScreen} language={language} setLanguage={setLanguage} theme={theme} fontSize={fontSize} />

      <NotificationModal isOpen={showNotificationModal} onClose={() => setShowNotificationModal(false)} title={notificationTitle} message={notificationMessage} theme={theme} fontSize={fontSize} language={language} />

      {activeScreen === "home" && (
        <HomeScreen
          userData={userData}
          language={language}
          setLanguage={setLanguage}
          setActiveScreen={setActiveScreen}
          theme={theme}
          fontSize={fontSize}
          todayNutrition={todayNutrition}
          setShowAddMealModal={setShowAddMealModal}
          setAccountTab={setAccountTab}
        />
      )}

      {activeScreen === "search" && (
        <SearchScreen
          t={t} theme={theme} fontSize={fontSize} searchQuery={searchQuery} setSearchQuery={setSearchQuery} searchMode={searchMode} setSearchMode={setSearchMode}
          excludeIngredients={excludeIngredients} setExcludeIngredients={setExcludeIngredients} showFilters={showFilters} setShowFilters={setShowFilters}
          selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} TYPE_OPTIONS={TYPE_OPTIONS} DIET_OPTIONS={DIET_OPTIONS}
          DIFFICULTY_OPTIONS={DIFFICULTY_OPTIONS} TAG_OPTIONS={TAG_OPTIONS} CUISINE_OPTIONS={CUISINE_OPTIONS} DISH_TYPE_LABELS={DISH_TYPE_LABELS}
          DIET_LABELS={DIET_LABELS} DIFFICULTY_LABELS={DIFFICULTY_LABELS} language={language} normalize={normalize} filteredResults={filteredResults}
          getDishTypeInfo={getDishTypeInfo} allergyList={allergyList} setSelectedRecipe={setSelectedRecipe} setSelectedRecipeVariantKey={setSelectedRecipeVariantKey}
          userSubstitutions={userSubstitutions}
        />
      )}

      {showVariantSelectionModal && variantSelectionRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowVariantSelectionModal(false)}>
          <div className={`${theme.cardBg} ${fontSize.body} rounded-2xl max-w-md w-full p-6`} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h3 className={`${fontSize.cardTitle} font-bold ${theme.headerText}`}>{t("Выберите вариант рецепта", "Choose recipe variant")}</h3>
              <button onClick={() => setShowVariantSelectionModal(false)} className={`${theme.textSecondary} hover:${theme.text} transition`}><FaTimes size={20} /></button>
            </div>
            <p className={`${fontSize.small} ${theme.textSecondary} mb-4`}>{variantSelectionRecipe.title}</p>
            <div className="space-y-2">
              {variantSelectionRecipe.variants.map(variant => (
                <button key={variant.key} onClick={() => variantSelectionCallback && variantSelectionCallback(variant.key)}
                  className={`w-full p-3 rounded-lg ${theme.accent} ${theme.accentHover} text-white transition ${fontSize.body}`}>
                  {language === "ru" ? (variant.labelRu || variant.key) : (variant.labelEn || variant.key)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedRecipe && (() => {
        const dishTypeInfo = getDishTypeInfo(selectedRecipe.type);
        const variants = Array.isArray(selectedRecipe.variants) ? selectedRecipe.variants : [];
        const activeVariant = variants.length ? (variants.find(v => v.key === selectedRecipeVariantKey) || variants[0]) : null;
        const activeRecipe = activeVariant || selectedRecipe;
        const subsKey = getRecipeSubKey(selectedRecipe.id, activeVariant?.key || null);
        const recipeSubs = userSubstitutions?.[subsKey] || {};
        const recipeTime = activeVariant?.time ?? selectedRecipe.time;
        const recipeCalories = activeVariant?.caloriesPerServing ?? activeVariant?.calories ?? selectedRecipe.caloriesPerServing ?? selectedRecipe.calories;
        const timeInfo = getTimeCategory(recipeTime);
        const timeMinutes = parseInt(recipeTime, 10);
        const progressPercentage = Math.min((timeMinutes / 120) * 100, 100);
        const baseServings = selectedRecipe.servings ?? 2;
        const closeModal = () => { setSelectedRecipe(null); setSelectedRecipeVariantKey(null); };
        const servingsMultiplier = currentServings / baseServings;
        const nutritionInfo = calculateRecipeNutrition(activeRecipe.ingredients || [], baseServings);
        const totalKcal = Math.round((nutritionInfo.total.calories || recipeCalories * baseServings || 0) * servingsMultiplier);
        const totalProtein = Math.round((nutritionInfo.total.protein || 0) * servingsMultiplier);
        const totalFat = Math.round((nutritionInfo.total.fat || 0) * servingsMultiplier);
        const totalCarbs = Math.round((nutritionInfo.total.carbs || 0) * servingsMultiplier);

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
                <button onClick={closeModal} className={`${theme.textSecondary} hover:${theme.text} transition ml-4`}><FaTimes size={24} /></button>
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
                    const low = (effectiveName || "").toLowerCase();
                    const isAllergy = allergyList.some(a => a && low.includes(a));
                    const isObj = typeof ing === 'object';
                    const hasSubs = isObj && ing.subId && Array.isArray(ing.substitutes) && ing.substitutes.length > 0;
                    const currentChoice = isObj && ing.subId ? (recipeSubs?.[ing.subId] || "") : "";
                    const meta = isObj ? (ing.meta || "") : "";
                    const scaledQuantity = isObj && ing.quantity ? scaleIngredientQuantity(ing.quantity) : '';
                    const scaledUnit = isObj ? (ing.unit || '') : '';
                    let displayText = '';
                    if (scaledQuantity && scaledUnit) {
                      const converted = convertToGrams(scaledQuantity, scaledUnit, effectiveName);
                      displayText = converted.displayText;
                    }
                    const canToggle = hasSubs && !isAllergy;
                    const isOpen = hasSubs && openSubPicker === ing.subId;
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

      {activeScreen === "account" && (
        <AccountScreen
          t={t} theme={theme} fontSize={fontSize} language={language} registered={registered} userData={userData} unitSystem={unitSystem}
          currentTheme={currentTheme} currentFont={currentFont} currentFontSize={currentFontSize} showCustomization={showCustomization}
          setShowCustomization={setShowCustomization} showRegisterForm={showRegisterForm} setShowRegisterForm={setShowRegisterForm}
          isEditingProfile={isEditingProfile} setIsEditingProfile={setIsEditingProfile} GOALS={GOALS} LIFESTYLE={LIFESTYLE}
          accountTab={accountTab} setAccountTab={setAccountTab} viewPeriod={viewPeriod} setViewPeriod={setViewPeriod}
          selectedDate={selectedDate} setSelectedDate={setSelectedDate} selectedWeekDay={selectedWeekDay} setSelectedWeekDay={setSelectedWeekDay}
          MONTH_NAMES={MONTH_NAMES} WEEKDAY_NAMES={WEEKDAY_NAMES} WEEKDAY_SHORT={WEEKDAY_SHORT} MEAL_CATEGORIES={MEAL_CATEGORIES} MEAL_LABELS={MEAL_LABELS}
          SAMPLE_RECIPES={SAMPLE_RECIPES} getFilteredHistory={getFilteredHistory} getMealsForDay={getMealsForDay} calculateDayCalories={calculateDayCalories}
          calculatePeriodStats={calculatePeriodStats} calculatePeriodNutrition={calculatePeriodNutrition} getWeekDays={getWeekDays} getWeekRange={getWeekRange} formatDate={formatDate}
          getPeriodDisplayText={getPeriodDisplayText} addDays={addDays} addWeeks={addWeeks} addMonths={addMonths} setMonthYear={setMonthYear}
          plannerWeekDate={plannerWeekDate} setPlannerWeekDate={setPlannerWeekDate} weeklyPlan={weeklyPlan} getPlannerRecipes={getPlannerRecipes}
          calculatePlannerDayCalories={calculatePlannerDayCalories} showAddMealModal={showAddMealModal} setShowAddMealModal={setShowAddMealModal}
          addMealCategory={addMealCategory} setAddMealCategory={setAddMealCategory} showPlannerModal={showPlannerModal} setShowPlannerModal={setShowPlannerModal}
          plannerModalDate={plannerModalDate} setPlannerModalDate={setPlannerModalDate} plannerModalCategory={plannerModalCategory}
          setPlannerModalCategory={setPlannerModalCategory} getSortedRecipesForPlanner={getSortedRecipesForPlanner} handleStartEditProfile={handleStartEditProfile}
          handleLogout={handleLogout} toggleUnitSystem={toggleUnitSystem} handleRegister={handleRegister} handleAvatarUpload={handleAvatarUpload}
          setCurrentTheme={setCurrentTheme} setCurrentFont={setCurrentFont} setCurrentFontSize={setCurrentFontSize} getDisplayWeight={getDisplayWeight}
          getDisplayHeight={getDisplayHeight} removeMealFromHistory={removeMealFromHistory} addMealToHistory={addMealToHistory}
          addRecipeToPlanner={addRecipeToPlanner} removeRecipeFromPlanner={removeRecipeFromPlanner} setSelectedRecipe={setSelectedRecipe}
          setSelectedRecipeVariantKey={setSelectedRecipeVariantKey} DISH_TYPE_LABELS={DISH_TYPE_LABELS} normalize={normalize} THEMES={THEMES}
          FONTS={FONTS} FONT_SIZES={FONT_SIZES} convertWeight={convertWeight} convertHeight={convertHeight}
          shoppingList={shoppingList} setShoppingList={setShoppingList} generateShoppingListFromPlanner={generateShoppingListFromPlanner}
          setUserData={setUserData} setRegistered={setRegistered} setMealHistory={setMealHistory}
          setWeeklyPlan={setWeeklyPlan}
        />
      )}
    </div>
  );
}
