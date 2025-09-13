"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SkyflexLogo } from "@/components/skyflex-logo";
import { WireframeLoader } from "@/components/wireframe-loader";
import {
  Eye,
  EyeOff,
  Shield,
  Lock,
  User,
  ArrowRight,
  CheckCircle,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// 📦 import from country-state-city
import { Country, State, City } from "country-state-city";

const steps = [
  { id: 1, title: "Personal Information", icon: User },
  { id: 2, title: "Account Details", icon: Lock },
  { id: 3, title: "Verification", icon: Shield },
];

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // location data
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "",
    dateOfBirth: "",
    ssn: "",
    initialDeposit: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    username: "",
    password: "",
    confirmPassword: "",
    pin: "",
    confirmPin: "",
    accountType: "",
    agreeToTerms: false,
    agreeToMarketing: false,
    passport: null as File | null,
    license: null as File | null,
  });

  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // 🔹 Form helpers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file" && files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Country → State → City cascading
  const handleCountryChange = (value: string) => {
    handleSelectChange("country", value);
    const selected = countries.find((c) => c.isoCode === value);
    setStates(State.getStatesOfCountry(value));
    setCities([]);
    setFormData((prev) => ({
      ...prev,
      state: "",
      city: "",
      zipCode: "",
      countryCode: selected ? `+${selected.phonecode}` : "",
    }));
  };

  const handleStateChange = (value: string) => {
    handleSelectChange("state", value);
    setCities(City.getCitiesOfState(formData.country, value));
    setFormData((prev) => ({ ...prev, city: "", zipCode: "" }));
  };

  const handleCityChange = async (value: string) => {
    handleSelectChange("city", value);

    try {
      // 🔹 Fetch real ZIP from Zippopotam API
      const res = await fetch(
        `https://api.zippopotam.us/${formData.country.toLowerCase()}/${value}`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.places?.[0]?.["post code"]) {
          setFormData((prev) => ({
            ...prev,
            zipCode: data.places[0]["post code"],
          }));
          return;
        }
      }
    } catch (error) {
      console.error("ZIP lookup failed:", error);
    }

    // fallback: random zip
    setFormData((prev) => ({
      ...prev,
      zipCode: Math.floor(10000 + Math.random() * 90000).toString(),
    }));
  };

  // 🔹 Navigation
  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };
  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // 🔹 Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    router.push("/dashboard");
  };

  // 🔹 Step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Phone + DOB */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex gap-2">
                  <Input
                    className="w-24"
                    disabled
                    value={formData.countryCode}
                    placeholder="+Code"
                  />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* SSN */}
          <div className="w-full flex gap-8">
              <div className="w-full">
              <Label htmlFor="ssn">Social Security Number</Label>
              <Input
                id="ssn"
                name="ssn"
                value={formData.ssn}
                onChange={handleInputChange}
                placeholder="XXX-XX-XXXX"
                required
                className="w-full"
              />
            </div>
              <div  className="w-full">
              <Label htmlFor="ssn">Initial Deposi</Label>
              <Input
                id="initialDeposit"
                name="initialDeposit"
                value={formData.initialDeposit}
                onChange={handleInputChange}
                placeholder=" Enter your initial deposit"
                required
                 className="w-full"
              />
            </div>
          </div>

            {/* Address */}
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Country / State / City */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Country</Label>
                <Select onValueChange={handleCountryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.isoCode} value={c.isoCode}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>State</Label>
                <Select
                  onValueChange={handleStateChange}
                  disabled={!states.length}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((s) => (
                      <SelectItem key={s.isoCode} value={s.isoCode}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>City</Label>
                <Select
                  onValueChange={handleCityChange}
                  disabled={!cities.length}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((ct, idx) => (
                      <SelectItem key={idx} value={ct.name}>
                        {ct.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ZIP */}
            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                readOnly
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            {/* Account Type */}
            <div>
              <Label htmlFor="accountType">Account Type</Label>
              <Select
                onValueChange={(v) => handleSelectChange("accountType", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="savings">Savings Account</SelectItem>
                  <SelectItem value="current">Current Account</SelectItem>
                  <SelectItem value="checking">Checking Accounts</SelectItem>
                  <SelectItem value="fixed">Fixed Account</SelectItem>
                  <SelectItem value="non-resident">
                    Non Resident Account
                  </SelectItem>
                  <SelectItem value="online">Online Banking</SelectItem>
                  <SelectItem value="Domiciliary">
                    Domiciliary Account
                  </SelectItem>
                  <SelectItem value="joint">Joint Account</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Username */}
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Choose a unique username"
                required
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a strong password"
                  className="pr-12"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full w-12"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className="pr-12"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full w-12"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex gap-8 justify-center">
              {/* PIN */}
              <div className="w-full">
                <Label htmlFor="pin">Pin</Label>
                <div className="relative  w-full">
                  <Input
                    id="pin"
                    name="pin"
                    type={showPassword ? "text" : "password"} // 👈 toggle between masked/unmasked
                    inputMode="numeric" // 👈 show number keypad on mobile
                    pattern="\d{4}" // 👈 ensures only 4 digits
                    minLength={4}
                    maxLength={4}
                    value={formData.pin}
                    onChange={handleInputChange}
                    placeholder="Create your 4-digit PIN"
                    className="pr-12 text-center tracking-widest w-full"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full w-12"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Confirm Pin */}
              <div className="w-full">
                <Label htmlFor="confirmPin">Confirm Pin</Label>
                <div className="relative w-full">
                  <Input
                    id="confirmPin"
                    name="confirmPin"
                    type={showConfirmPassword ? "text" : "password"}
                    inputMode="numeric"
                    pattern="\d{4}"
                    minLength={4}
                    maxLength={4}
                    value={formData.confirmPin} // 👈 match the state name
                    onChange={handleInputChange}
                    placeholder="Confirm your PIN"
                    className="pr-12 text-center tracking-widest w-full"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full w-12"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h3 className="text-xl font-semibold">Final Verification</h3>
              <p className="text-muted-foreground">
                Upload your documents and confirm your details before
                submitting.
              </p>
            </div>

            {/* Upload Passport */}
            <div>
              <Label htmlFor="passport">Upload Passport Photograph</Label>
              <Input
                id="passport"
                name="passport"
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>

            {/* Upload License / ID */}
            <div>
              <Label htmlFor="license">Upload Driver’s License / ID</Label>
              <Input
                id="license"
                name="license"
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>

            {/* Agreements */}
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      agreeToTerms: checked as boolean,
                    }))
                  }
                  required
                />
                <Label
                  htmlFor="agreeToTerms"
                  className="text-sm leading-relaxed"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-secondary hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-secondary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToMarketing"
                  name="agreeToMarketing"
                  checked={formData.agreeToMarketing}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      agreeToMarketing: checked as boolean,
                    }))
                  }
                />
                <Label
                  htmlFor="agreeToMarketing"
                  className="text-sm leading-relaxed"
                >
                  I would like to receive marketing communications about
                  American Digit Bank products
                </Label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <WireframeLoader isLoading={isLoading}>
      <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white mb-8"
          >
            <div className="flex items-center justify-center space-x-4 mb-4">
              <SkyflexLogo size="md" />
              <h1 className="text-3xl font-bold">American Digit Bank</h1>
            </div>
            <h2 className="text-2xl font-bold mb-2">Open Your Account</h2>
            <p className="text-white/90">
              Join thousands of satisfied customers
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="flex items-center space-x-4 w-full justify-center overflow-x-auto text-nowrap">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      currentStep >= step.id
                        ? "bg-white text-primary border-white"
                        : "bg-transparent text-white border-white/50"
                    }`}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      currentStep >= step.id ? "text-white" : "text-white/50"
                    }`}
                  >
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 h-0.5 mx-4 ${
                        currentStep > step.id ? "bg-white" : "bg-white/30"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="w-full max-w-2xl mx-auto shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-bold">
                  Step {currentStep} of 3
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={currentStep === 3 ? handleSubmit : undefined}>
                  {renderStepContent()}

                  {/* Step navigation */}
                  <div className="flex justify-between pt-6">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                      >
                        Previous
                      </Button>
                    )}
                    <div className="ml-auto">
                      {currentStep < 3 ? (
                        <Button
                          type="button"
                          onClick={handleNext}
                          className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                        >
                          Next <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                          disabled={!formData.agreeToTerms || isSubmitting}
                        >
                          {isSubmitting ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "linear",
                              }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                          ) : (
                            <>
                              Create Account{" "}
                              <ArrowRight className="ml-2 w-4 h-4" />
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-secondary hover:underline"
                  >
                    Sign in here
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </WireframeLoader>
  );
}
