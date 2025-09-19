"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { WireframeLoader } from "@/components/wireframe-loader"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { useSelector } from "react-redux"
import { RootState } from "@/store"





export default function AccountManagersPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [showNumber, setShowNumber] = useState(false)
  const [copyStatus, setCopyStatus] = useState<null | "copied" | "error">(null)

  const  customerData = useSelector((state:RootState)=>state.customer.customerData)
function maskAccountNumber(num = "") {
  const last4 = num.slice(-4)
  const masked = num.slice(0, -4).replace(/\d/g, "•")
  // group masked into 4-digit groups for readability
  const groups = (masked + last4).match(/.{1,4}/g) || []
  return groups.join(" ")
}
const accountManager = {
  name: "Sarah Johnson",
  email: "sarah.johnson@bankcorp.com",
  phone: "+1 (555) 234-5678",
  profilePic: "https://randomuser.me/api/portraits/women/45.jpg",
  accountType: customerData.accountType,
  transactionLimit: "$5,000,000 / day",
  accountName: `${customerData.firstName} ${customerData.lastName}`,
  accountNumber: customerData.accountNumber // real format in your DB
}

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 900)
    return () => clearTimeout(timer)
  }, [])

  const copyAccountNumber = async () => {
    try {
      await navigator.clipboard.writeText(accountManager.accountNumber)
      setCopyStatus("copied")
      setTimeout(() => setCopyStatus(null), 2000)
    } catch {
      setCopyStatus("error")
      setTimeout(() => setCopyStatus(null), 2000)
    }
  }

  return (
    <WireframeLoader isLoading={isLoading}>
      <DashboardSidebar>
        <div className="p-6 space-y-6">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-foreground">Account Manager</h1>
            <p className="text-muted-foreground">
              Meet your dedicated account manager and view your account details
            </p>
          </motion.div>

          {/* Manager Card */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
            <Card className="shadow-lg rounded-2xl">
              <CardHeader className="flex items-center gap-4 p-6">
                <div className="w-20 h-20 rounded-full overflow-hidden border border-muted-foreground/20">
                  <Image
                    src={accountManager.profilePic}
                    alt={accountManager.name}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">{accountManager.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{accountManager.email}</p>
                  <p className="text-sm text-muted-foreground">{accountManager.phone}</p>
                </div>
              </CardHeader>

              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                {/* Account Info */}
                <div className="col-span-1 md:col-span-2 p-4 border rounded-lg flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground">Account Name</h3>
                      <p className="text-lg font-medium text-foreground">{accountManager.accountName}</p>
                    </div>
                    <Badge variant="secondary">Assigned Manager</Badge>
                  </div>

                  <div className="mt-2">
                    <h3 className="font-semibold text-sm text-muted-foreground">Account Number</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="font-mono text-lg tracking-widest">
                        {showNumber ? accountManager.accountNumber.match(/.{1,4}/g)?.join(" ") : maskAccountNumber(accountManager.accountNumber)}
                      </div>

                      <div className="ml-auto flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowNumber(prev => !prev)}
                        >
                          {showNumber ? "Hide" : "Show"}
                        </Button>

                        <Button variant="ghost" size="sm" onClick={copyAccountNumber}>
                          {copyStatus === "copied" ? "Copied!" : copyStatus === "error" ? "Error" : "Copy"}
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Keep your account number secure.</p>
                  </div>
                </div>

                {/* Account Meta */}
                <div className="p-4 border rounded-lg flex flex-col gap-3">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Account Type</h3>
                    <p className="text-lg font-medium text-foreground">{accountManager.accountType}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Transaction Limit</h3>
                    <p className="text-lg font-medium text-foreground">{accountManager.transactionLimit}</p>
                    <Badge className="mt-2 bg-blue-100 text-blue-800">Daily Limit</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </DashboardSidebar>
    </WireframeLoader>
  )
}
