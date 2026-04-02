// Конвертер единиц измерения для ингредиентов
// Конвертирует стаканы, ложки и другие меры в граммы с отображением оригинальной меры в скобках

// Коэффициенты конвертации для разных продуктов
const CONVERSION_COEFFICIENTS = {
  // Стакан 250 мл
  'стакан': {
    default: 250, // вода/молоко
    'мука': 160,
    'сахар': 200,
    'рис': 230,
    'овсяные хлопья': 100,
    'кокосовое молоко': 250,
    'йогурт': 250,
    'сливки': 250,
    'молоко': 250,
    'ягоды': 140,
    'замороженные ягоды': 140
  },
  
  // Столовая ложка
  'ст. л.': {
    default: 15, // жидкости
    'мука': 25,
    'сахар': 20,
    'мёд': 30,
    'молоко': 15,
    'растительное масло': 17,
    'оливковое масло': 17,
    'сливочное масло': 15,
    'сметана': 25,
    'паста карри': 15,
    'томатная паста': 25
  },
  
  // Чайная ложка
  'ч. л.': {
    default: 5, // жидкости
    'сахар': 7,
    'соль': 10,
    'мёд': 10,
    'специи': 5,
    'карри': 5,
    'имбирь': 5,
    'кориандр': 5,
    'куркума': 5
  }
};

/**
 * Определяет продукт по имени ингредиента для правильной конвертации
 */
function identifyProduct(ingredientName) {
  const name = ingredientName.toLowerCase();
  
  // Мука и мучные изделия
  if (name.includes('мука')) return 'мука';
  if (name.includes('сахар')) return 'сахар';
  if (name.includes('рис')) return 'рис';
  if (name.includes('овсян')) return 'овсяные хлопья';
  if (name.includes('кокосов') && name.includes('молоко')) return 'кокосовое молоко';
  if (name.includes('йогурт')) return 'йогурт';
  if (name.includes('сливки')) return 'сливки';
  if (name.includes('молоко')) return 'молоко';
  if (name.includes('ягод')) return 'ягоды';
  if (name.includes('замороженн') && name.includes('ягод')) return 'замороженные ягоды';
  if (name.includes('мёд') || name.includes('мед')) return 'мёд';
  if (name.includes('масло растительное')) return 'растительное масло';
  if (name.includes('масло оливковое')) return 'оливковое масло';
  if (name.includes('масло сливочное')) return 'сливочное масло';
  if (name.includes('сметан')) return 'сметана';
  if (name.includes('карри')) return 'карри';
  if (name.includes('томатн') && name.includes('паста')) return 'томатная паста';
  if (name.includes('имбирь')) return 'имбирь';
  if (name.includes('кориандр')) return 'кориандр';
  if (name.includes('куркума')) return 'куркума';
  if (name.includes('соль')) return 'соль';
  
  return 'default';
}

/**
 * Конвертирует количество и единицу в граммы
 * @param {string} quantity - Количество (может быть '1-2', '0.5', '200' и т.д.)
 * @param {string} unit - Единица измерения ('стакан', 'ст. л.', 'ч. л.', 'г', 'мл', 'шт')
 * @param {string} ingredientName - Название ингредиента для определения продукта
 * @returns {object} { grams: число_в_граммах, displayText: 'отображаемый_текст' }
 */
export function convertToGrams(quantity, unit, ingredientName) {
  // Если уже в граммах или пустое значение
  if (!quantity || unit === 'г' || unit === 'мл' || unit === 'шт' || unit === '') {
    return {
      grams: parseFloat(quantity) || 0,
      displayText: quantity ? `${quantity} ${unit}`.trim() : ''
    };
  }
  
  // Парсим количество (может быть диапазон типа '1-2')
  let numericQuantity = 0;
  if (quantity.includes('-')) {
    const parts = quantity.split('-');
    numericQuantity = (parseFloat(parts[0]) + parseFloat(parts[1])) / 2;
  } else {
    numericQuantity = parseFloat(quantity);
  }
  
  if (isNaN(numericQuantity)) {
    return {
      grams: 0,
      displayText: `${quantity} ${unit}`.trim()
    };
  }
  
  // Определяем продукт
  const product = identifyProduct(ingredientName);
  
  // Получаем коэффициент конвертации
  const coefficients = CONVERSION_COEFFICIENTS[unit];
  if (!coefficients) {
    return {
      grams: 0,
      displayText: `${quantity} ${unit}`.trim()
    };
  }
  
  const coefficient = coefficients[product] || coefficients.default;
  const grams = Math.round(numericQuantity * coefficient);
  
  // Формируем текст: если граммов меньше 1 — не показываем скобку
  const originalText = `${quantity} ${unit}`.trim();
  const displayText = grams >= 1
    ? `${originalText} (≈ ${grams} г)`
    : originalText;
  
  return {
    grams: grams,
    displayText: displayText
  };
}

/**
 * Форматирует ингредиент с унифицированными единицами
 * @param {object} ingredient - Объект ингредиента { name, quantity, unit, ... }
 * @returns {string} Отформатированная строка ингредиента
 */
export function formatIngredient(ingredient) {
  if (!ingredient.quantity || !ingredient.unit) {
    return ingredient.name;
  }
  
  const conversion = convertToGrams(ingredient.quantity, ingredient.unit, ingredient.name);
  const meta = ingredient.meta ? ` (${ingredient.meta})` : '';
  
  return `${ingredient.name}${meta}: ${conversion.displayText}`;
}

/**
 * Обрабатывает массив ингредиентов и возвращает их с унифицированными единицами
 * @param {Array} ingredients - Массив ингредиентов
 * @returns {Array} Массив отформатированных строк
 */
export function formatIngredientsList(ingredients) {
  return ingredients.map(ing => formatIngredient(ing));
}
