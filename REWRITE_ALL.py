from pathlib import Path

root = Path("/home/admin/cuckooblock-vendors")
(root / "app/login").mkdir(parents=True, exist_ok=True)
(root / "app/vendor").mkdir(parents=True, exist_ok=True)
(root / "app/admin").mkdir(parents=True, exist_ok=True)
(root / "lib").mkdir(parents=True, exist_ok=True)

files = {}

files["lib/supabaseClient.ts"] = """import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
"""

files["app/layout.tsx"] = """import "./globals.css";

import "@fontsource/saira/300.css";
import "@fontsource/saira/700.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-saira antialiased">{children}</body>
    </html>
  );
}
"""

files["app/globals.css"] = """@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --cb-bg: #01121f;
  --cb-fg: #ffffff;

  --cb-panel: rgba(255, 255, 255, 0.06);
  --cb-border: rgba(255, 255, 255, 0.18);
  --cb-border-strong: rgba(255, 255, 255, 0.55);

  --cb-input-bg: #e6e7ea;
  --cb-input-fg: #0b0f14;
}

html, body { height: 100%; }

body {
  background: var(--cb-bg);
  color: var(--cb-fg);
}

.font-saira {
  font-family: "Saira", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Noto Sans", "Liberation Sans", sans-serif;
}

.cb-input {
  background: var(--cb-input-bg) !important;
  color: var(--cb-input-fg) !important;
  border: 1px solid var(--cb-border-strong) !important;
}

.cb-input:focus {
  outline: none !important;
  border-color: rgba(255,255,255,0.95) !important;
  box-shadow: 0 0 0 3px rgba(255,255,255,0.22) !important;
}
"""

files["tailwind.config.ts"] = """import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        saira: ["Saira", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
"""

files["postcss.config.mjs"] = """const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
"""

# Keep your existing pages if you already have them working.
# (We only rewrite the core config files here to prevent corruption.)
for rel, content in files.items():
  p = root / rel
  p.parent.mkdir(parents=True, exist_ok=True)
  p.write_text(content, encoding="utf-8")

print("OK: rewrote core config files:")
for rel in files.keys():
  print(" -", rel)
