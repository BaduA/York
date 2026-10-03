import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { FontFamily, FontSize } from "../_lib/tiptap-extensions";
import { COLORS } from "../_lib/constants";
import type { AGroup } from "../_lib/types";

export function DescriptionBox({ group, onSave }: { group: AGroup; onSave: (groupId: string, html: string) => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [, setTick] = useState(0);

  const editor = useEditor({
    onTransaction: () => setTick(t => t + 1),
    onSelectionUpdate: () => setTick(t => t + 1),
    extensions: [
      StarterKit.configure({ paragraph: { HTMLAttributes: { style: "margin: 0" } } }),
      TextStyle, FontFamily, FontSize, Color, Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: group.descriptionText ?? "",
    editable: editing,
    editorProps: { attributes: { class: "outline-none text-xs focus:outline-none" } },
  });

  useEffect(() => {
    editor?.setEditable(editing);
    if (editing) editor?.commands.focus("end");
  }, [editing, editor]);

  const handleSave = async () => {
    const html = editor?.getHTML() ?? "";
    setEditing(false);
    await onSave(group.id, html);
  };

  return (
    <div className={`rounded-xl bg-card border transition-colors ${editing ? "border-primary/60 ring-2 ring-primary/20" : "border-border hover:border-primary/50 hover:bg-primary/10"}`}>
      {editing && (
        <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-border/60">
          <select onMouseDown={e => e.stopPropagation()}
            value={editor?.getAttributes("textStyle").fontFamily ? "heading" : ""}
            onChange={e => {
              if (e.target.value === "heading") {
                editor?.chain().focus().setMark("textStyle", { fontFamily: "var(--font-bebas)", letterSpacing: "0.05em", textTransform: "uppercase" }).run();
              } else {
                editor?.chain().focus().setMark("textStyle", { fontFamily: null, letterSpacing: null, textTransform: null }).run();
              }
            }}
            className="h-6 rounded bg-muted border-0 text-xs text-foreground px-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/40">
            <option value="">Sans</option>
            <option value="heading" style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.05em" }}>Heading</option>
          </select>
          <div className="w-px h-4 bg-border/60 mx-0.5" />
          <select onMouseDown={e => e.stopPropagation()}
            value={editor?.getAttributes("textStyle").fontSize ?? ""}
            onChange={e => { e.target.value ? editor?.chain().focus().setMark("textStyle", { fontSize: e.target.value }).run() : editor?.chain().focus().unsetMark("textStyle").run(); }}
            className="h-6 rounded bg-muted border-0 text-xs text-foreground px-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/40">
            <option value="">—</option>
            {["10px","11px","12px","13px","14px","16px","18px","20px","24px","28px","32px","36px"].map(s => (
              <option key={s} value={s}>{s.replace("px","")}</option>
            ))}
          </select>
          <div className="w-px h-4 bg-border/60 mx-0.5" />
          <button onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleBold().run(); }}
            className={`px-2 py-1 rounded text-xs font-bold transition-all ${editor?.isActive("bold") ? "bg-primary text-primary-foreground ring-1 ring-primary/60" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>B</button>
          <button onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleItalic().run(); }}
            className={`px-2 py-1 rounded text-xs italic transition-all ${editor?.isActive("italic") ? "bg-primary text-primary-foreground ring-1 ring-primary/60" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>I</button>
          <button onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleUnderline().run(); }}
            className={`px-2 py-1 rounded text-xs underline transition-all ${editor?.isActive("underline") ? "bg-primary text-primary-foreground ring-1 ring-primary/60" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>U</button>
          <div className="w-px h-4 bg-border/60 mx-0.5" />
          <button onMouseDown={e => { e.preventDefault(); editor?.chain().focus().setTextAlign("left").run(); }}
            className={`px-2 py-1 rounded text-xs transition-all ${editor?.isActive({ textAlign: "left" }) ? "bg-primary text-primary-foreground ring-1 ring-primary/60" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
            <Icon icon="solar:align-left-bold" width={12} /></button>
          <button onMouseDown={e => { e.preventDefault(); editor?.chain().focus().setTextAlign("center").run(); }}
            className={`px-2 py-1 rounded text-xs transition-all ${editor?.isActive({ textAlign: "center" }) ? "bg-primary text-primary-foreground ring-1 ring-primary/60" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
            <Icon icon="solar:align-center-bold" width={12} /></button>
          <button onMouseDown={e => { e.preventDefault(); editor?.chain().focus().setTextAlign("right").run(); }}
            className={`px-2 py-1 rounded text-xs transition-all ${editor?.isActive({ textAlign: "right" }) ? "bg-primary text-primary-foreground ring-1 ring-primary/60" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
            <Icon icon="solar:align-right-bold" width={12} /></button>
          <div className="w-px h-4 bg-border/60 mx-0.5" />
          {COLORS.map(c => (
            <button key={c} onMouseDown={e => { e.preventDefault(); editor?.chain().focus().setColor(c).run(); }}
              className={`size-4 rounded-full transition-all ${editor?.isActive("textStyle", { color: c }) ? "scale-125 ring-2 ring-white/70 ring-offset-1 ring-offset-card" : "border border-white/10 hover:scale-110"}`}
              style={{ background: c }} />
          ))}
          <div className="flex-1" />
          <button onMouseDown={e => { e.preventDefault(); handleSave(); }}
            className="px-3 py-1 rounded bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors">Kaydet</button>
          <button onMouseDown={e => { e.preventDefault(); setEditing(false); editor?.commands.setContent(group.descriptionText ?? ""); }}
            className="px-3 py-1 rounded bg-muted text-muted-foreground text-xs hover:bg-secondary transition-colors">İptal</button>
        </div>
      )}
      <div onClick={() => !editing && setEditing(true)} className={`px-4 py-5 ${!editing ? "cursor-pointer" : "cursor-text"}`}>
        {editor ? <EditorContent editor={editor} /> : <span className="text-xs opacity-35">Tıkla ve düzenle…</span>}
      </div>
    </div>
  );
}
