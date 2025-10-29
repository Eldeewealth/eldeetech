import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = { onSuccess?: () => void };

export default function AdminLogin({ onSuccess }: Props) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, otp: otp || undefined }),
      });
      const data = await res.json();
      if (res.ok && data?.success) {
        setFailedAttempts(0);
        setShowOtp(false);
        setOtp("");
        if (onSuccess) onSuccess();
        else navigate("/admin", { replace: true });
      } else {
        const msg = data?.message || "Login failed";
        setError(msg);
        setFailedAttempts((prev) => {
          const next = prev + 1;
          if (next >= 2) setShowOtp(true);
          return next;
        });
        if (/two-factor|2fa/i.test(msg) || /Provide a valid 2FA code/i.test(msg) || /Too many attempts/i.test(msg)) {
          setShowOtp(true);
        }
        const remainingMatch = msg.match(/Attempts remaining:\s*(\d+)/i);
        if (remainingMatch) {
          const remaining = parseInt(remainingMatch[1], 10);
          if (!Number.isNaN(remaining) && remaining <= 1) setShowOtp(true);
        }
      }
    } catch (err: any) {
      setError(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={submit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Password</label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  {showOtp ? (
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">One-time code</label>
                        <button
                          type="button"
                          className="text-xs text-muted-foreground hover:text-foreground underline"
                          onClick={() => { setShowOtp(false); setOtp(""); }}
                        >
                          Hide
                        </button>
                      </div>
                      <Input
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={8}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="6-digit code"
                      />
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="text-xs text-muted-foreground hover:text-foreground underline"
                      onClick={() => setShowOtp(true)}
                    >
                      Use a one-time code
                    </button>
                  )}
                  {error && <p className="text-destructive text-sm">{error}</p>}
                  <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
