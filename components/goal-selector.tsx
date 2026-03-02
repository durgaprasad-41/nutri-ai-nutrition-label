"use client"

import { Dumbbell, TrendingDown, TrendingUp, Heart } from "lucide-react"

const goals = [
  {
    value: "gym" as const,
    label: "Gym / Fitness",
    description: "High protein, moderate carbs",
    icon: Dumbbell,
  },
  {
    value: "weight_loss" as const,
    label: "Weight Loss",
    description: "Low calorie, high fiber",
    icon: TrendingDown,
  },
  {
    value: "weight_gain" as const,
    label: "Weight Gain",
    description: "High calorie, high carb + protein",
    icon: TrendingUp,
  },
  {
    value: "normal" as const,
    label: "Normal Health",
    description: "Balanced macros",
    icon: Heart,
  },
]

interface GoalSelectorProps {
  selected: string
  onSelect: (goal: "gym" | "weight_loss" | "weight_gain" | "normal") => void
}

export function GoalSelector({ selected, onSelect }: GoalSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {goals.map((goal) => {
        const isActive = selected === goal.value
        return (
          <button
            key={goal.value}
            onClick={() => onSelect(goal.value)}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 backdrop-blur-md transition-all ${
              isActive
                ? "border-white/35 bg-white/20 text-white shadow-sm"
                : "border-white/20 bg-white/10 text-slate-100 hover:border-white/35 hover:bg-white/15"
            }`}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                isActive ? "bg-white/30 text-white" : "bg-white/15 text-slate-200"
              }`}
            >
              <goal.icon className="h-5 w-5" />
            </div>
            <span
              className={`text-sm font-medium ${
                isActive ? "text-white" : "text-slate-100"
              }`}
            >
              {goal.label}
            </span>
            <span className="text-xs text-slate-300 text-center">
              {goal.description}
            </span>
          </button>
        )
      })}
    </div>
  )
}
