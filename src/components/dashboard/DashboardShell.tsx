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
    if (!ticking.current) {
      requestAnimationFrame(() => {
        const delta = y - lastScrollY.current;
        if (delta > 4)       setHeaderVisible(false); // scrolling down
        else if (delta < -4) setHeaderVisible(true);  // scrolling up
        lastScrollY.current = y;
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header — absolutely positioned so it never affects layout.
            Fades out on scroll-down, fades back in on scroll-up.
            pointerEvents:none when invisible so clicks pass through. */}
        <div
          className="absolute top-0 left-0 right-0 z-30"
          style={{
            opacity:       headerVisible ? 1 : 0,
            pointerEvents: headerVisible ? "auto" : "none",
            transition:    "opacity 200ms ease-in-out",
          }}
        >
          <DashboardHeader
            onMenuClick={() => setSidebarOpen(true)}
            onChatClick={() => setChatOpen((p) => !p)}
            chatOpen={chatOpen}
          />
        </div>

        <div className="flex-1 flex min-h-0">
          <main className="flex-1 overflow-y-auto pt-14" onScroll={onScroll}>
            {children}
          </main>

          {/* Chat panel — slides in alongside content */}
          {chatOpen && (
            <div className="w-80 shrink-0 hidden md:flex flex-col border-l border-[var(--border)] h-full">
              <ChatPanel onClose={() => setChatOpen(false)} />
            </div>
          )}

          {/* Mobile chat — full-screen overlay */}
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
