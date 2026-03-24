import { useState, useEffect, useCallback } from 'react';
import { getFavorites, toggleFavorite } from '../firebase';

/**
 * useFavorites — хук для работы с избранными рецептами.
 * Синхронизирует данные с Firestore для авторизованных пользователей,
 * иначе хранит в localStorage.
 */
export function useFavorites(firebaseUser) {
  const [favorites, setFavorites] = useState([]);

  // Загружаем избранное при входе
  useEffect(() => {
    if (firebaseUser?.uid) {
      getFavorites(firebaseUser.uid)
        .then(ids => setFavorites(ids))
        .catch(() => {
          const saved = localStorage.getItem('cookify_favorites');
          if (saved) setFavorites(JSON.parse(saved));
        });
    } else {
      const saved = localStorage.getItem('cookify_favorites');
      setFavorites(saved ? JSON.parse(saved) : []);
    }
  }, [firebaseUser?.uid]);

  // Сохраняем в localStorage для не-авторизованных
  useEffect(() => {
    if (!firebaseUser?.uid) {
      localStorage.setItem('cookify_favorites', JSON.stringify(favorites));
    }
  }, [favorites, firebaseUser?.uid]);

  const toggleFav = useCallback(async (recipeId) => {
    if (firebaseUser?.uid) {
      try {
        const updated = await toggleFavorite(firebaseUser.uid, recipeId);
        setFavorites(updated);
      } catch {
        // fallback: обновляем локально
        setFavorites(prev =>
          prev.includes(recipeId) ? prev.filter(id => id !== recipeId) : [...prev, recipeId]
        );
      }
    } else {
      setFavorites(prev =>
        prev.includes(recipeId) ? prev.filter(id => id !== recipeId) : [...prev, recipeId]
      );
    }
  }, [firebaseUser?.uid]);

  const isFavorite = useCallback((recipeId) => favorites.includes(recipeId), [favorites]);

  return { favorites, toggleFav, isFavorite };
}
