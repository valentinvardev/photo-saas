"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "./Header";
import { ChatPanel } from "./ChatPanel";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen]       = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader
          onMenuClick={() => setSidebarOpen(true)}
          onChatClick={() => setChatOpen((p) => !p)}
          chatOpen={chatOpen}
        />

        <div className="flex-1 flex min-h-0">
          <main className="flex-1 overflow-y-auto">
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
    </div>
  );
}
