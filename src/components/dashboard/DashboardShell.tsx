"use client";

import { useState, useRef, useCallback } from "react";
import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "./Header";
import { ChatPanel } from "./ChatPanel";
import { CartPanel } from "./CartPanel";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen]       = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);

  const lastScrollY = useRef(0);
  const ticking     = useRef(false);

  const onScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    const y = (e.currentTarget as HTMLElement).scrollTop;
    if (ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      if (y < 10) {
        setHeaderVisible(true);
      } else {
        const delta = y - lastScrollY.current;
        if (delta > 6)       setHeaderVisible(false);
        else if (delta < -6) setHeaderVisible(true);
      }
      lastScrollY.current = y;
      ticking.current = false;
    });
  }, []);

  return (
    /* h-dvh instead of h-screen — respects iOS Safari dynamic bottom bar */
    <div className="flex overflow-hidden bg-[var(--bg)]" style={{ height: "100dvh" }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* relative: contains the absolute header. overflow-hidden: clips it
          as it slides up. bg-[var(--bg-card)]: matches header bg so the
          pt-14 slot is invisible when the header is hidden. */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[var(--bg-card)]">

        {/* Header: absolute within the right column. Slides up with
            translateY(-100%) — the parent overflow-hidden clips it.
            Layout is never affected; content always starts at pt-14. */}
        <div
          className="absolute inset-x-0 top-0 z-30 transition-transform duration-300 ease-in-out"
          style={{ transform: headerVisible ? "translateY(0)" : "translateY(-100%)" }}
        >
          <DashboardHeader
            onMenuClick={() => setSidebarOpen(true)}
            onChatClick={() => setChatOpen((p) => !p)}
            chatOpen={chatOpen}
          />
        </div>

        <div className="flex-1 flex min-h-0">
          {/* pt-14 = 56px permanent slot for the header.
              When visible: header overlays it.
              When hidden:  slot shows page background (same color — invisible). */}
          <main
            className="flex-1 overflow-y-auto pt-14"
            onScroll={onScroll}
          >
            {children}
          </main>

          {chatOpen && (
            <div className="w-80 shrink-0 hidden md:flex flex-col border-l border-[var(--border)] h-full">
              <ChatPanel onClose={() => setChatOpen(false)} />
            </div>
          )}

          {chatOpen && (
            <div className="md:hidden fixed inset-0 z-50 flex flex-col bg-[var(--bg-card)]">
              <ChatPanel onClose={() => setChatOpen(false)} />
            </div>
          )}
        </div>
      </div>

      <CartPanel />
    </div>
  );
}
