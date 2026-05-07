/* Vault — paper archive collection. Anton + Manrope + JetBrains Mono.
   Categories → Folders → Plates. Built like a book, not a website. */

export const VT_TOKENS = {
  bg:     "#F4F0E6",
  paper:  "#ECE5D2",
  fg:     "#1A1714",
  muted:  "#857C68",
  line:   "#D6CCB6",
  accent: "#A8462E",
};

export const VT_FONTS = {
  display: "var(--vt-display), 'Anton', 'Impact', sans-serif",
  sans:    "var(--vt-sans), 'Manrope', system-ui, sans-serif",
  mono:    "var(--vt-mono), 'JetBrains Mono', ui-monospace, monospace",
};

export const VT_U = (id: string, w = 1600, q = 80) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;

export interface VtFolder { id: string; no: string; name: string; date: string; place: string; note: string; photos: string[] }
export interface VtCategory { id: string; no: string; name: string; summary: string; span: string; cover: string; folders: VtFolder[] }

export const VAULT_BRAND = {
  name: "VAULT",
  tagline: "An archive of pictures, twenty-eighteen onwards.",
  photographer: "Ines Aurelio",
  based: "Lisbon · Paris",
  edition: "Edition 06 / 2026",
};

export const VAULT_CATEGORIES: VtCategory[] = [
  {
    id: "ceremonies", no: "01", name: "Ceremonies", summary: "Weddings, civil unions, and one elopement on a glacier.",
    span: "2022 — 2025", cover: "1519741497674-611481863552",
    folders: [
      { id: "marais",      no: "01.01", name: "Marais",      date: "Jun 2025", place: "Paris, FR",   note: "Seraphine & Theo — a courtyard wedding, golden hour vows.",     photos: ["1519741497674-611481863552","1525258946800-98cfd641d0de","1511285560929-80b456fea0bc","1469371670807-013ccf25f16a","1532712938310-34cb3982ef74","1519225421980-715cb0215aed","1525772764200-be829a350797"] },
      { id: "alpine",      no: "01.02", name: "Alpine",      date: "Sep 2024", place: "Cortina, IT", note: "Léa & Marco — civil union at 2,300 m, vows in the wind.",       photos: ["1469474968028-56623f02e42e","1506905925346-21bda4d32df4","1500534314209-a25ddb2bd429","1502602898657-3e91760cbb34","1518241353330-0f7941c2d9b5","1502716119720-b23a93e5fe1b"] },
      { id: "low-country", no: "01.03", name: "Low Country", date: "May 2024", place: "Antwerp, BE", note: "A small ceremony among friends. Forty guests, one record player.", photos: ["1532712938310-34cb3982ef74","1519671482749-fd09be7ccebf","1525258946800-98cfd641d0de","1488161628813-67ab2e98a7b3","1492447166138-50c3889fccb1","1519225421980-715cb0215aed"] },
    ],
  },
  {
    id: "portraits", no: "02", name: "Portraits", summary: "Editorial commissions and private sittings.",
    span: "2023 — 2025", cover: "1502635385003-ee1e6a1a742d",
    folders: [
      { id: "the-hours",    no: "02.01", name: "The Hours",    date: "Apr 2024", place: "Lisbon, PT", note: "Athena, on her last day in Lisbon. Ten frames, one window.", photos: ["1502635385003-ee1e6a1a742d","1488426862026-3ee34a7d66df","1517841905240-472988babdf9","1531746020798-e6953c6e8e04","1502764613149-7f1d229e230f"] },
      { id: "mrs-aurelio",  no: "02.02", name: "Mrs. Aurelio", date: "Oct 2023", place: "Porto, PT",  note: "Three generations at the kitchen table.",                    photos: ["1531746020798-e6953c6e8e04","1488426862026-3ee34a7d66df","1502635385003-ee1e6a1a742d","1517841905240-472988babdf9"] },
      { id: "studio-quiet", no: "02.03", name: "Studio, Quiet", date: "Jan 2025", place: "Lisbon, PT", note: "An assignment for a magazine that never ran.",                photos: ["1517841905240-472988babdf9","1502635385003-ee1e6a1a742d","1488426862026-3ee34a7d66df","1531746020798-e6953c6e8e04","1524504388940-b1c1722653e1"] },
    ],
  },
  {
    id: "fashion", no: "03", name: "Fashion", summary: "Lookbooks & campaign work.",
    span: "2023 — 2025", cover: "1524504388940-b1c1722653e1",
    folders: [
      { id: "rue-saint", no: "03.01", name: "Rue Saint", date: "Feb 2025", place: "Antwerp, BE",   note: "FW26 lookbook for Maison Vert.",     photos: ["1524504388940-b1c1722653e1","1492447166138-50c3889fccb1","1502716119720-b23a93e5fe1b","1488161628813-67ab2e98a7b3","1496440737103-cd596325d314"] },
      { id: "mineral",   no: "03.02", name: "Mineral",   date: "Aug 2024", place: "Marseille, FR", note: "Editorial for ANOTHER, on stone.",   photos: ["1488161628813-67ab2e98a7b3","1496440737103-cd596325d314","1492447166138-50c3889fccb1","1502716119720-b23a93e5fe1b","1524504388940-b1c1722653e1"] },
    ],
  },
  {
    id: "places", no: "04", name: "Places", summary: "Travelogues. Personal work, no client.",
    span: "2018 — 2025", cover: "1480714378408-67cf0d13bc1b",
    folders: [
      { id: "noctambule",  no: "04.01", name: "Noctambule",  date: "Nov 2023", place: "Tokyo, JP",      note: "Six nights. The city after midnight.",          photos: ["1480714378408-67cf0d13bc1b","1490806843957-31f4c9a91c65","1542051841857-5f90071e7989","1554797589-7241bb691973","1493514789931-586cb221d7a7"] },
      { id: "low-tide",    no: "04.02", name: "Low Tide",    date: "Jul 2024", place: "Faroe Islands",  note: "A coastal travelogue. Black & white only.",     photos: ["1469474968028-56623f02e42e","1506905925346-21bda4d32df4","1500534314209-a25ddb2bd429","1470770841072-f978cf4d019e","1518241353330-0f7941c2d9b5","1502602898657-3e91760cbb34"] },
      { id: "small-rooms", no: "04.03", name: "Small Rooms", date: "Apr 2022", place: "Naples, IT",     note: "Interiors. Empty. Each one waiting.",           photos: ["1502764613149-7f1d229e230f","1500534314209-a25ddb2bd429","1518241353330-0f7941c2d9b5","1525258946800-98cfd641d0de","1502602898657-3e91760cbb34"] },
    ],
  },
];

export const VAULT_TOTALS = (() => {
  let folders = 0, photos = 0;
  VAULT_CATEGORIES.forEach((c) => { folders += c.folders.length; c.folders.forEach((f) => { photos += f.photos.length; }); });
  return { categories: VAULT_CATEGORIES.length, folders, photos };
})();
