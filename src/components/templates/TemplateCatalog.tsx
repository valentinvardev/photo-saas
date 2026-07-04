"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "~/components/providers/LangProvider";
import { TEMPLATE_CATALOG, type CatalogTemplate } from "~/lib/templates/catalog";
import { DevicePreviewModal } from "~/components/dashboard/DevicePreviewModal";
import { LiveTemplatePreview } from "~/components/onboarding/LiveTemplatePreview";
import { buildMinimalNodes, buildAtelierNodes, buildHalcyonNodes, type Identity } from "~/components/onboarding/brandData";
import { TEMPLATES as EDITOR_TEMPLATES, type TemplateId } from "~/lib/editor/templates/registry";
import { DEFAULT_TYPOGRAPHY } from "~/lib/editor/types";

/* ══════════════════════════════════════════════════════════════════════════
   Shared template catalog — the selectable list of real portfolio templates
   plus the live preview pane with its "Use this template" call to action.
   Consumed by the onboarding template step and the portfolio-creation wizard.
══════════════════════════════════════════════════════════════════════════ */

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fad502" strokeWidth="3" strokeLinecap="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/* ── Brand swatch — a template's identity at a glance ───────────────────
   Deliberately NOT an iframe: rendering every demo page just for a card
   thumbnail is wasteful. The palette, headline face and accent tell the
   story; the single live preview pane shows the real thing on selection. */
function BrandSwatch({ tpl }: { tpl: CatalogTemplate }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ background: tpl.palette.bg }}>
      <span style={{ fontFamily: tpl.serif, fontSize: 24, lineHeight: 1, letterSpacing: "-0.02em", color: tpl.palette.fg }}>
        {tpl.name.charAt(0)}<span style={{ color: tpl.palette.accent }}>.</span>
      </span>
      <div className="absolute left-0 right-0 bottom-0 flex h-1">
        <div className="flex-1" style={{ background: tpl.palette.accent }} />
        <div className="flex-1" style={{ background: tpl.palette.fg }} />
        <div className="flex-1" style={{ background: tpl.palette.muted }} />
      </div>
    </div>
  );
}

/* ── Card list ──────────────────────────────────────────────────────────
   One card per template: brand swatch, translated name/description,
   palette swatches, and — when selected — the "Use this template" CTA. */
export function TemplateCatalogList({
  selectedId,
  onSelect,
  onUse,
}: {
  selectedId: TemplateId;
  onSelect: (id: TemplateId) => void;
  /** When provided, the selected card shows the primary CTA. */
  onUse?: (id: TemplateId) => void;
}) {
  const { t } = useT();

  return (
    <div className="flex flex-col gap-2">
      {TEMPLATE_CATALOG.map((tpl) => {
        const active = tpl.id === selectedId;
        return (
          <div
            key={tpl.id}
            className={`rounded-xl border transition-all overflow-hidden ${
              active ? "border-yellow bg-yellow/5" : "border-[var(--border)] hover:border-[var(--fg-muted)]"
            }`}
          >
            <button onClick={() => onSelect(tpl.id)} className="w-full flex items-center gap-3 p-3 text-left">
              <div className="w-20 h-14 overflow-hidden shrink-0 border border-[var(--border)] rounded-sm">
                <BrandSwatch tpl={tpl} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-sans text-sm font-semibold text-[var(--fg)]">
                    {t(`onb.template.${tpl.i18nKey}Name`)}
                  </span>
                  {/* Palette swatches */}
                  <span className="flex items-center gap-1">
                    {[tpl.palette.bg, tpl.palette.fg, tpl.palette.accent].map((c, i) => (
                      <span key={i} className="w-2.5 h-2.5 rounded-full border border-[var(--border)]" style={{ background: c }} />
                    ))}
                  </span>
                </div>
                <div className="font-sans text-xs text-[var(--fg-muted)] mt-0.5 leading-snug">
                  {t(`onb.template.${tpl.i18nKey}Desc`)}
                </div>
              </div>

              {active && <span className="shrink-0"><CheckIcon /></span>}
            </button>

            {/* CTA — revealed on the selected card */}
            <AnimatePresence initial={false}>
              {active && onUse && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <div className="px-3 pb-3">
                    <button
                      onClick={() => onUse(tpl.id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-yellow text-[#111] font-sans text-xs font-bold hover:bg-yellow/90 transition-colors"
                    >
                      {t("tplcat.use")}
                      <ArrowIcon />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/* ── Preview pane ───────────────────────────────────────────────────────
   Renders the REAL editor template component (same approach as the
   onboarding preview) — scaled, scrollable, locale-aware — with a full
   device preview modal and the primary CTA underneath. */
export function TemplateCatalogPreview({
  template,
  slug,
  onUse,
}: {
  template: CatalogTemplate;
  /** Slug shown in the preview's browser bar (portapic.com/p/{slug}). */
  slug?: string;
  onUse?: (id: TemplateId) => void;
}) {
  const { t, locale } = useT();
  const [fullOpen, setFullOpen] = useState(false);
  const url = `${template.demoUrl}?lang=${locale}`;
  const name = t(`onb.template.${template.i18nKey}Name`);

  // Same design the created portfolio will get: registry defaults plus
  // Spanish demo copy when the locale is Spanish.
  const tpl = EDITOR_TEMPLATES[template.id];
  const emptyIdentity: Identity = { first: "", last: "", location: "", bio: "" };
  const nodes = locale === "es"
    ? template.id === "minimal-bw" ? buildMinimalNodes(locale, emptyIdentity)
    : template.id === "atelier"    ? buildAtelierNodes(locale, emptyIdentity)
    : template.id === "halcyon"    ? buildHalcyonNodes(locale, emptyIdentity)
    : undefined
    : undefined;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-sans font-bold text-[var(--fg)] text-lg">{t("tplcat.previewTitle")}</h2>
          <p className="font-sans text-sm text-[var(--fg-muted)] mt-0.5">{t("tplcat.showing", { template: name })}</p>
        </div>
        <button
          onClick={() => setFullOpen(true)}
          className="flex items-center gap-1.5 font-sans text-xs font-medium px-3 py-1.5 rounded-lg border border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors"
        >
          <EyeIcon />
          {t("tplcat.fullPreview")}
        </button>
      </div>

      <div className="overflow-hidden border border-[var(--border)] rounded-lg h-[420px] lg:h-[560px]">
        <LiveTemplatePreview
          templateId={template.id}
          palette={tpl?.defaultPalette ?? { bg: "#fafafa", fg: "#0a0a0a", accent: "#0a0a0a", muted: "#6b7280" }}
          typography={tpl?.defaultTypography ?? DEFAULT_TYPOGRAPHY}
          nodes={nodes}
          slug={slug ?? ""}
          scrollable
        />
      </div>

      {onUse && (
        <button
          onClick={() => onUse(template.id)}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-yellow text-[#111] font-sans text-sm font-bold hover:bg-yellow/90 transition-colors"
        >
          {t("tplcat.use")}
          <ArrowIcon />
        </button>
      )}

      <AnimatePresence>
        {fullOpen && (
          <DevicePreviewModal url={url} title={name} subtitle={t("tplcat.showing", { template: name })} onClose={() => setFullOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
