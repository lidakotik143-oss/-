import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useCookingTimer(minutes)
 * Независимый таймер: каждый вызов — своя изолированная копия.
 * Поддерживает несколько одновременных таймеров на странице.
 */
export function useCookingTimer(minutes) {
  const totalSeconds = Math.max(1, Math.round((parseFloat(minutes) || 0) * 60));

  const [remaining, setRemaining] = useState(totalSeconds);
  const [isRunning, setIsRunning]  = useState(false);
  const [isDone,    setIsDone]     = useState(false);
  const intervalRef = useRef(null);

  // Сброс при смене длительности
  useEffect(() => {
    setRemaining(totalSeconds);
    setIsRunning(false);
    setIsDone(false);
    clearInterval(intervalRef.current);
  }, [totalSeconds]);

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
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

  const start = useCallback(() => { if (!isDone) setIsRunning(true);  }, [isDone]);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    clearInterval(intervalRef.current);
    setRemaining(totalSeconds);
    setIsRunning(false);
    setIsDone(false);
  }, [totalSeconds]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const progress   = Math.round(((totalSeconds - remaining) / totalSeconds) * 100);

  return { isRunning, isDone, start, pause, reset, formatted, progress, remaining };
}
