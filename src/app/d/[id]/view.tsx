"use client";

import Link from "next/link";
import { useDeliveryStore } from "~/lib/delivery/store";
import { GalleryView } from "~/components/delivery/GalleryView";

/* The client-facing delivery page. Renders the canonical template via
   GalleryView — which dispatches per-template and includes the template's
   own password gate when one is enabled. No separate password screen here
   so what the photographer edits is exactly what the client sees. */

export function DeliveryPublicView({ pageId }: { pageId: string }) {
  const page     = useDeliveryStore((s) => s.pages.find((p) => p.id === pageId));
  const hydrated = useDeliveryStore((s) => s.hydrated);

  if (!hydrated) {
    return (
      <div className="h-screen w-screen flex items-center justify-center" style={{ background: "#0a0a0a", color: "#888" }}>
        <span style={{ fontFamily: "monospace", fontSize: 11 }}>Loading…</span>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gap-3" style={{ background: "#0a0a0a", color: "#fff" }}>
        <span style={{ fontFamily: "monospace", fontSize: 11, color: "#888", letterSpacing: "0.15em", textTransform: "uppercase" }}>404 — Not Found</span>
        <h1 style={{ fontFamily: "serif", fontSize: 32, fontWeight: 900 }}>Gallery not found</h1>
        <p style={{ color: "#888", fontSize: 13 }}>The delivery page you&rsquo;re looking for doesn&rsquo;t exist or has been removed.</p>
        <Link href="/" style={{ marginTop: 12, padding: "8px 18px", borderRadius: 8, background: "#fad502", color: "#111", fontWeight: 700, fontSize: 12, textDecoration: "none" }}>
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      <GalleryView page={page} viewport="desktop" enforceGate />
    </div>
  );
}
