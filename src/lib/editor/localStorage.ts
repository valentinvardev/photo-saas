import type { EditorState } from "./types";

const KEY = "frame-editor-minimal-bw";

export function saveState(state: Pick<EditorState, "nodes" | "palette">): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // quota exceeded or SSR
  }
}

export function loadState(): Pick<EditorState, "nodes" | "palette"> | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Pick<EditorState, "nodes" | "palette">;
  } catch {
    return null;
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
