import FssaiNutrition from "@/models/FssaiNutrition"
import { findNutritionData, type NutritionEntry } from "@/lib/nutrition-data"

interface IngredientInput {
  name: string
  quantity: number
  unit: string
}

interface NutritionResult {
  calories: number
  protein: number
  fat: number
  saturatedFat: number
  carbohydrates: number
  sugar: number
  sodium: number
  fiber: number
  unknownIngredients: string[]
}

function normalizeIngredientName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim()
}

function canonicalIngredientName(name: string) {
  return normalizeIngredientName(name)
    .replace(/\bchilli\b/g, "chili")
    .replace(/\bleaves\b/g, "leaf")
}

function toGrams(quantity: number, unit: string, ingredientName: string) {
  const normalizedUnit = unit.toLowerCase().trim()

  if (normalizedUnit === "kg") return quantity * 1000
  if (normalizedUnit === "g") return quantity
  if (normalizedUnit === "l" || normalizedUnit === "liter" || normalizedUnit === "litre") return quantity * 1000
  if (normalizedUnit === "ml") return quantity
  if (normalizedUnit === "tbsp" || normalizedUnit === "tablespoon") return quantity * 15
  if (normalizedUnit === "tsp" || normalizedUnit === "teaspoon") return quantity * 5
  if (normalizedUnit === "cup" || normalizedUnit === "cups") return quantity * 240
  if (normalizedUnit === "oz") return quantity * 28.35
  if (normalizedUnit === "piece" || normalizedUnit === "pieces" || normalizedUnit === "nos" || normalizedUnit === "pcs") {
    return ingredientName.toLowerCase().includes("egg") ? quantity * 50 : quantity * 100
  }

  return quantity
}

async function findFssaiNutritionEntry(ingredientName: string): Promise<NutritionEntry | null> {
  const normalized = normalizeIngredientName(ingredientName)
  if (!normalized) return null
  const canonical = canonicalIngredientName(ingredientName)

  const exact = await FssaiNutrition.findOne({
    $or: [{ ingredientKey: normalized }, { ingredientKey: canonical }, { aliases: normalized }, { aliases: canonical }],
  })
    .lean()
    .exec()

  if (exact) {
    return {
      calories: exact.calories,
      protein: exact.protein,
      fat: exact.fat,
      saturatedFat: exact.saturatedFat,
      carbohydrates: exact.carbohydrates,
      sugar: exact.sugar,
      sodium: exact.sodium,
      fiber: exact.fiber,
    }
  }

  return null
}

async function backfillKeyFallbackToDb(ingredientName: string, entry: NutritionEntry) {
  const normalized = normalizeIngredientName(ingredientName)
  if (!normalized) return
  const canonical = canonicalIngredientName(ingredientName)
  const aliases = Array.from(new Set([canonical, normalized])).filter(Boolean)

  await FssaiNutrition.updateOne(
    { ingredientKey: normalized },
    {
      $setOnInsert: {
        ingredientKey: normalized,
        aliases,
        source: "key_fallback",
        calories: entry.calories,
        protein: entry.protein,
        fat: entry.fat,
        saturatedFat: entry.saturatedFat,
        carbohydrates: entry.carbohydrates,
        sugar: entry.sugar,
        sodium: entry.sodium,
        fiber: entry.fiber,
      },
    },
    { upsert: true }
  ).exec()
}

export async function calculateRecipeNutritionFromFssai(ingredients: IngredientInput[]): Promise<NutritionResult> {
  let totalWeight = 0
  let totalCalories = 0
  let totalProtein = 0
  let totalFat = 0
  let totalSaturatedFat = 0
  let totalCarbohydrates = 0
  let totalSugar = 0
  let totalSodium = 0
  let totalFiber = 0

  const unknownIngredients: string[] = []

  for (const ingredient of ingredients) {
    const quantityInGrams = toGrams(ingredient.quantity, ingredient.unit, ingredient.name)
    totalWeight += quantityInGrams

    const fromDb = await findFssaiNutritionEntry(ingredient.name)
    let nutrientData: NutritionEntry | null = fromDb

    if (!nutrientData) {
      nutrientData = findNutritionData(ingredient.name)
      if (nutrientData) {
        await backfillKeyFallbackToDb(ingredient.name, nutrientData)
      }
    }

    if (!nutrientData) {
      unknownIngredients.push(ingredient.name)
      continue
    }

    const factor = quantityInGrams / 100
    totalCalories += nutrientData.calories * factor
    totalProtein += nutrientData.protein * factor
    totalFat += nutrientData.fat * factor
    totalSaturatedFat += nutrientData.saturatedFat * factor
    totalCarbohydrates += nutrientData.carbohydrates * factor
    totalSugar += nutrientData.sugar * factor
    totalSodium += nutrientData.sodium * factor
    totalFiber += nutrientData.fiber * factor
  }

  const normFactor = totalWeight > 0 ? 100 / totalWeight : 1

  return {
    calories: Math.round(totalCalories * normFactor * 10) / 10,
    protein: Math.round(totalProtein * normFactor * 10) / 10,
    fat: Math.round(totalFat * normFactor * 10) / 10,
    saturatedFat: Math.round(totalSaturatedFat * normFactor * 10) / 10,
    carbohydrates: Math.round(totalCarbohydrates * normFactor * 10) / 10,
    sugar: Math.round(totalSugar * normFactor * 10) / 10,
    sodium: Math.round(totalSodium * normFactor * 10) / 10,
    fiber: Math.round(totalFiber * normFactor * 10) / 10,
    unknownIngredients,
  }
}
