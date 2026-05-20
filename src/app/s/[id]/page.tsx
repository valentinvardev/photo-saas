"use client";

import { use } from "react";
import { ShareView } from "./view";

export default function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ShareView shareId={id} />;
}
