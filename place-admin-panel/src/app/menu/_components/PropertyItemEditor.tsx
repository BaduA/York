import { useState } from "react";
import { api } from "../_lib/api";
import type { AItem } from "../_lib/types";

export function PropertyItemEditor({ item, onClose, onSaved }: { item: AItem; onClose: () => void; onSaved: () => void }) {
  const [left, setLeft] = useState(item.name);
  const [right, setRight] = useState(item.description ?? "");
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      await api("PATCH", `/menu/items/${item.id}`, { name: left.trim(), description: right.trim() || null });
      onSaved();
    } catch (e) {
      alert(`Hata: ${e instanceof Error ? e.message : e}`);
    } finally {
      setBusy(false);
    }
  }

  const inCls = "w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="modal-enter relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
        <div className="px-6 pt-6 pb-5 border-b border-border/50">
          <div className="flex items-baseline justify-between gap-4 text-sm">
            <span className="text-muted-foreground font-medium flex-1">
              {left.trim() || <span className="italic opacity-40">Sol yazı</span>}
            </span>
            <span className="font-bold shrink-0">
              {right.trim() || <span className="italic opacity-40">Sağ yazı</span>}
            </span>
          </div>
        </div>
        <div className="p-5 space-y-3">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Sol Yazı</label>
            <input value={left} onChange={e => setLeft(e.target.value)} onKeyDown={e => e.key === "Enter" && save()} className={inCls} placeholder="Pazartesi" autoFocus />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Sağ Yazı</label>
            <input value={right} onChange={e => setRight(e.target.value)} onKeyDown={e => e.key === "Enter" && save()} className={inCls} placeholder="Levrek" />
          </div>
        </div>
        <div className="px-5 pb-5 flex gap-3">
          <button onClick={save} disabled={busy}
            className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {busy ? "Kaydediliyor..." : "Kaydet"}
          </button>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-muted text-muted-foreground font-bold text-sm hover:bg-secondary transition-colors">İptal</button>
        </div>
      </div>
    </div>
  );
}
