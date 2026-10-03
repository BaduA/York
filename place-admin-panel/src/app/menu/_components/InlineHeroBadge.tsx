"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";

export function InlineHeroBadge({ value, onSave }: { value: string; onSave: (v: string) => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => { setDraft(value); }, [value]);
  useEffect(() => { if (editing) ref.current?.select(); }, [editing]);

  const commit = async () => {
    setEditing(false);
    const v = draft.trim();
    if (v !== value) await onSave(v).catch(() => {});
  };

  if (editing) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/60 ring-2 ring-primary/30 text-primary text-xs font-bold uppercase tracking-widest">
        <Icon icon="solar:flame-bold" className="animate-pulse shrink-0" width={16} />
        <input ref={ref} value={draft} onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); void commit(); } if (e.key === "Escape") { setDraft(value); setEditing(false); } }}
          onClick={e => e.stopPropagation()}
          placeholder="Etiket..."
          className="bg-transparent outline-none placeholder:text-primary/40"
          style={{ width: `${Math.max(draft.length, 10)}ch` }}
        />
      </div>
    );
  }

  if (!value) {
    return (
      <div onClick={e => { e.stopPropagation(); setEditing(true); }}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-dashed border-primary/40 text-primary/40 text-xs font-bold uppercase tracking-widest cursor-text hover:border-primary/60 hover:text-primary/60 transition-colors"
        style={{ background: "repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(197,31,43,0.05) 3px, rgba(197,31,43,0.05) 6px)" }}>
        <Icon icon="solar:add-circle-bold" width={12} />
        Ekle
      </div>
    );
  }

  return (
    <div onClick={e => { e.stopPropagation(); setEditing(true); }}
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 hover:border-primary/60 hover:bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest cursor-text transition-colors">
      <Icon icon="solar:flame-bold" className="animate-pulse shrink-0" width={16} />
      {value}
    </div>
  );
}
