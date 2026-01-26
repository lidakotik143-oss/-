import React, { useState } from "react";
import { FaShoppingCart, FaPlus, FaTrash, FaCheckCircle, FaCircle, FaMagic } from "react-icons/fa";

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
  const [newItemCategory, setNewItemCategory] = useState("Продукты");

  const categories = [
    { ru: "Продукты", en: "Groceries" },
    { ru: "Овощи и фрукты", en: "Fruits & Vegetables" },
    { ru: "Мясо и рыба", en: "Meat & Fish" },
    { ru: "Молочные продукты", en: "Dairy" },
    { ru: "Зелень и приправы", en: "Herbs & Spices" },
    { ru: "Крупы и макароны", en: "Grains & Pasta" },
    { ru: "Прочее", en: "Other" }
  ];

  const getCategoryLabel = (catRu) => {
    const cat = categories.find(c => c.ru === catRu);
    return language === "ru" ? (cat?.ru || catRu) : (cat?.en || catRu);
  };

  const addItem = () => {
    if (!newItemName.trim()) return;
    const newItem = {
      id: Date.now(),
      name: newItemName.trim(),
      category: newItemCategory,
      checked: false
    };
    setShoppingList(prev => [...prev, newItem]);
    setNewItemName("");
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

  const clearChecked = () => {
    setShoppingList(prev => prev.filter(item => !item.checked));
  };

  const clearAll = () => {
    if (window.confirm(t("Удалить все элементы?", "Delete all items?"))) {
      setShoppingList([]);
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
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
            placeholder={t("Название продукта...", "Item name...")}
            className={`flex-1 min-w-[200px] p-3 ${theme.input} ${fontSize.body} rounded-xl`}
          />
          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value)}
            className={`p-3 ${theme.input} ${fontSize.body} rounded-xl`}
          >
            {categories.map(cat => (
              <option key={cat.ru} value={cat.ru}>
                {language === "ru" ? cat.ru : cat.en}
              </option>
            ))}
          </select>
          <button
            onClick={addItem}
            className={`px-4 py-3 rounded-xl ${fontSize.small} ${theme.accent} ${theme.accentHover} text-white flex items-center gap-2`}
          >
            <FaPlus />
            {t("Добавить", "Add")}
          </button>
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
                {items.map(item => (
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
                      <span className={`${fontSize.body} ${item.checked ? 'line-through' : ''}`}>
                        {item.name}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-red-500 hover:text-red-700 ml-3"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
