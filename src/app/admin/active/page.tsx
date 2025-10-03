"use client";

import DashboardWrapper from "@/components/admin/DashBoradWrapper";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

// Dummy active users list

export default function ActiveUsersPage() {
  const AdminData = useSelector((state: RootState) => state.admin);

  const activeUsers = AdminData.users.filter(
    (user) =>
      user.accountStatus === "active" || user.accountStatus === "suspended"
  );


  return (
    <DashboardWrapper>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Active Users</h1>
        <p className="text-gray-600">
          Total Active Users: {activeUsers.length}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeUsers.map((user) => (
            <Card
              key={user._id}
              className="shadow-md hover:shadow-lg transition"
            >
              <CardHeader>
                <CardTitle>
                  {user.firstName} {user.lastName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p
                  className={`text-sm font-medium ${
                    user.accountStatus === "suspended"
                      ? "text-orange-500"
                      : "text-green-600"
                  }`}
                >
                  {user.accountStatus}
                </p>

                <div className="mt-4 flex gap-3">
                  <Link href={`/admin/active/${user._id}`}>
                    <Button size="sm">View</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardWrapper>
  );
}
