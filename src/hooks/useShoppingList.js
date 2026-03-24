import { useState, useEffect } from 'react';
import { getRecipeSubKey, getEffectiveIngredientName } from '../utils/substitutions';

const MEAL_CATEGORIES = ['breakfast', 'lunch', 'snack', 'dinner'];

/**
 * categorizeIngredient — определяет категорию ингредиента по имени.
 * Вынесена из CookifyDemo в utils этого хука.
 */
export const categorizeIngredient = (ingredientName) => {
  const ing = (ingredientName || '').toLowerCase();
  if (/(помидор|огурец|перец|лук|чеснок|морковь|капуста|картофель|баклажан|кабачок|тыква|свекла|редис|салат|шпинат|петрушка|укроп|базилик|кинза|руккола|авокадо|яблок|банан|апельсин|лимон|груша|персик|ягод|клубник|малин|черник|виноград|киви|манго|ананас|арбуз|дыня)/i.test(ing)) return 'Овощи и фрукты';
  if (/(мясо|курица|говядина|свинина|баранина|индейка|утка|фарш|филе|рыба|лосось|тунец|форель|семга|треска|креветк|кальмар|мидии|краб)/i.test(ing)) return 'Мясо и рыба';
  if (/(молоко|сливки|сметана|йогурт|кефир|творог|сыр|масло сливочное|ряженка|простокваша)/i.test(ing)) return 'Молочные продукты';
  if (/(соль|перец|специи|приправ|пряност|зелень|трав|орегано|тимьян|розмарин|паприка|куркума|карри|имбирь|корица|ваниль|мускатный|кориандр|тмин|анис|гвоздика|лавровый|майоран)/i.test(ing)) return 'Зелень и приправы';
  if (/(рис|гречка|овсянка|пшено|перловка|манка|кукурузная крупа|киноа|булгур|макарон|паста|спагетти|лапша|вермишель)/i.test(ing)) return 'Крупы и макароны';
  return 'Продукты';
};

/**
 * useShoppingList — хук списка покупок.
 *
 * Инкапсулирует:
 *   - shoppingList + автосохранение в localStorage (по uid)
 *   - generateShoppingListFromPlanner — сборка ингредиентов из плана на неделю
 *
 * Параметры:
 *   firebaseUser        — объект пользователя Firebase (или null)
 *   weeklyPlan          — объект плана на неделю из useWeeklyPlanner
 *   getPlannerRecipes   — геттер рецептов дня из useWeeklyPlanner
 *   plannerWeekDate     — текущая дата недели планировщика
 *   userSubstitutions   — объект замен ингредиентов
 *   language            — 'ru' | 'en'
 *   onNotify            — колбэк (title, message) для показа уведомления
 *   getWeekDays         — утилита получения дней недели
 */
export function useShoppingList({
  firebaseUser,
  getPlannerRecipes,
  plannerWeekDate,
  userSubstitutions,
  language,
  onNotify,
  getWeekDays,
}) {
  const [shoppingList, setShoppingList] = useState([]);

  // Автосохранение в localStorage
  useEffect(() => {
    if (firebaseUser?.uid) {
      localStorage.setItem(
        `cookify_shoppingList_${firebaseUser.uid}`,
        JSON.stringify(shoppingList)
      );
    }
  }, [shoppingList, firebaseUser]);

  // ── Генерация списка из плана на неделю ───────────────────────────────────
  const generateShoppingListFromPlanner = () => {
    const weekDays       = getWeekDays(plannerWeekDate);
    const allIngredients = [];

    weekDays.forEach(dateKey => {
      MEAL_CATEGORIES.forEach(cat => {
        getPlannerRecipes(dateKey, cat).forEach(recipeWithVariant => {
          let ingredients = recipeWithVariant.ingredients || [];

          // Если выбран вариант — берём его ингредиенты
          if (recipeWithVariant.selectedVariantKey && recipeWithVariant.variants) {
            const variant = recipeWithVariant.variants.find(
              v => v.key === recipeWithVariant.selectedVariantKey
            );
            if (variant?.ingredients) ingredients = variant.ingredients;
          }

          const subsKey    = getRecipeSubKey(recipeWithVariant.id, recipeWithVariant.selectedVariantKey || null);
          const recipeSubs = userSubstitutions?.[subsKey] || {};

          ingredients.forEach(ing => {
            if (typeof ing === 'object' && ing.name) {
              const effectiveName = getEffectiveIngredientName(ing, recipeSubs);
              allIngredients.push({ name: effectiveName, quantity: ing.quantity || '', unit: ing.unit || 'шт' });
            } else if (typeof ing === 'string') {
              const parts       = ing.split('—').map(s => s.trim());
              const name        = parts[0] || ing;
              const quantityStr = parts[1] || '';
              const match       = quantityStr.match(/(\d+(?:[.,]\d+)?)\s*([а-яА-Яa-zA-Z.\s]+)?/);
              const quantity    = match ? match[1].replace(',', '.') : '';
              const unit        = match?.[2] ? match[2].trim() : 'шт';
              allIngredients.push({ name, quantity, unit });
            }
          });
        });
      });
    });

    // Дедупликация по имени
    const seen = new Set();
    const uniqueIngredients = allIngredients.filter(ing => {
      const key = (ing.name || '').toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const newItems = uniqueIngredients.map(ing => ({
      id:           Date.now() + Math.random(),
      name:         ing.name,
      quantity:     ing.quantity,
      baseQuantity: ing.quantity,
      unit:         ing.unit,
      category:     categorizeIngredient(ing.name),
      checked:      false,
      isManual:     false,
    }));

    setShoppingList(prev => {
      const existingNames = new Set(prev.map(item => item.name.toLowerCase()));
      return [...prev, ...newItems.filter(item => !existingNames.has(item.name.toLowerCase()))];
    });

    const title   = language === 'ru' ? 'Готово' : 'Done';
    const message = language === 'ru'
      ? `Добавлено ${newItems.length} продуктов из плана меню на неделю!`
      : `Added ${newItems.length} items from your weekly meal plan!`;
    onNotify?.(title, message);
  };

  return { shoppingList, setShoppingList, generateShoppingListFromPlanner };
}
