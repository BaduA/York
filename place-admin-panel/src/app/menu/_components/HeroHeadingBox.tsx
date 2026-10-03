"use client";

import { useCallback, useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { FontFamily, FontSize } from "../_lib/tiptap-extensions";
import { COLORS } from "../_lib/constants";
import type { PageHero } from "../_lib/types";

export function HeroHeadingBox({ hero, onSave }: { hero: PageHero; onSave: (html: string) => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [, setTick] = useState(0);

  const buildHtml = useCallback((h: PageHero) => {
    const main = h.headingMain ?? "";
    if (main.includes("<")) return main;
    const hi = h.headingHighlight ?? "";
    return `<p>${main}${hi ? ` <span style="color: #C51F2B">${hi}</span>` : ""}</p>`;
  }, []);

  const editor = useEditor({
    onTransaction: () => setTick(t => t + 1),
    onSelectionUpdate: () => setTick(t => t + 1),
    extensions: [
      StarterKit.configure({ paragraph: { HTMLAttributes: { style: "margin: 0" } } }),
      TextStyle, FontFamily, FontSize, Color, Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: buildHtml(hero),
    editable: editing,
    editorProps: { attributes: { class: "outline-none focus:outline-none" } },
  });

  useEffect(() => {
    editor?.setEditable(editing);
    if (editing) editor?.commands.focus("end");
  }, [editing, editor]);

  const handleSave = async () => {
    const text = editor?.getText().trim() ?? "";
    if (!text) return;
    const html = editor?.getHTML() ?? "";
    setEditing(false);
    await onSave(html).catch(() => {});
  };

  const displayHtml = (() => {
    const main = hero.headingMain ?? "";
    if (main.includes("<")) return main;
    const hi = hero.headingHighlight ?? "";
    return `${main}${hi ? ` <span style="color: #C51F2B">${hi}</span>` : ""}`;
  })();

  return (
    <div className={`rounded-xl transition-all ${editing ? "border border-primary/60 ring-2 ring-primary/20 p-3 bg-card/40" : "border border-transparent hover:border-primary/40 hover:bg-primary/5 cursor-text p-1 -m-1"}`}>
      {editing && (
        <div className="flex flex-wrap items-center gap-1 pb-2 mb-2 border-b border-border/60">
          {COLORS.map(c => (
            <button key={c} onMouseDown={e => { e.preventDefault(); editor?.chain().focus().setColor(c).run(); }}
              className={`size-4 rounded-full transition-all ${editor?.isActive("textStyle", { color: c }) ? "scale-125 ring-2 ring-white/70 ring-offset-1 ring-offset-card" : "border border-white/10 hover:scale-110"}`}
              style={{ background: c }} />
          ))}
          <div className="w-px h-4 bg-border/60 mx-0.5" />
          <button onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleBold().run(); }}
            className={`px-2 py-1 rounded text-xs font-bold transition-all ${editor?.isActive("bold") ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>B</button>
          <div className="flex-1" />
          <button onMouseDown={e => { e.preventDefault(); handleSave(); }}
            className="px-3 py-1 rounded bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors">Kaydet</button>
          <button onMouseDown={e => { e.preventDefault(); setEditing(false); editor?.commands.setContent(buildHtml(hero)); }}
            className="px-3 py-1 rounded bg-muted text-muted-foreground text-xs hover:bg-secondary transition-colors">İptal</button>
        </div>
      )}
      {editing ? (
        <div className="font-font-heading text-4xl sm:text-6xl font-bold tracking-tight uppercase leading-[0.95]">
          <EditorContent editor={editor} />
        </div>
      ) : (
        <h1 onClick={e => { e.stopPropagation(); setEditing(true); }}
          className="font-font-heading text-4xl sm:text-6xl font-bold tracking-tight uppercase leading-[0.95]"
          dangerouslySetInnerHTML={{ __html: displayHtml }} />
      )}
    </div>
  );
}
