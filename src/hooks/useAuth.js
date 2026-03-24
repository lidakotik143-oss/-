import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  getUserProfile,
  getMealHistory,
  getWeeklyPlan,
} from '../firebase.js';
import { loadUserSubstitutions } from '../utils/substitutions';

/**
 * useAuth — хук авторизации Firebase.
 * Инкапсулирует слушатель onAuthStateChanged, загрузку профиля
 * и восстановление данных из Firestore / localStorage.
 *
 * Возвращает:
 *   firebaseUser   — объект пользователя Firebase (или null)
 *   userData       — профиль пользователя из Firestore
 *   setUserData    — сеттер профиля
 *   registered     — залогинен ли пользователь
 *   setRegistered  — сеттер
 *   authLoading    — идёт ли первичная проверка авторизации
 *
 * Колбэки onLoggedIn / onLoggedOut вызываются при смене состояния
 * и используются в CookifyDemo для загрузки настроек из localStorage.
 */
export function useAuth({ onLoggedIn, onLoggedOut } = {}) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseUser(user);
        setRegistered(true);

        // Загружаем профиль
        try {
          const profile = await getUserProfile(user.uid);
          setUserData(
            profile
              ? { ...profile, email: user.email, uid: user.uid }
              : { email: user.email, uid: user.uid, login: user.email }
          );
        } catch {
          setUserData({ email: user.email, uid: user.uid, login: user.email });
        }

        // Загружаем историю питания и план меню
        let firestoreHistory = [];
        let firestorePlan = {};
        try {
          [firestoreHistory, firestorePlan] = await Promise.all([
            getMealHistory(user.uid),
            getWeeklyPlan(user.uid),
          ]);
        } catch {
          const savedHistory = localStorage.getItem(`cookify_mealHistory_${user.uid}`);
          const savedPlan = localStorage.getItem(`cookify_weeklyPlan_${user.uid}`);
          if (savedHistory) firestoreHistory = JSON.parse(savedHistory);
          if (savedPlan) firestorePlan = JSON.parse(savedPlan);
        }

        const substitutions = loadUserSubstitutions();

        // Вызываем колбэк — CookifyDemo применит настройки из localStorage
        onLoggedIn?.({
          user,
          firestoreHistory,
          firestorePlan,
          substitutions,
        });
      } else {
        setFirebaseUser(null);
        setRegistered(false);
        setUserData(null);
        onLoggedOut?.();
      }

      setAuthLoading(false);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    firebaseUser,
    setFirebaseUser,
    userData,
    setUserData,
    registered,
    setRegistered,
    authLoading,
  };
}
