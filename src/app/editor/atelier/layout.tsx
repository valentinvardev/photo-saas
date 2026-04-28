import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Space_Mono } from "next/font/google";
import "~/styles/editor.css";

export const metadata: Metadata = {
  title: "Editor — Atelier | FRAME",
};

/* Atelier uses the same CSS variable names as the editor's typography panel
   (--tpl-serif / --tpl-sans / --tpl-mono) so palette/typography overrides work. */
const cormorant = Cormorant_Garamond({
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
const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--tpl-mono",
  display: "swap",
  weight: ["400", "700"],
});

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`editor-root ${cormorant.variable} ${inter.variable} ${spaceMono.variable}`}
      style={{ height: "100dvh", overflow: "hidden" }}
    >
      {children}
    </div>
  );
}
