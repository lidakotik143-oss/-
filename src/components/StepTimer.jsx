import React from 'react';
import { FaPlay, FaPause, FaRedo, FaClock } from 'react-icons/fa';
import { useCookingTimer } from '../hooks/useCookingTimer';

/**
 * Мини-таймер для одного шага рецепта.
 * Показывается только если step.timerMinutes задан.
 */
export default function StepTimer({ minutes, theme, fontSize, t }) {
  const mins = parseInt(minutes, 10);
  if (!mins || mins <= 0) return null;

  return <StepTimerInner minutes={mins} theme={theme} fontSize={fontSize} t={t} />;
}

function StepTimerInner({ minutes, theme, fontSize, t }) {
  const { isRunning, isDone, start, pause, reset, formatted, progress } = useCookingTimer(minutes);

  const circumference = 2 * Math.PI * 16; // r=16, маленький кружок
  const strokeDash = circumference - (progress / 100) * circumference;

  return (
    <div
      className={`inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-xl border ${
        isDone ? 'border-green-400 bg-green-50' : 'border-amber-300 bg-amber-50'
      } transition-colors`}
      style={{ maxWidth: 280 }}
    >
      {/* Круговой прогресс */}
      <div className="relative flex-shrink-0" style={{ width: 36, height: 36 }}>
        <svg width="36" height="36" className="-rotate-90">
          <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="3" />
          <circle
            cx="18" cy="18" r="16" fill="none"
            stroke={isDone ? '#10B981' : '#F59E0B'}
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDash}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {isDone
            ? <span style={{ fontSize: 13, color: '#10B981' }}>✓</span>
            : <FaClock size={11} color="#F59E0B" />
          }
        </div>
      </div>

      {/* Время */}
      <span
        className={`font-mono font-bold tabular-nums ${fontSize.tiny}`}
        style={{ color: isDone ? '#10B981' : '#B45309', minWidth: 38 }}
      >
        {isDone ? t('Готово!', 'Done!') : formatted}
      </span>

      {/* Кнопки */}
      <div className="flex gap-1 ml-1">
        {!isDone && (
          isRunning
            ? <button
                onClick={pause}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-amber-400 text-white hover:bg-amber-500 transition"
                title={t('Пауза', 'Pause')}
              >
                <FaPause size={8} />
              </button>
            : <button
                onClick={start}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-amber-400 text-white hover:bg-amber-500 transition"
                title={t('Старт', 'Start')}
              >
                <FaPlay size={8} />
              </button>
        )}
        <button
          onClick={reset}
          className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:opacity-70 transition"
          title={t('Сброс', 'Reset')}
        >
          <FaRedo size={8} />
        </button>
      </div>

      {/* Подпись */}
      <span className={`${fontSize.tiny} text-gray-400 ml-1 whitespace-nowrap`}>
        {minutes} {t('мин', 'min')}
      </span>
    </div>
  );
}
