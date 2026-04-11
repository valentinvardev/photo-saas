"use client";

import { useState } from "react";

/* ── Reusable primitives ── */
function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--border)]">
        <h2 className="font-sans text-sm font-semibold text-[var(--fg)]">{title}</h2>
        {description && <p className="font-sans text-xs text-[var(--fg-muted)] mt-0.5">{description}</p>}
      </div>
      <div className="divide-y divide-[var(--border-subtle)]">{children}</div>
    </div>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4">
      <div className="min-w-0">
        <p className="font-sans text-sm font-medium text-[var(--fg)]">{label}</p>
        {hint && <p className="font-sans text-xs text-[var(--fg-muted)] mt-0.5">{hint}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn((p) => !p)}
      className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${on ? "bg-yellow" : "bg-[var(--border)]"}`}
      role="switch"
      aria-checked={on}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${on ? "translate-x-4" : "translate-x-0"}`}
      />
    </button>
  );
}

const inputCls =
  "font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 outline-none focus:border-yellow/60 focus:ring-1 focus:ring-yellow/20 transition placeholder:text-[var(--fg-muted)]";

/* ── Tabs ── */
const TABS = ["Account", "Notifications", "Privacy", "Billing", "Integrations"] as const;
type Tab = typeof TABS[number];

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("Account");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">

      {/* Tab bar */}
      <div className="flex gap-1 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl p-1 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shrink-0 px-3.5 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all ${
              tab === t
                ? "bg-[var(--bg-card)] text-[var(--fg)] shadow-sm border border-[var(--border)]"
                : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── ACCOUNT ── */}
      {tab === "Account" && (
        <>
          <Section title="Your identity" description="How you appear in the community chat and across the platform.">
            <div className="px-6 py-5 flex flex-col gap-4">
              {/* Avatar row */}
              <div className="flex items-center gap-4">
                <div className="relative group w-14 h-14 shrink-0">
                  <div className="w-14 h-14 rounded-full bg-yellow flex items-center justify-center ring-2 ring-[var(--border)]">
                    <span className="font-sans font-black text-[#111] text-xl">S</span>
                  </div>
                  <button className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" />
                    </svg>
                  </button>
                </div>
                <div>
                  <p className="font-sans text-sm font-medium text-[var(--fg)]">Profile photo</p>
                  <p className="font-sans text-xs text-[var(--fg-muted)] mt-0.5">JPG, PNG or WebP · max 4 MB</p>
                  <button className="mt-2 font-sans text-xs font-semibold bg-yellow text-[#111] px-3 py-1.5 rounded-lg hover:bg-yellow-dark transition-colors">
                    Upload photo
                  </button>
                </div>
              </div>

              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-sans text-xs font-semibold text-[var(--fg-secondary)] mb-1.5">First name</label>
                  <input className={`${inputCls} w-full`} defaultValue="Sofia" />
                </div>
                <div>
                  <label className="block font-sans text-xs font-semibold text-[var(--fg-secondary)] mb-1.5">Last name</label>
                  <input className={`${inputCls} w-full`} defaultValue="Chen" />
                </div>
              </div>

              <div>
                <label className="block font-sans text-xs font-semibold text-[var(--fg-secondary)] mb-1.5">Username</label>
                <div className="flex items-center gap-0">
                  <span className="font-mono text-sm text-[var(--fg-muted)] bg-[var(--bg-subtle)] border border-r-0 border-[var(--border)] px-3 py-2 rounded-l-lg select-none">@</span>
                  <input className={`${inputCls} w-full rounded-l-none`} defaultValue="sofia.chen" />
                </div>
                <p className="mt-1.5 font-sans text-[11px] text-[var(--fg-muted)]">Shown in the community chat and on your public portfolio URL.</p>
              </div>

              <div>
                <label className="block font-sans text-xs font-semibold text-[var(--fg-secondary)] mb-1.5">Bio</label>
                <textarea
                  className={`${inputCls} w-full resize-none`}
                  rows={2}
                  defaultValue="Documentary and portrait photographer based in New York."
                />
              </div>
            </div>
          </Section>

          <Section title="Email address">
            <div className="px-6 py-4 flex flex-col gap-3">
              <input className={`${inputCls} w-full`} defaultValue="sofia@example.com" type="email" />
              <button className="self-start font-sans text-xs font-semibold bg-yellow text-[#111] px-3 py-1.5 rounded-lg hover:bg-yellow-dark transition-colors">
                Update email
              </button>
            </div>
          </Section>

          <Section title="Password">
            <div className="px-6 py-5 flex flex-col gap-3">
              <input className={`${inputCls} w-full`} type="password" placeholder="Current password" />
              <input className={`${inputCls} w-full`} type="password" placeholder="New password" />
              <input className={`${inputCls} w-full`} type="password" placeholder="Confirm new password" />
              <button className="self-start font-sans text-xs font-semibold bg-yellow text-[#111] px-3 py-1.5 rounded-lg hover:bg-yellow-dark transition-colors">
                Change password
              </button>
            </div>
          </Section>

          <Section title="Language & region">
            <div className="px-6 py-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block font-sans text-xs font-semibold text-[var(--fg-secondary)] mb-1.5">Language</label>
                <select className={`${inputCls} w-full`} defaultValue="en">
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="de">Deutsch</option>
                  <option value="fr">Français</option>
                </select>
              </div>
              <div>
                <label className="block font-sans text-xs font-semibold text-[var(--fg-secondary)] mb-1.5">Timezone</label>
                <select className={`${inputCls} w-full`} defaultValue="America/New_York">
                  <option value="America/New_York">New York (UTC-5)</option>
                  <option value="America/Los_Angeles">Los Angeles (UTC-8)</option>
                  <option value="Europe/London">London (UTC+0)</option>
                  <option value="Europe/Berlin">Berlin (UTC+1)</option>
                  <option value="Asia/Tokyo">Tokyo (UTC+9)</option>
                </select>
              </div>
            </div>
          </Section>

          <Section title="Danger zone" description="These actions are permanent and cannot be undone.">
            <Row label="Export my data" hint="Download all your photos, settings and analytics as a ZIP.">
              <button className="font-sans text-xs font-semibold text-[var(--fg-muted)] border border-[var(--border)] px-3 py-1.5 rounded-lg hover:text-[var(--fg)] transition-colors">
                Export
              </button>
            </Row>
            <Row label="Delete account" hint="Permanently delete your account and all associated data.">
              <button className="font-sans text-xs font-semibold text-red-500 border border-red-500/30 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
                Delete account
              </button>
            </Row>
          </Section>
        </>
      )}

      {/* ── NOTIFICATIONS ── */}
      {tab === "Notifications" && (
        <>
          <Section title="Email notifications">
            <Row label="New sale" hint="When a client purchases a license or print.">
              <Toggle defaultOn />
            </Row>
            <Row label="Portfolio viewed" hint="When someone visits your public portfolio.">
              <Toggle />
            </Row>
            <Row label="Export ready" hint="When a bulk export finishes processing.">
              <Toggle defaultOn />
            </Row>
            <Row label="New review" hint="When a client leaves a review.">
              <Toggle defaultOn />
            </Row>
            <Row label="Storage warnings" hint="At 80% and 95% usage.">
              <Toggle defaultOn />
            </Row>
            <Row label="Product updates" hint="New features and announcements.">
              <Toggle />
            </Row>
          </Section>

          <Section title="In-app notifications">
            <Row label="Sales & payments">
              <Toggle defaultOn />
            </Row>
            <Row label="Portfolio activity">
              <Toggle defaultOn />
            </Row>
            <Row label="System alerts">
              <Toggle defaultOn />
            </Row>
          </Section>
        </>
      )}

      {/* ── PRIVACY ── */}
      {tab === "Privacy" && (
        <>
          <Section title="Portfolio visibility">
            <Row label="Public portfolio" hint="Allow anyone to find and view your portfolio.">
              <Toggle defaultOn />
            </Row>
            <Row label="Search engine indexing" hint="Let Google and Bing index your public portfolio.">
              <Toggle defaultOn />
            </Row>
            <Row label="Show location" hint="Display your city on your public profile.">
              <Toggle defaultOn />
            </Row>
            <Row label="Show availability status" hint="Let clients know you're open for commissions.">
              <Toggle defaultOn />
            </Row>
          </Section>

          <Section title="Analytics & tracking">
            <Row label="Portfolio analytics" hint="Track views, clicks, and engagement on your pages.">
              <Toggle defaultOn />
            </Row>
            <Row label="Share anonymous usage data" hint="Help us improve FRAME with anonymised data.">
              <Toggle />
            </Row>
          </Section>

          <Section title="Download & watermark">
            <Row label="Watermark preview images" hint="Add a subtle FRAME watermark to public previews.">
              <Toggle />
            </Row>
            <Row label="Disable right-click download" hint="Prevent right-click save on portfolio images.">
              <Toggle defaultOn />
            </Row>
          </Section>
        </>
      )}

      {/* ── BILLING ── */}
      {tab === "Billing" && (
        <>
          <Section title="Current plan">
            <div className="px-6 py-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-sans text-sm font-semibold text-[var(--fg)]">Pro plan</span>
                  <span className="inline-flex items-center gap-1 bg-yellow/10 border border-yellow/30 rounded-full px-2 py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow" />
                    <span className="font-mono text-[9px] text-yellow font-bold uppercase tracking-wider">Active</span>
                  </span>
                </div>
                <p className="font-sans text-xs text-[var(--fg-muted)] mt-1">$12 / month · Next billing June 1, 2026</p>
              </div>
              <div className="flex gap-2">
                <button className="font-sans text-xs font-semibold text-[var(--fg-muted)] border border-[var(--border)] px-3 py-1.5 rounded-lg hover:text-[var(--fg)] transition-colors">
                  Cancel
                </button>
                <button className="font-sans text-xs font-semibold bg-yellow text-[#111] px-3 py-1.5 rounded-lg hover:bg-yellow-dark transition-colors">
                  Upgrade
                </button>
              </div>
            </div>
          </Section>

          <Section title="Balance & withdrawals">
            <div className="px-6 py-5 flex items-center justify-between">
              <div>
                <div className="font-mono text-2xl font-semibold text-[var(--fg)]">$124.50</div>
                <p className="font-sans text-xs text-[var(--fg-muted)] mt-0.5">Available to withdraw</p>
              </div>
              <button className="font-sans text-xs font-semibold bg-yellow text-[#111] px-4 py-2 rounded-lg hover:bg-yellow-dark transition-colors">
                Withdraw funds
              </button>
            </div>
          </Section>

          <Section title="Payment method">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 bg-[var(--bg-subtle)] border border-[var(--border)] rounded flex items-center justify-center">
                  <span className="font-mono text-[9px] font-bold text-[var(--fg-muted)]">VISA</span>
                </div>
                <div>
                  <p className="font-sans text-sm text-[var(--fg)]">•••• •••• •••• 4242</p>
                  <p className="font-sans text-xs text-[var(--fg-muted)]">Expires 08 / 27</p>
                </div>
              </div>
              <button className="font-sans text-xs font-semibold text-[var(--fg-muted)] border border-[var(--border)] px-3 py-1.5 rounded-lg hover:text-[var(--fg)] transition-colors">
                Change
              </button>
            </div>
          </Section>

          <Section title="Billing history">
            {[
              { date: "May 1, 2026",  amount: "$12.00", status: "Paid",    desc: "Pro plan — monthly" },
              { date: "Apr 1, 2026",  amount: "$12.00", status: "Paid",    desc: "Pro plan — monthly" },
              { date: "Mar 1, 2026",  amount: "$12.00", status: "Paid",    desc: "Pro plan — monthly" },
              { date: "Feb 1, 2026",  amount: "$12.00", status: "Paid",    desc: "Pro plan — monthly" },
            ].map((inv) => (
              <div key={inv.date} className="flex items-center justify-between px-6 py-3">
                <div>
                  <p className="font-sans text-sm text-[var(--fg)]">{inv.desc}</p>
                  <p className="font-mono text-xs text-[var(--fg-muted)]">{inv.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-semibold text-[var(--fg)]">{inv.amount}</span>
                  <span className="font-sans text-[10px] bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-0.5 rounded-full">
                    {inv.status}
                  </span>
                  <button className="text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </Section>
        </>
      )}

      {/* ── INTEGRATIONS ── */}
      {tab === "Integrations" && (
        <Section title="Connected apps">
          {[
            { name: "Google Drive",   icon: "🗂️", desc: "Sync and backup photos automatically.",  connected: true  },
            { name: "Lightroom",      icon: "🌅", desc: "Import edited photos directly from LR.",  connected: true  },
            { name: "Instagram",      icon: "📸", desc: "Cross-post portfolio images.",             connected: false },
            { name: "Stripe",         icon: "💳", desc: "Process payments and withdrawals.",        connected: true  },
            { name: "Dropbox",        icon: "📦", desc: "Alternative cloud backup.",                connected: false },
            { name: "Mailchimp",      icon: "📧", desc: "Email marketing for client newsletters.", connected: false },
          ].map((app) => (
            <Row key={app.name} label={app.name} hint={app.desc}>
              <div className="flex items-center gap-3">
                {app.connected && (
                  <span className="font-sans text-[10px] text-green-500 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                    Connected
                  </span>
                )}
                <button
                  className={`font-sans text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                    app.connected
                      ? "text-red-500 border-red-500/20 hover:bg-red-500/10"
                      : "text-[var(--fg-muted)] border-[var(--border)] hover:text-[var(--fg)]"
                  }`}
                >
                  {app.connected ? "Disconnect" : "Connect"}
                </button>
              </div>
            </Row>
          ))}
        </Section>
      )}

      {/* Save row — not shown on Billing or Integrations */}
      {tab !== "Billing" && tab !== "Integrations" && (
        <div className="flex justify-end gap-3">
          <button className="font-sans text-sm text-[var(--fg-muted)] border border-[var(--border)] px-4 py-2 rounded-lg hover:text-[var(--fg)] transition-colors">
            Discard
          </button>
          <button
            onClick={handleSave}
            className={`font-sans text-sm font-semibold px-5 py-2 rounded-lg transition-all ${
              saved
                ? "bg-green-500 text-white"
                : "bg-yellow text-[#111] hover:bg-yellow-dark"
            }`}
          >
            {saved ? "Saved ✓" : "Save changes"}
          </button>
        </div>
      )}

    </div>
  );
}
