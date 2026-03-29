import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaRedo, FaClock, FaExpand, FaCompress } from 'react-icons/fa';
import { useCookingTimer } from '../hooks/useCookingTimer';

// =================== Полноэкранный таймер ===================
function FullscreenTimer({ minutes, stepText, stepIndex, t, onClose }) {
  const { isRunning, isDone, start, pause, reset, formatted, progress } = useCookingTimer(minutes);
  const size = 280;
  const r = 120;
  const circumference = 2 * Math.PI * r;
  const strokeDash = circumference - (progress / 100) * circumference;
  const color = isDone ? '#10B981' : '#F59E0B';

  useEffect(() => {
    if (isDone && navigator.vibrate) navigator.vibrate([300, 100, 300]);
  }, [isDone]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white/60 hover:text-white transition p-2 rounded-full hover:bg-white/10"
        title={t('Свернуть', 'Minimize')}
      >
        <FaCompress size={22} />
      </button>

      <div className="text-center mb-8 px-8 max-w-md">
        <div className="text-white/50 text-sm font-medium mb-2 tracking-widest uppercase">
          {t(`Шаг ${stepIndex + 1}`, `Step ${stepIndex + 1}`)}
        </div>
        {stepText && (
          <p className="text-white/80 text-base leading-relaxed line-clamp-3">{stepText}</p>
        )}
      </div>

      <div className="relative" style={{ width: size, height: size }}>
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: isDone
              ? '0 0 60px 20px rgba(16,185,129,0.3)'
              : '0 0 60px 20px rgba(245,158,11,0.25)',
            transition: 'box-shadow 1s ease'
          }}
        />
        <svg width={size} height={size} className="-rotate-90 drop-shadow-2xl">
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
          <circle
            cx={size/2} cy={size/2} r={r} fill="none"
            stroke={color} strokeWidth="12"
            strokeDasharray={circumference} strokeDashoffset={strokeDash}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s linear, stroke 0.5s ease', filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isDone ? (
            <>
              <span className="text-7xl mb-2" style={{ filter: 'drop-shadow(0 0 12px #10B981)' }}>🎉</span>
              <span className="text-white font-bold text-2xl tracking-wide" style={{ color: '#10B981' }}>
                {t('Готово!', 'Done!')}
              </span>
            </>
          ) : (
            <>
              <span
                className="font-bold tabular-nums"
                style={{ fontSize: 64, color, lineHeight: 1, filter: `drop-shadow(0 0 10px ${color})` }}
              >
                {formatted}
              </span>
              <span className="text-white/40 text-sm mt-2 tracking-widest">
                {t('осталось', 'remaining')}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mt-10">
        {!isDone && (
          isRunning ? (
            <button
              onClick={pause}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold text-lg transition hover:opacity-80 active:scale-95"
              style={{ background: 'rgba(245,158,11,0.25)', border: '2px solid rgba(245,158,11,0.5)' }}
            >
              <FaPause size={18}/> {t('Пауза', 'Pause')}
            </button>
          ) : (
            <button
              onClick={start}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold text-lg transition hover:opacity-90 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', boxShadow: '0 4px 20px rgba(245,158,11,0.4)' }}
            >
              <FaPlay size={18}/> {t('Старт', 'Start')}
            </button>
          )
        )}
        <button
          onClick={reset}
          className="flex items-center gap-2 px-6 py-4 rounded-2xl text-white/70 font-semibold text-base transition hover:text-white hover:bg-white/10 active:scale-95"
          style={{ border: '2px solid rgba(255,255,255,0.15)' }}
        >
          <FaRedo size={16}/> {t('Сброс', 'Reset')}
        </button>
      </div>

      <p className="absolute bottom-6 text-white/25 text-xs tracking-widest">
        {t('Нажмите Esc или ⊞ чтобы свернуть', 'Press Esc or ⊞ to minimize')}
      </p>
    </div>
  );
}

// =================== Мини-таймер шага ===================
export default function StepTimer({ minutes, stepText, stepIndex = 0, theme, fontSize, t }) {
  const mins = parseInt(minutes, 10);
  if (!mins || mins <= 0) return null;

  return <StepTimerInner minutes={mins} stepText={stepText} stepIndex={stepIndex} theme={theme} fontSize={fontSize} t={t} />;
}

function StepTimerInner({ minutes, stepText, stepIndex, theme, fontSize, t }) {
  const { isRunning, isDone, start, pause, reset, formatted, progress } = useCookingTimer(minutes);
  const [fullscreen, setFullscreen] = useState(false);

  const circumference = 2 * Math.PI * 16;
  const strokeDash = circumference - (progress / 100) * circumference;

  return (
    <>
      {fullscreen && (
        <FullscreenTimer
          minutes={minutes}
          stepText={stepText}
          stepIndex={stepIndex}
          t={t}
          onClose={() => setFullscreen(false)}
        />
      )}

      <div
        className={`inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-xl border ${
          isDone ? 'border-green-400 bg-green-50' : 'border-amber-300 bg-amber-50'
        } transition-colors`}
        style={{ maxWidth: 320 }}
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
          className={`font-mono font-bold tabular-nums ${fontSize?.tiny || 'text-xs'}`}
          style={{ color: isDone ? '#10B981' : '#B45309', minWidth: 38 }}
        >
          {isDone ? t('Готово!', 'Done!') : formatted}
        </span>

        {/* Кнопки управления */}
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
        <span className={`${fontSize?.tiny || 'text-xs'} text-gray-400 ml-1 whitespace-nowrap`}>
          {minutes} {t('мин', 'min')}
        </span>

        {/* Кнопка полного экрана */}
        <button
          onClick={() => setFullscreen(true)}
          className="w-6 h-6 flex items-center justify-center rounded-full text-amber-400/60 hover:text-amber-500 hover:bg-amber-100 transition ml-0.5 flex-shrink-0"
          title={t('Открыть большой таймер', 'Open fullscreen timer')}
        >
          <FaExpand size={9} />
        </button>
      </div>
    </>
  );
}
