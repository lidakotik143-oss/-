import React, { useState } from 'react';
import { FaPlus, FaTint, FaChartLine, FaTrash, FaCalculator } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

const WaterTracker = ({ theme, fontSize, language }) => {
  const {
    waterIntake, dailyGoal, setDailyGoal,
    useAutoCalculation, setUseAutoCalculation,
    todayIntake, addWater, removeWaterEntry,
    getTodayEntries, getWeeklyStats, calculateWaterGoal,
  } = useApp();

  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const t = (ru, en) => (language === 'ru' ? ru : en);

  const getTodayKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  };

  const getCalculationDetails = () => {
    const { userData } = useApp();
    if (!userData?.weight) return t('Заполните вес в профиле для автоматического расчета', 'Fill in your weight in profile for automatic calculation');
    const factors = [t(`Вес: ${userData.weight} кг`, `Weight: ${userData.weight} kg`)];
    if (userData.age) factors.push(t(`Возраст: ${userData.age} лет`, `Age: ${userData.age} years`));
    if (userData.lifestyle) factors.push(t(`Активность: ${userData.lifestyle}`, `Activity: ${userData.lifestyle}`));
    if (userData.goal) factors.push(t(`Цель: ${userData.goal}`, `Goal: ${userData.goal}`));
    return factors.join(' • ');
  };

  const progress = Math.min((todayIntake / dailyGoal) * 100, 100);
  const remaining = Math.max(dailyGoal - todayIntake, 0);

  const WaveProgress = ({ percentage }) => {
    const waveHeight = 100 - percentage;
    return (
      <div className="relative w-48 h-48 mx-auto">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="none" stroke={theme.border} strokeWidth="3" className="opacity-30" />
          <defs><clipPath id="circleClip"><circle cx="100" cy="100" r="95" /></clipPath></defs>
          <g clipPath="url(#circleClip)">
            <rect x="0" y={waveHeight * 2} width="200" height="200" fill="#4A90E2" opacity="0.3" />
            <path d={`M 0 ${waveHeight*2} Q 50 ${waveHeight*2-10} 100 ${waveHeight*2} T 200 ${waveHeight*2} V 200 H 0 Z`} fill="#4A90E2" opacity="0.6">
              <animate attributeName="d" dur="3s" repeatCount="indefinite"
                values={`M 0 ${waveHeight*2} Q 50 ${waveHeight*2-10} 100 ${waveHeight*2} T 200 ${waveHeight*2} V 200 H 0 Z;M 0 ${waveHeight*2} Q 50 ${waveHeight*2+10} 100 ${waveHeight*2} T 200 ${waveHeight*2} V 200 H 0 Z;M 0 ${waveHeight*2} Q 50 ${waveHeight*2-10} 100 ${waveHeight*2} T 200 ${waveHeight*2} V 200 H 0 Z`}
              />
            </path>
          </g>
          <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" className={`${fontSize.heading} font-bold`} fill={theme.text}>
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
            <h2 className={`${fontSize.cardTitle} font-bold ${theme.headerText}`}>{t('Трекер воды', 'Water Tracker')}</h2>
            <p className={`${fontSize.small} ${theme.textSecondary}`}>
              {t(`${todayIntake} мл из ${dailyGoal} мл`, `${todayIntake} ml of ${dailyGoal} ml`)}
            </p>
          </div>
        </div>
        <button onClick={() => setShowSettings(!showSettings)} className={`px-4 py-2 rounded-lg ${theme.accent} ${theme.accentHover} text-white ${fontSize.small} transition`}>
          ⚙️ {t('Настройки', 'Settings')}
        </button>
      </div>

      {showSettings && (
        <div className={`mb-6 p-4 rounded-xl ${theme.bg} border ${theme.border}`}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <label className={`block ${fontSize.body} ${theme.text} font-semibold mb-1`}>
                <FaCalculator className="inline mr-2" />
                {t('Автоматический расчет', 'Automatic calculation')}
              </label>
              <p className={`${fontSize.small} ${theme.textSecondary}`}>
                {t('Расчет нормы воды на основе данных профиля', 'Calculate water goal based on profile data')}
              </p>
            </div>
            <button onClick={() => setUseAutoCalculation(!useAutoCalculation)}
              className={`relative w-14 h-8 rounded-full transition ${useAutoCalculation ? theme.accent : 'bg-gray-300'}`}>
              <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${useAutoCalculation ? 'translate-x-6' : ''}`} />
            </button>
          </div>
          {!useAutoCalculation && (
            <div>
              <label className={`block ${fontSize.small} ${theme.textSecondary} mb-2`}>{t('Дневная цель (мл):', 'Daily goal (ml):')}</label>
              <input type="number" value={dailyGoal} onChange={(e) => setDailyGoal(Number(e.target.value))}
                className={`w-full px-4 py-2 rounded-lg ${theme.input} ${fontSize.body}`} min="500" max="5000" step="100" />
            </div>
          )}
          <p className={`mt-3 ${fontSize.tiny} ${theme.textSecondary} italic`}>
            {t('Рекомендация ВОЗ: 30-35 мл на кг веса', 'WHO recommendation: 30-35 ml per kg of body weight')}
          </p>
        </div>
      )}

      <div className="mb-6">
        <WaveProgress percentage={progress} />
        {remaining > 0
          ? <p className={`text-center mt-4 ${fontSize.body} ${theme.textSecondary}`}>{t(`Осталось выпить: ${remaining} мл`, `Remaining: ${remaining} ml`)}</p>
          : <p className={`text-center mt-4 ${fontSize.body} ${theme.accentText} font-semibold`}>🎉 {t('Цель достигнута!', 'Goal achieved!')}</p>
        }
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[250, 500, 1000].map(amount => (
          <button key={amount} onClick={() => addWater(amount)}
            className={`py-3 rounded-xl ${theme.accent} ${theme.accentHover} text-white font-semibold ${fontSize.body} transition hover:scale-105`}>
            <FaPlus className="inline mr-2" />{amount} {t('мл', 'ml')}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className={`${fontSize.body} font-semibold ${theme.headerText}`}>{t('Сегодня:', 'Today:')}</h3>
          <button onClick={() => setShowHistory(!showHistory)}
            className={`px-3 py-1 rounded-lg ${theme.cardBg} border ${theme.border} ${fontSize.small} transition hover:opacity-80`}>
            <FaChartLine className="inline mr-2" />{t('История', 'History')}
          </button>
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {getTodayEntries().length > 0 ? getTodayEntries().map(entry => (
            <div key={entry.id} className={`flex items-center justify-between p-3 rounded-lg ${theme.bg} border ${theme.border}`}>
              <div className="flex items-center gap-3">
                <FaTint className={theme.accentText} />
                <span className={`${fontSize.body} ${theme.text}`}>+{entry.amount} {t('мл', 'ml')}</span>
                <span className={`${fontSize.small} ${theme.textSecondary}`}>
                  {new Date(entry.timestamp).toLocaleTimeString(language === 'ru' ? 'ru-RU' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <button onClick={() => removeWaterEntry(entry.id)} className={`${theme.textSecondary} hover:text-red-500 transition`}>
                <FaTrash size={14} />
              </button>
            </div>
          )) : (
            <p className={`text-center py-4 ${fontSize.small} ${theme.textSecondary}`}>
              {t('Начните отслеживать потребление воды', 'Start tracking your water intake')}
            </p>
          )}
        </div>
      </div>

      {showHistory && (
        <div className={`mt-6 p-4 rounded-xl ${theme.bg} border ${theme.border}`}>
          <h3 className={`${fontSize.body} font-semibold ${theme.headerText} mb-4`}>{t('Статистика за неделю:', 'Weekly stats:')}</h3>
          <div className="space-y-3">
            {getWeeklyStats().map(({ date, amount, percentage }) => {
              const dateObj = new Date(date);
              const isToday = date === getTodayKey();
              return (
                <div key={date} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className={`${fontSize.small} ${isToday ? 'font-bold ' + theme.accentText : theme.textSecondary}`}>
                      {dateObj.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                      {isToday && ` (${t('сегодня', 'today')})`}
                    </span>
                    <span className={`${fontSize.small} ${theme.text}`}>{amount} {t('мл', 'ml')} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-500 ${percentage >= 100 ? 'bg-green-500' : percentage >= 50 ? 'bg-blue-500' : 'bg-gray-400'}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
            <p className={`${fontSize.small} text-blue-800`}>💡 {t('Совет: Пейте воду равномерно в течение дня для лучшего усвоения', 'Tip: Drink water evenly throughout the day for better absorption')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaterTracker;
