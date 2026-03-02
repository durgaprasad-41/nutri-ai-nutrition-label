"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Leaf, LogOut, History, LayoutDashboard, Lightbulb } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"

const navItemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
    },
  }),
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
}

const logoVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4 },
  },
  hover: {
    scale: 1.1,
    transition: { duration: 0.2 },
  },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

export function DashboardHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const dashboardPath = user?.role === "manufacturer"
    ? "/dashboard/manufacturer"
    : "/dashboard/user"

  const navItems = [
    { href: dashboardPath, label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/history", label: "History", icon: History },
    { href: "/dashboard/recommendations", label: "Recommendations", icon: Lightbulb },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/35 backdrop-blur-xl supports-[backdrop-filter]:bg-black/25">
      <motion.nav
        className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={logoVariants} whileHover="hover">
          <Link href={dashboardPath} className="flex items-center gap-2">
            <motion.div
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
              whileHover={{ rotate: 10 }}
              whileTap={{ scale: 0.95 }}
            >
              <Leaf className="h-4 w-4" />
            </motion.div>
            <span className="text-lg font-bold text-slate-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]" style={{ fontFamily: "var(--font-heading)" }}>
              NutriAI
            </span>
          </Link>
        </motion.div>

        <motion.div className="flex items-center gap-1" variants={containerVariants}>
          {navItems.map((item, i) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            return (
              <motion.div key={item.href} custom={i} variants={navItemVariants} whileHover="hover">
                <Link href={item.href} className="group relative block overflow-hidden rounded-xl">
                  {isActive && (
                    <motion.span
                      layoutId="active-dashboard-nav"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/25 to-slate-200/20 ring-1 ring-white/35"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/10 via-slate-200/20 to-white/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  />
                  <motion.span
                    className={`relative flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-colors ${
                      isActive
                        ? "border-white/35 bg-white/20 text-white"
                        : "border-white/15 bg-white/5 text-slate-200 group-hover:border-white/30 group-hover:bg-white/15 group-hover:text-white"
                    }`}
                    whileHover={{ y: -1 }}
                    whileTap={{ y: 0, scale: 0.98 }}
                  >
                    <motion.span whileHover={{ rotate: 8, scale: 1.08 }}>
                      <Icon className="h-4 w-4" />
                    </motion.span>
                    <span className="hidden sm:inline">{item.label}</span>
                  </motion.span>
                </Link>
              </motion.div>
            )
          })}

          <motion.div
            className="ml-2 flex items-center gap-3 border-l border-border pl-3"
            custom={3}
            variants={navItemVariants}
          >
            <motion.span className="text-sm text-slate-200">
              {user?.name}
            </motion.span>
            <motion.button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-2 py-1.5 text-sm text-slate-200 transition-colors hover:border-red-300/40 hover:bg-red-500/15 hover:text-red-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.nav>
    </header>
  )
}
