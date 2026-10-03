"use client";

import { useEffect, useRef, useState } from "react";

export function InlineHeroDescription({ value, onSave }: { value: string; onSave: (v: string) => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { setDraft(value); }, [value]);
  useEffect(() => { if (editing && ref.current) { ref.current.focus(); ref.current.select(); } }, [editing]);

  const commit = async () => {
    setEditing(false);
    const v = draft.trim();
    if (v && v !== value) await onSave(v).catch(() => {});
    else setDraft(value);
  };

  if (editing) {
    return (
      <div className="space-y-2 max-w-xl" onClick={e => e.stopPropagation()}>
        <textarea ref={ref} value={draft} onChange={e => setDraft(e.target.value)} rows={3}
          className="w-full bg-card/80 border border-primary/60 ring-2 ring-primary/20 rounded-xl px-3 py-2.5 text-sm text-foreground resize-none outline-none leading-relaxed" />
        <div className="flex gap-2">
          <button onClick={() => void commit()} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors">Kaydet</button>
          <button onClick={() => { setDraft(value); setEditing(false); }} className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs hover:bg-secondary transition-colors">İptal</button>
        </div>
      </div>
    );
  }

  return (
    <p onClick={e => { e.stopPropagation(); setEditing(true); }}
      className="text-muted-foreground text-sm sm:text-base max-w-xl cursor-text hover:text-foreground/80 rounded-lg hover:bg-primary/5 px-1.5 py-1 -mx-1.5 transition-colors">
      {value}
    </p>
  );
}
