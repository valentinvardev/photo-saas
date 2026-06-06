"use client";

import { Component, type ReactNode } from "react";

/**
 * Keeps a crash inside the chat from taking down the whole dashboard.
 * Shows the actual error message so it can be diagnosed in-app.
 */
export class ChatErrorBoundary extends Component<
  { children: ReactNode; onClose: () => void },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error("[chat] crashed:", error);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col h-full bg-[var(--bg-card)] border-l border-[var(--border)]">
          <div className="flex items-center justify-between px-3 py-3 border-b border-[var(--border)]">
            <span className="font-sans text-sm font-semibold text-[var(--fg)]">Community</span>
            <button onClick={this.props.onClose} className="p-1.5 rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors" aria-label="Close chat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <p className="font-sans text-sm font-semibold text-[var(--fg)] mb-2">Chat failed to load</p>
            <pre className="font-mono text-[10px] text-red-400 whitespace-pre-wrap break-words bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {this.state.error.message}
            </pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
