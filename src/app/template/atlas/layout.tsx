import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";

const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap", variable: "--at-display" });
const sans    = Geist({                subsets: ["latin"], weight: ["300", "400", "500", "600", "700"],                       display: "swap", variable: "--at-sans"    });
const mono    = Geist_Mono({           subsets: ["latin"], weight: ["400", "500"],                                            display: "swap", variable: "--at-mono"    });

export const metadata: Metadata = { title: "Atlas — Photographer Studio" };

export default function AtlasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      style={{
        background: AT_BG,
        color: AT_FG,
        ["--at-accent" as string]: "#2235FF",
        ["--at-bg" as string]:     "#EFEAE0",
        ["--at-raised" as string]: "#E4DDCB",
        ["--at-fg" as string]:     "#0E0E0E",
        ["--at-muted" as string]:  "#6E6A60",
        ["--at-line" as string]:   "#D5CDB9",
        ["--at-curtain" as string]:"cubic-bezier(.76,0,.24,1)",
        ["--at-reveal" as string]: "cubic-bezier(.22,1,.36,1)",
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

const AT_BG = "#EFEAE0";
const AT_FG = "#0E0E0E";
