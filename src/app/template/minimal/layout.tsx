import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Space_Mono } from "next/font/google";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500", "600"], style: ["normal", "italic"], display: "swap", variable: "--mn-serif" });
const sans  = DM_Sans({              subsets: ["latin"], weight: ["300", "400", "500", "600"],                                  display: "swap", variable: "--mn-sans"  });
const mono  = Space_Mono({           subsets: ["latin"], weight: ["400", "700"],                                                display: "swap", variable: "--mn-mono"  });

export const metadata: Metadata = { title: "Minimal — Client Gallery" };

export default function MinimalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${serif.variable} ${sans.variable} ${mono.variable}`} style={{ background: "#FAFAFA" }}>
      {children}
    </div>
  );
}
