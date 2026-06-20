import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "~/styles/editor.css";

export const metadata: Metadata = {
  title: "Editor — Halcyon | FRAME",
};

/* Halcyon's editable fork drives colours + fonts from the editor CSS variables
   (--tpl-serif / --tpl-sans / --tpl-mono). Its default typography uses fonts
   that are bundled in the editor; load them here under the same variable names
   so the canvas preview matches what the Design panel applies. */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--tpl-serif",
  display: "swap",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--tpl-sans",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--tpl-mono",
  display: "swap",
  weight: ["400", "500"],
});

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`editor-root ${fraunces.variable} ${inter.variable} ${jetbrains.variable}`}
      style={{ height: "100dvh", overflow: "hidden" }}
    >
      {children}
    </div>
  );
}
