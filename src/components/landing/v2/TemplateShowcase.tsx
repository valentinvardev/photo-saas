"use client";

/**
 * Template showcase for the homepage.
 *
 * Each template gets a card with a miniature of a *real-looking site* —
 * its own palette, display face and layout signature, filled with
 * placeholder content (a photographer's name, a date, real photos) — plus a
 * Preview button that opens the actual demo page in the device modal.
 *
 * The miniatures are hand-coded rather than iframes on purpose: six live
 * template pages on the landing would be a heavy first paint. The real page
 * loads only when someone asks for the preview.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "~/components/providers/LangProvider";
import { TEMPLATE_CATALOG, type CatalogTemplate } from "~/lib/templates/catalog";
import { DevicePreviewModal } from "~/components/dashboard/DevicePreviewModal";

/* Placeholder photos — same seeds the templates use for their own demos, so
   the miniature reads like the site the visitor will actually see. */
const SHOTS: Record<string, number[]> = {
  "minimal-bw": [1084, 201, 65],
  atelier:      [338, 200, 145],
  halcyon:      [600, 601, 602],
  meridian:     [1039, 331, 447],
  vernissage:   [1041, 452, 358],
  serenata:     [1059, 342, 76],
};

function Shot({ seed, gray, className, style }: { seed: number; gray?: boolean; className?: string; style?: React.CSSProperties }) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={`https://picsum.photos/seed/${seed}/400/500${gray ? "?grayscale" : ""}`}
      alt=""
      loading="lazy"
      className={className}
      style={{ objectFit: "cover", display: "block", ...style }}
    />
  );
}

/* ── The miniature site, one layout per template ──────────────── */
function MiniSite({ tpl }: { tpl: CatalogTemplate }) {
  const { t } = useT();
  const p = tpl.palette;
  const seeds = SHOTS[tpl.id] ?? [1, 2, 3];
  const [a, b, c] = seeds as [number, number, number];
  const gray = tpl.id === "minimal-bw";

  const label: React.CSSProperties = {
    fontFamily: "var(--font-mono, monospace)", fontSize: 5, letterSpacing: "0.22em",
    textTransform: "uppercase", color: p.muted,
  };
  const display = (size: number, italic = false): React.CSSProperties => ({
    fontFamily: tpl.serif, fontSize: size, lineHeight: 1.05, color: p.fg,
    letterSpacing: "-0.015em", fontStyle: italic ? "italic" : "normal",
  });

  /* Shared top strip — the site's nav */
  const Nav = ({ brand, script = false }: { brand: string; script?: boolean }) => (
    <div className="flex items-center justify-between shrink-0" style={{ padding: "6% 7% 0" }}>
      <span style={script
        ? { fontFamily: "'Great Vibes', cursive", fontSize: 12, color: p.fg, lineHeight: 1 }
        : { ...label, color: p.fg, fontWeight: 700, fontSize: 5.5 }}>
        {brand}
      </span>
      <span className="flex gap-2" style={label}>
        <span>{t("lp.templates.mockWork")}</span>
        <span>{t("lp.templates.mockAbout")}</span>
      </span>
    </div>
  );

  const shell = "relative w-full h-full flex flex-col overflow-hidden";

  switch (tpl.id) {
    /* Left-aligned editorial + strict grid */
    case "minimal-bw":
      return (
        <div className={shell} style={{ background: p.bg }}>
          <Nav brand="A · M" />
          <div style={{ padding: "7% 7% 0" }}>
            <div style={{ ...label, marginBottom: "3%" }}>Photography · NY</div>
            <div style={display(22)}>Alex<br /><em>Morgan</em></div>
            <div style={{ width: "18%", height: 1, background: p.fg, margin: "5% 0" }} />
          </div>
          <div className="mt-auto grid grid-cols-3 gap-[2px]" style={{ padding: "0 7% 7%" }}>
            {[a, b, c].map((s) => <Shot key={s} seed={s} gray={gray} style={{ width: "100%", aspectRatio: "1/1" }} />)}
          </div>
        </div>
      );

    /* Centred, warm, one hero plate */
    case "atelier":
      return (
        <div className={shell} style={{ background: p.bg }}>
          <Nav brand="ATELIER" />
          <div className="text-center" style={{ padding: "8% 10% 0" }}>
            <div style={{ ...label, color: p.accent, marginBottom: "4%" }}>Sept 2025</div>
            <div style={display(20)}>Elena <em style={{ color: p.accent }}>&amp;</em> Marco</div>
          </div>
          <div className="mt-auto" style={{ padding: "7% 10% 9%" }}>
            <Shot seed={a} style={{ width: "100%", aspectRatio: "16/9", border: `3px solid ${p.bg}`, outline: `1px solid ${p.muted}40` }} />
          </div>
        </div>
      );

    /* Warm-dark editorial + typographic project index */
    case "halcyon":
      return (
        <div className={shell} style={{ background: p.bg }}>
          <Nav brand="HALCYON" />
          <div style={{ padding: "7% 7% 4%" }}>
            <div style={display(16, true)}>The light<br />keeps arriving.</div>
          </div>
          <div className="mt-auto" style={{ padding: "0 7% 8%" }}>
            {[["01", "Wilder"], ["02", "Marisol"], ["03", "Ostende"]].map(([n, name], i) => (
              <div key={n} className="flex items-center gap-3"
                style={{ padding: "3.5% 0", borderTop: `1px solid ${p.muted}33` }}>
                <span style={{ ...label, color: p.accent, fontSize: 5 }}>{n}</span>
                <span style={{ fontFamily: tpl.serif, fontSize: 9, color: p.fg }}>{name}</span>
                {i === 0 && <Shot seed={a} style={{ width: "22%", aspectRatio: "4/3", marginLeft: "auto" }} />}
              </div>
            ))}
          </div>
        </div>
      );

    /* Cool museum hang — split hero, even grid */
    case "meridian":
      return (
        <div className={shell} style={{ background: p.bg }}>
          <Nav brand="MERIDIAN" />
          <div className="flex gap-[5%]" style={{ padding: "6% 7% 0" }}>
            <div style={{ width: "52%" }}>
              <div style={{ ...label, color: p.accent, marginBottom: "5%" }}>Selected</div>
              <div style={display(14)}>Quiet<br /><em>rooms</em></div>
            </div>
            <Shot seed={a} style={{ width: "43%", aspectRatio: "4/3" }} />
          </div>
          <div className="mt-auto grid grid-cols-3" style={{ gap: "3%", padding: "5% 7% 7%" }}>
            {[b, c, a].map((s, i) => <Shot key={i} seed={s} style={{ width: "100%", aspectRatio: "3/2" }} />)}
          </div>
        </div>
      );

    /* Night gallery — one spotlit framed piece */
    case "vernissage":
      return (
        <div className={shell} style={{ background: p.bg }}>
          <div aria-hidden className="absolute inset-x-0 top-0" style={{
            height: "70%",
            background: `linear-gradient(180deg, ${p.fg}1f 0%, transparent 80%)`,
            clipPath: "polygon(38% 0, 62% 0, 92% 100%, 8% 100%)",
          }} />
          <div className="relative"><Nav brand="VERNISSAGE" /></div>
          <div className="relative text-center" style={{ padding: "6% 10% 0" }}>
            <div style={{ ...label, color: p.accent }}>Opening night</div>
          </div>
          <div className="relative mt-auto flex flex-col items-center" style={{ padding: "4% 0 7%" }}>
            <div style={{ width: "31%", padding: 3, background: "#FAF8F2", border: `4px solid #2B261F`, boxShadow: `inset 0 0 0 1px ${p.accent}, 0 10px 22px -8px rgba(0,0,0,0.8)` }}>
              <Shot seed={a} style={{ width: "100%", aspectRatio: "4/5" }} />
            </div>
            <div style={{ marginTop: "4%", padding: "2px 6px", background: p.accent }}>
              <span style={{ ...label, color: "#1C1710", fontSize: 4 }}>01 — Untitled</span>
            </div>
          </div>
        </div>
      );

    /* Wedding — album spread, calligraphic hand */
    case "serenata":
      return (
        <div className={shell} style={{ background: p.bg }}>
          <Nav brand="Serenata" script />
          <div className="text-center" style={{ padding: "7% 10% 0" }}>
            <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: 20, lineHeight: 1.15, color: p.fg }}>
              Sofía &amp; Tomás
            </div>
            <div style={{ ...label, marginTop: "3%" }}>09 · 09 · 2025</div>
          </div>
          <div className="mt-auto flex" style={{ padding: "5% 9% 8%", gap: 0 }}>
            <div style={{ width: "50%", background: "#FFFDFA", padding: "4%", borderRight: `1px solid ${p.muted}44` }}>
              <Shot seed={a} style={{ width: "100%", aspectRatio: "4/3" }} />
            </div>
            <div style={{ width: "50%", background: "#FFFDFA", padding: "4%" }}>
              <Shot seed={b} style={{ width: "100%", aspectRatio: "4/3" }} />
            </div>
          </div>
        </div>
      );

    default:
      return <div className={shell} style={{ background: p.bg }} />;
  }
}

/* ── Card ─────────────────────────────────────────────────────── */
function TemplateCard({ tpl, index, onPreview }: { tpl: CatalogTemplate; index: number; onPreview: () => void }) {
  const { t } = useT();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.08 }}
      className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden flex flex-col hover:border-[var(--fg-muted)] transition-colors"
    >
      {/* Miniature */}
      <div className="relative aspect-[4/3] overflow-hidden border-b border-[var(--border)]">
        <MiniSite tpl={tpl} />
        {/* Hover veil + preview affordance (desktop) */}
        <button
          onClick={onPreview}
          aria-label={t("lp.templates.preview")}
          className="absolute inset-0 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: "rgba(10,10,12,0.55)" }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow text-[#111] font-sans text-xs font-bold">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
            </svg>
            {t("lp.templates.preview")}
          </span>
        </button>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-sans font-bold text-[var(--fg)] text-base">{t(`onb.template.${tpl.i18nKey}Name`)}</h3>
          <span className="flex items-center gap-1 ml-auto">
            {[tpl.palette.bg, tpl.palette.fg, tpl.palette.accent].map((c, i) => (
              <span key={i} className="w-2.5 h-2.5 rounded-full border border-[var(--border)]" style={{ background: c }} />
            ))}
          </span>
        </div>
        <p className="font-sans text-sm text-[var(--fg-muted)] leading-relaxed mt-2 flex-1">
          {t(`onb.template.${tpl.i18nKey}Desc`)}
        </p>
        <button
          onClick={onPreview}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] font-sans text-xs font-bold text-[var(--fg)] hover:border-yellow hover:text-yellow transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
          </svg>
          {t("lp.templates.preview")}
        </button>
      </div>
    </motion.div>
  );
}

/* ── Grid + the on-demand preview modal ───────────────────────── */
export function TemplateShowcase() {
  const { t, locale } = useT();
  const [open, setOpen] = useState<CatalogTemplate | null>(null);

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {TEMPLATE_CATALOG.map((tpl, i) => (
          <TemplateCard key={tpl.id} tpl={tpl} index={i} onPreview={() => setOpen(tpl)} />
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <DevicePreviewModal
            url={`${open.demoUrl}?lang=${locale}`}
            title={t(`onb.template.${open.i18nKey}Name`)}
            subtitle={t("lp.templates.previewSub")}
            onClose={() => setOpen(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
