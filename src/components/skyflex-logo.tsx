"use client"

import { motion } from "framer-motion"

interface AmericanHLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function AmericanHLogo({ className = "", size = "md" }: AmericanHLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="americanHGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" /> {/* red-pink */}
            <stop offset="100%" stopColor="#1d4ed8" /> {/* deep blue */}
          </linearGradient>
        </defs>

        {/* Sky element - curved top */}
        <path
          d="M20 40 Q50 20 80 40 L80 60 Q50 40 20 60 Z"
          fill="url(#americanHGradient)"
          className="drop-shadow-sm"
        />

        {/* Flex element - dynamic lines */}
        <motion.path
          d="M25 70 L75 70 M30 75 L70 75 M35 80 L65 80"
          stroke="#1d4ed8"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        {/* Central diamond (can be H-shaped later) */}
        <motion.polygon
          points="50,45 55,50 50,55 45,50"
          fill="#f43f5e"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
        />
      </svg>
    </motion.div>
  )
}
