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
import { Upload, Edit2, Trash2, Eye, EyeOff } from "lucide-react";

const initialUser = {
  id: "1",
  firstName: "Jane",
  lastName: "Smith",
  email: "jane@example.com",
  phone: "8012345678",
  countryCode: "+234",
  dateOfBirth: "1990-05-20",
  pin: "4321",
  ssn: "123-45-6789",
  address: "123 Main Street",
  country: "Nigeria",
  state: "Lagos",
  city: "Ikeja",
  zipCode: "100001",
  username: "janesmith",
  accountType: "savings",
  password: "SuperSecret123!",
  passport: "/uploads/jane-passport.jpg",
  license: "/uploads/jane-license.jpg",
  agreeToTerms: true,
  agreeToMarketing: false,
  verified: true,
  status: "Active",
  submittedAt: "2025-09-10",
};

export default function ActiveUserDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [userData, setUserData] = useState<any>(initialUser);
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  const [suspended, setSuspended] = useState(userData.status !== "Active");
  const [openEdit, setOpenEdit] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [passportPreview, setPassportPreview] = useState<string | null>(
    userData.passport || null
  );
  const [licensePreview, setLicensePreview] = useState<string | null>(
    userData.license || null
  );

  const [revealPassword, setRevealPassword] = useState(false);
  const [revealPin, setRevealPin] = useState(false);

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    setSuspended(userData.status !== "Active");
    setPassportPreview(userData.passport || null);
    setLicensePreview(userData.license || null);
  }, []);

  const openEditModal = () => {
    setEditing({ ...userData });
    setPassportPreview(userData.passport || null);
    setLicensePreview(userData.license || null);

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
    const { name, value } = e.target as HTMLInputElement;
    setEditing((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target as HTMLInputElement;
    if (!files || files.length === 0) return;
    const file = files[0];

    const url = URL.createObjectURL(file);
    if (name === "passportFile") {
      setPassportPreview(url);
      setEditing((prev: any) => ({ ...prev, passportFile: file }));
    } else if (name === "licenseFile") {
      setLicensePreview(url);
      setEditing((prev: any) => ({ ...prev, licenseFile: file }));
    }
  };

  const handleCountryChange = (isoCode: string) => {
    const selectedCountry = countries.find((c) => c.isoCode === isoCode);
    if (!selectedCountry) return;

    setEditing((prev: any) => ({
      ...prev,
      country: selectedCountry.name,
      countryCode: `+${selectedCountry.phonecode}`,
      state: "",
      city: "",
    }));

    setStates(State.getStatesOfCountry(isoCode));
    setCities([]);
  };

  const handleStateChange = (isoCode: string) => {
    const selectedState = states.find((s) => s.isoCode === isoCode);
    if (!selectedState) return;

    const country = countries.find((c) => c.name === editing.country);
    if (!country) return;

    setEditing((prev: any) => ({
      ...prev,
      state: selectedState.name,
      city: "",
    }));

    setCities(City.getCitiesOfState(country.isoCode, isoCode));
  };

  const handleCityChange = (cityName: string) => {
    setEditing((prev: any) => ({ ...prev, city: cityName }));
  };

  const handleSaveEdit = () => {
    const updated = { ...userData, ...editing };

    if (editing?.passportFile) {
      updated.passport = passportPreview;
      delete updated.passportFile;
    }
    if (editing?.licenseFile) {
      updated.license = licensePreview;
      delete updated.licenseFile;
    }

    setUserData(updated);
    setOpenEdit(false);
  };

  const handleDeleteUser = () => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    alert("User deleted (simulated). Redirecting to active users list.");
    router.push("/admin/active");
  };

  const handleToggleSuspend = (val: boolean) => {
    setSuspended(val);
    setUserData((prev: any) => ({
      ...prev,
      status: val ? "Suspended" : "Active",
    }));
  };

  return (
    <DashboardWrapper>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              {userData.firstName} {userData.lastName}
            </h1>
            <p className="text-sm text-muted-foreground">
              User ID: {userData.id}
            </p>
          </div>

          <div className="flex-col-reverse h-fit space-y-5  md:flex items-center md:gap-3">
            <div className="flex items-center gap-3 bg-muted px-4 py-2 rounded">
              <span className="text-sm">Status:</span>
              <span
                className={`text-sm font-medium ${
                  suspended ? "text-red-600" : "text-green-600"
                }`}
              >
                {suspended ? "Suspended" : userData.status}
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
              onClick={() => router.push(`/admin/active/${id}/history`)}
            >
              View User History
            </Button>

            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              className="flex items-center gap-2"
            >
              <Trash2 size={16} /> Delete
            </Button>
          </div>
        </div>

        {/* Grid: left = profile & verification, right = account & actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Personal & Verification */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full name</Label>
                    <div className="mt-1">
                      {userData.firstName} {userData.lastName}
                    </div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <div className="mt-1">{userData.email}</div>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <div className="mt-1">
                      {userData.countryCode} {userData.phone}
                    </div>
                  </div>
                  <div>
                    <Label>Date of birth</Label>
                    <div className="mt-1">{userData.dateOfBirth}</div>
                  </div>
                  <div>
                    <Label>PIN (masked)</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <span>{revealPin ? userData.pin : "••••"}</span>
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
                    <div className="mt-1">{userData.ssn}</div>
                  </div>

                  <div className="md:col-span-2">
                    <Label>Address</Label>
                    <div className="mt-1">{userData.address}</div>
                  </div>

                  <div>
                    <Label>Country</Label>
                    <div className="mt-1">{userData.country}</div>
                  </div>
                  <div>
                    <Label>State / City</Label>
                    <div className="mt-1">
                      {userData.state} / {userData.city}
                    </div>
                  </div>
                  <div>
                    <Label>ZIP</Label>
                    <div className="mt-1">{userData.zipCode}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Verification Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Passport Photograph</Label>
                    <div className="mt-2">
                      {userData.passport ? (
                        <img
                          src={userData.passport}
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
                      {userData.license ? (
                        <img
                          src={userData.license}
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

          {/* Right column - Account & Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Username</Label>
                  <div className="mt-1">{userData.username}</div>
                </div>
                <div>
                  <Label>Account Type</Label>
                  <div className="mt-1">{userData.accountType}</div>
                </div>
                <div>
                  <Label>Password</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <span>
                      {revealPassword ? userData.password : "••••••••"}
                    </span>
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

            <Card>
              <CardHeader>
                <CardTitle>Agreements & Meta</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <b>Terms accepted:</b> {userData.agreeToTerms ? "✅" : "❌"}
                </p>
                <p>
                  <b>Marketing Subscribed:</b>{" "}
                  {userData.agreeToMarketing ? "✅" : "❌"}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  <b>Submitted:</b> {userData.submittedAt}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-w-3xl h-[80%] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>Edit User Details</DialogTitle>
          </DialogHeader>

          {editing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  {" "}
                  <Label>First name</Label>{" "}
                  <Input
                    name="firstName"
                    value={editing.firstName}
                    onChange={handleEditChange}
                  />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <Label>Last name</Label>{" "}
                  <Input
                    name="lastName"
                    value={editing.lastName}
                    onChange={handleEditChange}
                  />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <Label>Email</Label>{" "}
                  <Input
                    name="email"
                    value={editing.email}
                    onChange={handleEditChange}
                  />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <Label>Phone (without country code)</Label>{" "}
                  <Input
                    name="phone"
                    value={editing.phone}
                    onChange={handleEditChange}
                  />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <Label>Country Code</Label>{" "}
                  <Input
                    name="countryCode"
                    value={editing.countryCode}
                    readOnly
                  />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <Label>Date of birth</Label>{" "}
                  <Input
                    name="dateOfBirth"
                    type="date"
                    value={editing.dateOfBirth}
                    onChange={handleEditChange}
                  />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <Label>PIN</Label>{" "}
                  <Input
                    name="pin"
                    value={editing.pin}
                    onChange={handleEditChange}
                  />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <Label>SSN</Label>{" "}
                  <Input
                    name="ssn"
                    value={editing.ssn}
                    onChange={handleEditChange}
                  />{" "}
                </div>{" "}
                <div className="md:col-span-2">
                  {" "}
                  <Label>Address</Label>{" "}
                  <Textarea
                    name="address"
                    value={editing.address}
                    onChange={handleEditChange}
                  />{" "}
                </div>{" "}
                <div className="w-full ">
                  {" "}
                  <Label>Country</Label>{" "}
                  <Select
                    value={
                      countries.find((c) => c.name === editing.country)
                        ?.isoCode || ""
                    }
                    onValueChange={handleCountryChange}
                  >
                    {" "}
                    <SelectTrigger>
                      {" "}
                      <SelectValue placeholder="Select country" />{" "}
                    </SelectTrigger>{" "}
                    <SelectContent>
                      {" "}
                      {countries.map((c) => (
                        <SelectItem key={c.isoCode} value={c.isoCode}>
                          {" "}
                          {c.name}{" "}
                        </SelectItem>
                      ))}{" "}
                    </SelectContent>{" "}
                  </Select>{" "}
                </div>{" "}
                <div>
                  {" "}
                  <Label>State</Label>{" "}
                  <Select
                    value={
                      states.find((s) => s.name === editing.state)?.isoCode ||
                      ""
                    }
                    onValueChange={handleStateChange}
                    disabled={!states.length}
                  >
                    {" "}
                    <SelectTrigger>
                      {" "}
                      <SelectValue placeholder="Select state" />{" "}
                    </SelectTrigger>{" "}
                    <SelectContent>
                      {" "}
                      {states.map((s) => (
                        <SelectItem key={s.isoCode} value={s.isoCode}>
                          {" "}
                          {s.name}{" "}
                        </SelectItem>
                      ))}{" "}
                    </SelectContent>{" "}
                  </Select>{" "}
                </div>{" "}
                <div>
                  {" "}
                  <Label>City</Label>{" "}
                  <Select
                    value={editing.city}
                    onValueChange={handleCityChange}
                    disabled={!cities.length}
                  >
                    {" "}
                    <SelectTrigger>
                      {" "}
                      <SelectValue placeholder="Select city" />{" "}
                    </SelectTrigger>{" "}
                    <SelectContent>
                      {" "}
                      {cities.map((ct, idx) => (
                        <SelectItem key={idx} value={ct.name}>
                          {" "}
                          {ct.name}{" "}
                        </SelectItem>
                      ))}{" "}
                    </SelectContent>{" "}
                  </Select>{" "}
                </div>{" "}
                <div>
                  {" "}
                  <Label>ZIP Code</Label>{" "}
                  <Input
                    name="zipCode"
                    value={editing.zipCode}
                    onChange={handleEditChange}
                  />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <Label>Username</Label>{" "}
                  <Input
                    name="username"
                    value={editing.username}
                    onChange={handleEditChange}
                  />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <Label>Account Type</Label>{" "}
                  <Select
                    value={editing.accountType}
                    onValueChange={(val) =>
                      setEditing((prev: any) => ({ ...prev, accountType: val }))
                    }
                  >
                    {" "}
                    <SelectTrigger>
                      {" "}
                      <SelectValue placeholder="Select account type" />{" "}
                    </SelectTrigger>{" "}
                    <SelectContent>
                      {" "}
                      <SelectItem value="savings">Savings</SelectItem>{" "}
                      <SelectItem value="current">Current</SelectItem>{" "}
                    </SelectContent>{" "}
                  </Select>{" "}
                </div>{" "}
                <div>
                  {" "}
                  <Label>Password</Label>{" "}
                  <Input
                    name="password"
                    type="password"
                    value={editing.password}
                    onChange={handleEditChange}
                  />{" "}
                </div>
                <div>
                  <Label>Upload Passport</Label>
                  <div className="mt-2 flex flex-col gap-2">
                    {passportPreview ? (
                      <img
                        src={passportPreview}
                        alt="passport preview"
                        className="w-32 h-24 object-cover border rounded"
                      />
                    ) : (
                      <div className="w-32 h-24 border rounded flex items-center justify-center text-sm text-muted-foreground">
                        No passport
                      </div>
                    )}
                    <Input
                      type="file"
                      name="passportFile"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                {/* Upload License */}
                <div>
                  <Label>Upload License / ID</Label>
                  <div className="mt-2 flex flex-col gap-2">
                    {licensePreview ? (
                      <img
                        src={licensePreview}
                        alt="license preview"
                        className="w-32 h-24 object-cover border rounded"
                      />
                    ) : (
                      <div className="w-32 h-24 border rounded flex items-center justify-center text-sm text-muted-foreground">
                        No license
                      </div>
                    )}
                    <Input
                      type="file"
                      name="licenseFile"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setOpenEdit(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>Save changes</Button>
              </div>
            </div>
          ) : (
            <div>Loading editor...</div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardWrapper>
  );
}
