"use client";

/* ──────────────────────────────────────────────────────────────────────────
   Edit primitives for the delivery live editor.

   Wrap any text or image in a renderer with <EditableText> / <EditableImage>.
   When the surrounding <EditModeProvider editMode={true}> is on, fields show
   a hover ring and inline edit affordances. When off (the public delivery
   page), they render exactly the same DOM as plain text/img — no extra
   wrappers, no listeners.
   ────────────────────────────────────────────────────────────────────── */

import { createContext, useContext, useRef, useEffect, useState } from "react";
import type { CSSProperties, ReactNode, ElementType } from "react";

export type FontSlot = 1 | 2 | 3;

/* ── context ───────────────────────────────────────────────────────── */

interface EditModeShape {
  editMode:            boolean;
  activeField:         string | null;
  focusField:          (path: string) => void;
  /** When the user is interacting with a font dropdown in the sidebar,
   *  every text bound to that slot gets a permanent ring so they can see
   *  exactly which elements the change will affect. */
  highlightFontSlot:   FontSlot | null;
}
const EditModeContext = createContext<EditModeShape>({
  editMode: false, activeField: null, focusField: () => {}, highlightFontSlot: null,
});

export function EditModeProvider({
  editMode, activeField, focusField, highlightFontSlot, children,
}: EditModeShape & { children: ReactNode }) {
  return (
    <EditModeContext.Provider value={{ editMode, activeField, focusField, highlightFontSlot }}>
      {editMode && highlightFontSlot !== null && (
        <style>{`
          [data-font-slot="${highlightFontSlot}"] {
            outline: 1.5px solid #fad502 !important;
            outline-offset: 3px !important;
            transition: outline-color 0.18s ease !important;
          }
        `}</style>
      )}
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  return useContext(EditModeContext);
}

/* ── styling shared by all editable wrappers ──────────────────────── */

const baseEditableStyle: CSSProperties = {
  outline: "1px dashed transparent",
  outlineOffset: 2,
  transition: "outline-color 0.15s ease, background-color 0.15s ease",
  position: "relative",
};

function editableRing(active: boolean, highlighted: boolean): CSSProperties {
  if (active) return { outlineColor: "#fad502", outlineStyle: "solid", backgroundColor: "rgba(250,213,2,0.08)" };
  if (highlighted) return { outlineColor: "#fad502", outlineStyle: "solid" };
  return {};
}

/* ── EditableText ─────────────────────────────────────────────────── */

interface EditableTextProps {
  fieldPath:  string;
  value:      string;
  onChange?:  (v: string) => void;
  as?:        ElementType;
  style?:     CSSProperties;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  /** Which template typography slot this element uses (1=display, 2=body, 3=mono).
   *  When the user opens the matching dropdown in the sidebar this element rings up. */
  fontSlot?:  FontSlot;
  /** When true and value is empty, the element doesn't render at all in view
   *  mode. In edit mode it still shows the placeholder so the editor can
   *  click to bring the text back. Lets users delete optional labels. */
  hideIfEmpty?: boolean;
}

export function EditableText({
  fieldPath, value, onChange, as = "span", style, className,
  multiline = false, placeholder, fontSlot, hideIfEmpty = false,
}: EditableTextProps) {
  const { editMode, activeField, focusField, highlightFontSlot } = useEditMode();
  const ref = useRef<HTMLElement | null>(null);
  const [editing, setEditing] = useState(false);
  const Tag = as as ElementType;

  useEffect(() => {
    if (!editing && ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value;
    }
  }, [value, editing]);

  if (!editMode) {
    if (hideIfEmpty && !value) return null;
    return (
      <Tag ref={ref} style={style} className={className}>
        {value || placeholder || ""}
      </Tag>
    );
  }

  const isActive = activeField === fieldPath || editing;
  const isHighlighted = !!fontSlot && highlightFontSlot === fontSlot;
  const canEdit = !!onChange;

  const handleFocus = () => {
    if (!canEdit) return;
    setEditing(true);
    focusField(fieldPath);
  };

  const handleBlur = () => {
    setEditing(false);
    if (!ref.current || !onChange) return;
    const next = ref.current.textContent ?? "";
    if (next !== value) onChange(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      (ref.current as HTMLElement | null)?.blur();
      return;
    }
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      (ref.current as HTMLElement | null)?.blur();
    }
  };

  return (
    <Tag
      ref={ref}
      style={{ ...style, ...baseEditableStyle, ...editableRing(isActive, isHighlighted), cursor: canEdit ? "text" : "default" }}
      className={className}
      contentEditable={canEdit}
      suppressContentEditableWarning
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onClick={(e: React.MouseEvent) => { e.stopPropagation(); focusField(fieldPath); }}
      data-field={fieldPath}
      data-font-slot={fontSlot}
    >
      {value || placeholder || ""}
    </Tag>
  );
}

/* ── EditableImage ────────────────────────────────────────────────── */

interface EditableImageProps {
  fieldPath:  string;
  children:   ReactNode;
  onRequestChange?: () => void;
  label?:     string;
  style?:     CSSProperties;
  className?: string;
}

export function EditableImage({
  fieldPath, children, onRequestChange, label = "Change image", style, className,
}: EditableImageProps) {
  const { editMode, activeField, focusField } = useEditMode();
  const isActive = activeField === fieldPath;

  if (!editMode) {
    return (
      <div style={style} className={className}>
        {children}
      </div>
    );
  }

  /* Click anywhere on the image area triggers the picker — UNLESS a child
   * (e.g. an overlaid EditableText) stops propagation, which they do.
   * The "Change image" chip sits in the top-right corner with very low
   * footprint so it never blocks editing other elements on the image. */
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    focusField(fieldPath);
    onRequestChange?.();
  };

  return (
    <div
      style={{ ...style, ...baseEditableStyle, ...editableRing(isActive, false), cursor: "pointer" }}
      className={`${className ?? ""} dlv-editable-image`}
      onClick={handleClick}
      data-field={fieldPath}
    >
      {children}
      {/* Small corner chip — only shows on direct hover of THIS wrapper.
          pointer-events: none so it never intercepts clicks on children. */}
      <span
        className="dlv-image-chip"
        style={{
          position: "absolute", top: 8, right: 8, zIndex: 5,
          background: "rgba(0,0,0,0.65)", color: "#fff",
          fontFamily: "monospace", fontSize: 9, letterSpacing: "0.16em",
          textTransform: "uppercase", padding: "4px 8px",
          opacity: isActive ? 1 : 0,
          transition: "opacity 0.15s ease", pointerEvents: "none",
          backdropFilter: "blur(4px)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ── Global hover styles for editable primitives ──────────────────── */

export function EditableHoverStyles() {
  return (
    <style>{`
      [data-field]:hover { outline-color: rgba(250,213,2,0.7) !important; outline-style: solid !important; }
      /* Only show the chip when the image WRAPPER itself is the direct hover
         target — keep it hidden while hovering an inner editable text/etc. */
      .dlv-editable-image:hover > .dlv-image-chip { opacity: 1 !important; }
      .dlv-editable-image:has([data-field]:hover) > .dlv-image-chip { opacity: 0 !important; }
    `}</style>
  );
}
