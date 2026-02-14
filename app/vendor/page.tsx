"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type VendorRow = {
  id: string;
  owner_user_id: string;
  legal_name: string | null;
  dba_name: string | null;
  website: string | null;
  primary_contact_name: string | null;
  primary_contact_email: string | null;
  primary_contact_phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  ap_email: string | null;
  notes: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
};

const emptyForm = {
  legal_name: "",
  dba_name: "",
  website: "",
  primary_contact_name: "",
  primary_contact_email: "",
  primary_contact_phone: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  zip: "",
  ap_email: "",
  notes: "",
};

export default function VendorPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [vendorId, setVendorId] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [status, setStatus] = useState<string>("draft");
  const [msg, setMsg] = useState<string>("");

  const [form, setForm] = useState({ ...emptyForm });

  const requiredOk = useMemo(() => {
    return form.legal_name.trim().length > 0;
  }, [form.legal_name]);

  const setField = (k: keyof typeof emptyForm, v: string) => {
    setForm((prev) => ({ ...prev, [k]: v }));
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const load = async () => {
    setLoading(true);
    setMsg("");

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      router.push("/login");
      return;
    }

    setVendorId(user.id);
    setEmail(user.email ?? "");

    // Load existing vendor row if any
    const { data, error } = await supabase
      .from("vendors")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      setMsg(`Load error: ${error.message}`);
      setLoading(false);
      return;
    }

    if (data) {
      const row = data as VendorRow;
      setStatus((row.status ?? "draft").toLowerCase());

      setForm({
        legal_name: row.legal_name ?? "",
        dba_name: row.dba_name ?? "",
        website: row.website ?? "",
        primary_contact_name: row.primary_contact_name ?? "",
        primary_contact_email: row.primary_contact_email ?? "",
        primary_contact_phone: row.primary_contact_phone ?? "",
        address_line1: row.address_line1 ?? "",
        address_line2: row.address_line2 ?? "",
        city: row.city ?? "",
        state: row.state ?? "",
        zip: row.zip ?? "",
        ap_email: row.ap_email ?? "",
        notes: row.notes ?? "",
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const upsert = async (nextStatus: "draft" | "submitted") => {
    setSaving(true);
    setMsg("");

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    if (!user) {
      setSaving(false);
      router.push("/login");
      return;
    }

    const payload = {
      id: user.id,
      owner_user_id: user.id, // IMPORTANT: fixes your NOT NULL owner_user_id error
      ...form,
      status: nextStatus,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("vendors").upsert(payload, { onConflict: "id" });

    setSaving(false);

    if (error) {
      setMsg(`Save error: ${error.message}`);
      return;
    }

    setStatus(nextStatus);
    setMsg(nextStatus === "submitted" ? "Submitted for review ✅" : "Saved ✅");
  };

  const badge = (s: string) => {
    const v = (s || "draft").toLowerCase();
    if (v === "approved") return <Badge className="bg-emerald-500/20 text-emerald-200 border border-emerald-300/30">Approved</Badge>;
    if (v === "rejected") return <Badge className="bg-red-500/20 text-red-200 border border-red-300/30">Rejected</Badge>;
    if (v === "needs_changes") return <Badge className="bg-amber-500/20 text-amber-200 border border-amber-300/30">Needs changes</Badge>;
    if (v === "submitted") return <Badge className="bg-sky-500/20 text-sky-200 border border-sky-300/30">Submitted</Badge>;
    return <Badge className="bg-white/10 text-white/80 border border-white/20">Draft</Badge>;
  };

  return (
    <main className="min-h-screen px-4 py-10 bg-[var(--cb-bg)] text-white">
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="text-2xl font-bold tracking-wide">Vendor Intake</div>
            <div className="text-white/70 text-sm mt-1">
              Logged in as: <span className="text-white/90">{email}</span>
            </div>
            <div className="mt-2">{badge(status)}</div>
          </div>

          <Button
            variant="secondary"
            onClick={signOut}
            className="bg-[var(--cb-input-bg)] text-black hover:bg-[var(--cb-input-bg)]/90"
          >
            Sign out
          </Button>
        </div>

        <Card className="bg-[var(--cb-panel)] border border-[var(--cb-border)] shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Company information</CardTitle>
            <CardDescription className="text-white/70">
              Please fill out the required fields. Save draft anytime, then submit for admin review.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {msg ? <div className="text-sm text-white/80">{msg}</div> : null}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-white/80">Legal name *</Label>
                <Input className="cb-input cb-input-focus" value={form.legal_name} onChange={(e) => setField("legal_name", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">DBA name</Label>
                <Input className="cb-input cb-input-focus" value={form.dba_name} onChange={(e) => setField("dba_name", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Website</Label>
                <Input className="cb-input cb-input-focus" value={form.website} onChange={(e) => setField("website", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">AP / Billing email</Label>
                <Input className="cb-input cb-input-focus" value={form.ap_email} onChange={(e) => setField("ap_email", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Primary contact name</Label>
                <Input className="cb-input cb-input-focus" value={form.primary_contact_name} onChange={(e) => setField("primary_contact_name", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Primary contact email</Label>
                <Input className="cb-input cb-input-focus" value={form.primary_contact_email} onChange={(e) => setField("primary_contact_email", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Primary contact phone</Label>
                <Input className="cb-input cb-input-focus" value={form.primary_contact_phone} onChange={(e) => setField("primary_contact_phone", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Address line 1</Label>
                <Input className="cb-input cb-input-focus" value={form.address_line1} onChange={(e) => setField("address_line1", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Address line 2</Label>
                <Input className="cb-input cb-input-focus" value={form.address_line2} onChange={(e) => setField("address_line2", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">City</Label>
                <Input className="cb-input cb-input-focus" value={form.city} onChange={(e) => setField("city", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">State</Label>
                <Input className="cb-input cb-input-focus" value={form.state} onChange={(e) => setField("state", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">ZIP</Label>
                <Input className="cb-input cb-input-focus" value={form.zip} onChange={(e) => setField("zip", e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/80">Notes</Label>
              <Textarea className="cb-input cb-input-focus min-h-[120px]" value={form.notes} onChange={(e) => setField("notes", e.target.value)} />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                className="w-full sm:w-auto bg-[var(--cb-input-bg)] text-black hover:bg-[var(--cb-input-bg)]/90"
                onClick={() => upsert("draft")}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save draft"}
              </Button>

              <Button
                className="w-full sm:w-auto bg-[var(--cb-input-bg)] text-black hover:bg-[var(--cb-input-bg)]/90"
                onClick={() => upsert("submitted")}
                disabled={saving || !requiredOk}
              >
                {saving ? "Submitting..." : "Submit for review"}
              </Button>

              <div className="sm:ml-auto text-xs text-white/50 flex items-center">
                Vendor ID: <span className="ml-1 break-all text-white/60">{vendorId}</span>
              </div>
            </div>

            {!requiredOk ? (
              <div className="text-xs text-white/60">
                Legal name is required to submit.
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
