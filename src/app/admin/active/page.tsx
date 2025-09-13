"use client";

import DashboardWrapper from "@/components/admin/DashBoradWrapper";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Dummy active users list
const activeUsers = [
  { id: "1", firstName: "Jane", lastName: "Smith", email: "jane@example.com", status: "Active" },
  { id: "2", firstName: "David", lastName: "Brown", email: "david@example.com", status: "Active" },
  { id: "3", firstName: "Sarah", lastName: "Johnson", email: "sarah@example.com", status: "Active" },
];

export default function ActiveUsersPage() {
  return (
    <DashboardWrapper>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Active Users</h1>
        <p className="text-gray-600">Total Active Users: {activeUsers.length}</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeUsers.map((user) => (
            <Card key={user.id} className="shadow-md hover:shadow-lg transition">
              <CardHeader>
                <CardTitle>
                  {user.firstName} {user.lastName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm font-medium text-green-600">{user.status}</p>

                <div className="mt-4 flex gap-3">
                  <Link href={`/admin/active/${user.id}`}>
                    <Button size="sm">View</Button>
                  </Link>
                  <Button size="sm" variant="outline">
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardWrapper>
  );
}
