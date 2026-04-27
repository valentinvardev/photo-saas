"use client";

import { useState } from "react";
import Link from "next/link";
import { useDeliveryStore } from "~/lib/delivery/store";
import { GalleryView } from "~/components/delivery/GalleryView";

export function DeliveryPublicView({ pageId }: { pageId: string }) {
  const page = useDeliveryStore((s) => s.pages.find((p) => p.id === pageId));
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

  // Password gate (mock — just shows it's protected, doesn't actually block)
  if (page.passwordEnabled) {
    return <PasswordGate pageId={pageId} />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      <GalleryView page={page} viewport="desktop" />
    </div>
  );
}

function PasswordGate({ pageId }: { pageId: string }) {
  const page = useDeliveryStore((s) => s.pages.find((p) => p.id === pageId))!;
  const [pwd, setPwd] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);

  if (unlocked) {
    return (
      <div className="h-screen w-screen overflow-hidden">
        <GalleryView page={page} viewport="desktop" />
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd === page.password) { setUnlocked(true); setError(false); }
    else setError(true);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center" style={{
      background: page.coverUrl
        ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${page.coverUrl}) center/cover`
        : `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(https://picsum.photos/seed/${page.coverSeed}/1600/900?grayscale) center/cover`,
    }}>
      <form onSubmit={submit} style={{
        background: "rgba(20,20,20,0.85)", backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16,
        padding: "32px 36px", width: 360, color: "#fff",
      }}>
        <div style={{ fontFamily: page.fontFamily || "Inter, sans-serif", fontWeight: 900, fontSize: 22, marginBottom: 4, letterSpacing: "-0.02em" }}>{page.title}</div>
        <div style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 24 }}>{page.client}</div>
        <label style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>Password</label>
        <input
          autoFocus type="password" value={pwd} onChange={(e) => { setPwd(e.target.value); setError(false); }}
          style={{
            width: "100%", padding: "10px 12px", borderRadius: 8,
            background: "rgba(255,255,255,0.05)", border: error ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.15)",
            color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box",
          }}
        />
        {error && <p style={{ fontSize: 11, color: "#ef4444", marginTop: 6 }}>Incorrect password</p>}
        <button type="submit" style={{
          marginTop: 16, width: "100%", padding: "10px", borderRadius: 8,
          background: "#fad502", color: "#111", fontWeight: 700, fontSize: 13,
          border: "none", cursor: "pointer",
        }}>
          Unlock gallery
        </button>
      </form>
    </div>
  );
}
