import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Space_Mono } from "next/font/google";
import "~/styles/editor.css";

export const metadata: Metadata = {
  title: "Editor — Minimal BW | FRAME",
};

/* Load the same fonts the template uses, with the same CSS variable names */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--tpl-serif",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--tpl-sans",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});
const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--tpl-mono",
  display: "swap",
  weight: ["400", "700"],
});

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`editor-root ${cormorant.variable} ${dmSans.variable} ${spaceMono.variable}`}
      style={{ height: "100dvh", overflow: "hidden" }}
    >
      {children}
    </div>
  );
}
