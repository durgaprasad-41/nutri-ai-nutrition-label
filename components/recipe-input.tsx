"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"

export interface Ingredient {
  name: string
  quantity: number
  unit: string
}

interface RecipeInputProps {
  onSubmit: (data: { name: string; servingSize: number; ingredients: Ingredient[] }) => void
  loading?: boolean
}

const unitOptions = ["g", "ml", "tbsp", "tsp", "cup", "oz", "kg", "L", "pcs"]

export function RecipeInput({ onSubmit, loading }: RecipeInputProps) {
  const [recipeName, setRecipeName] = useState("")
  const [servingSize, setServingSize] = useState("100")
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", quantity: 0, unit: "g" },
  ])

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: 0, unit: "g" }])
  }

  const canAddIngredient = ingredients.every((ingredient) => ingredient.name.trim() && ingredient.quantity > 0)

  const removeIngredient = (index: number) => {
    if (ingredients.length <= 1) return
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const updateIngredient = (index: number, field: keyof Ingredient, value: string | number) => {
    const updated = [...ingredients]
    if (field === "quantity") {
      updated[index] = { ...updated[index], [field]: Number(value) }
    } else {
      updated[index] = { ...updated[index], [field]: value }
    }
    setIngredients(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validIngredients = ingredients.filter((i) => i.name.trim() && i.quantity > 0)
    if (!recipeName.trim() || validIngredients.length === 0) return
    onSubmit({
      name: recipeName.trim(),
      servingSize: parseInt(servingSize) || 100,
      ingredients: validIngredients,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="recipe-name" className="text-sm font-medium text-slate-100">
            Recipe Name
          </label>
          <input
            id="recipe-name"
            type="text"
            required
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            placeholder="e.g. Masala Oats"
            className="h-10 rounded-lg border border-white/25 bg-black/25 px-3 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/45"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="serving-size" className="text-sm font-medium text-slate-100">
            Serving Size (g)
          </label>
          <input
            id="serving-size"
            type="number"
            required
            min={1}
            value={servingSize}
            onChange={(e) => setServingSize(e.target.value)}
            placeholder="100"
            className="h-10 rounded-lg border border-white/25 bg-black/25 px-3 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/45"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-slate-100">
          Ingredients
        </label>

        <div className="flex flex-col gap-2">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={ingredient.name}
                onChange={(e) => updateIngredient(index, "name", e.target.value)}
                placeholder="Ingredient name"
                className="h-10 flex-1 rounded-lg border border-white/25 bg-black/25 px-3 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/45"
              />
              <input
                type="number"
                min={0.1}
                step={0.1}
                value={ingredient.quantity || ""}
                onChange={(e) => updateIngredient(index, "quantity", e.target.value)}
                placeholder="Qty"
                className="h-10 w-24 rounded-lg border border-white/25 bg-black/25 px-3 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/45"
              />
              <select
                value={ingredient.unit}
                onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                className="h-10 w-20 rounded-lg border border-white/25 bg-black/25 px-2 text-sm text-slate-100 transition duration-200 ease-out hover:border-cyan-300/50 hover:bg-white/5 focus:border-cyan-400/55 focus:shadow-[0_0_0_4px_rgba(34,211,238,0.18)] focus:outline-none transform hover:-translate-y-[1px] focus:-translate-y-[1px]"
              >
                {unitOptions.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                disabled={ingredients.length <= 1}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-slate-200 backdrop-blur-md transition-colors hover:border-rose-300/60 hover:bg-gradient-to-br hover:from-rose-500/35 hover:to-red-500/35 hover:text-rose-100 disabled:opacity-30"
                aria-label="Remove ingredient"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addIngredient}
          disabled={!canAddIngredient}
          className="flex items-center gap-2 self-start rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm text-slate-200 backdrop-blur-md transition-colors hover:border-white/35 hover:bg-white/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Add Ingredient
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex h-11 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 text-sm font-medium text-slate-100 backdrop-blur-md transition-colors hover:border-white/35 hover:bg-white/15 hover:text-white disabled:opacity-50"
      >
        {loading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-100 border-t-transparent" />
            Analyzing...
          </>
        ) : (
          "Analyze Recipe"
        )}
      </button>
    </form>
  )
}
