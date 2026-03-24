import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaTint, FaChartLine, FaTrash, FaCalculator } from 'react-icons/fa';
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const WaterTracker = ({ theme, fontSize, language, userData, firebaseUser }) => {
  const [waterIntake, setWaterIntake] = useState([]);
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [useAutoCalculation, setUseAutoCalculation] = useState(true);

  const t = (ru, en) => (language === 'ru' ? ru : en);

  const getTodayKey = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  // Умный расчёт нормы воды
  const calculateWaterGoal = useCallback(() => {
    if (!userData?.weight) return 2000;
    let baseAmount = userData.weight * 35;
    if (userData.age) {
      if (userData.age < 30) baseAmount *= 1.0;
      else if (userData.age < 55) baseAmount *= 0.95;
      else baseAmount *= 0.9;
    }
    if (userData.lifestyle) {
      const ll = userData.lifestyle.toLowerCase();
      if (ll.includes('умеренно') || ll.includes('moderate')) baseAmount *= 1.15;
      else if (ll.includes('активный') || ll.includes('active')) baseAmount *= 1.3;
    }
    if (userData.goal) {
      const gl = userData.goal.toLowerCase();
      if (gl.includes('снижение') || gl.includes('weight loss')) baseAmount *= 1.1;
      else if (gl.includes('набор') || gl.includes('muscle gain')) baseAmount *= 1.2;
    }
    return Math.round(baseAmount);
  }, [userData]);

  // ── Firestore helpers ──────────────────────────────────────────────────────
  const firestoreRef = () =>
    firebaseUser?.uid ? doc(db, 'users', firebaseUser.uid, 'data', 'waterTracker') : null;

  const loadFromFirestore = useCallback(async () => {
    const ref = firestoreRef();
    if (!ref) return null;
    try {
      const snap = await getDoc(ref);
      return snap.exists() ? snap.data() : null;
    } catch {
      return null;
    }
  }, [firebaseUser?.uid]);

  const saveToFirestore = useCallback(async (intake, goal, autoCalc) => {
    const ref = firestoreRef();
    if (!ref) return;
    try {
      await setDoc(ref, {
        waterIntake: intake,
        dailyGoal: goal,
        useAutoCalculation: autoCalc,
        updatedAt: new Date().toISOString(),
      });
    } catch {
      // silent — localStorage уже сохранён
    }
  }, [firebaseUser?.uid]);

  // ── Загрузка при старте ────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      // Сначала пробуем Firestore
      const remote = await loadFromFirestore();
      if (remote) {
        setWaterIntake(remote.waterIntake || []);
        const autoCalc = remote.useAutoCalculation !== false;
        setUseAutoCalculation(autoCalc);
        setDailyGoal(autoCalc ? calculateWaterGoal() : (remote.dailyGoal || 2000));
        return;
      }
      // Fallback: localStorage
      const saved = localStorage.getItem('cookify_waterIntake');
      const savedGoal = localStorage.getItem('cookify_waterGoal');
      const savedAutoCalc = localStorage.getItem('cookify_waterAutoCalc');
      if (saved) setWaterIntake(JSON.parse(saved));
      if (savedAutoCalc !== null) {
        const autoCalc = savedAutoCalc === 'true';
        setUseAutoCalculation(autoCalc);
        setDailyGoal(autoCalc ? calculateWaterGoal() : (savedGoal ? Number(savedGoal) : 2000));
      } else {
        setDailyGoal(calculateWaterGoal());
      }
    };
    init();
  }, [firebaseUser?.uid]);

  // Пересчёт нормы при изменении профиля
  useEffect(() => {
    if (useAutoCalculation && userData) {
      setDailyGoal(calculateWaterGoal());
    }
  }, [userData?.weight, userData?.age, userData?.lifestyle, userData?.goal, useAutoCalculation]);

  // ── Сохранение при изменении данных ───────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('cookify_waterIntake', JSON.stringify(waterIntake));
    if (!useAutoCalculation) localStorage.setItem('cookify_waterGoal', dailyGoal.toString());
    localStorage.setItem('cookify_waterAutoCalc', useAutoCalculation.toString());
    saveToFirestore(waterIntake, dailyGoal, useAutoCalculation);
  }, [waterIntake, dailyGoal, useAutoCalculation]);

  const getTodayIntake = () => {
    const todayKey = getTodayKey();
    return waterIntake.filter(e => e.date === todayKey).reduce((sum, e) => sum + e.amount, 0);
  };

  const addWater = (amount) => {
    setWaterIntake(prev => [...prev, {
      id: Date.now(),
      date: getTodayKey(),
      amount,
      timestamp: new Date().toISOString(),
    }]);
  };

  const removeEntry = (id) => setWaterIntake(prev => prev.filter(e => e.id !== id));

  const getTodayEntries = () => {
    const todayKey = getTodayKey();
    return waterIntake.filter(e => e.date === todayKey).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

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
      if (Object.prototype.hasOwnProperty.call(weekData, entry.date)) {
        weekData[entry.date] += entry.amount;
      }
    });
    return Object.entries(weekData).map(([date, amount]) => ({ date, amount, percentage: Math.round((amount / dailyGoal) * 100) }));
  };

  const getCalculationDetails = () => {
    if (!userData?.weight) return t('Заполните вес в профиле для автоматического расчета', 'Fill in your weight in profile for automatic calculation');
    const factors = [t(`Вес: ${userData.weight} кг`, `Weight: ${userData.weight} kg`)];
    if (userData.age) factors.push(t(`Возраст: ${userData.age} лет`, `Age: ${userData.age} years`));
    if (userData.lifestyle) factors.push(t(`Активность: ${userData.lifestyle}`, `Activity: ${userData.lifestyle}`));
    if (userData.goal) factors.push(t(`Цель: ${userData.goal}`, `Goal: ${userData.goal}`));
    return factors.join(' • ');
  };

  const todayIntake = getTodayIntake();
  const progress = Math.min((todayIntake / dailyGoal) * 100, 100);
  const remaining = Math.max(dailyGoal - todayIntake, 0);

  const WaveProgress = ({ percentage }) => {
    const waveHeight = 100 - percentage;
    return (
      <div className="relative w-48 h-48 mx-auto">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="none" stroke={theme.border} strokeWidth="3" className="opacity-30" />
          <defs>
            <clipPath id="circleClip">
              <circle cx="100" cy="100" r="95" />
            </clipPath>
          </defs>
          <g clipPath="url(#circleClip)">
            <rect x="0" y={waveHeight * 2} width="200" height="200" fill="#4A90E2" opacity="0.3" />
            <path d={`M 0 ${waveHeight * 2} Q 50 ${waveHeight * 2 - 10} 100 ${waveHeight * 2} T 200 ${waveHeight * 2} V 200 H 0 Z`} fill="#4A90E2" opacity="0.6">
              <animate attributeName="d" dur="3s" repeatCount="indefinite"
                values={`M 0 ${waveHeight * 2} Q 50 ${waveHeight * 2 - 10} 100 ${waveHeight * 2} T 200 ${waveHeight * 2} V 200 H 0 Z;M 0 ${waveHeight * 2} Q 50 ${waveHeight * 2 + 10} 100 ${waveHeight * 2} T 200 ${waveHeight * 2} V 200 H 0 Z;M 0 ${waveHeight * 2} Q 50 ${waveHeight * 2 - 10} 100 ${waveHeight * 2} T 200 ${waveHeight * 2} V 200 H 0 Z`}
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
          {useAutoCalculation && (
            <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <p className={`${fontSize.small} text-blue-800 font-semibold mb-2`}>📊 {t('Факторы расчета:', 'Calculation factors:')}</p>
              <p className={`${fontSize.tiny} text-blue-700`}>{getCalculationDetails()}</p>
              <p className={`${fontSize.tiny} text-blue-600 mt-2`}>💡 {t('Норма автоматически обновляется при изменении профиля', 'The goal updates automatically when you change your profile')}</p>
            </div>
          )}
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
              <button onClick={() => removeEntry(entry.id)} className={`${theme.textSecondary} hover:text-red-500 transition`}>
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
                    <div className={`h-2 rounded-full transition-all duration-500 ${ percentage >= 100 ? 'bg-green-500' : percentage >= 50 ? 'bg-blue-500' : 'bg-gray-400' }`}
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
