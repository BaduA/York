"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { api } from "../_lib/api";
import { Field, FT } from "./FormPrimitives";
import { ic } from "../_lib/constants";
import type { PageCta } from "../_lib/types";

export function CtaEditor({ cta, onClose, onSaved }: { cta: PageCta; onClose: () => void; onSaved: () => void }) {
  const [badgeText, setBadgeText] = useState(cta.badgeText);
  const [headingMain, setHeadingMain] = useState(cta.headingMain);
  const [headingHighlight, setHeadingHighlight] = useState(cta.headingHighlight);
  const [description, setDescription] = useState(cta.description);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      await api("PATCH", "/page-content/menu/cta", {
        badgeText: badgeText || undefined,
        headingMain: headingMain || undefined,
        headingHighlight: headingHighlight || undefined,
        description: description || undefined,
      });
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
        <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
          <h2 className="font-font-heading text-base font-bold uppercase tracking-wider">CTA Düzenle</h2>
          <button onClick={onClose} className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
            <Icon icon="solar:close-square-bold" width={16} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <Field label="Rozet Metni"><FT v={badgeText} s={setBadgeText} p="Aylık Kokteyl Yarışması" /></Field>
          <Field label="Başlık Ana"><FT v={headingMain} s={setHeadingMain} p="Kendi Kokteylini Yarat," /></Field>
          <Field label="Başlık Vurgu"><FT v={headingHighlight} s={setHeadingHighlight} p="Menüye İsmini Yazdır" /></Field>
          <Field label="Açıklama">
            <textarea className={ic} value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Her ay en çok..." />
          </Field>
        </div>
        <div className="px-5 pb-5 flex gap-3">
          <button onClick={save} disabled={busy}
            className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {busy ? "Kaydediliyor..." : "Kaydet"}
          </button>
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-muted text-muted-foreground font-bold text-sm hover:bg-secondary transition-colors">
            İptal
          </button>
        </div>
      </div>
    </div>
  );
}
