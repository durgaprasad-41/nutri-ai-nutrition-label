export type GoalType = "gym" | "weight_loss" | "weight_gain" | "normal"

export interface RecommendedIngredient {
  name: string
  quantity: number
  unit: string
}

export interface RecommendedNutrition {
  calories: number
  protein: number
  fat: number
  saturatedFat: number
  carbohydrates: number
  sugar: number
  sodium: number
  fiber: number
}

export interface RecommendedRecipe {
  id: string
  name: string
  imageUrl: string
  fallbackImageUrl: string
  goal: GoalType
  ingredients: RecommendedIngredient[]
  nutrition: RecommendedNutrition
  shelfLifeDays: number
}

export const goalRecipeRecommendations: Record<GoalType, RecommendedRecipe[]> = {
  gym: [
    {
      id: "gym-1",
      name: "Grilled Chicken Quinoa Bowl",
      imageUrl:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
      fallbackImageUrl: "/recipes/grilled-chicken-quinoa-bowl.svg",
      goal: "gym",
      shelfLifeDays: 3,
      ingredients: [
        { name: "grilled chicken breast", quantity: 150, unit: "g" },
        { name: "cooked quinoa", quantity: 100, unit: "g" },
        { name: "steamed broccoli", quantity: 80, unit: "g" },
        { name: "olive oil drizzle", quantity: 8, unit: "ml" },
        { name: "sea salt", quantity: 2, unit: "g" },
        { name: "black pepper", quantity: 1, unit: "g" },
      ],
      nutrition: {
        calories: 356,
        protein: 38,
        fat: 9.5,
        saturatedFat: 2,
        carbohydrates: 28,
        sugar: 2,
        sodium: 185,
        fiber: 5.2,
      },
    },
    {
      id: "gym-2",
      name: "Paneer Moong Chilla",
      imageUrl:
        "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=1200&q=80",
      fallbackImageUrl: "/recipes/paneer-moong-chilla.svg",
      goal: "gym",
      shelfLifeDays: 1,
      ingredients: [
        { name: "moong dal batter", quantity: 120, unit: "g" },
        { name: "paneer (cottage cheese)", quantity: 80, unit: "g" },
        { name: "onion (diced)", quantity: 30, unit: "g" },
        { name: "green chili", quantity: 5, unit: "g" },
        { name: "fresh coriander", quantity: 8, unit: "g" },
        { name: "ghee for cooking", quantity: 10, unit: "g" },
      ],
      nutrition: {
        calories: 288,
        protein: 22,
        fat: 14,
        saturatedFat: 7.5,
        carbohydrates: 20,
        sugar: 2.5,
        sodium: 210,
        fiber: 5.8,
      },
    },
    {
      id: "gym-3",
      name: "Protein Egg Scramble",
      imageUrl:
        "https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=1200&q=80",
      fallbackImageUrl: "/placeholder.jpg",
      goal: "gym",
      shelfLifeDays: 1,
      ingredients: [
        { name: "eggs", quantity: 3, unit: "pcs" },
        { name: "onion (chopped)", quantity: 40, unit: "g" },
        { name: "black pepper", quantity: 2, unit: "g" },
        { name: "spinach", quantity: 50, unit: "g" },
        { name: "olive oil", quantity: 8, unit: "ml" },
      ],
      nutrition: {
        calories: 268,
        protein: 20,
        fat: 18,
        saturatedFat: 5,
        carbohydrates: 6,
        sugar: 2.2,
        sodium: 210,
        fiber: 2.1,
      },
    },
  ],
  weight_loss: [
    {
      id: "wl-1",
      name: "Vegetable Upma",
      imageUrl:
        "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
      fallbackImageUrl: "/recipes/vegetable-upma.svg",
      goal: "weight_loss",
      shelfLifeDays: 1,
      ingredients: [
        { name: "semolina (dry roasted)", quantity: 80, unit: "g" },
        { name: "mixed vegetables (diced)", quantity: 100, unit: "g" },
        { name: "onion (chopped)", quantity: 25, unit: "g" },
        { name: "green peas", quantity: 30, unit: "g" },
        { name: "carrot (shredded)", quantity: 35, unit: "g" },
        { name: "vegetable oil", quantity: 5, unit: "ml" },
        { name: "mustard seeds", quantity: 2, unit: "g" },
      ],
      nutrition: {
        calories: 195,
        protein: 6.2,
        fat: 5.5,
        saturatedFat: 1,
        carbohydrates: 32,
        sugar: 3,
        sodium: 180,
        fiber: 4.1,
      },
    },
    {
      id: "wl-2",
      name: "Sprout Salad",
      imageUrl:
        "https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=1200&q=80",
      fallbackImageUrl: "/recipes/sprout-salad.svg",
      goal: "weight_loss",
      shelfLifeDays: 2,
      ingredients: [
        { name: "mixed sprouts (moong, alfalfa)", quantity: 120, unit: "g" },
        { name: "cucumber (sliced)", quantity: 60, unit: "g" },
        { name: "tomato (chopped)", quantity: 60, unit: "g" },
        { name: "bell pepper (diced)", quantity: 30, unit: "g" },
        { name: "lemon juice", quantity: 15, unit: "ml" },
        { name: "sea salt", quantity: 2, unit: "g" },
      ],
      nutrition: {
        calories: 68,
        protein: 9.2,
        fat: 0.8,
        saturatedFat: 0.15,
        carbohydrates: 10,
        sugar: 2.5,
        sodium: 95,
        fiber: 6.2,
      },
    },
    {
      id: "wl-3",
      name: "Egg White Veg Omelette",
      imageUrl:
        "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80",
      fallbackImageUrl: "/placeholder.jpg",
      goal: "weight_loss",
      shelfLifeDays: 1,
      ingredients: [
        { name: "egg whites", quantity: 120, unit: "g" },
        { name: "onion (chopped)", quantity: 30, unit: "g" },
        { name: "black pepper", quantity: 1, unit: "g" },
        { name: "tomato (chopped)", quantity: 40, unit: "g" },
        { name: "spinach", quantity: 40, unit: "g" },
      ],
      nutrition: {
        calories: 118,
        protein: 16,
        fat: 2.3,
        saturatedFat: 0.6,
        carbohydrates: 6,
        sugar: 3.1,
        sodium: 165,
        fiber: 1.8,
      },
    },
  ],
  weight_gain: [
    {
      id: "wg-1",
      name: "Peanut Banana Shake",
      imageUrl:
        "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=1200&q=80",
      fallbackImageUrl: "/recipes/peanut-banana-shake.svg",
      goal: "weight_gain",
      shelfLifeDays: 1,
      ingredients: [
        { name: "banana (ripe)", quantity: 120, unit: "g" },
        { name: "whole milk", quantity: 250, unit: "ml" },
        { name: "peanut butter (natural)", quantity: 25, unit: "g" },
        { name: "rolled oats", quantity: 25, unit: "g" },
        { name: "honey", quantity: 10, unit: "g" },
        { name: "ice cubes", quantity: 50, unit: "g" },
      ],
      nutrition: {
        calories: 386,
        protein: 14,
        fat: 13,
        saturatedFat: 4.5,
        carbohydrates: 50,
        sugar: 28,
        sodium: 135,
        fiber: 5.8,
      },
    },
    {
      id: "wg-2",
      name: "Rice and Dal with Ghee",
      imageUrl:
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80",
      fallbackImageUrl: "/recipes/rice-and-dal-with-ghee.svg",
      goal: "weight_gain",
      shelfLifeDays: 2,
      ingredients: [
        { name: "white rice (cooked)", quantity: 150, unit: "g" },
        { name: "toor dal (cooked)", quantity: 100, unit: "g" },
        { name: "ghee (clarified butter)", quantity: 12, unit: "g" },
        { name: "onion (fried)", quantity: 30, unit: "g" },
        { name: "curry leaves", quantity: 3, unit: "g" },
        { name: "mustard seeds", quantity: 2, unit: "g" },
      ],
      nutrition: {
        calories: 368,
        protein: 11,
        fat: 10.5,
        saturatedFat: 5.8,
        carbohydrates: 55,
        sugar: 2,
        sodium: 125,
        fiber: 4.6,
      },
    },
    {
      id: "wg-3",
      name: "Egg Masala Rice Bowl",
      imageUrl:
        "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1200&q=80",
      fallbackImageUrl: "/placeholder.jpg",
      goal: "weight_gain",
      shelfLifeDays: 1,
      ingredients: [
        { name: "eggs", quantity: 2, unit: "pcs" },
        { name: "onion (sliced)", quantity: 50, unit: "g" },
        { name: "black pepper", quantity: 1, unit: "g" },
        { name: "cooked rice", quantity: 180, unit: "g" },
        { name: "ghee", quantity: 10, unit: "g" },
      ],
      nutrition: {
        calories: 432,
        protein: 15,
        fat: 15,
        saturatedFat: 5.2,
        carbohydrates: 57,
        sugar: 2.1,
        sodium: 170,
        fiber: 2.4,
      },
    },
  ],
  normal: [
    {
      id: "n-1",
      name: "Khichdi",
      imageUrl:
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80",
      fallbackImageUrl: "/recipes/khichdi.svg",
      goal: "normal",
      shelfLifeDays: 2,
      ingredients: [
        { name: "rice (basmati)", quantity: 100, unit: "g" },
        { name: "moong dal (yellow)", quantity: 75, unit: "g" },
        { name: "carrot (diced)", quantity: 40, unit: "g" },
        { name: "green peas", quantity: 40, unit: "g" },
        { name: "ghee", quantity: 8, unit: "g" },
        { name: "cumin seeds", quantity: 2, unit: "g" },
      ],
      nutrition: {
        calories: 245,
        protein: 8.5,
        fat: 5,
        saturatedFat: 2.8,
        carbohydrates: 40,
        sugar: 3,
        sodium: 155,
        fiber: 5.1,
      },
    },
    {
      id: "n-2",
      name: "Rice and Dal with Ghee",
      imageUrl:
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80",
      fallbackImageUrl: "/recipes/rice-and-dal-with-ghee.svg",
      goal: "normal",
      shelfLifeDays: 2,
      ingredients: [
        { name: "white rice (cooked)", quantity: 120, unit: "g" },
        { name: "toor dal (cooked)", quantity: 80, unit: "g" },
        { name: "ghee", quantity: 10, unit: "g" },
        { name: "onion (fried)", quantity: 25, unit: "g" },
        { name: "turmeric powder", quantity: 1, unit: "g" },
        { name: "curry leaves", quantity: 3, unit: "g" },
      ],
      nutrition: {
        calories: 310,
        protein: 9.5,
        fat: 8.8,
        saturatedFat: 4.9,
        carbohydrates: 48,
        sugar: 1.8,
        sodium: 140,
        fiber: 4.2,
      },
    },
    {
      id: "n-3",
      name: "Simple Egg Bhurji",
      imageUrl:
        "https://images.unsplash.com/photo-1598514982846-5f89f4f5c66c?auto=format&fit=crop&w=1200&q=80",
      fallbackImageUrl: "/placeholder.jpg",
      goal: "normal",
      shelfLifeDays: 1,
      ingredients: [
        { name: "eggs", quantity: 2, unit: "pcs" },
        { name: "onion (chopped)", quantity: 40, unit: "g" },
        { name: "black pepper", quantity: 1, unit: "g" },
        { name: "tomato (chopped)", quantity: 35, unit: "g" },
        { name: "ghee", quantity: 6, unit: "g" },
      ],
      nutrition: {
        calories: 236,
        protein: 13,
        fat: 17,
        saturatedFat: 5.8,
        carbohydrates: 6,
        sugar: 2.6,
        sodium: 165,
        fiber: 1.4,
      },
    },
  ],
}
