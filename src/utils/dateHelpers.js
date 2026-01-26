// Утилиты для работы с датами

import { MONTH_NAMES_RU, MONTH_NAMES_EN, WEEKDAY_NAMES_RU, WEEKDAY_NAMES_EN } from './constants';

export const getDateKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const getWeekKey = (date) => {
  const d = new Date(date);
  const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
  const pastDaysOfYear = (d - firstDayOfYear) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
};

export const getMonthKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

export const formatDate = (dateStr, language) => {
  const d = new Date(dateStr);
  if (language === "ru") {
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
};

export const getWeekDays = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  
  const days = [];
  for (let i = 0; i < 7; i++) {
    const current = new Date(monday);
    current.setDate(monday.getDate() + i);
    days.push(getDateKey(current));
  }
  return days;
};

export const getWeekRange = (date, language) => {
  const weekDays = getWeekDays(date);
  const firstDay = new Date(weekDays[0]);
  const lastDay = new Date(weekDays[6]);
  
  const MONTH_NAMES = language === "ru" ? MONTH_NAMES_RU : MONTH_NAMES_EN;
  
  if (language === "ru") {
    return `${firstDay.getDate()} ${MONTH_NAMES[firstDay.getMonth()].toLowerCase().slice(0, 3)} — ${lastDay.getDate()} ${MONTH_NAMES[lastDay.getMonth()].toLowerCase().slice(0, 3)} ${lastDay.getFullYear()}`;
  } else {
    return `${MONTH_NAMES[firstDay.getMonth()].slice(0, 3)} ${firstDay.getDate()} — ${MONTH_NAMES[lastDay.getMonth()].slice(0, 3)} ${lastDay.getDate()}, ${lastDay.getFullYear()}`;
  }
};

export const addDays = (dateStr, days) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return getDateKey(d);
};

export const addWeeks = (dateStr, weeks) => {
  return addDays(dateStr, weeks * 7);
};

export const addMonths = (dateStr, months) => {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return getDateKey(d);
};

export const setMonthYear = (dateStr, month, year) => {
  const d = new Date(dateStr);
  d.setFullYear(year);
  d.setMonth(month);
  return getDateKey(d);
};