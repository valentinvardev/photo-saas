"use client";

import { use } from "react";
import dynamic from "next/dynamic";
import { api } from "~/trpc/react";
import { flattenContentPhotos } from "~/lib/portfolio/contentPhotos";
import type { PortfolioDesign } from "~/lib/editor/store";

const EditorShell = dynamic(
  () => import("~/components/editor/core/EditorShell").then((m) => m.EditorShell),
  { ssr: false },
);

function isDesign(v: unknown): v is PortfolioDesign {
  return !!v && typeof v === "object";
}

export default function EditorByPortfolioPage({ params }: { params: Promise<{ portfolioId: string }> }) {
  const { portfolioId } = use(params);
  const { data, isLoading, isError } = api.portfolio.get.useQuery({ id: portfolioId });

  if (isLoading) {
    return (
      <div style={{ height: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a" }}>
        <div style={{ width: 24, height: 24, borderRadius: "50%", border: "2px solid #333", borderTopColor: "#fad502", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }
  if (isError || !data) {
    return (
      <div style={{ height: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a", color: "#fff", fontFamily: "system-ui" }}>
        Portfolio not found.
      </div>
    );
  }

  const design: PortfolioDesign = isDesign(data.editorState) ? data.editorState : { templateId: "minimal-bw" };
  const galleryPhotos = flattenContentPhotos(data.content);

  return <EditorShell portfolioId={portfolioId} initialDesign={design} galleryPhotos={galleryPhotos} />;
}
