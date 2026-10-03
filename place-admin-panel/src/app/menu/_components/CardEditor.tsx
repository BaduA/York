"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { api } from "../_lib/api";
import { Field, FT } from "./FormPrimitives";
import type { PageCard } from "../_lib/types";

export function CardEditor({ card, onClose, onSaved }: { card: PageCard; onClose: () => void; onSaved: () => void }) {
  const [badgeLabel, setBadgeLabel] = useState(card.badgeLabel);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [imageUrl, setImageUrl] = useState(card.imageUrl ?? "");
  const [busy, setBusy] = useState(false);
  const [attempted, setAttempted] = useState(false);

  async function save() {
    setAttempted(true);
    if (!title.trim() || !description.trim()) return;
    setBusy(true);
    try {
      await api("PATCH", `/page-content/menu/cards/${card.slot}`, {
        badgeLabel,
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl || null,
      });
      onSaved();
    } catch (e) {
      alert(`Hata: ${e instanceof Error ? e.message : e}`);
    } finally {
      setBusy(false);
    }
  }

  const titleErr = attempted && !title.trim();
  const descErr = attempted && !description.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="modal-enter relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
        <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
          <h2 className="font-font-heading text-base font-bold uppercase tracking-wider">Kart {card.slot} Düzenle</h2>
          <button onClick={onClose} className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
            <Icon icon="solar:close-square-bold" width={16} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <Field label="Rozet Etiketi (opsiyonel)"><FT v={badgeLabel} s={setBadgeLabel} p="Sushi Bar" /></Field>
          <div className="space-y-1">
            <Field label="Başlık *">
              <div className={titleErr ? "ring-1 ring-destructive rounded-lg" : ""}>
                <FT v={title} s={setTitle} p="Taze Sushi & Rolls" />
              </div>
            </Field>
            {titleErr && <p className="text-xs text-destructive px-1">Başlık boş bırakılamaz</p>}
          </div>
          <div className="space-y-1">
            <Field label="Açıklama *">
              <div className={descErr ? "ring-1 ring-destructive rounded-lg" : ""}>
                <FT v={description} s={setDescription} p="Uramaki, Maki..." />
              </div>
            </Field>
            {descErr && <p className="text-xs text-destructive px-1">Açıklama boş bırakılamaz</p>}
          </div>
          <Field label="Görsel URL"><FT v={imageUrl} s={setImageUrl} p="https://..." /></Field>
          {imageUrl && (
            <div className="h-28 rounded-lg overflow-hidden border border-border/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
          )}
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
