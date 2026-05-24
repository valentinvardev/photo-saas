"use client";

/* Public showcase route for the Halcyon Links template.
   The component itself lives in ./component so it can be imported by the
   editor and the public /l/[id] route without violating Next.js's rule
   that page files only allow a default export. */

import { HalcyonLinks } from "./component";
import { useLinksStore } from "~/lib/links/store";
import { DEFAULT_PAGE } from "~/lib/links/data";

export default function HalcyonLinksDemo() {
  const storePage = useLinksStore((s) => s.page);
  const hydrated  = useLinksStore((s) => s.hydrated);
  const page = hydrated ? storePage : DEFAULT_PAGE;
  return <HalcyonLinks page={page} />;
}
