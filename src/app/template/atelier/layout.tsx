import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Space_Mono } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--atelier-serif",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--atelier-sans",
});
const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--atelier-mono",
});

export const metadata: Metadata = {
  title: "Atelier — Delivery Template | FRAME",
};

export default function AtelierLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${cormorant.variable} ${inter.variable} ${mono.variable}`} style={{ minHeight: "100dvh", background: "#fafaf8" }}>
      {children}
    </div>
  );
}
