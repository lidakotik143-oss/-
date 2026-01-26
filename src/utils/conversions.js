// Конвертация единиц измерения

const CM_TO_INCH = 0.393701;
const KG_TO_LB = 2.20462;
const INCH_TO_CM = 2.54;
const LB_TO_KG = 0.453592;

export const convertWeight = (value, fromUnit) => {
  if (!value) return value;
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  if (fromUnit === "metric") {
    return (num * KG_TO_LB).toFixed(1);
  } else {
    return (num * LB_TO_KG).toFixed(1);
  }
};

export const convertHeight = (value, fromUnit) => {
  if (!value) return value;
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  if (fromUnit === "metric") {
    return (num * CM_TO_INCH).toFixed(1);
  } else {
    return (num * INCH_TO_CM).toFixed(1);
  }
};

export const getDisplayWeight = (weight, unitSystem, language) => {
  if (!weight) return "";
  const value = unitSystem === "metric" ? weight : convertWeight(weight, "metric");
  const unit = unitSystem === "metric" ? (language === "ru" ? "кг" : "kg") : "lb";
  return `${value} ${unit}`;
};

export const getDisplayHeight = (height, unitSystem, language) => {
  if (!height) return "";
  const value = unitSystem === "metric" ? height : convertHeight(height, "metric");
  const unit = unitSystem === "metric" ? (language === "ru" ? "см" : "cm") : "in";
  return `${value} ${unit}`;
};