"use client"

import { useEffect, useMemo, useState, type SyntheticEvent } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { CalendarDays, ClipboardList, Loader2, Search, RotateCcw } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useAuth } from "@/hooks/use-auth"
import { DashboardHeader } from "@/components/dashboard-header"
import { GoalSelector } from "@/components/goal-selector"
import AnimatedList from "@/components/ui/animated-list"
import { goalRecipeRecommendations, type GoalType, type RecommendedRecipe } from "@/lib/recommendations"

interface HistoryRecipe {
  ingredients?: { name: string; quantity: number; unit: string }[]
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim()
}

function tokenize(value: string) {
  return normalizeText(value)
    .split(" ")
    .filter((token) => token.length > 2)
}

function normalizeTokenForMatch(token: string) {
  if (token.endsWith("ies") && token.length > 3) return `${token.slice(0, -3)}y`
  if (token.endsWith("es") && token.length > 3) return token.slice(0, -2)
  if (token.endsWith("s") && token.length > 3) return token.slice(0, -1)
  return token
}

function parseIngredientInput(value: string) {
  return value
    .split(/[,\n]/)
    .map((item) => normalizeText(item))
    .filter(Boolean)
}

function ingredientMatchesPreference(recipeIngredientName: string, likedIngredient: string) {
  const normalizedRecipeIngredient = normalizeText(recipeIngredientName)
  if (!normalizedRecipeIngredient) return false
  if (normalizedRecipeIngredient.includes(likedIngredient) || likedIngredient.includes(normalizedRecipeIngredient)) {
    return true
  }

  const recipeTokens = tokenize(recipeIngredientName).map(normalizeTokenForMatch)
  const likedTokens = tokenize(likedIngredient).map(normalizeTokenForMatch)
  if (!likedTokens.length) return false

  // Require all tokens from the user-entered ingredient to be present.
  return likedTokens.every((token) => recipeTokens.includes(token))
}

function recipeMatchScore(recipe: RecommendedRecipe, historyIngredients: string[]) {
  if (!historyIngredients.length) return 0

  let score = 0
  for (const historyIngredient of historyIngredients) {
    const historyTokens = tokenize(historyIngredient)
    const matched = recipe.ingredients.some((recipeIngredient) => {
      const recipeNormalized = normalizeText(recipeIngredient.name)
      if (recipeNormalized.includes(historyIngredient) || historyIngredient.includes(recipeNormalized)) {
        return true
      }
      const recipeTokens = tokenize(recipeIngredient.name)
      return historyTokens.some((token) => recipeTokens.includes(token))
    })
    if (matched) score += 1
  }
  return score
}

function hashString(value: string) {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function randomizeWithSeed<T>(items: T[], seed: number) {
  const arr = [...items]
  let localSeed = seed || 1
  for (let i = arr.length - 1; i > 0; i -= 1) {
    localSeed = (localSeed * 1664525 + 1013904223) % 4294967296
    const j = localSeed % (i + 1)
    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
  return arr
}

function toTitleCase(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function inferIngredientUnit(ingredient: string) {
  if (ingredient.includes("egg")) return "pcs"
  if (ingredient.includes("milk") || ingredient.includes("oil") || ingredient.includes("juice")) return "ml"
  return "g"
}

function inferIngredientQuantity(ingredient: string) {
  if (ingredient.includes("egg")) return 2
  if (ingredient.includes("milk") || ingredient.includes("oil") || ingredient.includes("juice")) return 80
  return 60
}

function buildCustomRecipe(goal: GoalType, likedIngredients: string[]): RecommendedRecipe {
  const uniqueIngredients = Array.from(new Set(likedIngredients.map((ingredient) => normalizeText(ingredient)))).filter(Boolean)
  const customIngredients = uniqueIngredients.map((ingredient) => ({
    name: ingredient,
    quantity: inferIngredientQuantity(ingredient),
    unit: inferIngredientUnit(ingredient),
  }))

  const goalBoosters: Record<GoalType, { name: string; quantity: number; unit: string }> = {
    gym: { name: "greek yogurt", quantity: 80, unit: "g" },
    weight_loss: { name: "lemon juice", quantity: 15, unit: "ml" },
    weight_gain: { name: "peanut butter", quantity: 20, unit: "g" },
    normal: { name: "olive oil", quantity: 10, unit: "ml" },
  }

  const booster = goalBoosters[goal]
  const hasBoosterAlready = customIngredients.some((ingredient) =>
    ingredientMatchesPreference(ingredient.name, booster.name)
  )

  const nutritionByGoal: Record<GoalType, RecommendedRecipe["nutrition"]> = {
    gym: {
      calories: 320,
      protein: 28,
      fat: 11,
      saturatedFat: 3,
      carbohydrates: 24,
      sugar: 4,
      sodium: 220,
      fiber: 4,
    },
    weight_loss: {
      calories: 190,
      protein: 16,
      fat: 7,
      saturatedFat: 1.8,
      carbohydrates: 16,
      sugar: 4,
      sodium: 170,
      fiber: 5,
    },
    weight_gain: {
      calories: 430,
      protein: 18,
      fat: 17,
      saturatedFat: 5,
      carbohydrates: 49,
      sugar: 9,
      sodium: 210,
      fiber: 4,
    },
    normal: {
      calories: 280,
      protein: 14,
      fat: 10,
      saturatedFat: 3,
      carbohydrates: 30,
      sugar: 5,
      sodium: 190,
      fiber: 4,
    },
  }

  const goalLabel: Record<GoalType, string> = {
    gym: "Gym",
    weight_loss: "Weight Loss",
    weight_gain: "Weight Gain",
    normal: "Balanced",
  }

  const recipeNameSeed = uniqueIngredients.slice(0, 2).map(toTitleCase).join(" & ")
  const recipeName = recipeNameSeed ? `${recipeNameSeed} ${goalLabel[goal]} Mix` : `${goalLabel[goal]} Custom Mix`

  return {
    id: `custom-${goal}-${hashString(uniqueIngredients.join("|"))}`,
    name: recipeName,
    imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
    fallbackImageUrl: "/placeholder.jpg",
    goal,
    shelfLifeDays: 1,
    ingredients: hasBoosterAlready ? customIngredients : [...customIngredients, booster],
    nutrition: nutritionByGoal[goal],
  }
}

function handleRecipeImageError(event: SyntheticEvent<HTMLImageElement, Event>) {
  const img = event.currentTarget
  const fallbackSrc = img.dataset.fallbackSrc

  if (fallbackSrc && img.src !== fallbackSrc) {
    img.src = fallbackSrc
    return
  }

  img.onerror = null
  img.src = "/placeholder.jpg"
}

export default function RecommendationsPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  const [selectedGoal, setSelectedGoal] = useState<GoalType | "">("")
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null)
  const [historyIngredients, setHistoryIngredients] = useState<string[]>([])
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const [historyFetchFailed, setHistoryFetchFailed] = useState(false)
  const [likedIngredientInput, setLikedIngredientInput] = useState("")
  const [likedIngredients, setLikedIngredients] = useState<string[]>([])
  const [searchApplied, setSearchApplied] = useState(false)
  const userId = user?.id ?? null

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/auth")
    }
  }, [isLoading, user, router])

  useEffect(() => {
    if (!userId) return

    let active = true
    const loadHistoryIngredients = async () => {
      setHistoryLoaded(false)
      setHistoryFetchFailed(false)
      try {
        const res = await fetch("/api/recipe")
        if (!res.ok) throw new Error("Failed to load history")
        const data = (await res.json()) as { recipes?: HistoryRecipe[] }
        const recipes = Array.isArray(data.recipes) ? data.recipes : []

        const seen = new Set<string>()
        const extracted: string[] = []
        for (const recipe of recipes) {
          for (const ingredient of recipe.ingredients || []) {
            const normalized = normalizeText(ingredient.name)
            if (normalized && !seen.has(normalized)) {
              seen.add(normalized)
              extracted.push(normalized)
            }
          }
        }

        if (active) {
          setHistoryIngredients(extracted)
        }
      } catch {
        if (active) {
          setHistoryIngredients([])
          setHistoryFetchFailed(true)
        }
      } finally {
        if (active) {
          setHistoryLoaded(true)
          setSelectedGoal("")
          setSelectedRecipeId(null)
          setLikedIngredientInput("")
          setLikedIngredients([])
          setSearchApplied(false)
        }
      }
    }

    void loadHistoryIngredients()

    return () => {
      active = false
    }
  }, [userId])

  const goalRecipes = useMemo(() => {
    if (!selectedGoal) return []
    const recipesForGoal = goalRecipeRecommendations[selectedGoal] || []

    if (!historyIngredients.length) {
      return randomizeWithSeed(recipesForGoal, hashString(`${selectedGoal}:history-empty`))
    }

    const scored = recipesForGoal
      .map((recipe) => ({ recipe, score: recipeMatchScore(recipe, historyIngredients) }))
      .sort((a, b) => b.score - a.score)

    const hasHistoryMatch = scored.some((item) => item.score > 0)
    if (hasHistoryMatch) {
      return scored.map((item) => item.recipe)
    }

    return randomizeWithSeed(recipesForGoal, hashString(`${selectedGoal}:${historyIngredients.join("|")}`))
  }, [selectedGoal, historyIngredients])

  const recipes = useMemo(() => {
    if (!searchApplied || !likedIngredients.length) return goalRecipes

    const matchingRecipes = goalRecipes.filter((recipe) =>
      likedIngredients.every((likedIngredient) => {
        return recipe.ingredients.some((ingredient) => {
          return ingredientMatchesPreference(ingredient.name, likedIngredient)
        })
      })
    )

    if (matchingRecipes.length > 0) return matchingRecipes
    if (!selectedGoal) return []
    return [buildCustomRecipe(selectedGoal, likedIngredients)]
  }, [goalRecipes, likedIngredients, searchApplied, selectedGoal])

  const noHistoryMatchForGoal = useMemo(() => {
    if (!selectedGoal || !historyIngredients.length) return false
    const recipesForGoal = goalRecipeRecommendations[selectedGoal] || []
    return recipesForGoal.every((recipe) => recipeMatchScore(recipe, historyIngredients) === 0)
  }, [selectedGoal, historyIngredients])

  useEffect(() => {
    if (!selectedRecipeId) return
    if (!recipes.some((recipe) => recipe.id === selectedRecipeId)) {
      setSelectedRecipeId(null)
    }
  }, [recipes, selectedRecipeId])

  const selectedRecipe: RecommendedRecipe | null = useMemo(
    () => recipes.find((recipe) => recipe.id === selectedRecipeId) || null,
    [recipes, selectedRecipeId]
  )

  const manufactureDate = useMemo(() => new Date(), [])
  const expiryDate = useMemo(() => {
    if (!selectedRecipe) return null
    const d = new Date(manufactureDate)
    d.setDate(d.getDate() + selectedRecipe.shelfLifeDays)
    return d
  }, [manufactureDate, selectedRecipe])

  const pieData = useMemo(() => {
    if (!selectedRecipe) return []
    const proteinCal = selectedRecipe.nutrition.protein * 4
    const fatCal = selectedRecipe.nutrition.fat * 9
    const carbsCal = selectedRecipe.nutrition.carbohydrates * 4
    const total = proteinCal + fatCal + carbsCal
    if (!total) return []

    return [
      { name: "Carbs", value: Math.round((carbsCal / total) * 100), color: "#f97316" },
      { name: "Fat", value: Math.round((fatCal / total) * 100), color: "#06b6d4" },
      { name: "Protein", value: Math.round((proteinCal / total) * 100), color: "#10b981" },
    ]
  }, [selectedRecipe])

  const hasCustomGeneratedRecipe = searchApplied && recipes.some((recipe) => recipe.id.startsWith("custom-"))

  if (isLoading || !historyLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-slate-800">
      <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-slate-300/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-zinc-200/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-gray-300/10 blur-3xl" />
      <DashboardHeader />
      <main className="relative z-10 mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-100" style={{ fontFamily: "var(--font-heading)" }}>
            Recommendations
          </h1>
          <p className="mt-1 text-slate-300">
            Choose your goal to get recipe names based on your history ingredients. If no match is found, random goal recipes are shown.
          </p>
        </div>

        <div className="mb-8 rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
          <h2 className="mb-4 text-lg font-semibold text-slate-100" style={{ fontFamily: "var(--font-heading)" }}>
            Choose Your Goal
          </h2>
          <GoalSelector
            selected={selectedGoal}
            onSelect={(goal) => {
              setSelectedGoal(goal)
              setSelectedRecipeId(null)
              setSearchApplied(false)
              setLikedIngredientInput("")
              setLikedIngredients([])
            }}
          />
          {historyIngredients.length > 0 && (
            <p className="mt-3 text-sm text-slate-300">
              Using {historyIngredients.length} unique ingredient(s) from your recipe history.
            </p>
          )}
          {historyIngredients.length === 0 && (
            <p className="mt-3 text-sm text-slate-300">
              No history ingredients found. Random recommendations will be used for selected goals.
            </p>
          )}
          {historyFetchFailed && (
            <p className="mt-2 text-xs text-amber-200">Could not load history right now. Showing random recommendations.</p>
          )}

          <div className="mt-5 rounded-lg border border-white/20 bg-black/20 p-4">
            <h3 className="text-sm font-semibold text-slate-100">Find recipes by ingredients you like</h3>
            <p className="mt-1 text-xs text-slate-300">Enter comma-separated ingredients. Example: chicken, quinoa, broccoli</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={likedIngredientInput}
                onChange={(event) => setLikedIngredientInput(event.target.value)}
                placeholder="Enter ingredients you like"
                className="h-10 flex-1 rounded-lg border border-white/25 bg-black/25 px-3 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/45"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={!selectedGoal || !likedIngredientInput.trim()}
                  onClick={() => {
                    const parsed = parseIngredientInput(likedIngredientInput)
                    setLikedIngredients(parsed)
                    setSearchApplied(true)
                    setSelectedRecipeId(null)
                  }}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 text-sm font-medium text-slate-100 transition-colors hover:border-white/35 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Search className="h-4 w-4" />
                  Get Recipes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLikedIngredientInput("")
                    setLikedIngredients([])
                    setSearchApplied(false)
                    setSelectedRecipeId(null)
                  }}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 text-sm font-medium text-slate-100 transition-colors hover:border-white/35 hover:bg-white/15"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <section className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
            <h2 className="mb-4 text-lg font-semibold text-slate-100" style={{ fontFamily: "var(--font-heading)" }}>
              Recipe Names
            </h2>
            {noHistoryMatchForGoal && (
              <p className="mb-3 rounded-lg border border-amber-300/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
                No close history match for this goal. Showing random goal-based recipes.
              </p>
            )}
            {!selectedGoal && (
              <p className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-300">
                Select a goal to load recipe names and pictures.
              </p>
            )}
            {selectedGoal && recipes.length === 0 && (
              <p className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-300">
                No recipes found for this goal.
              </p>
            )}
            {hasCustomGeneratedRecipe && (
              <p className="mt-3 rounded-lg border border-cyan-300/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100">
                No exact recipe found for this goal. Showing a custom recipe built from your ingredients.
              </p>
            )}
            {selectedGoal && recipes.length > 0 && (
              <AnimatedList
                key={`${selectedGoal}-${historyIngredients.length}-${searchApplied}-${likedIngredients.join("|")}`}
                items={recipes}
                onItemSelect={(recipe) => setSelectedRecipeId(recipe.id)}
                showGradients
                enableArrowNavigation
                displayScrollbar
                className="w-full"
                itemClassName="border-white/20 bg-white/10 hover:border-white/35"
                renderItem={(recipe, _index, selected) => (
                  <div
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                      selected ? "text-cyan-200" : "text-slate-100"
                    }`}
                  >
                    <Image
                      src={recipe.imageUrl}
                      alt={recipe.name}
                      width={80}
                      height={56}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      data-fallback-src={recipe.fallbackImageUrl}
                      onError={handleRecipeImageError}
                      className="h-14 w-20 rounded-md object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{recipe.name}</p>
                      <p className="text-xs text-slate-300">{recipe.goal.replace("_", " ")}</p>
                    </div>
                  </div>
                )}
              />
            )}
          </section>

          <section className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
            <h2 className="mb-4 text-lg font-semibold text-slate-100" style={{ fontFamily: "var(--font-heading)" }}>
              Recipe Report
            </h2>

            {!selectedRecipe && (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-300">
                <ClipboardList className="h-9 w-9 text-slate-400/70" />
                <p className="text-sm">{!selectedGoal ? "Select a goal to load recipe names." : "Select a recipe name to view the report."}</p>
              </div>
            )}

            {selectedRecipe && (
              <div className="space-y-6">
                <div>
                  <Image
                    src={selectedRecipe.imageUrl}
                    alt={selectedRecipe.name}
                    width={1200}
                    height={480}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    data-fallback-src={selectedRecipe.fallbackImageUrl}
                    onError={handleRecipeImageError}
                    className="mb-3 h-48 w-full rounded-lg border border-border object-cover"
                  />
                  <h3 className="text-base font-semibold text-slate-100">{selectedRecipe.name}</h3>
                  <p className="text-xs text-slate-300">Goal: {selectedRecipe.goal.replace("_", " ")}</p>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-semibold text-slate-100">Ingredients</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecipe.ingredients.map((ingredient) => (
                      <span
                        key={`${selectedRecipe.id}-${ingredient.name}`}
                        className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-slate-100"
                      >
                        {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-semibold text-slate-100">Nutrients (per 100g)</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-slate-100">
                    <div className="rounded-lg border border-white/20 bg-white/10 px-3 py-2">
                      Calories: {selectedRecipe.nutrition.calories} kcal
                    </div>
                    <div className="rounded-lg border border-white/20 bg-white/10 px-3 py-2">
                      Protein: {selectedRecipe.nutrition.protein} g
                    </div>
                    <div className="rounded-lg border border-white/20 bg-white/10 px-3 py-2">
                      Fat: {selectedRecipe.nutrition.fat} g
                    </div>
                    <div className="rounded-lg border border-white/20 bg-white/10 px-3 py-2">
                      Saturated Fat: {selectedRecipe.nutrition.saturatedFat} g
                    </div>
                    <div className="rounded-lg border border-white/20 bg-white/10 px-3 py-2">
                      Carbohydrates: {selectedRecipe.nutrition.carbohydrates} g
                    </div>
                    <div className="rounded-lg border border-white/20 bg-white/10 px-3 py-2">
                      Sugar: {selectedRecipe.nutrition.sugar} g
                    </div>
                    <div className="rounded-lg border border-white/20 bg-white/10 px-3 py-2">
                      Sodium: {selectedRecipe.nutrition.sodium} mg
                    </div>
                    <div className="rounded-lg border border-white/20 bg-white/10 px-3 py-2">
                      Fiber: {selectedRecipe.nutrition.fiber} g
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-semibold text-slate-100">Pie Chart Analysis</h4>
                  <div className="rounded-lg border border-white/20 bg-white/10 p-3">
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={92}
                            label={({ name, value }) => `${name} ${value}%`}
                          >
                            {pieData.map((entry) => (
                              <Cell key={entry.name} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => `${value}%`} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-white/20 bg-white/10 p-4">
                  <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-100">
                    <CalendarDays className="h-4 w-4" />
                    Dates
                  </div>
                  <p className="text-sm text-slate-100">Manufacture Date: {formatDate(manufactureDate)}</p>
                  <p className="text-sm text-slate-100">Expiry Date: {expiryDate ? formatDate(expiryDate) : "-"}</p>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
