"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { tokenActions } from "@/store/token/token-slice";
import { useHttp } from "@/hooks/use-http";
import { useDispatch } from "react-redux";
import { AdminLoginParams, LoginParams } from "@/types/global";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

/**
 * Demo dev credential (only for local/dev/testing):
 *   username/email: admin@example.com
 *   password:     AdminPass123!
 *
 * Replace the simulatedLogin function with a real API call in production.
 */

const DEMO_CREDENTIAL = {
  email: "admin@example.com",
  password: "AdminPass123!",
};

export default function AdminLoginPage() {
  const router = useRouter();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const [formData, setFormData] = useState<AdminLoginParams>({
    userName: "",
    password: "",
    rememberMe: false,
  });

  const dispatch = useDispatch();

  const { loading, sendHttpRequest: loginRequest } = useHttp();

  const loginSuccess = (res: any) => {
    const accessToken = res?.data?.data?.token;

    if (!accessToken) {
      toast.error("Login failed: No token received.");
      return;
    }

    dispatch(tokenActions.setToken(accessToken));

    if (formData.rememberMe) {
      localStorage.setItem(
        "AdminstoredLogin", // 👈 distinct key for admin
        JSON.stringify({
          userName: formData.userName, // 👈 correct field
          token: accessToken,
        })
      );
    } else {
      localStorage.removeItem("AdminstoredLogin");
    }

    toast.success("Login successful!");
    router.push("/admin");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.userName || !formData.password) {
      toast.error("Please fill in all fields!");
      return;
    }

    // Login request
    loginRequest({
      requestConfig: {
        url: "/admin/signin",
        method: "POST",
        body: {
          userName: formData.userName,
          password: formData.password,
        },
        userType: "customer",
        successMessage: "Login successful!",
      },
      successRes: loginSuccess,
    });
  };

  useEffect(() => {
    const AdminstoredLogin = localStorage.getItem("AdminstoredLogin");
    if (AdminstoredLogin) {
      const parsed = JSON.parse(AdminstoredLogin);
      setFormData((prev) => ({
        ...prev,
        userName: parsed.userName, // 👈 restore properly
        rememberMe: true,
      }));
      dispatch(tokenActions.setToken(parsed.token));
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Admin Sign in</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="userName"> Username</Label>
              <Input
                id="userName"
                name="userName"
                placeholder="admin@example.com"
                value={formData.userName}
                onChange={handleInputChange}
                aria-label="email or username"
                autoComplete="username"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  aria-label="password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(v) => setRemember(Boolean(v))}
                />
                <span className="text-sm">Remember me</span>
              </label>

              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Implement password reset flow on server.");
                }}
                className="text-sm text-sky-600 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <LoadingSpinner /> : "Sign in"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
