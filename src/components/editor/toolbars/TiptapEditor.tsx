"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import { useEditorStore } from "~/lib/editor/store";

interface Props {
  id: string;
  content: string;
  onUpdate: (html: string) => void;
  style?: React.CSSProperties;
}

export function TiptapEditor({ id, content, onUpdate, style }: Props) {
  const { setEditing } = useEditorStore();

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      FontFamily,
    ],
    content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "tiptap-inline",
        style: "outline:none;",
      },
    },
    immediatelyRender: false,
  });

  // Pause zundo while editing so each keystroke isn't a history entry
  useEffect(() => {
    const temporal = useEditorStore.temporal;
    temporal.getState().pause();
    return () => {
      temporal.getState().resume();
    };
  }, []);

  // Auto-focus
  useEffect(() => {
    if (editor) {
      setTimeout(() => editor.commands.focus("end"), 0);
    }
  }, [editor]);

  // Escape to stop editing
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        setEditing(null);
      }
    }
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [setEditing]);

  return (
    <div
      style={{ ...style, position: "relative", minWidth: 0, overflowWrap: "break-word", wordBreak: "break-word", whiteSpace: "pre-wrap" }}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <EditorContent editor={editor} />
    </div>
  );
}
