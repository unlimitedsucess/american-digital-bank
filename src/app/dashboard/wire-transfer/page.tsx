"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { WireframeLoader } from "@/components/wireframe-loader";
import { Send, CheckCircle, AlertTriangle } from "lucide-react";
import { getNames } from "country-list";
import { WireTransfer } from "@/types/global";
import { toast } from "sonner";
import { useHttp } from "@/hooks/use-http";
import { useDispatch, useSelector } from "react-redux";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import { customerActions } from "@/store/data/customer-slice";

const accountTypes = [
  "savings",
  "current",
  "checking",
  "fixed",
  "non-resident",
  "online",
  "domiciliary",
  "joint",
];

export default function WireTransferPage() {
  const [isLoading, setIsLoading] = useState(true);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState(["", "", "", ""]); // 4-digit pin array
  const router = useRouter();

  const token = useSelector((state: any) => state.token?.token);
  const countries = getNames();
    const dispatch = useDispatch();
  const remainingLimit = useSelector(
    (state: RootState) => state.customer.remainingTransferLimit
  );

  const [formData, setFormData] = useState<WireTransfer>({
    accountType: "",
    recipientName: "",
    accountNumber: "",
    country: "",
    swiftCode: "",
    routingNumber: "",
    description: "",
    amount: 0,
    pin: "",
  });

  const { loading, sendHttpRequest: WireTransferRequest } = useHttp();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (field: keyof WireTransfer, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.accountNumber ||
      !formData.accountType ||
      !formData.amount ||
      !formData.pin ||
      !formData.recipientName ||
      !formData.routingNumber ||
      !formData.swiftCode
    ) {
      toast.error("Please fill in all fields!");
      return;
    }
    if (formData.amount > remainingLimit) {
      toast.error("Transaction exceeds remaining limit!");
      return;
    }

    console.log("Form Data Submitted:", formData);

    WireTransferRequest({
      requestConfig: {
        url: "transaction/transfer/wire",
        method: "POST",
        body: formData,
        token,
        isAuth: true,
        successMessage: "Transfer Successful",
      },
      successRes: () => {
        toast.success("Transfer successful!");
        setShowSuccess(true);
        setShowPinModal(false);
        const newRemainingLimit = remainingLimit - formData.amount;
        dispatch(customerActions.setRemainingTransferLimit(newRemainingLimit));
      },
    });
  };

  if (showSuccess) {
    return (
      <WireframeLoader isLoading={false}>
        <DashboardSidebar>
          <div className="flex items-center justify-center min-h-[60vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-6"
            >
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Wire Transfer Successful!
                </h2>
                <p className="text-muted-foreground">
                  Your transfer of ${formData.amount} to{" "}
                  {formData.recipientName} has been processed.
                </p>
              </div>
              <Button
                onClick={() => router.push("/dashboard/transactions")}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                View Transfer History
              </Button>
            </motion.div>
          </div>
        </DashboardSidebar>
      </WireframeLoader>
    );
  }

  return (
    <WireframeLoader isLoading={isLoading}>
      <DashboardSidebar>
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Wire Transfer
            </h1>
            <p className="text-muted-foreground">
              Wire transfer fee: <span className="font-semibold">$25</span>{" "}
              charges and arrives in{" "}
              <span className="font-semibold">24 hours</span>.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Transfer Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label>Account Type</Label>
                      <Select
                        value={formData.accountType}
                        onValueChange={(value) =>
                          handleChange("accountType", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Account Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {accountTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Recipient Name</Label>
                        <Input
                          value={formData.recipientName}
                          onChange={(e) =>
                            handleChange("recipientName", e.target.value)
                          }
                          placeholder="Enter recipient name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Account Number</Label>
                        <Input
                          value={formData.accountNumber}
                          onChange={(e) =>
                            handleChange("accountNumber", e.target.value)
                          }
                          placeholder="Enter account number"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Select
                        value={formData.country}
                        onValueChange={(value) =>
                          handleChange("country", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto">
                          {countries.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>SWIFT Code</Label>
                        <Input
                          value={formData.swiftCode}
                          onChange={(e) =>
                            handleChange("swiftCode", e.target.value)
                          }
                          placeholder="Enter SWIFT code"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Routing Number</Label>
                        <Input
                          value={formData.routingNumber}
                          onChange={(e) =>
                            handleChange("routingNumber", e.target.value)
                          }
                          placeholder="Enter Routing number"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description (Optional)</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) =>
                          handleChange("description", e.target.value)
                        }
                        placeholder="Add a note for this transfer..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        value={formData.amount}
                        onChange={(e) =>
                          handleChange("amount", Number(e.target.value))
                        }
                        placeholder="0.00"
                        required
                        min="1"
                        step="0.01"
                      />
                    </div>

                    <Button
                      type="button"
                      className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      onClick={() => setShowPinModal(true)}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Transfer
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Transfer Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {formData.accountType && formData.amount ? (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Transfer Amount:
                        </span>
                        <span className="font-semibold">
                          ${formData.amount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fee:</span>
                        <span className="font-semibold">$25</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Processing Time:
                        </span>
                        <span className="font-semibold">24 Hours</span>
                      </div>
                      <hr />
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>
                          ${(Number(formData.amount) + 25).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Fill in the transfer details to see the summary</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* PIN Modal */}
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
                    className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    onClick={() => {
                      const fullPin = pin.join("");
                      if (fullPin.length < 4) {
                        toast.error("Please enter your 4-digit PIN");
                        return;
                      }
                      setFormData((prev) => ({ ...prev, pin: fullPin }));

                      handleSubmit(
                        new Event("submit") as unknown as React.FormEvent
                      );
                    }}
                  >
                    {loading ? <LoadingSpinner /> : "Confirm Transfer"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DashboardSidebar>
    </WireframeLoader>
  );
}
