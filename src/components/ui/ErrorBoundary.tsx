"use client";

import { Component, type ReactNode } from "react";

/**
 * Generic error boundary. Keeps a render crash from white-screening the page
 * and (by default) shows the error message + stack so it can be diagnosed.
 */
export class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: (error: Error) => ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error) {
    console.error("[ErrorBoundary]", error);
  }

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback(this.state.error);
      return (
        <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#e5e5e5", padding: 24, fontFamily: "monospace", fontSize: 12 }}>
          <p style={{ color: "#f87171", fontWeight: 700, marginBottom: 12, fontSize: 14 }}>Something went wrong</p>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", color: "#f87171" }}>{this.state.error.message}</pre>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", color: "#888", marginTop: 12, fontSize: 11 }}>{this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
