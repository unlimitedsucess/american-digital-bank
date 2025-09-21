"use client";


import Link from "next/link";
import DashboardWrapper from "@/components/admin/DashBoradWrapper";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";



export default function PendingUsersPage() {
 
  const AdminData = useSelector((state: RootState) => state.admin);
  const router = useRouter();
  const token = useSelector((state: any) => state.token?.token);

    useEffect(() => {
    if (!token) {
      router.push("/adminlogin");
    }
  }, [token, router]);

  const pendingUsers = AdminData.users.filter(
    (user) => user.accountStatus === "pending"
  );

  
  return (
    <DashboardWrapper>
      <div>
        <h1 className="text-2xl font-bold mb-6">Pending Users</h1>
        <p className="mb-4 text-gray-600">
          Total Pending Users: {pendingUsers.length}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingUsers.map((user) => (
            <Link key={user._id} href={`/admin/pending/${user._id}`}>
              <Card className="cursor-pointer hover:shadow-lg transition">
                <CardHeader>
                  <CardTitle>
                    {user.firstName} {user.lastName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-400">
                    Submitted: {new Date(user.createdAt).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </DashboardWrapper>
  );
}
