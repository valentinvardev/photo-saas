import type { Metadata } from "next";
import { Instrument_Serif, Geist, Geist_Mono } from "next/font/google";
import "~/styles/editor.css";

export const metadata: Metadata = {
  title: "Editor — Halcyon | FRAME",
};

/* Halcyon's editable fork drives colours + fonts from the editor CSS variables
   (--tpl-serif / --tpl-sans / --tpl-mono). Load the template's own fonts under
   the same variable names so the canvas preview matches the live template. */
const serif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--tpl-serif",
  display: "swap",
  weight: ["400"],
  style: ["normal", "italic"],
});
const sans = Geist({
  subsets: ["latin"],
  variable: "--tpl-sans",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});
const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--tpl-mono",
  display: "swap",
  weight: ["400", "500"],
});

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`editor-root ${serif.variable} ${sans.variable} ${mono.variable}`}
      style={{ height: "100dvh", overflow: "hidden" }}
    >
      {children}
    </div>
  );
}
