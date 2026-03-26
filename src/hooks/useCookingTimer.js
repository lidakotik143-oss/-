import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useCookingTimer
 * totalMinutes — общее время рецепта в минутах
 * Возвращает: secondsLeft, isRunning, isDone, start, pause, reset, formatted
 */
export function useCookingTimer(totalMinutes) {
  const total = Math.max(1, parseInt(totalMinutes, 10)) * 60;
  const [secondsLeft, setSecondsLeft] = useState(total);
  const [isRunning, setIsRunning]     = useState(false);
  const [isDone, setIsDone]           = useState(false);
  const intervalRef                   = useRef(null);

  // Сброс при смене рецепта
  useEffect(() => {
    setSecondsLeft(total);
    setIsRunning(false);
    setIsDone(false);
    return () => clearInterval(intervalRef.current);
  }, [total]);

  useEffect(() => {
    if (!isRunning) { clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          setIsDone(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const start  = useCallback(() => { if (!isDone) setIsRunning(true);  }, [isDone]);
  const pause  = useCallback(() => setIsRunning(false), []);
  const reset  = useCallback(() => {
    clearInterval(intervalRef.current);
    setSecondsLeft(total);
    setIsRunning(false);
    setIsDone(false);
  }, [total]);

  const h = Math.floor(secondsLeft / 3600);
  const m = Math.floor((secondsLeft % 3600) / 60);
  const s = secondsLeft % 60;
  const formatted = h > 0
    ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
    : `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;

  const progress = total > 0 ? ((total - secondsLeft) / total) * 100 : 0;

  return { secondsLeft, isRunning, isDone, start, pause, reset, formatted, progress };
}
