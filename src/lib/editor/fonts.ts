/* ── Template fonts ──────────────────────────────────────────────────── */
import "@fontsource/cormorant-garamond/300.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";
import "@fontsource/dm-sans/300.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/space-mono/400.css";
import "@fontsource/space-mono/700.css";

/* ── Extended sans-serif library ─────────────────────────────────────── */
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/600.css";
import "@fontsource/syne/400.css";
import "@fontsource/syne/700.css";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/outfit/300.css";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/raleway/400.css";
import "@fontsource/raleway/600.css";
import "@fontsource/josefin-sans/400.css";
import "@fontsource/josefin-sans/600.css";
import "@fontsource/nunito/400.css";
import "@fontsource/nunito/600.css";

/* ── Extended serif library ──────────────────────────────────────────── */
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/lora/400.css";
import "@fontsource/lora/700.css";
import "@fontsource/fraunces/400.css";
import "@fontsource/fraunces/700.css";
import "@fontsource/eb-garamond/400.css";
import "@fontsource/eb-garamond/700.css";
import "@fontsource/libre-baskerville/400.css";
import "@fontsource/libre-baskerville/700.css";
import "@fontsource/source-serif-4/400.css";
import "@fontsource/source-serif-4/700.css";

export interface FontOption {
  label: string;
  value: string;
  stack: string;
  category: "serif" | "sans" | "mono";
}

export const FONT_OPTIONS: FontOption[] = [
  /* ── Template defaults (first) ─── */
  { label: "Cormorant Garamond", value: "Cormorant Garamond", stack: "'Cormorant Garamond', Georgia, serif", category: "serif" },
  { label: "DM Sans",            value: "DM Sans",            stack: "'DM Sans', system-ui, sans-serif",    category: "sans"  },
  { label: "Space Mono",         value: "Space Mono",         stack: "'Space Mono', monospace",             category: "mono"  },

  /* ── Serifs ─── */
  { label: "EB Garamond",        value: "EB Garamond",        stack: "'EB Garamond', Georgia, serif",       category: "serif" },
  { label: "Playfair Display",   value: "Playfair Display",   stack: "'Playfair Display', Georgia, serif",  category: "serif" },
  { label: "Lora",               value: "Lora",               stack: "'Lora', Georgia, serif",              category: "serif" },
  { label: "Fraunces",           value: "Fraunces",           stack: "'Fraunces', Georgia, serif",          category: "serif" },
  { label: "Libre Baskerville",  value: "Libre Baskerville",  stack: "'Libre Baskerville', Georgia, serif", category: "serif" },
  { label: "Source Serif 4",     value: "Source Serif 4",     stack: "'Source Serif 4', Georgia, serif",    category: "serif" },

  /* ── Sans-serifs ─── */
  { label: "Inter",              value: "Inter",              stack: "'Inter', system-ui, sans-serif",      category: "sans"  },
  { label: "Manrope",            value: "Manrope",            stack: "'Manrope', system-ui, sans-serif",    category: "sans"  },
  { label: "Syne",               value: "Syne",               stack: "'Syne', system-ui, sans-serif",       category: "sans"  },
  { label: "Space Grotesk",      value: "Space Grotesk",      stack: "'Space Grotesk', system-ui, sans-serif", category: "sans" },
  { label: "Outfit",             value: "Outfit",             stack: "'Outfit', system-ui, sans-serif",     category: "sans"  },
  { label: "Raleway",            value: "Raleway",            stack: "'Raleway', system-ui, sans-serif",    category: "sans"  },
  { label: "Josefin Sans",       value: "Josefin Sans",       stack: "'Josefin Sans', system-ui, sans-serif", category: "sans" },
  { label: "Nunito",             value: "Nunito",             stack: "'Nunito', system-ui, sans-serif",     category: "sans"  },
];
