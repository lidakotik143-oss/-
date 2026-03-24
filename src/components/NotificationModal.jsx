import React from 'react';
import { FaTimes } from 'react-icons/fa';

/**
 * NotificationModal — универсальная модалка-уведомление.
 *
 * Props:
 *   isOpen    {boolean}  — показывать ли модалку
 *   onClose   {Function} — закрыть
 *   title     {string}   — заголовок
 *   message   {string}   — текст сообщения
 *   theme     {object}   — объект темы из THEMES
 *   fontSize  {object}   — объект размеров шрифта из FONT_SIZES
 *   language  {string}   — 'ru' | 'en'
 */
export default function NotificationModal({ isOpen, onClose, title, message, theme, fontSize, language }) {
  if (!isOpen) return null;

  const btnText = language === 'ru' ? 'Закрыть' : 'Close';

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className={`${theme.cardBg} ${theme.text} ${fontSize.body} rounded-2xl max-w-lg w-full p-6 shadow-2xl border-2 ${theme.border}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className={`${fontSize.subheading} font-bold ${theme.headerText}`}>{title}</h3>
          <button onClick={onClose} className={`${theme.textSecondary} hover:${theme.text} transition`}>
            <FaTimes size={20} />
          </button>
        </div>

        <p className={`${fontSize.body} ${theme.text} mb-6`}>{message}</p>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={`px-6 py-3 rounded-xl ${theme.accent} ${theme.accentHover} text-white font-semibold transition ${fontSize.body}`}
          >
            {btnText}
          </button>
        </div>
      </div>
    </div>
  );
}
