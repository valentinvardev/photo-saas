"use client";

/* Public showcase route for the Brooklyn Links template.
   The component itself lives in ./component so it can be imported by the
   editor and the public /l/[id] route without violating Next.js's rule
   that page files only allow a default export. */

import { BrooklynLinks } from "./component";
import { useLinksStore } from "~/lib/links/store";
import { DEFAULT_PAGE } from "~/lib/links/data";

export default function BrooklynLinksDemo() {
  const storePage = useLinksStore((s) => s.page);
  const hydrated  = useLinksStore((s) => s.hydrated);
  /* While the persisted page hydrates from localStorage, fall back to the
     seed defaults so the demo never flashes blank. */
  const page = hydrated ? storePage : DEFAULT_PAGE;
  return <BrooklynLinks page={page} />;
}
