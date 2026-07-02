import type { Metadata } from "next";
import { Playfair_Display, Manrope, IBM_Plex_Mono } from "next/font/google";
import "~/styles/editor.css";

export const metadata: Metadata = {
  title: "Editor — Meridian | FRAME",
};

/* Load Meridian's fonts under the editor CSS variable names so the canvas
   preview matches the Design panel typography. */
const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--tpl-serif",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});
const sans = Manrope({
  subsets: ["latin"],
  variable: "--tpl-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});
const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--tpl-mono",
  display: "swap",
  weight: ["400", "500"],
});

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`editor-root ${serif.variable} ${sans.variable} ${monoFont.variable}`}
      style={{ height: "100dvh", overflow: "hidden" }}
    >
      {children}
    </div>
  );
}
