// Константы приложения

export const GOAL_OPTIONS_RU = ["Снижение веса", "Набор массы", "Поддержание здоровья"];
export const GOAL_OPTIONS_EN = ["Weight loss", "Muscle gain", "Health maintenance"];
export const LIFESTYLE_RU = ["Сидячий", "Умеренно активный", "Активный"];
export const LIFESTYLE_EN = ["Sedentary", "Moderately active", "Active"];

export const MEAL_CATEGORIES = ["breakfast", "lunch", "snack", "dinner"];
export const MEAL_LABELS_RU = { breakfast: "Завтрак", lunch: "Обед", snack: "Перекус", dinner: "Ужин" };
export const MEAL_LABELS_EN = { breakfast: "Breakfast", lunch: "Lunch", snack: "Snack", dinner: "Dinner" };

export const WEEKDAY_NAMES_RU = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
export const WEEKDAY_NAMES_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const WEEKDAY_SHORT_RU = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
export const WEEKDAY_SHORT_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MONTH_NAMES_RU = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
export const MONTH_NAMES_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Маппинг типов блюд
export const DISH_TYPE_LABELS = {
  "завтрак": { 
    ru: "Завтрак", 
    en: "Breakfast",
    color: "bg-[#F4A460]"
  },
  "обед": { 
    ru: "Обед", 
    en: "Lunch",
    color: "bg-[#8B7355]"
  },
  "ужин": { 
    ru: "Ужин", 
    en: "Dinner",
    color: "bg-[#6B8E23]"
  },
  "перекус": { 
    ru: "Перекус", 
    en: "Snack",
    color: "bg-[#DAA520]"
  },
  "десерт": { 
    ru: "Десерт", 
    en: "Dessert",
    color: "bg-[#CD853F]"
  }
};

export const DIET_LABELS = {
  "веган": { ru: "Веган", en: "Vegan" },
  "вегетарианское": { ru: "Вегетарианское", en: "Vegetarian" },
  "низкокалорийное": { ru: "Низкокалорийное", en: "Low calorie" }
};

export const DIFFICULTY_LABELS = {
  "легкий": { ru: "Легкий", en: "Easy" },
  "средний": { ru: "Средний", en: "Medium" },
  "сложный": { ru: "Сложный", en: "Hard" }
};

// Шрифты
export const FONTS = {
  inter: { name: "Inter", nameRu: "Inter", class: "font-sans" },
  roboto: { name: "Roboto", nameRu: "Roboto", class: "font-['Roboto']" }
};

// Размеры шрифта
export const FONT_SIZES = {
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

// Темы
export const THEMES = {
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

// Кухни
export const CUISINES_RU = [
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

export const CUISINES_EN = [
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

// Утилиты
export const getTimeCategory = (minutes) => {
  const time = parseInt(minutes, 10);
  if (time <= 15) return { category: "fast", emoji: "⚡", label_ru: "Быстро", label_en: "Fast", color: "#10B981" };
  if (time <= 40) return { category: "medium", emoji: "⏱️", label_ru: "Средне", label_en: "Medium", color: "#F59E0B" };
  return { category: "slow", emoji: "🕐", label_ru: "Не спеша", label_en: "Slow", color: "#EF4444" };
};

export const normalize = (s) => (s || "").toString().toLowerCase();

export const getDishTypeInfo = (type) => {
  const normalized = normalize(type);
  const dishInfo = DISH_TYPE_LABELS[normalized];
  return {
    label: dishInfo?.ru || type,
    labelEn: dishInfo?.en || type,
    color: dishInfo?.color || "bg-gray-500"
  };
};