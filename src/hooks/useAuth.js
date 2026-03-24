import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  getUserProfile,
  getMealHistory,
  getWeeklyPlan,
  getFavorites,
} from '../firebase.js';
import { loadUserSubstitutions } from '../utils/substitutions';

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

        // Загружаем историю, план меню и избранное параллельно
        let firestoreHistory = [];
        let firestorePlan = {};
        let firestoreFavorites = [];
        try {
          [firestoreHistory, firestorePlan, firestoreFavorites] = await Promise.all([
            getMealHistory(user.uid),
            getWeeklyPlan(user.uid),
            getFavorites(user.uid),
          ]);
        } catch {
          const savedHistory   = localStorage.getItem(`cookify_mealHistory_${user.uid}`);
          const savedPlan      = localStorage.getItem(`cookify_weeklyPlan_${user.uid}`);
          const savedFavorites = localStorage.getItem('cookify_favorites');
          if (savedHistory)   firestoreHistory   = JSON.parse(savedHistory);
          if (savedPlan)      firestorePlan       = JSON.parse(savedPlan);
          if (savedFavorites) firestoreFavorites  = JSON.parse(savedFavorites);
        }

        const substitutions = loadUserSubstitutions();

        onLoggedIn?.({
          user,
          firestoreHistory,
          firestorePlan,
          substitutions,
          firestoreFavorites,
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
