/* Halcyon — design tokens, fonts, motion, and seed content. */

export interface HalcyonTokens {
  accent: string;
  bg:     string;
  raised: string;
  fg:     string;
  muted:  string;
  line:   string;
}

export const HL_TOKENS: HalcyonTokens = {
  accent: "#C2410C",     // burnt sienna
  bg:     "#0E0D0B",     // warm near-black
  raised: "#1A1815",
  fg:     "#EFEAE0",     // warm bone
  muted:  "#8A8378",
  line:   "#2C2925",
};

/* These reference CSS variables set in layout.tsx via next/font.
   Each --hl-* var resolves to the loaded Google Font. */
export const HL_FONTS = {
  serif: "var(--hl-serif), 'Instrument Serif', 'Cormorant Garamond', Georgia, serif",
  sans:  "var(--hl-sans), 'Geist', 'Söhne', 'Helvetica Neue', system-ui, sans-serif",
  mono:  "var(--hl-mono), 'Geist Mono', 'JetBrains Mono', ui-monospace, monospace",
};

export const HL_EASE = {
  curtain: [0.76, 0, 0.24, 1] as const,
  reveal:  [0.22, 1, 0.36, 1] as const,
};

/* ── Photo seeds (Unsplash featured) ── */

export interface HlPhoto { id: string; src: string; title: string; date: string }

export const HL_PHOTOS: Record<string, HlPhoto[]> = {
  portraits: [
    { id: "p1", src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=70", title: "Linnea, after rain", date: "2024" },
    { id: "p2", src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=70", title: "A study in light",  date: "2024" },
    { id: "p3", src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&q=70", title: "Window seat",       date: "2023" },
    { id: "p4", src: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=1200&q=70", title: "Mirror, mirror",    date: "2024" },
    { id: "p5", src: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=1200&q=70", title: "Outside the gallery", date: "2023" },
  ],
  land: [
    { id: "l1", src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=70", title: "Faro, dusk",   date: "2024" },
    { id: "l2", src: "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=1600&q=70", title: "Slow water",   date: "2023" },
    { id: "l3", src: "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=1600&q=70", title: "Threshold",    date: "2024" },
    { id: "l4", src: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1600&q=70", title: "A field, plain", date: "2023" },
  ],
  wedding: [
    { id: "w1",  src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=70", title: "Vows",            date: "2024" },
    { id: "w2",  src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1400&q=70", title: "First look",      date: "2024" },
    { id: "w3",  src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1400&q=70", title: "Reception, late", date: "2024" },
    { id: "w4",  src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1400&q=70", title: "Hands",           date: "2024" },
    { id: "w5",  src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1400&q=70", title: "The aisle",       date: "2024" },
    { id: "w6",  src: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=1400&q=70", title: "Confetti",        date: "2024" },
    { id: "w7",  src: "https://images.unsplash.com/photo-1525258946800-98cfd641d0de?w=1400&q=70", title: "Toast",           date: "2024" },
    { id: "w8",  src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1400&q=70", title: "Quiet moment",    date: "2024" },
    { id: "w9",  src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1400&q=70", title: "Bouquet",         date: "2024" },
    { id: "w10", src: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1400&q=70", title: "Last dance",      date: "2024" },
  ],
  arch: [
    { id: "a1", src: "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=1400&q=70", title: "Stair",      date: "2024" },
    { id: "a2", src: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1400&q=70", title: "Sala grande", date: "2023" },
    { id: "a3", src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=70", title: "White room",  date: "2023" },
    { id: "a4", src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1400&q=70", title: "Concrete",    date: "2024" },
  ],
  still: [
    { id: "s1", src: "https://images.unsplash.com/photo-1485963631004-f2f00b1d6606?w=1200&q=70", title: "Persimmons",      date: "2024" },
    { id: "s2", src: "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=1200&q=70", title: "Linen",           date: "2024" },
    { id: "s3", src: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=70", title: "Market, morning", date: "2023" },
  ],
};

/* ── Portfolio content ── */

export interface HlProject {
  id:     string;
  no:     string;
  title:  string;
  year:   string;
  tags:   string[];
  cover:  string;
  photos: HlPhoto[];
}

export const HL_PORTFOLIO = {
  brand: {
    name:    "Halcyon",
    mark:    "HL",
    tagline: "Photography by Lior Avni — Lisbon · New York",
    bio:
      "Lior Avni makes photographs that feel like memory — patient, slightly out of reach. Trained at the Royal Academy of Art, The Hague; working between Lisbon and New York since 2018. Editorial work for The Gentlewoman, Apartamento, Cereal. Private commissions for families, couples, and brands who want pictures to live with, not scroll past.",
    stats: [
      { label: "Years",      value: "12"  },
      { label: "Stories",    value: "184" },
      { label: "Cities",     value: "27"  },
      { label: "Print runs", value: "6"   },
    ],
  },
  social: { instagram: "@lior.avni", email: "studio@halcyon.photo" },
  projects: [
    { id: "cv01", no: "01", title: "Quiet Hours",       year: "2024",    tags: ["portrait", "editorial"],     cover: HL_PHOTOS.portraits![0]!.src, photos: HL_PHOTOS.portraits! },
    { id: "cv02", no: "02", title: "A Slow Country",    year: "2023–24", tags: ["landscape", "travel"],       cover: HL_PHOTOS.land![0]!.src,      photos: HL_PHOTOS.land!      },
    { id: "cv03", no: "03", title: "Held, Briefly",     year: "2024",    tags: ["wedding", "private"],        cover: HL_PHOTOS.wedding![0]!.src,   photos: HL_PHOTOS.wedding!.slice(0, 5) },
    { id: "cv04", no: "04", title: "Rooms Without Us",  year: "2023",    tags: ["architecture", "interior"],  cover: HL_PHOTOS.arch![0]!.src,      photos: HL_PHOTOS.arch!      },
    { id: "cv05", no: "05", title: "Things on Tables",  year: "2024",    tags: ["still life"],                cover: HL_PHOTOS.still![0]!.src,     photos: HL_PHOTOS.still!     },
  ] satisfies HlProject[],
};

/* ── Delivery seed (one event) ── */

export interface HlSection { id: string; no: string; label: string; note: string; photos: HlPhoto[] }

export const HL_DELIVERY = {
  client:        "Margot & Auden",
  title:         "Margot & Auden",
  eventDate:     "14 September 2024",
  eventLocation: "Quinta da Bichinha · Alenquer, PT",
  photographer:  "Lior Avni · Halcyon",
  password:      "lisbon",
  expiryDays:    60,
  total:         184,
  sections: [
    {
      id: "ceremony", no: "01", label: "Ceremony",
      note: "A chapel of olive trees. Late afternoon light, vows in two languages, and one perfect breeze.",
      photos: [HL_PHOTOS.wedding![0]!, HL_PHOTOS.wedding![3]!, HL_PHOTOS.wedding![4]!, HL_PHOTOS.wedding![1]!, HL_PHOTOS.wedding![7]!, HL_PHOTOS.wedding![8]!],
    },
    {
      id: "portraits", no: "02", label: "Portraits",
      note: "Twenty quiet minutes between the ceremony and the first toast — the only time the day stood still.",
      photos: [HL_PHOTOS.portraits![1]!, HL_PHOTOS.portraits![2]!, HL_PHOTOS.portraits![3]!, HL_PHOTOS.portraits![4]!, HL_PHOTOS.portraits![0]!],
    },
    {
      id: "reception", no: "03", label: "Reception",
      note: "Long table under fig trees, then dancing until the generators gave up at 02:14.",
      photos: [HL_PHOTOS.wedding![2]!, HL_PHOTOS.wedding![5]!, HL_PHOTOS.wedding![6]!, HL_PHOTOS.wedding![9]!, HL_PHOTOS.still![1]!, HL_PHOTOS.still![2]!],
    },
  ] satisfies HlSection[],
};

/* ── Base CSS for Halcyon pages ─────────────────────────────── */
export function hlBaseCss(t: HalcyonTokens) {
  return `
    *{box-sizing:border-box;margin:0;padding:0}
    .hl-root{background:${t.bg};color:${t.fg};font-family:${HL_FONTS.sans};-webkit-font-smoothing:antialiased;font-feature-settings:"ss01","cv11"}
    .hl-serif{font-family:${HL_FONTS.serif};font-weight:400;letter-spacing:-0.01em}
    .hl-italic{font-family:${HL_FONTS.serif};font-style:italic;font-weight:400}
    .hl-mono{font-family:${HL_FONTS.mono};font-size:11px;letter-spacing:0.08em;text-transform:uppercase}
    .hl-rule{height:1px;background:${t.line};border:0}
    .hl-img{display:block;width:100%;height:100%;object-fit:cover;background:${t.raised}}
    .hl-btn{font-family:${HL_FONTS.mono};font-size:11px;letter-spacing:0.08em;text-transform:uppercase;padding:14px 18px;border:1px solid ${t.line};background:transparent;color:${t.fg};cursor:pointer;transition:all .25s ease;display:inline-flex;align-items:center;gap:10px}
    .hl-btn:hover{border-color:${t.fg};background:${t.fg};color:${t.bg}}
    .hl-btn-accent{background:${t.accent};border-color:${t.accent};color:${t.fg}}
    .hl-btn-accent:hover{background:${t.fg};color:${t.bg};border-color:${t.fg}}
    .hl-link{color:${t.muted};text-decoration:none;transition:color .2s ease}
    .hl-link:hover{color:${t.fg}}
    .hl-eyebrow{font-family:${HL_FONTS.mono};font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:${t.muted}}
    .hl-accent{color:${t.accent}}
    ::selection{background:${t.accent};color:${t.fg}}
  `;
}
