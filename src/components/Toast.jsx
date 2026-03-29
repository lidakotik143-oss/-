import React, { useEffect } from 'react';

/**
 * Глобальный toast-компонент.
 * Пропы: message, type ('success'|'error'), visible, onHide
 */
export default function Toast({ message, type = 'success', visible, onHide }) {
  useEffect(() => {
    if (!visible) return;
    const id = setTimeout(onHide, 3000);
    return () => clearTimeout(id);
  }, [visible, onHide]);

  if (!visible) return null;

  const bg    = type === 'error' ? 'bg-red-500' : 'bg-[#606C38]';
  const icon  = type === 'error' ? '✕' : '✓';

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-white ${bg} transition-all duration-300`}
      style={{ minWidth: 220, maxWidth: '90vw' }}
    >
      <span className="text-lg font-bold">{icon}</span>
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
