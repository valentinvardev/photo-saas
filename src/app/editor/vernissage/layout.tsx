import type { Metadata } from "next";
import { Fraunces, Space_Grotesk, Space_Mono } from "next/font/google";
import "~/styles/editor.css";

export const metadata: Metadata = {
  title: "Editor — Vernissage | FRAME",
};

/* Load Vernissage's fonts under the editor CSS variable names so the canvas
   preview matches the Design panel typography. */
const serif = Fraunces({
  subsets: ["latin"],
  variable: "--tpl-serif",
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});
const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--tpl-sans",
  display: "swap",
  weight: ["400", "500", "600"],
});
const monoFont = Space_Mono({
  subsets: ["latin"],
  variable: "--tpl-mono",
  display: "swap",
  weight: ["400", "700"],
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
