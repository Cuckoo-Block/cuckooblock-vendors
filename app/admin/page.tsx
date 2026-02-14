"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type VendorRow = {
  id: string;
  legal_name: string | null;
  status: string | null;
  created_at: string | null;
};

export default function AdminPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [vendors, setVendors] = useState<VendorRow[]>([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const badge = (s?: string | null) => {
    const v = (s ?? "draft").toLowerCase();
    if (v === "approved") return <Badge className="bg-emerald-500/20 text-emerald-200 border border-emerald-300/30">Approved</Badge>;
    if (v === "rejected") return <Badge className="bg-red-500/20 text-red-200 border border-red-300/30">Rejected</Badge>;
    if (v === "needs_changes") return <Badge className="bg-amber-500/20 text-amber-200 border border-amber-300/30">Needs changes</Badge>;
    if (v === "submitted") return <Badge className="bg-sky-500/20 text-sky-200 border border-sky-300/30">Submitted</Badge>;
    return <Badge className="bg-white/10 text-white/80 border border-white/20">Draft</Badge>;
  };

  const load = async () => {
    setLoading(true);
    setMsg("");

    const { data: s } = await supabase.auth.getSession();
    const user = s.session?.user;
    if (!user) {
      router.push("/login");
      return;
    }
    setEmail(user.email ?? "");

    const { data: prof, error: profErr } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profErr) {
      setMsg(`Profile error: ${profErr.message}`);
      setLoading(false);
      return;
    }
    const r = (prof?.role ?? "").toLowerCase();
    setRole(r);

    if (r !== "admin") {
      setMsg("Access denied: you are not an admin.");
      setLoading(false);
      return;
    }

    const { data: v, error: vErr } = await supabase
      .from("vendors")
      .select("id, legal_name, status, created_at")
      .order("created_at", { ascending: false });

    if (vErr) {
      setMsg(`Vendors load error: ${vErr.message}`);
      setLoading(false);
      return;
    }

    setVendors((v ?? []) as VendorRow[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setStatus = async (vendorId: string, status: string) => {
    setMsg("");
    const { error } = await supabase.from("vendors").update({ status }).eq("id", vendorId);
    if (error) {
      setMsg(`Update error: ${error.message}`);
      return;
    }
    setMsg(`Updated vendor ${vendorId} → ${status}`);
    await load();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Review</h1>
            <div className="text-white/70 text-sm">
              Logged in as: {email} {role ? <span className="ml-2 text-white/50">(role: {role})</span> : null}
            </div>
          </div>
          <Button className="bg-white/10 text-white border border-white/20 hover:bg-white/15" onClick={signOut}>
            Sign out
          </Button>
        </div>

        {msg ? (
          <div className="text-sm text-white/75 border border-white/15 bg-white/5 rounded-md p-3">
            {msg}
          </div>
        ) : null}

        <Card className="bg-[color:var(--cb-panel)] border-[color:var(--cb-border)]">
          <CardHeader>
            <CardTitle className="text-white">Vendors</CardTitle>
            <CardDescription className="text-white/70">Approve / reject / request changes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? <div className="text-white/60">Loading…</div> : null}

            {!loading && vendors.length === 0 ? (
              <div className="text-white/60">No vendors found yet.</div>
            ) : null}

            {!loading &&
              vendors.map((v) => (
                <div key={v.id} className="border border-white/15 rounded-lg p-4 bg-white/5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-white font-semibold">{v.legal_name ?? "(No legal name yet)"}</div>
                      <div className="text-white/50 text-xs break-all">Vendor ID: {v.id}</div>
                    </div>
                    <div>{badge(v.status)}</div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Button className="bg-white text-black hover:bg-white/90" onClick={() => setStatus(v.id, "approved")}>
                      Approve
                    </Button>
                    <Button className="bg-white/10 text-white border border-white/20 hover:bg-white/15" onClick={() => setStatus(v.id, "needs_changes")}>
                      Needs changes
                    </Button>
                    <Button className="bg-red-500/20 text-red-100 border border-red-300/30 hover:bg-red-500/30" onClick={() => setStatus(v.id, "rejected")}>
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
