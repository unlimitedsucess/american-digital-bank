"use client"

import type React from "react"

import { WireframeLoader } from "@/components/wireframe-loader"
import { useState, useEffect } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  return <WireframeLoader isLoading={isLoading}>{children}</WireframeLoader>
}
