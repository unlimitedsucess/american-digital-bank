"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { WireframeLoader } from "@/components/wireframe-loader";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { loanApplication } from "@/types/global";
import { useHttp } from "@/hooks/use-http";
import { useSelector } from "react-redux";
import { toast } from "sonner";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RootState } from "@/store";

export default function LoanPage() {
 
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState(["", "", "", ""]); // 4-digit pin array

    const customerData = useSelector(
      (state: RootState) => state.customer.customerData
    );


  const [submitted, setSubmitted] = useState(false);
  const token = useSelector((state: any) => state.token?.token);

  // Interest rates based on duration (example values)
  const durationOptions: Record<string, { months: number; interest: number }> =
    {
      "1month_5": { months: 1, interest: 5 },
      "2month_8": { months: 2, interest: 8 },
      "3month_10": { months: 3, interest: 10 },
      "6month_15": { months: 6, interest: 15 },
      "12month_20": { months: 12, interest: 20 },
    };

  const [formData, setFormData] = useState<loanApplication>({
    loanDuration: "",
    loanAmount: 0,
    pin: "",
    description: ""
  });
  const selectedDuration = durationOptions[formData.loanDuration];
  const interestRate = selectedDuration?.interest || 0;

  // Total repayment (simple interest)
  const totalRepay = formData.loanAmount * (1 + interestRate / 100);
  const { loading, sendHttpRequest: LoanRequest } = useHttp();

  const handleChange = (
    field: keyof loanApplication,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (pinValue: string) => {
    if (!formData.loanDuration || !formData.loanAmount) {
      toast.error("Please fill in all fields!");
      return;
    }

    const submissionData = { ...formData, pin: pinValue };

    LoanRequest({
      requestConfig: {
        url: "loan/apply",
        method: "POST",
        body: submissionData,
        token,
        isAuth: true,
        successMessage: " Successful",
      },
      successRes: () => {
        toast.success("Loan Submission successful!");

        setShowPinModal(false);
        setSubmitted(true);
      },
    });

    console.log("Loan Application Data:", submissionData);
  };


  return (
    <WireframeLoader isLoading={false}>
      <DashboardSidebar>
        <motion.div
          className="p-6 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Outstanding Loan */}
          <motion.div
            className="border rounded-lg p-4 bg-gray-50 shadow-sm"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-semibold text-lg text-gray-700">
              Outstanding Loan
            </h2>
            <p className="text-gray-600 mt-2">
              You currently have <span className="font-bold">{customerData?.loanBalance}</span>{" "}
              outstanding balance.
            </p>
          </motion.div>

          {/* Apply for Loan */}
          <motion.div
            className="border rounded-lg p-6 bg-white shadow"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="font-semibold text-lg text-gray-700 mb-4">
              Apply for Loan
            </h2>

            {submitted ? (
              <motion.p
                className="text-green-600 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                ✅ Submitted, under review
              </motion.p>
            ) : (
              <form className="space-y-4">
                {/* Loan Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Loan Amount
                  </label>
                  <input
                    type="number"
                    value={formData.loanAmount}
                    onChange={(e) => handleChange("loanAmount", e.target.value)}
                    className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
                    placeholder="Enter amount"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Reason for Loan
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
                    placeholder="Enter reason for loan"
                    required
                  />
                </div>

                {/* Loan Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Duration
                  </label>
                  <select
                    value={formData.loanDuration}
                    onChange={(e) =>
                      handleChange("loanDuration", e.target.value)
                    }
                    className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
                  >
                    <option value="">Select duration</option>
                    <option value="1month_5">1 Month (5%)</option>
                    <option value="2month_8">2 Months (8%)</option>
                    <option value="3month_10">3 Months (10%)</option>
                    <option value="6month_15">6 Months (15%)</option>
                    <option value="12month_20">12 Months (20%)</option>
                  </select>
                </div>

                {/* Repayment Calculation */}
                {formData.loanAmount > 0 && (
                  <motion.div
                    className="p-3 bg-gray-100 rounded-md text-gray-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p>
                      Interest Rate:{" "}
                      <span className="font-semibold">{interestRate}%</span>
                    </p>

                    <p>
                      Total Repayment:{" "}
                      <span className="font-bold text-blue-600">
                        ${totalRepay.toFixed(2)}
                      </span>
                    </p>
                  </motion.div>
                )}

                <button
                  type="button"
                  onClick={() => setShowPinModal(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 transition"
                >
                  Submit Application
                </button>
              </form>
            )}
          </motion.div>
          {showPinModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <Card className="p-6 w-full max-w-sm">
                <button onClick={() => setShowPinModal(false)}>close</button>
                <CardHeader>
                  <CardTitle>Enter Your 4-Digit PIN</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between space-x-2 mb-4">
                    {pin.map((digit, index) => (
                      <Input
                        key={index}
                        id={`pin-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/, "");
                          setPin((prev) => {
                            const newPin = [...prev];
                            newPin[index] = val;
                            return newPin;
                          });
                          if (val && index < 3) {
                            const nextInput = document.getElementById(
                              `pin-${index + 1}`
                            );
                            nextInput?.focus();
                          }
                        }}
                        className="text-center w-12"
                      />
                    ))}
                  </div>
                  <Button
                    disabled={loading}
                    onClick={() => {
                      const fullPin = pin.join("");
                      if (fullPin.length < 4) {
                        toast.error("Please enter your 4-digit PIN");
                        return;
                      }

                      handleSubmit(fullPin); // ✅ pass pin here
                    }}
                  >
                    {loading ? <LoadingSpinner /> : "Confirm Loan"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </DashboardSidebar>
    </WireframeLoader>
  );
}
