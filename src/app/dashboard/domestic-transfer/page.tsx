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
import { Send, User, Building, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useHttp } from "@/hooks/use-http";
import { useDispatch, useSelector } from "react-redux";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useRouter } from "next/navigation";
import { DomesticTransfer } from "@/types/global";
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

export default function TransferPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState(["", "", "", ""]); // 4-digit pin array
  const router = useRouter();

  const token = useSelector((state: any) => state.token?.token);
  const dispatch = useDispatch();
  const remainingLimit = useSelector(
    (state: RootState) => state.customer.remainingTransferLimit
  );

  const [formData, setFormData] = useState<DomesticTransfer>({
    accountType: "",
    recipientName: "",
    accountNumber: "",
    bankName: "",
    description: "",
    amount: 0,
    pin: "",
  });

  const { loading, sendHttpRequest: DomesticTransferRequest } = useHttp();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (
    field: keyof DomesticTransfer,
    value: string | number
  ) => {
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
      !formData.recipientName
    ) {
      toast.error("Please fill in all fields!");
      return;
    }

    if (formData.amount > remainingLimit) {
      toast.error("Transaction exceeds remaining limit!");
      return;
    }

    console.log("Form Data Submitted:", formData);

    DomesticTransferRequest({
      requestConfig: {
        url: "transaction/transfer/domestic",
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

        // ✅ Update remaining limit in Redux
        const newRemainingLimit = remainingLimit - formData.amount;
        dispatch(
          customerActions.setRemainingTransferLimit(newRemainingLimit)
        );
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
                  Transfer Successful!
                </h2>
                <p className="text-muted-foreground">
                  Your transfer of ${formData.amount} to{" "}
                  {formData.recipientName} has been processed.
                </p>
              </div>
              <Button onClick={()=>router.push("/dashboard/transactions")} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
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
          {/* Title + Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Domestic Transfer
            </h1>
            <p className="text-muted-foreground">
              Domestic transfer • Free charges • Arrives same day
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Transfer Form */}
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
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Account Type */}
                    <div className="space-y-2">
                      <Label htmlFor="account-type">Account Type</Label>
                      <Select
                        value={formData.accountType}
                        onValueChange={(value) =>
                          handleChange("accountType", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select account type" />
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

                    {/* Bank Name */}
                    <div className="space-y-2">
                      <Label htmlFor="bank-name">Bank Name</Label>
                      <Input
                        id="bank-name"
                        value={formData.bankName}
                        onChange={(e) =>
                          handleChange("bankName", e.target.value)
                        }
                        placeholder="Enter bank name"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Recipient Name */}
                      <div className="space-y-2">
                        <Label htmlFor="recipient-name">Recipient Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="recipient-name"
                            value={formData.recipientName}
                            onChange={(e) =>
                              handleChange("recipientName", e.target.value)
                            }
                            placeholder="Enter recipient name"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      {/* Account Number */}
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="accountNumber"
                            value={formData.accountNumber}
                            onChange={(e) =>
                              handleChange("accountNumber", e.target.value)
                            }
                            placeholder="Enter account number"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          $
                        </span>
                        <Input
                          id="amount"
                          type="number"
                          value={formData.amount}
                          onChange={(e) =>
                            handleChange("amount", Number(e.target.value))
                          }
                          placeholder="0.00"
                          className="pl-8"
                          required
                          min="1"
                          step="0.01"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">
                        Description (Optional)
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          handleChange("description", e.target.value)
                        }
                        placeholder="Add a note for this transfer..."
                        rows={3}
                      />
                    </div>

                    {/* Submit */}
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

            {/* Summary */}
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
                        <span className="font-semibold">Free</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Processing Time:
                        </span>
                        <span className="font-semibold">Same day</span>
                      </div>
                      <hr />
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>${(formData.amount || 0).toFixed(2)}</span>
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
