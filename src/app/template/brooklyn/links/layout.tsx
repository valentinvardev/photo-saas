import type { Metadata } from "next";
import { DM_Serif_Display, Space_Grotesk, Space_Mono } from "next/font/google";

const serif = DM_Serif_Display({ subsets: ["latin"], weight: ["400"], style: ["normal", "italic"], display: "swap", variable: "--bk-serif" });
const sans  = Space_Grotesk({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], display: "swap", variable: "--bk-sans" });
const mono  = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap", variable: "--bk-mono" });

export const metadata: Metadata = { title: "Brooklyn — Links | FRAME" };

export default function BrooklynLinksLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${serif.variable} ${sans.variable} ${mono.variable}`} style={{ minHeight: "100dvh", background: "#0D0D0D" }}>
      {children}
    </div>
  );
}
