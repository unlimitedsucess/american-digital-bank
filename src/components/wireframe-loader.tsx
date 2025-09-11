"use client"

import type React from "react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface WireframeLoaderProps {
  isLoading: boolean
  children: React.ReactNode
}

export function WireframeLoader({ isLoading, children }: WireframeLoaderProps) {
  const [showContent, setShowContent] = useState(!isLoading)

  useEffect(() => {
    if (!isLoading) {
      // ⚡ Show content immediately
      setShowContent(true)
    } else {
      setShowContent(false)
    }
  }, [isLoading])

  if (isLoading || !showContent) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header wireframe */}
        <div className="border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <motion.div
                className="w-32 h-8 bg-muted rounded"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              />
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    className="w-16 h-6 bg-muted rounded"
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hero wireframe */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <motion.div
              className="w-3/4 h-12 bg-muted rounded mx-auto"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: 0.2,
              }}
            />
            <motion.div
              className="w-1/2 h-6 bg-muted rounded mx-auto"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: 0.4,
              }}
            />
            <motion.div
              className="w-32 h-10 bg-muted rounded mx-auto"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: 0.6,
              }}
            />
          </div>
        </div>

        {/* Content wireframe */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="space-y-4"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                }}
              >
                <div className="w-full h-48 bg-muted rounded" />
                <div className="w-3/4 h-6 bg-muted rounded" />
                <div className="w-full h-4 bg-muted rounded" />
                <div className="w-1/2 h-4 bg-muted rounded" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
