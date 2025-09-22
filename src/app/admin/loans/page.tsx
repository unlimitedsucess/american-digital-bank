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

import { updateLoanStatus } from "@/store/data/admin-slice";
import { useHttp } from "@/hooks/use-http";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function LoanManagementPage() {
  const dispatch = useDispatch();
  const { sendHttpRequest: LoanActionRequest } = useHttp();

  const token = useSelector((state: any) => state.token?.token);
  const router = useRouter();

  const loanData = useSelector((state: RootState) => state.admin.loans);

  const [selectedLoan, setSelectedLoan] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "redeem" | "overdue" | "rejected"
  >("all");

  const [loadingActions, setLoadingActions] = useState<
    { id: string; action: "approve" | "decline" | "redeem" }[]
  >([]);

  const isLoading = (id: string, action: "approve" | "decline" | "redeem") =>
    loadingActions.some((a) => a.id === id && a.action === action);

  // redirect if not logged in
  useEffect(() => {
    if (!token) {
      router.push("/adminlogin");
    }
  }, [token, router]);

  // ========== HANDLERS ==========
  const handleView = (loan: any) => {
    setSelectedLoan(loan);
    setIsDialogOpen(true);
  };

  const handleApprove = (id: string) => {
    setLoadingActions((prev) => [...prev, { id, action: "approve" }]);
    LoanActionRequest({
      requestConfig: {
        url: "admin/loan/status",
        method: "PATCH",
        body: { loanId: id, status: "approved" }, // 👈 lowercase
        token,
        isAuth: true,
      },
      successRes: () => {
        dispatch(updateLoanStatus({ id, status: "approved" }));
        setIsDialogOpen(false);
        setLoadingActions((prev) =>
          prev.filter((a) => !(a.id === id && a.action === "approve"))
        );
      },
    });
  };

  const handleDecline = (id: string) => {
    setLoadingActions((prev) => [...prev, { id, action: "decline" }]);
    LoanActionRequest({
      requestConfig: {
        url: "admin/loan/status",
        method: "PATCH",
        body: { loanId: id, status: "rejected" }, // 👈 backend uses "rejected"
        token,
        isAuth: true,
      },
      successRes: () => {
        dispatch(updateLoanStatus({ id, status: "rejected" }));
        setIsDialogOpen(false);
        setLoadingActions((prev) =>
          prev.filter((a) => !(a.id === id && a.action === "decline"))
        );
      },
      errorRes: () => {
        setLoadingActions((prev) =>
          prev.filter((a) => !(a.id === id && a.action === "decline"))
        );
      },
    });
  };

  const handleRedeem = (id: string) => {
    setLoadingActions((prev) => [...prev, { id, action: "redeem" }]);
    LoanActionRequest({
      requestConfig: {
        url: "admin/loan/status",
        method: "PATCH",
        body: { loanId: id, status: "redeem" }, // 👈 backend expects lowercase "redeem"
        token,
        isAuth: true,
      },
      successRes: () => {
        dispatch(updateLoanStatus({ id, status: "redeem" }));
        setIsDialogOpen(false);
        setLoadingActions((prev) =>
          prev.filter((a) => !(a.id === id && a.action === "redeem"))
        );
      },
      errorRes: () => {
        setLoadingActions((prev) =>
          prev.filter((a) => !(a.id === id && a.action === "redeem"))
        );
      },
    });
  };

  const FILTER_LABELS: Record<typeof filter, string> = {
    all: "All",
    pending: "Pending",
    approved: "Approved",
    redeem: "Redeemed",
    overdue: "Overdue",
    rejected: "Declined",
  };

  // ========== FILTER ==========
  const filteredLoans =
    filter === "all" ? loanData : loanData.filter((l) => l.status === filter);

  const counts = {
    all: loanData.length,
    pending: loanData.filter((l) => l.status === "pending").length,
    approved: loanData.filter((l) => l.status === "approved").length,
    redeem: loanData.filter((l) => l.status === "redeem").length,
    overdue: loanData.filter((l) => l.status === "overdue").length,
    rejected: loanData.filter((l) => l.status === "rejected").length,
  };

  const statusBadgeClass = (status: string) =>
    status === "approved"
      ? "bg-green-500"
      : status === "pending"
      ? "bg-yellow-500"
      : status === "redeem"
      ? "bg-blue-500"
      : status === "rejected"
      ? "bg-gray-500"
      : "bg-red-500";

  return (
    <DashboardWrapper>
      <div className="space-y-6 w-full">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Loan Management</CardTitle>
            <div className="flex gap-2">
              {(
                Object.keys(FILTER_LABELS) as (keyof typeof FILTER_LABELS)[]
              ).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1 rounded ${
                    filter === tab ? "bg-slate-200" : "hover:bg-slate-100"
                  }`}
                >
                  {FILTER_LABELS[tab]} ({counts[tab]})
                </button>
              ))}
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
                  <TableHead>Interest Amount</TableHead>
                  <TableHead>Loan Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLoans.map((loan: any) => (
                  <TableRow key={loan._id}>
                    <TableCell>{loan.userId?.firstName}</TableCell>
                    <TableCell>
                      {loan.activationDate
                        ? new Date(loan.activationDate).toLocaleString()
                        : "N/A"}
                    </TableCell>

                    <TableCell>
                      {loan.lastInterestAppliedDate
                        ? new Date(
                            loan.lastInterestAppliedDate
                          ).toLocaleString()
                        : "N/A"}
                    </TableCell>

                    <TableCell>${loan.loanAmount}</TableCell>
                    <TableCell>${loan.interestAmount}</TableCell>
                    <TableCell>${loan.loanBalance}</TableCell>
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
                      {loan.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(loan._id)}
                            disabled={isLoading(loan._id, "approve")}
                          >
                            {isLoading(loan._id, "approve") ? (
                              <LoadingSpinner />
                            ) : (
                              "Approve"
                            )}
                          </Button>
                          <Button
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 text-white"
                            onClick={() => handleDecline(loan._id)}
                            disabled={isLoading(loan._id, "decline")}
                          >
                            {isLoading(loan._id, "decline") ? (
                              <LoadingSpinner />
                            ) : (
                              "Decline"
                            )}
                          </Button>
                        </>
                      )}
                      {loan.status === "approved" &&
                        loan.lastInterestAppliedDate &&
                        new Date(loan.lastInterestAppliedDate) < new Date() && (
                          <Button
                            size="sm"
                            onClick={() => handleRedeem(loan._id)}
                            disabled={isLoading(loan._id, "redeem")}
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            {isLoading(loan._id, "redeem") ? (
                              <LoadingSpinner />
                            ) : (
                              "Redeem"
                            )}
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
                <p>
                  <strong>Name:</strong> {selectedLoan.userId?.firstName}
                </p>
                <p>
                  <strong>Loan Amount:</strong> ${selectedLoan.loanAmount}
                </p>
                <p>
                  <strong>Outstanding Interest:</strong> $
                  {selectedLoan.outstandingInterest?.toFixed(2) ?? 0}
                </p>
                <p>
                  <strong>Credit Limit:</strong> ${selectedLoan.creditLimit}
                </p>
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
                  {selectedLoan.status === "pending" && (
                    <>
                      <Button
                        onClick={() => handleApprove(selectedLoan._id)}
                        className="w-full bg-green-600 hover:bg-green-700"
                        disabled={isLoading(selectedLoan._id, "approve")}
                      >
                        {isLoading(selectedLoan._id, "approve") ? (
                          <LoadingSpinner />
                        ) : (
                          "Approve Loan"
                        )}
                      </Button>
                      <Button
                        onClick={() => handleDecline(selectedLoan._id)}
                        className="w-full bg-red-500 hover:bg-red-600"
                        disabled={isLoading(selectedLoan._id, "decline")}
                      >
                        {isLoading(selectedLoan._id, "decline") ? (
                          <LoadingSpinner />
                        ) : (
                          "Decline Loan"
                        )}
                      </Button>
                    </>
                  )}

                  {(selectedLoan.status === "approved" ||
                    selectedLoan.status === "overdue") && (
                    <Button
                      onClick={() => handleRedeem(selectedLoan._id)}
                      disabled={isLoading(selectedLoan._id, "redeem")}
                      className="w-full bg-blue-500 hover:bg-blue-600"
                    >
                      {isLoading(selectedLoan._id, "redeem") ? (
                        <LoadingSpinner />
                      ) : (
                        "Redeem Loan"
                      )}
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
