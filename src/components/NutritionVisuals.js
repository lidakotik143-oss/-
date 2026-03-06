import React, { useState, useEffect } from 'react';

/**
 * Круговая диаграмма калорий с анимацией заполнения
 * @param {number} current - текущее количество калорий
 * @param {number} goal - целевое количество калорий
 * @param {string} size - размер (small, medium, large)
 * @param {object} theme - тема оформления
 * @param {object} fontSize - размеры шрифтов
 * @param {string} language - язык (ru/en)
 */
export const CalorieRing = ({ current = 0, goal = 2000, size = 'medium', theme, fontSize, language }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const t = (ru, en) => (language === 'ru' ? ru : en);

  // Размеры в зависимости от size
  const sizes = {
    small: { width: 120, radius: 45, strokeWidth: 8, fontSize: 'text-sm' },
    medium: { width: 200, radius: 85, strokeWidth: 12, fontSize: 'text-2xl' },
    large: { width: 280, radius: 125, strokeWidth: 16, fontSize: 'text-4xl' }
  };

  const config = sizes[size] || sizes.medium;
  const { width, radius, strokeWidth } = config;
  const center = width / 2;

  // Анимация значения
  useEffect(() => {
    let startTime;
    const duration = 1500; // 1.5 секунды
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(current * easeOut);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [current]);

  const percentage = Math.min((animatedValue / goal) * 100, 100);
  const overGoal = current > goal;
  const actualPercentage = (current / goal) * 100;

  // Вычисление окружности и смещения
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // Определение цвета в зависимости от прогресса
  const getColor = () => {
    if (overGoal) return '#EF4444'; // Красный - превышение
    if (actualPercentage >= 90) return '#F59E0B'; // Жёлтый - близко к цели
    if (actualPercentage >= 70) return '#10B981'; // Зелёный - хорошо
    return '#60A5FA'; // Голубой - начало дня
  };

  const color = getColor();

  return (
    <div className="flex flex-col items-center">
      <svg width={width} height={width} className="transform -rotate-90">
        {/* Фоновый круг */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
          opacity="0.3"
        />
        
        {/* Анимированный прогресс */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.5s ease-out, stroke 0.3s ease'
          }}
        />
        
        {/* Градиентная тень для эффекта глубины */}
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.6 }} />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Текст в центре (поверх SVG) */}
      <div 
        className="absolute flex flex-col items-center justify-center"
        style={{ width: width, height: width }}
      >
        <div className={`${config.fontSize} font-bold`} style={{ color }}>
          {Math.round(animatedValue)}
        </div>
        <div className={`${fontSize?.small || 'text-sm'} ${theme?.textSecondary || 'text-gray-500'}`}>
          {t('из', 'of')} {goal}
        </div>
        <div className={`${fontSize?.tiny || 'text-xs'} ${theme?.textSecondary || 'text-gray-400'} mt-1`}>
          {Math.round(actualPercentage)}%
        </div>
      </div>
    </div>
  );
};

/**
 * Анимированные столбики для макронутриентов (КБЖУ)
 * @param {object} macros - { protein, fat, carbs, calories }
 * @param {object} goals - целевые значения { protein, fat, carbs, calories }
 * @param {object} theme - тема оформления
 * @param {object} fontSize - размеры шрифтов
 * @param {string} language - язык (ru/en)
 */
export const MacroBars = ({ macros = {}, goals = {}, theme, fontSize, language }) => {
  const [animated, setAnimated] = useState(false);
  const t = (ru, en) => (language === 'ru' ? ru : en);

  useEffect(() => {
    // Запускаем анимацию после монтирования
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const macroData = [
    {
      key: 'protein',
      label: t('Белки', 'Protein'),
      labelShort: t('Б', 'P'),
      value: macros.protein || 0,
      goal: goals.protein || 150,
      color: '#10B981',
      emoji: '🥩'
    },
    {
      key: 'fat',
      label: t('Жиры', 'Fat'),
      labelShort: t('Ж', 'F'),
      value: macros.fat || 0,
      goal: goals.fat || 70,
      color: '#F59E0B',
      emoji: '🥑'
    },
    {
      key: 'carbs',
      label: t('Углеводы', 'Carbs'),
      labelShort: t('У', 'C'),
      value: macros.carbs || 0,
      goal: goals.carbs || 250,
      color: '#3B82F6',
      emoji: '🍞'
    }
  ];

  return (
    <div className="space-y-4">
      {macroData.map((macro, index) => {
        const percentage = Math.min((macro.value / macro.goal) * 100, 100);
        const overGoal = macro.value > macro.goal;
        const actualPercentage = (macro.value / macro.goal) * 100;
        
        return (
          <div key={macro.key} className="space-y-2">
            {/* Заголовок */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`${fontSize?.body || 'text-base'} font-semibold ${theme?.text || 'text-gray-800'}`}>
                  {macro.emoji} {macro.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span 
                  className={`${fontSize?.small || 'text-sm'} font-bold`}
                  style={{ color: overGoal ? '#EF4444' : macro.color }}
                >
                  {Math.round(macro.value)}{t('г', 'g')}
                </span>
                <span className={`${fontSize?.small || 'text-sm'} ${theme?.textSecondary || 'text-gray-500'}`}>
                  / {macro.goal}{t('г', 'g')}
                </span>
                <span 
                  className={`${fontSize?.tiny || 'text-xs'} px-2 py-0.5 rounded-full ${
                    overGoal ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {Math.round(actualPercentage)}%
                </span>
              </div>
            </div>
            
            {/* Прогресс-бар */}
            <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden">
              {/* Анимированный градиентный заполнитель */}
              <div
                className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: animated ? `${percentage}%` : '0%',
                  background: overGoal 
                    ? 'linear-gradient(90deg, #EF4444 0%, #DC2626 100%)'
                    : `linear-gradient(90deg, ${macro.color} 0%, ${macro.color}dd 100%)`,
                  boxShadow: `0 2px 8px ${macro.color}40`,
                  transitionDelay: `${index * 150}ms` // Задержка для волнового эффекта
                }}
              >
                {/* Блик на столбике */}
                <div 
                  className="absolute top-0 left-0 w-full h-full"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)'
                  }}
                />
              </div>
              
              {/* Риски для визуализации 25%, 50%, 75% */}
              {[25, 50, 75].map(mark => (
                <div
                  key={mark}
                  className="absolute top-0 h-full w-px bg-gray-300"
                  style={{ left: `${mark}%` }}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * Компактная версия столбиков для использования в карточках рецептов
 */
export const CompactMacroBars = ({ macros = {}, theme, fontSize, language }) => {
  const [animated, setAnimated] = useState(false);
  const t = (ru, en) => (language === 'ru' ? ru : en);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const total = (macros.protein || 0) + (macros.fat || 0) + (macros.carbs || 0);
  
  const macroData = [
    { key: 'protein', value: macros.protein || 0, color: '#10B981', label: t('Б', 'P') },
    { key: 'fat', value: macros.fat || 0, color: '#F59E0B', label: t('Ж', 'F') },
    { key: 'carbs', value: macros.carbs || 0, color: '#3B82F6', label: t('У', 'C') }
  ];

  return (
    <div className="space-y-2">
      {/* Общий композитный бар */}
      <div className="flex w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        {macroData.map((macro, index) => {
          const percentage = total > 0 ? (macro.value / total) * 100 : 0;
          return (
            <div
              key={macro.key}
              className="h-full transition-all duration-1000 ease-out"
              style={{
                width: animated ? `${percentage}%` : '0%',
                backgroundColor: macro.color,
                transitionDelay: `${index * 100}ms`
              }}
            />
          );
        })}
      </div>
      
      {/* Легенда */}
      <div className="flex justify-between">
        {macroData.map(macro => (
          <div key={macro.key} className="flex items-center gap-1">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: macro.color }}
            />
            <span className={`${fontSize?.tiny || 'text-xs'} ${theme?.text || 'text-gray-700'}`}>
              {macro.label}: {Math.round(macro.value)}{t('г', 'g')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Комбинированная панель: круг калорий + столбики КБЖУ
 */
export const NutritionDashboard = ({ 
  calories = { current: 0, goal: 2000 },
  macros = { protein: 0, fat: 0, carbs: 0 },
  goals = { protein: 150, fat: 70, carbs: 250 },
  theme,
  fontSize,
  language 
}) => {
  const t = (ru, en) => (language === 'ru' ? ru : en);

  return (
    <div className={`${theme?.cardBg || 'bg-white'} rounded-2xl p-6 shadow-lg border ${theme?.border || 'border-gray-200'}`}>
      <h3 className={`${fontSize?.cardTitle || 'text-xl'} font-bold ${theme?.headerText || 'text-gray-800'} mb-6`}>
        📊 {t('Питание за сегодня', 'Today\'s Nutrition')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Левая часть: Круг калорий */}
        <div className="flex flex-col items-center">
          <div className="mb-3">
            <span className={`${fontSize?.body || 'text-base'} font-semibold ${theme?.headerText || 'text-gray-700'}`}>
              {t('Калории', 'Calories')}
            </span>
          </div>
          <CalorieRing 
            current={calories.current}
            goal={calories.goal}
            size="medium"
            theme={theme}
            fontSize={fontSize}
            language={language}
          />
        </div>
        
        {/* Правая часть: Столбики КБЖУ */}
        <div>
          <MacroBars 
            macros={macros}
            goals={goals}
            theme={theme}
            fontSize={fontSize}
            language={language}
          />
        </div>
      </div>
    </div>
  );
};

export default { CalorieRing, MacroBars, CompactMacroBars, NutritionDashboard };