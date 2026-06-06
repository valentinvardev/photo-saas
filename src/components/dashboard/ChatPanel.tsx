"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { api } from "~/trpc/react";
import { createClient } from "~/lib/supabase/client";

/* ── Types ── */
type ChatMessage = {
  id: string;
  userId: string;
  authorName: string;
  body: string;
  createdAt: string;
  pending?: boolean;
  failed?: boolean;
};

/* ── Helpers ── */
const PALETTE = ["#fad502", "#3b82f6", "#10b981", "#f97316", "#8b5cf6", "#ec4899", "#14b8a6", "#6366f1"];
function colorFor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return PALETTE[Math.abs(h) % PALETTE.length]!;
}
function initialOf(name: string) {
  return (name.trim()[0] ?? "?").toUpperCase();
}
function toISO(v: unknown): string {
  const d = new Date(v as string | number | Date);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}
function timeOf(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

/* ── Icons ── */
const SendIcon  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const CloseIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>;

function Avatar({ name, size = 28 }: { name: string; size?: number }) {
  const color = colorFor(name);
  return (
    <div style={{ width: size, height: size, background: color, flexShrink: 0, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontWeight: 800, fontSize: size * 0.36, color: color === "#fad502" ? "#111" : "#fff", lineHeight: 1 }}>{initialOf(name)}</span>
    </div>
  );
}

/* Loading placeholder — mimics a few incoming/outgoing message bubbles. */
function ChatSkeleton() {
  const rows = [
    { own: false, w: "62%" },
    { own: false, w: "44%" },
    { own: true,  w: "54%" },
    { own: false, w: "70%" },
    { own: true,  w: "38%" },
    { own: false, w: "50%" },
  ];
  return (
    <div className="flex flex-col gap-3" aria-hidden>
      {rows.map((r, i) => (
        <div key={i} className={`flex gap-2 ${r.own ? "flex-row-reverse" : ""}`}>
          <div className="shrink-0 w-7">
            {!r.own && <div className="w-7 h-7 rounded-full bg-[var(--bg-subtle)] animate-pulse" />}
          </div>
          <div className={`flex flex-col gap-1.5 ${r.own ? "items-end" : "items-start"}`} style={{ width: r.w }}>
            <div className="h-2.5 w-16 rounded bg-[var(--bg-subtle)] animate-pulse" />
            <div className={`h-9 w-full bg-[var(--bg-subtle)] animate-pulse rounded-2xl ${r.own ? "rounded-tr-sm" : "rounded-tl-sm"}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Panel ── */
export function ChatPanel({ onClose }: { onClose: () => void }) {
  const { data: history, isLoading } = api.chat.list.useQuery({ limit: 50 });
  const sendMut = api.chat.send.useMutation();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft]       = useState("");
  const [meId, setMeId]         = useState<string | null>(null);
  const [meName, setMeName]     = useState("You");
  const [meReady, setMeReady]   = useState(false);
  const [connected, setConnected] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const seen = useRef<Set<string>>(new Set());

  const addMessage = useCallback((m: ChatMessage) => {
    if (seen.current.has(m.id)) return;
    setMessages((prev) => {
      // Reconcile with an optimistic message we already showed (same author + body).
      const idx = prev.findIndex((x) => x.pending && x.userId === m.userId && x.body === m.body);
      seen.current.add(m.id);
      if (idx >= 0) { const next = [...prev]; next[idx] = m; return next; }
      return [...prev, m];
    });
  }, []);

  /* Who am I (for own-message styling + optimistic sends).
     meReady gates the message list so bubbles never render on the wrong
     side before we know the current user's id. */
  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser()
      .then(({ data }) => {
        setMeId(data.user?.id ?? null);
        const meta = (data.user?.user_metadata ?? {}) as { full_name?: string; name?: string };
        setMeName(meta.full_name ?? meta.name ?? data.user?.email?.split("@")[0] ?? "You");
      })
      .finally(() => setMeReady(true));
  }, []);

  /* Seed from history */
  useEffect(() => {
    if (!history) return;
    for (const m of history) {
      addMessage({ id: m.id, userId: m.userId, authorName: m.authorName, body: m.body, createdAt: toISO(m.createdAt) });
    }
  }, [history, addMessage]);

  /* Live updates via Supabase Realtime — failure here must never crash the chat */
  useEffect(() => {
    let cleanup = () => { /* noop */ };
    try {
      const supabase = createClient();
      const channel = supabase
        .channel("community-chat")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "Message" }, (payload) => {
          const r = payload.new as Record<string, unknown>;
          addMessage({
            id: String(r.id),
            userId: String(r.userId),
            authorName: String(r.authorName ?? ""),
            body: String(r.body ?? ""),
            createdAt: String(r.createdAt ?? new Date().toISOString()),
          });
        })
        .subscribe((status) => setConnected(status === "SUBSCRIBED"));
      cleanup = () => { void supabase.removeChannel(channel); };
    } catch (err) {
      console.error("[chat] realtime setup failed:", err);
    }
    return () => cleanup();
  }, [addMessage]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function send() {
    const body = draft.trim();
    if (!body) return;
    setDraft("");

    // Optimistic: show it immediately as if sent.
    const tempId = "temp-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6);
    setMessages((prev) => [...prev, {
      id: tempId, userId: meId ?? "me", authorName: meName, body,
      createdAt: new Date().toISOString(), pending: true,
    }]);

    try {
      const created = await sendMut.mutateAsync({ body });
      // Reconciles the optimistic message (replaces it) via addMessage.
      addMessage({ id: created.id, userId: created.userId, authorName: created.authorName, body: created.body, createdAt: toISO(created.createdAt) });
    } catch {
      // Mark the optimistic message as failed instead of dropping it.
      setMessages((prev) => prev.map((m) => m.id === tempId ? { ...m, pending: false, failed: true } : m));
    }
  }

  return (
    <div className="flex flex-col h-full bg-[var(--bg-card)] border-l border-[var(--border)]">
      {/* Header */}
      <div className="shrink-0 flex items-center gap-2 px-3 py-3 border-b border-[var(--border)]">
        <div className="flex-1 flex flex-col">
          <span className="font-sans text-sm font-semibold text-[var(--fg)]">Community</span>
          <span className="font-mono text-[10px] text-[var(--fg-muted)] flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-green-500" : "bg-[var(--fg-muted)]"}`} />
            {connected ? "Live" : "Connecting…"}
          </span>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors" aria-label="Close chat">
          <CloseIcon />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-3">
        {/* Keep the skeleton up until: history is fetched AND merged into state
            (so the empty placeholder never flashes), and we know who the current
            user is (so own messages never render on the wrong side first). */}
        {(isLoading || !meReady || (messages.length === 0 && (history?.length ?? 0) > 0)) ? (
          <ChatSkeleton />
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-[var(--fg-muted)]">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
            </svg>
            <p className="font-sans text-xs">No messages yet — say hello.</p>
          </div>
        ) : null}
        {messages.map((msg, i) => {
          const own = !!meId && msg.userId === meId;
          const prev = messages[i - 1];
          const showSender = !prev || prev.userId !== msg.userId;
          return (
            <div key={msg.id} className={`flex gap-2 ${own ? "flex-row-reverse" : ""}`}>
              <div className="shrink-0 w-7">
                {showSender && !own && <Avatar name={msg.authorName} size={28} />}
              </div>
              <div className={`flex flex-col gap-1 max-w-[calc(100%-44px)] ${own ? "items-end" : "items-start"}`}>
                {showSender && (
                  <span className={`font-sans text-[11px] font-semibold text-[var(--fg-muted)] ${own ? "mr-1" : "ml-1"}`}>
                    {own ? timeOf(msg.createdAt) : `${msg.authorName} · ${timeOf(msg.createdAt)}`}
                  </span>
                )}
                <p className={`font-sans text-[13px] leading-relaxed px-3 py-2 rounded-2xl break-words max-w-[260px] transition-opacity ${msg.pending ? "opacity-60" : ""} ${own ? "bg-yellow text-[#111] rounded-tr-sm" : "bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--fg)] rounded-tl-sm"}`}>
                  {msg.body}
                </p>
                {msg.failed && (
                  <span className="font-mono text-[9px] text-red-400 mr-1">Not sent</span>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 px-3 py-3 border-t border-[var(--border)]">
        <div className="flex items-center gap-2 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl px-3 py-2 focus-within:border-yellow/50 transition-colors">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(); } }}
            placeholder="Message the community…"
            className="flex-1 bg-transparent font-sans text-sm text-[var(--fg)] placeholder:text-[var(--fg-muted)] outline-none min-w-0"
          />
          <button
            onClick={() => void send()}
            disabled={!draft.trim() || sendMut.isPending}
            className="shrink-0 w-7 h-7 rounded-lg bg-yellow text-[#111] flex items-center justify-center hover:bg-yellow/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Send"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
