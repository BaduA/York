import React, { useState } from "react";
import { Field, FT, FN, FC } from "./FormPrimitives";
import { VariantPicker } from "./VariantPicker";
import type { AItem, FormHandle } from "../_lib/types";

export const ItemForm = React.forwardRef<FormHandle, { init?: Partial<AItem> }>(({ init = {} }, ref) => {
  const [name, setName] = useState(init.name ?? "");
  const [description, setDescription] = useState(init.description ?? "");
  const [price, setPrice] = useState(init.price ?? "");
  const [priceNote, setPriceNote] = useState(init.priceNote ?? "");
  const [badge, setBadge] = useState(init.badge ?? "");
  const [itemVariant, setItemVariant] = useState(init.itemVariant ?? "");
  const [sortOrder] = useState(init.sortOrder ?? 0);
  const [isVisible, setIsVisible] = useState(init.isVisible ?? true);

  React.useImperativeHandle(ref, () => ({
    getData: () => ({ name, description: description || null, price, priceNote: priceNote || null, badge: badge || null, itemVariant: itemVariant || null, sortOrder, isVisible }),
  }), [name, description, price, priceNote, badge, itemVariant, sortOrder, isVisible]);

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-background/60 border border-border/60">
        <div>
          <div className="text-sm font-bold">Stokta Var</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Kapalıysa menüde "Stokta Yok" olarak görünür</div>
        </div>
        <button type="button" onClick={() => setIsVisible(v => !v)}
          className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${isVisible ? "bg-primary" : "bg-muted"}`}>
          <div className={`absolute top-0.5 size-5 bg-white rounded-full shadow-sm transition-transform ${isVisible ? "translate-x-[1.375rem]" : "translate-x-0.5"}`} />
        </button>
      </div>
      <Field label="Ürün Adı"><FT v={name} s={setName} p="Sake Nigiri" /></Field>
      <Field label="Açıklama (opsiyonel)"><FT v={description} s={setDescription} p="Malzeme, tarif notu..." /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Fiyat"><FT v={price} s={setPrice} p="150 ₺" /></Field>
        <Field label="İndirim / Eski Fiyat"><FT v={priceNote} s={setPriceNote} p="200 ₺" /></Field>
      </div>
      <Field label="Etiket (opsiyonel)"><FT v={badge} s={setBadge} p="Yeni · Öneririz · Acı" /></Field>
      <div className="space-y-2">
        <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Görünüm Tipi</label>
        <VariantPicker value={itemVariant} onChange={setItemVariant} />
      </div>
    </>
  );
});
ItemForm.displayName = "ItemForm";
