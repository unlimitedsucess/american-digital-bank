"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AmericanHLogo } from "@/components/skyflex-logo"
import { WireframeLoader } from "@/components/wireframe-loader"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate password reset request
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  return (
    <WireframeLoader isLoading={isLoading}>
      <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white mb-8"
          >
            <div className="flex items-center justify-center space-x-4 mb-4">
              <AmericanHLogo size="md" />
              <h1 className="text-3xl font-bold">American Horizon</h1>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">
                  {isSubmitted ? "Check Your Email" : "Reset Password"}
                </CardTitle>
                <p className="text-muted-foreground">
                  {isSubmitted
                    ? "We've sent password reset instructions to your email"
                    : "Enter your email address and we'll send you a link to reset your password"}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {isSubmitted ? (
                  <div className="text-center space-y-6">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        We've sent a password reset link to <strong>{email}</strong>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Please check your email and follow the instructions to reset your password.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild>
                        <Link href="/login">Back to Sign In</Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => {
                          setIsSubmitted(false)
                          setEmail("")
                        }}
                      >
                        Try Different Email
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          required
                          className="pl-10 h-12"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </form>
                )}

                {!isSubmitted && (
                  <div className="text-center">
                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground" asChild>
                      <Link href="/login">
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back to Sign In
                      </Link>
                    </Button>
                  </div>
                )}

                <div className="text-center text-xs text-muted-foreground">
                  <p>
                    Need help?{" "}
                    <Link href="/contact" className="text-secondary hover:underline">
                      Contact Support
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </WireframeLoader>
  )
}
