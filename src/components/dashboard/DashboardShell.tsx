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
      // Always show when near the top
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
    <div className="flex h-screen overflow-hidden bg-[var(--bg)]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header stays in the normal flex flow — layout never changes.
            Only opacity animates so nothing shifts or clips. */}
        <div
          className="shrink-0 transition-opacity duration-200"
          style={{
            opacity:       headerVisible ? 1 : 0,
            pointerEvents: headerVisible ? "auto" : "none",
          }}
        >
          <DashboardHeader
            onMenuClick={() => setSidebarOpen(true)}
            onChatClick={() => setChatOpen((p) => !p)}
            chatOpen={chatOpen}
          />
        </div>

        <div className="flex-1 flex min-h-0">
          <main className="flex-1 overflow-y-auto" onScroll={onScroll}>
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
