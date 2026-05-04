"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion } from "framer-motion";

/* ── Live preview thumbnail ─────────────────────────────────
   Renders the URL inside an iframe scaled down to fit the
   container. Lazy-mounts when scrolled into view. The iframe
   is non-interactive (pointer-events: none, scrolling: no).
   The container should set its own aspect-ratio + width. */

export function LivePreviewThumbnail({
  url,
  baseWidth = 1280,
  className,
  style,
  rootMargin = "200px",
}: {
  url: string;
  baseWidth?: number;
  className?: string;
  style?: CSSProperties;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded,  setLoaded]  = useState(false);
  const [scale,   setScale]   = useState(0.3);
  const [size,    setSize]    = useState({ w: 0, h: 0 });

  /* Lazy mount via IntersectionObserver — don't render iframes off-screen. */
  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [visible, rootMargin]);

  /* Compute scale + base height so the iframe fills the container exactly. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w > 0) {
        setScale(w / baseWidth);
        setSize({ w, h });
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [baseWidth]);

  const baseHeight = scale > 0 && size.w > 0 ? size.h / scale : baseWidth * 0.625;

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className ?? ""}`}
      style={style}
    >
      {visible && (
        <iframe
          src={url}
          className="absolute top-0 left-0 border-0 pointer-events-none"
          style={{
            width:           baseWidth,
            height:          baseHeight,
            transform:       `scale(${scale})`,
            transformOrigin: "top left",
            opacity:         loaded ? 1 : 0,
            transition:      "opacity 0.4s ease",
          }}
          loading="lazy"
          scrolling="no"
          tabIndex={-1}
          aria-hidden="true"
          title=""
          onLoad={() => setLoaded(true)}
        />
      )}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-subtle)]">
          <div className="w-4 h-4 rounded-full border-2 border-[var(--border)] border-t-yellow animate-spin" />
        </div>
      )}
    </div>
  );
}

/* ── Shared device preview modal ────────────────────────────
   Used across template cards, delivery cards, and collection
   page previews. Renders the URL inside a scaled device frame
   (mobile/tablet/desktop). On small screens, only mobile is
   selectable — tablet and desktop don't fit. */

export type Device = "mobile" | "tablet" | "desktop";

export const DEVICE_DIMS: Record<Device, { w: number; h: number; label: string }> = {
  mobile:  { w: 390,  h: 780,  label: "375px"  },
  tablet:  { w: 820,  h: 1100, label: "768px"  },
  desktop: { w: 1280, h: 800,  label: "1280px" },
};

export function DeviceIcon({ d }: { d: Device }) {
  if (d === "mobile") return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>;
  if (d === "tablet") return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>;
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>;
}

/* True when the user's screen can't realistically host a tablet/desktop frame. */
export function useIsSmallScreen(maxWidth = 880) {
  const [is, setIs] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${maxWidth - 1}px)`);
    setIs(mq.matches);
    const h = (e: MediaQueryListEvent) => setIs(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, [maxWidth]);
  return is;
}

/* Sub-component: the device picker row.
   Used in this modal AND in CollectionPreviewModal. */
export function DevicePicker({ device, onChange, isSmall }: {
  device: Device;
  onChange: (d: Device) => void;
  isSmall: boolean;
}) {
  return (
    <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
      {(["mobile", "tablet", "desktop"] as Device[]).map((d) => {
        const active = device === d;
        const disabled = isSmall && d !== "mobile";
        return (
          <button
            key={d}
            onClick={() => !disabled && onChange(d)}
            disabled={disabled}
            title={disabled ? "Switch to a larger screen to preview this size" : DEVICE_DIMS[d].label}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-sans text-xs font-medium transition-colors ${
              active ? "bg-white text-[#111]" :
              disabled ? "text-white/20 cursor-not-allowed" :
              "text-white/60 hover:text-white"
            }`}
          >
            <DeviceIcon d={d} />
            <span className="hidden sm:inline capitalize">{d}</span>
          </button>
        );
      })}
    </div>
  );
}

/* Single-page device preview modal — the default export. */
export function DevicePreviewModal({
  url, title, subtitle, accentChip, onClose,
}: {
  url: string;
  title: string;
  subtitle?: string;
  accentChip?: ReactNode;
  onClose: () => void;
}) {
  const isSmall = useIsSmallScreen();
  const [device, setDevice]   = useState<Device>(isSmall ? "mobile" : "desktop");
  const [loading, setLoading] = useState(true);

  /* If the screen shrinks below the threshold, force mobile. */
  useEffect(() => {
    if (isSmall && device !== "mobile") setDevice("mobile");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSmall]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  useEffect(() => { setLoading(true); }, [device, url]);

  const dims = DEVICE_DIMS[device];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex flex-col bg-[#0a0a0a]/95 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Toolbar */}
      <div onClick={(e) => e.stopPropagation()} className="shrink-0 flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <div className="min-w-0">
            <div className="font-sans font-black text-white text-sm truncate">{title}</div>
            {(subtitle || accentChip) && (
              <div className="font-mono text-[9px] uppercase tracking-widest text-white/40 truncate flex items-center gap-2 mt-0.5">
                {subtitle && <span className="truncate">{subtitle}</span>}
                {accentChip}
              </div>
            )}
          </div>
        </div>

        <DevicePicker device={device} onChange={setDevice} isSmall={isSmall} />
      </div>

      {/* Preview viewport */}
      <div onClick={(e) => e.stopPropagation()} className="flex-1 min-h-0 flex items-center justify-center p-6 overflow-auto">
        <motion.div
          key={`${device}-${url}`}
          initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="relative bg-white shadow-2xl"
          style={{
            width: dims.w, height: dims.h,
            borderRadius: device === "mobile" ? 28 : device === "tablet" ? 16 : 8,
            overflow: "hidden",
            maxWidth: "100%", maxHeight: "100%",
            transform: `scale(min(1, calc((100vw - 80px) / ${dims.w}), calc((100vh - 160px) / ${dims.h})))`,
            transformOrigin: "center center",
          }}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-subtle)] z-10">
              <div className="w-6 h-6 rounded-full border-2 border-[var(--border)] border-t-yellow animate-spin" />
            </div>
          )}
          <iframe
            src={url}
            className="w-full h-full border-0"
            onLoad={() => setLoading(false)}
            title={`${title} preview`}
          />
        </motion.div>
      </div>

      {/* Footer */}
      <div onClick={(e) => e.stopPropagation()} className="shrink-0 flex items-center justify-between px-4 py-2 border-t border-white/10">
        <span className="font-mono text-[10px] text-white/30 uppercase tracking-wider">{dims.label} · {device}</span>
        <a href={url} target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] text-white/40 hover:text-white transition-colors uppercase tracking-wider flex items-center gap-1.5">
          Open in new tab
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
      </div>
    </motion.div>
  );
}
