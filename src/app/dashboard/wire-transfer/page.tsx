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
import { getNames } from "country-list"

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

export default function WireTransferPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [accountType, setAccountType] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [recipientAccount, setRecipientAccount] = useState("")
  const [country, setCountry] = useState("")
  const [swiftCode, setSwiftCode] = useState("")
  const [routingNumber, setRoutingNumber] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const countries = getNames()

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
      setRecipientName("")
      setRecipientAccount("")
      setCountry("")
      setSwiftCode("")
      setRoutingNumber("")
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
                <h2 className="text-2xl font-bold text-foreground mb-2">Wire Transfer Successful!</h2>
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-2xl font-bold text-foreground mb-2">Wire Transfer</h1>
            <p className="text-muted-foreground">
              Wire transfer fee: <span className="font-semibold">$25</span> charges and arrives in{" "}
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
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Account Type</Label>
                      <Select value={accountType} onValueChange={setAccountType} required>
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
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          placeholder="Enter recipient name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Account Number</Label>
                        <Input
                          value={recipientAccount}
                          onChange={(e) => setRecipientAccount(e.target.value)}
                          placeholder="Enter account number"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Select value={country} onValueChange={setCountry} required>
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
                          value={swiftCode}
                          onChange={(e) => setSwiftCode(e.target.value)}
                          placeholder="Enter SWIFT code"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Routing Number</Label>
                        <Input
                          value={routingNumber}
                          onChange={(e) => setRoutingNumber(e.target.value)}
                          placeholder="Enter Routing number"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description (Optional)</Label>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add a note for this transfer..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        required
                        min="1"
                        step="0.01"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      disabled={!accountType || !recipientName || !recipientAccount || !country || !swiftCode || !routingNumber || !amount || isSubmitting}
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

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
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
                        <span className="font-semibold">$25</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Processing Time:</span>
                        <span className="font-semibold">24 Hours</span>
                      </div>
                      <hr />
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>${(Number(amount || "0") + 25).toFixed(2)}</span>
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
