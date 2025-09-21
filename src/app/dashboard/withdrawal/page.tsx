"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { WireframeLoader } from "@/components/wireframe-loader";
import { Search, Filter, Download } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";


export default function WithdrawalPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);
  const transactions = useSelector(
    (state: RootState) => state.customer.transactions || []
  );
  // Filter only debit transactions
  const debitTransactions = transactions.filter(
    (t) => t.transactionDirection === "debit"
  );

  const filteredTransactions = debitTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.recipientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      transaction.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <WireframeLoader isLoading={isLoading}>
      <DashboardSidebar>
        <div className="space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Withdrawal History
            </h1>
            <p className="text-muted-foreground">
              View all your debit / withdrawal transactions
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search withdrawals..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="complete">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="bg-transparent">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" className="bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Withdrawal Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">
                    ${" "}
                    {debitTransactions
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total Withdrawals
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {debitTransactions.length}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total Transactions
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Withdrawals Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  All Withdrawals
                  <Badge variant="secondary">
                    {filteredTransactions.length} results
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                          ID
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                          AMOUNT
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                          SENDER / RECEIVER
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                          DESCRIPTION
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                          CATEGORY
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                          DATE
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                          TIME
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                          STATUS
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((transaction, index) => {
                        const dateObj = transaction.createdAt
                          ? new Date(transaction.createdAt)
                          : null;

                        const formattedDate = dateObj
                          ? dateObj.toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "-";

                        const formattedTime = dateObj
                          ? dateObj.toLocaleTimeString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })
                          : "-";
                        return (
                          <motion.tr
                            key={transaction.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="border-b border-border hover:bg-muted/50"
                          >
                            <td className="py-3 px-2 text-sm font-mono">
                              {transaction.id}
                            </td>
                            <td className="py-3 px-2 text-sm font-semibold text-red-600">
                              -${transaction.amount.toLocaleString()}
                            </td>
                            <td className="py-3 px-2 text-sm">
                              {transaction.recipientName}
                            </td>
                            <td className="py-3 px-2 text-sm">
                              {transaction.description}
                            </td>
                            <td className="py-3 px-2">
                              <Badge variant="outline">
                                {transaction.transferType}
                              </Badge>
                            </td>
                            <td className="py-3 px-2 text-sm">
                              {formattedDate}
                            </td>
                            <td className="py-3 px-2 text-sm">
                              {formattedTime}
                            </td>
                            <td className="py-3 px-2">
                              <Badge className="bg-blue-100 text-blue-800">
                                {transaction.status}
                              </Badge>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {filteredTransactions.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No withdrawals found matching your criteria.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </DashboardSidebar>
    </WireframeLoader>
  );
}
