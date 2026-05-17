"use client";

import { useState } from "react";
import { Toggle } from "~/components/ui/Toggle";

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
            <Row label="Share anonymous usage data" hint="Help us improve Portapic with anonymised data.">
              <Toggle />
            </Row>
          </Section>

          <Section title="Download & watermark">
            <Row label="Watermark preview images" hint="Add a subtle Portapic watermark to public previews.">
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
        <>
          {/* MercadoPago — featured payment connect */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <h2 className="font-sans text-sm font-semibold text-[var(--fg)]">MercadoPago</h2>
                <p className="font-sans text-xs text-[var(--fg-muted)] mt-0.5">Accept payments in Latin America — cards, wallets, Pix and more.</p>
              </div>
              {/* MP official logo (Simple Icons brand mark) */}
              <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#009ee3]/10 border border-[#009ee3]/20">
                <svg role="img" viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg" fill="#009ee3">
                  <path d="M11.115 16.479a.93.927 0 0 1-.939-.886c-.002-.042-.006-.155-.103-.155-.04 0-.074.023-.113.059-.112.103-.254.206-.46.206a.816.814 0 0 1-.305-.066c-.535-.214-.542-.578-.521-.725.006-.038.007-.08-.02-.11l-.032-.03h-.034c-.027 0-.055.012-.093.039a.788.786 0 0 1-.454.16.7.699 0 0 1-.253-.05c-.708-.27-.65-.928-.617-1.126.005-.041-.005-.072-.03-.092l-.05-.04-.047.043a.728.726 0 0 1-.505.203.73.728 0 0 1-.732-.725c0-.4.328-.722.732-.722.364 0 .675.27.721.63l.026.195.11-.165c.01-.018.307-.46.852-.46.102 0 .21.016.316.05.434.13.508.52.519.68.008.094.075.1.09.1.037 0 .064-.024.083-.045a.746.744 0 0 1 .54-.225c.128 0 .263.03.402.09.69.293.379 1.158.374 1.167-.058.144-.061.207-.005.244l.027.013h.02c.03 0 .07-.014.134-.035.093-.032.235-.08.367-.08a.944.942 0 0 1 .94.93.936.934 0 0 1-.94.928zm7.302-4.171c-1.138-.98-3.768-3.24-4.481-3.77-.406-.302-.685-.462-.928-.533a1.559 1.554 0 0 0-.456-.07c-.182 0-.376.032-.58.095-.46.145-.918.505-1.362.854l-.023.018c-.414.324-.84.66-1.164.73a1.986 1.98 0 0 1-.43.049c-.362 0-.687-.104-.81-.258-.02-.025-.007-.066.04-.125l.008-.008 1-1.067c.783-.774 1.525-1.506 3.23-1.545h.085c1.062 0 2.12.469 2.24.524a7.03 7.03 0 0 0 3.056.724c1.076 0 2.188-.263 3.354-.795a9.135 9.11 0 0 0-.405-.317c-1.025.44-2.003.66-2.946.66-.962 0-1.925-.229-2.858-.68-.05-.022-1.22-.567-2.44-.57-.032 0-.065 0-.096.002-1.434.033-2.24.536-2.782.976-.528.013-.982.138-1.388.25-.361.1-.673.186-.979.185-.125 0-.35-.01-.37-.012-.35-.01-2.115-.437-3.518-.962-.143.1-.28.203-.415.31 1.466.593 3.25 1.053 3.812 1.089.157.01.323.027.491.027.372 0 .744-.103 1.104-.203.213-.059.446-.123.692-.17l-.196.194-1.017 1.087c-.08.08-.254.294-.14.557a.705.703 0 0 0 .268.292c.243.162.677.27 1.08.271.152 0 .297-.015.43-.044.427-.095.874-.448 1.349-.82.377-.296.913-.672 1.323-.782a1.494 1.49 0 0 1 .37-.05.611.61 0 0 1 .095.005c.27.034.533.125 1.003.472.835.62 4.531 3.815 4.566 3.846.002.002.238.203.22.537-.007.186-.11.352-.294.466a.902.9 0 0 1-.484.15.804.802 0 0 1-.428-.124c-.014-.01-1.28-1.157-1.746-1.543-.074-.06-.146-.115-.22-.115a.122.122 0 0 0-.096.045c-.073.09.01.212.105.294l1.48 1.47c.002 0 .184.17.204.395.012.244-.106.447-.35.606a.957.955 0 0 1-.526.171.766.764 0 0 1-.42-.127l-.214-.206a21.035 20.978 0 0 0-1.08-1.009c-.072-.058-.148-.112-.221-.112a.127.127 0 0 0-.094.038c-.033.037-.056.103.028.212a.698.696 0 0 0 .075.083l1.078 1.198c.01.01.222.26.024.511l-.038.048a1.18 1.178 0 0 1-.1.096c-.184.15-.43.164-.527.164a.8.798 0 0 1-.147-.012c-.106-.018-.178-.048-.212-.089l-.013-.013c-.06-.06-.602-.609-1.054-.98-.059-.05-.133-.11-.21-.11a.128.128 0 0 0-.096.042c-.09.096.044.24.1.293l.92 1.003a.204.204 0 0 1-.033.062c-.033.044-.144.155-.479.196a.91.907 0 0 1-.122.007c-.345 0-.712-.164-.902-.264a1.343 1.34 0 0 0 .13-.576 1.368 1.365 0 0 0-1.42-1.357c.024-.342-.025-.99-.697-1.274a1.455 1.452 0 0 0-.575-.125c-.146 0-.287.025-.42.075a1.153 1.15 0 0 0-.671-.564 1.52 1.515 0 0 0-.494-.085c-.28 0-.537.08-.767.242a1.168 1.165 0 0 0-.903-.43 1.173 1.17 0 0 0-.82.335c-.287-.217-1.425-.93-4.467-1.613a17.39 17.344 0 0 1-.692-.189 4.822 4.82 0 0 0-.077.494l.67.157c3.108.682 4.136 1.391 4.309 1.525a1.145 1.142 0 0 0-.09.442 1.16 1.158 0 0 0 1.378 1.132c.096.467.406.821.879 1.003a1.165 1.162 0 0 0 .415.08c.09 0 .179-.012.266-.034.086.22.282.493.722.668a1.233 1.23 0 0 0 .457.094c.122 0 .241-.022.355-.063a1.373 1.37 0 0 0 1.269.841c.37.002.726-.147.985-.41.221.121.688.341 1.163.341.06 0 .118-.002.175-.01.47-.059.689-.24.789-.382a.571.57 0 0 0 .048-.078c.11.032.234.058.373.058.255 0 .501-.086.75-.265.244-.174.418-.424.444-.637v-.01c.083.017.167.026.251.026.265 0 .527-.082.773-.242.48-.31.562-.715.554-.98a1.28 1.279 0 0 0 .978-.194 1.04 1.04 0 0 0 .502-.808 1.088 1.085 0 0 0-.16-.653c.804-.342 2.636-1.003 4.795-1.483a4.734 4.721 0 0 0-.067-.492 27.742 27.667 0 0 0-5.049 1.62zm5.123-.763c0 4.027-5.166 7.293-11.537 7.293-6.372 0-11.538-3.266-11.538-7.293 0-4.028 5.165-7.293 11.539-7.293 6.371 0 11.537 3.265 11.537 7.293zm.46.004c0-4.272-5.374-7.755-12-7.755S.002 7.277.002 11.55L0 12.004c0 4.533 4.695 8.203 11.999 8.203 7.347 0 12-3.67 12-8.204z"/>
                </svg>
                <span className="font-sans font-bold text-[11px] text-[#009ee3]">MercadoPago</span>
              </div>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Cards", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
                  { label: "Pix",   icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg> },
                  { label: "Wallet",icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 3h-8l-4 4h16l-4-4z"/><circle cx="17" cy="13" r="1"/></svg> },
                ].map((f) => (
                  <div key={f.label} className="flex flex-col items-center gap-1.5 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg py-3 text-[var(--fg-muted)]">
                    {f.icon}
                    <span className="font-sans text-[11px]">{f.label}</span>
                  </div>
                ))}
              </div>
              <button className="w-full font-sans text-sm font-semibold py-2.5 rounded-xl transition-all bg-[#009ee3] hover:bg-[#0088cc] text-white flex items-center justify-center gap-2">
                <svg role="img" viewBox="0 0 24 24" width="16" height="16" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.115 16.479a.93.927 0 0 1-.939-.886c-.002-.042-.006-.155-.103-.155-.04 0-.074.023-.113.059-.112.103-.254.206-.46.206a.816.814 0 0 1-.305-.066c-.535-.214-.542-.578-.521-.725.006-.038.007-.08-.02-.11l-.032-.03h-.034c-.027 0-.055.012-.093.039a.788.786 0 0 1-.454.16.7.699 0 0 1-.253-.05c-.708-.27-.65-.928-.617-1.126.005-.041-.005-.072-.03-.092l-.05-.04-.047.043a.728.726 0 0 1-.505.203.73.728 0 0 1-.732-.725c0-.4.328-.722.732-.722.364 0 .675.27.721.63l.026.195.11-.165c.01-.018.307-.46.852-.46.102 0 .21.016.316.05.434.13.508.52.519.68.008.094.075.1.09.1.037 0 .064-.024.083-.045a.746.744 0 0 1 .54-.225c.128 0 .263.03.402.09.69.293.379 1.158.374 1.167-.058.144-.061.207-.005.244l.027.013h.02c.03 0 .07-.014.134-.035.093-.032.235-.08.367-.08a.944.942 0 0 1 .94.93.936.934 0 0 1-.94.928zm7.302-4.171c-1.138-.98-3.768-3.24-4.481-3.77-.406-.302-.685-.462-.928-.533a1.559 1.554 0 0 0-.456-.07c-.182 0-.376.032-.58.095-.46.145-.918.505-1.362.854l-.023.018c-.414.324-.84.66-1.164.73a1.986 1.98 0 0 1-.43.049c-.362 0-.687-.104-.81-.258-.02-.025-.007-.066.04-.125l.008-.008 1-1.067c.783-.774 1.525-1.506 3.23-1.545h.085c1.062 0 2.12.469 2.24.524a7.03 7.03 0 0 0 3.056.724c1.076 0 2.188-.263 3.354-.795a9.135 9.11 0 0 0-.405-.317c-1.025.44-2.003.66-2.946.66-.962 0-1.925-.229-2.858-.68-.05-.022-1.22-.567-2.44-.57-.032 0-.065 0-.096.002-1.434.033-2.24.536-2.782.976-.528.013-.982.138-1.388.25-.361.1-.673.186-.979.185-.125 0-.35-.01-.37-.012-.35-.01-2.115-.437-3.518-.962-.143.1-.28.203-.415.31 1.466.593 3.25 1.053 3.812 1.089.157.01.323.027.491.027.372 0 .744-.103 1.104-.203.213-.059.446-.123.692-.17l-.196.194-1.017 1.087c-.08.08-.254.294-.14.557a.705.703 0 0 0 .268.292c.243.162.677.27 1.08.271.152 0 .297-.015.43-.044.427-.095.874-.448 1.349-.82.377-.296.913-.672 1.323-.782a1.494 1.49 0 0 1 .37-.05.611.61 0 0 1 .095.005c.27.034.533.125 1.003.472.835.62 4.531 3.815 4.566 3.846.002.002.238.203.22.537-.007.186-.11.352-.294.466a.902.9 0 0 1-.484.15.804.802 0 0 1-.428-.124c-.014-.01-1.28-1.157-1.746-1.543-.074-.06-.146-.115-.22-.115a.122.122 0 0 0-.096.045c-.073.09.01.212.105.294l1.48 1.47c.002 0 .184.17.204.395.012.244-.106.447-.35.606a.957.955 0 0 1-.526.171.766.764 0 0 1-.42-.127l-.214-.206a21.035 20.978 0 0 0-1.08-1.009c-.072-.058-.148-.112-.221-.112a.127.127 0 0 0-.094.038c-.033.037-.056.103.028.212a.698.696 0 0 0 .075.083l1.078 1.198c.01.01.222.26.024.511l-.038.048a1.18 1.178 0 0 1-.1.096c-.184.15-.43.164-.527.164a.8.798 0 0 1-.147-.012c-.106-.018-.178-.048-.212-.089l-.013-.013c-.06-.06-.602-.609-1.054-.98-.059-.05-.133-.11-.21-.11a.128.128 0 0 0-.096.042c-.09.096.044.24.1.293l.92 1.003a.204.204 0 0 1-.033.062c-.033.044-.144.155-.479.196a.91.907 0 0 1-.122.007c-.345 0-.712-.164-.902-.264a1.343 1.34 0 0 0 .13-.576 1.368 1.365 0 0 0-1.42-1.357c.024-.342-.025-.99-.697-1.274a1.455 1.452 0 0 0-.575-.125c-.146 0-.287.025-.42.075a1.153 1.15 0 0 0-.671-.564 1.52 1.515 0 0 0-.494-.085c-.28 0-.537.08-.767.242a1.168 1.165 0 0 0-.903-.43 1.173 1.17 0 0 0-.82.335c-.287-.217-1.425-.93-4.467-1.613a17.39 17.344 0 0 1-.692-.189 4.822 4.82 0 0 0-.077.494l.67.157c3.108.682 4.136 1.391 4.309 1.525a1.145 1.142 0 0 0-.09.442 1.16 1.158 0 0 0 1.378 1.132c.096.467.406.821.879 1.003a1.165 1.162 0 0 0 .415.08c.09 0 .179-.012.266-.034.086.22.282.493.722.668a1.233 1.23 0 0 0 .457.094c.122 0 .241-.022.355-.063a1.373 1.37 0 0 0 1.269.841c.37.002.726-.147.985-.41.221.121.688.341 1.163.341.06 0 .118-.002.175-.01.47-.059.689-.24.789-.382a.571.57 0 0 0 .048-.078c.11.032.234.058.373.058.255 0 .501-.086.75-.265.244-.174.418-.424.444-.637v-.01c.083.017.167.026.251.026.265 0 .527-.082.773-.242.48-.31.562-.715.554-.98a1.28 1.279 0 0 0 .978-.194 1.04 1.04 0 0 0 .502-.808 1.088 1.085 0 0 0-.16-.653c.804-.342 2.636-1.003 4.795-1.483a4.734 4.721 0 0 0-.067-.492 27.742 27.667 0 0 0-5.049 1.62zm5.123-.763c0 4.027-5.166 7.293-11.537 7.293-6.372 0-11.538-3.266-11.538-7.293 0-4.028 5.165-7.293 11.539-7.293 6.371 0 11.537 3.265 11.537 7.293zm.46.004c0-4.272-5.374-7.755-12-7.755S.002 7.277.002 11.55L0 12.004c0 4.533 4.695 8.203 11.999 8.203 7.347 0 12-3.67 12-8.204z"/>
                </svg>
                Connect MercadoPago
              </button>
              <p className="font-sans text-[11px] text-[var(--fg-muted)] text-center">
                You'll be redirected to MercadoPago to authorize the connection. No card details are stored on Portapic.
              </p>
            </div>
          </div>

          <Section title="Connected apps">
            {[
              { name: "Google Drive", desc: "Sync and backup photos automatically.",  connected: true  },
              { name: "Lightroom",    desc: "Import edited photos directly from LR.",  connected: true  },
              { name: "Instagram",    desc: "Cross-post portfolio images.",             connected: false },
              { name: "Stripe",       desc: "Process payments and withdrawals.",        connected: true  },
              { name: "Dropbox",      desc: "Alternative cloud backup.",                connected: false },
              { name: "Mailchimp",    desc: "Email marketing for client newsletters.", connected: false },
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
        </>
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
