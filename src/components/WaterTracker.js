import React, { useState, useEffect } from 'react';
import { FaPlus, FaTint, FaChartLine, FaTrash } from 'react-icons/fa';

const WaterTracker = ({ theme, fontSize, language, userData }) => {
  const [waterIntake, setWaterIntake] = useState([]);
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const t = (ru, en) => (language === 'ru' ? ru : en);

  // Загрузка данных из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cookify_waterIntake');
    const savedGoal = localStorage.getItem('cookify_waterGoal');
    
    if (saved) setWaterIntake(JSON.parse(saved));
    if (savedGoal) setDailyGoal(Number(savedGoal));
    else if (userData?.weight) {
      // Автоматический расчет: 30-35 мл на кг веса
      const calculated = Math.round(userData.weight * 35);
      setDailyGoal(calculated);
    }
  }, [userData]);

  // Сохранение данных
  useEffect(() => {
    localStorage.setItem('cookify_waterIntake', JSON.stringify(waterIntake));
  }, [waterIntake]);

  useEffect(() => {
    localStorage.setItem('cookify_waterGoal', dailyGoal.toString());
  }, [dailyGoal]);

  // Получить сегодняшнюю дату в формате YYYY-MM-DD
  const getTodayKey = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  // Получить потребление воды за сегодня
  const getTodayIntake = () => {
    const todayKey = getTodayKey();
    return waterIntake
      .filter(entry => entry.date === todayKey)
      .reduce((sum, entry) => sum + entry.amount, 0);
  };

  // Добавить воду
  const addWater = (amount) => {
    const newEntry = {
      id: Date.now(),
      date: getTodayKey(),
      amount: amount,
      timestamp: new Date().toISOString()
    };
    setWaterIntake(prev => [...prev, newEntry]);
  };

  // Удалить запись
  const removeEntry = (id) => {
    setWaterIntake(prev => prev.filter(entry => entry.id !== id));
  };

  // Получить записи за сегодня
  const getTodayEntries = () => {
    const todayKey = getTodayKey();
    return waterIntake
      .filter(entry => entry.date === todayKey)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  // Получить статистику за неделю
  const getWeeklyStats = () => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weekData = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekAgo);
      date.setDate(weekAgo.getDate() + i + 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      weekData[key] = 0;
    }

    waterIntake.forEach(entry => {
      if (weekData.hasOwnProperty(entry.date)) {
        weekData[entry.date] += entry.amount;
      }
    });

    return Object.entries(weekData).map(([date, amount]) => ({
      date,
      amount,
      percentage: Math.round((amount / dailyGoal) * 100)
    }));
  };

  const todayIntake = getTodayIntake();
  const progress = Math.min((todayIntake / dailyGoal) * 100, 100);
  const remaining = Math.max(dailyGoal - todayIntake, 0);

  // Визуализация волны воды
  const WaveProgress = ({ percentage }) => {
    const waveHeight = 100 - percentage;
    
    return (
      <div className="relative w-48 h-48 mx-auto">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Круг-контейнер */}
          <circle
            cx="100"
            cy="100"
            r="95"
            fill="none"
            stroke={theme.border}
            strokeWidth="3"
            className="opacity-30"
          />
          
          {/* Волна воды */}
          <defs>
            <clipPath id="circleClip">
              <circle cx="100" cy="100" r="95" />
            </clipPath>
          </defs>
          
          <g clipPath="url(#circleClip)">
            <rect
              x="0"
              y={waveHeight * 2}
              width="200"
              height="200"
              fill="#4A90E2"
              opacity="0.3"
            />
            
            {/* Анимированная волна */}
            <path
              d={`M 0 ${waveHeight * 2} Q 50 ${waveHeight * 2 - 10} 100 ${waveHeight * 2} T 200 ${waveHeight * 2} V 200 H 0 Z`}
              fill="#4A90E2"
              opacity="0.6"
            >
              <animate
                attributeName="d"
                dur="3s"
                repeatCount="indefinite"
                values={`
                  M 0 ${waveHeight * 2} Q 50 ${waveHeight * 2 - 10} 100 ${waveHeight * 2} T 200 ${waveHeight * 2} V 200 H 0 Z;
                  M 0 ${waveHeight * 2} Q 50 ${waveHeight * 2 + 10} 100 ${waveHeight * 2} T 200 ${waveHeight * 2} V 200 H 0 Z;
                  M 0 ${waveHeight * 2} Q 50 ${waveHeight * 2 - 10} 100 ${waveHeight * 2} T 200 ${waveHeight * 2} V 200 H 0 Z
                `}
              />
            </path>
          </g>
          
          {/* Процент в центре */}
          <text
            x="100"
            y="100"
            textAnchor="middle"
            dominantBaseline="middle"
            className={`${fontSize.heading} font-bold`}
            fill={theme.text}
          >
            {Math.round(percentage)}%
          </text>
        </svg>
      </div>
    );
  };

  return (
    <div className={`${theme.cardBg} rounded-2xl p-6 shadow-lg border ${theme.border}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${theme.accent} rounded-full flex items-center justify-center`}>
            <FaTint className="text-white text-2xl" />
          </div>
          <div>
            <h2 className={`${fontSize.cardTitle} font-bold ${theme.headerText}`}>
              {t('Трекер воды', 'Water Tracker')}
            </h2>
            <p className={`${fontSize.small} ${theme.textSecondary}`}>
              {t(`${todayIntake} мл из ${dailyGoal} мл`, `${todayIntake} ml of ${dailyGoal} ml`)}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`px-4 py-2 rounded-lg ${theme.accent} ${theme.accentHover} text-white ${fontSize.small} transition`}
        >
          ⚙️ {t('Настройки', 'Settings')}
        </button>
      </div>

      {/* Настройки цели */}
      {showSettings && (
        <div className={`mb-6 p-4 rounded-xl ${theme.bg} border ${theme.border}`}>
          <label className={`block ${fontSize.small} ${theme.textSecondary} mb-2`}>
            {t('Дневная цель (мл):', 'Daily goal (ml):')}
          </label>
          <input
            type="number"
            value={dailyGoal}
            onChange={(e) => setDailyGoal(Number(e.target.value))}
            className={`w-full px-4 py-2 rounded-lg ${theme.input} ${fontSize.body}`}
            min="500"
            max="5000"
            step="100"
          />
          <p className={`mt-2 ${fontSize.tiny} ${theme.textSecondary}`}>
            {t(
              'Рекомендация: 30-35 мл на кг веса',
              'Recommendation: 30-35 ml per kg of body weight'
            )}
          </p>
        </div>
      )}

      {/* Визуализация прогресса */}
      <div className="mb-6">
        <WaveProgress percentage={progress} />
        
        {remaining > 0 ? (
          <p className={`text-center mt-4 ${fontSize.body} ${theme.textSecondary}`}>
            {t(
              `Осталось выпить: ${remaining} мл`,
              `Remaining: ${remaining} ml`
            )}
          </p>
        ) : (
          <p className={`text-center mt-4 ${fontSize.body} ${theme.accentText} font-semibold`}>
            🎉 {t('Цель достигнута!', 'Goal achieved!')}
          </p>
        )}
      </div>

      {/* Быстрые кнопки добавления */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[250, 500, 1000].map(amount => (
          <button
            key={amount}
            onClick={() => addWater(amount)}
            className={`py-3 rounded-xl ${theme.accent} ${theme.accentHover} text-white font-semibold ${fontSize.body} transition hover:scale-105`}
          >
            <FaPlus className="inline mr-2" />
            {amount} {t('мл', 'ml')}
          </button>
        ))}
      </div>

      {/* Сегодняшние записи */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className={`${fontSize.body} font-semibold ${theme.headerText}`}>
            {t('Сегодня:', 'Today:')}
          </h3>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`px-3 py-1 rounded-lg ${theme.cardBg} border ${theme.border} ${fontSize.small} transition hover:opacity-80`}
          >
            <FaChartLine className="inline mr-2" />
            {t('История', 'History')}
          </button>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {getTodayEntries().length > 0 ? (
            getTodayEntries().map(entry => (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-3 rounded-lg ${theme.bg} border ${theme.border}`}
              >
                <div className="flex items-center gap-3">
                  <FaTint className={theme.accentText} />
                  <span className={`${fontSize.body} ${theme.text}`}>
                    +{entry.amount} {t('мл', 'ml')}
                  </span>
                  <span className={`${fontSize.small} ${theme.textSecondary}`}>
                    {new Date(entry.timestamp).toLocaleTimeString(language === 'ru' ? 'ru-RU' : 'en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <button
                  onClick={() => removeEntry(entry.id)}
                  className={`${theme.textSecondary} hover:text-red-500 transition`}
                >
                  <FaTrash size={14} />
                </button>
              </div>
            ))
          ) : (
            <p className={`text-center py-4 ${fontSize.small} ${theme.textSecondary}`}>
              {t('Начните отслеживать потребление воды', 'Start tracking your water intake')}
            </p>
          )}
        </div>
      </div>

      {/* История за неделю */}
      {showHistory && (
        <div className={`mt-6 p-4 rounded-xl ${theme.bg} border ${theme.border}`}>
          <h3 className={`${fontSize.body} font-semibold ${theme.headerText} mb-4`}>
            {t('Статистика за неделю:', 'Weekly stats:')}
          </h3>
          
          <div className="space-y-3">
            {getWeeklyStats().map(({ date, amount, percentage }) => {
              const dateObj = new Date(date);
              const isToday = date === getTodayKey();
              
              return (
                <div key={date} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className={`${fontSize.small} ${isToday ? 'font-bold ' + theme.accentText : theme.textSecondary}`}>
                      {dateObj.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                      })}
                      {isToday && ` (${t('сегодня', 'today')})`}
                    </span>
                    <span className={`${fontSize.small} ${theme.text}`}>
                      {amount} {t('мл', 'ml')} ({percentage}%)
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        percentage >= 100 ? 'bg-green-500' : percentage >= 50 ? 'bg-blue-500' : 'bg-gray-400'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className={`mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200`}>
            <p className={`${fontSize.small} text-blue-800`}>
              💡 {t(
                'Совет: Пейте воду равномерно в течение дня для лучшего усвоения',
                'Tip: Drink water evenly throughout the day for better absorption'
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaterTracker;