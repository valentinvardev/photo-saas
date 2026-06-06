"use client";

import { use } from "react";
import { api } from "~/trpc/react";
import { flattenContentPhotos } from "~/lib/portfolio/contentPhotos";
import { PortfolioSiteRender } from "~/components/portfolio/PortfolioSiteRender";
import { ErrorBoundary } from "~/components/ui/ErrorBoundary";
import type { PortfolioDesign } from "~/lib/editor/store";

function isDesign(v: unknown): v is PortfolioDesign {
  return !!v && typeof v === "object";
}

/**
 * Owner-only preview of the website-builder design — renders the latest saved
 * design (the editor autosaves), regardless of published status.
 */
export default function PortfolioPreviewPage({ params }: { params: Promise<{ portfolioId: string }> }) {
  const { portfolioId } = use(params);
  const { data, isLoading, isError } = api.portfolio.get.useQuery({ id: portfolioId });

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fafafa" }}>
        <div style={{ width: 22, height: 22, borderRadius: "50%", border: "2px solid #ddd", borderTopColor: "#111", animation: "pv-spin 0.8s linear infinite" }} />
        <style>{`@keyframes pv-spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }
  if (isError || !data) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui", color: "#666" }}>Portfolio not found.</div>;
  }

  const design: PortfolioDesign = isDesign(data.editorState) ? data.editorState : { templateId: "minimal-bw" };

  return (
    <ErrorBoundary>
      <PortfolioSiteRender design={design} galleryPhotos={flattenContentPhotos(data.content)} />
    </ErrorBoundary>
  );
}
