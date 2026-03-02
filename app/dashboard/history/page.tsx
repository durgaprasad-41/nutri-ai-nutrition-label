"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Loader2,
  Clock,
  ChevronDown,
  ChevronUp,
  Flame,
  Beef,
  Droplets,
  Wheat,
  Search,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { DashboardHeader } from "@/components/dashboard-header"
import { NutritionLabel } from "@/components/nutrition-label"
import { NutritionCharts } from "@/components/nutrition-charts"
import AnimatedList from "@/components/ui/animated-list"

interface RecipeHistory {
  _id: string
  name: string
  servingSize: number
  ingredients: { name: string; quantity: number; unit: string }[]
  nutrition: {
    calories: number
    protein: number
    fat: number
    saturatedFat?: number
    carbohydrates: number
    sugar: number
    sodium: number
    fiber: number
  } | null
  fssaiCompliant: boolean | null
  goalAnalysis: {
    goal: string
    suitable: boolean
    aiComment: string
  } | null
  createdAt: string
}

export default function HistoryPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [recipes, setRecipes] = useState<RecipeHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const res = await fetch("/api/recipe")
        if (!res.ok) throw new Error("Failed to fetch")
        const { recipes: data } = await res.json()
        setRecipes(data)
      } catch (err) {
        console.error("Failed to fetch history:", err)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchRecipes()
    }
  }, [user])

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

  const filteredRecipes = recipes.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-slate-800">
      <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-slate-300/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-zinc-200/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-gray-300/10 blur-3xl" />
      <DashboardHeader />
      <main className="relative z-10 mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <h1
            className="text-3xl font-bold text-slate-100"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Recipe History
          </h1>
          <p className="mt-1 text-slate-300/90">
            View all your previously analyzed recipes and their nutrition data.
          </p>
        </div>

        <div className="mb-6 flex items-center gap-2 rounded-[20px] border border-white/20 bg-white/10 px-4 py-2.5 shadow-sm backdrop-blur-md">
          <Search className="h-4 w-4 text-slate-300" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
          />
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm">Loading history...</p>
          </div>
        )}

        {!loading && filteredRecipes.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-[20px] border border-white/20 bg-white/10 py-20 text-slate-300 shadow-sm backdrop-blur-md">
            <Clock className="h-10 w-10 text-slate-400/60" />
            <p className="text-sm text-slate-300">
              {searchQuery
                ? "No recipes match your search."
                : "No recipes analyzed yet. Go to your dashboard and analyze a recipe!"}
            </p>
          </div>
        )}

        {!loading && filteredRecipes.length > 0 && (
          <AnimatedList
            items={filteredRecipes}
            showGradients
            enableArrowNavigation
            displayScrollbar
            className="w-full"
            itemClassName="border-0 bg-transparent"
            renderItem={(recipe) => {
              const isExpanded = expandedId === recipe._id
              return (
                <div className="rounded-[20px] border border-white/20 bg-white/10 overflow-hidden shadow-sm backdrop-blur-sm transition-all hover:shadow-md">
                  <button
                    type="button"
                    onClick={() => toggleExpand(recipe._id)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-white/10"
                  >
                    <div className="flex flex-col gap-1">
                      <h3 className="text-base font-semibold text-white">
                        {recipe.name}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-300">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(recipe.createdAt)}
                        </span>
                        <span>{recipe.servingSize}g serving</span>
                        <span>{recipe.ingredients.length} ingredients</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {recipe.nutrition && (
                        <div className="hidden items-center gap-3 sm:flex">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Flame className="h-3.5 w-3.5 text-orange-400" />
                            <span>{recipe.nutrition.calories} kcal</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Beef className="h-3.5 w-3.5 text-red-400" />
                            <span>{recipe.nutrition.protein}g</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Droplets className="h-3.5 w-3.5 text-yellow-400" />
                            <span>{recipe.nutrition.fat}g</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Wheat className="h-3.5 w-3.5 text-green-400" />
                            <span>{recipe.nutrition.carbohydrates}g</span>
                          </div>
                        </div>
                      )}

                      {recipe.goalAnalysis && (
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            recipe.goalAnalysis.suitable
                              ? "bg-primary/10 text-primary"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {recipe.goalAnalysis.suitable ? "Goal Fit" : "Not Ideal"}
                        </span>
                      )}

                      {recipe.fssaiCompliant !== null && (
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            recipe.fssaiCompliant
                              ? "bg-primary/10 text-primary"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {recipe.fssaiCompliant ? "FSSAI Yes" : "FSSAI No"}
                        </span>
                      )}

                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-border px-5 py-6">
                      <div className="mb-6">
                        <h4 className="mb-3 text-sm font-semibold text-white uppercase tracking-wider">
                          Ingredients
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {recipe.ingredients.map((ing, i) => (
                            <span
                              key={i}
                              className="rounded-[20px] border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-slate-100"
                            >
                              {ing.name} - {ing.quantity} {ing.unit}
                            </span>
                          ))}
                        </div>
                      </div>

                      {recipe.goalAnalysis && (
                        <div className="mb-6">
                          <h4 className="mb-3 text-sm font-semibold text-white uppercase tracking-wider">
                            Goal Analysis - {recipe.goalAnalysis.goal.replace("_", " ")}
                          </h4>
                          <div
                            className={`rounded-lg border p-4 ${
                              recipe.goalAnalysis.suitable
                                ? "border-primary/30 bg-primary/5"
                                : "border-destructive/30 bg-destructive/5"
                            }`}
                          >
                            <p className="text-sm text-card-foreground">
                              {recipe.goalAnalysis.aiComment}
                            </p>
                          </div>
                        </div>
                      )}

                      {recipe.nutrition && (
                        <div className="grid gap-6 lg:grid-cols-2">
                          <div>
                            <h4 className="mb-3 text-sm font-semibold text-card-foreground uppercase tracking-wider">
                              FSSAI Nutrition Label
                            </h4>
                            <NutritionLabel
                              recipeName={recipe.name}
                              servingSize={recipe.servingSize}
                              nutrition={recipe.nutrition}
                              fssaiCompliant={recipe.fssaiCompliant}
                            />
                          </div>

                          {user.role === "user" && (
                            <div>
                              <h4 className="mb-3 text-sm font-semibold text-card-foreground uppercase tracking-wider">
                                Nutrition Charts
                              </h4>
                              <NutritionCharts
                                nutrition={recipe.nutrition}
                                servingSize={recipe.servingSize}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            }}
          />
        )}
      </main>
    </div>
  )
}
