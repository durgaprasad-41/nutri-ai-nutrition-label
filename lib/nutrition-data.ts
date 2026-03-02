// Nutrition database for common ingredients (values per 100g)
export interface NutritionEntry {
  calories: number
  protein: number
  fat: number
  saturatedFat: number
  carbohydrates: number
  sugar: number
  sodium: number
  fiber: number
}

export const nutritionDatabase: Record<string, NutritionEntry> = {
  // Eggs
  eggs: {
    calories: 155,
    protein: 13,
    fat: 11,
    saturatedFat: 3.3,
    carbohydrates: 1.1,
    sugar: 1.1,
    sodium: 142,
    fiber: 0,
  },
  egg: {
    calories: 155,
    protein: 13,
    fat: 11,
    saturatedFat: 3.3,
    carbohydrates: 1.1,
    sugar: 1.1,
    sodium: 142,
    fiber: 0,
  },
  // Milk
  milk: {
    calories: 61,
    protein: 3.2,
    fat: 3.3,
    saturatedFat: 2.1,
    carbohydrates: 4.8,
    sugar: 4.8,
    sodium: 44,
    fiber: 0,
  },
  // Wheat flour
  flour: {
    calories: 364,
    protein: 10,
    fat: 1,
    saturatedFat: 0.2,
    carbohydrates: 76,
    sugar: 0.3,
    sodium: 2,
    fiber: 2.7,
  },
  "wheat flour": {
    calories: 364,
    protein: 10,
    fat: 1,
    saturatedFat: 0.2,
    carbohydrates: 76,
    sugar: 0.3,
    sodium: 2,
    fiber: 2.7,
  },
  // Sugar
  sugar: {
    calories: 387,
    protein: 0,
    fat: 0,
    saturatedFat: 0,
    carbohydrates: 100,
    sugar: 100,
    sodium: 2,
    fiber: 0,
  },
  // Salt
  salt: {
    calories: 0,
    protein: 0,
    fat: 0,
    saturatedFat: 0,
    carbohydrates: 0,
    sugar: 0,
    sodium: 38758,
    fiber: 0,
  },
  // Butter
  butter: {
    calories: 717,
    protein: 0.9,
    fat: 81,
    saturatedFat: 51,
    carbohydrates: 0.1,
    sugar: 0.1,
    sodium: 714,
    fiber: 0,
  },
  // Oil
  oil: {
    calories: 884,
    protein: 0,
    fat: 100,
    saturatedFat: 14,
    carbohydrates: 0,
    sugar: 0,
    sodium: 0,
    fiber: 0,
  },
  // Oats
  oats: {
    calories: 389,
    protein: 17,
    fat: 7,
    saturatedFat: 1.3,
    carbohydrates: 66,
    sugar: 0,
    sodium: 30,
    fiber: 11,
  },
  // Chicken
  chicken: {
    calories: 165,
    protein: 31,
    fat: 3.6,
    saturatedFat: 1.0,
    carbohydrates: 0,
    sugar: 0,
    sodium: 74,
    fiber: 0,
  },
  // Rice
  rice: {
    calories: 130,
    protein: 2.7,
    fat: 0.3,
    saturatedFat: 0.08,
    carbohydrates: 28,
    sugar: 0.1,
    sodium: 1,
    fiber: 0.4,
  },
  // Tomato
  tomato: {
    calories: 18,
    protein: 0.9,
    fat: 0.2,
    saturatedFat: 0.03,
    carbohydrates: 3.9,
    sugar: 2.6,
    sodium: 5,
    fiber: 1.2,
  },
  // Onion
  onion: {
    calories: 40,
    protein: 1.1,
    fat: 0.1,
    saturatedFat: 0.04,
    carbohydrates: 9,
    sugar: 4.2,
    sodium: 4,
    fiber: 1.7,
  },
  // Garlic
  garlic: {
    calories: 149,
    protein: 6.6,
    fat: 0.5,
    saturatedFat: 0.03,
    carbohydrates: 33,
    sugar: 1,
    sodium: 17,
    fiber: 2.1,
  },
  // Ginger
  ginger: {
    calories: 80,
    protein: 1.8,
    fat: 0.8,
    saturatedFat: 0.2,
    carbohydrates: 18,
    sugar: 1.7,
    sodium: 27,
    fiber: 2,
  },
  // Potato
  potato: {
    calories: 77,
    protein: 2,
    fat: 0.1,
    saturatedFat: 0.03,
    carbohydrates: 17,
    sugar: 0.8,
    sodium: 6,
    fiber: 2.1,
  },
  // Carrot
  carrot: {
    calories: 41,
    protein: 0.9,
    fat: 0.2,
    saturatedFat: 0.03,
    carbohydrates: 10,
    sugar: 4.7,
    sodium: 69,
    fiber: 2.8,
  },
  // Spinach
  spinach: {
    calories: 23,
    protein: 2.9,
    fat: 0.4,
    saturatedFat: 0.06,
    carbohydrates: 3.6,
    sugar: 0.4,
    sodium: 71,
    fiber: 2.2,
  },
  // Broccoli
  broccoli: {
    calories: 34,
    protein: 2.8,
    fat: 0.4,
    saturatedFat: 0.06,
    carbohydrates: 7,
    sugar: 1.4,
    sodium: 64,
    fiber: 2.4,
  },
  // Honey
  honey: {
    calories: 304,
    protein: 0.3,
    fat: 0,
    saturatedFat: 0,
    carbohydrates: 82,
    sugar: 82,
    sodium: 4,
    fiber: 0.2,
  },
  // Yogurt
  yogurt: {
    calories: 59,
    protein: 10,
    fat: 0.4,
    saturatedFat: 0.3,
    carbohydrates: 3.3,
    sugar: 3.3,
    sodium: 75,
    fiber: 0,
  },
  // Cheese
  cheese: {
    calories: 402,
    protein: 25,
    fat: 33,
    saturatedFat: 21,
    carbohydrates: 1.3,
    sugar: 0.7,
    sodium: 714,
    fiber: 0,
  },
  // Lentils
  lentils: {
    calories: 116,
    protein: 9,
    fat: 0.4,
    saturatedFat: 0.06,
    carbohydrates: 20,
    sugar: 1.5,
    sodium: 6,
    fiber: 1.8,
  },
  // Chilies
  "green chili": {
    calories: 40,
    protein: 2,
    fat: 0.2,
    saturatedFat: 0,
    carbohydrates: 9,
    sugar: 5.3,
    sodium: 7,
    fiber: 1.5,
  },
  "green chilli": {
    calories: 40,
    protein: 2,
    fat: 0.2,
    saturatedFat: 0,
    carbohydrates: 9,
    sugar: 5.3,
    sodium: 7,
    fiber: 1.5,
  },
  chili: {
    calories: 40,
    protein: 2,
    fat: 0.2,
    saturatedFat: 0,
    carbohydrates: 9,
    sugar: 5.3,
    sodium: 7,
    fiber: 1.5,
  },
  chilli: {
    calories: 40,
    protein: 2,
    fat: 0.2,
    saturatedFat: 0,
    carbohydrates: 9,
    sugar: 5.3,
    sodium: 7,
    fiber: 1.5,
  },
  // Coriander
  coriander: {
    calories: 23,
    protein: 2.1,
    fat: 0.5,
    saturatedFat: 0.01,
    carbohydrates: 3.7,
    sugar: 0.9,
    sodium: 46,
    fiber: 2.8,
  },
  "coriander leaf": {
    calories: 23,
    protein: 2.1,
    fat: 0.5,
    saturatedFat: 0.01,
    carbohydrates: 3.7,
    sugar: 0.9,
    sodium: 46,
    fiber: 2.8,
  },
  "coriander leaves": {
    calories: 23,
    protein: 2.1,
    fat: 0.5,
    saturatedFat: 0.01,
    carbohydrates: 3.7,
    sugar: 0.9,
    sodium: 46,
    fiber: 2.8,
  },
  cilantro: {
    calories: 23,
    protein: 2.1,
    fat: 0.5,
    saturatedFat: 0.01,
    carbohydrates: 3.7,
    sugar: 0.9,
    sodium: 46,
    fiber: 2.8,
  },
  // Curry leaves
  "curry leaves": {
    calories: 108,
    protein: 6.1,
    fat: 1,
    saturatedFat: 0.2,
    carbohydrates: 18.7,
    sugar: 2.3,
    sodium: 16,
    fiber: 6.4,
  },
  "curry leaf": {
    calories: 108,
    protein: 6.1,
    fat: 1,
    saturatedFat: 0.2,
    carbohydrates: 18.7,
    sugar: 2.3,
    sodium: 16,
    fiber: 6.4,
  },
}

export function findNutritionData(ingredient: string): NutritionEntry | null {
  const normalizedName = ingredient.toLowerCase().trim()
  const canonicalName = normalizedName
    .replace(/\bchilli\b/g, "chili")
    .replace(/\bleaves\b/g, "leaf")
  
  // Direct match
  if (nutritionDatabase[normalizedName]) {
    return nutritionDatabase[normalizedName]
  }
  if (nutritionDatabase[canonicalName]) {
    return nutritionDatabase[canonicalName]
  }
  
  // Substring match
  for (const [key, value] of Object.entries(nutritionDatabase)) {
    if (
      normalizedName.includes(key) ||
      key.includes(normalizedName) ||
      canonicalName.includes(key) ||
      key.includes(canonicalName)
    ) {
      return value
    }
  }
  
  return null
}

export function calculateRecipeNutrition(ingredients: Array<{ name: string; quantity: number; unit: string }>) {
  let totalCalories = 0
  let totalProtein = 0
  let totalFat = 0
  let totalSaturatedFat = 0
  let totalCarbohydrates = 0
  let totalSugar = 0
  let totalSodium = 0
  let totalFiber = 0
  
  const unknownIngredients: string[] = []
  
  for (const ing of ingredients) {
    const nutritionData = findNutritionData(ing.name)
    
    if (!nutritionData) {
      unknownIngredients.push(ing.name)
      continue
    }
    
    // Convert quantity to grams (approximate conversions)
    let gramsQuantity = ing.quantity
    
    if (ing.unit === "cup") {
      gramsQuantity = ing.quantity * 240 // 1 cup ≈ 240g
    } else if (ing.unit === "tbsp") {
      gramsQuantity = ing.quantity * 15 // 1 tbsp ≈ 15g
    } else if (ing.unit === "tsp") {
      gramsQuantity = ing.quantity * 5 // 1 tsp ≈ 5g
    } else if (ing.unit === "oz") {
      gramsQuantity = ing.quantity * 28.35 // 1 oz ≈ 28.35g
    } else if (ing.unit === "ml") {
      gramsQuantity = ing.quantity * 1 // Approximate: 1ml ≈ 1g
    } else if (ing.unit === "L") {
      gramsQuantity = ing.quantity * 1000
    } else if (ing.unit === "kg") {
      gramsQuantity = ing.quantity * 1000
    } else if (ing.unit === "pcs") {
      // For pieces, estimate based on ingredient
      if (ing.name.toLowerCase().includes("egg")) {
        gramsQuantity = ing.quantity * 50 // 1 egg ≈ 50g
      } else {
        gramsQuantity = ing.quantity * 100 // Default estimate
      }
    }
    
    // Calculate nutrition for this ingredient
    const multiplier = gramsQuantity / 100
    totalCalories += nutritionData.calories * multiplier
    totalProtein += nutritionData.protein * multiplier
    totalFat += nutritionData.fat * multiplier
    totalSaturatedFat += nutritionData.saturatedFat * multiplier
    totalCarbohydrates += nutritionData.carbohydrates * multiplier
    totalSugar += nutritionData.sugar * multiplier
    totalSodium += nutritionData.sodium * multiplier
    totalFiber += nutritionData.fiber * multiplier
  }
  
  return {
    calories: Math.round(totalCalories),
    protein: Math.round(totalProtein * 10) / 10,
    fat: Math.round(totalFat * 10) / 10,
    saturatedFat: Math.round(totalSaturatedFat * 10) / 10,
    carbohydrates: Math.round(totalCarbohydrates * 10) / 10,
    sugar: Math.round(totalSugar * 10) / 10,
    sodium: Math.round(totalSodium),
    fiber: Math.round(totalFiber * 10) / 10,
    unknownIngredients,
  }
}
