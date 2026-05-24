import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minimal — Links | FRAME",
};

export default function MinimalLinksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
