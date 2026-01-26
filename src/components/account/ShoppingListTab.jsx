import React, { useState } from "react";
import { FaShoppingCart, FaPlus, FaTrash, FaCheckCircle, FaCircle, FaMagic, FaEdit, FaSave, FaTimes, FaUsers } from "react-icons/fa";

export default function ShoppingListTab({
  t,
  theme,
  fontSize,
  shoppingList,
  setShoppingList,
  generateShoppingListFromPlanner,
  plannerWeekDate,
  getWeekRange,
  language
}) {
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemUnit, setNewItemUnit] = useState("шт");
  const [newItemCategory, setNewItemCategory] = useState("Продукты");
  const [editingId, setEditingId] = useState(null);
  const [editQuantity, setEditQuantity] = useState("");
  const [editUnit, setEditUnit] = useState("");
  
  const [servingsCount, setServingsCount] = useState(2); // Количество человек
  const [baseServings, setBaseServings] = useState(2); // Базовое количество из рецептов
  const [scaleManualItems, setScaleManualItems] = useState(false); // Масштабировать ручные

  const categories = [
    { ru: "Продукты", en: "Groceries" },
    { ru: "Овощи и фрукты", en: "Fruits & Vegetables" },
    { ru: "Мясо и рыба", en: "Meat & Fish" },
    { ru: "Молочные продукты", en: "Dairy" },
    { ru: "Зелень и приправы", en: "Herbs & Spices" },
    { ru: "Крупы и макароны", en: "Grains & Pasta" },
    { ru: "Прочее", en: "Other" }
  ];

  const units = [
    { ru: "шт", en: "pcs" },
    { ru: "кг", en: "kg" },
    { ru: "г", en: "g" },
    { ru: "л", en: "L" },
    { ru: "мл", en: "ml" },
    { ru: "уп", en: "pack" },
    { ru: "пучок", en: "bunch" },
    { ru: "ст. л.", en: "tbsp" },
    { ru: "ч. л.", en: "tsp" }
  ];

  const getCategoryLabel = (catRu) => {
    const cat = categories.find(c => c.ru === catRu);
    return language === "ru" ? (cat?.ru || catRu) : (cat?.en || catRu);
  };

  const getUnitLabel = (unitRu) => {
    const unit = units.find(u => u.ru === unitRu);
    return language === "ru" ? (unit?.ru || unitRu) : (unit?.en || unitRu);
  };

  // Расчет количества с учетом количества человек
  const getScaledQuantity = (item) => {
    // Если ручной и не масштабируем - возвращаем как есть
    if (item.isManual && !scaleManualItems) {
      return item.quantity || "";
    }
    
    if (!item.quantity || !item.baseQuantity) return item.quantity || "";
    
    const base = parseFloat(item.baseQuantity);
    if (isNaN(base)) return item.quantity;
    
    const multiplier = servingsCount / baseServings;
    const scaled = base * multiplier;
    
    return scaled % 1 === 0 ? scaled.toString() : scaled.toFixed(2);
  };

  const addItem = () => {
    if (!newItemName.trim()) return;
    const qty = newItemQuantity.trim();
    const newItem = {
      id: Date.now(),
      name: newItemName.trim(),
      quantity: qty,
      baseQuantity: qty,
      unit: newItemUnit,
      category: newItemCategory,
      checked: false,
      isManual: true
    };
    setShoppingList(prev => [...prev, newItem]);
    setNewItemName("");
    setNewItemQuantity("");
    setNewItemUnit("шт");
  };

  const toggleItem = (id) => {
    setShoppingList(prev => 
      prev.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const deleteItem = (id) => {
    setShoppingList(prev => prev.filter(item => item.id !== id));
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setEditQuantity(item.baseQuantity || item.quantity || "");
    setEditUnit(item.unit || "шт");
  };

  const saveEdit = (id) => {
    const qty = editQuantity.trim();
    setShoppingList(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: qty, baseQuantity: qty, unit: editUnit } : item
      )
    );
    setEditingId(null);
    setEditQuantity("");
    setEditUnit("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditQuantity("");
    setEditUnit("");
  };

  const clearChecked = () => {
    setShoppingList(prev => prev.filter(item => !item.checked));
  };

  const clearAll = () => {
    if (window.confirm(t("Удалить все элементы?", "Delete all items?"))) {
      setShoppingList([]);
      setServingsCount(2);
      setBaseServings(2);
    }
  };

  const groupedItems = shoppingList.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const totalItems = shoppingList.length;
  const checkedItems = shoppingList.filter(item => item.checked).length;
  const progress = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
  
  const generatedItemsCount = shoppingList.filter(item => !item.isManual).length;

  return (
    <div className={`${theme.cardBg} p-6 rounded-xl shadow`}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className={`${fontSize.subheading} font-semibold flex items-center gap-2`}>
          <FaShoppingCart />
          {t("Список покупок", "Shopping List")}
        </h3>
        
        <button
          onClick={() => generateShoppingListFromPlanner()}
          className={`px-4 py-2 rounded-xl ${fontSize.small} ${theme.accent} ${theme.accentHover} text-white flex items-center gap-2`}
        >
          <FaMagic />
          {t("Генерировать из плана", "Generate from plan")}
        </button>
      </div>

      {/* Панель количества порций */}
      {totalItems > 0 && (
        <div className={`mb-4 p-4 ${theme.border} border rounded-xl bg-gradient-to-r from-blue-50 to-purple-50`}>
          <div className="space-y-3">
            {/* Выбор количества человек */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <FaUsers className="text-blue-600 text-xl" />
                <span className={`${fontSize.body} font-semibold`}>
                  {t("Готовим на:", "Cooking for:")}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setServingsCount(Math.max(1, servingsCount - 1))}
                  className={`w-8 h-8 rounded-lg ${theme.accent} ${theme.accentHover} text-white font-bold flex items-center justify-center`}
                >
                  −
                </button>
                
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border-2 border-blue-300">
                  <span className={`${fontSize.cardTitle} font-bold text-blue-600`}>{servingsCount}</span>
                  <span className={`${fontSize.small} ${theme.textSecondary}`}>
                    {t("чел.", "people")}
                  </span>
                </div>
                
                <button
                  onClick={() => setServingsCount(servingsCount + 1)}
                  className={`w-8 h-8 rounded-lg ${theme.accent} ${theme.accentHover} text-white font-bold flex items-center justify-center`}
                >
                  +
                </button>
              </div>
              
              {servingsCount !== baseServings && (
                <span className={`${fontSize.small} ${theme.textSecondary} italic`}>
                  {t(`(Рецепты на ${baseServings} чел.)`, `(Recipes for ${baseServings} people)`)}
                </span>
              )}
            </div>

            {/* Чекбокс для ручных продуктов */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={scaleManualItems}
                onChange={(e) => setScaleManualItems(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className={`${fontSize.small} ${theme.textSecondary}`}>
                {t("Масштабировать также ручно добавленные продукты", 
                   "Scale manually added items too")}
              </span>
            </label>

            {/* Подсказка */}
            <p className={`${fontSize.small} text-blue-700 flex items-start gap-2`}>
              <span>💡</span>
              <span>
                {t("Количество продуктов автоматически пересчитывается при изменении количества человек.",
                   "Ingredient quantities are automatically recalculated when you change the number of people.")}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Прогресс-бар */}
      {totalItems > 0 && (
        <div className={`mb-6 p-4 ${theme.border} border rounded-xl`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`${fontSize.small} ${theme.textSecondary}`}>
              {t("Куплено", "Purchased")}: {checkedItems} / {totalItems}
            </span>
            <span className={`${fontSize.small} font-bold ${theme.accentText}`}>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${theme.accent}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Добавление нового элемента */}
      <div className={`mb-6 p-4 ${theme.border} border rounded-xl`}>
        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
              placeholder={t("Название продукта...", "Item name...")}
              className={`flex-1 min-w-[200px] p-3 ${theme.input} ${fontSize.body} rounded-xl`}
            />
            <input
              type="text"
              value={newItemQuantity}
              onChange={(e) => setNewItemQuantity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
              placeholder={t("Кол-во", "Qty")}
              className={`w-20 p-3 ${theme.input} ${fontSize.body} rounded-xl`}
            />
            <select
              value={newItemUnit}
              onChange={(e) => setNewItemUnit(e.target.value)}
              className={`p-3 ${theme.input} ${fontSize.body} rounded-xl`}
            >
              {units.map(unit => (
                <option key={unit.ru} value={unit.ru}>
                  {getUnitLabel(unit.ru)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
              className={`flex-1 min-w-[200px] p-3 ${theme.input} ${fontSize.body} rounded-xl`}
            >
              {categories.map(cat => (
                <option key={cat.ru} value={cat.ru}>
                  {language === "ru" ? cat.ru : cat.en}
                </option>
              ))}
            </select>
            <button
              onClick={addItem}
              className={`px-6 py-3 rounded-xl ${fontSize.small} ${theme.accent} ${theme.accentHover} text-white flex items-center gap-2`}
            >
              <FaPlus />
              {t("Добавить", "Add")}
            </button>
          </div>
        </div>
      </div>

      {/* Кнопки управления */}
      {totalItems > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={clearChecked}
            disabled={checkedItems === 0}
            className={`px-3 py-2 rounded-xl ${fontSize.small} ${theme.border} border hover:shadow transition disabled:opacity-50`}
          >
            {t("Удалить купленное", "Clear purchased")}
          </button>
          <button
            onClick={clearAll}
            className={`px-3 py-2 rounded-xl ${fontSize.small} text-red-500 ${theme.border} border hover:bg-red-50 transition`}
          >
            {t("Очистить всё", "Clear all")}
          </button>
        </div>
      )}

      {/* Список по категориям */}
      {totalItems === 0 ? (
        <div className="text-center py-12">
          <FaShoppingCart className={`w-16 h-16 mx-auto ${theme.textSecondary} mb-4`} />
          <p className={`${theme.textSecondary} ${fontSize.body}`}>
            {t("Список пуст. Добавьте продукты или сгенерируйте из плана меню.", 
               "List is empty. Add items or generate from your meal plan.")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className={`p-4 ${theme.border} border rounded-xl`}>
              <h4 className={`${fontSize.cardTitle} font-semibold mb-3 ${theme.headerText}`}>
                {getCategoryLabel(category)} ({items.length})
              </h4>
              <div className="space-y-2">
                {items.map(item => {
                  const displayQty = getScaledQuantity(item);
                  
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-3 rounded-lg transition ${item.checked ? 'bg-gray-100 opacity-60' : theme.cardBg}`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <button
                          onClick={() => toggleItem(item.id)}
                          className={`transition ${item.checked ? theme.accentText : theme.textSecondary}`}
                        >
                          {item.checked ? <FaCheckCircle size={20} /> : <FaCircle size={20} />}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`${fontSize.body} ${item.checked ? 'line-through' : ''}`}>
                              {item.name}
                            </span>
                            {item.isManual && !scaleManualItems && (
                              <span className={`${fontSize.tiny} px-2 py-0.5 rounded-full bg-gray-200 ${theme.textSecondary}`}>
                                {t("ручн.", "manual")}
                              </span>
                            )}
                          </div>
                          {editingId === item.id ? (
                            <div className="flex gap-2 mt-2">
                              <input
                                type="text"
                                value={editQuantity}
                                onChange={(e) => setEditQuantity(e.target.value)}
                                placeholder={t("Кол-во", "Qty")}
                                className={`w-20 p-2 ${theme.input} ${fontSize.small} rounded`}
                              />
                              <select
                                value={editUnit}
                                onChange={(e) => setEditUnit(e.target.value)}
                                className={`p-2 ${theme.input} ${fontSize.small} rounded`}
                              >
                                {units.map(unit => (
                                  <option key={unit.ru} value={unit.ru}>
                                    {getUnitLabel(unit.ru)}
                                  </option>
                                ))}
                              </select>
                              <button
                                onClick={() => saveEdit(item.id)}
                                className="text-green-600 hover:text-green-800"
                              >
                                <FaSave />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          ) : (
                            displayQty && (
                              <div className={`${fontSize.small} ${theme.textSecondary} flex items-center gap-2 mt-1`}>
                                <span>{displayQty} {getUnitLabel(item.unit)}</span>
                                <button
                                  onClick={() => startEditing(item)}
                                  className="hover:text-blue-600"
                                  title={t("Редактировать", "Edit")}
                                >
                                  <FaEdit size={14} />
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                      {editingId !== item.id && (
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="text-red-500 hover:text-red-700 ml-3"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
