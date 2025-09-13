"use client";

import { Button } from "@/components/ui/button";

interface UserCardProps {
  id: number;
  name: string;
  email: string;
  phone: string;
  accountNumber: string;
  accountType: string;
  status: "pending" | "approved";
  onApprove?: () => void;
  onDecline?: () => void;
}

export default function UserCard({
  name,
  email,
  phone,
  accountNumber,
  accountType,
  status,
  onApprove,
  onDecline,
}: UserCardProps) {
  return (
    <div className="p-4 border rounded shadow bg-white flex justify-between items-center">
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm">{email}</p>
        <p className="text-sm">Phone: {phone}</p>
        <p className="text-sm">Acc No: {accountNumber} ({accountType})</p>
      </div>

      {status === "pending" && (
        <div className="flex gap-2">
          <Button onClick={onApprove}>Approve</Button>
          <Button variant="destructive" onClick={onDecline}>Decline</Button>
        </div>
      )}
    </div>
  );
}
