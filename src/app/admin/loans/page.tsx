"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import DashboardWrapper from "@/components/admin/DashBoradWrapper";

type LoanStatus = "Pending" | "Approved" | "Redeemed" | "Overdue";

type Loan = {
  id: number;
  name: string;
  applicationDate: string; // yyyy-mm-dd
  expiryDate: string; // yyyy-mm-dd
  creditLimit: number;
  loanAmount: number; // principal still owed
  balance: number; // user’s balance
  status: LoanStatus;
  outstandingInterest: number; // interest accumulated
  lastInterestDate?: string; // last date interest was applied
};

const initialLoans: Loan[] = [
  {
    id: 1,
    name: "John Doe",
    applicationDate: "2025-09-01",
    expiryDate: "2025-09-12", // already expired
    creditLimit: 5000,
    loanAmount: 2000,
    balance: 1500,
    status: "Pending",
    outstandingInterest: 0,
  },
  {
    id: 2,
    name: "Jane Smith",
    applicationDate: "2025-08-15",
    expiryDate: "2025-11-15",
    creditLimit: 7000,
    loanAmount: 3500,
    balance: 1500,
    status: "Approved",
    outstandingInterest: 0,
  },
];

export default function LoanManagementPage() {
  const [loans, setLoans] = useState<Loan[]>(initialLoans);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [filter, setFilter] = useState<"All" | LoanStatus>("All");

  // auto-check expiry + interest accrual
  useEffect(() => {
    const now = new Date();

    setLoans((prev) =>
      prev.map((loan) => {
        if (loan.status === "Redeemed") return loan;

        const expiry = new Date(loan.expiryDate);

        // If expired → overdue
        if (expiry < now && loan.status !== "Overdue") {
          return { ...loan, status: "Overdue", lastInterestDate: now.toISOString() };
        }

        // If already overdue → add daily 2% interest
        if (loan.status === "Overdue" && loan.loanAmount > 0) {
          const lastDate = loan.lastInterestDate
            ? new Date(loan.lastInterestDate)
            : expiry;
          const daysPassed = Math.floor(
            (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (daysPassed > 0) {
            const newInterest =
              loan.outstandingInterest + loan.loanAmount * 0.02 * daysPassed;
            return {
              ...loan,
              outstandingInterest: parseFloat(newInterest.toFixed(2)),
              lastInterestDate: now.toISOString(),
            };
          }
        }

        return loan;
      })
    );
  }, []);

  const handleView = (loan: Loan) => {
    setSelectedLoan(loan);
    setIsDialogOpen(true);
  };

  // approve loan
  const handleApprove = (id: number) => {
    setLoans((prev) =>
      prev.map((loan) =>
        loan.id === id
          ? {
              ...loan,
              status: "Approved",
              balance: loan.balance + loan.loanAmount,
            }
          : loan
      )
    );
    setIsDialogOpen(false);
  };

  // redeem loan (includes interest)
  const handleRedeem = (id: number) => {
    setLoans((prev) =>
      prev.map((loan) => {
        if (loan.id !== id) return loan;

        const totalOwed = loan.loanAmount + loan.outstandingInterest;

        if (loan.balance >= totalOwed) {
          // full repayment
          return {
            ...loan,
            balance: loan.balance - totalOwed,
            loanAmount: 0,
            outstandingInterest: 0,
            status: "Redeemed",
          };
        } else {
          // partial repayment → deduct as much as possible
          const remainingOwed = totalOwed - loan.balance;
          return {
            ...loan,
            balance: 0,
            loanAmount: remainingOwed, // we keep everything under loanAmount for simplicity
            outstandingInterest: 0,
            status: "Overdue",
          };
        }
      })
    );
    setIsDialogOpen(false);
  };

  const filteredLoans =
    filter === "All" ? loans : loans.filter((l) => l.status === filter);

  const counts = {
    all: loans.length,
    pending: loans.filter((l) => l.status === "Pending").length,
    approved: loans.filter((l) => l.status === "Approved").length,
    redeemed: loans.filter((l) => l.status === "Redeemed").length,
    overdue: loans.filter((l) => l.status === "Overdue").length,
  };

  const statusBadgeClass = (status: LoanStatus) =>
    status === "Approved"
      ? "bg-green-500"
      : status === "Pending"
      ? "bg-yellow-500"
      : status === "Redeemed"
      ? "bg-blue-500"
      : "bg-red-500";

  return (
    <DashboardWrapper>
      <div className="space-y-6 w-full">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Loan Management</CardTitle>
            <div className="flex gap-2">
              {(["All", "Pending", "Approved", "Redeemed", "Overdue"] as const).map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-3 py-1 rounded ${
                      filter === tab ? "bg-slate-200" : "hover:bg-slate-100"
                    }`}
                  >
                    {tab} ({counts[tab.toLowerCase() as keyof typeof counts]})
                  </button>
                )
              )}
            </div>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Application Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Credit Limit</TableHead>
                  <TableHead>Loan Amount</TableHead>
                  <TableHead>Outstanding Interest</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLoans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell>{loan.name}</TableCell>
                    <TableCell>{loan.applicationDate}</TableCell>
                    <TableCell>{loan.expiryDate}</TableCell>
                    <TableCell>${loan.creditLimit}</TableCell>
                    <TableCell>${loan.loanAmount}</TableCell>
                    <TableCell>${loan.outstandingInterest.toFixed(2)}</TableCell>
                    <TableCell>${loan.balance}</TableCell>
                    <TableCell>
                      <Badge className={statusBadgeClass(loan.status)}>
                        {loan.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleView(loan)}
                      >
                        View
                      </Button>
                      {loan.status === "Pending" && (
                        <Button size="sm" onClick={() => handleApprove(loan.id)}>
                          Approve
                        </Button>
                      )}
                      {(loan.status === "Approved" || loan.status === "Overdue") &&
                        loan.loanAmount + loan.outstandingInterest > 0 && (
                          <Button
                            size="sm"
                            onClick={() => handleRedeem(loan.id)}
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            Redeem
                          </Button>
                        )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredLoans.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6">
                      No loans to display for "{filter}"
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Modal */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Loan Details</DialogTitle>
            </DialogHeader>
            {selectedLoan && (
              <div className="space-y-3">
                <p><strong>Name:</strong> {selectedLoan.name}</p>
                <p><strong>Balance:</strong> ${selectedLoan.balance}</p>
                <p><strong>Loan Amount:</strong> ${selectedLoan.loanAmount}</p>
                <p><strong>Outstanding Interest:</strong> ${selectedLoan.outstandingInterest.toFixed(2)}</p>
                <p><strong>Credit Limit:</strong> ${selectedLoan.creditLimit}</p>
                <p><strong>Application Date:</strong> {selectedLoan.applicationDate}</p>
                <p><strong>Expiry Date:</strong> {selectedLoan.expiryDate}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <Badge className={statusBadgeClass(selectedLoan.status)}>
                    {selectedLoan.status}
                  </Badge>
                </p>
                <div className="flex flex-col gap-2 pt-2">
                  {selectedLoan.status === "Pending" && (
                    <Button
                      onClick={() => handleApprove(selectedLoan.id)}
                      className="w-full"
                    >
                      Approve Loan
                    </Button>
                  )}
                  {(selectedLoan.status === "Approved" ||
                    selectedLoan.status === "Overdue") &&
                    selectedLoan.loanAmount + selectedLoan.outstandingInterest > 0 && (
                      <Button
                        onClick={() => handleRedeem(selectedLoan.id)}
                        className="w-full bg-blue-500 hover:bg-blue-600"
                      >
                        Redeem
                      </Button>
                    )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardWrapper>
  );
}
