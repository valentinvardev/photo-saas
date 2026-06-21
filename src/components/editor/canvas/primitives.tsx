"use client";

/**
 * Shared editor primitives — used by every adapted template.
 * See docs/template-adapter-guide.md for usage.
 */

import { useEditorStore } from "~/lib/editor/store";
import { TiptapEditor } from "~/components/editor/toolbars/TiptapEditor";
import type { ImageCrop } from "~/lib/editor/types";

/* Tiptap wraps loose inline content in a <p>; templates author content as inline
   HTML (e.g. "James<br/><em>Hollis</em>"), and a stray <p> both adds block
   margins and lets template selectors like `.hp-about p { font-size:16px }` match
   it — shrinking a heading. Unwrap a single paragraph back to inline; leave true
   multi-paragraph content alone. */
function unwrapParagraph(html: string): string {
  const inner = /^<p>([\s\S]*?)<\/p>$/i.exec(html)?.[1];
  return inner !== undefined && !/<p[\s>]/i.test(inner) ? inner : html;
}

/**
 * Renders a logo image, optionally cropped via Settings > Logo > Crop.
 * Uses logo.width as the displayed width; height auto-derives from the
 * crop's captured aspectRatio (or the natural image when uncropped).
 */
export function LogoImage({
  src, alt, width, crop, style,
}: {
  src: string;
  alt?: string;
  width: number;
  crop?: ImageCrop;
  style?: React.CSSProperties;
}) {
  if (!crop) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt ?? ""} style={{ width, height: "auto", objectFit: "contain", display: "block", ...style }} />;
  }
  /* Wrapper sized by crop aspect ratio; image scaled to show only the
     selected region. */
  return (
    <div style={{
      width, aspectRatio: crop.aspectRatio,
      overflow: "hidden", position: "relative",
      display: "block", ...style,
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt ?? ""}
        style={{
          position: "absolute",
          left:  `${(-crop.x / crop.w) * 100}%`,
          top:   `${(-crop.y / crop.h) * 100}%`,
          width:  `${(100 / crop.w) * 100}%`,
          height: `${(100 / crop.h) * 100}%`,
          maxWidth: "none",
        }}
      />
    </div>
  );
}

export function EditableNode({
  id,
  children,
  style,
  className,
  tag: Tag = "div",
}: {
  id: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  tag?: "div" | "h1" | "h2" | "h3" | "p" | "span" | "blockquote" | "header" | "section" | "footer";
}) {
  const { selectedId, editingId, selectNode, setEditing, nodes, readOnly } = useEditorStore();
  const node     = nodes[id];
  const selected = selectedId === id;
  const editing  = editingId  === id;
  const isTextNode = node?.type === "heading" || node?.type === "paragraph" || node?.type === "logo";

  if (node?.hidden) return null;

  const overrides: React.CSSProperties = {};
  if (node?.fontSize)   overrides.fontSize   = node.fontSize;
  if (node?.fontWeight) overrides.fontWeight = node.fontWeight;
  if (node?.fontStyle)  overrides.fontStyle  = node.fontStyle;
  if (node?.textAlign)  overrides.textAlign  = node.textAlign;
  if (node?.color)      overrides.color      = node.color;
  if (node?.fontFamily) overrides.fontFamily = node.fontFamily;

  const El = Tag as "div";

  // Public site / preview (readOnly): render a plain element with no editor
  // affordances — no data-editor-node, no select/edit handlers, no cursor.
  if (readOnly) {
    return <El className={className} style={{ position: "relative", ...style, ...overrides }}>{children}</El>;
  }

  return (
    <El
      data-editor-node=""
      data-node-id={id}
      className={className}
      data-selected={selected ? "true" : undefined}
      data-editing={editing ? "true" : undefined}
      onClick={(e) => {
        e.stopPropagation();
        // A click inside a node that's already being edited (caret placement, or
        // Space/Enter relayed by a host control) must not deselect it.
        if (editing) return;
        // Tap to select, tap again to edit — touch-friendly (dblclick is
        // unreliable on phones). Images select only; they have no inline editor.
        if (selected && isTextNode) setEditing(id);
        else selectNode(id);
      }}
      onDoubleClick={(e) => { e.stopPropagation(); selectNode(id); setEditing(id); }}
      style={{ position: "relative", ...style, ...overrides }}
    >
      {children}
    </El>
  );
}

export function EditableText({ id, style, display = "block" }: { id: string; style?: React.CSSProperties; display?: "block" | "inline" | "inline-block" }) {
  const { nodes, editingId, updateNode, readOnly } = useEditorStore();
  const content = nodes[id]?.content ?? "";
  const editing = editingId === id;

  // Never mount the inline editor on the public site / preview.
  if (editing && !readOnly) {
    return (
      <TiptapEditor
        id={id}
        content={content}
        onUpdate={(html) => updateNode(id, { content: unwrapParagraph(html) })}
        style={style}
      />
    );
  }
  return (
    <span style={{ display, ...style }} dangerouslySetInnerHTML={{ __html: content }} />
  );
}

export function EditableImage({ id, imgStyle }: { id: string; imgStyle?: React.CSSProperties }) {
  const node = useEditorStore((s) => s.nodes[id]);
  const style: React.CSSProperties = { ...imgStyle };
  if (node?.objectFit)      style.objectFit      = node.objectFit;
  if (node?.objectPosition) style.objectPosition = node.objectPosition;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={node?.src ?? ""} alt={node?.alt ?? ""} style={style} />;
}
