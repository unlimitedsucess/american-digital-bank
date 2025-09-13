"use client";

import DashboardWrapper from "@/components/admin/DashBoradWrapper";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <DashboardWrapper>
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* ===== User Stats ===== */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Pending Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">12</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">256</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suspended Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">8</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">276</p>
            </CardContent>
          </Card>
        </div>

        {/* ===== Loan Stats ===== */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Loan Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">15</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Approved Loans</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">42</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rejected Loans</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">6</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Loans</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">63</p>
            </CardContent>
          </Card>
        </div>

        {/* ===== Transactions Summary ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Deposits</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">$1,240,000</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Debits</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">$845,000</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Net Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">$395,000</p>
            </CardContent>
          </Card>
        </div>

        {/* ===== Recent Activity ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent User Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>👤 John Doe — Pending</li>
                <li>👤 Sarah Smith — Active</li>
                <li>👤 Mike Johnson — Suspended</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>💰 Deposit — $5,000 — by John Doe</li>
                <li>💸 Debit — $1,200 — by Sarah Smith</li>
                <li>💰 Deposit — $3,800 — by Mike Johnson</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardWrapper>
  );
}
