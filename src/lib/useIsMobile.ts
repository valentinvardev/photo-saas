"use client";

import { useEffect, useState } from "react";

/** True when the viewport is phone-sized. SSR-safe (starts false). */
export function useIsMobile(maxWidth = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${maxWidth}px)`);
    const on = () => setIsMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [maxWidth]);
  return isMobile;
}
