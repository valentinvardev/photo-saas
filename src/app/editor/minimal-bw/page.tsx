"use client";

import dynamic from "next/dynamic";

// EditorShell is client-only (uses browser APIs, react-resizable-panels)
const EditorShell = dynamic(
  () => import("~/components/editor/core/EditorShell").then((m) => m.EditorShell),
  { ssr: false }
);

export default function EditorPage() {
  return <EditorShell />;
}
