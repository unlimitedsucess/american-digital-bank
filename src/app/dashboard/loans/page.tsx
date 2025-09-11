"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { WireframeLoader } from "@/components/wireframe-loader";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default function LoanPage() {
  const [amount, setAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
