export default function Home() {
  return (
    <main style={{ minHeight: "100vh", padding: 32, maxWidth: 900, margin: "0 auto" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 34, fontWeight: 700, margin: 0 }}>CuckooBlock Vendors</h1>
          <p style={{ opacity: 0.8, marginTop: 8 }}>
            Vendor onboarding + qualification intake. Simple, fast, and auditable.
          </p>
        </div>

        <a
          href="/intake"
          style={{
            display: "inline-block",
            padding: "12px 16px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.2)",
            textDecoration: "none",
          }}
        >
          Start Intake →
        </a>
      </header>

      <section style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        {[
          ["Step 1", "Basic company info + contacts"],
          ["Step 2", "Capabilities + certifications"],
          ["Step 3", "Risk + compliance checks"],
          ["Step 4", "Approve + vendor record"],
        ].map(([k, v]) => (
          <div key={k} style={{ padding: 16, borderRadius: 14, border: "1px solid rgba(255,255,255,0.15)" }}>
            <div style={{ fontWeight: 700 }}>{k}</div>
            <div style={{ opacity: 0.8, marginTop: 6 }}>{v}</div>
          </div>
        ))}
      </section>

      <footer style={{ marginTop: 40, opacity: 0.65 }}>
        <small>Next: we’ll build the intake form, validations, and storage.</small>
      </footer>
    </main>
  );
}
