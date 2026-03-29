import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaTimes } from 'react-icons/fa';

/**
 * Toast — лёгкое всплывающее уведомление.
 * Используй через контекст: showToast(message, type?)
 * type: 'success' | 'error'  (по умолчанию 'success')
 */
export default function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${
        isSuccess
          ? 'bg-white border-green-200 text-green-800'
          : 'bg-white border-red-200 text-red-700'
      }`}
      style={{ minWidth: 240, maxWidth: 'calc(100vw - 32px)' }}
    >
      {isSuccess
        ? <FaCheckCircle className="text-green-500 flex-shrink-0" size={18} />
        : <FaTimesCircle className="text-red-400 flex-shrink-0" size={18} />
      }
      <span className="text-sm font-medium flex-1">{message}</span>
      <button
        onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
        className="text-gray-400 hover:text-gray-600 transition flex-shrink-0 ml-1"
      >
        <FaTimes size={13} />
      </button>
    </div>
  );
}
