import { useState } from "react";
import { Icon } from "@iconify/react";
import { api } from "../_lib/api";
import type { AItem } from "../_lib/types";

export function SimpleItemEditor({ item, onClose, onSaved }: { item: AItem; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price);
  const [discount, setDiscount] = useState(item.priceNote ?? "");
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      await api("PATCH", `/menu/items/${item.id}`, { name: name.trim(), price: price.trim(), priceNote: discount.trim() || null });
      onSaved();
    } catch (e) {
      alert(`Hata: ${e instanceof Error ? e.message : e}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="modal-enter relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
        <div className="px-6 pt-6 pb-5 border-b border-border/50">
          <div className="flex items-baseline justify-between gap-4">
            <span className="font-bold text-xl leading-tight flex-1 break-words">
              {name.trim() || <span className="text-muted-foreground italic text-base">İsim</span>}
            </span>
            <div className="text-right shrink-0">
              {discount.trim() && <div className="text-xs text-muted-foreground line-through font-mono">{discount.trim()}</div>}
              <span className="font-mono font-bold text-primary text-lg">{price.trim() || "—"}</span>
            </div>
          </div>
        </div>
        <div className="p-5 space-y-3">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">İsim</label>
            <input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === "Enter" && save()}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary transition-colors"
              placeholder="Ürün adı" autoFocus />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Fiyat</label>
            <input value={price} onChange={e => setPrice(e.target.value)} onKeyDown={e => e.key === "Enter" && save()}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm font-mono focus:outline-none focus:border-primary transition-colors"
              placeholder="150 ₺" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">İndirim / Eski Fiyat</label>
              {discount && <button onClick={() => setDiscount("")} className="text-[10px] text-red-400 hover:text-red-300 transition-colors">Kaldır</button>}
            </div>
            <input value={discount} onChange={e => setDiscount(e.target.value)} onKeyDown={e => e.key === "Enter" && save()}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm font-mono focus:outline-none focus:border-primary transition-colors"
              placeholder="Opsiyonel — 200 ₺" />
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
