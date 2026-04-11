"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "~/components/providers/ThemeProvider";

/* ── Icons ─────────────────────────────────────────────── */
function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}
function ChevronDown() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

/* ── Page title map ─────────────────────────────────────── */
const PAGE_TITLES: Record<string, string> = {
  "/dashboard/gallery":   "Gallery",
  "/dashboard/portfolio": "Portfolio",
  "/dashboard/templates": "Templates",
  "/dashboard/sales":     "Sales",
  "/dashboard/clients":   "Clients",
  "/dashboard/analytics": "Analytics",
  "/dashboard/settings":  "Settings",
  "/dashboard/profile":   "Profile",
};

/* ── Notifications data ─────────────────────────────────── */
const NOTIFICATIONS = [
  { id: 1, icon: "💰", title: "New sale",            body: "Portrait session license — $120.00", time: "2m ago",  unread: true  },
  { id: 2, icon: "👁️", title: "Portfolio viewed",     body: "Someone from Berlin viewed your work", time: "1h ago",  unread: true  },
  { id: 3, icon: "📦", title: "Export ready",         body: "Wedding_final — 47 photos zipped",    time: "3h ago",  unread: false },
  { id: 4, icon: "⭐", title: "Review received",      body: "5 stars — \"Absolutely stunning!\"",  time: "1d ago",  unread: false },
  { id: 5, icon: "🔔", title: "Storage at 48%",       body: "2.4 TB of 5 TB used",                 time: "2d ago",  unread: false },
];

/* ── Notification panel ─────────────────────────────────── */
function NotificationPanel({ onClose }: { onClose: () => void }) {
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-[var(--shadow-lg)] overflow-hidden z-50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <span className="font-sans text-sm font-semibold text-[var(--fg)]">Notifications</span>
        {unread > 0 && (
          <span className="font-mono text-[10px] bg-yellow text-[#111] px-1.5 py-0.5 rounded-full font-bold">{unread} new</span>
        )}
      </div>
      <div className="max-h-72 overflow-y-auto divide-y divide-[var(--border-subtle)]">
        {NOTIFICATIONS.map((n) => (
          <button
            key={n.id}
            onClick={onClose}
            className="w-full flex gap-3 px-4 py-3 text-left hover:bg-[var(--bg-subtle)] transition-colors"
          >
            <span className="text-base leading-none mt-0.5 shrink-0">{n.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-sans text-xs font-semibold text-[var(--fg)]">{n.title}</span>
                {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-yellow shrink-0" />}
              </div>
              <p className="font-sans text-xs text-[var(--fg-muted)] truncate mt-0.5">{n.body}</p>
              <span className="font-mono text-[10px] text-[var(--fg-muted)]">{n.time}</span>
            </div>
          </button>
        ))}
      </div>
      <div className="px-4 py-2 border-t border-[var(--border)]">
        <button className="w-full font-sans text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] text-center transition-colors py-1">
          Mark all as read
        </button>
      </div>
    </div>
  );
}

/* ── Profile dropdown ───────────────────────────────────── */
function ProfileDropdown({ onClose }: { onClose: () => void }) {
  const { theme, toggle } = useTheme();
  return (
    <div className="absolute top-full right-0 mt-2 w-52 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-[var(--shadow-lg)] overflow-hidden z-50">
      {/* User info */}
      <div className="px-4 py-3 border-b border-[var(--border)]">
        <div className="font-sans text-sm font-semibold text-[var(--fg)]">Sofia Chen</div>
        <div className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5">sofia@example.com</div>
        <div className="mt-2 inline-flex items-center gap-1.5 bg-yellow/10 border border-yellow/30 rounded-full px-2 py-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow" />
          <span className="font-mono text-[10px] text-yellow font-semibold">Pro plan</span>
        </div>
      </div>

      {/* Links */}
      <div className="py-1">
        <Link
          href="/dashboard/profile"
          onClick={onClose}
          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors"
        >
          <UserIcon />
          <span className="font-sans">View profile</span>
        </Link>
        <Link
          href="/dashboard/settings"
          onClick={onClose}
          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors"
        >
          <SettingsIcon />
          <span className="font-sans">Settings</span>
        </Link>
        <button
          onClick={toggle}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors"
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          <span className="font-sans">{theme === "dark" ? "Light mode" : "Dark mode"}</span>
        </button>
      </div>

      <div className="border-t border-[var(--border)] py-1">
        <button
          onClick={onClose}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/5 transition-colors"
        >
          <LogoutIcon />
          <span className="font-sans">Sign out</span>
        </button>
      </div>
    </div>
  );
}

/* ── Main header ────────────────────────────────────────── */
export function DashboardHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const { theme } = useTheme();

  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen]         = useState(false);
  const [profileOpen, setProfileOpen]     = useState(false);

  const notifRef   = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const title   = PAGE_TITLES[pathname] ?? "Dashboard";
  const unread  = NOTIFICATIONS.filter((n) => n.unread).length;
  const balance = "$124.50";

  /* close dropdowns on outside click */
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node))   setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="h-14 shrink-0 flex items-center gap-3 px-4 border-b border-[var(--border)] bg-[var(--bg-card)]">

      {/* Mobile hamburger */}
      {onMenuClick && (
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 -ml-1 rounded-md text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors shrink-0"
          aria-label="Open menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      )}

      {/* Page title — desktop */}
      <h1 className="hidden lg:block font-sans font-semibold text-[var(--fg)] text-sm shrink-0">{title}</h1>

      {/* Search */}
      <div className={`relative flex-1 max-w-xs transition-all duration-200 ${searchFocused ? "max-w-sm" : ""}`}>
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--fg-muted)] pointer-events-none">
          <SearchIcon />
        </span>
        <input
          type="text"
          placeholder="Search photos, folders…"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="w-full pl-8 pr-3 py-1.5 text-xs font-sans bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg text-[var(--fg)] placeholder:text-[var(--fg-muted)] outline-none focus:border-yellow/60 focus:ring-1 focus:ring-yellow/20 transition-all"
        />
        <kbd className="hidden sm:block absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[9px] text-[var(--fg-muted)] bg-[var(--bg-card)] border border-[var(--border)] px-1 py-0.5 rounded pointer-events-none">
          ⌘K
        </kbd>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Balance chip */}
      <div className="hidden sm:flex items-center gap-1.5 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg px-3 py-1.5 cursor-default select-none">
        <span className="text-[11px] text-[var(--fg-muted)] font-sans">Balance</span>
        <span className="font-mono text-xs font-semibold text-[var(--fg)]">{balance}</span>
        <button className="ml-1 text-[10px] font-sans font-semibold text-yellow hover:text-yellow-dark transition-colors">
          Withdraw
        </button>
      </div>

      {/* Notifications */}
      <div ref={notifRef} className="relative">
        <button
          onClick={() => { setNotifOpen((p) => !p); setProfileOpen(false); }}
          className="relative p-2 rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors"
          aria-label="Notifications"
        >
          <BellIcon />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-yellow rounded-full ring-2 ring-[var(--bg-card)]" />
          )}
        </button>
        {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
      </div>

      {/* Profile avatar */}
      <div ref={profileRef} className="relative">
        <button
          onClick={() => { setProfileOpen((p) => !p); setNotifOpen(false); }}
          className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-[var(--bg-subtle)] transition-colors"
          aria-label="Profile menu"
        >
          <div className="w-7 h-7 rounded-full bg-yellow flex items-center justify-center shrink-0">
            <span className="font-sans font-black text-[#111] text-[10px]">S</span>
          </div>
          <span className="hidden md:block font-sans text-xs font-semibold text-[var(--fg)]">Sofia</span>
          <span className="hidden md:block text-[var(--fg-muted)]"><ChevronDown /></span>
        </button>
        {profileOpen && <ProfileDropdown onClose={() => setProfileOpen(false)} />}
      </div>

    </header>
  );
}
