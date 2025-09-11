"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { WireframeLoader } from "@/components/wireframe-loader"
import { Send, User, Building, CheckCircle, AlertTriangle } from "lucide-react"

const accountTypes = [
  "Savings Account",
  "Current Account",
  "Checking Accounts",
  "Fixed Account",
  "Non Resident Account",
  "Online Banking",
  "Domiciliary Account",
  "Joint Account",
]

export default function TransferPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [accountType, setAccountType] = useState("")
  const [bankName, setBankName] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [recipientAccount, setRecipientAccount] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 2500))

    setShowSuccess(true)
    setIsSubmitting(false)

    setTimeout(() => {
      setShowSuccess(false)
      setAccountType("")
      setBankName("")
      setRecipientName("")
      setRecipientAccount("")
      setAmount("")
      setDescription("")
    }, 3000)
  }

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
                <h2 className="text-2xl font-bold text-foreground mb-2">Transfer Successful!</h2>
                <p className="text-muted-foreground">
                  Your transfer of ${amount} to {recipientName} has been processed.
                </p>
              </div>
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                View Transfer History
              </Button>
            </motion.div>
          </div>
        </DashboardSidebar>
      </WireframeLoader>
    )
  }

  return (
    <WireframeLoader isLoading={isLoading}>
      <DashboardSidebar>
        <div className="space-y-6">
          {/* Title + Description */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-2xl font-bold text-foreground mb-2">Domestic Transfer</h1>
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
                      <Select value={accountType} onValueChange={setAccountType} required>
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
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
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
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            placeholder="Enter recipient name"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      {/* Account Number */}
                      <div className="space-y-2">
                        <Label htmlFor="recipient-account">Account Number</Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="recipient-account"
                            value={recipientAccount}
                            onChange={(e) => setRecipientAccount(e.target.value)}
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
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
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
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add a note for this transfer..."
                        rows={3}
                      />
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      disabled={!accountType || !bankName || !recipientName || !recipientAccount || !amount || isSubmitting}
                    >
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Transfer
                        </>
                      )}
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
                  {accountType && amount ? (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transfer Amount:</span>
                        <span className="font-semibold">${amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fee:</span>
                        <span className="font-semibold">Free</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Processing Time:</span>
                        <span className="font-semibold">Same day</span>
                      </div>
                      <hr />
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>${Number.parseFloat(amount || "0").toFixed(2)}</span>
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
        </div>
      </DashboardSidebar>
    </WireframeLoader>
  )
}
