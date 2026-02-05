// Unified ingredient dictionary for Cookify
// Goal: canonicalize ingredient names across recipes & variants for reliable allergy highlighting.

// Allergen tags (suggested):
// - milk, egg, nuts, fish, shellfish, gluten, soy, sesame, mustard, celery, sulfites

export const ALLERGEN_TAGS = {
  MILK: "milk",
  EGG: "egg",
  NUTS: "nuts",
  FISH: "fish",
  SHELLFISH: "shellfish",
  GLUTEN: "gluten",
  SOY: "soy",
  SESAME: "sesame",
  MUSTARD: "mustard",
  CELERY: "celery",
  SULFITES: "sulfites"
};

// Each ingredient has canonical ru name + aliases (ru), and optional allergen tags.
export const INGREDIENTS_DICTIONARY = {
  egg_chicken: {
    id: "egg_chicken",
    nameRu: "яйцо",
    aliasesRu: ["яйцо", "яйца", "яйцо куриное", "яйца куриные"],
    allergenTags: [ALLERGEN_TAGS.EGG]
  },
  egg_yolk: {
    id: "egg_yolk",
    nameRu: "яичный желток",
    aliasesRu: ["яичный желток", "яичные желтки"],
    allergenTags: [ALLERGEN_TAGS.EGG]
  },
  milk: {
    id: "milk",
    nameRu: "молоко",
    aliasesRu: ["молоко"],
    allergenTags: [ALLERGEN_TAGS.MILK]
  },
  cream: {
    id: "cream",
    nameRu: "сливки",
    aliasesRu: ["сливки"],
    allergenTags: [ALLERGEN_TAGS.MILK]
  },
  sour_cream: {
    id: "sour_cream",
    nameRu: "сметана",
    aliasesRu: ["сметана"],
    allergenTags: [ALLERGEN_TAGS.MILK]
  },
  yogurt: {
    id: "yogurt",
    nameRu: "йогурт",
    aliasesRu: ["йогурт", "натуральный йогурт"],
    allergenTags: [ALLERGEN_TAGS.MILK]
  },
  yogurt_greek: {
    id: "yogurt_greek",
    nameRu: "греческий йогурт",
    aliasesRu: ["греческий йогурт", "йогурт греческий"],
    allergenTags: [ALLERGEN_TAGS.MILK]
  },
  cottage_cheese: {
    id: "cottage_cheese",
    nameRu: "творог",
    aliasesRu: ["творог"],
    allergenTags: [ALLERGEN_TAGS.MILK]
  },
  cheese_generic: {
    id: "cheese_generic",
    nameRu: "сыр",
    aliasesRu: ["сыр", "сыр твёрдый", "сыр сливочный"],
    allergenTags: [ALLERGEN_TAGS.MILK]
  },
  cheese_parmesan: {
    id: "cheese_parmesan",
    nameRu: "пармезан",
    aliasesRu: ["пармезан"],
    allergenTags: [ALLERGEN_TAGS.MILK]
  },
  butter: {
    id: "butter",
    nameRu: "сливочное масло",
    aliasesRu: ["сливочное масло", "масло сливочное"],
    allergenTags: [ALLERGEN_TAGS.MILK]
  },
  oil_vegetable: {
    id: "oil_vegetable",
    nameRu: "растительное масло",
    aliasesRu: ["растительное масло", "масло растительное"],
    allergenTags: []
  },
  oil_olive: {
    id: "oil_olive",
    nameRu: "оливковое масло",
    aliasesRu: ["оливковое масло"],
    allergenTags: []
  },
  salt: {
    id: "salt",
    nameRu: "соль",
    aliasesRu: ["соль"],
    allergenTags: []
  },
  pepper_black: {
    id: "pepper_black",
    nameRu: "чёрный перец",
    aliasesRu: ["чёрный перец", "перец чёрный молотый", "перец молотый чёрный", "свежемолотый чёрный перец", "перец"],
    allergenTags: []
  },
  sugar: {
    id: "sugar",
    nameRu: "сахар",
    aliasesRu: ["сахар", "ванильный сахар"],
    allergenTags: []
  },
  oats: {
    id: "oats",
    nameRu: "овсяные хлопья",
    aliasesRu: ["овсяные хлопья"],
    allergenTags: []
  },
  banana: {
    id: "banana",
    nameRu: "банан",
    aliasesRu: ["банан", "бананы"],
    allergenTags: []
  },
  tomato: {
    id: "tomato",
    nameRu: "помидор",
    aliasesRu: ["помидор", "помидоры", "помидоры черри"],
    allergenTags: []
  },
  onion: {
    id: "onion",
    nameRu: "лук",
    aliasesRu: ["лук", "лук репчатый"],
    allergenTags: []
  },
  garlic: {
    id: "garlic",
    nameRu: "чеснок",
    aliasesRu: ["чеснок"],
    allergenTags: []
  },
  carrot: {
    id: "carrot",
    nameRu: "морковь",
    aliasesRu: ["морковь"],
    allergenTags: []
  },
  bell_pepper: {
    id: "bell_pepper",
    nameRu: "болгарский перец",
    aliasesRu: ["болгарский перец"],
    allergenTags: []
  },
  herbs_generic: {
    id: "herbs_generic",
    nameRu: "зелень",
    aliasesRu: ["зелень", "свежая зелень", "зелень укропа", "петрушка", "кинза", "укроп"],
    allergenTags: []
  },
  walnuts: {
    id: "walnuts",
    nameRu: "грецкие орехи",
    aliasesRu: ["грецкие орехи", "грецкий орех"],
    allergenTags: [ALLERGEN_TAGS.NUTS]
  },
  honey: {
    id: "honey",
    nameRu: "мёд",
    aliasesRu: ["мёд", "натуральный мёд"],
    allergenTags: []
  }
};
