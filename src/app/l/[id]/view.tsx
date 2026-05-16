"use client";

import { useLinksStore } from "~/lib/links/store";
import { BrooklynLinks } from "~/app/template/brooklyn/links/component";

/* Public client-facing links page. Single source of truth — renders the
   canonical template per page.template, reading data from the Zustand
   store (same data the dashboard edits). */
export function LinksPublicView({ pageId: _pageId }: { pageId: string }) {
  /* Single-page model for now: every public route id falls back to the
     same default page in the store. When multi-page support lands the
     pageId will pick from an array. */
  void _pageId;
  const page     = useLinksStore((s) => s.page);
  const hydrated = useLinksStore((s) => s.hydrated);

  if (!hydrated) {
    return (
      <div style={{ height: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a", color: "#888" }}>
        <span style={{ fontFamily: "monospace", fontSize: 11 }}>Loading…</span>
      </div>
    );
  }

  /* Template dispatch — for now brooklyn only. Future templates plug in
     here by mapping page.template to their canonical component. */
  return (
    <div style={{ minHeight: "100dvh", width: "100%" }}>
      <BrooklynLinks page={page} />
    </div>
  );
}
