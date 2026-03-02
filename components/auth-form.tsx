"use client"

import { useState, type FormEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Leaf, Eye, EyeOff, Loader2, Factory, User } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { AnimatedShaderBackground } from "@/components/ui/animated-shader-background"
import { toast } from "sonner"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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

const formVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialRole = searchParams.get("role") || ""
  const initialMode = searchParams.get("mode") || "login"

  const [mode, setMode] = useState<"login" | "register">(
    initialMode === "register" ? "register" : "login"
  )
  const [role, setRole] = useState<"manufacturer" | "user" | "">(
    initialRole === "manufacturer" || initialRole === "user" ? initialRole : ""
  )
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const isRegister = mode === "register"

  const { login, register } = useAuth()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (loading) return

    if (mode === "register" && !role) {
      toast.error("Please select a role")
      return
    }

    setLoading(true)
    try {
      if (mode === "login") {
        const user = await login(email, password)
        toast.success("Welcome back!")
        router.push(user.role === "manufacturer" ? "/dashboard/manufacturer" : "/dashboard/user")
      } else {
        const user = await register(name, email, password, role)
        toast.success("Account created!")
        if (user.role === "user" && !user.profile?.age) {
          router.push("/setup-profile")
        } else {
          router.push(user.role === "manufacturer" ? "/dashboard/manufacturer" : "/dashboard/user")
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-black to-slate-900 px-4 py-4 sm:py-8">
      <AnimatedShaderBackground />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/45 via-slate-950/35 to-black/55" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 w-full max-w-md"
      >
        <motion.div variants={itemVariants}>
          <Link href="/" className={`flex items-center justify-center gap-2 ${isRegister ? "mb-4" : "mb-8"}`}>
            <motion.div
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"
              whileHover={{ rotate: 10, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Leaf className="h-5 w-5" />
            </motion.div>
            <span className="text-xl font-bold text-slate-100 drop-shadow-[0_0_8px_rgba(45,212,191,0.45)]" style={{ fontFamily: "var(--font-heading)" }}>
              NutriAI
            </span>
          </Link>
        </motion.div>

        <motion.div
          className={`relative w-full max-h-[calc(100dvh-1.5rem)] overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-slate-900/85 via-slate-950/80 to-black/80 shadow-[0_30px_80px_-25px_rgba(56,189,248,0.35)] backdrop-blur-xl ${
            isRegister ? "p-4 sm:p-6" : "p-5 sm:p-8"
          }`}
          variants={formVariants}
        >
          <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-emerald-400/15 blur-2xl" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_55%)]" />

          <div className="relative">
          <motion.h1
            className={`text-center font-bold text-slate-100 ${isRegister ? "text-xl sm:text-2xl" : "text-2xl"}`}
            style={{ fontFamily: "var(--font-heading)" }}
            variants={itemVariants}
          >
            {mode === "login" ? "Welcome back" : "Create your account"}
          </motion.h1>

          <motion.p className={`text-center text-sm text-slate-300 ${isRegister ? "mt-1" : "mt-2"}`} variants={itemVariants}>
            {mode === "login"
              ? "Sign in to access your nutrition dashboard"
              : "Start analyzing nutrition with AI"}
          </motion.p>

          <motion.form
            onSubmit={handleSubmit}
            className={`flex flex-col ${isRegister ? "mt-4 gap-3" : "mt-6 gap-4 sm:mt-8 sm:gap-5"}`}
            variants={containerVariants}
          >
            {mode === "register" && (
              <motion.div variants={itemVariants}>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-100">
                    I am a...
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      type="button"
                      onClick={() => setRole("manufacturer")}
                      aria-pressed={role === "manufacturer"}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-2 rounded-lg border p-2.5 text-sm font-medium transition-all ${
                        role === "manufacturer"
                          ? "border-emerald-300/60 bg-emerald-500/20 text-emerald-200"
                          : "border-white/20 bg-white/5 text-slate-300 hover:border-emerald-300/50 hover:bg-emerald-500/10"
                      }`}
                    >
                      <Factory className="h-4 w-4" />
                      Manufacturer
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setRole("user")}
                      aria-pressed={role === "user"}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-2 rounded-lg border p-2.5 text-sm font-medium transition-all ${
                        role === "user"
                          ? "border-cyan-300/60 bg-cyan-500/20 text-cyan-200"
                          : "border-white/20 bg-white/5 text-slate-300 hover:border-cyan-300/50 hover:bg-cyan-500/10"
                      }`}
                    >
                      <User className="h-4 w-4" />
                      Personal User
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {mode === "register" && (
              <motion.div className="flex flex-col gap-1.5" variants={itemVariants}>
                <label htmlFor="name" className="text-sm font-medium text-slate-100">
                  Full Name
                </label>
                <motion.input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  whileFocus={{ scale: 1.02 }}
                  className="h-9 rounded-lg border border-white/20 bg-black/25 px-3 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                />
              </motion.div>
            )}

            <motion.div className="flex flex-col gap-1.5" variants={itemVariants}>
              <label htmlFor="email" className="text-sm font-medium text-slate-100">
                Email
              </label>
              <motion.input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                whileFocus={{ scale: 1.02 }}
                className="h-9 rounded-lg border border-white/20 bg-black/25 px-3 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              />
            </motion.div>

            <motion.div className="flex flex-col gap-1.5" variants={itemVariants}>
              <label htmlFor="password" className="text-sm font-medium text-slate-100">
                Password
              </label>
              <div className="relative">
                <motion.input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  whileFocus={{ scale: 1.02 }}
                  className="h-9 w-full rounded-lg border border-white/20 bg-black/25 px-3 pr-10 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  whileHover={{ scale: 1.1 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </motion.button>
              </div>
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              variants={itemVariants}
              className="flex h-9 items-center justify-center gap-2 rounded-lg border border-cyan-300/30 bg-gradient-to-r from-cyan-600/90 to-emerald-600/90 text-sm font-medium text-white transition-colors hover:from-cyan-500 hover:to-emerald-500 disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "login" ? "Sign in" : "Create account"}
            </motion.button>
          </motion.form>

          <motion.div className="mt-6 text-center text-sm text-slate-300" variants={itemVariants}>
            {mode === "login" ? (
              <>
                {"Don't have an account? "}
                <motion.button
                  type="button"
                  onClick={() => setMode("register")}
                  whileHover={{ scale: 1.05 }}
                  className="font-medium text-cyan-300 hover:text-cyan-200 hover:underline"
                >
                  Sign up
                </motion.button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <motion.button
                  type="button"
                  onClick={() => setMode("login")}
                  whileHover={{ scale: 1.05 }}
                  className="font-medium text-cyan-300 hover:text-cyan-200 hover:underline"
                >
                  Sign in
                </motion.button>
              </>
            )}
          </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
