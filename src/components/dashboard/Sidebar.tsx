"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "~/components/providers/ThemeProvider";
import { useT } from "~/components/providers/LangProvider";
import { Logo } from "~/components/ui/Logo";
import { createClient } from "~/lib/supabase/client";

/* ── Icons ── */
function GalleryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}
function PortfolioIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}
function SalesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  );
}
function ClientsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}
function TemplatesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="11" width="7" height="9" rx="1" />
      <rect x="3" y="13" width="7" height="8" rx="1" />
    </svg>
  );
}
function LinksIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4"  width="18" height="4" rx="2" />
      <rect x="3" y="10" width="18" height="4" rx="2" />
      <rect x="3" y="16" width="18" height="4" rx="2" />
    </svg>
  );
}
function DeliveryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" />
    </svg>
  );
}
function AnalyticsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
function DomainIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
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

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10" />
    </svg>
  );
}

// MVP scope: portfolio + gallery only. Templates, Links, Delivery, Domain and
// the "soon" items are built but hidden — see next.config.js redirects. To
// restore a feature, add its entry back here and remove its redirect.
const navMain = [
  { labelKey: "nav.dashboard", label: "Home",      href: "/dashboard",           icon: HomeIcon, exact: true },
  { labelKey: "nav.gallery",   label: "Gallery",   href: "/dashboard/gallery",   icon: GalleryIcon },
  { labelKey: "nav.portfolio", label: "Portfolio", href: "/dashboard/portfolio", icon: PortfolioIcon },
];

function ProfileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function NavItem({ labelKey, label, href, icon: Icon, soon, exact }: { labelKey?: string; label: string; href: string; icon: () => React.ReactNode; soon?: boolean; exact?: boolean }) {
  const pathname = usePathname();
  const { t } = useT();
  const active = exact ? pathname === href : pathname.startsWith(href);
  const displayLabel = labelKey ? t(labelKey) : label;

  if (soon) {
    return (
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg opacity-35 cursor-not-allowed select-none">
        <span className="text-[var(--fg-muted)]"><Icon /></span>
        <span className="font-sans text-sm text-[var(--fg-muted)] flex-1">{displayLabel}</span>
        <span className="font-mono text-[9px] bg-[var(--bg-subtle)] text-[var(--fg-muted)] px-1.5 py-0.5 rounded tracking-wider uppercase">Soon</span>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group
        ${active
          ? "bg-yellow/10 text-[var(--fg)]"
          : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)]"
        }`}
    >
      <span className={active ? "text-yellow" : "text-[var(--fg-muted)] group-hover:text-[var(--fg)]"}>
        <Icon />
      </span>
      <span className="font-sans text-sm font-medium">{displayLabel}</span>
    </Link>
  );
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { theme, toggle } = useTheme();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      if (!u) return;
      const meta = (u.user_metadata ?? {}) as { full_name?: string; name?: string };
      setUser({ name: meta.full_name ?? meta.name ?? (u.email?.split("@")[0] ?? "Account"), email: u.email ?? "" });
    });
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const initial = (user?.name ?? "?").charAt(0).toUpperCase();

  return (
    <div className="flex flex-col h-full bg-[var(--bg-card)] border-r border-[var(--border)]">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-[var(--border)]">
        <Link href="/" className="flex items-center" aria-label="Portapic home">
          <Logo height={28} darkHeight={38} priority />
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 text-[var(--fg-muted)] hover:text-[var(--fg)]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {navMain.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3 border-t border-[var(--border)] space-y-0.5">
        <NavItem labelKey="nav.profile"  label="Profile"  href="/dashboard/profile"  icon={ProfileIcon} />
        <NavItem labelKey="nav.settings" label="Settings" href="/dashboard/settings" icon={SettingsIcon} />

        {/* Theme toggle */}
        <div className="flex items-center gap-1 px-3 py-2">
          <span className="font-sans text-xs text-[var(--fg-muted)] flex-1">Theme</span>
          <button
            onClick={toggle}
            className="flex items-center gap-1 p-1.5 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>

        {/* User row */}
        <div className="flex items-center gap-2 px-3 py-2.5 mt-1 rounded-lg hover:bg-[var(--bg-subtle)] transition-colors group">
          <Link href="/dashboard/profile" className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-7 h-7 rounded-full bg-yellow flex items-center justify-center shrink-0">
              <span className="font-sans font-black text-[#111] text-[10px]">{initial}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-sans text-xs font-semibold text-[var(--fg)] truncate">{user?.name ?? "—"}</div>
              <div className="font-mono text-[10px] text-[var(--fg-muted)] truncate">{user?.email ?? ""}</div>
            </div>
          </Link>
          <button
            onClick={signOut}
            title="Sign out"
            aria-label="Sign out"
            className="p-1.5 rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-card)] transition-colors shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {/* Desktop: static sidebar */}
      <div className="hidden lg:block w-60 shrink-0 h-screen sticky top-0">
        <SidebarContent />
      </div>

      {/* Mobile: overlay drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-64"
            >
              <SidebarContent onClose={onClose} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
