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

// NOTE:
// - Keep each recipe ingredient as a single product (avoid "salt and pepper" in one line).
// - Prefer canonical singular names in nameRu.
// - Map plural / word-order variants via aliasesRu.

export const INGREDIENTS_DICTIONARY = {
  // Eggs
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

  // Dairy
  milk: {
    id: "milk",
    nameRu: "молоко",
    aliasesRu: ["молоко"],
    allergenTags: [ALLERGEN_TAGS.MILK]
  },
  coconut_milk: {
    id: "coconut_milk",
    nameRu: "кокосовое молоко",
    aliasesRu: ["кокосовое молоко"],
    allergenTags: []
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
    aliasesRu: ["сыр", "сыр твёрдый", "сыр твердый", "сыр сливочный", "крем-сыр"],
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

  // Oils
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

  // Staples / seasonings
  water: {
    id: "water",
    nameRu: "вода",
    aliasesRu: ["вода"],
    allergenTags: []
  },
  ice: {
    id: "ice",
    nameRu: "лёд",
    aliasesRu: ["лёд", "лед"],
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
    aliasesRu: [
      "чёрный перец",
      "черный перец",
      "перец чёрный молотый",
      "перец черный молотый",
      "перец молотый чёрный",
      "перец молотый черный",
      "свежемолотый чёрный перец",
      "свежемолотый черный перец",
      "перец"
    ],
    allergenTags: []
  },
  sugar: {
    id: "sugar",
    nameRu: "сахар",
    aliasesRu: ["сахар", "ванильный сахар"],
    allergenTags: []
  },
  honey: {
    id: "honey",
    nameRu: "мёд",
    aliasesRu: ["мёд", "мед", "натуральный мёд", "натуральный мед"],
    allergenTags: []
  },
  cinnamon: {
    id: "cinnamon",
    nameRu: "корица",
    aliasesRu: ["корица"],
    allergenTags: []
  },
  curry_powder: {
    id: "curry_powder",
    nameRu: "карри",
    aliasesRu: ["карри"],
    allergenTags: []
  },
  curry_paste: {
    id: "curry_paste",
    nameRu: "паста карри",
    aliasesRu: ["паста карри"],
    allergenTags: []
  },
  turmeric: {
    id: "turmeric",
    nameRu: "куркума",
    aliasesRu: ["куркума"],
    allergenTags: []
  },
  coriander_spice: {
    id: "coriander_spice",
    nameRu: "кориандр",
    aliasesRu: ["кориандр"],
    allergenTags: []
  },
  chili_pepper: {
    id: "chili_pepper",
    nameRu: "перец чили",
    aliasesRu: ["перец чили", "чили"],
    allergenTags: []
  },
  bay_leaf: {
    id: "bay_leaf",
    nameRu: "лавровый лист",
    aliasesRu: ["лавровый лист"],
    allergenTags: []
  },
  balsamic_vinegar: {
    id: "balsamic_vinegar",
    nameRu: "бальзамический уксус",
    aliasesRu: ["бальзамический уксус"],
    allergenTags: [ALLERGEN_TAGS.SULFITES]
  },

  // Grains / bakery
  oats: {
    id: "oats",
    nameRu: "овсяные хлопья",
    aliasesRu: ["овсяные хлопья", "геркулес"],
    allergenTags: []
  },
  wheat_flour: {
    id: "wheat_flour",
    nameRu: "мука пшеничная",
    aliasesRu: ["мука пшеничная"],
    allergenTags: [ALLERGEN_TAGS.GLUTEN]
  },
  bread: {
    id: "bread",
    nameRu: "хлеб",
    aliasesRu: ["хлеб", "багет", "чиабатта"],
    allergenTags: [ALLERGEN_TAGS.GLUTEN]
  },
  spaghetti: {
    id: "spaghetti",
    nameRu: "спагетти",
    aliasesRu: ["спагетти"],
    allergenTags: [ALLERGEN_TAGS.GLUTEN]
  },
  pasta_generic: {
    id: "pasta_generic",
    nameRu: "паста",
    aliasesRu: ["паста", "макароны"],
    allergenTags: [ALLERGEN_TAGS.GLUTEN]
  },
  rice: {
    id: "rice",
    nameRu: "рис",
    aliasesRu: ["рис"],
    allergenTags: []
  },
  rice_basmati: {
    id: "rice_basmati",
    nameRu: "рис басмати",
    aliasesRu: ["рис басмати"],
    allergenTags: []
  },

  // Fruits
  banana: {
    id: "banana",
    nameRu: "банан",
    aliasesRu: ["банан", "бананы"],
    allergenTags: []
  },
  avocado: {
    id: "avocado",
    nameRu: "авокадо",
    aliasesRu: ["авокадо"],
    allergenTags: []
  },
  lemon: {
    id: "lemon",
    nameRu: "лимон",
    aliasesRu: ["лимон"],
    allergenTags: []
  },
  lime: {
    id: "lime",
    nameRu: "лайм",
    aliasesRu: ["лайм"],
    allergenTags: []
  },
  lemon_juice: {
    id: "lemon_juice",
    nameRu: "лимонный сок",
    aliasesRu: ["лимонный сок"],
    allergenTags: []
  },
  orange_juice: {
    id: "orange_juice",
    nameRu: "апельсиновый сок",
    aliasesRu: ["апельсиновый сок"],
    allergenTags: []
  },

  // Vegetables
  tomato: {
    id: "tomato",
    nameRu: "помидор",
    aliasesRu: ["помидор", "помидоры", "помидоры черри", "томатный сок"],
    allergenTags: []
  },
  tomato_paste: {
    id: "tomato_paste",
    nameRu: "томатная паста",
    aliasesRu: ["томатная паста"],
    allergenTags: []
  },
  onion: {
    id: "onion",
    nameRu: "лук",
    aliasesRu: ["лук", "лук репчатый", "зелёный лук", "зеленый лук"],
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
  zucchini: {
    id: "zucchini",
    nameRu: "кабачок",
    aliasesRu: ["кабачок", "цуккини"],
    allergenTags: []
  },
  eggplant: {
    id: "eggplant",
    nameRu: "баклажан",
    aliasesRu: ["баклажан"],
    allergenTags: []
  },
  broccoli: {
    id: "broccoli",
    nameRu: "брокколи",
    aliasesRu: ["брокколи"],
    allergenTags: []
  },
  spinach: {
    id: "spinach",
    nameRu: "шпинат",
    aliasesRu: ["шпинат"],
    allergenTags: []
  },

  // Herbs / greens
  herbs_generic: {
    id: "herbs_generic",
    nameRu: "зелень",
    aliasesRu: ["зелень", "свежая зелень", "зелень укропа", "петрушка", "кинза", "укроп", "микрозелень"],
    allergenTags: []
  },
  mint: {
    id: "mint",
    nameRu: "мята",
    aliasesRu: ["мята", "свежая мята"],
    allergenTags: []
  },

  // Protein / meat / fish / seafood
  chicken_breast: {
    id: "chicken_breast",
    nameRu: "куриная грудка",
    aliasesRu: ["куриная грудка", "филе куриной грудки", "куриное филе"],
    allergenTags: []
  },
  bacon: {
    id: "bacon",
    nameRu: "бекон",
    aliasesRu: ["бекон", "гуанчале"],
    allergenTags: []
  },
  ham: {
    id: "ham",
    nameRu: "ветчина",
    aliasesRu: ["ветчина"],
    allergenTags: []
  },
  fish_red_salted: {
    id: "fish_red_salted",
    nameRu: "красная рыба слабосолёная",
    aliasesRu: ["красная рыба слабосолёная", "красная рыба слабосоленая", "лосось", "форель"],
    allergenTags: [ALLERGEN_TAGS.FISH]
  },
  shrimp: {
    id: "shrimp",
    nameRu: "креветки",
    aliasesRu: ["креветки"],
    allergenTags: [ALLERGEN_TAGS.SHELLFISH]
  },

  // Legumes
  chickpeas_canned: {
    id: "chickpeas_canned",
    nameRu: "нут консервированный",
    aliasesRu: ["нут консервированный"],
    allergenTags: []
  },

  // Nuts / seeds
  walnuts: {
    id: "walnuts",
    nameRu: "грецкие орехи",
    aliasesRu: ["грецкие орехи", "грецкий орех"],
    allergenTags: [ALLERGEN_TAGS.NUTS]
  },
  sesame: {
    id: "sesame",
    nameRu: "кунжут",
    aliasesRu: ["кунжут", "семена кунжута"],
    allergenTags: [ALLERGEN_TAGS.SESAME]
  },

  // Other
  gelatin: {
    id: "gelatin",
    nameRu: "желатин",
    aliasesRu: ["желатин"],
    allergenTags: []
  },
  coconut_flakes: {
    id: "coconut_flakes",
    nameRu: "кокосовая стружка",
    aliasesRu: ["кокосовая стружка"],
    allergenTags: []
  },
  prunes: {
    id: "prunes",
    nameRu: "чернослив",
    aliasesRu: ["чернослив"],
    allergenTags: []
  },
  dates: {
    id: "dates",
    nameRu: "финики",
    aliasesRu: ["финик", "финики"],
    allergenTags: []
  }
};
