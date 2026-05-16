"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";

/* ── Types ── */
type Folder = { id: string; name: string; count: number; seed: number };
type GFile  = typeof MOCK_FILES[0];

/* ── Mock data ── */
const INITIAL_FOLDERS: Folder[] = [
  { id: "f-weddings",   name: "Weddings",   count: 47, seed: 11 },
  { id: "f-portraits",  name: "Portraits",  count: 23, seed: 66 },
  { id: "f-landscapes", name: "Landscapes", count: 15, seed: 33 },
  { id: "f-commercial", name: "Commercial", count: 9,  seed: 55 },
  { id: "f-events",     name: "Events",     count: 12, seed: 88 },
];

const MOCK_FILES = [
  { id: "1",  name: "DSC_0847.jpg",        size: "8.4 MB",  type: "jpg",  folder: "Weddings",   seed: 11,  date: "2h ago",  w: 5472, h: 3648 },
  { id: "2",  name: "Portrait_01.jpg",      size: "6.1 MB",  type: "jpg",  folder: "Portraits",  seed: 22,  date: "3h ago",  w: 4000, h: 5000 },
  { id: "3",  name: "Golden_Hour.jpg",      size: "9.7 MB",  type: "jpg",  folder: "Landscapes", seed: 33,  date: "5h ago",  w: 6000, h: 4000 },
  { id: "4",  name: "Wedding_final.RAW",    size: "24.3 MB", type: "raw",  folder: "Weddings",   seed: 44,  date: "1d ago",  w: 5472, h: 3648 },
  { id: "5",  name: "Commercial_02.jpg",    size: "7.2 MB",  type: "jpg",  folder: "Commercial", seed: 55,  date: "1d ago",  w: 4500, h: 3000 },
  { id: "6",  name: "Portrait_Studio.jpg",  size: "5.8 MB",  type: "jpg",  folder: "Portraits",  seed: 66,  date: "2d ago",  w: 3840, h: 5760 },
  { id: "7",  name: "Landscape_06.tiff",    size: "31.2 MB", type: "tiff", folder: "Landscapes", seed: 77,  date: "2d ago",  w: 7360, h: 4912 },
  { id: "8",  name: "Event_Party.jpg",      size: "4.9 MB",  type: "jpg",  folder: "Events",     seed: 88,  date: "3d ago",  w: 4000, h: 3000 },
  { id: "9",  name: "DSC_1204.RAW",         size: "26.1 MB", type: "raw",  folder: "Weddings",   seed: 99,  date: "3d ago",  w: 5472, h: 3648 },
  { id: "10", name: "Outdoor_Portrait.jpg", size: "7.8 MB",  type: "jpg",  folder: "Portraits",  seed: 110, date: "4d ago",  w: 5000, h: 6250 },
  { id: "11", name: "Aerial_City.jpg",      size: "11.2 MB", type: "jpg",  folder: "Commercial", seed: 121, date: "5d ago",  w: 6000, h: 4000 },
  { id: "12", name: "Candid_Shot.jpg",      size: "3.9 MB",  type: "jpg",  folder: "Events",     seed: 132, date: "1w ago", w: 3500, h: 2333 },
  { id: "13", name: "Bridal_Portrait.jpg",  size: "8.1 MB",  type: "jpg",  folder: "Weddings",   seed: 143, date: "1w ago", w: 4500, h: 6000 },
  { id: "14", name: "Mountain_Mist.jpg",    size: "12.4 MB", type: "jpg",  folder: "Landscapes", seed: 154, date: "1w ago", w: 7000, h: 4667 },
  { id: "15", name: "Product_Shoot.jpg",    size: "5.3 MB",  type: "jpg",  folder: "Commercial", seed: 165, date: "2w ago", w: 4000, h: 4000 },
  { id: "16", name: "DSC_2041.jpg",         size: "7.6 MB",  type: "jpg",  folder: "Weddings",   seed: 176, date: "2w ago", w: 5472, h: 3648 },
  { id: "17", name: "Coastal_Light.jpg",    size: "10.1 MB", type: "jpg",  folder: "Landscapes", seed: 187, date: "3w ago", w: 6000, h: 4000 },
  { id: "18", name: "Street_01.jpg",        size: "4.4 MB",  type: "jpg",  folder: "Events",     seed: 198, date: "3w ago", w: 3500, h: 3500 },
];

const STORAGE      = { used: 2.4, total: 5, unit: "TB" };
const STORAGE_TYPES = [
  { label: "RAW",  gb: 0.9, color: "#fad502" },
  { label: "TIFF", gb: 0.6, color: "#808080" },
  { label: "JPEG", gb: 0.9, color: "#4a9eff" },
];

function typeColor(type: string) {
  if (type === "raw")  return { bg: "rgba(250,213,2,0.12)",   text: "#fad502" };
  if (type === "tiff") return { bg: "rgba(128,128,128,0.12)", text: "#808080" };
  return                      { bg: "rgba(74,158,255,0.12)",  text: "#4a9eff" };
}

/* ── Icons ── */
const I = {
  Upload:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Folder:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,
  Grid:     () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  List:     () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Search:   () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Trash:    () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>,
  Download: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Share:    () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  Move:     () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>,
  Back:     () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>,
  Pencil:   () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Close:    () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>,
};

/* ── Inline rename input ── */
function RenameInput({ value, onDone, onClick }: { value: string; onDone: (v: string) => void; onClick?: (e: React.MouseEvent) => void }) {
  const [val, setVal] = useState(value);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { ref.current?.select(); }, []);
  const commit = () => onDone(val.trim() || value);
  return (
    <input
      ref={ref}
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") onDone(value); }}
      onClick={(e) => { e.stopPropagation(); onClick?.(e); }}
      className="bg-black/60 text-white font-sans text-xs font-bold px-1 border border-yellow outline-none max-w-[120px] rounded"
      style={{ width: `${Math.max(val.length, 6)}ch` }}
    />
  );
}

/* ── Drag overlay: wind-blown mini thumbnails ── */
const MINI_SIZE = 52;

// Each slot has its own spring physics (stiffness/damping) and static cursor offset
const SLOT_CFGS = [
  { stiffness: 520, damping: 32, dx:   0, dy:   0 },
  { stiffness: 190, damping: 20, dx: -24, dy:  18 },
  { stiffness: 300, damping: 38, dx:  22, dy: -16 },
  { stiffness: 140, damping: 17, dx:  -6, dy:  28 },
] as const;

function DragOverlay({
  seeds,
  count,
  flyTarget,
  cursorXMV,
  cursorYMV,
}: {
  seeds: number[];
  count: number;
  flyTarget: { x: number; y: number } | null;
  cursorXMV: MotionValue<number>;
  cursorYMV: MotionValue<number>;
}) {
  // All springs at top level — no hooks in loops
  const sx0 = useSpring(cursorXMV, { stiffness: SLOT_CFGS[0].stiffness, damping: SLOT_CFGS[0].damping });
  const sy0 = useSpring(cursorYMV, { stiffness: SLOT_CFGS[0].stiffness, damping: SLOT_CFGS[0].damping });
  const sx1 = useSpring(cursorXMV, { stiffness: SLOT_CFGS[1].stiffness, damping: SLOT_CFGS[1].damping });
  const sy1 = useSpring(cursorYMV, { stiffness: SLOT_CFGS[1].stiffness, damping: SLOT_CFGS[1].damping });
  const sx2 = useSpring(cursorXMV, { stiffness: SLOT_CFGS[2].stiffness, damping: SLOT_CFGS[2].damping });
  const sy2 = useSpring(cursorYMV, { stiffness: SLOT_CFGS[2].stiffness, damping: SLOT_CFGS[2].damping });
  const sx3 = useSpring(cursorXMV, { stiffness: SLOT_CFGS[3].stiffness, damping: SLOT_CFGS[3].damping });
  const sy3 = useSpring(cursorYMV, { stiffness: SLOT_CFGS[3].stiffness, damping: SLOT_CFGS[3].damping });

  // Derived x/y positions with per-slot offset (center image on cursor + wind offset)
  const half = MINI_SIZE / 2;
  const x0 = useTransform(sx0, v => v + SLOT_CFGS[0].dx - half);
  const y0 = useTransform(sy0, v => v + SLOT_CFGS[0].dy - half);
  const x1 = useTransform(sx1, v => v + SLOT_CFGS[1].dx - half);
  const y1 = useTransform(sy1, v => v + SLOT_CFGS[1].dy - half);
  const x2 = useTransform(sx2, v => v + SLOT_CFGS[2].dx - half);
  const y2 = useTransform(sy2, v => v + SLOT_CFGS[2].dy - half);
  const x3 = useTransform(sx3, v => v + SLOT_CFGS[3].dx - half);
  const y3 = useTransform(sy3, v => v + SLOT_CFGS[3].dy - half);

  // When fly target is set, redirect the cursor motion values so springs chase the folder center
  useEffect(() => {
    if (!flyTarget) return;
    cursorXMV.set(flyTarget.x);
    cursorYMV.set(flyTarget.y);
  }, [flyTarget, cursorXMV, cursorYMV]);

  const slots = [
    { x: x0, y: y0, seed: seeds[0] },
    { x: x1, y: y1, seed: seeds[1] },
    { x: x2, y: y2, seed: seeds[2] },
    { x: x3, y: y3, seed: seeds[3] },
  ];

  const isFly = !!flyTarget;

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }}>
      {slots.map((slot, i) => {
        if (!slot.seed) return null;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={isFly ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
            transition={isFly
              ? { duration: 0.45, delay: i * 0.04, ease: "easeIn" }
              : { duration: 0.2, delay: i * 0.05, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              x: slot.x,
              y: slot.y,
              width: MINI_SIZE,
              height: MINI_SIZE,
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: "0 8px 28px rgba(0,0,0,0.55)",
              border: "1.5px solid rgba(255,255,255,0.18)",
              // Stagger z-index so first image is on top
              zIndex: 4 - i,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://picsum.photos/seed/${slot.seed}/100/100?grayscale`}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </motion.div>
        );
      })}

      {/* Count badge on the lead image */}
      {count > 1 && seeds[0] && !isFly && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.15, delay: 0.1 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            x: useTransform(sx0, v => v + SLOT_CFGS[0].dx - half + MINI_SIZE - 10),
            y: useTransform(sy0, v => v + SLOT_CFGS[0].dy - half - 8),
            background: "#fad502",
            color: "#111",
            borderRadius: "50%",
            width: 18,
            height: 18,
            fontSize: 9,
            fontFamily: "monospace",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          {count}
        </motion.div>
      )}
    </div>
  );
}

/* ── Full-screen lightbox ── */
function ImageModal({ files, index, onIndex, onClose }: { files: GFile[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const file = files[index]!;
  const [zoom, setZoom]       = useState(1);
  const [offset, setOffset]   = useState({ x: 0, y: 0 });
  const [isDragging, setDrag] = useState(false);
  const dragRef               = useRef({ sx: 0, sy: 0, ox: 0, oy: 0 });
  const containerRef          = useRef<HTMLDivElement>(null);
  const touchStartX           = useRef(0);

  const resetView = useCallback(() => { setZoom(1); setOffset({ x: 0, y: 0 }); }, []);
  const prev = useCallback(() => { if (index > 0)              { onIndex(index - 1); resetView(); } }, [index, onIndex, resetView]);
  const next = useCallback(() => { if (index < files.length-1) { onIndex(index + 1); resetView(); } }, [index, files.length, onIndex, resetView]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft")  prev();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose, prev, next]);

  // Touch swipe — only when not zoomed
  const onTouchStart = (e: React.TouchEvent) => { if (zoom <= 1 && e.touches[0]) touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (zoom > 1) return;
    const t = e.changedTouches[0]; if (!t) return;
    const dx = touchStartX.current - t.clientX;
    if (Math.abs(dx) > 40) { if (dx > 0) next(); else prev(); }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((prev) => {
        const next = Math.min(Math.max(prev * (e.deltaY < 0 ? 1.12 : 0.9), 1), 8);
        if (next === 1) setOffset({ x: 0, y: 0 });
        return next;
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onMD = (e: React.MouseEvent) => { if (zoom <= 1) return; e.preventDefault(); setDrag(true); dragRef.current = { sx: e.clientX, sy: e.clientY, ox: offset.x, oy: offset.y }; };
  const onMM = (e: React.MouseEvent) => { if (!isDragging) return; setOffset({ x: dragRef.current.ox + (e.clientX - dragRef.current.sx), y: dragRef.current.oy + (e.clientY - dragRef.current.sy) }); };
  const onMU = () => setDrag(false);
  const isRaw = file.type === "raw" || file.type === "tiff";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
      className="fixed inset-0 z-50 flex flex-col bg-black select-none">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <button className="pointer-events-auto text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10" onClick={onClose}><I.Back /></button>
        <span className="font-mono text-[11px] text-white/40 truncate max-w-xs">{file.name} · {index + 1} / {files.length}</span>
        <div className="flex items-center gap-1 pointer-events-auto">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"><I.Share /></button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-red-400 hover:bg-white/10 transition-colors"><I.Trash /></button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-sans font-medium transition-colors ml-1"><I.Download /> Download</button>
        </div>
      </div>

      {/* Image — padded so it doesn't fill edge to edge */}
      <div ref={containerRef} className="flex-1 flex items-center justify-center overflow-hidden px-16 py-20"
        style={{ cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default" }}
        onMouseDown={onMD} onMouseMove={onMM} onMouseUp={onMU} onMouseLeave={onMU}>
        {isRaw ? (
          <div className="flex flex-col items-center gap-3 text-white/30">
            <span className="font-mono font-black text-5xl" style={{ color: typeColor(file.type).text }}>.{file.type.toUpperCase()}</span>
            <span className="font-sans text-sm">Preview unavailable</span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`https://picsum.photos/seed/${file.seed}/1400/900?grayscale`} alt={file.name} draggable={false}
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", pointerEvents: "none",
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
              transformOrigin: "center center",
              transition: isDragging ? "none" : "transform 0.15s ease" }} />
        )}
      </div>

      {/* Prev / Next arrows */}
      {index > 0 && (
        <button onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-white/10 transition-colors"
          aria-label="Previous"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
      )}
      {index < files.length - 1 && (
        <button onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-white/10 transition-colors"
          aria-label="Next"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      )}

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-5 py-3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
        <span className="font-mono text-[10px] text-white/35">{file.size} · {file.w}×{file.h}px · {file.date}</span>
        {zoom > 1 && (
          <button className="pointer-events-auto font-mono text-[10px] text-white/40 hover:text-white/60 transition-colors rounded-lg px-2 py-1 hover:bg-white/10"
            onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }}>
            Reset · {Math.round(zoom * 100)}%
          </button>
        )}
      </div>
    </motion.div>
  );
}

/* ── Main page ── */
export default function GalleryPage() {
  const [folders, setFolders]           = useState<Folder[]>(INITIAL_FOLDERS);
  const [activeFolder, setActiveFolder] = useState("All");
  const [viewMode, setViewMode]         = useState<"grid" | "list">("grid");
  const [selected, setSelected]         = useState<Set<string>>(new Set());
  const [search, setSearch]             = useState("");
  const [extDragCount, setExtDragCount] = useState(0);
  const [previewIdx, setPreviewIdx]     = useState<number | null>(null);

  /* Folder rename state */
  const [editFolderId, setEditFolderId]         = useState<string | null>(null);
  const [editHeaderFolder, setEditHeaderFolder] = useState(false);

  /* Drop-highlight for folder tiles */
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  /* ── Platform drag overlay state ── */
  const [dragState, setDragState] = useState<{ seeds: number[]; count: number } | null>(null);
  const [flyTarget, setFlyTarget] = useState<{ x: number; y: number } | null>(null);

  // Shared motion values for cursor position (updated via dragover, no React renders)
  const cursorXMV = useMotionValue(-9999);
  const cursorYMV = useMotionValue(-9999);

  // Refs to folder DOM elements so we can get their center on drop
  const folderRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const fileInputRef   = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const showFolders = activeFolder === "All";
  const filtered    = MOCK_FILES.filter((f) => {
    const matchFolder = activeFolder === "All" || f.folder === activeFolder;
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    return matchFolder && matchSearch;
  });

  const toggleSel  = (id: string) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const selectAll  = () => setSelected(new Set(filtered.map((f) => f.id)));
  const clearSel   = () => setSelected(new Set());

  const renameFolder = (id: string, newName: string) => {
    setFolders((fs) => fs.map((f) => f.id === id ? { ...f, name: newName } : f));
    if (activeFolder === folders.find((f) => f.id === id)?.name) setActiveFolder(newName);
    setEditFolderId(null);
  };

  /* ── External file drag (from OS) — only trigger for real file drags, not platform drags ── */
  const onExtDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const types = Array.from(e.dataTransfer.types);
    // Only show upload overlay for OS files, not for internal platform drags
    if (types.includes("Files") && !types.includes("application/frame-files")) {
      setExtDragCount((n) => n + 1);
    }
  }, []);

  const onExtDragLeave = useCallback((e: React.DragEvent) => {
    const types = Array.from(e.dataTransfer.types);
    if (types.includes("Files") && !types.includes("application/frame-files")) {
      setExtDragCount((n) => Math.max(0, n - 1));
    }
  }, []);

  const onExtDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setExtDragCount(0);
  }, []);

  /* Track cursor position during platform drags via dragover */
  const onMainDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const types = Array.from(e.dataTransfer.types);
    if (types.includes("application/frame-files")) {
      cursorXMV.set(e.clientX);
      cursorYMV.set(e.clientY);
    }
  };

  /* HTML5 drag-start on a file tile — suppress native ghost, activate overlay */
  const onFileDragStart = (e: React.DragEvent, file: GFile) => {
    const ids   = selected.has(file.id) ? [...selected] : [file.id];
    const files = MOCK_FILES.filter((f) => ids.includes(f.id));
    const seeds = files.slice(0, 4).map((f) => f.seed);

    e.dataTransfer.setData("application/frame-files", JSON.stringify(ids));
    e.dataTransfer.effectAllowed = "move";

    // Suppress native browser drag ghost with a transparent 1×1 canvas
    const ghost = document.createElement("canvas");
    ghost.width = 1; ghost.height = 1;
    e.dataTransfer.setDragImage(ghost, 0, 0);

    // Initialise cursor at the tile's center so mini images start from there
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    cursorXMV.set(rect.left + rect.width / 2);
    cursorYMV.set(rect.top + rect.height / 2);

    setFlyTarget(null);
    setDragState({ seeds, count: ids.length });
  };

  /* Drag end — user dropped somewhere that's not a folder, or cancelled */
  const onFileDragEnd = () => {
    // Small delay so fly animation can finish if drop fired just before dragend
    setTimeout(() => {
      setDragState(null);
      setFlyTarget(null);
    }, 500);
  };

  /* Drop onto a folder tile */
  const onFolderDrop = (e: React.DragEvent, folderName: string, folderId: string) => {
    e.preventDefault(); e.stopPropagation();
    setDropTarget(null);
    const raw = e.dataTransfer.getData("application/frame-files");
    if (!raw) return;

    console.log("Move", JSON.parse(raw) as string[], "→", folderName); /* TODO: tRPC */

    // Trigger fly-into-folder animation
    const el = folderRefs.current[folderId];
    if (el) {
      const rect = el.getBoundingClientRect();
      setFlyTarget({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }
    // Clear after animation
    setTimeout(() => {
      setDragState(null);
      setFlyTarget(null);
    }, 700);
  };

  const activeFolderObj = folders.find((f) => f.name === activeFolder);

  /* ── Shared checkbox ── */
  const Checkbox = ({ id }: { id: string }) => (
    <div
      className={`w-4 h-4 flex items-center justify-center border-2 transition-all duration-100 shrink-0 ${
        selected.has(id) ? "bg-yellow border-yellow" : "border-[var(--border)] bg-[var(--bg-card)]"
      }`}
      style={{ borderRadius: 3 }}
      onClick={(e) => { e.stopPropagation(); toggleSel(id); }}
    >
      {selected.has(id) && <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="#111" strokeWidth="2.5"><path d="M2 6l3 3 5-5"/></svg>}
    </div>
  );

  return (
    <div
      className="min-h-full"
      onDragEnter={onExtDragEnter}
      onDragLeave={onExtDragLeave}
      onDrop={onExtDrop}
      onDragOver={onMainDragOver}
    >
      {/* Hidden file inputs */}
      <input ref={fileInputRef} type="file" multiple accept="image/*,.raw,.tiff,.dng" className="hidden" />
      <input ref={folderInputRef} type="file" className="hidden" {...({ webkitdirectory: "", directory: "" } as Record<string, string>)} />

      {/* ── Header ── */}
      <div className="sticky top-0 z-10 bg-[var(--bg)] border-b border-[var(--border)] px-5 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            {activeFolder !== "All" && (
              <button onClick={() => { setActiveFolder("All"); clearSel(); setEditHeaderFolder(false); }}
                className="text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors p-1.5 rounded-lg hover:bg-[var(--bg-subtle)]">
                <I.Back />
              </button>
            )}
            <div>
              {activeFolder === "All" ? (
                <h1 className="font-sans font-black text-[var(--fg)] text-lg leading-none">Gallery</h1>
              ) : editHeaderFolder ? (
                <RenameInput
                  value={activeFolder}
                  onDone={(v) => {
                    if (activeFolderObj) renameFolder(activeFolderObj.id, v);
                    setEditHeaderFolder(false);
                  }}
                />
              ) : (
                <div className="flex items-center gap-1.5">
                  <h1 className="font-sans font-black text-[var(--fg)] text-lg leading-none">{activeFolder}</h1>
                  <button
                    onClick={() => setEditHeaderFolder(true)}
                    className="p-1 rounded text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors"
                  >
                    <I.Pencil />
                  </button>
                </div>
              )}
              <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5">{filtered.length} files · {STORAGE.used} {STORAGE.unit} used</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => folderInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border)] bg-[var(--bg-card)] text-[var(--fg)] text-xs font-sans font-medium hover:border-[var(--fg-muted)] transition-colors rounded-lg">
              <I.Folder /> Folder
            </button>
            <button onClick={() => fileInputRef.current?.click()}
              className="btn-primary flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-semibold">
              <I.Upload /> Upload
            </button>
          </div>
        </div>

        {/* Storage bar */}
        <div className="mt-3">
          <div className="h-1 bg-[var(--bg-subtle)] flex overflow-hidden">
            {STORAGE_TYPES.map((t) => (
              <motion.div key={t.label} initial={{ width: 0 }} animate={{ width: `${(t.gb / STORAGE.total) * 100}%` }} transition={{ duration: 0.8 }}
                className="h-full" style={{ backgroundColor: t.color }} />
            ))}
          </div>
          <div className="flex gap-4 mt-1">
            {STORAGE_TYPES.map((t) => (
              <span key={t.label} className="flex items-center gap-1 font-mono text-[9px] text-[var(--fg-muted)]">
                <span className="w-1.5 h-1.5" style={{ backgroundColor: t.color }} />{t.label} {t.gb}TB
              </span>
            ))}
            <span className="ml-auto font-mono text-[9px] text-[var(--fg-muted)]">{STORAGE.used}/{STORAGE.total} {STORAGE.unit}</span>
          </div>
        </div>

        {/* Search + view */}
        <div className="mt-3 flex items-center gap-2">
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--fg-muted)]"><I.Search /></span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files…"
              className="w-full pl-8 pr-3 py-1.5 border border-[var(--border)] bg-[var(--bg-card)] font-sans text-xs text-[var(--fg)] placeholder:text-[var(--fg-muted)] focus:outline-none focus:border-yellow transition-colors rounded-lg" />
          </div>
          <div className="flex border border-[var(--border)] overflow-hidden rounded-lg ml-auto">
            <button onClick={() => setViewMode("grid")} className={`px-2.5 py-1.5 transition-colors ${viewMode === "grid" ? "bg-[var(--bg-subtle)] text-[var(--fg)]" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"}`}><I.Grid /></button>
            <button onClick={() => setViewMode("list")} className={`px-2.5 py-1.5 border-l border-[var(--border)] transition-colors ${viewMode === "list" ? "bg-[var(--bg-subtle)] text-[var(--fg)]" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"}`}><I.List /></button>
          </div>
          {filtered.length > 0 && (
            <button onClick={selected.size === filtered.length ? clearSel : selectAll}
              className="font-mono text-[10px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors whitespace-nowrap rounded-lg px-2 py-1">
              {selected.size === filtered.length ? "Deselect" : "Select all"}
            </button>
          )}
        </div>
      </div>

      {/* ── Grid view ── */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6" style={{ gap: "1px", backgroundColor: "var(--border)" }}>

          {/* Back tile (inside a folder) */}
          {activeFolder !== "All" && (
            <div onClick={() => { setActiveFolder("All"); clearSel(); }}
              className="relative aspect-square bg-[var(--bg-subtle)] cursor-pointer group flex flex-col items-center justify-center gap-1.5 hover:bg-[var(--bg-card)] transition-colors">
              <span className="text-[var(--fg-muted)] group-hover:text-[var(--fg)] transition-colors"><I.Back /></span>
              <span className="font-mono text-[9px] text-[var(--fg-muted)] group-hover:text-[var(--fg)] transition-colors">All photos</span>
            </div>
          )}

          {/* Folder tiles (All view only) */}
          {showFolders && !search && folders.map((folder) => (
            <div
              key={folder.id}
              ref={(el) => { folderRefs.current[folder.id] = el; }}
              className="relative aspect-square overflow-hidden cursor-pointer group bg-[var(--bg-subtle)]"
              style={{ boxShadow: dropTarget === folder.name ? "inset 0 0 0 3px #fad502" : "none" }}
              onClick={() => { if (editFolderId !== folder.id) { setActiveFolder(folder.name); clearSel(); } }}
              onDragOver={(e) => {
                e.preventDefault();
                if (Array.from(e.dataTransfer.types).includes("application/frame-files")) {
                  cursorXMV.set(e.clientX);
                  cursorYMV.set(e.clientY);
                  setDropTarget(folder.name);
                }
              }}
              onDragLeave={() => setDropTarget(null)}
              onDrop={(e) => onFolderDrop(e, folder.name, folder.id)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://picsum.photos/seed/${folder.seed}/300/300?grayscale`} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-50" />
              <div className="absolute inset-0 bg-black/55 group-hover:bg-black/45 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white" opacity="0.6"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>

                {editFolderId === folder.id ? (
                  <RenameInput value={folder.name} onDone={(v) => renameFolder(folder.id, v)} onClick={(e) => e.stopPropagation()} />
                ) : (
                  <div className="flex items-center gap-1">
                    <span className="font-sans font-bold text-white text-xs truncate">{folder.name}</span>
                    <button
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-white/20 text-white/60 hover:text-white"
                      onClick={(e) => { e.stopPropagation(); setEditFolderId(folder.id); }}
                    >
                      <I.Pencil />
                    </button>
                  </div>
                )}
                <span className="font-mono text-[9px] text-white/50">{folder.count} photos</span>
              </div>
            </div>
          ))}

          {/* File tiles */}
          {filtered.map((file) => (
            <div key={file.id}
              draggable
              onDragStart={(e) => onFileDragStart(e, file)}
              onDragEnd={onFileDragEnd}
              className="relative aspect-square overflow-hidden cursor-pointer group bg-[var(--bg-subtle)]"
              style={{ boxShadow: selected.has(file.id) ? "inset 0 0 0 2px #fad502" : "none" }}
              onClick={() => { if (selected.size > 0) toggleSel(file.id); else setPreviewIdx(filtered.indexOf(file)); }}
            >
              {file.type !== "raw" && file.type !== "tiff" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`https://picsum.photos/seed/${file.seed}/300/300?grayscale`} alt={file.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: typeColor(file.type).bg }}>
                  <span className="font-mono font-black text-sm" style={{ color: typeColor(file.type).text }}>.{file.type.toUpperCase()}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-150" />
              <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1 bg-gradient-to-t from-black/70 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-150">
                <p className="font-mono text-[9px] text-white truncate">{file.name}</p>
              </div>
              <div className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                <Checkbox id={file.id} />
              </div>
              {selected.has(file.id) && (
                <div className="absolute top-1.5 left-1.5" onClick={(e) => e.stopPropagation()}>
                  <Checkbox id={file.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── List view ── */}
      {viewMode === "list" && (
        <div className="p-5">
          <div className="border border-[var(--border)] overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-[auto_auto_1fr_auto_auto_auto] items-center gap-3 px-3 py-2 border-b border-[var(--border)] bg-[var(--bg-subtle)]">
              <div className="w-4" /><div className="w-7" />
              <span className="font-mono text-[9px] text-[var(--fg-muted)] uppercase tracking-wider">Name</span>
              <span className="font-mono text-[9px] text-[var(--fg-muted)] uppercase tracking-wider w-14 text-right">Size</span>
              <span className="font-mono text-[9px] text-[var(--fg-muted)] uppercase tracking-wider w-14 text-right">Date</span>
              <div className="w-5" />
            </div>

            {/* Back row (inside folder) */}
            {activeFolder !== "All" && (
              <div onClick={() => { setActiveFolder("All"); clearSel(); }}
                className="grid grid-cols-[auto_auto_1fr_auto_auto_auto] items-center gap-3 px-3 py-2.5 border-b border-[var(--border)] hover:bg-[var(--bg-subtle)] cursor-pointer transition-colors">
                <div className="w-4" />
                <div className="w-7 h-7 flex items-center justify-center text-[var(--fg-muted)]"><I.Back /></div>
                <span className="font-sans text-xs text-[var(--fg-muted)]">.. (All photos)</span>
                <span className="w-14" /><span className="w-14" /><div className="w-5" />
              </div>
            )}

            {/* Folder rows (All view) */}
            {showFolders && !search && folders.map((folder) => (
              <div key={folder.id}
                ref={(el) => { folderRefs.current[folder.id] = el; }}
                className="grid grid-cols-[auto_auto_1fr_auto_auto_auto] items-center gap-3 px-3 py-2.5 border-b border-[var(--border)] hover:bg-[var(--bg-subtle)] cursor-pointer transition-colors"
                style={{ boxShadow: dropTarget === folder.name ? "inset 0 0 0 2px #fad502" : "none" }}
                onClick={() => { if (editFolderId !== folder.id) { setActiveFolder(folder.name); clearSel(); } }}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (Array.from(e.dataTransfer.types).includes("application/frame-files")) {
                    cursorXMV.set(e.clientX);
                    cursorYMV.set(e.clientY);
                    setDropTarget(folder.name);
                  }
                }}
                onDragLeave={() => setDropTarget(null)}
                onDrop={(e) => onFolderDrop(e, folder.name, folder.id)}
              >
                <div className="w-4" />
                <div className="w-7 h-7 flex items-center justify-center text-yellow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" opacity="0.7"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                </div>
                <div className="flex items-center gap-1.5 min-w-0">
                  {editFolderId === folder.id ? (
                    <RenameInput value={folder.name} onDone={(v) => renameFolder(folder.id, v)} onClick={(e) => e.stopPropagation()} />
                  ) : (
                    <>
                      <span className="font-sans text-xs text-[var(--fg)] truncate">{folder.name}</span>
                      <button
                        className="p-0.5 rounded text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-card)] transition-colors"
                        onClick={(e) => { e.stopPropagation(); setEditFolderId(folder.id); }}
                      >
                        <I.Pencil />
                      </button>
                    </>
                  )}
                  <span className="font-mono text-[9px] text-[var(--fg-muted)] ml-1">{folder.count} photos</span>
                </div>
                <span className="font-mono text-[10px] text-[var(--fg-muted)] w-14 text-right">—</span>
                <span className="font-mono text-[10px] text-[var(--fg-muted)] w-14 text-right">—</span>
                <div className="w-5" />
              </div>
            ))}

            {/* File rows */}
            {filtered.map((file) => (
              <div key={file.id}
                draggable
                onDragStart={(e) => onFileDragStart(e, file)}
                onDragEnd={onFileDragEnd}
                className={`grid grid-cols-[auto_auto_1fr_auto_auto_auto] items-center gap-3 px-3 py-2 border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-subtle)] cursor-pointer transition-colors group ${selected.has(file.id) ? "bg-yellow/5" : ""}`}
                onClick={() => setPreviewIdx(filtered.indexOf(file))}
              >
                <div onClick={(e) => e.stopPropagation()}><Checkbox id={file.id} /></div>
                {file.type !== "raw" && file.type !== "tiff" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`https://picsum.photos/seed/${file.seed}/56/56?grayscale`} alt="" className="w-7 h-7 object-cover shrink-0" />
                ) : (
                  <div className="w-7 h-7 flex items-center justify-center shrink-0 text-[7px] font-mono font-black"
                    style={{ backgroundColor: typeColor(file.type).bg, color: typeColor(file.type).text }}>{file.type.toUpperCase()}</div>
                )}
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-sans text-xs text-[var(--fg)] truncate">{file.name}</span>
                  <span className="font-mono text-[9px] text-[var(--fg-muted)]">{file.w}×{file.h}</span>
                </div>
                <span className="font-mono text-[10px] text-[var(--fg-muted)] w-14 text-right">{file.size}</span>
                <span className="font-mono text-[10px] text-[var(--fg-muted)] w-14 text-right">{file.date}</span>
                <button className="w-5 h-5 flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors rounded opacity-0 group-hover:opacity-100"
                  onClick={(e) => e.stopPropagation()}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bulk action bar */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 px-3 py-2 bg-[var(--bg-card)] border border-[var(--border)] shadow-xl rounded-xl">
            <span className="font-mono text-[10px] text-[var(--fg-muted)] px-2">{selected.size} selected</span>
            <div className="w-px h-4 bg-[var(--border)]" />
            <button className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-sans font-medium text-[var(--fg)] hover:bg-[var(--bg-subtle)] rounded-lg transition-colors"><I.Move /> Move</button>
            <button className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-sans font-medium text-[var(--fg)] hover:bg-[var(--bg-subtle)] rounded-lg transition-colors"><I.Download /> Download</button>
            <button className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-sans font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><I.Trash /> Delete</button>
            <div className="w-px h-4 bg-[var(--border)]" />
            <button onClick={clearSel} className="w-7 h-7 flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg)] rounded-lg transition-colors"><I.Close /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* External drag overlay (OS files only) */}
      <AnimatePresence>
        {extDragCount > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="border-2 border-dashed border-yellow px-20 py-14 flex flex-col items-center gap-4">
              <div className="w-14 h-14 bg-yellow/20 flex items-center justify-center rounded-xl">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fad502" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              </div>
              <p className="font-sans font-black text-white text-lg">Drop to upload</p>
              <p className="font-mono text-xs text-white/40">JPG · RAW · TIFF · DNG</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Platform drag overlay — wind-blown mini thumbnails */}
      {dragState && (
        <DragOverlay
          seeds={dragState.seeds}
          count={dragState.count}
          flyTarget={flyTarget}
          cursorXMV={cursorXMV}
          cursorYMV={cursorYMV}
        />
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {previewIdx !== null && previewIdx >= 0 && previewIdx < filtered.length && (
          <ImageModal files={filtered} index={previewIdx} onIndex={setPreviewIdx} onClose={() => setPreviewIdx(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
