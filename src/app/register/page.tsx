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
import { AmericanHLogo } from "@/components/skyflex-logo";
import { WireframeLoader } from "@/components/wireframe-loader";
import {
  Eye,
  EyeOff,
  Shield,
  Lock,
  User,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Country, State, City } from "country-state-city";
import { useHttp } from "@/hooks/use-http";
import { toast } from "sonner";

// OTP modal
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const steps = [
  { id: 1, title: "Personal Information", icon: User },
  { id: 2, title: "Account Details", icon: Lock },
  { id: 3, title: "Verification", icon: Shield },
];

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");

  // email verification state
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");

  // location data
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const checkPasswordStrength = (password: string) => {
    return {
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasMinLength: password.length >= 8,
    };
  };
  const [passwordChecks, setPasswordChecks] = useState({
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasMinLength: false,
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    phoneCode: "",
    dob: "",
    ssn: "",
    initialDeposit: "",
    country: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",

    userName: "",
    password: "",
    confirmPassword: "",
    pin: "",
    confirmPin: "",
    accountType: "",
    agreeToTerms: false,
    agreeToMarketing: false,
    passport: null as File | null,
    driversLicence: null as File | null,
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  const { loading, sendHttpRequest: registerUserReq } = useHttp();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // check query param after clicking verification link
  useEffect(() => {
    const verified = searchParams.get("verified");
    if (verified === "true" && !isEmailVerified) {
      // show OTP modal
      setShowOtpModal(true);
    }
  }, [searchParams, isEmailVerified]);

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
    if (name === "password") {
      const newChecks = checkPasswordStrength(value);
      setPasswordChecks(newChecks);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "country") {
      const country = Country.getAllCountries().find((c) => c.name === value);
      if (country) {
        setFormData((prev) => ({
          ...prev,
          country: value,
          phoneCode: country.phonecode ? `+${country.phonecode}` : "",
          state: "", // reset state
          city: "", // reset city
        }));
        setSelectedCountry(country.isoCode);
        setStates(State.getStatesOfCountry(country.isoCode));
        setCities([]);
      }
    } else if (name === "state") {
      const state = State.getStatesOfCountry(selectedCountry).find(
        (s) => s.name === value
      );
      if (state) {
        setFormData((prev) => ({ ...prev, state: value, city: "" }));
        setSelectedState(state.isoCode);
        setCities(City.getCitiesOfState(selectedCountry, state.isoCode));
      }
    } else if (name === "city") {
      setFormData((prev) => ({ ...prev, city: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 🔹 Step navigation
  const handleNext = () => {
    if (currentStep === 1) {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.phoneNo ||
        !formData.dob ||
        !formData.ssn ||
        !formData.address ||
        !formData.city ||
        !formData.state ||
        !formData.zipCode ||
        !formData.country
      ) {
        toast.error("Please complete all personal information fields.");
        return;
      }
      if (formData.zipCode.length < 4) {
        toast.error("Please enter a valid Zip Code.");
        return;
      }
    }

    if (currentStep === 2) {
      if (
        !formData.userName ||
        !formData.password ||
        !formData.confirmPassword ||
        !formData.pin ||
        !formData.confirmPin ||
        !formData.accountType
      ) {
        toast.error("Please complete all account details.");
        return;
      }
    }

    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // send email verification
  const sendVerificationEmail = () => {
    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid email!");
      return;
    }

    registerUserReq({
      successRes: () => {
        toast.success("Verification email sent. Please check your inbox.");
        setShowOtpModal(true);
      },
      errorRes: (err) => {
        const desc = err?.response?.data?.description;
        if (desc === "Email already exist!") {
          setShowOtpModal(true);
          toast.info(
            "Your email is already registered, please verify with OTP."
          );
          handleResendOtp;
        }
      },
      requestConfig: {
        url: "auth/send/email/otp",
        method: "POST",
        body: { email: formData.email },
      },
    });
  };

  // verify OTP
  const handleOtpSubmit = () => {
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP.");
      return;
    }

    registerUserReq({
      successRes: () => {
        setIsEmailVerified(true);
        setShowOtpModal(false);
        setCurrentStep(1);
        toast.success("Email verified successfully!");
      },
      requestConfig: {
        url: "/auth/verify/email",
        method: "POST",
        body: { email: formData.email, otp },
      },
    });
  };

  const registerUserRes = (res: any) => {
    router.push(`/login`);
  };

  const handleResendOtp = () => {
    registerUserReq({
      successRes: () => {
        toast.success("OTP resent successfully!");
      },
      requestConfig: {
        url: "/auth/resend/email/verification/otp",
        method: "POST",
        body: { email: formData.email },
      },
    });
  };

  const handleBackToEmail = () => {
    setShowOtpModal(false);
    setIsEmailVerified(false);
    setCurrentStep(1);
    setOtp("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEmailVerified) {
      toast.error("Please verify your email before continuing.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (formData.pin !== formData.confirmPin) {
      toast.error("PINs do not match!");
      return;
    }

    if (!formData.passport || !formData.driversLicence) {
      toast.error("Please upload passport and drivers license!");
      return;
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (
        value !== null &&
        key !== "agreeToTerms" &&
        key !== "agreeToMarketing" &&
        key !== "phoneCode"
      ) {
        // Always stringify zipCode to avoid number type issues
        if (key === "zipCode") {
          payload.append(key, String(value));
        } else {
          payload.append(key, value as any);
        }
      }
    });

    const formattedPhone = `${formData.phoneCode}${formData.phoneNo}`.replace(
      /\s+/g,
      ""
    );
    payload.set("phoneNo", formattedPhone);

    // ✅ Debug print FormData before sending
    for (let [key, value] of payload.entries()) {
      console.log(`${key}:`, value);
    }

    registerUserReq({
      successRes: registerUserRes,
      requestConfig: {
        url: "/auth/signup",
        method: "PATCH",
        body: payload,
        successMessage: "Registration Complete, Please login.",
      },
    });
  };

  // 🔹 Step 1 (Email → then Personal Info)
  const renderPersonalInfo = () => {
    if (!isEmailVerified) {
      return (
        <div className="space-y-4">
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
          <Button
            type="button"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            onClick={sendVerificationEmail}
            disabled={loading}
          >
            {loading ? <LoadingSpinner /> : "Verify Email"}
          </Button>
        </div>
      );
    }

    return (
      <>
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

        <div>
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dob"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="ssn">SSN (9-digit)</Label>
          <Input
            id="ssn"
            name="ssn"
            maxLength={9}
            value={formData.ssn}
            onChange={handleInputChange}
            required
          />
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="country">Country</Label>
            <Select
              onValueChange={(val) => handleSelectChange("country", val)}
              value={formData.country}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c.isoCode} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Select
              onValueChange={(val) => handleSelectChange("state", val)}
              value={formData.state}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {states.map((s) => (
                  <SelectItem key={s.isoCode} value={s.name}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Select
              onValueChange={(val) => handleSelectChange("city", val)}
              value={formData.city}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((c) => (
                  <SelectItem key={c.name} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="zipCode">Zip Code</Label>
            <Input
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="phoneNo">Phone Number</Label>
            <div className="flex">
              <Input
                id="phoneCode"
                name="phoneCode"
                className="w-24 mr-2"
                value={formData.phoneCode}
                readOnly
              />
              <Input
                id="phoneNo"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    phoneNo: e.target.value.replace(/\D/g, ""), // digits only
                  }))
                }
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  // 🔹 Step 2 (Account Details)
  const renderAccountDetails = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="userName">Username</Label>
        <Input
          id="userName"
          name="userName"
          value={formData.userName}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          {/* Password rules */}
          <ul className="mt-2 text-xs space-y-1">
            <li
              className={
                passwordChecks.hasUpper ? "text-green-600" : "text-red-500"
              }
            >
              • At least one uppercase letter
            </li>
            <li
              className={
                passwordChecks.hasLower ? "text-green-600" : "text-red-500"
              }
            >
              • At least one lowercase letter
            </li>
            <li
              className={
                passwordChecks.hasNumber ? "text-green-600" : "text-red-500"
              }
            >
              • At least one number
            </li>
            <li
              className={
                passwordChecks.hasMinLength ? "text-green-600" : "text-red-500"
              }
            >
              • Minimum 8 characters
            </li>
          </ul>
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pin">4-digit PIN</Label>
          <Input
            id="pin"
            name="pin"
            type="password"
            maxLength={4}
            value={formData.pin}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="confirmPin">Confirm PIN</Label>
          <Input
            id="confirmPin"
            name="confirmPin"
            type="password"
            maxLength={4}
            value={formData.confirmPin}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="initialDeposit">Initial Deposit</Label>
        <Input
          id="initialDeposit"
          name="initialDeposit"
          type="number"
          value={formData.initialDeposit}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <Label>Account Type</Label>
        <Select
          onValueChange={(val) => handleSelectChange("accountType", val)}
          value={formData.accountType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select account type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="savings">Savings</SelectItem>
            <SelectItem value="current">Current</SelectItem>
            <SelectItem value="checking">Checking</SelectItem>
            <SelectItem value="fixed">Fixed</SelectItem>
            <SelectItem value="non-resident">Non-Resident</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="domiciliary">Domiciliary</SelectItem>
            <SelectItem value="joint">Joint</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="agreeToTerms"
            checked={formData.agreeToTerms}
            onCheckedChange={(checked) =>
              handleSelectChange("agreeToTerms", checked ? "true" : "")
            }
          />
          <Label htmlFor="agreeToTerms">
            I agree to the{" "}
            <span className="text-blue-600">Terms & Conditions</span>
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="agreeToMarketing"
            checked={formData.agreeToMarketing}
            onCheckedChange={(checked) =>
              handleSelectChange("agreeToMarketing", checked ? "true" : "")
            }
          />
          <Label htmlFor="agreeToMarketing">
            I agree to receive marketing communications
          </Label>
        </div>
      </div>
    </div>
  );

  // 🔹 Step 3 (Verification & Documents)
  const renderVerification = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="passport">Upload Passport</Label>
        <Input
          id="passport"
          name="passport"
          type="file"
          accept="image/*"
          onChange={handleInputChange}
        />
      </div>
      <div>
        <Label htmlFor="driversLicence">Upload Driver’s License</Label>
        <Input
          id="driversLicence"
          name="driversLicence"
          type="file"
          accept="image/*"
          onChange={handleInputChange}
        />
      </div>
      <p className="text-sm text-gray-600">
        Please ensure documents are clear and valid.
      </p>
    </div>
  );

  // 🔹 Step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfo();
      case 2:
        return renderAccountDetails();
      case 3:
        return renderVerification();
      default:
        return null;
    }
  };

  return (
    <>
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
                <AmericanHLogo size="md" />
                <h1 className="text-3xl font-bold">American Horizon</h1>
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
                      {step.id === 1 && isEmailVerified && (
                        <CheckCircle className="inline ml-1 w-4 h-4 text-green-400" />
                      )}
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
                            disabled={!isEmailVerified && currentStep === 1}
                          >
                            Next <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            type="submit"
                            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                            disabled={!formData.agreeToTerms || loading}
                          >
                            {loading ? <LoadingSpinner /> : "  Create Account"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </WireframeLoader>

      {/* OTP Modal */}
      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Verification</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Enter the 6-digit OTP sent to <strong>{formData.email}</strong>
            </p>

            <Input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              maxLength={6}
              className="text-center tracking-widest"
            />

            <Button
              onClick={handleOtpSubmit}
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
              disabled={loading}
            >
              {loading ? <LoadingSpinner /> : "Verify OTP"}
            </Button>

            <div className="flex justify-between text-sm">
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-blue-600 hover:underline"
              >
                Resend OTP
              </button>
              <button
                type="button"
                onClick={handleBackToEmail}
                className="text-gray-500 hover:underline"
              >
                Back
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
