/* Monolith — sans-first photographer collection. Sibling to Halcyon.
   Reuses Halcyon's photo library so both templates share the same archive. */

import { HL_PHOTOS, type HlPhoto } from "~/lib/halcyon/data";

export const MN_TOKENS = {
  accent:   "#FF4015",  // lava
  bg:       "#F5F4F1",  // off-white
  raised:   "#FFFFFF",
  fg:       "#0A0A0A",
  muted:    "#6B6B68",
  line:     "#1F1F1E",  // near-black hairlines
  hairline: "#D9D7D1",  // softer grid hairlines
};

export const MN_FONTS = {
  display: "var(--mn-display), 'Bricolage Grotesque', 'Geist', system-ui, sans-serif",
  sans:    "var(--mn-sans), 'Geist', 'GT America', system-ui, sans-serif",
  mono:    "var(--mn-mono), 'Geist Mono', 'JetBrains Mono', ui-monospace, monospace",
};

export const MN_PHOTOS = HL_PHOTOS;

export interface MnProject {
  id: string; no: string; title: string; tag: string; year: string; client: string;
  cover: string; photos: HlPhoto[];
}

export const MN_PORTFOLIO = {
  brand: {
    name: "Monolith",
    studio: "Studio Yara Sokol",
    tagline: "Photography · Direction · Berlin",
    bio: "Yara Sokol is a Berlin-based photographer working at the intersection of architecture, identity, and quiet documentary. Past clients include Aesop, Frama, Off-White, MoMA PS1, and a number of independent magazines and galleries. Available worldwide.",
    location: "Berlin · 52.5200° N",
    available: true,
    stats: [
      { v: "184", l: "Frames archived" },
      { v: "12",  l: "Years working"   },
      { v: "27",  l: "Cities visited"  },
      { v: "06",  l: "Print runs"      },
    ],
  },
  tags: ["ALL", "PORTRAIT", "ARCHITECTURE", "WEDDING", "STILL LIFE", "LANDSCAPE"],
  projects: [
    { id: "mn01", no: "A1", title: "Quiet Hours",         tag: "PORTRAIT",     year: "2024", client: "Aperture",     cover: HL_PHOTOS.portraits![0]!.src, photos: HL_PHOTOS.portraits!                              },
    { id: "mn02", no: "A2", title: "Slow Country",        tag: "LANDSCAPE",    year: "2024", client: "Cereal",       cover: HL_PHOTOS.land![0]!.src,      photos: HL_PHOTOS.land!                                   },
    { id: "mn03", no: "A3", title: "Held Briefly",        tag: "WEDDING",      year: "2024", client: "Private",      cover: HL_PHOTOS.wedding![0]!.src,   photos: HL_PHOTOS.wedding!.slice(0, 5)                    },
    { id: "mn04", no: "A4", title: "Rooms Without Us",    tag: "ARCHITECTURE", year: "2023", client: "Frama",        cover: HL_PHOTOS.arch![0]!.src,      photos: HL_PHOTOS.arch!                                   },
    { id: "mn05", no: "A5", title: "Things on Tables",    tag: "STILL LIFE",   year: "2024", client: "Apartamento",  cover: HL_PHOTOS.still![0]!.src,     photos: HL_PHOTOS.still!                                  },
    { id: "mn06", no: "A6", title: "After the Reception", tag: "WEDDING",      year: "2024", client: "Private",      cover: HL_PHOTOS.wedding![2]!.src,   photos: HL_PHOTOS.wedding!.slice(5, 10)                   },
    { id: "mn07", no: "A7", title: "Concrete Hours",      tag: "ARCHITECTURE", year: "2023", client: "PS1",          cover: HL_PHOTOS.arch![3]!.src,      photos: HL_PHOTOS.arch!.slice(0, 3)                       },
    { id: "mn08", no: "A8", title: "Linnea, in Light",    tag: "PORTRAIT",     year: "2024", client: "Self",         cover: HL_PHOTOS.portraits![3]!.src, photos: HL_PHOTOS.portraits!.slice(2, 5)                  },
    { id: "mn09", no: "A9", title: "A Quiet Field",       tag: "LANDSCAPE",    year: "2023", client: "Self",         cover: HL_PHOTOS.land![2]!.src,      photos: HL_PHOTOS.land!.slice(1, 4)                       },
  ] as MnProject[],
  press: [
    { name: "Aperture",        year: "2024" },
    { name: "Cereal",          year: "2024" },
    { name: "Apartamento",     year: "2023" },
    { name: "IGNANT",          year: "2023" },
    { name: "It's Nice That",  year: "2022" },
    { name: "Wallpaper*",      year: "2022" },
  ],
};

export const MN_DELIVERY = {
  client:        "Margot & Auden",
  ref:           "D-2024-0914",
  eventDate:     "14.09.2024",
  eventLocation: "Quinta da Bichinha · Alenquer, PT",
  password:      "lisbon",
  expiryDays:    60,
  total:         184,
  sections: [
    { id: "s1", no: "01", label: "Ceremony",  count: 6, photos: [HL_PHOTOS.wedding![0]!,   HL_PHOTOS.wedding![3]!,   HL_PHOTOS.wedding![4]!,   HL_PHOTOS.wedding![1]!,   HL_PHOTOS.wedding![7]!,   HL_PHOTOS.wedding![8]!  ] },
    { id: "s2", no: "02", label: "Portraits", count: 5, photos: [HL_PHOTOS.portraits![1]!, HL_PHOTOS.portraits![2]!, HL_PHOTOS.portraits![3]!, HL_PHOTOS.portraits![4]!, HL_PHOTOS.portraits![0]!                       ] },
    { id: "s3", no: "03", label: "Reception", count: 6, photos: [HL_PHOTOS.wedding![2]!,   HL_PHOTOS.wedding![5]!,   HL_PHOTOS.wedding![6]!,   HL_PHOTOS.wedding![9]!,   HL_PHOTOS.still![1]!,     HL_PHOTOS.still![2]!    ] },
  ],
};

export function mnBaseCss(t: typeof MN_TOKENS) {
  return `
    .mn-root{background:${t.bg};color:${t.fg};font-family:${MN_FONTS.sans};-webkit-font-smoothing:antialiased;font-feature-settings:"ss01","cv11","tnum"}
    .mn-display{font-family:${MN_FONTS.display};font-weight:700;letter-spacing:-0.04em;line-height:0.92}
    .mn-mono{font-family:${MN_FONTS.mono};font-size:11px;letter-spacing:0.02em;text-transform:uppercase}
    .mn-eyebrow{font-family:${MN_FONTS.sans};font-size:10px;letter-spacing:0.16em;text-transform:uppercase;font-weight:500}
    .mn-img{display:block;width:100%;height:100%;object-fit:cover;background:${t.hairline}}
    .mn-btn{font-family:${MN_FONTS.sans};font-size:12px;font-weight:500;letter-spacing:0.02em;padding:14px 18px;border:1px solid ${t.line};background:transparent;color:${t.fg};cursor:pointer;transition:all .18s ease;display:inline-flex;align-items:center;gap:12px;text-transform:uppercase}
    .mn-btn:hover{background:${t.fg};color:${t.bg}}
    .mn-btn.accent{background:${t.accent};border-color:${t.accent};color:#FFF}
    .mn-btn.accent:hover{background:${t.fg};border-color:${t.fg};color:${t.bg}}
    .mn-btn.solid{background:${t.fg};color:${t.bg};border-color:${t.fg}}
    .mn-btn.solid:hover{background:${t.accent};border-color:${t.accent};color:#FFF}
    .mn-link{color:${t.fg};text-decoration:none;border-bottom:1px solid ${t.fg};transition:opacity .18s ease}
    .mn-link:hover{opacity:0.6}
    .mn-rule{height:1px;background:${t.line};border:0}
    .mn-root ::selection{background:${t.accent};color:#FFF}
  `;
}
