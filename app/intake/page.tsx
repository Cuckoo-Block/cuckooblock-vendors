export default function IntakePage() {
  return (
    <main style={{ minHeight: "100vh", padding: 32, maxWidth: 900, margin: "0 auto" }}>
      <a href="/" style={{ textDecoration: "none", opacity: 0.8 }}>← Back</a>

      <h1 style={{ fontSize: 28, fontWeight: 800, marginTop: 14 }}>Vendor Intake</h1>
      <p style={{ opacity: 0.8, marginTop: 6 }}>
        Fill out the basics. We’ll add file uploads + approval workflow next.
      </p>

      <form
        method="post"
        action="/api/intake"
        style={{
          marginTop: 18,
          display: "grid",
          gap: 12,
          padding: 16,
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <label>
          Company name
          <input name="companyName" required style={inputStyle} />
        </label>

        <label>
          Website
          <input name="website" placeholder="https://..." style={inputStyle} />
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label>
            Contact name
            <input name="contactName" required style={inputStyle} />
          </label>

          <label>
            Contact email
            <input name="contactEmail" type="email" required style={inputStyle} />
          </label>
        </div>

        <label>
          What do you supply?
          <textarea name="capabilities" rows={4} style={inputStyle} />
        </label>

        <button
          type="submit"
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.2)",
            background: "transparent",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Submit Intake
        </button>
      </form>

      <p style={{ marginTop: 14, opacity: 0.7 }}>
        After submit, you’ll see a confirmation message.
      </p>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  marginTop: 6,
  padding: 10,
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "transparent",
  color: "inherit",
};
