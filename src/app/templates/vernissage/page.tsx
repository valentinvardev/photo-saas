"use client";

/**
 * Vernissage — live template demo.
 * Renders the real builder template read-only with its design defaults
 * (hydrateDesign fills palette/typography/grid/logo from the registry), so
 * the demo, the editor canvas and the published site share one source of
 * truth. Demo artworks come from the template's built-in fallback set.
 */

import dynamic from "next/dynamic";

const PortfolioSiteRender = dynamic(
  () => import("~/components/portfolio/PortfolioSiteRender").then((m) => m.PortfolioSiteRender),
  { ssr: false }
);

export default function VernissageDemoPage() {
  return <PortfolioSiteRender design={{ templateId: "vernissage" }} galleryPhotos={[]} />;
}
