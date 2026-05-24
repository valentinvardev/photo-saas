"use client";

import { AtelierLinks } from "./component";
import { useLinksStore } from "~/lib/links/store";
import { DEFAULT_PAGE } from "~/lib/links/data";

export default function AtelierLinksDemo() {
  const storePage = useLinksStore((s) => s.page);
  const hydrated  = useLinksStore((s) => s.hydrated);
  const page = hydrated ? storePage : DEFAULT_PAGE;
  return <AtelierLinks page={page} />;
}
