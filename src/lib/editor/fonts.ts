import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/fraunces/400.css";
import "@fontsource/fraunces/700.css";
import "@fontsource/syne/400.css";
import "@fontsource/syne/700.css";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/lora/400.css";
import "@fontsource/lora/700.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/600.css";

export interface FontOption {
  label: string;
  value: string;
  stack: string;
}

export const FONT_OPTIONS: FontOption[] = [
  { label: "Inter",            value: "Inter",            stack: "'Inter', sans-serif" },
  { label: "Playfair Display", value: "Playfair Display", stack: "'Playfair Display', serif" },
  { label: "DM Sans",          value: "DM Sans",          stack: "'DM Sans', sans-serif" },
  { label: "Fraunces",         value: "Fraunces",         stack: "'Fraunces', serif" },
  { label: "Syne",             value: "Syne",             stack: "'Syne', sans-serif" },
  { label: "Space Grotesk",    value: "Space Grotesk",    stack: "'Space Grotesk', sans-serif" },
  { label: "Lora",             value: "Lora",             stack: "'Lora', serif" },
  { label: "Manrope",          value: "Manrope",          stack: "'Manrope', sans-serif" },
];
