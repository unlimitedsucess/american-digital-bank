"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AmericanHLogo } from "@/components/skyflex-logo";

export default function PendingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white border border-blue-100 rounded-2xl shadow-2xl p-10 max-w-md w-full text-center"
      >
        {/* Bank Logo Placeholder */}
        <div className="flex justify-center mb-4">
          
            <AmericanHLogo size="lg" />
          
        </div>

        {/* Security Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120, delay: 0.2 }}
          className="flex justify-center"
        >
          <ShieldCheck className="h-20 w-20 text-blue-600" />
        </motion.div>

        {/* Title */}
        <h1 className="mt-6 text-2xl font-bold text-gray-900">
          Your Application is Under Review
        </h1>

        {/* Subtext */}
        <p className="mt-4 text-gray-700 leading-relaxed">
          Thank you for submitting your application.  
          Our compliance team is carefully reviewing your information.  
          This process may take up to{" "}
          <span className="font-semibold text-gray-900">24 hours</span>.  
          You will be notified once your account is verified.
        </p>

        {/* CTA */}
        <div className="mt-8">
          <Button
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 shadow-md"
            onClick={() => router.push("/")}
          >
            Back to Home
          </Button>
        </div>

        {/* Footer Note */}
        <p className="mt-6 text-xs text-gray-500">
          For urgent matters, please contact{" "}
          <span className="text-blue-600 font-medium">Customer Support</span>.
        </p>
      </motion.div>
    </div>
  );
}
