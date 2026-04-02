import React, { useEffect, useRef } from 'react';

/**
 * Оборачивает содержимое экрана и воспроизводит плавную анимацию
 * fade + slide каждый раз, когда меняется `screenKey`.
 */
export default function ScreenTransition({ screenKey, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Перезапускаем анимацию: убираем класс → форсируем reflow → добавляем снова
    el.classList.remove('screen-enter');
    // eslint-disable-next-line no-unused-expressions
    void el.offsetWidth;
    el.classList.add('screen-enter');
  }, [screenKey]);

  return (
    <div ref={ref} className="screen-enter">
      {children}
    </div>
  );
}
