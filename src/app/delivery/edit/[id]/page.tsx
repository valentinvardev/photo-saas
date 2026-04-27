"use client";

import { use } from "react";
import dynamic from "next/dynamic";

const DeliveryBuilder = dynamic(
  () => import("~/components/delivery/Builder").then((m) => m.DeliveryBuilder),
  { ssr: false },
);

export default function DeliveryEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <DeliveryBuilder pageId={id} />;
}
