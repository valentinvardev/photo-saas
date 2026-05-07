import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";

const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], display: "swap", variable: "--mn-display" });
const sans    = Geist({                subsets: ["latin"], weight: ["300", "400", "500", "600"],         display: "swap", variable: "--mn-sans"    });
const mono    = Geist_Mono({           subsets: ["latin"], weight: ["400", "500"],                       display: "swap", variable: "--mn-mono"    });

export const metadata: Metadata = { title: "Monolith — Studio Yara Sokol" };

export default function MonolithLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${display.variable} ${sans.variable} ${mono.variable}`} style={{ background: "#F5F4F1" }}>
      {children}
    </div>
  );
}
