"use client";

import { use } from "react";
import dynamic from "next/dynamic";

const DeliveryPublicView = dynamic(
  () => import("./view").then((m) => m.DeliveryPublicView),
  { ssr: false },
);

export default function DeliveryPublicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <DeliveryPublicView pageId={id} />;
}
