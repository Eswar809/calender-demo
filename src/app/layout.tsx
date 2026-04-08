/**
 * @fileoverview Nelala Calendar — Root Layout
 *
 * Server Component that provides:
 *   1. Plus Jakarta Sans font via next/font/google (zero layout shift)
 *   2. SEO metadata (title, description)
 *   3. HTML structure with antialiased text rendering
 *
 * The font is loaded with weight range 300–800 to match the original
 * design which uses weights from light (300) to extrabold (800).
 */

import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// ── Font Configuration ──
// Plus Jakarta Sans — the premium geometric sans-serif used throughout.
// Using `variable` mode allows Tailwind to reference it via CSS custom property.
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

// ── SEO Metadata ──
export const metadata: Metadata = {
  title: "Nelala Calendar — Premium Interactive Calendar",
  description:
    "A beautifully crafted interactive wall calendar with dynamic theming, date range selection, and monthly notes. Built with Next.js and React.",
};

// ─────────────────────────────────────────────────────────
// ROOT LAYOUT
// ─────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
