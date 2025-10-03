"use client";

import { useEffect, useState } from "react";
import DashboardWrapper from "@/components/admin/DashBoradWrapper";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Country } from "country-state-city";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useDispatch, useSelector } from "react-redux";
import { deleteTransaction, addTransaction } from "@/store/data/admin-slice";
import { useRouter, useParams } from "next/navigation";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { DomesticTransfer, Transaction } from "@/types/global";

export default function UserHistoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const token = useSelector((state: any) => state.token?.token);
  const user = useSelector((state: RootState) =>
    state.admin.users.find((u) => String(u._id) === String(id))
  );

  useEffect(() => {
    if (!token) {
      router.push("/adminlogin");
    }
  }, [token, router]);

  const transactions = useSelector((state: RootState) =>
    state.admin.transactions.filter((t) => {
      const userId = typeof t.userId === "string" ? t.userId : t.userId?._id;
      return String(userId) === String(id);
    })
  );

  const { sendHttpRequest: DeleteTransactionRequest } = useHttp();

  const dispatch = useDispatch();
  const [loadingIds, setLoadingIds] = useState<string[]>([]);

  const handleDelete = (transactionId: string) => {
    setLoadingIds((prev) => [...prev, transactionId]);

    DeleteTransactionRequest({
      requestConfig: {
        url: `/admin/transaction/${transactionId}`,
        method: "DELETE",
        token,
        isAuth: true,
      },
      successRes: () => {
        toast.success("Transaction Deleted");
        setLoadingIds((prev) => prev.filter((id) => id !== transactionId));
      },
      errorRes: () => {
        setLoadingIds((prev) => prev.filter((id) => id !== transactionId));
      },
    });
    dispatch(deleteTransaction(transactionId));
  };

  const [openForm, setOpenForm] = useState(false);
  const [formType, setFormType] = useState<"credit" | "debit" | null>(null);
  const [method, setMethod] = useState<"wire" | "domestic" | null>(null);

  // form fields
  const [country, setCountry] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [date, setDate] = useState("");
  const [transactionType, setTranType] = useState("");
  const [status, setStatus] = useState("");

  const { loading: isSubmitting, sendHttpRequest: submitTransfer } = useHttp();

  const [formData, setFormData] = useState<DomesticTransfer>({
    accountType: "",
    recipientName: "",
    accountNumber: "",
    bankName: "",
    description: "",
    amount: 0,
    transactionDate: "",
  });

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

    if (
      !formData.accountNumber ||
      !formData.accountType ||
      !formData.amount ||
      !formData.recipientName
    ) {
      toast.error("Please fill in all fields!");
      return;
    }

    if (!method || !formType) {
      toast.error("Please select transfer method and type!");
      return;
    }

    const payload = {
      ...formData,
      userId: user?._id,
      transactionDate: date || new Date().toISOString(),
      transactionDirection: formType,
      transactionType: transactionType,
      status: status || "completed",
      ...(method === "wire" && {
        country,
        swiftCode,
        routingNumber,
        bankName: undefined,
      }),
    };
    console.log("Submitting transfer with payload:", payload);
    const endpoint =
      method === "wire"
        ? "/admin/transaction/wire"
        : "/admin/transaction/domestic";

    submitTransfer({
      requestConfig: {
        url: endpoint,
        method: "POST",
        body: payload,
        token,
        isAuth: true,
        successMessage:
          method === "wire"
            ? "Wire Transfer Successful"
            : "Domestic Transfer Successful",
      },
      successRes: (data: any) => {
        toast.success(
          method === "wire"
            ? "Wire transfer successful!"
            : "Domestic transfer successful!"
        );
        const tx = data?.transaction || data;

        const newTx: Transaction = {
          _id: tx._id || tx.id,
          id: tx.id || tx._id, // normalize backend id
          accountType: tx.accountType,
          recipientName: tx.recipientName,
          accountNumber: tx.accountNumber,
          country: tx.country,
          swiftCode: tx.swiftCode,
          routingNumber: tx.routingNumber,
          description: tx.description,
          amount: tx.amount,
          transferType: tx.transferType,
          transactionType: tx.transactionType,
          transactionDirection: tx.transactionDirection,
          status: tx.status || "pending",
          createdAt: tx.createdAt || new Date().toISOString(),
          updatedAt: tx.updatedAt || new Date().toISOString(),
          bankName: tx.bankName,
          userId: {
            _id: tx.userId?._id || tx.userId || "", // make sure this exists
          },
        };

        dispatch(addTransaction(newTx));
        toast.success("Transaction added!");

        resetForm();
        setOpenForm(false);
      },
      errorRes: () => {
        toast.error("Failed to process transfer");
      },
    });
  };

  const resetForm = () => {
    setFormData({
      accountType: "",
      recipientName: "",
      accountNumber: "",
      bankName: "",
      description: "",
      amount: 0,
      transactionDate: "",
    });
    setCountry("");
    setSwiftCode("");
    setRoutingNumber("");
    setDate("");
    setMethod(null);
    setFormType(null);
    setTranType("");
    setStatus("");
  };

  return (
    <DashboardWrapper>
      <div className="space-y-6 w-full">
        <h1 className="text-2xl font-bold">User Transaction History</h1>

        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full border-collapse px-2 text-nowrap">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-2">Date/Time</th>
                  <th className="p-2">Account Type</th>
                  <th className="p-2">Transaction Type</th>
                  <th className="p-2">Method</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-b">
                    <td className="p-2">
                      {new Date(t.createdAt).toLocaleString()}
                    </td>
                    <td className="p-2 capitalize">{t.accountType}</td>
                    <td className="p-2 capitalize">{t.transferType}</td>
                    <td className="p-2 capitalize">{t.transactionDirection}</td>
                    <td className="p-2">${t.amount}</td>
                    <td className="p-2 flex gap-2">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button
                        type="button"
                        disabled={loadingIds.includes(t.id)}
                        onClick={() => handleDelete(t.id)}
                        size="sm"
                        variant="destructive"
                      >
                        {loadingIds.includes(t.id) ? (
                          <LoadingSpinner />
                        ) : (
                          "Delete"
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 space-x-4">
              <Button
                onClick={() => {
                  setFormType("credit");
                  setOpenForm(true);
                }}
              >
                + Credit
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setFormType("debit");
                  setOpenForm(true);
                }}
              >
                + Debit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Modal */}
        <Dialog
          open={openForm}
          onOpenChange={(o) => {
            setOpenForm(o);
            if (!o) resetForm();
          }}
        >
          <DialogContent className="max-w-2xl w-full">
            <DialogHeader>
              <DialogTitle>
                {formType
                  ? `New ${formType.toUpperCase()} Transaction`
                  : "Transaction"}
              </DialogTitle>
            </DialogHeader>

            {!method ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => setMethod("wire")}>Wire Transfer</Button>
                <Button onClick={() => setMethod("domestic")}>Domestic</Button>
              </div>
            ) : (
              <form
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                onSubmit={handleSubmit}
              >
                {/* Account Type */}
                <label className="block col-span-1">
                  Account Type
                  <select
                    className="w-full border rounded p-2 mt-1"
                    value={formData.accountType}
                    onChange={(e) =>
                      handleChange("accountType", e.target.value)
                    }
                  >
                    <option value="">Select Account Type</option>
                    <option value="savings">Savings</option>
                    <option value="current">Current</option>
                    <option value="checking">Checking</option>
                    <option value="fixed">Fixed</option>
                    <option value="non-resident">Non-Resident</option>
                    <option value="online">Online</option>
                    <option value="domiciliary">Domiciliary</option>
                    <option value="joint">Joint</option>
                  </select>
                </label>

                {/* Recipient */}
                <label className="block col-span-1">
                  Recipient Name
                  <Input
                    placeholder="Recipient Name"
                    value={formData.recipientName}
                    onChange={(e) =>
                      handleChange("recipientName", e.target.value)
                    }
                  />
                </label>

                {/* Account Number */}
                <label className="block col-span-1">
                  Account Number
                  <Input
                    placeholder="Account Number"
                    value={formData.accountNumber}
                    onChange={(e) =>
                      handleChange("accountNumber", e.target.value)
                    }
                  />
                </label>

                {/* Amount */}
                <label className="block col-span-1">
                  Amount
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={formData.amount}
                    onChange={(e) =>
                      handleChange("amount", Number(e.target.value))
                    }
                  />
                </label>

                {/* Description */}
                <label className="block col-span-1">
                  Description
                  <Input
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                  />
                </label>

                {/* Date */}
                <label className="block col-span-1">
                  Date
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </label>
                <label className="block col-span-1">
                  Transaction Type
                  <select
                    className="w-full border rounded p-2 mt-1"
                    value={transactionType}
                    onChange={(e) => setTranType(e.target.value)}
                  >
                    <option value="">Transaction Type</option>
                    <option value="transfer">Transfer</option>
                    <option value="withdrawal">Withdrawal</option>
                    <option value="deposit">Deposit</option>
                  </select>
                </label>
                <label className="block col-span-1">
                  Transaction status
                  <select
                    className="w-full border rounded p-2 mt-1"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="">Select transaction status</option>
                    <option value="pending">Pending</option>
                    <option value="complete">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </label>

                {method === "domestic" && (
                  <label className="block col-span-1">
                    Bank Name
                    <Input
                      placeholder="Bank Name"
                      value={formData.bankName}
                      onChange={(e) => handleChange("bankName", e.target.value)}
                    />
                  </label>
                )}

                {/* Wire-only Fields */}
                {method === "wire" && (
                  <>
                    <label className="block col-span-1">
                      Country
                      <select
                        className="w-full border rounded p-2 mt-1"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      >
                        <option value="">Select Country</option>
                        {Country.getAllCountries().map((c) => (
                          <option key={c.isoCode} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block col-span-1">
                      SWIFT Code
                      <Input
                        placeholder="SWIFT Code"
                        value={swiftCode}
                        maxLength={11}
                        onChange={(e) => setSwiftCode(e.target.value)}
                      />
                    </label>

                    <label className="block col-span-1">
                      Routing Number
                      <Input
                        placeholder="Routing Number"
                        value={routingNumber}
                        maxLength={9}
                        onChange={(e) => setRoutingNumber(e.target.value)}
                      />
                    </label>
                  </>
                )}

                <div className="col-span-1 sm:col-span-2">
                  <Button type="submit" className="w-full mt-2">
                    {isSubmitting && <LoadingSpinner />}
                    {method === "wire"
                      ? "Submit Wire Transfer"
                      : "Submit Domestic Transfer"}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardWrapper>
  );
}
