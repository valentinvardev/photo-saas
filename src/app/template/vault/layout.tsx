import type { Metadata } from "next";
import { Anton, Manrope, JetBrains_Mono } from "next/font/google";

const display = Anton({           subsets: ["latin"], weight: ["400"],                          display: "swap", variable: "--vt-display" });
const sans    = Manrope({         subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], display: "swap", variable: "--vt-sans"    });
const mono    = JetBrains_Mono({  subsets: ["latin"], weight: ["400", "500"],                   display: "swap", variable: "--vt-mono"    });

export const metadata: Metadata = { title: "Vault — An archive theme for photographers" };

export default function VaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      style={{
        background: "#F4F0E6",
        color: "#1A1714",
        ["--vt-bg" as string]:     "#F4F0E6",
        ["--vt-paper" as string]:  "#ECE5D2",
        ["--vt-fg" as string]:     "#1A1714",
        ["--vt-muted" as string]:  "#857C68",
        ["--vt-line" as string]:   "#D6CCB6",
        ["--vt-accent" as string]: "#A8462E",
        ["--vt-ease" as string]:   "cubic-bezier(.22,1,.36,1)",
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
