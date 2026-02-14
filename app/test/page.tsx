"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function TestPage() {
  const [msg, setMsg] = useState("Running...");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) setMsg("❌ " + error.message);
      else setMsg("✅ Supabase connected. Session fetched.");
    })();
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Supabase Test</h1>
      <p>{msg}</p>
    </main>
  );
}
