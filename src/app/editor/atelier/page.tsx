"use client";

import dynamic from "next/dynamic";

const EditorShell = dynamic(
  () => import("~/components/editor/core/EditorShell").then((m) => m.EditorShell),
  { ssr: false }
);

export default function EditorPage() {
  return <EditorShell templateId="atelier" />;
}
