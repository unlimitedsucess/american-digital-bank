"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simple client-side validators
  const validate = () => {
    if (!emailOrUsername.trim()) {
      setError("Please enter your username or email.");
      return false;
    }
    if (!password) {
      setError("Please enter your password.");
      return false;
    }
    // optional: require minimal password length for client side
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return false;
    }
    setError(null);
    return true;
  };

  // Simulated login (replace with real server call)
  const simulatedLogin = async (identifier: string, pwd: string) => {
    // small delay to simulate network
    await new Promise((r) => setTimeout(r, 700));

    // Accept either exact email or 'admin' as username for demo
    const matchesDemo =
      (identifier.toLowerCase() === DEMO_CREDENTIAL.email ||
        identifier.toLowerCase() === "admin") &&
      pwd === DEMO_CREDENTIAL.password;

    if (matchesDemo) {
      // return demo token/user
      return {
        ok: true,
        user: { id: "admin-1", name: "Administrator", email: DEMO_CREDENTIAL.email },
        token: "demo-token-123",
      };
    }

    // else fail
    return { ok: false, message: "Invalid username or password." };
  };

  // Example server call (uncomment & implement on server)
  /*
  const serverLogin = async (identifier: string, pwd: string) => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password: pwd, remember }),
      credentials: "include" // if your API sets cookies
    });
    return res.json(); // expected { ok: true, user, token } or { ok: false, message }
  };
  */

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError(null);

    try {
      // Swap simulatedLogin with serverLogin when you have a backend
      const res = await simulatedLogin(emailOrUsername.trim(), password);

      if (!res.ok) {
        setError(res.message || "Login failed");
        setLoading(false);
        return;
      }

      // On success:
      // - store token safely (httpOnly cookie from server is preferred)
      // - or localStorage if required for demo (not recommended for prod tokens)
      if (remember) {
        try {
          localStorage.setItem("demo_admin_token", res.token);
        } catch {}
      }

      // Redirect to admin dashboard (replace path with your route)
      router.push("/admin");
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Admin Sign in</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="identifier">Email or Username</Label>
              <Input
                id="identifier"
                name="identifier"
                placeholder="admin@example.com"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {error && (
              <div role="alert" className="text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </div>

            <div className="text-xs text-muted-foreground text-center mt-2">
              <div>Demo credential for local testing:</div>
              <div>
                <code>admin@example.com</code> / <code>AdminPass123!</code>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
