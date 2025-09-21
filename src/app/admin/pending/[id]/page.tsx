"use client";

import { useParams, useRouter } from "next/navigation";
import DashboardWrapper from "@/components/admin/DashBoradWrapper";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, setAdminData } from "@/store/data/admin-slice";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useHttp } from "@/hooks/use-http";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function PendingUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const token = useSelector((state: any) => state.token?.token);
  const router = useRouter();
const dispatch = useDispatch();
  const { loading, sendHttpRequest: UserApprRequest } = useHttp();

  const handleApproval = (userId: string) => {
    if (!user) return;
    UserApprRequest({
      requestConfig: {
        url: "/admin/account/status",
        method: "PATCH",
        token,
        isAuth: true,
        body: { status: "active", userId },
        successMessage: "User Approved successfully",
      },
      successRes: () => {
        const updatedUser = { ...user, accountStatus: "active" };
        dispatch(updateUser(updatedUser));
        toast.success("User  Approved");
        router.push("/admin/active");
      },
    });
  };
  useEffect(() => {
    if (!token) {
      router.push("/adminlogin");
    }
  }, [token, router]);

  // Find user in Redux
  const user = useSelector((state: RootState) =>
    state.admin.users.find((u) => String(u._id) === String(id))
  );

  if (!user) {
    return (
      <DashboardWrapper>
        <p className="text-red-500 text-center mt-10">
          ❌ User not found or still loading.
        </p>
      </DashboardWrapper>
    );
  }

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
                <p>
                  <b>Email:</b> {user.email}
                </p>
                <p>
                  <b>Phone:</b> {user.phoneNo}
                </p>
                <p>
                  <b>Date of Birth:</b> {user.dob}
                </p>
                <p>
                  <b>SSN:</b> {user.ssn}
                </p>
                <p>
                  <b>PIN :</b> {user.pin}
                </p>
                <p>
                  <b>Address:</b> {user.address}
                </p>
                <p>
                  <b>Location:</b> {user.city}, {user.state}, {user.country} (
                  {user.zipCode})
                </p>
              </div>

              {/* Account Info */}
              <div className="space-y-3">
                <h2 className="font-semibold text-lg border-b pb-1">
                  Account Details
                </h2>
                <p>
                  <b>Username:</b> {user.userName}
                </p>
                <p>
                  <b>Account Type:</b> {user.accountType}
                </p>
                <p>
                  <b>Password:</b> {user.password}
                </p>
              </div>
            </div>

            {/* Verification Section */}
            <div>
              <h2 className="font-semibold text-lg border-b pb-1 mb-4">
                Verification
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Passport */}
                <div className="space-y-2">
                  <p className="font-medium">Passport Photograph</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <img
                        src={user.passportUrl}
                        alt="Passport"
                        onClick={() => setSelectedImage(user.passportUrl)}
                        className="w-full max-w-xs h-40 object-cover border rounded-lg shadow-sm cursor-pointer hover:opacity-80"
                      />
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl w-full p-4">
                      {selectedImage && (
                        <img
                          src={selectedImage}
                          alt="Preview"
                          className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                </div>

                {/* License */}
                <div className="space-y-2">
                  <p className="font-medium">Driver’s License / ID</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <img
                        src={user.driversLicence}
                        alt="License"
                        onClick={() => setSelectedImage(user.driversLicence)}
                        className="w-full max-w-xs h-40 object-cover border rounded-lg shadow-sm cursor-pointer hover:opacity-80"
                      />
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl w-full p-4">
                      {selectedImage && (
                        <img
                          src={selectedImage}
                          alt="Preview"
                          className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            {/* Agreements */}

            {/* Submission Date */}
            <p className="text-sm text-gray-500">
              Submitted At:{" "}
              {new Date(user.createdAt).toLocaleString([], {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </CardContent>
        </Card>

        {/* Approve/Decline Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => handleApproval(user._id)}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white flex-1"
          >
            {loading ? <LoadingSpinner /> : "Approve User"}
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
