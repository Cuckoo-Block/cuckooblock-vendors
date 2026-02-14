import "./globals.css";

import "@fontsource/saira/300.css";
import "@fontsource/saira/700.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-saira antialiased">{children}</body>
    </html>
  );
}
