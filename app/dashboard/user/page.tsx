"use client"

import { useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Loader2, User as UserIcon, Weight, Calendar, Download, FileText } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { DashboardHeader } from "@/components/dashboard-header"
import { GoalSelector } from "@/components/goal-selector"
import { RecipeInput, type Ingredient } from "@/components/recipe-input"
import { NutritionLabel } from "@/components/nutrition-label"
import { NutritionCharts } from "@/components/nutrition-charts"
import { GoalAnalysisDisplay } from "@/components/goal-analysis-display"
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
  fssaiCompliant: boolean
  fssaiNotes: string
}

interface GoalAnalysis {
  suitable: boolean
  reason: string
  improvements: string[]
}

interface ImprovedRecipe {
  ingredients: { name: string; quantity: number; unit: string; isChanged: boolean; changeNote: string | null }[]
  changes: string[]
  recommendedFoods: { name: string; reason: string }[]
}

const dashboardContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const dashboardItemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35 },
  },
}

export default function UserDashboard() {
  const router = useRouter()
  const { user, isLoading, updateProfile } = useAuth()
  const reportRef = useRef<HTMLDivElement>(null)

  const [analyzing, setAnalyzing] = useState(false)
  const [checkingGoal, setCheckingGoal] = useState(false)
  const [improving, setImproving] = useState(false)
  const [saving, setSaving] = useState(false)

  const [nutrition, setNutrition] = useState<NutritionResult | null>(null)
  const [goalAnalysis, setGoalAnalysis] = useState<GoalAnalysis | null>(null)
  const [improvedRecipe, setImprovedRecipe] = useState<ImprovedRecipe | null>(null)
  const [recipeData, setRecipeData] = useState<{
    name: string
    servingSize: number
    ingredients: Ingredient[]
  } | null>(null)

  const currentGoal = user?.profile?.goal || "normal"

  const handleGoalChange = useCallback(
    async (goal: "gym" | "weight_loss" | "weight_gain" | "normal") => {
      try {
        await updateProfile({ goal })
        toast.success("Goal updated!")
        setGoalAnalysis(null)
        setImprovedRecipe(null)
      } catch {
        toast.error("Failed to update goal")
      }
    },
    [updateProfile]
  )

  const handleAnalyze = async (data: {
    name: string
    servingSize: number
    ingredients: Ingredient[]
  }) => {
    setAnalyzing(true)
    setRecipeData(data)
    setNutrition(null)
    setGoalAnalysis(null)
    setImprovedRecipe(null)

    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: data.ingredients,
          servingSize: data.servingSize,
        }),
      })

      if (!res.ok) throw new Error("Analysis failed")
      const { nutrition: nutritionData } = await res.json()
      setNutrition(nutritionData)
      toast.success("Nutrition analysis complete!")

      setCheckingGoal(true)
      const goalRes = await fetch("/api/ai/goal-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nutrition: nutritionData,
          goal: currentGoal,
          age: user?.profile?.age,
          weight: user?.profile?.weight,
        }),
      })

      if (!goalRes.ok) throw new Error("Goal analysis failed")
      const { goalAnalysis: analysis } = await goalRes.json()
      setGoalAnalysis(analysis)

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
              calories: nutritionData.calories,
              protein: nutritionData.protein,
              fat: nutritionData.fat,
              saturatedFat: nutritionData.saturatedFat,
              carbohydrates: nutritionData.carbohydrates,
              sugar: nutritionData.sugar,
              sodium: nutritionData.sodium,
              fiber: nutritionData.fiber,
            },
            fssaiCompliant: nutritionData.fssaiCompliant,
            goalAnalysis: analysis
              ? {
                goal: currentGoal,
                suitable: analysis.suitable,
                aiComment: analysis.reason,
              }
              : null,
          }),
        })
      } catch {
        // Silent fail
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Analysis failed")
    } finally {
      setAnalyzing(false)
      setCheckingGoal(false)
    }
  }

  const handleImprove = async () => {
    if (!recipeData || !nutrition) return
    setImproving(true)

    try {
      const res = await fetch("/api/ai/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: recipeData.ingredients,
          nutrition,
          goal: currentGoal,
        }),
      })

      if (!res.ok) throw new Error("Failed to generate improvements")
      const { improvedRecipe: improved } = await res.json()
      setImprovedRecipe(improved)
      toast.success("Recipe improved!")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to improve recipe")
    } finally {
      setImproving(false)
    }
  }

  const handleSave = async () => {
    if (!recipeData || !nutrition) return
    setSaving(true)

    try {
      const res = await fetch("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: recipeData.name,
          servingSize: recipeData.servingSize,
          ingredients: recipeData.ingredients,
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
          goalAnalysis: goalAnalysis
            ? {
              goal: currentGoal,
              suitable: goalAnalysis.suitable,
              aiComment: goalAnalysis.reason,
            }
            : null,
          improvedRecipe: improvedRecipe
            ? {
              ingredients: improvedRecipe.ingredients.map((i) => ({
                name: i.name,
                quantity: i.quantity,
                unit: i.unit,
              })),
              changes: improvedRecipe.changes,
              recommendedFoods: improvedRecipe.recommendedFoods,
            }
            : null,
        }),
      })

      if (!res.ok) throw new Error("Failed to save")
      toast.success("Recipe saved!")
    } catch {
      toast.error("Failed to save recipe")
    } finally {
      setSaving(false)
    }
  }

  const handleExportImage = async () => {
    if (!reportRef.current || !recipeData) return

    try {
      const { default: html2canvas } = await import("html2canvas-pro")
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      })

      const link = document.createElement("a")
      link.download = `${recipeData.name.replace(/\s+/g, "-").toLowerCase()}-analysis-report.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    } catch {
      toast.error("Failed to export image")
    }
  }

  const handleExportPdf = async () => {
    if (!reportRef.current || !recipeData) return

    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ])

      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 8
      const usableWidth = pageWidth - margin * 2
      const usableHeight = pageHeight - margin * 2
      const imgHeight = (canvas.height * usableWidth) / canvas.width

      let heightLeft = imgHeight
      let position = margin

      pdf.addImage(imgData, "PNG", margin, position, usableWidth, imgHeight)
      heightLeft -= usableHeight

      while (heightLeft > 0) {
        pdf.addPage()
        position = margin - (imgHeight - heightLeft)
        pdf.addImage(imgData, "PNG", margin, position, usableWidth, imgHeight)
        heightLeft -= usableHeight
      }

      pdf.save(`${recipeData.name.replace(/\s+/g, "-").toLowerCase()}-analysis-report.pdf`)
    } catch {
      toast.error("Failed to export PDF")
    }
  }

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

  if (user.role !== "user") {
    router.push("/dashboard/manufacturer")
    return null
  }

  if (!user.profile?.age || !user.profile?.weight) {
    router.push("/setup-profile")
    return null
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-slate-800">
      <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-slate-300/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-zinc-200/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-gray-300/10 blur-3xl" />
      <DashboardHeader />
      <motion.main
        className="relative z-10 mx-auto max-w-6xl px-4 py-8"
        initial="hidden"
        animate="visible"
        variants={dashboardContainerVariants}
      >
        <motion.div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between" variants={dashboardItemVariants}>
          <div>
            <h1
              className="text-3xl font-bold text-slate-100"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Your Dashboard
            </h1>
            <p className="mt-1 text-slate-300">
              Analyze recipes and get personalized dietary guidance.
            </p>
          </div>
          <div className="flex items-center gap-4 rounded-lg border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-sm text-slate-300">
              <Calendar className="h-3.5 w-3.5" />
              <span>Age: {user.profile.age}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-300">
              <Weight className="h-3.5 w-3.5" />
              <span>{user.profile.weight} kg</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-300">
              <UserIcon className="h-3.5 w-3.5" />
              <span className="capitalize">{currentGoal.replace("_", " ")}</span>
            </div>
          </div>
        </motion.div>

        <motion.div className="mb-8 rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md" variants={dashboardItemVariants}>
          <h2 className="mb-4 text-lg font-semibold text-slate-100" style={{ fontFamily: "var(--font-heading)" }}>
            Your Goal
          </h2>
          <GoalSelector selected={currentGoal} onSelect={handleGoalChange} />
        </motion.div>

        <motion.div className="grid gap-8 lg:grid-cols-2" variants={dashboardItemVariants}>
          <div className="flex flex-col gap-6">
            <motion.div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md" variants={dashboardItemVariants}>
              <h2 className="mb-6 text-lg font-semibold text-slate-100" style={{ fontFamily: "var(--font-heading)" }}>
                Recipe Details
              </h2>
              <RecipeInput
                onSubmit={handleAnalyze}
                loading={analyzing}
              />
            </motion.div>
          </div>

          <div className="flex flex-col gap-6" ref={reportRef}>
            {(analyzing || nutrition) && (
              <motion.div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md" variants={dashboardItemVariants}>
                <h2 className="mb-6 text-lg font-semibold text-slate-100" style={{ fontFamily: "var(--font-heading)" }}>
                  Nutrition Analysis
                </h2>

                {analyzing && !nutrition && (
                  <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-300">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm">Analyzing nutrition...</p>
                  </div>
                )}

                {nutrition && recipeData && (
                  <NutritionLabel
                    recipeName={recipeData.name}
                    servingSize={recipeData.servingSize}
                    nutrition={nutrition}
                    fssaiCompliant={nutrition.fssaiCompliant}
                    fssaiNotes={nutrition.fssaiNotes}
                  />
                )}
              </motion.div>
            )}

            {nutrition && recipeData && (
              <motion.div variants={dashboardItemVariants}>
                <NutritionCharts
                nutrition={nutrition}
                servingSize={recipeData.servingSize}
                />
              </motion.div>
            )}

            {(checkingGoal || goalAnalysis) && (
              <motion.div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md" variants={dashboardItemVariants}>
                <h2 className="mb-6 text-lg font-semibold text-slate-100" style={{ fontFamily: "var(--font-heading)" }}>
                  Goal Compatibility
                </h2>

                {checkingGoal && !goalAnalysis && (
                  <div className="flex flex-col items-center justify-center gap-3 py-10 text-slate-300">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <p className="text-sm">Checking goal compatibility...</p>
                  </div>
                )}

                {goalAnalysis && (
                  <GoalAnalysisDisplay
                    analysis={goalAnalysis}
                    improvedRecipe={improvedRecipe}
                    onImprove={handleImprove}
                    improving={improving}
                  />
                )}
              </motion.div>
            )}

            {nutrition && recipeData && (
              <motion.div className="grid gap-3 sm:grid-cols-3" variants={dashboardItemVariants}>
                <button
                  type="button"
                  onClick={handleExportPdf}
                  className="flex h-10 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 text-sm font-medium text-slate-100 backdrop-blur-md transition-colors hover:border-white/35 hover:bg-white/15 hover:text-white"
                >
                  <FileText className="h-4 w-4" />
                  Export PDF
                </button>
                <button
                  type="button"
                  onClick={handleExportImage}
                  className="flex h-10 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 text-sm font-medium text-slate-100 backdrop-blur-md transition-colors hover:border-white/35 hover:bg-white/15 hover:text-white"
                >
                  <Download className="h-4 w-4" />
                  Export Image
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex h-10 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 text-sm font-medium text-slate-100 backdrop-blur-md transition-colors hover:border-white/35 hover:bg-white/15 hover:text-white disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Recipe"
                  )}
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.main>
    </div>
  )
}
