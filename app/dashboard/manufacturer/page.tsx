"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { DashboardHeader } from "@/components/dashboard-header"
import { RecipeInput, type Ingredient } from "@/components/recipe-input"
import { NutritionLabel } from "@/components/nutrition-label"
import { NutritionCharts } from "@/components/nutrition-charts"
import { toast } from "sonner"

interface NutritionResult {
  calories: number
  protein: number
  fat: number
  saturatedFat: number
  carbohydrates: number
  sugar: number
  sodium: number
  fiber: number
  validInput: boolean
  invalidIngredients: string[]
  validationMessage: string
  fssaiCompliant: boolean
  fssaiNotes: string
}

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
  hover: {
    y: -5,
    transition: { duration: 0.3 },
  },
}

export default function ManufacturerDashboard() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<NutritionResult | null>(null)
  const [recipeData, setRecipeData] = useState<{
    name: string
    servingSize: number
    ingredients: Ingredient[]
  } | null>(null)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    router.push("/auth")
    return null
  }

  if (user.role !== "manufacturer") {
    router.push("/dashboard/user")
    return null
  }

  const handleAnalyze = async (data: {
    name: string
    servingSize: number
    ingredients: Ingredient[]
  }) => {
    setAnalyzing(true)
    setRecipeData(data)
    setResult(null)

    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          ingredients: data.ingredients,
          servingSize: data.servingSize,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Analysis failed")
      }

      const { nutrition } = await res.json()
      if (!nutrition.validInput) {
        setResult(null)
        toast.error(nutrition.validationMessage || "Invalid recipe name or ingredients.")
        return
      }

      setResult(nutrition)
      toast.success("Nutrition analysis complete!")

      // Auto-save to history
      try {
        await fetch("/api/recipe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            servingSize: data.servingSize,
            ingredients: data.ingredients,
            nutrition: {
              calories: nutrition.calories,
              protein: nutrition.protein,
              fat: nutrition.fat,
              saturatedFat: nutrition.saturatedFat,
              carbohydrates: nutrition.carbohydrates,
              sugar: nutrition.sugar,
              sodium: nutrition.sodium,
              fiber: nutrition.fiber,
            },
            fssaiCompliant: nutrition.fssaiCompliant,
          }),
        })
      } catch {
        // Silent fail — don't block analysis if save fails
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Analysis failed")
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-slate-800">
      <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-slate-300/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-zinc-200/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-gray-300/10 blur-3xl" />
      <DashboardHeader />
      <motion.main
        className="mx-auto max-w-6xl px-4 py-8 relative z-10"
        initial="hidden"
        animate="visible"
        variants={pageVariants}
      >
        <motion.div className="mb-8" variants={itemVariants}>
          <h1
            className="text-3xl font-bold text-slate-100"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Manufacturer Dashboard
          </h1>
          <p className="mt-1 text-slate-300">
            Enter your recipe ingredients to generate an FSSAI-compliant nutrition label.
          </p>
        </motion.div>

        <motion.div className="grid gap-8 lg:grid-cols-2" variants={pageVariants}>
          <motion.div
            className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md"
            variants={cardVariants}
            whileHover="hover"
          >
            <h2
              className="mb-6 text-lg font-semibold text-slate-100"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Recipe Details
            </h2>
            <RecipeInput onSubmit={handleAnalyze} loading={analyzing} />
          </motion.div>

          <motion.div
            className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md"
            variants={cardVariants}
            whileHover="hover"
          >
            <h2
              className="mb-6 text-lg font-semibold text-slate-100"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Nutrition Label
            </h2>

            {analyzing && (
              <motion.div
                className="flex flex-col items-center justify-center gap-3 py-20 text-slate-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm">Analyzing your recipe...</p>
              </motion.div>
            )}

            {!analyzing && !result && (
              <motion.div
                className="flex flex-col items-center justify-center gap-2 py-20 text-slate-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-sm">Enter ingredients and click &quot;Analyze Recipe&quot; to generate a nutrition label.</p>
              </motion.div>
            )}

            {!analyzing && result && recipeData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <NutritionLabel
                  recipeName={recipeData.name}
                  servingSize={recipeData.servingSize}
                  nutrition={result}
                  fssaiCompliant={result.fssaiCompliant}
                  fssaiNotes={result.fssaiNotes}
                />
                <NutritionCharts
                  nutrition={result}
                  servingSize={recipeData.servingSize}
                />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.main>
    </div>
  )
}
