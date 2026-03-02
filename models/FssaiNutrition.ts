import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IFssaiNutrition extends Document {
  ingredientKey: string
  aliases: string[]
  calories: number
  protein: number
  fat: number
  saturatedFat: number
  carbohydrates: number
  sugar: number
  sodium: number
  fiber: number
  source: "fssai" | "key_fallback"
  createdAt: Date
  updatedAt: Date
}

const FssaiNutritionSchema = new Schema<IFssaiNutrition>(
  {
    ingredientKey: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    aliases: { type: [String], default: [] },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    fat: { type: Number, required: true },
    saturatedFat: { type: Number, required: true },
    carbohydrates: { type: Number, required: true },
    sugar: { type: Number, required: true },
    sodium: { type: Number, required: true },
    fiber: { type: Number, required: true },
    source: { type: String, enum: ["fssai", "key_fallback"], default: "fssai" },
  },
  { timestamps: true }
)

FssaiNutritionSchema.index({ aliases: 1 })

const FssaiNutrition: Model<IFssaiNutrition> =
  mongoose.models.FssaiNutrition || mongoose.model<IFssaiNutrition>("FssaiNutrition", FssaiNutritionSchema)

export default FssaiNutrition
