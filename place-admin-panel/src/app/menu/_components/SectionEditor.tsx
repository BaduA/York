"use client";

import { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { api } from "../_lib/api";
import type { ASection } from "../_lib/types";

export function SectionEditor({ section, onClose, onSaved }: { section: ASection; onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState(section.title);
  const [subtitle, setSubtitle] = useState(section.subtitle ?? "");
  const [badge, setBadge] = useState(section.badge ?? "");
  const [iconVal, setIconVal] = useState(section.icon);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleIconUpload(file: File) {
    setUploading(true);
    try {
      const res = await api("POST", "/upload/presign", {
        folder: "menu-sections",
        contentType: file.type,
      }) as { url: string; publicUrl: string };
      await fetch(res.url, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
      setIconVal(res.publicUrl);
    } catch (e) {
      alert(`Upload hatası: ${e instanceof Error ? e.message : e}`);
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    if (!title.trim()) return;
    setBusy(true);
    try {
      await api("PATCH", `/menu/sections/${section.id}`, {
        title: title.trim(),
        subtitle: subtitle.trim() || null,
        badge: badge.trim() || null,
        icon: iconVal || null,
      });
      onSaved();
    } catch (e) {
      alert(`Hata: ${e instanceof Error ? e.message : e}`);
    } finally {
      setBusy(false);
    }
  }

  const isUrl = iconVal.startsWith("http");
  const inCls = "w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="modal-enter relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
        <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
          <h2 className="font-font-heading text-base font-bold uppercase tracking-wider">Bölüm Düzenle</h2>
          <button onClick={onClose} className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
            <Icon icon="solar:close-square-bold" width={16} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {/* Icon */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">İkon</label>
            <div className="flex items-center gap-3">
              <div className="size-14 rounded-xl bg-primary text-primary-foreground flex items-center justify-center overflow-hidden shrink-0 border border-primary/40 shadow-md">
                {isUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={iconVal} alt="" className="w-full h-full object-cover" />
                ) : iconVal ? (
                  <Icon icon={iconVal} width={28} />
                ) : (
                  <Icon icon="solar:image-bold" width={24} className="opacity-50" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleIconUpload(f); e.target.value = ""; }} />
                <button onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs font-bold hover:bg-primary/20 transition-colors disabled:opacity-50">
                  <Icon icon={uploading ? "svg-spinners:ring-resize" : "solar:upload-bold"} width={14} />
                  {uploading ? "Yükleniyor..." : "Görsel Yükle"}
                </button>
                <input value={iconVal} onChange={e => setIconVal(e.target.value)}
                  className={`${inCls} text-xs font-mono`} placeholder="solar:cup-bold" />
              </div>
            </div>
          </div>
          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Başlık *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className={inCls} placeholder="Promo & Bar" autoFocus />
          </div>
          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Açıklama</label>
            <input value={subtitle} onChange={e => setSubtitle(e.target.value)} className={inCls} placeholder="Opsiyonel alt başlık" />
          </div>
          {/* Right text / badge */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Sağ Yazı</label>
            <input value={badge} onChange={e => setBadge(e.target.value)} className={inCls} placeholder="HAPPY HOUR" />
          </div>
        </div>
        <div className="px-5 pb-5 flex gap-3">
          <button onClick={save} disabled={busy || !title.trim()}
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
