import { useState, useEffect, useCallback } from 'react';
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const getTodayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

export function useWater(firebaseUser, userData) {
  const [waterIntake, setWaterIntake] = useState([]);
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [useAutoCalculation, setUseAutoCalculation] = useState(true);

  const calculateWaterGoal = useCallback(() => {
    if (!userData?.weight) return 2000;
    let base = userData.weight * 35;
    if (userData.age) {
      if (userData.age < 30) base *= 1.0;
      else if (userData.age < 55) base *= 0.95;
      else base *= 0.9;
    }
    if (userData.lifestyle) {
      const ll = userData.lifestyle.toLowerCase();
      if (ll.includes('умеренно') || ll.includes('moderate')) base *= 1.15;
      else if (ll.includes('активный') || ll.includes('active')) base *= 1.3;
    }
    if (userData.goal) {
      const gl = userData.goal.toLowerCase();
      if (gl.includes('снижение') || gl.includes('weight loss')) base *= 1.1;
      else if (gl.includes('набор') || gl.includes('muscle gain')) base *= 1.2;
    }
    return Math.round(base);
  }, [userData]);

  const firestoreRef = () =>
    firebaseUser?.uid ? doc(db, 'users', firebaseUser.uid, 'data', 'waterTracker') : null;

  const loadFromFirestore = useCallback(async () => {
    const ref = firestoreRef();
    if (!ref) return null;
    try {
      const snap = await getDoc(ref);
      return snap.exists() ? snap.data() : null;
    } catch { return null; }
  }, [firebaseUser?.uid]);

  const saveToFirestore = useCallback(async (intake, goal, autoCalc) => {
    const ref = firestoreRef();
    if (!ref) return;
    try {
      await setDoc(ref, { waterIntake: intake, dailyGoal: goal, useAutoCalculation: autoCalc, updatedAt: new Date().toISOString() });
    } catch {}
  }, [firebaseUser?.uid]);

  useEffect(() => {
    const init = async () => {
      const remote = await loadFromFirestore();
      if (remote) {
        setWaterIntake(remote.waterIntake || []);
        const autoCalc = remote.useAutoCalculation !== false;
        setUseAutoCalculation(autoCalc);
        setDailyGoal(autoCalc ? calculateWaterGoal() : (remote.dailyGoal || 2000));
        return;
      }
      const saved = localStorage.getItem('cookify_waterIntake');
      const savedGoal = localStorage.getItem('cookify_waterGoal');
      const savedAutoCalc = localStorage.getItem('cookify_waterAutoCalc');
      if (saved) setWaterIntake(JSON.parse(saved));
      if (savedAutoCalc !== null) {
        const autoCalc = savedAutoCalc === 'true';
        setUseAutoCalculation(autoCalc);
        setDailyGoal(autoCalc ? calculateWaterGoal() : (savedGoal ? Number(savedGoal) : 2000));
      } else {
        setDailyGoal(calculateWaterGoal());
      }
    };
    init();
  }, [firebaseUser?.uid]);

  useEffect(() => {
    if (useAutoCalculation && userData) setDailyGoal(calculateWaterGoal());
  }, [userData?.weight, userData?.age, userData?.lifestyle, userData?.goal, useAutoCalculation]);

  useEffect(() => {
    localStorage.setItem('cookify_waterIntake', JSON.stringify(waterIntake));
    if (!useAutoCalculation) localStorage.setItem('cookify_waterGoal', dailyGoal.toString());
    localStorage.setItem('cookify_waterAutoCalc', useAutoCalculation.toString());
    saveToFirestore(waterIntake, dailyGoal, useAutoCalculation);
  }, [waterIntake, dailyGoal, useAutoCalculation]);

  const todayIntake = waterIntake
    .filter(e => e.date === getTodayKey())
    .reduce((sum, e) => sum + e.amount, 0);

  const addWater = (amount) => {
    setWaterIntake(prev => [...prev, { id: Date.now(), date: getTodayKey(), amount, timestamp: new Date().toISOString() }]);
  };

  const removeWaterEntry = (id) => setWaterIntake(prev => prev.filter(e => e.id !== id));

  const getTodayEntries = () =>
    waterIntake.filter(e => e.date === getTodayKey()).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const getWeeklyStats = () => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekData = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekAgo);
      date.setDate(weekAgo.getDate() + i + 1);
      const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
      weekData[key] = 0;
    }
    waterIntake.forEach(entry => {
      if (Object.prototype.hasOwnProperty.call(weekData, entry.date)) weekData[entry.date] += entry.amount;
    });
    return Object.entries(weekData).map(([date, amount]) => ({ date, amount, percentage: Math.round((amount / dailyGoal) * 100) }));
  };

  return {
    waterIntake, setWaterIntake,
    dailyGoal, setDailyGoal,
    useAutoCalculation, setUseAutoCalculation,
    todayIntake,
    addWater, removeWaterEntry,
    getTodayEntries, getWeeklyStats,
    calculateWaterGoal,
  };
}
