"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardWrapper from "@/components/admin/DashBoradWrapper";
import { Country, State, City } from "country-state-city";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EditingUser } from "@/types/global";
import Image from "next/image";
import { useDispatch } from "react-redux";

import { deleteUser , updateUser } from "@/store/data/admin-slice";
export default function ActiveUserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const token = useSelector((state: any) => state.token?.token);
  const user = useSelector((state: RootState) =>
    state.admin.users.find((u) => String(u._id) === String(id))
  );

  const { loading: deleteLoading, sendHttpRequest: DeleteUserRequest } = useHttp();
  const { loading: editLoading, sendHttpRequest: EditUserRequest } = useHttp();
  const { loading: suspendLoading, sendHttpRequest:   SuspendedUserRequest } = useHttp();

  const [userData, setUserData] = useState<any | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
 const [editing, setEditing] = useState<EditingUser | null>(null);
  const [passportPreview, setPassportPreview] = useState<string | null>(null);
  const [licensePreview, setLicensePreview] = useState<string | null>(null);
  const [revealPassword, setRevealPassword] = useState(false);
  const [revealPin, setRevealPin] = useState(false);
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

    useEffect(() => {
    if (!token) {
      router.push("/adminlogin");
    }
  }, [token, router]);



  console.log("User from store:", user);
  const dispatch = useDispatch();
  // Load countries
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // Prefill userData & editing
  useEffect(() => {
    if (!user) return;
    setUserData(user);
    setPassportPreview(user.passportUrl || null);
    setLicensePreview(user.driversLicence || null);




    if (user.country) {
      const selectedCountry = Country.getAllCountries().find(
        (c) => c.name === user.country
      );
      if (selectedCountry) {
        const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
        setStates(countryStates);
        if (user.state) {
          const selectedState = countryStates.find(
            (s) => s.name === user.state
          );
          if (selectedState) {
            setCities(
              City.getCitiesOfState(
                selectedCountry.isoCode,
                selectedState.isoCode
              )
            );
          }
        }
      }
    }
  }, [user]);

  const openEditModal = () => {
    if (!userData) return;
    setEditing({ ...userData });
    setPassportPreview(userData.passportUrl || null);
    setLicensePreview(userData.driversLicence || null);

    if (userData.country) {
      const selectedCountry = countries.find(
        (c) => c.name === userData.country
      );
      if (selectedCountry) {
        const loadedStates = State.getStatesOfCountry(selectedCountry.isoCode);
        setStates(loadedStates);
        if (userData.state) {
          const selectedState = loadedStates.find(
            (s) => s.name === userData.state
          );
          if (selectedState) {
            setCities(
              City.getCitiesOfState(
                selectedCountry.isoCode,
                selectedState.isoCode
              )
            );
          }
        }
      }
    }

    setOpenEdit(true);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditing((prev: any) => ({ ...prev, [name]: value }));
  };

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, files } = e.target;
  if (!files || files.length === 0) return;
  const file = files[0];
  const url = URL.createObjectURL(file);

  if (name === "passportFile") {
    setPassportPreview(url);
    setEditing(prev => prev ? { ...prev, passportFile: file } : null);
  } else if (name === "driversLicenceFile") {
    setLicensePreview(url);
    setEditing(prev => prev ? { ...prev, driversLicenceFile: file } : null);
  }
};


  const handleCountryChange = (isoCode: string) => {
    const country = countries.find((c) => c.isoCode === isoCode);
    if (!country) return;

    setEditing((prev:any) => ({
      ...prev,
      country: country.name,
     
      state: "",
      city: "",
    }));

    const countryStates = State.getStatesOfCountry(isoCode);
    setStates(countryStates);
    setCities([]);
  };
  const handleStateChange = (isoCode: string) => {
    const state = states.find((s) => s.isoCode === isoCode);
    if (!state || !editing?.country) return;

    const country = countries.find((c) => c.name === editing.country);
    if (!country) return;

    setEditing((prev: any) => ({
      ...prev,
      state: state.name,
      city: "",
    }));

    setCities(City.getCitiesOfState(country.isoCode, state.isoCode));
  };

  const handleCityChange = (cityName: string) => {
    setEditing((prev:any) => ({ ...prev, city: cityName }));
  };



const handleSaveEdit = () => {
  if (!editing) return;

  // Validate required fields
  if (!editing.firstName?.trim()) {
    toast.error("First name cannot be empty");
    return;
  }

const body = {
  firstName: editing.firstName,
  lastName: editing.lastName,
  userName: editing.userName,
  password: editing.password,
  email: editing.email,
  phoneNo:  editing.phoneNo, // or phoneNo depending on your state
  dob: editing.dob,
  ssn: editing.ssn,
  initialDeposit: editing.initialDeposit || 0,
  address: editing.address,
  country: editing.country,
  state: editing.state,
  city: editing.city,
  zipCode: editing.zipCode,
  accountType: editing.accountType,
  pin: editing.pin,
  passport: editing.passportFile ? "file" : editing.passportFile, // "file" signals frontend has new upload
  driversLicence: editing.driversLicenceFile ? "file" : editing.driversLicenceFile,
};


  EditUserRequest({
    requestConfig: {
      url: `/admin/update/user/${user?._id}`,
      method: "PATCH",
      token,
      isAuth: true,
      body, // send as JSON
      successMessage: "User updated successfully",
    },
    successRes: (data: any) => {
      const updatedUser = data?.user || data;
      toast.success("✅ User updated successfully");
      setOpenEdit(false);
        // Update local state
    setUserData(updatedUser);

    // Update Redux store immediately
    dispatch(updateUser(updatedUser));

    toast.success("✅ User updated successfully");
    setOpenEdit(false);
    },
  });
};


  const handleDeleteUser = () => {
    if (!user) return;

    DeleteUserRequest({
      requestConfig: {
        url: `/admin/user/${user?._id}`,
        method: "DELETE",
        token,
        isAuth: true,
        successMessage: "User deleted successfully",
      },
      successRes: () => {
        toast.success("✅ User deleted successfully");
        router.push("/admin/active");
          dispatch(deleteUser(user._id));
      },
    });
  };

  const suspended = userData?.accountStatus === "suspended";
   

 const handleToggleSuspend = () => {
  if (!userData) return;

  // Determine new status
  const newStatus = userData.accountStatus === "active" ? "suspended" : "active";

  // Optimistically update UI
  setUserData((prev: any) => ({
    ...prev,
    accountStatus: newStatus,
  }));

  // Call backend
  SuspendedUserRequest({
    requestConfig: {
      url: "/admin/account/status",
      method: "PATCH",
      token,
      isAuth: true,
      body: { status: newStatus, userId: userData._id },
      successMessage: `User ${newStatus === "active" ? "activated" : "suspended"} successfully`,
    },
    successRes: () => {
      // Update Redux
      const updatedUser = { ...userData, accountStatus: newStatus };
      dispatch(updateUser(updatedUser));

      toast.success(
        `✅ User ${newStatus === "active" ? "activated" : "suspended"}`
      );
    },
    errorRes: () => {
      // Rollback UI if failed
      setUserData((prev: any) => ({
        ...prev,
        accountStatus: prev.accountStatus === "active" ? "suspended" : "active",
      }));
      toast.error("❌ Failed to update user status");
    },
  });
};

  if (!user || !userData) {
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
      {/* ---------------------- Header & Actions ---------------------- */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              {userData.firstName} {userData.lastName}
            </h1>
            <p className="text-sm text-muted-foreground">User ID: {user._id}</p>
          </div>

          <div className="flex-col-reverse h-fit space-y-5 flex  md:flex-row  w-fit items-center md:gap-3">
            <div className="flex items-center gap-3 bg-muted px-4 py-2 rounded">
              <span className="text-sm">Status:</span>
              <span
                className={`text-sm font-medium ${
                  suspended ? "text-red-600" : "text-green-600"
                }`}
              >
                {suspended ? "Suspended" : user.accountStatus}
              </span>
            </div>

            <Button
              variant="ghost"
              onClick={openEditModal}
              className="flex items-center gap-2"
            >
              <Edit2 size={16} /> Edit
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push(`/admin/active/${user._id}/history`)}
            >
              View User History
            </Button>

            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              className="flex items-center gap-2"
            >
              {deleteLoading ? <LoadingSpinner size={16} /> : <Trash2 size={16} />} {deleteLoading ? "" : "Delete"}
            </Button>
          </div>
        </div>

        {/* ---------------------- Left (Profile & Verification) / Right (Account & Actions) ---------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full name</Label>
                    <div className="mt-1">
                      {user.firstName} {user.lastName}
                    </div>
                  </div>
                  <div>
                    <Label>Account number</Label>
                    <div className="mt-1">
                      {user.accountNumber}
                    </div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <div className="mt-1">{userData.email}</div>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <div className="mt-1">{user.phoneNo}</div>
                  </div>
                  <div>
                    <Label>Date of birth</Label>
                    <div className="mt-1">{user.dob}</div>
                  </div>
                  <div>
                    <Label>PIN (masked)</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <span>{revealPin ? user.pin : "••••"}</span>
                      <button
                        onClick={() => setRevealPin((prev) => !prev)}
                        className="text-sm text-muted-foreground hover:text-foreground"
                        aria-label="toggle pin"
                      >
                        {revealPin ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label>SSN</Label>
                    <div className="mt-1">{user.ssn}</div>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Address</Label>
                    <div className="mt-1">{user.address}</div>
                  </div>
                  <div>
                    <Label>Country</Label>
                    <div className="mt-1">{user.country}</div>
                  </div>
                  <div>
                    <Label>State / City</Label>
                    <div className="mt-1">
                      {userData.state} / {user.city}
                    </div>
                  </div>
                  <div>
                    <Label>ZIP</Label>
                    <div className="mt-1">{user.zipCode}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verification Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Verification Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Passport Photograph</Label>
                    <div className="mt-2">
                      {user.passportUrl ? (
                        <Image
                          width={100}
                          height={100}
                          src={user.passportUrl}
                          alt="passport"
                          className="w-48 h-36 object-cover border rounded"
                        />
                      ) : (
                        <div className="w-48 h-36 border rounded flex items-center justify-center text-sm text-muted-foreground">
                          No passport uploaded
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>Driver’s License / ID</Label>
                    <div className="mt-2">
                      {user.driversLicence ? (
                        <Image
                          width={100}
                          height={100}
                          src={user.driversLicence}
                          alt="license"
                          className="w-48 h-36 object-cover border rounded"
                        />
                      ) : (
                        <div className="w-48 h-36 border rounded flex items-center justify-center text-sm text-muted-foreground">
                          No license uploaded
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Username</Label>
                  <div className="mt-1">{user.userName}</div>
                </div>
                <div>
                  <Label>Account Type</Label>
                  <div className="mt-1">{user.accountType}</div>
                </div>
                <div>
                  <Label>Password</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <span>{revealPassword ? user.password : "••••••••"}</span>
                    <button
                      onClick={() => setRevealPassword((prev) => !prev)}
                      className="text-sm text-muted-foreground hover:text-foreground"
                      aria-label="toggle password"
                    >
                      {revealPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={suspended}
                      onCheckedChange={handleToggleSuspend}
                    />
                    <div className="text-sm">
                      {suspended ? "Suspended" : "Active"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>

      {/* ---------------------- Edit Dialog ---------------------- */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-w-3xl h-[80%] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>Edit User Details</DialogTitle>
          </DialogHeader>

          {editing ? (
            <div className="space-y-4">
              {/* ---------- Form Fields ---------- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* First Name */}
                <div>
                  <Label>First name</Label>
                  <Input
                    name="firstName"
                    value={editing.firstName}
                    onChange={handleEditChange}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <Label>Last name</Label>
                  <Input
                    name="lastName"
                    value={editing.lastName}
                    onChange={handleEditChange}
                  />
                </div>

                {/* Email */}
                <div>
                  <Label>Email</Label>
                  <Input
                    name="email"
                    value={editing.email}
                    onChange={handleEditChange}
                  />
                </div>

                {/* Phone */}
                <div>
                  <Label>Phone (without country code)</Label>
                  <Input
                    name="phoneNo"
                    value={editing.phoneNo}
                    onChange={handleEditChange}
                  />
                </div>

                {/* Country Code */}
                <div>
                  <Label>Country Code</Label>
                  <Input
                    name="countryCode"
                    value={editing.countryCode}
                    readOnly
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <Label>Date of birth</Label>
                  <Input
                    name="dob"
                    type="date"
                    value={editing.dob}
                    onChange={handleEditChange}
                  />
                </div>

                {/* PIN */}
                <div>
                  <Label>PIN</Label>
                  <Input
                    name="pin"
                    value={editing.pin}
                    onChange={handleEditChange}
                  />
                </div>

                {/* SSN */}
                <div>
                  <Label>SSN</Label>
                  <Input
                    name="ssn"
                    value={editing.ssn}
                    onChange={handleEditChange}
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <Label>Address</Label>
                  <Textarea
                    name="address"
                    value={editing.address}
                    onChange={handleEditChange}
                  />
                </div>

                {/* Country */}
                <div>
                  <Label>Country</Label>
                  <Select
                    value={
                      countries.find((c) => c.name === editing.country)
                        ?.isoCode || ""
                    }
                    onValueChange={handleCountryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c.isoCode} value={c.isoCode}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* State */}
                <div>
                  <Label>State</Label>
                  <Select
                    value={
                      states.find((s) => s.name === editing.state)?.isoCode ||
                      ""
                    }
                    onValueChange={handleStateChange}
                    disabled={!states.length}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((s) => (
                        <SelectItem key={s.isoCode} value={s.isoCode}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* City */}
                <div>
                  <Label>City</Label>
                  <Select
                    value={editing.city || ""}
                    onValueChange={handleCityChange}
                    disabled={!cities.length}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((ct, idx) => (
                        <SelectItem key={idx} value={ct.name}>
                          {ct.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* ZIP */}
                <div>
                  <Label>ZIP</Label>
                  <Input
                    name="zipCode"
                    value={editing.zipCode}
                    onChange={handleEditChange}
                  />
                </div>

                {/* Username */}
                <div>
                  <Label>Username</Label>
                  <Input
                    name="userName"
                    value={editing.userName}
                    onChange={handleEditChange}
                  />
                </div>

                {/* Account Type */}
                <div>
                  <Label>Account Type</Label>
                  <Input
                    name="accountType"
                    value={editing.accountType}
                    onChange={handleEditChange}
                  />
                </div>

                {/* Password */}
                <div>
                  <Label>Password</Label>
                  <Input
                  id="password"
                    name="password"
                    value={editing.password}
                    onChange={handleEditChange}
                  />
                </div>

                {/* Passport & License Upload */}
                <div>
                  <Label>Passport</Label>
                  <Input
                    type="file"
                    name="passportFile"
                    onChange={handleFileChange}
                  />
                  {passportPreview && (
                    <img
                      src={passportPreview}
                      className="w-48 h-36 mt-2 object-cover border rounded"
                    />
                  )}
                </div>

                <div>
                  <Label>Driver License / ID</Label>
                  <Input
                    type="file"
                    name="licenseFile"
                    onChange={handleFileChange}
                  />
                  {licensePreview && (
                    <img
                      src={licensePreview}
                      className="w-48 h-36 mt-2 object-cover border rounded"
                    />
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex justify-end">
                <Button onClick={handleSaveEdit} disabled={editLoading}>
                  {editLoading ? <LoadingSpinner size={18} /> : "Save Changes"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">Loading form...</div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardWrapper>
  );
}
