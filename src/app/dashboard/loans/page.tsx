"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { WireframeLoader } from "@/components/wireframe-loader";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default function LoanPage() {
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("1"); // default 1 month
  const [submitted, setSubmitted] = useState(false);

  // Interest rates based on duration (example values)
  const interestRates: Record<string, number> = {
    "1": 5, // 5% for 1 month
    "2": 8,
    "3": 10,
    "6": 15,
    "12": 20, // 20% for 12 months
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  // Calculate repayment
  const loanAmount = parseFloat(amount) || 0;
  const interestRate = interestRates[duration] || 0;
  const totalRepay = loanAmount + (loanAmount * interestRate) / 100;

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
              You currently have <span className="font-bold">$5,000</span>{" "}
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
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Loan Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Loan Amount
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
                    placeholder="Enter amount"
                    required
                  />
                </div>

                {/* Loan Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Duration
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
                  >
                    <option value="1">1 Month (5%)</option>
                    <option value="2">2 Months (8%)</option>
                    <option value="3">3 Months (10%)</option>
                    <option value="6">6 Months (15%)</option>
                    <option value="12">12 Months (20%)</option>
                  </select>
                </div>

                {/* Repayment Calculation */}
                {loanAmount > 0 && (
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
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 transition"
                >
                  Submit Application
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      </DashboardSidebar>
    </WireframeLoader>
  );
}
