"use client";

import { useState } from "react";
import DashboardWrapper from "@/components/admin/DashBoradWrapper";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type Transaction = {
  id: string;
  type: "credit" | "debit";
  method: "wire" | "domestic";
  amount: number;
  date: string;
  description?: string;
};

export default function UserHistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "1", type: "credit", method: "wire", amount: 500, date: "2025-09-01" },
    { id: "2", type: "debit", method: "domestic", amount: 200, date: "2025-09-05" },
  ]);

  const [openForm, setOpenForm] = useState(false);
  const [formType, setFormType] = useState<"credit" | "debit" | null>(null);
  const [method, setMethod] = useState<"wire" | "domestic" | null>(null);

  // form fields
  const [accountType, setAccountType] = useState("");
  const [bankName, setBankName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [country, setCountry] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const resetForm = () => {
    setFormType(null);
    setMethod(null);
    setAccountType("");
    setBankName("");
    setRecipientName("");
    setAccountNumber("");
    setCountry("");
    setSwiftCode("");
    setRoutingNumber("");
    setAmount("");
    setDescription("");
    setDate("");
  };

  const handleAddTransaction = () => {
    if (!formType || !method) return;
    setTransactions([
      ...transactions,
      {
        id: Date.now().toString(),
        type: formType,
        method,
        amount: Number(amount),
        date,
        description,
      },
    ]);
    setOpenForm(false);
    resetForm();
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
                  <th className="p-2">Date</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Method</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-b">
                    <td className="p-2">{t.date}</td>
                    <td className="p-2 capitalize">{t.type}</td>
                    <td className="p-2 capitalize">{t.method}</td>
                    <td className="p-2">${t.amount}</td>
                    <td className="p-2 flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="destructive">Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 space-x-4">
              <Button onClick={() => { setFormType("credit"); setOpenForm(true); }}>+ Credit</Button>
              <Button variant="outline" onClick={() => { setFormType("debit"); setOpenForm(true); }}>+ Debit</Button>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Modal */}
        <Dialog open={openForm} onOpenChange={(o) => { setOpenForm(o); if (!o) resetForm(); }}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {formType ? `New ${formType.toUpperCase()} Transaction` : "Transaction"}
              </DialogTitle>
            </DialogHeader>

            {/* Step 1: Choose Method */}
            {!method ? (
              <div className="flex gap-4">
                <Button onClick={() => setMethod("wire")}>Wire Transfer</Button>
                <Button onClick={() => setMethod("domestic")}>Domestic</Button>
              </div>
            ) : (
              /* Step 2: Fill Form */
              <div className="space-y-4">
                {/* Common Fields */}
                <select
                  className="w-full border rounded p-2"
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                >
                  <option value="">Select Account Type</option>
                  <option value="savings">Savings</option>
                  <option value="current">Current</option>
                </select>

                <Input placeholder="Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} />
                <Input placeholder="Recipient Name" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} />
                <Input placeholder="Account Number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />

                {method === "wire" && (
                  <>
                    <Input placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
                    <Input placeholder="SWIFT Code" value={swiftCode} onChange={(e) => setSwiftCode(e.target.value)} />
                    <Input placeholder="Routing Number" value={routingNumber} onChange={(e) => setRoutingNumber(e.target.value)} />
                  </>
                )}

                <Input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
                <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

                <Button className="w-full" onClick={handleAddTransaction}>Submit</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardWrapper>
  );
}
