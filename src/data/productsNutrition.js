// База данных продуктов с пищевой ценностью на 100 грамм
// КБЖУ: Калории (ккал), Белки (г), Жиры (г), Углеводы (г)
// Все данные взяты из официальной таблицы калорийности продуктов

export const PRODUCTS_NUTRITION = {
  // ===== ХЛЕБОБУЛОЧНЫЕ ИЗДЕЛИЯ И МУКА =====
  "хлеб": { id: 101, calories: 248, protein: 7.5, fat: 1.9, carbs: 50.3 },
  "хлеб пшеничный из муки высшего сорта": { id: 102, calories: 248, protein: 7.5, fat: 1.9, carbs: 50.3 },
  "хлеб пшеничный из муки 1 сорта": { id: 103, calories: 226, protein: 7.6, fat: 0.9, carbs: 49.7 },
  "хлеб из ржано-пшеничной муки": { id: 104, calories: 215, protein: 6.8, fat: 1.2, carbs: 46.4 },
  "хлеб ржаной": { id: 105, calories: 214, protein: 4.7, fat: 0.7, carbs: 49.8 },
  "хлеб бородинский": { id: 106, calories: 208, protein: 6.9, fat: 1.3, carbs: 40.9 },
  "хлеб зерновой": { id: 107, calories: 228, protein: 8.6, fat: 1.4, carbs: 45.1 },
  "хлеб цельнозерновой из смеси злаков": { id: 108, calories: 265, protein: 13.3, fat: 4.2, carbs: 43.3 },
  "сдоба": { id: 109, calories: 360, protein: 7.7, fat: 9.5, carbs: 63.7 },
  "сухари из пшеничной муки": { id: 110, calories: 331, protein: 11.2, fat: 1.4, carbs: 72.4 },
  "мука пшеничная": { id: 111, calories: 312, protein: 11.5, fat: 2.2, carbs: 61.5 },
  "мука пшеничная обойная": { id: 112, calories: 312, protein: 11.5, fat: 2.2, carbs: 61.5 },
  "мука пшеничная в/с": { id: 113, calories: 334, protein: 10.3, fat: 1.1, carbs: 70.6 },
  "мука пшеничная 1 сорта": { id: 114, calories: 330, protein: 10.6, fat: 1.3, carbs: 69.0 },
  "мука пшеничная 2 сорта": { id: 115, calories: 322, protein: 11.6, fat: 1.8, carbs: 64.8 },
  "мука пшеничная из твердых сортов в/с": { id: 116, calories: 334, protein: 10.8, fat: 1.3, carbs: 69.9 },
  "мука ржаная сеяная": { id: 117, calories: 305, protein: 6.9, fat: 1.4, carbs: 66.3 },
  "мука ржаная обдирная": { id: 118, calories: 298, protein: 8.9, fat: 1.7, carbs: 61.8 },
  "мука ржаная обойная": { id: 119, calories: 294, protein: 10.7, fat: 1.9, carbs: 58.5 },

  // ===== МАКАРОННЫЕ ИЗДЕЛИЯ =====
  "паста": { id: 201, calories: 337, protein: 10.4, fat: 1.1, carbs: 69.7 },
  "спагетти": { id: 202, calories: 337, protein: 10.4, fat: 1.1, carbs: 69.7 },
  "макаронные изделия в/с": { id: 203, calories: 337, protein: 10.4, fat: 1.1, carbs: 69.7 },
  "макаронные изделия в/с вареные": { id: 204, calories: 112, protein: 3.5, fat: 0.4, carbs: 23.2 },
  "макаронные изделия из муки твердых сортов в/с": { id: 205, calories: 338, protein: 11.0, fat: 1.3, carbs: 70.5 },
  "макаронные изделия из муки твердых сортов в/с вареные": { id: 206, calories: 98, protein: 3.6, fat: 0.4, carbs: 20.0 },

  // ===== КРУПЫ =====
  "овсяные хлопья": { id: 301, calories: 352, protein: 12.3, fat: 6.2, carbs: 61.8 },
  "крупа овсяная": { id: 302, calories: 342, protein: 12.3, fat: 6.1, carbs: 59.5 },
  "каша из овсяных хлопьев на воде": { id: 303, calories: 88, protein: 3.0, fat: 1.7, carbs: 15.0 },
  "каша из овсяных хлопьев на молоке": { id: 304, calories: 102, protein: 3.2, fat: 4.1, carbs: 14.2 },
  "толокно овсяное": { id: 305, calories: 363, protein: 12.5, fat: 6.0, carbs: 64.9 },
  "рис": { id: 306, calories: 333, protein: 7.0, fat: 1.0, carbs: 74.0 },
  "рис басмати": { id: 307, calories: 347, protein: 7.5, fat: 0.6, carbs: 77.2 },
  "рис белый шлифованный": { id: 308, calories: 333, protein: 7.0, fat: 1.0, carbs: 74.0 },
  "рис белый шлифованный вареный": { id: 309, calories: 130, protein: 2.3, fat: 0.2, carbs: 28.7 },
  "рис длиннозерный нешлифованный": { id: 310, calories: 340, protein: 7.5, fat: 2.0, carbs: 73.0 },
  "рис нешлифованный вареный": { id: 311, calories: 112, protein: 2.5, fat: 0.9, carbs: 23.0 },
  "рис красный нешлифованный": { id: 312, calories: 330, protein: 7.5, fat: 3.0, carbs: 68.0 },
  "рис дикий черный": { id: 313, calories: 357, protein: 14.7, fat: 1.1, carbs: 68.7 },
  "рис дикий черный вареный": { id: 314, calories: 101, protein: 4.0, fat: 0.3, carbs: 19.5 },
  "крупа гречневая ядрица": { id: 315, calories: 308, protein: 12.6, fat: 3.3, carbs: 57.1 },
  "гречка вареная": { id: 316, calories: 100, protein: 4.1, fat: 1.0, carbs: 18.5 },
  "гречневый продел": { id: 317, calories: 300, protein: 9.5, fat: 2.3, carbs: 60.4 },
  "гречка зеленая мистраль": { id: 318, calories: 328, protein: 13.4, fat: 3.0, carbs: 68.0 },
  "пшено": { id: 319, calories: 342, protein: 11.5, fat: 3.3, carbs: 66.5 },
  "пшено вареное": { id: 320, calories: 119, protein: 3.5, fat: 1.1, carbs: 23.6 },
  "перловая крупа": { id: 321, calories: 315, protein: 9.3, fat: 1.1, carbs: 66.9 },
  "перловая крупа вареная": { id: 322, calories: 109, protein: 3.1, fat: 0.4, carbs: 22.2 },
  "ячневая крупа": { id: 323, calories: 313, protein: 10.0, fat: 1.3, carbs: 65.4 },
  "ячневая крупа вареная": { id: 324, calories: 76, protein: 2.3, fat: 0.3, carbs: 15.7 },
  "крупа пшеничная полтавская": { id: 325, calories: 329, protein: 11.5, fat: 1.3, carbs: 67.9 },
  "крупа пшеничная полтавская вареная": { id: 326, calories: 75, protein: 2.7, fat: 0.3, carbs: 15.0 },
  "кукуруза зерно продовольственное": { id: 327, calories: 325, protein: 10.3, fat: 4.9, carbs: 60.0 },
  "кукурузная крупа": { id: 328, calories: 328, protein: 8.3, fat: 1.2, carbs: 71.0 },
  "манная крупа": { id: 329, calories: 333, protein: 10.3, fat: 1.0, carbs: 70.6 },
  "манная каша на воде": { id: 330, calories: 80, protein: 2.5, fat: 0.2, carbs: 16.8 },
  "манная каша на молоке": { id: 331, calories: 98, protein: 3.0, fat: 3.2, carbs: 15.3 },
  "амарант крупа": { id: 332, calories: 371, protein: 13.6, fat: 7.0, carbs: 58.6 },
  "амарант вареный": { id: 333, calories: 102, protein: 3.8, fat: 1.6, carbs: 16.6 },
  "киноа крупа": { id: 334, calories: 368, protein: 14.1, fat: 6.1, carbs: 57.2 },
  "киноа вареная": { id: 335, calories: 120, protein: 4.4, fat: 1.9, carbs: 18.5 },

  // ===== БОБОВЫЕ =====
  "горох": { id: 401, calories: 298, protein: 20.5, fat: 2.0, carbs: 49.5 },
  "горох зерно": { id: 402, calories: 298, protein: 20.5, fat: 2.0, carbs: 49.5 },
  "горох целый шлифованный": { id: 403, calories: 330, protein: 22.0, fat: 2.0, carbs: 57.0 },
  "горох колотый": { id: 404, calories: 299, protein: 23.0, fat: 1.6, carbs: 48.1 },
  "горох вареный": { id: 405, calories: 118, protein: 8.3, fat: 0.4, carbs: 21.0 },
  "горошек зеленый свежий": { id: 406, calories: 55, protein: 5.0, fat: 0.2, carbs: 8.3 },
  "маш": { id: 407, calories: 347, protein: 23.9, fat: 1.2, carbs: 62.6 },
  "маш вареный": { id: 408, calories: 105, protein: 7.0, fat: 0.4, carbs: 19.2 },
  "нут": { id: 409, calories: 360, protein: 20.5, fat: 4.3, carbs: 63.0 },
  "нут вареный": { id: 410, calories: 164, protein: 8.9, fat: 2.6, carbs: 27.4 },
  "нут консервированный": { id: 411, calories: 127, protein: 7.2, fat: 2.6, carbs: 17.7 },
  "соя зерно": { id: 412, calories: 364, protein: 36.7, fat: 17.8, carbs: 17.3 },
  "соевые бобы": { id: 413, calories: 446, protein: 36.4, fat: 19.9, carbs: 30.1 },
  "соевые бобы вареные": { id: 414, calories: 173, protein: 16.6, fat: 8.9, carbs: 9.9 },
  "фасоль": { id: 415, calories: 333, protein: 23.5, fat: 0.8, carbs: 60.0 },
  "фасоль обыкновенная красная": { id: 416, calories: 333, protein: 23.5, fat: 0.8, carbs: 60.0 },
  "фасоль красная вареная": { id: 417, calories: 127, protein: 8.7, fat: 0.5, carbs: 22.8 },
  "фасоль стручковая": { id: 418, calories: 23, protein: 2.5, fat: 0.3, carbs: 3.0 },
  "чечевица": { id: 419, calories: 352, protein: 24.6, fat: 1.1, carbs: 63.4 },
  "чечевица вареная": { id: 420, calories: 116, protein: 9.0, fat: 0.4, carbs: 20.1 },
  "чечевица красная": { id: 421, calories: 314, protein: 21.6, fat: 1.1, carbs: 48.0 },
  "чечевица красная колотая персидская": { id: 422, calories: 328, protein: 24.7, fat: 1.2, carbs: 62.5 },

  // ===== МОЛОЧНЫЕ ПРОДУКТЫ =====
  "молоко": { id: 501, calories: 60, protein: 2.9, fat: 3.2, carbs: 4.7 },
  "молоко коровье нежирное": { id: 502, calories: 32, protein: 3.0, fat: 0.05, carbs: 4.9 },
  "молоко 1,5% жирности": { id: 503, calories: 45, protein: 3.0, fat: 1.5, carbs: 4.8 },
  "молоко 1.5%": { id: 504, calories: 45, protein: 3.0, fat: 1.5, carbs: 4.8 },
  "молоко 2,5%": { id: 505, calories: 54, protein: 2.9, fat: 2.5, carbs: 4.8 },
  "молоко 2.5%": { id: 506, calories: 54, protein: 2.9, fat: 2.5, carbs: 4.8 },
  "молоко 3,2%": { id: 507, calories: 60, protein: 2.9, fat: 3.2, carbs: 4.7 },
  "молоко 3.2%": { id: 508, calories: 60, protein: 2.9, fat: 3.2, carbs: 4.7 },
  "сливки": { id: 509, calories: 119, protein: 2.7, fat: 10.0, carbs: 4.4 },
  "сливки 10%": { id: 510, calories: 119, protein: 2.7, fat: 10.0, carbs: 4.4 },
  "сливки 20%": { id: 511, calories: 205, protein: 2.5, fat: 20.0, carbs: 4.0 },
  "творог": { id: 512, calories: 169, protein: 18.0, fat: 9.0, carbs: 3.0 },
  "творог нежирный": { id: 513, calories: 110, protein: 22.0, fat: 0.6, carbs: 3.3 },
  "творог 5%": { id: 514, calories: 145, protein: 21.0, fat: 5.0, carbs: 3.0 },
  "творог 9%": { id: 515, calories: 169, protein: 18.0, fat: 9.0, carbs: 3.0 },
  "творог 18%": { id: 516, calories: 236, protein: 15.0, fat: 18.0, carbs: 2.8 },
  "сметана": { id: 517, calories: 206, protein: 2.5, fat: 20.0, carbs: 3.4 },
  "сметана 10%": { id: 518, calories: 119, protein: 2.7, fat: 10.0, carbs: 3.9 },
  "сметана 20%": { id: 519, calories: 206, protein: 2.5, fat: 20.0, carbs: 3.4 },
  "сметана 30%": { id: 520, calories: 293, protein: 2.3, fat: 30.0, carbs: 3.1 },
  "кефир": { id: 521, calories: 59, protein: 2.9, fat: 3.2, carbs: 4.0 },
  "кефир нежирный": { id: 522, calories: 31, protein: 3.0, fat: 0.05, carbs: 4.0 },
  "кефир 1%": { id: 523, calories: 40, protein: 3.0, fat: 1.0, carbs: 4.0 },
  "кефир 2,5%": { id: 524, calories: 53, protein: 2.9, fat: 2.5, carbs: 4.0 },
  "кефир 2.5%": { id: 525, calories: 53, protein: 2.9, fat: 2.5, carbs: 4.0 },
  "кефир 3,2%": { id: 526, calories: 59, protein: 2.9, fat: 3.2, carbs: 4.0 },
  "кефир 3.2%": { id: 527, calories: 59, protein: 2.9, fat: 3.2, carbs: 4.0 },
  "греческий йогурт": { id: 528, calories: 83, protein: 6.0, fat: 4.6, carbs: 3.9 },
  "йогурт греческий": { id: 529, calories: 83, protein: 6.0, fat: 4.6, carbs: 3.9 },
  "натуральный йогурт": { id: 530, calories: 66, protein: 5.0, fat: 3.2, carbs: 3.5 },
  "йогурт активиа": { id: 531, calories: 102, protein: 4.2, fat: 3.2, carbs: 14.9 },
  "активиа": { id: 532, calories: 102, protein: 4.2, fat: 3.2, carbs: 14.9 },
  "актимель": { id: 533, calories: 73, protein: 2.8, fat: 8.3, carbs: 11.3 },
  "сыр": { id: 534, calories: 356, protein: 25.0, fat: 27.0, carbs: 2.0 },
  "брынза": { id: 535, calories: 262, protein: 22.1, fat: 19.2, carbs: 0.4 },
  "брынза из коровьего молока": { id: 536, calories: 262, protein: 22.1, fat: 19.2, carbs: 0.4 },
  "сыр адыгейский": { id: 537, calories: 264, protein: 19.8, fat: 19.8, carbs: 1.5 },
  "сыр гауда": { id: 538, calories: 356, protein: 25.0, fat: 27.0, carbs: 2.0 },
  "сыр голландский брусковый": { id: 539, calories: 352, protein: 26.0, fat: 26.8, carbs: 0.0 },
  "сыр голландский круглый": { id: 540, calories: 375, protein: 23.7, fat: 30.4, carbs: 0.0 },
  "сыр ламбер": { id: 541, calories: 377, protein: 23.7, fat: 30.5, carbs: 0.0 },
  "сыр ламбер сливочный": { id: 542, calories: 395, protein: 23.7, fat: 32.5, carbs: 0.0 },
  "сыр маасдам": { id: 543, calories: 350, protein: 23.5, fat: 26.0, carbs: 0.0 },
  "моцарелла": { id: 544, calories: 300, protein: 22.2, fat: 22.3, carbs: 2.2 },
  "сыр моцарелла из цельного молока": { id: 545, calories: 300, protein: 22.2, fat: 22.3, carbs: 2.2 },
  "пармезан": { id: 546, calories: 415, protein: 37.8, fat: 27.3, carbs: 3.4 },
  "сыр пармезан": { id: 547, calories: 415, protein: 37.8, fat: 27.3, carbs: 3.4 },
  "сыр российский": { id: 548, calories: 364, protein: 23.2, fat: 29.5, carbs: 0.0 },
  "рикотта": { id: 549, calories: 174, protein: 11.3, fat: 13.0, carbs: 3.0 },
  "сыр рикотта из цельного молока": { id: 550, calories: 174, protein: 11.3, fat: 13.0, carbs: 3.0 },
  "сулугуни": { id: 551, calories: 286, protein: 20.5, fat: 22.0, carbs: 0.4 },
  "сыр тильзитер": { id: 552, calories: 340, protein: 24.4, fat: 26.0, carbs: 1.9 },
  "сыр фета": { id: 553, calories: 264, protein: 14.2, fat: 21.3, carbs: 4.0 },
  "фета": { id: 554, calories: 264, protein: 14.2, fat: 21.3, carbs: 4.0 },
  "сыр эдам": { id: 555, calories: 357, protein: 25.0, fat: 27.8, carbs: 1.4 },
  "эдам": { id: 556, calories: 357, protein: 25.0, fat: 27.8, carbs: 1.4 },
  "сыр плавленый": { id: 557, calories: 257, protein: 16.8, fat: 11.2, carbs: 23.8 },
  "сыр viola": { id: 558, calories: 305, protein: 11.0, fat: 28.0, carbs: 2.0 },
  "виола": { id: 559, calories: 305, protein: 11.0, fat: 28.0, carbs: 2.0 },
  "сыр твёрдый": { id: 560, calories: 356, protein: 26.0, fat: 27.0, carbs: 0.0 },
  "сыр сливочный": { id: 561, calories: 342, protein: 5.9, fat: 34.2, carbs: 4.1 },
  "кокосовое молоко": { id: 562, calories: 230, protein: 2.3, fat: 24.0, carbs: 6.0 },
  "растительное молоко": { id: 563, calories: 40, protein: 1.0, fat: 1.5, carbs: 6.0 },

  // ===== ЯЙЦА =====
  "яйцо": { id: 601, calories: 157, protein: 12.7, fat: 11.5, carbs: 0.7 },
  "яйца": { id: 602, calories: 157, protein: 12.7, fat: 11.5, carbs: 0.7 },
  "яйца куриные": { id: 603, calories: 157, protein: 12.7, fat: 11.5, carbs: 0.7 },
  "яичный желток": { id: 604, calories: 352, protein: 16.2, fat: 31.2, carbs: 1.0 },
  "яичные желтки": { id: 605, calories: 352, protein: 16.2, fat: 31.2, carbs: 1.0 },

  // ===== МЯСО, ПТИЦА, КОЛБАСЫ =====
  "говядина": { id: 701, calories: 168, protein: 20.0, fat: 9.8, carbs: 0.0 },
  "говядина 1 категории": { id: 702, calories: 218, protein: 18.6, fat: 16.0, carbs: 0.0 },
  "говядина 2 категории": { id: 703, calories: 168, protein: 20.0, fat: 9.8, carbs: 0.0 },
  "говядина вырезка": { id: 704, calories: 158, protein: 22.2, fat: 7.1, carbs: 0.0 },
  "телятина": { id: 705, calories: 97, protein: 19.7, fat: 2.0, carbs: 0.0 },
  "телятина 1 категории": { id: 706, calories: 97, protein: 19.7, fat: 2.0, carbs: 0.0 },
  "свинина": { id: 707, calories: 357, protein: 14.3, fat: 33.3, carbs: 0.0 },
  "свинина жирная": { id: 708, calories: 491, protein: 11.7, fat: 49.3, carbs: 0.0 },
  "свинина мясная": { id: 709, calories: 357, protein: 14.3, fat: 33.3, carbs: 0.0 },
  "свинина вырезка": { id: 710, calories: 142, protein: 19.4, fat: 7.1, carbs: 0.0 },
  "баранина": { id: 711, calories: 166, protein: 19.8, fat: 9.6, carbs: 0.0 },
  "баранина 1 категории": { id: 712, calories: 209, protein: 15.6, fat: 16.3, carbs: 0.0 },
  "баранина 2 категории": { id: 713, calories: 166, protein: 19.8, fat: 9.6, carbs: 0.0 },
  "конина": { id: 714, calories: 187, protein: 20.2, fat: 7.0, carbs: 0.0 },
  "язык говяжий": { id: 715, calories: 173, protein: 16.0, fat: 12.1, carbs: 2.2 },
  "язык свиной": { id: 716, calories: 208, protein: 15.9, fat: 16.0, carbs: 2.1 },
  "печень говяжья": { id: 717, calories: 127, protein: 17.9, fat: 3.7, carbs: 5.3 },
  "печень свиная": { id: 718, calories: 109, protein: 18.8, fat: 3.8, carbs: 4.7 },
  "сердце говяжье": { id: 719, calories: 96, protein: 16.0, fat: 3.5, carbs: 2.0 },
  "почки говяжьи": { id: 720, calories: 86, protein: 15.2, fat: 2.8, carbs: 1.9 },
  "вымя": { id: 721, calories: 173, protein: 12.3, fat: 13.7, carbs: 0.0 },
  "курица": { id: 722, calories: 159, protein: 21.2, fat: 8.2, carbs: 0.0 },
  "курица 1 кат.": { id: 723, calories: 238, protein: 18.2, fat: 18.4, carbs: 0.0 },
  "курица 2 кат.": { id: 724, calories: 159, protein: 21.2, fat: 8.2, carbs: 0.0 },
  "цыпленок": { id: 725, calories: 180, protein: 19.7, fat: 11.2, carbs: 0.0 },
  "бройлеры 1 кат.": { id: 726, calories: 220, protein: 18.7, fat: 16.1, carbs: 0.0 },
  "бройлеры 2 кат.": { id: 727, calories: 180, protein: 19.7, fat: 11.2, carbs: 0.0 },
  "куриная грудка": { id: 728, calories: 113, protein: 23.6, fat: 1.9, carbs: 0.0 },
  "куриное филе": { id: 729, calories: 113, protein: 23.6, fat: 1.9, carbs: 0.0 },
  "филе куриной грудки": { id: 730, calories: 113, protein: 23.6, fat: 1.9, carbs: 0.0 },
  "куриные окорочка": { id: 731, calories: 158, protein: 16.8, fat: 10.2, carbs: 0.0 },
  "окорочка": { id: 732, calories: 158, protein: 16.8, fat: 10.2, carbs: 0.0 },
  "куриная печень": { id: 733, calories: 136, protein: 19.1, fat: 6.3, carbs: 0.6 },
  "куриное сердце": { id: 734, calories: 159, protein: 15.8, fat: 10.3, carbs: 0.8 },
  "индейка": { id: 735, calories: 276, protein: 19.5, fat: 22.0, carbs: 0.0 },
  "индейка грудка": { id: 736, calories: 114, protein: 23.6, fat: 1.5, carbs: 0.0 },
  "грудка индейки": { id: 737, calories: 114, protein: 23.6, fat: 1.5, carbs: 0.0 },
  "индейка фарш": { id: 738, calories: 161, protein: 20.0, fat: 8.0, carbs: 0.5 },
  "фарш индейки": { id: 739, calories: 161, protein: 20.0, fat: 8.0, carbs: 0.5 },
  "гусь": { id: 740, calories: 392, protein: 15.5, fat: 36.3, carbs: 0.0 },
  "гусь домашний мясо и кожа": { id: 741, calories: 392, protein: 15.5, fat: 36.3, carbs: 0.0 },
  "гусь домашний мясо": { id: 742, calories: 161, protein: 22.7, fat: 7.1, carbs: 0.0 },
  "перепел": { id: 743, calories: 192, protein: 19.6, fat: 12.0, carbs: 0.0 },
  "перепел мясо и кожа": { id: 744, calories: 192, protein: 19.6, fat: 12.0, carbs: 0.0 },
  "утка": { id: 745, calories: 405, protein: 15.8, fat: 38.0, carbs: 0.0 },
  "утка домашняя мясо и кожа": { id: 746, calories: 405, protein: 15.8, fat: 38.0, carbs: 0.0 },
  "утка дикая мясо и кожа": { id: 747, calories: 211, protein: 17.4, fat: 15.2, carbs: 0.0 },
  "утка дикая мясо": { id: 748, calories: 123, protein: 19.8, fat: 4.3, carbs: 0.0 },
  "фазан": { id: 749, calories: 181, protein: 22.7, fat: 9.3, carbs: 0.0 },
  "фазан мясо и кожа": { id: 750, calories: 181, protein: 22.7, fat: 9.3, carbs: 0.0 },
  "фазан грудка": { id: 751, calories: 133, protein: 24.3, fat: 3.2, carbs: 0.0 },
  "страус": { id: 752, calories: 114, protein: 21.8, fat: 2.3, carbs: 0.0 },
  "страусиное мясо": { id: 753, calories: 114, protein: 21.8, fat: 2.3, carbs: 0.0 },
  "кролик": { id: 754, calories: 183, protein: 21.2, fat: 11.0, carbs: 0.0 },
  "кабан": { id: 755, calories: 122, protein: 21.5, fat: 3.3, carbs: 0.0 },
  "лось": { id: 756, calories: 111, protein: 23.0, fat: 1.5, carbs: 0.0 },
  "оленина": { id: 757, calories: 155, protein: 19.5, fat: 8.5, carbs: 0.0 },
  "бекон": { id: 758, calories: 541, protein: 23.0, fat: 45.0, carbs: 0.0 },
  "гуанчале": { id: 759, calories: 655, protein: 9.4, fat: 69.0, carbs: 0.0 },
  "ветчина": { id: 760, calories: 145, protein: 22.6, fat: 6.2, carbs: 0.0 },
  "ветчина рубленая": { id: 761, calories: 263, protein: 16.3, fat: 20.7, carbs: 1.8 },
  "колбаса вареная диетическая": { id: 762, calories: 170, protein: 12.1, fat: 13.5, carbs: 0.0 },
  "колбаса вареная докторская": { id: 763, calories: 257, protein: 12.8, fat: 22.2, carbs: 1.5 },
  "докторская": { id: 764, calories: 257, protein: 12.8, fat: 22.2, carbs: 1.5 },
  "колбаса вареная любительская": { id: 765, calories: 301, protein: 12.2, fat: 28.0, carbs: 0.1 },
  "любительская": { id: 766, calories: 301, protein: 12.2, fat: 28.0, carbs: 0.1 },
  "колбаса вареная молочная": { id: 767, calories: 252, protein: 11.7, fat: 22.8, carbs: 0.2 },
  "молочная": { id: 768, calories: 252, protein: 11.7, fat: 22.8, carbs: 0.2 },
  "колбаса вареная московская": { id: 769, calories: 250, protein: 11.5, fat: 21.8, carbs: 2.0 },
  "колбаса вареная русская": { id: 770, calories: 302, protein: 11.5, fat: 27.9, carbs: 1.7 },
  "колбаса варено-копченая московская": { id: 771, calories: 406, protein: 19.1, fat: 36.6, carbs: 0.2 },
  "колбаса варено-копченая сервелат": { id: 772, calories: 425, protein: 16.1, fat: 40.1, carbs: 0.0 },
  "сервелат": { id: 773, calories: 425, protein: 16.1, fat: 40.1, carbs: 0.0 },
  "колбаса полукопченая краковская": { id: 774, calories: 466, protein: 16.2, fat: 44.6, carbs: 0.0 },
  "краковская": { id: 775, calories: 466, protein: 16.2, fat: 44.6, carbs: 0.0 },
  "колбаса полукопченая одесская": { id: 776, calories: 402, protein: 14.8, fat: 38.1, carbs: 0.3 },
  "колбаса сырокопченая брауншвейгская": { id: 777, calories: 491, protein: 27.7, fat: 42.2, carbs: 0.2 },
  "колбаса сырокопченая московская": { id: 778, calories: 473, protein: 24.8, fat: 41.5, carbs: 0.0 },
  "колбаса сырокопченая свиная": { id: 779, calories: 566, protein: 13.0, fat: 57.0, carbs: 0.2 },
  "колбаса сырокопченая зернистая": { id: 780, calories: 606, protein: 9.9, fat: 62.8, carbs: 0.3 },
  "колбаса ливерная": { id: 781, calories: 326, protein: 14.4, fat: 28.5, carbs: 2.2 },
  "грудинка сырокопченая": { id: 782, calories: 605, protein: 8.9, fat: 63.3, carbs: 0.0 },
  "корейка сырокопченая": { id: 783, calories: 469, protein: 10.5, fat: 47.4, carbs: 0.0 },
  "сосиски": { id: 784, calories: 261, protein: 11.0, fat: 23.9, carbs: 0.4 },
  "сосиски молочные": { id: 785, calories: 261, protein: 11.0, fat: 23.9, carbs: 0.4 },
  "сосиски говяжьи": { id: 786, calories: 226, protein: 10.4, fat: 20.1, carbs: 0.8 },
  "сосиски свиные": { id: 787, calories: 342, protein: 9.5, fat: 34.3, carbs: 0.0 },
  "сосиски куриные": { id: 788, calories: 259, protein: 10.8, fat: 22.4, carbs: 4.2 },
  "сардельки": { id: 789, calories: 215, protein: 11.4, fat: 18.2, carbs: 1.3 },
  "сардельки говяжьи": { id: 790, calories: 215, protein: 11.4, fat: 18.2, carbs: 1.3 },
  "сардельки свиные": { id: 791, calories: 322, protein: 10.1, fat: 31.6, carbs: 1.8 },
  "шпикачки": { id: 792, calories: 337, protein: 10.0, fat: 33.0, carbs: 0.0 },
  "говядина тушеная": { id: 793, calories: 220, protein: 16.8, fat: 17.0, carbs: 0.2 },
  "говядина тушеная консервированная": { id: 794, calories: 220, protein: 16.8, fat: 17.0, carbs: 0.2 },
  "свинина тушеная": { id: 795, calories: 349, protein: 14.9, fat: 32.2, carbs: 0.2 },
  "свинина тушеная консервированная": { id: 796, calories: 349, protein: 14.9, fat: 32.2, carbs: 0.2 },

  // ===== РЫБА И МОРЕПРОДУКТЫ =====
  "аргентина": { id: 801, calories: 88, protein: 17.6, fat: 2.0, carbs: 0.0 },
  "амур белый": { id: 802, calories: 134, protein: 18.6, fat: 5.3, carbs: 0.0 },
  "бычок": { id: 803, calories: 88, protein: 17.5, fat: 2.0, carbs: 0.0 },
  "вобла": { id: 804, calories: 95, protein: 18.0, fat: 2.8, carbs: 0.0 },
  "горбуша": { id: 805, calories: 140, protein: 20.5, fat: 6.5, carbs: 0.0 },
  "дорадо": { id: 806, calories: 96, protein: 18.0, fat: 3.0, carbs: 0.0 },
  "зубатка пестрая": { id: 807, calories: 126, protein: 19.6, fat: 5.3, carbs: 0.0 },
  "кальмар": { id: 808, calories: 100, protein: 18.0, fat: 2.2, carbs: 2.0 },
  "камбала дальневосточная": { id: 809, calories: 90, protein: 15.7, fat: 3.0, carbs: 0.0 },
  "карась": { id: 810, calories: 87, protein: 17.7, fat: 1.8, carbs: 0.0 },
  "карп": { id: 811, calories: 112, protein: 16.0, fat: 5.3, carbs: 0.0 },
  "кета": { id: 812, calories: 127, protein: 19.0, fat: 5.6, carbs: 0.0 },
  "кефаль": { id: 813, calories: 124, protein: 21.0, fat: 0.4, carbs: 0.0 },
  "кижуч": { id: 814, calories: 146, protein: 21.6, fat: 5.9, carbs: 0.0 },
  "килька балтийская": { id: 815, calories: 137, protein: 14.1, fat: 9.0, carbs: 0.0 },
  "килька каспийская": { id: 816, calories: 192, protein: 18.5, fat: 13.1, carbs: 0.0 },
  "китовое мясо": { id: 817, calories: 119, protein: 22.5, fat: 3.2, carbs: 0.0 },
  "краб камчатский": { id: 818, calories: 82, protein: 18.2, fat: 1.0, carbs: 0.0 },
  "краб камчатский мясо": { id: 819, calories: 82, protein: 18.2, fat: 1.0, carbs: 0.0 },
  "креветки": { id: 820, calories: 88, protein: 19.5, fat: 1.1, carbs: 0.0 },
  "креветка": { id: 821, calories: 88, protein: 19.5, fat: 1.1, carbs: 0.0 },
  "лангуст": { id: 822, calories: 89, protein: 18.8, fat: 1.3, carbs: 0.5 },
  "лангуст вареный": { id: 823, calories: 90, protein: 20.5, fat: 0.7, carbs: 0.3 },
  "ледяная рыба": { id: 824, calories: 75, protein: 15.5, fat: 1.4, carbs: 0.0 },
  "лемонема": { id: 825, calories: 67, protein: 15.9, fat: 0.4, carbs: 0.0 },
  "лещ": { id: 826, calories: 105, protein: 17.1, fat: 4.1, carbs: 0.0 },
  "лобстер": { id: 827, calories: 90, protein: 18.8, fat: 0.9, carbs: 0.5 },
  "лосось": { id: 828, calories: 142, protein: 19.8, fat: 6.3, carbs: 0.0 },
  "лосось атлантический": { id: 829, calories: 153, protein: 20.0, fat: 8.1, carbs: 0.0 },
  "семга": { id: 830, calories: 153, protein: 20.0, fat: 8.1, carbs: 0.0 },
  "макрурус": { id: 831, calories: 60, protein: 13.2, fat: 0.8, carbs: 0.0 },
  "мидии": { id: 832, calories: 77, protein: 11.5, fat: 2.0, carbs: 3.3 },
  "минтай": { id: 833, calories: 72, protein: 15.9, fat: 0.9, carbs: 0.0 },
  "мойва весенняя": { id: 834, calories: 116, protein: 13.1, fat: 7.1, carbs: 0.0 },
  "мойва осенняя": { id: 835, calories: 217, protein: 13.6, fat: 18.1, carbs: 0.0 },
  "молоки рыб": { id: 836, calories: 90, protein: 16.0, fat: 2.9, carbs: 0.0 },
  "морской гребешок": { id: 837, calories: 92, protein: 17.0, fat: 2.0, carbs: 3.0 },
  "навага": { id: 838, calories: 91, protein: 19.2, fat: 1.6, carbs: 0.0 },
  "налим": { id: 839, calories: 81, protein: 18.8, fat: 0.6, carbs: 0.0 },
  "нерка красная": { id: 840, calories: 157, protein: 20.3, fat: 8.4, carbs: 0.0 },
  "окунь морской": { id: 841, calories: 103, protein: 18.2, fat: 3.3, carbs: 0.0 },
  "окунь речной": { id: 842, calories: 82, protein: 18.5, fat: 0.9, carbs: 0.0 },
  "омар": { id: 843, calories: 89, protein: 18.8, fat: 1.3, carbs: 0.5 },
  "омар вареный": { id: 844, calories: 90, protein: 20.5, fat: 0.7, carbs: 0.3 },
  "осетр каспийский": { id: 845, calories: 164, protein: 16.4, fat: 10.9, carbs: 0.0 },
  "осетр": { id: 846, calories: 202, protein: 15.8, fat: 15.4, carbs: 0.0 },
  "палтус белокорый": { id: 847, calories: 103, protein: 18.9, fat: 3.0, carbs: 0.0 },
  "пангасиус": { id: 848, calories: 89, protein: 15.3, fat: 3.0, carbs: 0.0 },
  "пикша": { id: 849, calories: 73, protein: 17.2, fat: 0.5, carbs: 0.0 },
  "плотва": { id: 850, calories: 88, protein: 17.5, fat: 2.0, carbs: 0.0 },
  "путассу": { id: 851, calories: 82, protein: 18.5, fat: 0.9, carbs: 0.0 },
  "рак речной": { id: 852, calories: 76, protein: 15.5, fat: 1.0, carbs: 1.2 },
  "рак речной вареный": { id: 853, calories: 97, protein: 20.3, fat: 1.3, carbs: 1.0 },
  "рапана": { id: 854, calories: 77, protein: 16.7, fat: 1.1, carbs: 0.0 },
  "сазан": { id: 855, calories: 97, protein: 18.2, fat: 2.7, carbs: 0.0 },
  "селедь атлантическая нежирная": { id: 856, calories: 135, protein: 19.1, fat: 6.5, carbs: 0.0 },
  "селедь атлантическая жирная": { id: 857, calories: 248, protein: 17.7, fat: 19.5, carbs: 0.0 },
  "селедь тихоокеанская нежирная": { id: 858, calories: 135, protein: 18.0, fat: 7.0, carbs: 0.0 },
  "селедь тихоокеанская жирная": { id: 859, calories: 191, protein: 14.0, fat: 15.0, carbs: 0.0 },
  "семга брюшки": { id: 860, calories: 310, protein: 25.0, fat: 24.0, carbs: 0.0 },
  "скумбрия атлантическая": { id: 861, calories: 191, protein: 18.0, fat: 13.2, carbs: 0.0 },
  "скумбрия": { id: 862, calories: 181, protein: 18.7, fat: 11.9, carbs: 0.0 },
  "сом": { id: 863, calories: 115, protein: 17.2, fat: 5.1, carbs: 0.0 },
  "ставрида океаническая": { id: 864, calories: 114, protein: 18.5, fat: 4.5, carbs: 0.0 },
  "стерлядь": { id: 865, calories: 122, protein: 17.0, fat: 6.1, carbs: 0.0 },
  "судак": { id: 866, calories: 84, protein: 18.4, fat: 1.1, carbs: 0.0 },
  "терпуг": { id: 867, calories: 102, protein: 17.8, fat: 3.4, carbs: 0.0 },
  "тилапия": { id: 868, calories: 96, protein: 20.1, fat: 1.7, carbs: 0.0 },
  "треска атлантическая": { id: 869, calories: 82, protein: 17.8, fat: 0.7, carbs: 0.0 },
  "треска тихоокеанская": { id: 870, calories: 69, protein: 15.3, fat: 0.4, carbs: 0.0 },
  "тунец голубой": { id: 871, calories: 144, protein: 23.3, fat: 4.9, carbs: 0.0 },
  "тунец желтоперый": { id: 872, calories: 109, protein: 24.4, fat: 0.5, carbs: 0.0 },
  "тунец желтоперый желтохвостый": { id: 873, calories: 109, protein: 24.4, fat: 0.5, carbs: 0.0 },
  "тунец полосатый": { id: 874, calories: 103, protein: 22.0, fat: 1.0, carbs: 0.0 },
  "устрица": { id: 875, calories: 72, protein: 9.0, fat: 2.0, carbs: 4.5 },
  "форель": { id: 876, calories: 97, protein: 19.2, fat: 2.1, carbs: 0.0 },
  "форель морская": { id: 877, calories: 157, protein: 20.5, fat: 4.3, carbs: 0.0 },
  "хек": { id: 878, calories: 86, protein: 16.6, fat: 2.2, carbs: 0.0 },
  "щука": { id: 879, calories: 84, protein: 18.4, fat: 1.1, carbs: 0.0 },
  "язык морской": { id: 880, calories: 88, protein: 10.3, fat: 5.2, carbs: 0.0 },
  "язь": { id: 881, calories: 81, protein: 18.2, fat: 1.0, carbs: 0.0 },

  // ===== ... (файл очень большой, ниже не меняем) =====
  "чача": { id: 2129, calories: 225, protein: 0.1, fat: 0.1, carbs: 0.5 }
};

// --- ЕДИНИЦЫ И ПОДСКАЗКИ (граммы в скобках) ---
// В рецептах показываем оригинальную единицу, но добавляем в скобках приблизительный перевод в граммы.
// Значения "стакан"/"ложки" зависят от продукта; тут используются усреднённые кухонные меры.
// Источники: таблицы мер и весов продуктов [web:95][web:97].

const UNIT_TO_GRAMS_APPROX = {
  // объёмные меры
  "стакан": 250,
  "стакана": 250,
  "стаканов": 250,
  "cup": 250,
  "cups": 250,

  "ст.л": 15,
  "ст. л": 15,
  "столовая ложка": 15,
  "столовые ложки": 15,

  "ч.л": 5,
  "ч. л": 5,
  "чайная ложка": 5,
  "чайные ложки": 5,

  // жидкие
  "мл": 1,
  "ml": 1,

  // массовые
  "г": 1,
  "гр": 1,
  "gram": 1,
  "grams": 1,
  "кг": 1000,
  "kg": 1000,

  // штуки (очень приблизительно)
  "шт": null,
  "штук": null,
  "piece": null,
  "pcs": null,
};

const PRODUCT_AVG_WEIGHT_G = {
  "яйцо": 50,
  "яйца": 50,
  "банан": 120,
  "бананы": 120,
  "помидор": 100,
  "помидоры": 100,
  "лук": 75,
  "лук репчатый": 75,
  "авокадо": 200,
  "болгарский перец": 150,
  "перец сладкий": 150,
  "морковь": 75,
  "кабачок": 300,
  "баклажан": 250
};

function normalizeUnit(unitRaw = "") {
  return unitRaw.toLowerCase().trim().replace(/\s+/g, " ");
}

function normalizeProductName(nameRaw = "") {
  return nameRaw.toLowerCase().trim();
}

export function getApproxGramsForIngredient({ name, quantity, unit }) {
  const q = parseFloat(quantity);
  if (!q) return null;

  const u = normalizeUnit(unit);
  const product = normalizeProductName(name);

  // штуки — только если знаем средний вес
  if (u.includes("шт") || u.includes("piece") || u.includes("pcs")) {
    const avg = PRODUCT_AVG_WEIGHT_G[product];
    if (!avg) return null;
    return Math.round(q * avg);
  }

  // сначала точные совпадения по словарю
  for (const [key, gramsPerUnit] of Object.entries(UNIT_TO_GRAMS_APPROX)) {
    if (!gramsPerUnit) continue;
    if (u === key || u.includes(key)) {
      return Math.round(q * gramsPerUnit);
    }
  }

  return null;
}

export function formatIngredientAmountWithApproxGrams({ name, quantity, unit }) {
  const q = (quantity ?? "").toString();
  const u = (unit ?? "").toString();

  const grams = getApproxGramsForIngredient({ name, quantity, unit });
  if (!grams) return `${q} ${u}`.trim();

  // Показываем как просили: сначала "как в рецепте", потом в скобках граммы
  return `${q} ${u} (≈ ${grams} г)`.trim();
}

export function calculateRecipeNutrition(ingredients) {
  let totalCalories = 0, totalProtein = 0, totalFat = 0, totalCarbs = 0;
  ingredients.forEach(ingredient => {
    const productName = normalizeProductName(ingredient.name);
    const quantity = parseFloat(ingredient.quantity) || 0;
    if (!quantity) return;

    const product = PRODUCTS_NUTRITION[productName];
    if (!product) return;

    const unit = normalizeUnit(ingredient.unit);

    let gramsAmount = null;

    // 1) Если в граммах/кг/мл — переводим напрямую
    if (unit.includes("кг") || unit === "kg") gramsAmount = quantity * 1000;
    else if (unit.includes("г") || unit.includes("гр") || unit === "gram" || unit === "grams") gramsAmount = quantity;
    else if (unit.includes("мл") || unit === "ml") gramsAmount = quantity; // упрощение: 1 мл ≈ 1 г

    // 2) Иначе пробуем приблизительный перевод
    if (gramsAmount === null) {
      const approx = getApproxGramsForIngredient({ name: ingredient.name, quantity, unit: ingredient.unit });
      if (approx !== null) gramsAmount = approx;
    }

    // 3) Если не получилось перевести — пропускаем, чтобы не рисовать неверные КБЖУ
    if (gramsAmount === null) return;

    const factor = gramsAmount / 100;
    totalCalories += product.calories * factor;
    totalProtein += product.protein * factor;
    totalFat += product.fat * factor;
    totalCarbs += product.carbs * factor;
  });

  return {
    calories: Math.round(totalCalories),
    protein: Math.round(totalProtein * 10) / 10,
    fat: Math.round(totalFat * 10) / 10,
    carbs: Math.round(totalCarbs * 10) / 10
  };
}

export function calculateNutritionPerServing(ingredients, servings = 1) {
  const total = calculateRecipeNutrition(ingredients);
  return {
    calories: Math.round(total.calories / servings),
    protein: Math.round((total.protein / servings) * 10) / 10,
    fat: Math.round((total.fat / servings) * 10) / 10,
    carbs: Math.round((total.carbs / servings) * 10) / 10
  };
}
