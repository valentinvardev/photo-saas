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

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header — slides up when scrolling down, reclaims space with
            negative margin so no blank area is left behind. */}
        <div
          className="shrink-0 transition-all duration-300 ease-in-out"
          style={{
            transform:    headerVisible ? "translateY(0)" : "translateY(-100%)",
            marginBottom: headerVisible ? 0 : -56,
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
