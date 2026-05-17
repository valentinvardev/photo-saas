"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

/* ═══════════════════════════════════════════
   TYPES
═══════════════════════════════════════════ */
type TextMsg      = { kind: "text";      text: string };
type ImageMsg     = { kind: "image";     src: string; caption?: string };
type GalleryMsg   = { kind: "gallery";   images: string[]; caption?: string };
type PortfolioMsg = { kind: "portfolio"; name: string; tagline: string; previews: string[]; portfolioUrl: string };
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
  username: string;
  initials: string;
  color: string;
  status: "online" | "away" | "offline";
  role?: string;
  bio: string;
  location: string;
  specialty: string;
  portfolioUrl: string;
  stats: { photos: number; followers: number; following: number };
  previews: string[];
}

/* ═══════════════════════════════════════════
   DATA
═══════════════════════════════════════════ */
const MEMBERS: Member[] = [
  {
    name: "Sofia Chen", username: "sofia.chen", initials: "S", color: "#fad502", status: "online", role: "You",
    bio: "Documentary and portrait photographer based in New York. Available for editorial and commercial work.",
    location: "New York, NY", specialty: "Portrait · Documentary",
    portfolioUrl: "https://frame.app/sofia.chen",
    stats: { photos: 284, followers: 1420, following: 312 },
    previews: ["https://picsum.photos/seed/201/400/400?grayscale","https://picsum.photos/seed/202/400/400?grayscale","https://picsum.photos/seed/220/400/400?grayscale"],
  },
  {
    name: "James Hollis", username: "james.hollis", initials: "J", color: "#3b82f6", status: "online",
    bio: "Wedding & lifestyle photographer. 12 years shooting ceremonies across Europe and North America.",
    location: "London, UK", specialty: "Wedding · Lifestyle",
    portfolioUrl: "https://frame.app/james.hollis",
    stats: { photos: 512, followers: 3280, following: 180 },
    previews: ["https://picsum.photos/seed/11/400/400?grayscale","https://picsum.photos/seed/44/400/400?grayscale","https://picsum.photos/seed/99/400/400?grayscale"],
  },
  {
    name: "Maya Rodriguez", username: "maya.rodriguez", initials: "M", color: "#10b981", status: "online",
    bio: "Documentary & editorial photographer based in Barcelona. Long-form projects on migration and identity.",
    location: "Barcelona, Spain", specialty: "Documentary · Editorial",
    portfolioUrl: "https://frame.app/maya.rodriguez",
    stats: { photos: 198, followers: 2150, following: 440 },
    previews: ["https://picsum.photos/seed/63/400/400?grayscale","https://picsum.photos/seed/71/400/400?grayscale","https://picsum.photos/seed/82/400/400?grayscale"],
  },
  {
    name: "Luca Ferrante", username: "luca.ferrante", initials: "L", color: "#f97316", status: "online",
    bio: "Street and urban photographer. Based in Milan. Obsessed with light and geometry.",
    location: "Milan, Italy", specialty: "Street · Urban",
    portfolioUrl: "https://frame.app/luca.ferrante",
    stats: { photos: 367, followers: 1890, following: 520 },
    previews: ["https://picsum.photos/seed/108/400/400?grayscale","https://picsum.photos/seed/133/400/400?grayscale","https://picsum.photos/seed/156/400/400?grayscale"],
  },
  {
    name: "Aiko Tanaka", username: "aiko.tanaka", initials: "A", color: "#8b5cf6", status: "online",
    bio: "Portrait and fine-art photographer. Tokyo-based. Work exhibited at Foam Amsterdam.",
    location: "Tokyo, Japan", specialty: "Portrait · Fine Art",
    portfolioUrl: "https://frame.app/aiko.tanaka",
    stats: { photos: 143, followers: 4320, following: 97 },
    previews: ["https://picsum.photos/seed/201/400/400?grayscale","https://picsum.photos/seed/230/400/400?grayscale","https://picsum.photos/seed/240/400/400?grayscale"],
  },
  {
    name: "Felix Wagner", username: "felix.wagner", initials: "F", color: "#ec4899", status: "away",
    bio: "Commercial and product photographer. Berlin. Clients include Nike, Adidas, and Vogue DE.",
    location: "Berlin, Germany", specialty: "Commercial · Product",
    portfolioUrl: "https://frame.app/felix.wagner",
    stats: { photos: 421, followers: 2760, following: 215 },
    previews: ["https://picsum.photos/seed/55/400/400?grayscale","https://picsum.photos/seed/88/400/400?grayscale","https://picsum.photos/seed/165/400/400?grayscale"],
  },
  {
    name: "Priya Sharma", username: "priya.sharma", initials: "P", color: "#14b8a6", status: "offline",
    bio: "Fashion and beauty photographer. Mumbai. Working with Indian Vogue and Harper's Bazaar.",
    location: "Mumbai, India", specialty: "Fashion · Beauty",
    portfolioUrl: "https://frame.app/priya.sharma",
    stats: { photos: 289, followers: 5140, following: 330 },
    previews: ["https://picsum.photos/seed/22/400/400?grayscale","https://picsum.photos/seed/66/400/400?grayscale","https://picsum.photos/seed/110/400/400?grayscale"],
  },
  {
    name: "Tom Bradley", username: "tom.bradley", initials: "T", color: "#6366f1", status: "offline",
    bio: "Landscape and nature photographer. Based in Colorado. Prints available in my shop.",
    location: "Denver, CO", specialty: "Landscape · Nature",
    portfolioUrl: "https://frame.app/tom.bradley",
    stats: { photos: 631, followers: 3890, following: 410 },
    previews: ["https://picsum.photos/seed/33/400/400?grayscale","https://picsum.photos/seed/77/400/400?grayscale","https://picsum.photos/seed/154/400/400?grayscale"],
  },
];

const MEMBER_BY_NAME = Object.fromEntries(MEMBERS.map((m) => [m.name, m]));

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
    content: { kind: "image", src: "https://picsum.photos/seed/11/800/530?grayscale", caption: "One highlight from yesterday — ceremony light was incredible." },
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
      images: ["https://picsum.photos/seed/201/400/500?grayscale","https://picsum.photos/seed/202/400/500?grayscale","https://picsum.photos/seed/220/400/500?grayscale","https://picsum.photos/seed/230/400/500?grayscale"],
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
      previews: ["https://picsum.photos/seed/63/400/300?grayscale","https://picsum.photos/seed/71/400/300?grayscale","https://picsum.photos/seed/82/400/300?grayscale"],
      portfolioUrl: "https://frame.app/maya.rodriguez",
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
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
}
function ImageIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
}
function LinkIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>;
}
function ExternalIcon({ size = 11 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
}
function EyeIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}
function CloseIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>;
}
function UsersIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>;
}
function ChatIcon2() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
}
function GlobeIcon() {
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>;
}
function BackIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
}
function MapPinIcon() {
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;
}
function CameraIcon() {
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>;
}
function AlertIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
}

/* ═══════════════════════════════════════════
   AVATAR
═══════════════════════════════════════════ */
function Avatar({ initials, color, size = 28 }: { initials: string; color: string; size?: number }) {
  return (
    <div style={{ width: size, height: size, background: color, flexShrink: 0, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontFamily: "var(--font-sans,sans-serif)", fontWeight: 800, fontSize: size * 0.36, color: color === "#fad502" ? "#111" : "#fff", lineHeight: 1 }}>
        {initials}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   STATUS DOT
═══════════════════════════════════════════ */
const STATUS_COLOR: Record<Member["status"], string> = { online: "#22c55e", away: "#f59e0b", offline: "#6b7280" };
const STATUS_LABEL: Record<Member["status"], string> = { online: "Online", away: "Away", offline: "Offline" };

/* Border gives the "cutout" effect — no box-shadow so there's no double ring */
function StatusDot({ status }: { status: Member["status"] }) {
  return (
    <span style={{
      width: 10, height: 10, borderRadius: "50%",
      background: STATUS_COLOR[status],
      display: "block",
      border: "2px solid var(--bg-card)",
    }} />
  );
}

/* ═══════════════════════════════════════════
   EXTERNAL LINK MODAL
═══════════════════════════════════════════ */
function ExternalLinkModal({ url, onCancel, onContinue }: { url: string; onCancel: () => void; onContinue: () => void }) {
  const domain = (() => { try { return new URL(url).hostname; } catch { return url; } })();
  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-lg)] w-80 mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top */}
        <div className="px-5 pt-5 pb-4 flex flex-col items-center text-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow/10 border border-yellow/30 flex items-center justify-center text-yellow">
            <AlertIcon />
          </div>
          <div>
            <p className="font-sans text-sm font-semibold text-[var(--fg)]">Opening an external website</p>
            <p className="font-sans text-xs text-[var(--fg-muted)] mt-1 leading-relaxed">
              You're about to leave Portapic and visit&nbsp;
              <span className="font-mono text-[var(--fg)]">{domain}</span>.
              Continue at your own discretion.
            </p>
          </div>
          {/* URL chip */}
          <div className="w-full bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg px-3 py-1.5 flex items-center gap-2 min-w-0">
            <span className="text-[var(--fg-muted)] shrink-0"><ExternalIcon size={12} /></span>
            <span className="font-mono text-[10px] text-[var(--fg-muted)] truncate">{url}</span>
          </div>
        </div>
        {/* Actions */}
        <div className="flex border-t border-[var(--border)]">
          <button
            onClick={onCancel}
            className="flex-1 font-sans text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] py-3 transition-colors border-r border-[var(--border)]"
          >
            Cancel
          </button>
          <button
            onClick={onContinue}
            className="flex-1 font-sans text-sm font-semibold text-yellow hover:bg-yellow/10 py-3 transition-colors flex items-center justify-center gap-1.5"
          >
            Continue <ExternalIcon size={11} />
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* ═══════════════════════════════════════════
   MESSAGE RENDERERS
═══════════════════════════════════════════ */
function TextBubble({ text, own }: { text: string; own?: boolean }) {
  return (
    <p className={`font-sans text-[13px] leading-relaxed px-3 py-2 rounded-2xl max-w-[260px] ${own ? "bg-yellow text-[#111] rounded-tr-sm" : "bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--fg)] rounded-tl-sm"}`}>
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

function PortfolioBubble({ name, tagline, previews, portfolioUrl, onExternalLink }: PortfolioMsg & { onExternalLink: (url: string) => void }) {
  return (
    <div className="max-w-[260px] rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg-card)]">
      <div className="grid grid-cols-3 h-20">
        {previews.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={src} alt="" className="w-full h-full object-cover" />
        ))}
      </div>
      <div className="px-3 py-2.5">
        <div className="flex items-center gap-1.5 mb-0.5">
          <GlobeIcon />
          <span className="font-mono text-[9px] text-[var(--fg-muted)] uppercase tracking-widest">Portfolio</span>
        </div>
        <p className="font-sans text-sm font-semibold text-[var(--fg)]">{name}</p>
        <p className="font-sans text-[11px] text-[var(--fg-muted)] mt-0.5">{tagline}</p>
        <button
          onClick={() => onExternalLink(portfolioUrl)}
          className="mt-2.5 w-full font-sans text-xs font-semibold bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--fg)] px-3 py-1.5 rounded-lg hover:bg-yellow hover:text-[#111] hover:border-yellow transition-colors flex items-center justify-center gap-1.5"
        >
          <EyeIcon /> View portfolio
        </button>
      </div>
    </div>
  );
}

function LinkBubble({ title, desc, url, domain, onExternalLink }: LinkMsg & { onExternalLink: (url: string) => void }) {
  return (
    <button
      onClick={() => onExternalLink(url)}
      className="max-w-[260px] flex flex-col gap-1.5 rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2.5 hover:border-yellow/50 transition-colors text-left group w-full"
    >
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 rounded bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--fg-muted)]">
          <LinkIcon />
        </div>
        <span className="font-mono text-[9px] text-[var(--fg-muted)] uppercase tracking-widest">{domain}</span>
        <span className="ml-auto text-[var(--fg-muted)] opacity-50 group-hover:opacity-100 transition-opacity"><ExternalIcon /></span>
      </div>
      <p className="font-sans text-[13px] font-semibold text-[var(--fg)] leading-snug group-hover:text-yellow transition-colors">{title}</p>
      <p className="font-sans text-[11px] text-[var(--fg-muted)] leading-snug line-clamp-2">{desc}</p>
    </button>
  );
}

function MessageContent({ msg, onExternalLink }: { msg: Message; onExternalLink: (url: string) => void }) {
  const c = msg.content;
  if (c.kind === "text")      return <TextBubble text={c.text} own={msg.own} />;
  if (c.kind === "image")     return <ImageBubble src={c.src} caption={c.caption} />;
  if (c.kind === "gallery")   return <GalleryBubble images={c.images} caption={c.caption} />;
  if (c.kind === "portfolio") return <PortfolioBubble {...c} onExternalLink={onExternalLink} />;
  if (c.kind === "link")      return <LinkBubble {...c} onExternalLink={onExternalLink} />;
  return null;
}

/* ═══════════════════════════════════════════
   FOLLOW BUTTON + MESSAGE ICON
═══════════════════════════════════════════ */
function MessageBtnIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
}

function FollowButton() {
  const [following, setFollowing] = useState(false);
  return (
    <button
      onClick={() => setFollowing((p) => !p)}
      className={`flex items-center justify-center gap-1.5 flex-1 font-sans text-xs font-semibold py-2 rounded-xl transition-all ${
        following
          ? "bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--fg-muted)] hover:text-red-500 hover:border-red-500/30"
          : "bg-yellow text-[#111] hover:bg-yellow-dark"
      }`}
    >
      {following ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Following
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Follow
        </>
      )}
    </button>
  );
}

/* ═══════════════════════════════════════════
   PROFILE VIEW
═══════════════════════════════════════════ */
function ProfileView({ member, onBack, onExternalLink }: { member: Member; onBack: () => void; onExternalLink: (url: string) => void }) {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Back bar */}
      <div className="sticky top-0 z-10 flex items-center gap-2 px-3 py-2.5 border-b border-[var(--border)] bg-[var(--bg-card)]">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors"
          aria-label="Back to chat"
        >
          <BackIcon />
        </button>
        <span className="font-sans text-xs font-semibold text-[var(--fg)]">Profile</span>
      </div>

      <div className="px-4 py-5 flex flex-col gap-5">
        {/* Avatar + identity */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="relative inline-flex">
            <Avatar initials={member.initials} color={member.color} size={64} />
            {/* Dot sits at the bottom-right of the circle, no double ring */}
            <span className="absolute bottom-0 right-0 rounded-full">
              <StatusDot status={member.status} />
            </span>
          </div>
          <div>
            <p className="font-sans text-base font-semibold text-[var(--fg)]">{member.name}</p>
            <p className="font-mono text-[11px] text-[var(--fg-muted)]">@{member.username}</p>
            <div className="mt-1.5 inline-flex items-center gap-1.5">
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: STATUS_COLOR[member.status], display: "inline-block" }} />
              <span className="font-sans text-[11px]" style={{ color: STATUS_COLOR[member.status] }}>{STATUS_LABEL[member.status]}</span>
            </div>
          </div>
        </div>

        {/* Action buttons — only for other members */}
        {member.role !== "You" && (
          <div className="flex gap-2">
            <FollowButton />
            <button className="flex items-center justify-center gap-1.5 flex-1 font-sans text-xs font-semibold border border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] py-2 rounded-xl transition-colors">
              <MessageBtnIcon /> Message
            </button>
          </div>
        )}

        {/* Meta */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-[var(--fg-muted)]">
            <MapPinIcon />
            <span className="font-sans text-xs">{member.location}</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--fg-muted)]">
            <CameraIcon />
            <span className="font-sans text-xs">{member.specialty}</span>
          </div>
        </div>

        {/* Bio */}
        <p className="font-sans text-[13px] text-[var(--fg-muted)] leading-relaxed">{member.bio}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-1 text-center">
          {[
            { value: member.stats.photos.toLocaleString(),    label: "Photos"    },
            { value: member.stats.followers.toLocaleString(), label: "Followers" },
            { value: member.stats.following.toLocaleString(), label: "Following" },
          ].map((s) => (
            <div key={s.label} className="bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg py-2">
              <p className="font-mono text-sm font-semibold text-[var(--fg)]">{s.value}</p>
              <p className="font-sans text-[10px] text-[var(--fg-muted)] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Photo previews */}
        <div className="grid grid-cols-3 gap-0.5 rounded-xl overflow-hidden border border-[var(--border)]">
          {member.previews.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" className="w-full aspect-square object-cover block" />
          ))}
        </div>

        {/* View portfolio */}
        {member.role !== "You" && (
          <button
            onClick={() => onExternalLink(member.portfolioUrl)}
            className="w-full font-sans text-sm font-semibold bg-yellow text-[#111] py-2.5 rounded-xl hover:bg-yellow-dark transition-colors flex items-center justify-center gap-2"
          >
            <EyeIcon /> View portfolio
          </button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MEMBER LIST VIEW
═══════════════════════════════════════════ */
function MemberList({ onViewProfile }: { onViewProfile: (m: Member) => void }) {
  const byStatus = (s: Member["status"]) => MEMBERS.filter((m) => m.status === s);
  const groups = [
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
              <button
                key={m.name}
                onClick={() => onViewProfile(m)}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[var(--bg-subtle)] transition-colors w-full text-left"
              >
                <div className="relative shrink-0 inline-flex">
                  <Avatar initials={m.initials} color={m.color} size={30} />
                  <span className="absolute bottom-0 right-0 rounded-full">
                    <StatusDot status={m.status} />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-xs font-semibold text-[var(--fg)] truncate">{m.name}</p>
                  <p className="font-sans text-[10px] text-[var(--fg-muted)] truncate">{m.role ?? m.specialty}</p>
                </div>
              </button>
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
  const [view, setView]             = useState<"chat" | "members">("chat");
  const [viewingProfile, setViewing] = useState<Member | null>(null);
  const [externalUrl, setExternal]  = useState<string | null>(null);
  const [draft, setDraft]           = useState("");
  const [msgs, setMsgs]             = useState<Message[]>(MESSAGES);
  const bottomRef                   = useRef<HTMLDivElement>(null);
  const onlineCount                 = MEMBERS.filter((m) => m.status === "online" || m.status === "away").length;

  useEffect(() => {
    if (!viewingProfile) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, view, viewingProfile]);

  function send() {
    const text = draft.trim();
    if (!text) return;
    setMsgs((prev) => [...prev, {
      id: prev.length + 100, sender: "Sofia Chen", initials: "S", color: "#fad502",
      time: "Now", own: true, content: { kind: "text", text },
    }]);
    setDraft("");
  }

  function openExternalLink(url: string) { setExternal(url); }
  function confirmExternal() {
    if (externalUrl) window.open(externalUrl, "_blank", "noopener,noreferrer");
    setExternal(null);
  }

  function viewProfile(name: string) {
    const m = MEMBER_BY_NAME[name];
    if (m) setViewing(m);
  }

  const tabBtn = (v: "chat" | "members") =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all ${
      view === v ? "bg-[var(--bg-card)] text-[var(--fg)] border border-[var(--border)] shadow-sm" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
    }`;

  return (
    <div className="flex flex-col h-full bg-[var(--bg-card)] border-l border-[var(--border)]">

      {/* External link modal */}
      {externalUrl && (
        <ExternalLinkModal
          url={externalUrl}
          onCancel={() => setExternal(null)}
          onContinue={confirmExternal}
        />
      )}

      {/* Header — hidden when viewing a profile (profile has its own back bar) */}
      {!viewingProfile && (
        <div className="shrink-0 flex items-center gap-2 px-3 py-3 border-b border-[var(--border)]">
          <div className="flex-1 flex flex-col">
            <span className="font-sans text-sm font-semibold text-[var(--fg)]">Community</span>
            <span className="font-mono text-[10px] text-[var(--fg-muted)]">{onlineCount} online</span>
          </div>
          <div className="flex gap-0.5 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg p-0.5">
            <button className={tabBtn("chat")} onClick={() => setView("chat")}><ChatIcon2 /> Chat</button>
            <button className={tabBtn("members")} onClick={() => setView("members")}><UsersIcon /> Members</button>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors" aria-label="Close chat">
            <CloseIcon />
          </button>
        </div>
      )}

      {/* Profile view */}
      {viewingProfile ? (
        <ProfileView
          member={viewingProfile}
          onBack={() => setViewing(null)}
          onExternalLink={openExternalLink}
        />
      ) : view === "members" ? (
        <MemberList onViewProfile={setViewing} />
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-3">
            {msgs.map((msg, i) => {
              const prev = msgs[i - 1];
              const showSender = !prev || prev.sender !== msg.sender;
              return (
                <div key={msg.id} className={`flex gap-2 ${msg.own ? "flex-row-reverse" : ""}`}>
                  {/* Avatar */}
                  <div className="shrink-0 w-7">
                    {showSender && !msg.own && (
                      <button onClick={() => viewProfile(msg.sender)} className="rounded-full hover:ring-2 hover:ring-yellow/60 transition-all" aria-label={`View ${msg.sender}'s profile`}>
                        <Avatar initials={msg.initials} color={msg.color} size={28} />
                      </button>
                    )}
                  </div>

                  <div className={`flex flex-col gap-1 max-w-[calc(100%-44px)] ${msg.own ? "items-end" : "items-start"}`}>
                    {showSender && !msg.own && (
                      <button onClick={() => viewProfile(msg.sender)} className="font-sans text-[11px] font-semibold text-[var(--fg-muted)] ml-1 hover:text-yellow transition-colors">
                        {msg.sender} · {msg.time}
                      </button>
                    )}
                    {showSender && msg.own && (
                      <span className="font-sans text-[11px] font-semibold text-[var(--fg-muted)] mr-1">{msg.time}</span>
                    )}
                    <MessageContent msg={msg} onExternalLink={openExternalLink} />
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
