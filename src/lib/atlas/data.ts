/* Atlas — sans-style cobalt collection.
   Bricolage Grotesque + Geist + Geist Mono, electric cobalt accent on warm cream. */

export const AT_TOKENS = {
  accent: "#2235FF",  // electric cobalt
  bg:     "#EFEAE0",  // warm cream
  raised: "#E4DDCB",
  fg:     "#0E0E0E",
  muted:  "#6E6A60",
  line:   "#D5CDB9",
};

export const AT_FONTS = {
  display: "var(--at-display), 'Bricolage Grotesque', system-ui, sans-serif",
  sans:    "var(--at-sans), 'Geist', system-ui, sans-serif",
  mono:    "var(--at-mono), 'Geist Mono', ui-monospace, monospace",
};

export const ATLAS_U = (id: string, w = 1600, q = 80) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;

export interface AtProject { id: string; no: string; title: string; subtitle: string; place: string; year: string; kind: string; tags: string[]; cover: string; photos: string[] }
export interface AtChapter { id: string; no: string; label: string; note: string; photos: string[] }

export const ATLAS_PROJECTS: AtProject[] = [
  { id: "marais",     no: "01", title: "Marais",     subtitle: "Seraphine & Theo",                 place: "Paris, FR",      year: "2025", kind: "Wedding",  tags: ["Editorial","Documentary"], cover: "1519741497674-611481863552", photos: ["1519741497674-611481863552","1511285560929-80b456fea0bc","1469371670807-013ccf25f16a","1525258946800-98cfd641d0de","1519225421980-715cb0215aed","1532712938310-34cb3982ef74","1525772764200-be829a350797","1519671482749-fd09be7ccebf"] },
  { id: "rue-saint",  no: "02", title: "Rue Saint",  subtitle: "FW26 lookbook for Maison Vert",    place: "Antwerp, BE",    year: "2025", kind: "Fashion",  tags: ["Editorial","Studio"],     cover: "1524504388940-b1c1722653e1", photos: ["1524504388940-b1c1722653e1","1492447166138-50c3889fccb1","1502716119720-b23a93e5fe1b","1488161628813-67ab2e98a7b3","1496440737103-cd596325d314","1502716119720-b23a93e5fe1b"] },
  { id: "low-tide",   no: "03", title: "Low Tide",   subtitle: "A coastal travelogue",             place: "Faroe Islands",  year: "2024", kind: "Travel",   tags: ["Landscape","B&W"],        cover: "1469474968028-56623f02e42e", photos: ["1469474968028-56623f02e42e","1506905925346-21bda4d32df4","1500534314209-a25ddb2bd429","1470770841072-f978cf4d019e","1518241353330-0f7941c2d9b5","1502602898657-3e91760cbb34"] },
  { id: "the-hours",  no: "04", title: "The Hours",  subtitle: "Athena, on her last day in Lisbon", place: "Lisbon, PT",    year: "2024", kind: "Portrait", tags: ["Portrait","Editorial"],    cover: "1502635385003-ee1e6a1a742d", photos: ["1502635385003-ee1e6a1a742d","1488426862026-3ee34a7d66df","1517841905240-472988babdf9","1531746020798-e6953c6e8e04","1543610892-0b1f7e6d8ac1","1502764613149-7f1d229e230f"] },
  { id: "noctambule", no: "05", title: "Noctambule", subtitle: "After-hours, Tokyo",               place: "Tokyo, JP",      year: "2023", kind: "Street",   tags: ["Street","Night"],         cover: "1480714378408-67cf0d13bc1b", photos: ["1480714378408-67cf0d13bc1b","1490806843957-31f4c9a91c65","1542051841857-5f90071e7989","1554797589-7241bb691973","1554797589-7241bb691973","1493514789931-586cb221d7a7"] },
];

export const ATLAS_DELIVERY = {
  client: "Seraphine & Theo",
  title:  "Marais — A summer wedding",
  date:   "June 14, 2025",
  location: "Le Marais, Paris",
  photographer: "Atlas Studio",
  count: 142,
  cover: "1519741497674-611481863552",
  chapters: [
    { id: "preparation", no: "Ch 01", label: "Preparation", note: "The morning. Quiet rooms, soft light, the dress.", photos: ["1525258946800-98cfd641d0de","1519225421980-715cb0215aed","1502635385003-ee1e6a1a742d","1488426862026-3ee34a7d66df","1525772764200-be829a350797","1517841905240-472988babdf9","1531746020798-e6953c6e8e04","1502716119720-b23a93e5fe1b","1496440737103-cd596325d314"] },
    { id: "ceremony",    no: "Ch 02", label: "Ceremony",    note: "Vows in the courtyard. Family. Everyone in their best.", photos: ["1519741497674-611481863552","1511285560929-80b456fea0bc","1469371670807-013ccf25f16a","1532712938310-34cb3982ef74","1519671482749-fd09be7ccebf","1525772764200-be829a350797","1469371670807-013ccf25f16a","1492447166138-50c3889fccb1","1488161628813-67ab2e98a7b3"] },
    { id: "portraits",   no: "Ch 03", label: "Portraits",   note: "An hour stolen between sets, golden across the rooftops.", photos: ["1502635385003-ee1e6a1a742d","1517841905240-472988babdf9","1531746020798-e6953c6e8e04","1488426862026-3ee34a7d66df","1524504388940-b1c1722653e1","1502716119720-b23a93e5fe1b","1488161628813-67ab2e98a7b3","1488426862026-3ee34a7d66df"] },
    { id: "reception",   no: "Ch 04", label: "Reception",   note: "Toasts, the first dance, sparklers down the rue.", photos: ["1490806843957-31f4c9a91c65","1542051841857-5f90071e7989","1480714378408-67cf0d13bc1b","1493514789931-586cb221d7a7","1554797589-7241bb691973","1469474968028-56623f02e42e","1532712938310-34cb3982ef74","1500534314209-a25ddb2bd429","1502602898657-3e91760cbb34"] },
  ] as AtChapter[],
};

/* Deterministic faux aspect ratios per photo id (no metadata fetch). */
export const ATLAS_RATIOS: Record<string, number> = (() => {
  const map: Record<string, number> = {};
  const all = new Set<string>();
  ATLAS_PROJECTS.forEach((p) => p.photos.forEach((id) => all.add(id)));
  ATLAS_DELIVERY.chapters.forEach((c) => c.photos.forEach((id) => all.add(id)));
  const choices = [3/4, 3/4, 4/5, 2/3, 3/2, 4/3, 1, 16/9];
  let i = 0;
  for (const id of all) { map[id] = choices[i % choices.length]!; i++; }
  return map;
})();
