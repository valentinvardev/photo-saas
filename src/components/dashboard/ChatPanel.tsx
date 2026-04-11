"use client";

import { useState, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════
   TYPES
═══════════════════════════════════════════ */
type TextMsg      = { kind: "text";      text: string };
type ImageMsg     = { kind: "image";     src: string; caption?: string };
type GalleryMsg   = { kind: "gallery";   images: string[]; caption?: string };
type PortfolioMsg = { kind: "portfolio"; name: string; tagline: string; previews: string[] };
type LinkMsg      = { kind: "link";      title: string; desc: string; url: string; domain: string };
type MsgContent   = TextMsg | ImageMsg | GalleryMsg | PortfolioMsg | LinkMsg;

interface Message {
  id: number;
  sender: string;
  initials: string;
  color: string;
  time: string;
  own?: boolean;
  content: MsgContent;
}

interface Member {
  name: string;
  initials: string;
  color: string;
  status: "online" | "away" | "offline";
  role?: string;
}

/* ═══════════════════════════════════════════
   DATA
═══════════════════════════════════════════ */
const MEMBERS: Member[] = [
  { name: "Sofia Chen",    initials: "S", color: "#fad502", status: "online",  role: "You" },
  { name: "James Hollis",  initials: "J", color: "#3b82f6", status: "online"  },
  { name: "Maya Rodriguez",initials: "M", color: "#10b981", status: "online"  },
  { name: "Luca Ferrante", initials: "L", color: "#f97316", status: "online"  },
  { name: "Aiko Tanaka",   initials: "A", color: "#8b5cf6", status: "online"  },
  { name: "Felix Wagner",  initials: "F", color: "#ec4899", status: "away"    },
  { name: "Priya Sharma",  initials: "P", color: "#14b8a6", status: "offline" },
  { name: "Tom Bradley",   initials: "T", color: "#6366f1", status: "offline" },
];

const MESSAGES: Message[] = [
  {
    id: 1, sender: "James Hollis", initials: "J", color: "#3b82f6", time: "9:04 AM",
    content: { kind: "text", text: "Morning everyone! Just finished a wedding shoot — 847 frames to cull. Send help." },
  },
  {
    id: 2, sender: "Maya Rodriguez", initials: "M", color: "#10b981", time: "9:06 AM",
    content: { kind: "text", text: "Good luck with that! AI select in Lightroom has been saving me lately." },
  },
  {
    id: 3, sender: "James Hollis", initials: "J", color: "#3b82f6", time: "9:08 AM",
    content: {
      kind: "image",
      src: "https://picsum.photos/seed/11/800/530?grayscale",
      caption: "One highlight from yesterday — ceremony light was incredible.",
    },
  },
  {
    id: 4, sender: "Sofia Chen", initials: "S", color: "#fad502", time: "9:10 AM", own: true,
    content: { kind: "text", text: "James that light is unreal. What lens?" },
  },
  {
    id: 5, sender: "James Hollis", initials: "J", color: "#3b82f6", time: "9:11 AM",
    content: { kind: "text", text: "85mm f/1.4. Nothing beats it for ceremonies indoors." },
  },
  {
    id: 6, sender: "Aiko Tanaka", initials: "A", color: "#8b5cf6", time: "9:15 AM",
    content: {
      kind: "gallery",
      images: [
        "https://picsum.photos/seed/201/400/500?grayscale",
        "https://picsum.photos/seed/202/400/500?grayscale",
        "https://picsum.photos/seed/220/400/500?grayscale",
        "https://picsum.photos/seed/230/400/500?grayscale",
      ],
      caption: "My latest portrait series — feedback welcome!",
    },
  },
  {
    id: 7, sender: "Sofia Chen", initials: "S", color: "#fad502", time: "9:17 AM", own: true,
    content: { kind: "text", text: "Aiko these are stunning. The tonal range in the first one especially." },
  },
  {
    id: 8, sender: "Luca Ferrante", initials: "L", color: "#f97316", time: "9:19 AM",
    content: {
      kind: "link",
      title: "The Decisive Moment in 2025 — Street Photography Reimagined",
      desc: "How contemporary photographers are reinterpreting Cartier-Bresson's philosophy with modern tools.",
      url: "https://aperture.org/editorial/decisive-moment-2025",
      domain: "aperture.org",
    },
  },
  {
    id: 9, sender: "Maya Rodriguez", initials: "M", color: "#10b981", time: "9:22 AM",
    content: {
      kind: "portfolio",
      name: "Maya Rodriguez",
      tagline: "Documentary & editorial — based in Barcelona",
      previews: [
        "https://picsum.photos/seed/63/400/300?grayscale",
        "https://picsum.photos/seed/71/400/300?grayscale",
        "https://picsum.photos/seed/82/400/300?grayscale",
      ],
    },
  },
  {
    id: 10, sender: "Felix Wagner", initials: "F", color: "#ec4899", time: "9:25 AM",
    content: { kind: "text", text: "Anyone know a solid batch watermarking plugin for Lightroom? The built-in one is painful." },
  },
  {
    id: 11, sender: "Luca Ferrante", initials: "L", color: "#f97316", time: "9:27 AM",
    content: {
      kind: "link",
      title: "LR/Mogrify 2 — The Lightroom Export Plugin",
      desc: "Batch watermarking, borders, output sharpening and more. Free for non-commercial use.",
      url: "https://www.photographers-toolbox.com/products/lrmogrify2.php",
      domain: "photographers-toolbox.com",
    },
  },
  {
    id: 12, sender: "Sofia Chen", initials: "S", color: "#fad502", time: "9:29 AM", own: true,
    content: { kind: "text", text: "LR/Mogrify is the one. Been using it for years." },
  },
];

/* ═══════════════════════════════════════════
   ICONS
═══════════════════════════════════════════ */
function SendIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
function ImageIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
    </svg>
  );
}
function LinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  );
}
function ExternalIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}
function ChatIcon2() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   AVATAR
═══════════════════════════════════════════ */
function Avatar({ initials, color, size = 28 }: { initials: string; color: string; size?: number }) {
  return (
    <div
      style={{ width: size, height: size, background: color, flexShrink: 0, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <span style={{ fontFamily: "var(--font-sans, sans-serif)", fontWeight: 800, fontSize: size * 0.36, color: color === "#fad502" ? "#111" : "#fff", lineHeight: 1 }}>
        {initials}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MESSAGE RENDERERS
═══════════════════════════════════════════ */
function TextBubble({ text, own }: { text: string; own?: boolean }) {
  return (
    <p
      className={`font-sans text-[13px] leading-relaxed px-3 py-2 rounded-2xl max-w-[260px] ${
        own
          ? "bg-yellow text-[#111] rounded-tr-sm"
          : "bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--fg)] rounded-tl-sm"
      }`}
    >
      {text}
    </p>
  );
}

function ImageBubble({ src, caption }: { src: string; caption?: string }) {
  return (
    <div className="max-w-[260px]">
      <div className="rounded-2xl overflow-hidden border border-[var(--border)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="w-full object-cover block" style={{ maxHeight: 200 }} />
      </div>
      {caption && <p className="font-sans text-[11px] text-[var(--fg-muted)] mt-1.5 px-1">{caption}</p>}
    </div>
  );
}

function GalleryBubble({ images, caption }: { images: string[]; caption?: string }) {
  const shown = images.slice(0, 4);
  const extra = images.length - 4;
  return (
    <div className="max-w-[260px]">
      <div className="grid grid-cols-2 gap-0.5 rounded-2xl overflow-hidden border border-[var(--border)]">
        {shown.map((src, i) => (
          <div key={i} className="relative aspect-square overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="w-full h-full object-cover block" />
            {i === 3 && extra > 0 && (
              <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                <span className="font-sans font-bold text-white text-sm">+{extra}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      {caption && <p className="font-sans text-[11px] text-[var(--fg-muted)] mt-1.5 px-1">{caption}</p>}
    </div>
  );
}

function PortfolioBubble({ name, tagline, previews }: PortfolioMsg) {
  return (
    <div className="max-w-[260px] rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg-card)]">
      {/* Preview strip */}
      <div className="grid grid-cols-3 h-20">
        {previews.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={src} alt="" className="w-full h-full object-cover" />
        ))}
      </div>
      {/* Info */}
      <div className="px-3 py-2.5">
        <div className="flex items-center gap-1.5 mb-0.5">
          <GlobeIcon />
          <span className="font-mono text-[9px] text-[var(--fg-muted)] uppercase tracking-widest">Portfolio</span>
        </div>
        <p className="font-sans text-sm font-semibold text-[var(--fg)]">{name}</p>
        <p className="font-sans text-[11px] text-[var(--fg-muted)] mt-0.5">{tagline}</p>
        <button className="mt-2.5 w-full font-sans text-xs font-semibold bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--fg)] px-3 py-1.5 rounded-lg hover:bg-yellow hover:text-[#111] hover:border-yellow transition-colors flex items-center justify-center gap-1.5">
          <ExternalIcon /> View portfolio
        </button>
      </div>
    </div>
  );
}

function LinkBubble({ title, desc, url, domain }: LinkMsg) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="max-w-[260px] flex flex-col gap-1.5 rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2.5 hover:border-yellow/50 transition-colors no-underline group"
    >
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 rounded bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--fg-muted)]">
          <LinkIcon />
        </div>
        <span className="font-mono text-[9px] text-[var(--fg-muted)] uppercase tracking-widest">{domain}</span>
      </div>
      <p className="font-sans text-[13px] font-semibold text-[var(--fg)] leading-snug group-hover:text-yellow transition-colors">{title}</p>
      <p className="font-sans text-[11px] text-[var(--fg-muted)] leading-snug line-clamp-2">{desc}</p>
    </a>
  );
}

function MessageContent({ msg }: { msg: Message }) {
  const c = msg.content;
  if (c.kind === "text")      return <TextBubble text={c.text} own={msg.own} />;
  if (c.kind === "image")     return <ImageBubble src={c.src} caption={c.caption} />;
  if (c.kind === "gallery")   return <GalleryBubble images={c.images} caption={c.caption} />;
  if (c.kind === "portfolio") return <PortfolioBubble {...c} />;
  if (c.kind === "link")      return <LinkBubble {...c} />;
  return null;
}

/* ═══════════════════════════════════════════
   STATUS DOT
═══════════════════════════════════════════ */
const STATUS_COLOR: Record<Member["status"], string> = {
  online:  "#22c55e",
  away:    "#f59e0b",
  offline: "#6b7280",
};

function StatusDot({ status }: { status: Member["status"] }) {
  return (
    <span
      style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_COLOR[status], flexShrink: 0, display: "inline-block", boxShadow: status === "online" ? `0 0 0 2px var(--bg-card)` : "none" }}
    />
  );
}

/* ═══════════════════════════════════════════
   MEMBER LIST VIEW
═══════════════════════════════════════════ */
function MemberList() {
  const byStatus = (s: Member["status"]) => MEMBERS.filter((m) => m.status === s);
  const groups: { label: string; members: Member[] }[] = [
    { label: `Online — ${byStatus("online").length + byStatus("away").length}`, members: [...byStatus("online"), ...byStatus("away")] },
    { label: `Offline — ${byStatus("offline").length}`, members: byStatus("offline") },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-4">
      {groups.map((g) => (
        <div key={g.label}>
          <p className="font-mono text-[9px] text-[var(--fg-muted)] uppercase tracking-widest px-2 mb-2">{g.label}</p>
          <div className="flex flex-col gap-0.5">
            {g.members.map((m) => (
              <div key={m.name} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[var(--bg-subtle)] transition-colors cursor-default">
                <div className="relative shrink-0">
                  <Avatar initials={m.initials} color={m.color} size={30} />
                  <span className="absolute -bottom-0.5 -right-0.5 ring-2 ring-[var(--bg-card)] rounded-full">
                    <StatusDot status={m.status} />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-xs font-semibold text-[var(--fg)] truncate">{m.name}</p>
                  {m.role && <p className="font-mono text-[9px] text-[var(--fg-muted)]">{m.role}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PANEL
═══════════════════════════════════════════ */
export function ChatPanel({ onClose }: { onClose: () => void }) {
  const [view, setView]     = useState<"chat" | "members">("chat");
  const [draft, setDraft]   = useState("");
  const [msgs, setMsgs]     = useState<Message[]>(MESSAGES);
  const bottomRef           = useRef<HTMLDivElement>(null);
  const onlineCount         = MEMBERS.filter((m) => m.status === "online" || m.status === "away").length;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, view]);

  function send() {
    const text = draft.trim();
    if (!text) return;
    setMsgs((prev) => [
      ...prev,
      {
        id: prev.length + 100,
        sender: "Sofia Chen",
        initials: "S",
        color: "#fad502",
        time: "Now",
        own: true,
        content: { kind: "text", text },
      },
    ]);
    setDraft("");
  }

  const tabBtn = (v: "chat" | "members") => (
    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all ${
      view === v
        ? "bg-[var(--bg-card)] text-[var(--fg)] border border-[var(--border)] shadow-sm"
        : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
    }`
  );

  return (
    <div className="flex flex-col h-full bg-[var(--bg-card)] border-l border-[var(--border)]">

      {/* Header */}
      <div className="shrink-0 flex items-center gap-2 px-3 py-3 border-b border-[var(--border)]">
        <div className="flex-1 flex flex-col">
          <span className="font-sans text-sm font-semibold text-[var(--fg)]">Community</span>
          <span className="font-mono text-[10px] text-[var(--fg-muted)]">{onlineCount} online</span>
        </div>

        {/* View tabs */}
        <div className="flex gap-0.5 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg p-0.5">
          <button className={tabBtn("chat")} onClick={() => setView("chat")}>
            <ChatIcon2 /> Chat
          </button>
          <button className={tabBtn("members")} onClick={() => setView("members")}>
            <UsersIcon /> Members
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors"
          aria-label="Close chat"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Body */}
      {view === "members" ? (
        <MemberList />
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-3">
            {msgs.map((msg, i) => {
              const prev = msgs[i - 1];
              const showSender = !prev || prev.sender !== msg.sender;
              return (
                <div key={msg.id} className={`flex gap-2 ${msg.own ? "flex-row-reverse" : ""}`}>
                  {/* Avatar — show only on first consecutive msg */}
                  <div className="shrink-0 w-7">
                    {showSender && !msg.own && <Avatar initials={msg.initials} color={msg.color} size={28} />}
                  </div>

                  <div className={`flex flex-col gap-1 max-w-[calc(100%-44px)] ${msg.own ? "items-end" : "items-start"}`}>
                    {showSender && !msg.own && (
                      <span className="font-sans text-[11px] font-semibold text-[var(--fg-muted)] ml-1">{msg.sender} · {msg.time}</span>
                    )}
                    {showSender && msg.own && (
                      <span className="font-sans text-[11px] font-semibold text-[var(--fg-muted)] mr-1">{msg.time}</span>
                    )}
                    <MessageContent msg={msg} />
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="shrink-0 px-3 py-3 border-t border-[var(--border)]">
            <div className="flex items-center gap-2 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl px-3 py-2 focus-within:border-yellow/50 transition-colors">
              <button className="text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors shrink-0" aria-label="Attach image">
                <ImageIcon />
              </button>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Message the community…"
                className="flex-1 bg-transparent font-sans text-sm text-[var(--fg)] placeholder:text-[var(--fg-muted)] outline-none min-w-0"
              />
              <button
                onClick={send}
                disabled={!draft.trim()}
                className="shrink-0 w-7 h-7 rounded-lg bg-yellow text-[#111] flex items-center justify-center hover:bg-yellow-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Send"
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
