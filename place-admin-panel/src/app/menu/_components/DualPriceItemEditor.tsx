import { useState } from "react";
import { api } from "../_lib/api";
import type { AItem } from "../_lib/types";

export function DualPriceItemEditor({ item, onClose, onSaved }: { item: AItem; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description ?? "");
  const [price, setPrice] = useState(item.price);
  const [priceNote, setPriceNote] = useState(item.priceNote ?? "");
  const [price2, setPrice2] = useState(item.price2 ?? "");
  const [priceNote2, setPriceNote2] = useState(item.priceNote2 ?? "");
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      await api("PATCH", `/menu/items/${item.id}`, {
        name: name.trim(), description: description.trim() || null,
        price: price.trim(), priceNote: priceNote.trim() || null,
        price2: price2.trim() || null, priceNote2: priceNote2.trim() || null,
      });
      onSaved();
    } catch (e) {
      alert(`Hata: ${e instanceof Error ? e.message : e}`);
    } finally {
      setBusy(false);
    }
  }

  const inCls = "w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary transition-colors";
  const inMono = `${inCls} font-mono`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="modal-enter relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
        <div className="px-6 pt-6 pb-5 border-b border-border/50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="font-bold text-base leading-tight">{name.trim() || <span className="text-muted-foreground italic">İsim</span>}</div>
              {description.trim() && <div className="text-xs text-muted-foreground mt-0.5">{description.trim()}</div>}
            </div>
            <div className="shrink-0 text-right">
              <div className="flex items-baseline justify-end gap-1.5">
                {priceNote.trim() && <span className="text-[10px] text-muted-foreground line-through font-mono">{priceNote.trim()}</span>}
                <span className="font-mono font-bold text-primary text-base">{price.trim() || "—"}</span>
              </div>
              {price2.trim() && (
                <div className="flex items-baseline justify-end gap-1.5">
                  {priceNote2.trim() && <span className="text-[10px] text-muted-foreground line-through font-mono">{priceNote2.trim()}</span>}
                  <span className="font-mono font-bold text-primary text-xs">{price2.trim()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="p-5 space-y-3">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">İsim</label>
            <input value={name} onChange={e => setName(e.target.value)} className={inCls} placeholder="Ürün adı" autoFocus />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Açıklama</label>
            <input value={description} onChange={e => setDescription(e.target.value)} className={inCls} placeholder="Opsiyonel" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">1. Fiyat</label>
              <input value={price} onChange={e => setPrice(e.target.value)} className={inMono} placeholder="150 ₺" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">İndirim 1</label>
                {priceNote && <button onClick={() => setPriceNote("")} className="text-[10px] text-red-400 hover:text-red-300 transition-colors">Kaldır</button>}
              </div>
              <input value={priceNote} onChange={e => setPriceNote(e.target.value)} className={inMono} placeholder="Eski fiyat" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">2. Fiyat</label>
              <input value={price2} onChange={e => setPrice2(e.target.value)} className={inMono} placeholder="Opsiyonel" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">İndirim 2</label>
                {priceNote2 && <button onClick={() => setPriceNote2("")} className="text-[10px] text-red-400 hover:text-red-300 transition-colors">Kaldır</button>}
              </div>
              <input value={priceNote2} onChange={e => setPriceNote2(e.target.value)} className={inMono} placeholder="Opsiyonel" />
            </div>
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
