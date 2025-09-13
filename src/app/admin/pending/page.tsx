"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardWrapper from "@/components/admin/DashBoradWrapper";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type User = {
  id: string;
  name: string;
  email: string;
  submittedAt: string;
};

const dummyPendingUsers: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com", submittedAt: "2025-09-10" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", submittedAt: "2025-09-11" },
  { id: "3", name: "Michael Johnson", email: "mike@example.com", submittedAt: "2025-09-09" },
];

export default function PendingUsersPage() {
  const [users] = useState(dummyPendingUsers);

  return (
    <DashboardWrapper>
      <div>
        <h1 className="text-2xl font-bold mb-6">Pending Users</h1>
        <p className="mb-4 text-gray-600">Total Pending Users: {users.length}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <Link key={user.id} href={`/admin/pending/${user.id}`}>
              <Card className="cursor-pointer hover:shadow-lg transition">
                <CardHeader>
                  <CardTitle>{user.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-400">
                    Submitted: {user.submittedAt}
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
