"use client";

import { useEffect, useRef } from "react";
import { api } from "~/trpc/react";

/* A short, pleasant two-note chime generated with the Web Audio API (no asset). */
function playChime() {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    void ctx.resume();
    const now = ctx.currentTime;
    const notes = [880, 1174.66]; // A5 → D6, a gentle rising ping
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const t = now + i * 0.13;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.16, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.32);
    });
    setTimeout(() => { void ctx.close(); }, 900);
  } catch { /* audio not available — ignore */ }
}

/**
 * Mounted once in the dashboard shell. Polls the unread contact count and plays
 * a chime whenever it rises (a new contact message has arrived).
 */
export function NewMessageChime() {
  const { data } = api.contact.unreadCount.useQuery(undefined, {
    refetchInterval: 20_000,
    refetchIntervalInBackground: false,
  });
  const last = useRef<number | null>(null);

  useEffect(() => {
    if (data == null) return;
    if (last.current !== null && data > last.current) playChime();
    last.current = data;
  }, [data]);

  return null;
}
