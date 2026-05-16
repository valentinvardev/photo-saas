"use client";

import { use } from "react";
import dynamic from "next/dynamic";

const LinksPublicView = dynamic(
  () => import("./view").then((m) => m.LinksPublicView),
  { ssr: false },
);

export default function LinksPublicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <LinksPublicView pageId={id} />;
}
