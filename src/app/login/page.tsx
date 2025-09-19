"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { SkyflexLogo } from "@/components/skyflex-logo"
import { WireframeLoader } from "@/components/wireframe-loader"
import { Eye, EyeOff, Shield, Lock, User, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LoginParams } from "@/types/global"
import { useDispatch } from "react-redux"
import { useHttp } from "@/hooks/use-http"
import { toast } from "sonner"
import { tokenActions } from "@/store/token/token-slice"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
 

  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

 const [formData, setFormData] = useState<LoginParams>({
    email: "",
    password: "",
    rememberMe: false,
  });

 

  const dispatch = useDispatch();

  const { loading, sendHttpRequest: loginRequest } = useHttp();

  const loginSuccess = (res: any) => {
    // backend sends { access: "..." }
    const accessToken = res?.data?.data?.token;
    console.log("Full response:", res);
    console.log("Access token:", accessToken);

    if (!accessToken) {
      toast.error("Login failed: No token received.");
      return;
    }

   
    dispatch(tokenActions.setToken(accessToken));

  
    router.push("/dashboard");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields!");
      return;
    }
    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid email address!");
      return;
    }

    // Login request
    loginRequest({
      requestConfig: {
        url: "/auth/signin",
        method: "POST",
        body: {
          email: formData.email,
          password: formData.password,
        },
        userType: "customer", 
        successMessage: "Login successful!",
      },
      successRes: loginSuccess,
    });
  };

  const isFormValid = formData.email !== "" && formData.password !== "";



  return (
    <WireframeLoader isLoading={isLoading}>
      <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white space-y-8 text-center lg:text-left"
          >
            <div className="flex items-center justify-center lg:justify-start space-x-4">
              <SkyflexLogo size="lg" className="text-white" />
              <h1 className="text-4xl font-bold">American Digit Bank</h1>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Welcome Back</h2>
              <p className="text-xl text-white/90">
                Access your account securely and manage your finances with confidence
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <Shield className="w-8 h-8 mx-auto" />
                <p className="text-sm">Bank-Level Security</p>
              </div>
              <div className="space-y-2">
                <Lock className="w-8 h-8 mx-auto" />
                <p className="text-sm">Encrypted Transactions</p>
              </div>
              <div className="space-y-2">
                <User className="w-8 h-8 mx-auto" />
                <p className="text-sm">24/7 Support</p>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="w-full max-w-md mx-auto shadow-2xl">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                <p className="text-muted-foreground">Enter your credentials to access your account</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="text"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your username or email"
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        required
                        className="h-12 pr-12"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-12 w-12"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rememberMe"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({ ...prev, rememberMe: checked as boolean }))
                        }
                      />
                      <Label htmlFor="rememberMe" className="text-sm">
                        Remember me
                      </Label>
                    </div>
                    <Link href="/forgot-password" className="text-sm text-secondary hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    disabled={ loading || isFormValid}
                  >
                    {loading? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        Sign In {loading? <LoadingSpinner/>:<ArrowRight className="ml-2 w-4 h-4" />}
                      </>
                    )}
                  </Button>
                </form>

                <div className="text-center space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-card px-4 text-muted-foreground">New to American Digit Bank?</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full h-12 bg-transparent" asChild>
                    <Link href="/register">Create Account</Link>
                  </Button>
                </div>

                <div className="text-center text-xs text-muted-foreground">
                  <p>
                    By signing in, you agree to our{" "}
                    <Link href="/terms" className="text-secondary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-secondary hover:underline">
                      Privacy Policy
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
