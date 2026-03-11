/**
 * Расчёт суточных норм КБЖУ по формуле Миффлина — Сан Жеора
 * @param {object} userData - данные профиля пользователя
 * @returns {{ calories: number, protein: number, fat: number, carbs: number }}
 */
export function calculateDailyGoals(userData) {
  const weight = parseFloat(userData?.weight);
  const height = parseFloat(userData?.height);
  const age = parseFloat(userData?.age);

  if (!weight) {
    return { calories: 2000, protein: 150, fat: 70, carbs: 250 };
  }

  // Определение пола
  const genderLower = (userData?.gender || '').toLowerCase();
  const isMale =
    genderLower.includes('муж') ||
    genderLower.includes('male') ||
    genderLower === 'м' ||
    genderLower === 'm';

  const h = height || 170; // fallback рост 170 см
  const a = age || 25;     // fallback возраст 25 лет

  // BMR по формуле Миффлина — Сан Жеора
  const bmr = isMale
    ? 10 * weight + 6.25 * h - 5 * a + 5
    : 10 * weight + 6.25 * h - 5 * a - 161;

  // Коэффициент активности (TDEE)
  let activityFactor = 1.2; // сидячий — по умолчанию
  if (userData?.lifestyle) {
    const lf = userData.lifestyle.toLowerCase();
    if (lf.includes('лёгк') || lf.includes('легк') || lf.includes('light')) {
      activityFactor = 1.375;
    } else if (lf.includes('умеренн') || lf.includes('moderate')) {
      activityFactor = 1.55;
    } else if (lf.includes('высок') || lf.includes('активн') || lf.includes('active')) {
      activityFactor = 1.725;
    } else if (lf.includes('очень') || lf.includes('very')) {
      activityFactor = 1.9;
    }
  }

  let calorieGoal = bmr * activityFactor;

  // Соотношение БЖУ по умолчанию (поддержание веса)
  let proteinRatio = 0.30;
  let fatRatio = 0.25;
  let carbsRatio = 0.45;

  // Коррекция по цели
  if (userData?.goal) {
    const gl = userData.goal.toLowerCase();
    if (
      gl.includes('снижен') ||
      gl.includes('похуд') ||
      gl.includes('weight loss') ||
      gl.includes('loss')
    ) {
      calorieGoal *= 0.8;   // дефицит 20%
      proteinRatio = 0.35;
      fatRatio = 0.30;
      carbsRatio = 0.35;
    } else if (
      gl.includes('набор') ||
      gl.includes('muscle') ||
      gl.includes('gain')
    ) {
      calorieGoal *= 1.15;  // профицит 15%
      proteinRatio = 0.30;
      fatRatio = 0.20;
      carbsRatio = 0.50;
    }
  }

  calorieGoal = Math.round(calorieGoal);

  return {
    calories: calorieGoal,
    protein: Math.round((calorieGoal * proteinRatio) / 4),  // 1г белка = 4 ккал
    fat: Math.round((calorieGoal * fatRatio) / 9),           // 1г жира = 9 ккал
    carbs: Math.round((calorieGoal * carbsRatio) / 4)        // 1г углеводов = 4 ккал
  };
}
