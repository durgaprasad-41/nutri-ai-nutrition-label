import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { connectToDatabase } from "@/lib/mongodb"
import { calculateRecipeNutritionFromFssai } from "@/lib/fssai-nutrition"

const nutritionSchema = z.object({
  calories: z.number(),
  protein: z.number(),
  fat: z.number(),
  saturatedFat: z.number(),
  carbohydrates: z.number(),
  sugar: z.number(),
  sodium: z.number(),
  fiber: z.number(),
  validInput: z.boolean(),
  invalidIngredients: z.array(z.string()),
  validationMessage: z.string(),
  fssaiCompliant: z.boolean(),
  fssaiNotes: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, servingSize, ingredients } = body

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json(
        { error: "No ingredients provided" },
        { status: 400 }
      )
    }

    console.log("Analyzing recipe:", { name, servingSize, ingredients })

    // DB-first: use FSSAI values from MongoDB; if missing, fallback to key-based local values.
    await connectToDatabase()
    const nutritionResult = await calculateRecipeNutritionFromFssai(ingredients)
    
    console.log("Local nutrition calculation:", nutritionResult)

    const hasValidRecipeName = typeof name === "string" && name.trim().length > 0
    const hasUnknownIngredients = nutritionResult.unknownIngredients.length > 0
    const validInput = hasValidRecipeName && !hasUnknownIngredients
    const validationMessage = validInput
      ? "Recipe input is valid."
      : hasUnknownIngredients
        ? `Invalid ingredient(s): ${nutritionResult.unknownIngredients.join(", ")}`
        : "Invalid recipe name."

    // Keep FSSAI fields for compatibility/history data
    const fssaiCompliant = !hasUnknownIngredients && nutritionResult.sodium < 500
    
    const fssaiNotes = hasUnknownIngredients
      ? `Could not verify some ingredients: ${nutritionResult.unknownIngredients.join(", ")}. Please verify FSSAI compliance manually.`
      : "Recipe appears FSSAI compliant with basic ingredients. Verify final product meets all regulations."

    const result = {
      calories: nutritionResult.calories,
      protein: nutritionResult.protein,
      fat: nutritionResult.fat,
      saturatedFat: nutritionResult.saturatedFat,
      carbohydrates: nutritionResult.carbohydrates,
      sugar: nutritionResult.sugar,
      sodium: nutritionResult.sodium,
      fiber: nutritionResult.fiber,
      validInput,
      invalidIngredients: nutritionResult.unknownIngredients,
      validationMessage,
      fssaiCompliant,
      fssaiNotes,
    }

    console.log("Final result:", result)
    return NextResponse.json({ nutrition: result })
  } catch (error) {
    console.error("AI Analysis Error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { 
        error: `Failed to analyze recipe: ${errorMessage}`
      },
      { status: 500 }
    )
  }
}
