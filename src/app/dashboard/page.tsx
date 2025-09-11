"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { WireframeLoader } from "@/components/wireframe-loader"
import { DollarSign, ArrowUpRight, MoreHorizontal, Eye, EyeOff } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const monthlyData = [
  { month: "Jan", income: 45000, expenses: 32000 },
  { month: "Feb", income: 52000, expenses: 28000 },
  { month: "Mar", income: 48000, expenses: 35000 },
  { month: "Apr", income: 61000, expenses: 42000 },
  { month: "May", income: 55000, expenses: 38000 },
  { month: "Jun", income: 67000, expenses: 45000 },
]

const recentTransactions = [
  {
    id: 1,
    amount: 5500,
    type: "Credit",
    sender: "MEXICO INC ORG",
    description: "Salary allowance",
    date: "2024-01-09",
    time: "16:02",
    status: "Completed",
  },
  {
    id: 2,
    amount: 2750,
    type: "Debit",
    sender: "Myself",
    description: "Mechanical serv",
    date: "2024-01-07",
    time: "14:21",
    status: "Completed",
  },
  {
    id: 3,
    amount: 3900,
    type: "Debit",
    sender: "Myself",
    description: "Refining",
    date: "2024-01-05",
    time: "07:22",
    status: "Completed",
  },
  {
    id: 4,
    amount: 4250,
    type: "Debit",
    sender: "Myself",
    description: "FLIGHT MAINTENA",
    date: "2024-01-03",
    time: "07:14",
    status: "Completed",
  },
]

const summaryData = [
  { label: "Loan", amount: 500000, color: "bg-blue-500" },
  { label: "Loan Balance", amount: 0, color: "bg-green-500" },
  { label: "Expenses", amount: 450000, color: "bg-red-500" },
]

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [showBalance, setShowBalance] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  const user = {
    name: "Malee Chantara Sophia",
    balance: 1483400.0,
    accountNumber: "****4567",
  }

  return (
    <WireframeLoader isLoading={isLoading}>
      <DashboardSidebar>
        <div className="space-y-6">
          {/* Welcome Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-2xl font-bold text-foreground mb-2">Welcome back, {user.name.split(" ")[0]}!</h1>
            <p className="text-muted-foreground">Here's what's happening with your account today.</p>
          </motion.div>

          {/* Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-gradient-to-r from-secondary to-accent text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-white/80 text-sm">Account Balance</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-3xl font-bold">
                        {showBalance ? `$${user.balance.toLocaleString()}.00` : "••••••••"}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20"
                        onClick={() => setShowBalance(!showBalance)}
                      >
                        {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white/80 text-sm">Account</p>
                    <p className="text-lg font-semibold">{user.accountNumber}</p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button className="bg-white/20 text-white hover:bg-white/30 border-0">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Deposit
                  </Button>
                  <Button className="bg-white/20 text-white hover:bg-white/30 border-0">
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    Transfer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Summary Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {summaryData.map((item, index) => (
              <Card key={item.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="text-2xl font-bold">${item.amount.toLocaleString()}</p>
                    </div>
                    <div className={`w-3 h-12 rounded-full ${item.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Charts and Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Stats Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Daily Stats
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">See 7 transaction for details</p>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="income" fill="#fbbf24" />
                      <Bar dataKey="expenses" fill="#2563eb" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Account Limits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Limits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Transfer Limit Remain</span>
                      <span className="font-semibold">$500000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-red-500">Last Transaction</span>
                      <span className="text-red-500 font-semibold">$495000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span></span>
                      <span className="font-semibold">$5000</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      ACTIVE
                    </Button>
                    <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                      View Transactions
                    </Button>
                    <Button size="sm" className="bg-green-600 text-white hover:bg-green-700">
                      Wire Transfer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">S/N</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">AMOUNT</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">TYPE</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                          SENDER / RECEIVER
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">DESCRIPTION</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">CREATED AT</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">TIME CREATED</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-border">
                          <td className="py-3 px-2 text-sm">{transaction.id}</td>
                          <td className="py-3 px-2 text-sm font-semibold">${transaction.amount.toLocaleString()}</td>
                          <td className="py-3 px-2">
                            <Badge
                              variant={transaction.type === "Credit" ? "default" : "secondary"}
                              className={
                                transaction.type === "Credit"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {transaction.type}
                            </Badge>
                          </td>
                          <td className="py-3 px-2 text-sm">{transaction.sender}</td>
                          <td className="py-3 px-2 text-sm">{transaction.description}</td>
                          <td className="py-3 px-2 text-sm">{transaction.date}</td>
                          <td className="py-3 px-2 text-sm">{transaction.time}</td>
                          <td className="py-3 px-2">
                            <Badge className="bg-blue-100 text-blue-800">{transaction.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </DashboardSidebar>
    </WireframeLoader>
  )
}
