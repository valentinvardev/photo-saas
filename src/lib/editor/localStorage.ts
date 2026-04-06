import type { EditorNode, ColorPalette, Typography } from "./types";

interface PersistedState {
  nodes:      Record<string, EditorNode>;
  palette:    ColorPalette;
  typography: Typography;
}

const KEY = "frame-editor-minimal-bw";

export function saveState(state: PersistedState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // quota exceeded or SSR
  }
}

export function loadState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

export function clearState(): void {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}
