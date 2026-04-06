import type { Metadata } from "next";
import "~/styles/editor.css";

export const metadata: Metadata = {
  title: "Editor — Minimal BW | FRAME",
};

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="editor-root" style={{ height: "100dvh", overflow: "hidden" }}>
      {children}
    </div>
  );
}
