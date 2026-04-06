"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Mock data ── */
const FOLDERS = ["All", "Weddings", "Portraits", "Landscapes", "Commercial", "Events"];

const MOCK_FILES = [
  { id: "1",  name: "DSC_0847.jpg",        size: "8.4 MB",  type: "jpg",  folder: "Weddings",   seed: 11,  date: "2h ago",   w: 5472, h: 3648 },
  { id: "2",  name: "Portrait_01.jpg",      size: "6.1 MB",  type: "jpg",  folder: "Portraits",  seed: 22,  date: "3h ago",   w: 4000, h: 5000 },
  { id: "3",  name: "Golden_Hour.jpg",      size: "9.7 MB",  type: "jpg",  folder: "Landscapes", seed: 33,  date: "5h ago",   w: 6000, h: 4000 },
  { id: "4",  name: "Wedding_final.RAW",    size: "24.3 MB", type: "raw",  folder: "Weddings",   seed: 44,  date: "1d ago",   w: 5472, h: 3648 },
  { id: "5",  name: "Commercial_02.jpg",    size: "7.2 MB",  type: "jpg",  folder: "Commercial", seed: 55,  date: "1d ago",   w: 4500, h: 3000 },
  { id: "6",  name: "Portrait_Studio.jpg",  size: "5.8 MB",  type: "jpg",  folder: "Portraits",  seed: 66,  date: "2d ago",   w: 3840, h: 5760 },
  { id: "7",  name: "Landscape_06.tiff",    size: "31.2 MB", type: "tiff", folder: "Landscapes", seed: 77,  date: "2d ago",   w: 7360, h: 4912 },
  { id: "8",  name: "Event_Party.jpg",      size: "4.9 MB",  type: "jpg",  folder: "Events",     seed: 88,  date: "3d ago",   w: 4000, h: 3000 },
  { id: "9",  name: "DSC_1204.RAW",         size: "26.1 MB", type: "raw",  folder: "Weddings",   seed: 99,  date: "3d ago",   w: 5472, h: 3648 },
  { id: "10", name: "Outdoor_Portrait.jpg", size: "7.8 MB",  type: "jpg",  folder: "Portraits",  seed: 110, date: "4d ago",   w: 5000, h: 6250 },
  { id: "11", name: "Aerial_City.jpg",      size: "11.2 MB", type: "jpg",  folder: "Commercial", seed: 121, date: "5d ago",   w: 6000, h: 4000 },
  { id: "12", name: "Candid_Shot.jpg",      size: "3.9 MB",  type: "jpg",  folder: "Events",     seed: 132, date: "1w ago",   w: 3500, h: 2333 },
  { id: "13", name: "Bridal_Portrait.jpg",  size: "8.1 MB",  type: "jpg",  folder: "Weddings",   seed: 143, date: "1w ago",   w: 4500, h: 6000 },
  { id: "14", name: "Mountain_Mist.jpg",    size: "12.4 MB", type: "jpg",  folder: "Landscapes", seed: 154, date: "1w ago",   w: 7000, h: 4667 },
  { id: "15", name: "Product_Shoot.jpg",    size: "5.3 MB",  type: "jpg",  folder: "Commercial", seed: 165, date: "2w ago",   w: 4000, h: 4000 },
];

/* ── Storage mock ── */
const STORAGE = { used: 2.4, total: 5, unit: "TB" };
const STORAGE_TYPES = [
  { label: "RAW",  gb: 0.9,  color: "#fad502" },
  { label: "TIFF", gb: 0.6,  color: "#808080" },
  { label: "JPEG", gb: 0.9,  color: "#4a9eff" },
];

/* ── Helpers ── */
function typeColor(type: string) {
  if (type === "raw")  return { bg: "rgba(250,213,2,0.12)", text: "#fad502" };
  if (type === "tiff") return { bg: "rgba(128,128,128,0.12)", text: "#808080" };
  return { bg: "rgba(74,158,255,0.12)", text: "#4a9eff" };
}

/* ── Icons ── */
function UploadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
function FolderIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
    </svg>
  );
}
function GridIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function ListIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6M9 6V4h6v2" />
    </svg>
  );
}
function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
function MoveIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="5 9 2 12 5 15" /><polyline points="9 5 12 2 15 5" />
      <line x1="2" y1="12" x2="22" y2="12" /><line x1="12" y1="2" x2="12" y2="22" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

/* ── Image preview modal ── */
function ImageModal({ file, onClose }: { file: typeof MOCK_FILES[0]; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="relative max-w-4xl w-full rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {file.type !== "raw" && file.type !== "tiff" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`https://picsum.photos/seed/${file.seed}/1200/800?grayscale`} alt={file.name} className="w-full h-auto max-h-[80vh] object-contain" />
        ) : (
          <div className="w-full h-64 flex flex-col items-center justify-center" style={{ backgroundColor: typeColor(file.type).bg }}>
            <div className="text-4xl font-mono font-black mb-2" style={{ color: typeColor(file.type).text }}>.{file.type.toUpperCase()}</div>
            <div className="font-sans text-sm text-[var(--fg-muted)]">Preview not available for RAW/TIFF</div>
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors">
            <XIcon />
          </button>
        </div>
        <div className="bg-[var(--bg-card)] border-t border-[var(--border)] px-5 py-3 flex items-center justify-between">
          <div>
            <div className="font-sans font-semibold text-sm text-[var(--fg)]">{file.name}</div>
            <div className="font-mono text-[11px] text-[var(--fg-muted)] mt-0.5">{file.size} · {file.w}×{file.h}px · {file.date}</div>
          </div>
          <button className="btn-primary flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-semibold">
            <DownloadIcon /> Download
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main gallery page ── */
export default function GalleryPage() {
  const [activeFolder, setActiveFolder]   = useState("All");
  const [viewMode, setViewMode]           = useState<"grid" | "list">("grid");
  const [selected, setSelected]           = useState<Set<string>>(new Set());
  const [search, setSearch]               = useState("");
  const [dragCount, setDragCount]         = useState(0);
  const [previewFile, setPreviewFile]     = useState<typeof MOCK_FILES[0] | null>(null);
  const fileInputRef                      = useRef<HTMLInputElement>(null);
  const folderInputRef                    = useRef<HTMLInputElement>(null);

  /* filtering */
  const filtered = MOCK_FILES.filter((f) => {
    const matchFolder = activeFolder === "All" || f.folder === activeFolder;
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    return matchFolder && matchSearch;
  });

  /* selection */
  const toggleSelect = (id: string) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const selectAll = () => setSelected(new Set(filtered.map((f) => f.id)));
  const clearSelection = () => setSelected(new Set());

  /* drag & drop */
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragCount((n) => n + 1);
  }, []);
  const handleDragLeave = useCallback(() => {
    setDragCount((n) => n - 1);
  }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragCount(0);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) {
      console.log("Dropped files:", files.map((f) => f.name));
      /* TODO: wire to tRPC upload */
    }
  }, []);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const isDraggingOver = dragCount > 0;

  /* storage */
  const pct = (STORAGE.used / STORAGE.total) * 100;

  return (
    <div
      className="min-h-full"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* Hidden file inputs */}
      <input ref={fileInputRef} type="file" multiple accept="image/*,.raw,.tiff,.dng" className="hidden" onChange={(e) => console.log("Files:", e.target.files)} />
      <input ref={folderInputRef} type="file" className="hidden"
        {...({ webkitdirectory: "", directory: "" } as Record<string, string>)}
        onChange={(e) => console.log("Folder files:", e.target.files)}
      />

      {/* Page header */}
      <div className="sticky top-0 z-10 bg-[var(--bg)] border-b border-[var(--border)] px-6 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-sans font-black text-[var(--fg)] text-xl">Gallery</h1>
            <p className="font-mono text-xs text-[var(--fg-muted)] mt-0.5">{MOCK_FILES.length} files · {STORAGE.used} {STORAGE.unit} used</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => folderInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-[var(--fg)] text-sm font-sans font-medium hover:border-[var(--fg-muted)] transition-colors"
            >
              <FolderIcon /> Upload folder
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-primary flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-sans font-semibold"
            >
              <UploadIcon /> Upload files
            </button>
          </div>
        </div>

        {/* Storage bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[11px] text-[var(--fg-muted)]">Storage</span>
            <span className="font-mono text-[11px] text-[var(--fg-muted)]">
              <span className="text-[var(--fg)] font-semibold">{STORAGE.used} {STORAGE.unit}</span> of {STORAGE.total} {STORAGE.unit}
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden bg-[var(--bg-subtle)] flex">
            {STORAGE_TYPES.map((t) => (
              <motion.div
                key={t.label}
                initial={{ width: 0 }}
                animate={{ width: `${(t.gb / STORAGE.total) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full first:rounded-l-full last:rounded-r-full"
                style={{ backgroundColor: t.color }}
                title={`${t.label}: ${t.gb} TB`}
              />
            ))}
          </div>
          <div className="flex gap-4 mt-1.5">
            {STORAGE_TYPES.map((t) => (
              <span key={t.label} className="flex items-center gap-1 font-mono text-[10px] text-[var(--fg-muted)]">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                {t.label} {t.gb} TB
              </span>
            ))}
          </div>
        </div>

        {/* Folder tabs + toolbar */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex gap-1 overflow-x-auto flex-1 [scrollbar-width:none]">
            {FOLDERS.map((f) => (
              <button
                key={f}
                onClick={() => { setActiveFolder(f); clearSelection(); }}
                className={`shrink-0 px-3 py-1.5 rounded-lg font-sans text-xs font-medium transition-colors whitespace-nowrap ${
                  activeFolder === f
                    ? "bg-yellow text-[#111]"
                    : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Search + view toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--fg-muted)]"><SearchIcon /></span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="w-36 pl-8 pr-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] font-sans text-xs text-[var(--fg)] placeholder:text-[var(--fg-muted)] focus:outline-none focus:border-yellow transition-colors"
              />
            </div>
            <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-2.5 py-1.5 transition-colors ${viewMode === "grid" ? "bg-[var(--bg-subtle)] text-[var(--fg)]" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"}`}
              ><GridIcon /></button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-2.5 py-1.5 border-l border-[var(--border)] transition-colors ${viewMode === "list" ? "bg-[var(--bg-subtle)] text-[var(--fg)]" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"}`}
              ><ListIcon /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk action bar */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-lg"
          >
            <span className="font-mono text-xs text-[var(--fg-muted)] mr-1">{selected.size} selected</span>
            <div className="w-px h-4 bg-[var(--border)]" />
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-medium text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors">
              <MoveIcon /> Move
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-medium text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors">
              <DownloadIcon /> Download
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-medium text-red-400 hover:bg-red-500/10 transition-colors">
              <TrashIcon /> Delete
            </button>
            <div className="w-px h-4 bg-[var(--border)]" />
            <button onClick={clearSelection} className="text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"><XIcon /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="p-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[var(--bg-subtle)] flex items-center justify-center mb-4 text-[var(--fg-muted)]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
            </div>
            <p className="font-sans font-semibold text-[var(--fg)] mb-1">No photos found</p>
            <p className="font-serif text-sm text-[var(--fg-muted)]">Try a different folder or search term</p>
          </div>
        ) : viewMode === "grid" ? (
          <>
            {/* Select all row */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs text-[var(--fg-muted)]">{filtered.length} files</span>
              <button onClick={selected.size === filtered.length ? clearSelection : selectAll} className="font-mono text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
                {selected.size === filtered.length ? "Deselect all" : "Select all"}
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filtered.map((file) => (
                <motion.div
                  key={file.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
                  style={{
                    background: typeColor(file.type).bg,
                    boxShadow: selected.has(file.id) ? "0 0 0 2px #fad502" : "none",
                  }}
                  onClick={() => {
                    if (selected.size > 0) toggleSelect(file.id);
                    else setPreviewFile(file);
                  }}
                >
                  {/* Image or type placeholder */}
                  {file.type !== "raw" && file.type !== "tiff" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://picsum.photos/seed/${file.seed}/400/400?grayscale`}
                      alt={file.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: typeColor(file.type).bg }}>
                      <span className="font-mono font-black text-2xl" style={{ color: typeColor(file.type).text }}>.{file.type.toUpperCase()}</span>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <p className="font-mono text-[10px] text-white truncate">{file.name}</p>
                    <p className="font-mono text-[9px] text-white/60">{file.size}</p>
                  </div>

                  {/* Checkbox */}
                  <div
                    className={`absolute top-2 left-2 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-150 ${
                      selected.has(file.id)
                        ? "bg-yellow border-yellow"
                        : "border-white/60 bg-black/30 opacity-0 group-hover:opacity-100"
                    }`}
                    onClick={(e) => { e.stopPropagation(); toggleSelect(file.id); }}
                  >
                    {selected.has(file.id) && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#111" strokeWidth="2.5"><path d="M2 6l3 3 5-5" /></svg>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          /* List view */
          <div className="rounded-xl border border-[var(--border)] overflow-hidden">
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 px-4 py-2.5 border-b border-[var(--border)] bg-[var(--bg-subtle)]">
              <div className="w-5" />
              <span className="font-mono text-[10px] text-[var(--fg-muted)] uppercase tracking-wider">Name</span>
              <span className="font-mono text-[10px] text-[var(--fg-muted)] uppercase tracking-wider w-16 text-right">Size</span>
              <span className="font-mono text-[10px] text-[var(--fg-muted)] uppercase tracking-wider w-20 text-right">Date</span>
              <div className="w-8" />
            </div>
            {filtered.map((file) => (
              <div
                key={file.id}
                className={`grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 px-4 py-3 border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer ${selected.has(file.id) ? "bg-yellow/5" : ""}`}
                onClick={() => setPreviewFile(file)}
              >
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center border-2 shrink-0 transition-colors ${selected.has(file.id) ? "bg-yellow border-yellow" : "border-[var(--border)]"}`}
                  onClick={(e) => { e.stopPropagation(); toggleSelect(file.id); }}
                >
                  {selected.has(file.id) && <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#111" strokeWidth="2.5"><path d="M2 6l3 3 5-5" /></svg>}
                </div>
                <div className="flex items-center gap-3 min-w-0">
                  {file.type !== "raw" && file.type !== "tiff" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={`https://picsum.photos/seed/${file.seed}/80/80?grayscale`} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-[8px] font-mono font-black" style={typeColor(file.type)}>.{file.type.toUpperCase()}</div>
                  )}
                  <div className="min-w-0">
                    <div className="font-sans text-sm text-[var(--fg)] truncate">{file.name}</div>
                    <div className="font-mono text-[10px] text-[var(--fg-muted)]">{file.w}×{file.h}px</div>
                  </div>
                </div>
                <span className="font-mono text-xs text-[var(--fg-muted)] w-16 text-right">{file.size}</span>
                <span className="font-mono text-xs text-[var(--fg-muted)] w-20 text-right">{file.date}</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-card)] transition-colors" onClick={(e) => e.stopPropagation()}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Drag & drop overlay */}
      <AnimatePresence>
        {isDraggingOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="border-2 border-dashed border-yellow rounded-3xl px-16 py-14 flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-yellow/20 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fad502" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
              </div>
              <p className="font-sans font-black text-white text-xl">Drop photos here</p>
              <p className="font-mono text-xs text-white/50">JPG, RAW, TIFF, DNG · Any size</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image preview modal */}
      <AnimatePresence>
        {previewFile && <ImageModal file={previewFile} onClose={() => setPreviewFile(null)} />}
      </AnimatePresence>
    </div>
  );
}
