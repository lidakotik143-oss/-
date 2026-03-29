import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaRedo, FaClock, FaExpand, FaCompress } from 'react-icons/fa';
import { useCookingTimer } from '../hooks/useCookingTimer';

// Цвета полноэкранного таймера по каждой теме
const THEME_PALETTES = {
  // Оливковая — bg-[#FEFAE0]
  olive:  { bg1: '#2D3A1E', bg2: '#3D4E28', bg3: '#606C38', accent: '#DDA15E', text: '#FEFAE0', textMuted: 'rgba(254,250,224,0.55)' },
  // Шалфейная — bg-[#F0EAD2]
  sage:   { bg1: '#2C2318', bg2: '#4A3728', bg3: '#6C584C', accent: '#A98467', text: '#F0EAD2', textMuted: 'rgba(240,234,210,0.55)' },
  // Лесная — bg-[#172815]
  forest: { bg1: '#0D1A0C', bg2: '#172815', bg3: '#3E5622', accent: '#95B46A', text: '#EDEEC9', textMuted: 'rgba(237,238,201,0.5)' },
};

function getThemeColors(theme) {
  if (!theme) return THEME_PALETTES.olive;
  const bg = (theme.bg || '').toLowerCase();
  // Определяем по уникальному цвету фона приложения
  if (bg.includes('172815')) return THEME_PALETTES.forest; // Лесная
  if (bg.includes('f0ead2')) return THEME_PALETTES.sage;   // Шалфейная
  return THEME_PALETTES.olive;                             // Оливковая (по умолчанию)
}

// =================== Полноэкранный таймер ===================
function FullscreenTimer({ minutes, stepText, stepIndex, theme, t, onClose }) {
  const { isRunning, isDone, start, pause, reset, formatted, progress } = useCookingTimer(minutes);
  const tc = getThemeColors(theme);

  const size = 280;
  const r = 120;
  const circumference = 2 * Math.PI * r;
  const strokeDash = circumference - (progress / 100) * circumference;
  const timerColor = isDone ? '#10B981' : tc.accent;

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
      style={{ background: `linear-gradient(135deg, ${tc.bg1} 0%, ${tc.bg2} 50%, ${tc.bg3} 100%)` }}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 transition p-2 rounded-full hover:bg-white/10"
        style={{ color: tc.textMuted }}
        title={t('Свернуть', 'Minimize')}
      >
        <FaCompress size={22} />
      </button>

      <div className="text-center mb-8 px-8 max-w-md">
        <div className="text-sm font-medium mb-2 tracking-widest uppercase" style={{ color: tc.textMuted }}>
          {t(`Шаг ${stepIndex + 1}`, `Step ${stepIndex + 1}`)}
        </div>
        {stepText && (
          <p className="text-base leading-relaxed line-clamp-3" style={{ color: tc.text, opacity: 0.85 }}>{stepText}</p>
        )}
      </div>

      <div className="relative" style={{ width: size, height: size }}>
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: isDone
              ? '0 0 60px 20px rgba(16,185,129,0.3)'
              : `0 0 60px 20px ${tc.accent}55`,
            transition: 'box-shadow 1s ease'
          }}
        />
        <svg width={size} height={size} className="-rotate-90 drop-shadow-2xl">
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="12" />
          <circle
            cx={size/2} cy={size/2} r={r} fill="none"
            stroke={timerColor} strokeWidth="12"
            strokeDasharray={circumference} strokeDashoffset={strokeDash}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s linear, stroke 0.5s ease', filter: `drop-shadow(0 0 8px ${timerColor})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isDone ? (
            <>
              <span className="text-7xl mb-2" style={{ filter: 'drop-shadow(0 0 12px #10B981)' }}>🎉</span>
              <span className="font-bold text-2xl tracking-wide" style={{ color: '#10B981' }}>
                {t('Готово!', 'Done!')}
              </span>
            </>
          ) : (
            <>
              <span
                className="font-bold tabular-nums"
                style={{ fontSize: 64, color: timerColor, lineHeight: 1, filter: `drop-shadow(0 0 10px ${timerColor})` }}
              >
                {formatted}
              </span>
              <span className="text-sm mt-2 tracking-widest" style={{ color: tc.textMuted }}>
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
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-lg transition hover:opacity-80 active:scale-95"
              style={{ background: `${tc.accent}30`, border: `2px solid ${tc.accent}80`, color: tc.text }}
            >
              <FaPause size={18}/> {t('Пауза', 'Pause')}
            </button>
          ) : (
            <button
              onClick={start}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-lg transition hover:opacity-90 active:scale-95"
              style={{ background: tc.accent, color: tc.bg1, boxShadow: `0 4px 20px ${tc.accent}60` }}
            >
              <FaPlay size={18}/> {t('Старт', 'Start')}
            </button>
          )
        )}
        <button
          onClick={reset}
          className="flex items-center gap-2 px-6 py-4 rounded-2xl font-semibold text-base transition hover:bg-white/10 active:scale-95"
          style={{ border: `2px solid ${tc.accent}40`, color: tc.textMuted }}
        >
          <FaRedo size={16}/> {t('Сброс', 'Reset')}
        </button>
      </div>

      <p className="absolute bottom-6 text-xs tracking-widest" style={{ color: tc.textMuted, opacity: 0.45 }}>
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
          theme={theme}
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

        <span
          className={`font-mono font-bold tabular-nums ${fontSize?.tiny || 'text-xs'}`}
          style={{ color: isDone ? '#10B981' : '#B45309', minWidth: 38 }}
        >
          {isDone ? t('Готово!', 'Done!') : formatted}
        </span>

        <div className="flex gap-1 ml-1">
          {!isDone && (
            isRunning
              ? <button onClick={pause} className="w-6 h-6 flex items-center justify-center rounded-full bg-amber-400 text-white hover:bg-amber-500 transition" title={t('Пауза', 'Pause')}><FaPause size={8} /></button>
              : <button onClick={start} className="w-6 h-6 flex items-center justify-center rounded-full bg-amber-400 text-white hover:bg-amber-500 transition" title={t('Старт', 'Start')}><FaPlay size={8} /></button>
          )}
          <button onClick={reset} className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:opacity-70 transition" title={t('Сброс', 'Reset')}><FaRedo size={8} /></button>
        </div>

        <span className={`${fontSize?.tiny || 'text-xs'} text-gray-400 ml-1 whitespace-nowrap`}>
          {minutes} {t('мин', 'min')}
        </span>

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
