"use client";

/* ──────────────────────────────────────────────────────────────────────────
   Edit primitives for the delivery live editor.

   Wrap any text or image in a renderer with <EditableText> / <EditableImage>.
   When the surrounding <EditModeProvider editMode={true}> is on, fields show
   a hover ring and inline edit affordances. When off (the public delivery
   page), they render exactly the same DOM as plain text/img — no extra
   wrappers, no listeners. The renderer code stays template-agnostic.
   ────────────────────────────────────────────────────────────────────── */

import { createContext, useContext, useRef, useEffect, useState } from "react";
import type { CSSProperties, ReactNode, ElementType } from "react";

/* ── context ───────────────────────────────────────────────────────── */

interface EditModeShape {
  editMode:     boolean;
  activeField:  string | null;
  focusField:   (path: string) => void;
}
const EditModeContext = createContext<EditModeShape>({
  editMode: false, activeField: null, focusField: () => {},
});

export function EditModeProvider({
  editMode, activeField, focusField, children,
}: EditModeShape & { children: ReactNode }) {
  return (
    <EditModeContext.Provider value={{ editMode, activeField, focusField }}>
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
  cursor: "text",
  position: "relative",
};

function editableHoverStyle(active: boolean): CSSProperties {
  return {
    outlineColor: active ? "#fad502" : "rgba(250,213,2,0.55)",
    backgroundColor: active ? "rgba(250,213,2,0.1)" : undefined,
  };
}

/* ── EditableText ─────────────────────────────────────────────────── */

interface EditableTextProps {
  fieldPath:  string;                              // unique key, ex "title" / "welcomeMessage"
  value:      string;
  onChange?:  (v: string) => void;                 // optional — when omitted, the field is read-only in edit mode (eg derived data)
  as?:        ElementType;                         // tag to render (span, h1, p, etc)
  style?:     CSSProperties;
  className?: string;
  multiline?: boolean;                             // textarea-ish behaviour: Enter inserts newline; Esc/blur commits
  placeholder?: string;
}

export function EditableText({
  fieldPath, value, onChange, as = "span", style, className,
  multiline = false, placeholder,
}: EditableTextProps) {
  const { editMode, activeField, focusField } = useEditMode();
  const ref = useRef<HTMLElement | null>(null);
  const [editing, setEditing] = useState(false);
  const Tag = as as ElementType;

  // Keep DOM text in sync with prop when not editing
  useEffect(() => {
    if (!editing && ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value;
    }
  }, [value, editing]);

  if (!editMode) {
    return (
      <Tag ref={ref} style={style} className={className}>
        {value || placeholder || ""}
      </Tag>
    );
  }

  const isActive = activeField === fieldPath;
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
      style={{ ...style, ...baseEditableStyle, ...editableHoverStyle(isActive || editing), cursor: canEdit ? "text" : "default" }}
      className={className}
      contentEditable={canEdit}
      suppressContentEditableWarning
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onClick={(e: React.MouseEvent) => { e.stopPropagation(); focusField(fieldPath); }}
      data-field={fieldPath}
    >
      {value || placeholder || ""}
    </Tag>
  );
}

/* ── EditableImage ────────────────────────────────────────────────── */

interface EditableImageProps {
  fieldPath:  string;
  children:   ReactNode;                           // the actual <img> or background div
  onRequestChange?: () => void;                    // open photo picker
  label?:     string;                              // hover label, default "Change image"
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

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    focusField(fieldPath);
    onRequestChange?.();
  };

  return (
    <div
      style={{ ...style, ...baseEditableStyle, ...editableHoverStyle(isActive), cursor: "pointer" }}
      className={className}
      onClick={handleClick}
      data-field={fieldPath}
    >
      {children}
      {/* Hover overlay */}
      <div
        style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.45)", opacity: isActive ? 1 : 0,
          transition: "opacity 0.15s ease", pointerEvents: "none",
        }}
        className="dlv-editable-overlay"
      >
        <span style={{ background: "#fad502", color: "#111", fontFamily: "monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", padding: "6px 12px", fontWeight: 700 }}>
          {label}
        </span>
      </div>
    </div>
  );
}

/* ── Hover ring styles (loaded once near root) ─────────────────────── */

export function EditableHoverStyles() {
  return (
    <style>{`
      [data-field]:hover { outline-color: rgba(250,213,2,0.85) !important; }
      [data-field]:hover .dlv-editable-overlay { opacity: 1 !important; }
    `}</style>
  );
}
