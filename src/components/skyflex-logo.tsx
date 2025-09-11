"use client"

import { motion } from "framer-motion"

interface SkyflexLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function SkyflexLogo({ className = "", size = "md" }: SkyflexLogoProps) {
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
          <linearGradient id="skyflexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>

        {/* Sky element - curved top */}
        <path d="M20 40 Q50 20 80 40 L80 60 Q50 40 20 60 Z" fill="url(#skyflexGradient)" className="drop-shadow-sm" />

        {/* Flex element - dynamic lines */}
        <motion.path
          d="M25 70 L75 70 M30 75 L70 75 M35 80 L65 80"
          stroke="#2563eb"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        />

        {/* Central diamond */}
        <motion.polygon
          points="50,45 55,50 50,55 45,50"
          fill="#fbbf24"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
        />
      </svg>
    </motion.div>
  )
}
