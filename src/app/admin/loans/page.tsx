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
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";

import { updateLoanStatus } from "@/store/data/admin-slice"; // make sure you have this action
import { useHttp } from "@/hooks/use-http";

export default function LoanManagementPage() {
  const dispatch = useDispatch();
  const { loading, sendHttpRequest: LoanActionRequest } = useHttp();

    const token = useSelector((state: any) => state.token?.token);
    const router = useRouter();

  const loanData = useSelector((state: RootState) => state.admin.loans);

  const [selectedLoan, setSelectedLoan] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<"All" | "Pending" | "Approved" | "Redeemed" | "Overdue">("All");

  // ========== HANDLERS ==========
  const handleView = (loan: any) => {
    setSelectedLoan(loan);
    setIsDialogOpen(true);
  };

    useEffect(() => {
      if (!token) {
        router.push("/adminlogin");
      }
    }, [token, router]);
  

const handleApprove = (id: string) => {
  LoanActionRequest({
    requestConfig: {
        url: `/admin/transaction/`,
        method: "DELETE",
        token,
        isAuth: true,
      body: { status: "Approved" },
    },
    successRes: () => {
      dispatch(updateLoanStatus({ id, status: "Approved" }));
      setIsDialogOpen(false);
    },
  });
};
  // const handleRedeem = async (id: string) => { 
  //   try {  
  //     await sendRequest({
  //       url: `/admin/update/loan/${id}`,
  //       method: "PATCH",
  //       body: { status: "Redeemed" },
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     dispatch(updateLoanStatus({ id, status: "Redeemed" }));
  //     setIsDialogOpen(false);
  //   } catch (err) {
  //     console.error("Redeem failed", err);
  //   }
  // };

  // ========== FILTER ==========
  const filteredLoans =
    filter === "All" ? loanData : loanData.filter((l) => l.status === filter);

  const counts = {
    All: loanData.length,
    Pending: loanData.filter((l) => l.status === "Pending").length,
    Approved: loanData.filter((l) => l.status === "Approved").length,
    Redeemed: loanData.filter((l) => l.status === "Redeemed").length,
    Overdue: loanData.filter((l) => l.status === "Overdue").length,
  };

  const statusBadgeClass = (status: string) =>
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
                    {tab} ({counts[tab]})
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
                  <TableHead>Loan Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLoans.map((loan: any) => (
                  <TableRow key={loan._id}>
                    <TableCell>{loan.userId?.firstName}</TableCell>
                    <TableCell>
                      {new Date(loan.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {loan.expiryDate
                        ? new Date(loan.expiryDate).toLocaleString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>${loan.loanAmount}</TableCell>
                    <TableCell>
                      <Badge className={statusBadgeClass(loan?.status)}>
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
                        <Button size="sm" onClick={() => handleApprove(loan._id)}>
                          Approve
                        </Button>
                      )}
                      {(loan.status === "Approved" || loan.status === "Overdue") && (
                        <Button
                          size="sm"
                          onClick={() => (loan._id)}
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
                <p><strong>Name:</strong> {selectedLoan.userId?.firstName}</p>
                <p><strong>Loan Amount:</strong> ${selectedLoan.loanAmount}</p>
                <p><strong>Outstanding Interest:</strong> ${selectedLoan.outstandingInterest?.toFixed(2) ?? 0}</p>
                <p><strong>Credit Limit:</strong> ${selectedLoan.creditLimit}</p>
                <p>
                  <strong>Application Date:</strong>{" "}
                  {new Date(selectedLoan.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Expiry Date:</strong>{" "}
                  {selectedLoan.expiryDate
                    ? new Date(selectedLoan.expiryDate).toLocaleString()
                    : "N/A"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <Badge className={statusBadgeClass(selectedLoan.status)}>
                    {selectedLoan.status}
                  </Badge>
                </p>
                <div className="flex flex-col gap-2 pt-2">
                  {selectedLoan.status === "Pending" && (
                    <Button
                      onClick={() => handleApprove(selectedLoan._id)}
                      className="w-full"
                    >
                      Approve Loan
                    </Button>
                  )}
                  {(selectedLoan.status === "Approved" ||
                    selectedLoan.status === "Overdue") && (
                    <Button
                      onClick={() => (selectedLoan._id)}
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
