import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TipTwice — Give with every checkout",
  description: "Add a small gift to your online purchase for a verified charity or church you care about.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
