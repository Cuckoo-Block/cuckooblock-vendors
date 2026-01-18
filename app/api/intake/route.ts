import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();

  const payload = {
    companyName: String(formData.get("companyName") ?? ""),
    website: String(formData.get("website") ?? ""),
    contactName: String(formData.get("contactName") ?? ""),
    contactEmail: String(formData.get("contactEmail") ?? ""),
    capabilities: String(formData.get("capabilities") ?? ""),
    createdAt: new Date().toISOString(),
  };

  // For now: log it. Next step: save to DB (SQLite/Postgres) + admin review.
  console.log("NEW VENDOR INTAKE:", payload);

  return NextResponse.json({ ok: true, payload });
}
