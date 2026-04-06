import type { EditorState } from "./types";

export function exportToHTML(state: Pick<EditorState, "nodes" | "palette">): string {
  const { palette } = state;

  const css = `
:root {
  --ed-bg: ${palette.bg};
  --ed-fg: ${palette.fg};
  --ed-accent: ${palette.accent};
  --ed-muted: ${palette.muted};
}
  `.trim();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Portfolio</title>
  <style>${css}</style>
</head>
<body style="background:var(--ed-bg);color:var(--ed-fg)">
  <!-- Export from FRAME editor -->
</body>
</html>`;
}
