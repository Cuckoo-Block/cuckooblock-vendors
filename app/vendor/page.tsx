"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function VendorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [vendorId, setVendorId] = useState<string | null>(null);

  const [form, setForm] = useState({
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
  });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;

      if (!user) {
        router.push("/login");
        return;
      }

      setVendorId(user.id);

      const { data: existing } = await supabase
        .from("vendors")
        .select("*")
        .eq("id", user.id)
        .single();

      if (existing) {
        setForm({
          legal_name: existing.legal_name ?? "",
          dba_name: existing.dba_name ?? "",
          website: existing.website ?? "",
          primary_contact_name: existing.primary_contact_name ?? "",
          primary_contact_email: existing.primary_contact_email ?? "",
          primary_contact_phone: existing.primary_contact_phone ?? "",
          address_line1: existing.address_line1 ?? "",
          address_line2: existing.address_line2 ?? "",
          city: existing.city ?? "",
          state: existing.state ?? "",
          zip: existing.zip ?? "",
          ap_email: existing.ap_email ?? "",
          notes: existing.notes ?? "",
        });
      }

      setLoading(false);
    })();
  }, [router]);

  const upsert = async (status: string) => {
    if (!vendorId) return;

    setSaving(true);

    const { error } = await supabase
      .from("vendors")
      .upsert({
        id: vendorId,
        ...form,
        status,
      });

    setSaving(false);

    if (error) {
      alert("Save error: " + error.message);
    } else {
      alert(status === "draft" ? "Draft saved." : "Submitted for review.");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen flex justify-center px-4 py-10 bg-[var(--cb-bg)] text-white">
      <div className="w-full max-w-3xl">
        <Card className="bg-[var(--cb-panel)] border border-[var(--cb-border)]">
          <CardHeader>
            <CardTitle>Vendor Intake</CardTitle>
            <CardDescription className="text-white/70">
              Complete your company information.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">

            <div>
              <Label>Legal Name</Label>
              <Input
                className="bg-gray-200 text-black"
                value={form.legal_name}
                onChange={(e) => setForm({ ...form, legal_name: e.target.value })}
              />
            </div>

            <div>
              <Label>DBA Name</Label>
              <Input
                className="bg-gray-200 text-black"
                value={form.dba_name}
                onChange={(e) => setForm({ ...form, dba_name: e.target.value })}
              />
            </div>

            <div>
              <Label>Website</Label>
              <Input
                className="bg-gray-200 text-black"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
              />
            </div>

            <div>
              <Label>Primary Contact Name</Label>
              <Input
                className="bg-gray-200 text-black"
                value={form.primary_contact_name}
                onChange={(e) => setForm({ ...form, primary_contact_name: e.target.value })}
              />
            </div>

            <div>
              <Label>Primary Contact Email</Label>
              <Input
                className="bg-gray-200 text-black"
                value={form.primary_contact_email}
                onChange={(e) => setForm({ ...form, primary_contact_email: e.target.value })}
              />
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                className="bg-gray-200 text-black"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                className="bg-gray-200 text-black hover:bg-gray-300"
                onClick={() => upsert("draft")}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Draft"}
              </Button>

              <Button
                className="bg-gray-300 text-black hover:bg-gray-400"
                onClick={() => upsert("submitted")}
                disabled={saving}
              >
                {saving ? "Submitting..." : "Submit for Review"}
              </Button>
            </div>

          </CardContent>
        </Card>
      </div>
    </main>
  );
}
