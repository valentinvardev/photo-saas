"use client";

import { useCart } from "~/lib/cart";

/* ── Icons ─────────────────────────────────────────────────── */
function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
    </svg>
  );
}
function DomainIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
    </svg>
  );
}
function TemplateIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
    </svg>
  );
}
function CartEmptyIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.99-1.78L23 6H6"/>
    </svg>
  );
}

/* ── Cart panel ─────────────────────────────────────────────── */

export function CartPanel() {
  const { items, open, setOpen, removeItem, clearCart } = useCart();

  const totalCents = items.reduce((sum, i) => sum + i.price, 0);
  const totalStr   = totalCents === 0 ? "Free" : `$${(totalCents / 100).toFixed(2)}`;
  const hasPaid    = items.some((i) => i.price > 0);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
        onClick={() => setOpen(false)}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 bottom-0 z-50 w-80 flex flex-col bg-[var(--bg-card)] border-l border-[var(--border)] shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] shrink-0">
          <div>
            <h2 className="font-sans font-bold text-[var(--fg)] text-sm">Cart</h2>
            <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5">
              {items.length} item{items.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
              <span className="text-[var(--fg-muted)] opacity-30"><CartEmptyIcon /></span>
              <p className="font-sans text-xs text-[var(--fg-muted)]">Your cart is empty.</p>
              <p className="font-sans text-xs text-[var(--fg-muted)] opacity-60">Add a domain or template to get started.</p>
            </div>
          ) : (
            <div className="px-4 py-2 flex flex-col gap-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)]">
                  {/* Type icon */}
                  <div className={`shrink-0 mt-0.5 w-7 h-7 rounded-md flex items-center justify-center ${
                    item.type === "domain" ? "bg-blue-500/10 text-blue-500" : "bg-yellow/10 text-yellow"
                  }`}>
                    {item.type === "domain" ? <DomainIcon /> : <TemplateIcon />}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--fg-muted)]">
                        {item.type}
                      </span>
                    </div>
                    <p className="font-sans text-xs font-semibold text-[var(--fg)] truncate mt-0.5">{item.name}</p>
                    <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5">{item.detail}</p>
                  </div>

                  {/* Price + remove */}
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <span className="font-mono text-xs font-bold text-[var(--fg)]">
                      {item.price === 0 ? "Free" : `$${(item.price / 100).toFixed(2)}`}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[var(--fg-muted)] hover:text-red-500 transition-colors"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="shrink-0 border-t border-[var(--border)] p-5 flex flex-col gap-3">
            {/* Total row */}
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs text-[var(--fg-muted)]">Total</span>
              <span className="font-mono text-sm font-bold text-[var(--fg)]">{totalStr}</span>
            </div>

            {hasPaid && (
              <p className="font-mono text-[9px] text-[var(--fg-muted)] leading-relaxed">
                Domain renewals billed annually. Templates are one-time purchases.
              </p>
            )}

            {/* Checkout */}
            <button
              className="w-full py-3 font-sans text-sm font-bold text-[#111] bg-yellow hover:bg-yellow/90 transition-colors rounded-lg"
              onClick={() => alert("Checkout — coming soon")}
            >
              {totalCents === 0 ? "Activate free items →" : "Proceed to checkout →"}
            </button>

            {/* Clear */}
            <button
              onClick={clearCart}
              className="w-full py-1.5 font-mono text-[9px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors uppercase tracking-wider text-center"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
