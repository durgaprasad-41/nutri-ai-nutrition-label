"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const gradients = [
  "linear-gradient(135deg, rgba(34,197,94,0.3), rgba(16,185,129,0.2))",
  "linear-gradient(135deg, rgba(59,130,246,0.3), rgba(6,182,212,0.2))",
  "linear-gradient(135deg, rgba(245,158,11,0.3), rgba(249,115,22,0.2))",
]

const particleData = [
  { id: 1, left: "10%", top: "20%", duration: 6, delay: 0 },
  { id: 2, left: "25%", top: "60%", duration: 7, delay: 0.3 },
  { id: 3, left: "40%", top: "35%", duration: 5, delay: 0.6 },
  { id: 4, left: "55%", top: "75%", duration: 8, delay: 0.9 },
  { id: 5, left: "70%", top: "45%", duration: 6, delay: 1.2 },
  { id: 6, left: "85%", top: "30%", duration: 7, delay: 1.5 },
]

export function AnimatedBackground() {
  const [activeColor, setActiveColor] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveColor((prev) => (prev + 1) % gradients.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-950">

      {/* Primary Blob */}
      <motion.div
        className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full blur-3xl opacity-60"
        style={{ background: gradients[activeColor] }}
        animate={{
          x: [0, 100, -50, 0],
          y: [0, 50, -100, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />

      {/* Secondary Blob */}
      <motion.div
        className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full blur-3xl opacity-50"
        style={{ background: gradients[activeColor] }}
        animate={{
          x: [0, -80, 60, 0],
          y: [0, -60, 80, 0],
          scale: [0.8, 1.1, 0.9, 0.8],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />

      {/* Center Glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 h-72 w-72 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "linear-gradient(135deg, rgba(16,185,129,0.2), transparent)",
        }}
        animate={{
          scale: [1, 1.3, 0.8, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />

      {/* Floating Particles */}
      {particleData.map((p) => (
        <motion.div
          key={p.id}
          className="absolute h-1 w-1 rounded-full bg-white"
          style={{ left: p.left, top: p.top }}
          animate={{
            y: [0, -200, 0],
            opacity: [0, 1, 0],
            scale: [0, 1.8, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  )
}