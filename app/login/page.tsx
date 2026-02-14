"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const hardNavigate = (path: string) => {
    // Router first (nice SPA), then hard redirect fallback (guaranteed)
    try {
      router.replace(path);
    } catch {}
    setTimeout(() => {
      if (typeof window !== "undefined") window.location.assign(path);
    }, 150);
  };

  const routeByRole = async (userId: string) => {
    setStatus("Checking role...");

    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (error) {
      // If profiles read is blocked or row missing, still let user continue as vendor
      setStatus(`Role lookup failed (${error.message}). Sending to Vendor Intake...`);
      hardNavigate("/vendor");
      return;
    }

    const role = (data?.role ?? "vendor").toLowerCase();
    setStatus(`Role: ${role}. Routing...`);
    hardNavigate(role === "admin" ? "/admin" : "/vendor");
  };

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setStatus(`Session error: ${error.message}`);
        return;
      }
      const user = data.session?.user;
      if (user?.id) {
        await routeByRole(user.id);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSignUp = async () => {
    setLoading(true);
    setStatus("Creating account...");
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      setStatus(`Error: ${error.message}`);
      return;
    }

    const userId = data.user?.id;
    setStatus(userId ? "Signup OK. Routing..." : "Signup OK. Check email if confirmation is enabled.");
    if (userId) await routeByRole(userId);
  };

  const onSignIn = async () => {
    setLoading(true);
    setStatus("Signing in...");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setStatus(`Error: ${error.message}`);
      return;
    }

    const userId = data.user?.id;
    if (!userId) {
      setStatus("Signed in, but could not read user id.");
      return;
    }

    setStatus("Signed in! Routing...");
    await routeByRole(userId);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10 bg-[var(--cb-bg)] text-white">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="text-2xl font-bold tracking-wide">Cuckoo Block</div>
          <div className="text-white/70 text-sm mt-1">Vendor Onboarding Portal</div>
        </div>

        <Card className="bg-[var(--cb-panel)] border border-[var(--cb-border)] shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Sign in</CardTitle>
            <CardDescription className="text-white/70">
              Use your email + password to access Vendor Intake or Admin Review.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">Email</Label>
              <Input
                id="email"
                type="email"
                className="cb-input"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/80">Password</Label>
              <Input
                id="password"
                type="password"
                className="cb-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <div className="flex gap-3">
              <Button className="w-full" onClick={onSignIn} disabled={loading || !email || !password}>
                Sign in
              </Button>
              <Button className="w-full" variant="secondary" onClick={onSignUp} disabled={loading || !email || !password}>
                Sign up
              </Button>
            </div>

            {status ? <div className="text-sm text-white/80">{status}</div> : null}

            <div className="text-xs text-white/50 leading-relaxed">
              If you just created an admin profile in Supabase, refresh after 30–60 seconds.
            </div>

            <div className="pt-2 border-t border-white/10 text-xs text-white/50">
              Quick links:{" "}
              <a className="underline text-white/70" href="/vendor">Vendor</a>{" "}
              ·{" "}
              <a className="underline text-white/70" href="/admin">Admin</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
