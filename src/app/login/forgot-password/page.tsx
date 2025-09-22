"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { Mail, ArrowLeft, ArrowRight } from "lucide-react";
import { useHttp } from "@/hooks/use-http";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { AmericanHLogo } from "@/components/skyflex-logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const router = useRouter();
  const { loading, sendHttpRequest: loginRequest } = useHttp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    loginRequest({
      requestConfig: {
        url: "auth/forgot/password",
        method: "POST",
        body: {
          email,
        },
      },
      successRes: () => {
        toast.success("Password reset link sent to your email");
        setIsDialogOpen(true); // ✅ open modal on success
      },
    });
  };

  // Extract domain for redirect
  const getEmailProvider = (email: string) => {
    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain) return null;

    if (domain.includes("gmail")) return "https://mail.google.com/";
    if (domain.includes("yahoo")) return "https://mail.yahoo.com/";
    if (
      domain.includes("outlook") ||
      domain.includes("hotmail") ||
      domain.includes("live")
    )
      return "https://outlook.live.com/";
    return `https://${domain}`;
  };

  return (
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
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold">
                Forgot Password
              </CardTitle>
              <p className="text-muted-foreground">
                Enter your registered email to receive a reset link
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  disabled={loading}
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 0.3,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      Send Reset Link <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center text-sm text-secondary hover:underline"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Sign In
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ✅ Success Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check your email</DialogTitle>
            <p className="text-sm text-muted-foreground">
              We have sent a password reset link to{" "}
              <span className="font-semibold">{email}</span>. Click below to
              open your email provider.
            </p>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                const provider = getEmailProvider(email);
                if (provider) window.open(provider, "_blank");
              }}
              className="w-full"
            >
              Go to Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
