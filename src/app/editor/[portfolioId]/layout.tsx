import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Space_Mono } from "next/font/google";
import "~/styles/editor.css";

export const metadata: Metadata = {
  title: "Website builder | Portapic",
};

/* Same fonts the minimal-bw template uses, mapped to the same CSS variables. */
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

/**
 * Provides the `.editor-root` scope (defines --ed-topbar-h, --ed-sidebar-w,
 * etc.) + the template fonts for the portfolio-bound builder and its preview.
 * Uses minHeight (not fixed height + overflow:hidden) so the /preview child can
 * scroll while the editor self-constrains to 100dvh.
 */
export default function EditorPortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`editor-root ${cormorant.variable} ${dmSans.variable} ${spaceMono.variable}`}
      style={{ minHeight: "100dvh" }}
    >
      {children}
    </div>
  );
}
