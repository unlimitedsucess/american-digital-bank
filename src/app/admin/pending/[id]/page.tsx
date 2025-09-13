"use client";

import { useParams } from "next/navigation";
import DashboardWrapper from "@/components/admin/DashBoradWrapper";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const dummyUserData = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "+1234567890",
  countryCode: "+1",
  dateOfBirth: "1995-06-15",
  ssn: "1234", // PIN (masked in UI)
  address: "123 Main Street",
  country: "USA",
  state: "CA",
  city: "Los Angeles",
  zipCode: "90001",
  username: "johndoe",
  accountType: "personal",
  password: "SuperSecret123",
  passport: "/uploads/john-passport.png",
  license: "/uploads/john-license.png",
  agreeToTerms: true,
  agreeToMarketing: false,
  submittedAt: "2025-09-10",
};

export default function PendingUserDetailPage() {
  const { id } = useParams();
  const user = dummyUserData;

  return (
    <DashboardWrapper>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Pending User Details</h1>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">
              {user.firstName} {user.lastName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Grid Layout for Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Info */}
              <div className="space-y-3">
                <h2 className="font-semibold text-lg border-b pb-1">
                  Personal Information
                </h2>
                <p><b>Email:</b> {user.email}</p>
                <p><b>Phone:</b> {user.countryCode} {user.phone}</p>
                <p><b>Date of Birth:</b> {user.dateOfBirth}</p>
                <p><b>PIN (SSN):</b> •••• {user.ssn.slice(-2)}</p>
                <p><b>Address:</b> {user.address}</p>
                <p>
                  <b>Location:</b> {user.city}, {user.state}, {user.country} ({user.zipCode})
                </p>
              </div>

              {/* Account Info */}
              <div className="space-y-3">
                <h2 className="font-semibold text-lg border-b pb-1">
                  Account Details
                </h2>
                <p><b>Username:</b> {user.username}</p>
                <p><b>Account Type:</b> {user.accountType}</p>
                <p><b>Password:</b> ••••••••</p>
              </div>
            </div>

            {/* Verification Section */}
            <div>
              <h2 className="font-semibold text-lg border-b pb-1 mb-4">
                Verification
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="font-medium">Passport Photograph</p>
                  <img
                    src={user.passport}
                    alt="Passport"
                    className="w-full max-w-xs h-40 object-cover border rounded-lg shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Driver’s License / ID</p>
                  <img
                    src={user.license}
                    alt="License"
                    className="w-full max-w-xs h-40 object-cover border rounded-lg shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Agreements */}
            <div>
              <h2 className="font-semibold text-lg border-b pb-1 mb-2">
                Agreements
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <p>
                  <b>Terms & Conditions:</b>{" "}
                  {user.agreeToTerms ? "✅ Accepted" : "❌ Not Accepted"}
                </p>
                <p>
                  <b>Marketing Emails:</b>{" "}
                  {user.agreeToMarketing ? "✅ Subscribed" : "❌ Declined"}
                </p>
              </div>
            </div>

            {/* Submission Date */}
            <p className="text-sm text-gray-500">
              Submitted At: {user.submittedAt}
            </p>
          </CardContent>
        </Card>

        {/* Approve/Decline Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="bg-green-600 hover:bg-green-700 text-white flex-1">
            Approve
          </Button>
          <Button
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-100 flex-1"
          >
            Decline
          </Button>
        </div>
      </div>
    </DashboardWrapper>
  );
}
