import type { Metadata } from "next";
import { Instrument_Serif, Geist, Geist_Mono } from "next/font/google";

const serif = Instrument_Serif({ subsets: ["latin"], weight: ["400"], style: ["normal", "italic"], display: "swap", variable: "--hl-serif" });
const sans  = Geist({               subsets: ["latin"], weight: ["300", "400", "500", "600"],         display: "swap", variable: "--hl-sans"  });
const mono  = Geist_Mono({          subsets: ["latin"], weight: ["400", "500"],                        display: "swap", variable: "--hl-mono"  });

export const metadata: Metadata = { title: "Halcyon — Photography by Lior Avni" };

export default function HalcyonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${serif.variable} ${sans.variable} ${mono.variable}`} style={{ background: "#0E0D0B" }}>
      {children}
    </div>
  );
}
