"use client";

import DashboardWrapper from "@/components/admin/DashBoradWrapper";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RootState } from "@/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAdminData, setLoading, setError } from "@/store/data/admin-slice";
import { useHttp } from "@/hooks/use-http";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


export default function AdminDashboardPage() {
  
  const router = useRouter();
 
  const { sendHttpRequest: userInforHttpRequest } = useHttp();
  const dispatch = useDispatch();
 

  const token = useSelector((state: any) => state.token?.token);
  const AdminData = useSelector(
    (state: RootState) => state.admin
  );

console.log("Admin Redux State:", AdminData);

const pendingUsers = AdminData.users.filter(user => user.accountStatus
 === 'pending');
const activeUsers = AdminData.users.filter(user => user.accountStatus
 === 'active');

const suspendedUsers = AdminData.users.filter(user => user.accountStatus
 === 'suspended');

 const loanRequests = AdminData.loans.filter(loan => loan.status === 'pending');
 const approvedLoans = AdminData.loans.filter(loan => loan.status === 'approved');
 const rejectedLoans = AdminData.loans.filter(loan => loan.status === 'rejected');

const totalLoans = AdminData.loans.length;

  useEffect(() => {
    if (!token) {
      toast.error("No auth token found for admin.");
      router.push("/adminlogin");

    };

    dispatch(setLoading(true));

    userInforHttpRequest({
      requestConfig: {
        url: "/admin/info", // ✅ endpoint that returns users, transactions, loans, cards
        method: "GET",
        token,
        isAuth: true,
        successMessage: "Admin details fetched",
        userType: "admin",
      },
      successRes: (res: any) => {
        const resData = res?.data?.data;
        console.log("Admin API response:", resData);

        // ✅ Save full admin dataset into redux
        dispatch(
          setAdminData({
            users: resData?.users,
            transactions: resData?.transactions,
            loans: resData?.loans,
            cards: resData?.cards,
          })
        );

        dispatch(setLoading(false));
      },
      errorRes: (err: any) => {
        dispatch(setError(err.message || "Failed to fetch admin details"));
        dispatch(setLoading(false));
      },
    });
  }, [token, dispatch]);

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
              <p className="text-2xl font-bold">{pendingUsers.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{activeUsers.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suspended Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {suspendedUsers.length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{AdminData.users.length}</p>
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
              <p className="text-2xl font-bold">{loanRequests.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Approved Loans</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{approvedLoans.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rejected Loans</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {rejectedLoans.length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Loans</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {totalLoans}
              </p>
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
