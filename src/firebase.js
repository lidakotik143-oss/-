import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, doc, setDoc, getDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDV__ssCAt_lKtTO3UCu-hHhA3qBQ7lsbg",
  authDomain: "cookify-b2ab3.firebaseapp.com",
  projectId: "cookify-b2ab3",
  storageBucket: "cookify-b2ab3.firebasestorage.app",
  messagingSenderId: "436519657487",
  appId: "1:436519657487:web:cfdc43a32a29a2f55e437a",
  measurementId: "G-ZR5XKM3X9K"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ─── РЕЦЕПТЫ (общие для всех) ──────────────────────────────────────────────

export async function getRecipes() {
  const q = query(collection(db, 'recipes'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
}

export async function addRecipe(recipe, user) {
  return await addDoc(collection(db, 'recipes'), {
    ...recipe,
    authorId: user.uid,
    authorName: user.displayName || user.email,
    createdAt: new Date().toISOString()
  });
}

export async function deleteRecipe(recipeId, userId) {
  const ref = doc(db, 'recipes', recipeId);
  const snap = await getDoc(ref);
  if (snap.data()?.authorId !== userId) throw new Error('Нет прав');
  return await deleteDoc(ref);
}

// ─── ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ (личный) ─────────────────────────────────────────

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

export async function setUserProfile(uid, data) {
  return await setDoc(doc(db, 'users', uid), data, { merge: true });
}

// ─── ИСТОРИЯ ПИТАНИЯ (личная) ─────────────────────────────────────────────────
// Хранится в Firestore: users/{uid}/mealHistory (один документ — весь массив)

export async function getMealHistory(uid) {
  const snap = await getDoc(doc(db, 'users', uid, 'data', 'mealHistory'));
  return snap.exists() ? (snap.data().entries || []) : [];
}

export async function saveMealHistory(uid, entries) {
  return await setDoc(
    doc(db, 'users', uid, 'data', 'mealHistory'),
    { entries, updatedAt: new Date().toISOString() }
  );
}

// ─── ПЛАН МЕНЮ НА НЕДЕЛЮ (личный) ─────────────────────────────────────────
// Хранится в Firestore: users/{uid}/data/weeklyPlan

export async function getWeeklyPlan(uid) {
  const snap = await getDoc(doc(db, 'users', uid, 'data', 'weeklyPlan'));
  return snap.exists() ? (snap.data().plan || {}) : {};
}

export async function saveWeeklyPlan(uid, plan) {
  return await setDoc(
    doc(db, 'users', uid, 'data', 'weeklyPlan'),
    { plan, updatedAt: new Date().toISOString() }
  );
}

// ─── ТРЕКЕР ВОДЫ (личный) ──────────────────────────────────────────────────

export async function getWaterLog(uid, date) {
  const snap = await getDoc(doc(db, 'users', uid, 'waterLog', date));
  return snap.exists() ? snap.data().amount : 0;
}

export async function setWaterLog(uid, date, amount) {
  return await setDoc(doc(db, 'users', uid, 'waterLog', date), { amount });
}

// ─── ИЗБРАННОЕ (личное) ─────────────────────────────────────────────────────

export async function getFavorites(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data().favorites || []) : [];
}

export async function toggleFavorite(uid, recipeId) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  const favorites = snap.exists() ? (snap.data().favorites || []) : [];
  const updated = favorites.includes(recipeId)
    ? favorites.filter(id => id !== recipeId)
    : [...favorites, recipeId];
  await updateDoc(ref, { favorites: updated });
  return updated;
}
