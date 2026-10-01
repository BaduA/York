"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useLoading } from "@/components/LoadingBar";
import { hashData } from "@/lib/hash";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Link from "next/link";
import {
  DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors,
} from "@dnd-kit/core";
import {
  SortableContext, useSortable, arrayMove, rectSortingStrategy, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ─── Types ────────────────────────────────────────────────────────────────────

type SectionSlug = "glass" | "spirit" | "mixer" | "cordial" | "ice" | "garnish";

type Glass   = { id: string; imgSrc: string; name: string; active: boolean; ml: number };
type Spirit  = { id: string; name: string; subTag: string; subTagStyle?: string; note: string; desc: string; pricePerCl: number; icon: string; profile: string; active: boolean; outOfStock?: boolean };
type Mixer   = { id: string; name: string; subTag: string; subTagStyle?: string; note: string; desc: string; pricePerCl: number; icon: string; profile: string; active: boolean; outOfStock?: boolean };
type Cordial = { id: string; name: string; subTag: string; subTagStyle?: string; note: string; desc: string; pricePerCl: number; icon: string; profile: string; active: boolean; outOfStock?: boolean };
type Ice     = { id: string; name: string; subTag: string; desc: string; icon: string; profile: string; active: boolean };
type Garnish = { id: string; name: string; subTag: string; subTagStyle?: string; desc: string; icon: string; colorClass: string; profile: string; active: boolean };

type EditTarget =
  | { type: "glass";   item: Glass }
  | { type: "spirit";  item: Spirit }
  | { type: "mixer";   item: Mixer }
  | { type: "cordial"; item: Cordial }
  | { type: "ice";     item: Ice }
  | { type: "garnish"; item: Garnish };

type ApiLabItem = {
  id: string;
  name: string;
  subTag: string | null;
  subTagStyle: string | null;
  note: string | null;
  description: string | null;
  profile: string | null;
  icon: string | null;
  imageUrl: string | null;
  colorClass: string | null;
  pricePerCl: number | null;
  ml: number | null;
  isActive: boolean;
  outOfStock: boolean;
  sortOrder: number;
};

type ApiLabStep = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  stepOrder: number;
  items: ApiLabItem[];
};

type ChangeEntry = { id: string; label: string; context: string; status: 'added' | 'updated' | 'removed'; details?: string[] };

// ─── Constants ────────────────────────────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";
const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY ?? "";

const ADMIN_HEADERS = {
  "Content-Type": "application/json",
  "x-admin-key": ADMIN_KEY,
};

const GLASS_IMG_MAP: Record<string, string> = {
  coupe: "/icons/glasses/coupe.svg",
  "old-fashioned": "/icons/glasses/rocks.svg",
  highball: "/icons/glasses/highball.svg",
  "nick-nora": "/icons/glasses/martini-glass.svg",
  margarita: "/icons/glasses/margarita-glass.svg",
};

// ─── Style Presets ────────────────────────────────────────────────────────────

const TAG_STYLE_OPTIONS = [
  { label: "Kırmızı",  value: "text-red-500 bg-red-500/10",          dot: "bg-red-500" },
  { label: "Amber",    value: "text-amber-500 bg-amber-500/10",      dot: "bg-amber-500" },
  { label: "Sarı",     value: "text-yellow-400 bg-yellow-500/10",    dot: "bg-yellow-400" },
  { label: "Cyan",     value: "text-cyan-400 bg-cyan-500/10",        dot: "bg-cyan-400" },
  { label: "Mor",      value: "text-purple-400 bg-purple-500/10",    dot: "bg-purple-400" },
  { label: "Yeşil",    value: "text-emerald-500 bg-emerald-500/10",  dot: "bg-emerald-500" },
  { label: "Turuncu",  value: "text-orange-400 bg-orange-500/10",    dot: "bg-orange-400" },
  { label: "Pembe",    value: "text-rose-500 bg-rose-500/10",        dot: "bg-rose-500" },
  { label: "Gökyüzü",  value: "text-sky-300 bg-sky-500/10",          dot: "bg-sky-300" },
  { label: "Sade",     value: "text-muted-foreground bg-secondary",  dot: "bg-neutral-500" },
];

const COLOR_CLASS_OPTIONS = [
  { label: "Sarı",       value: "text-yellow-300", dot: "bg-yellow-300" },
  { label: "Turuncu",    value: "text-orange-400", dot: "bg-orange-400" },
  { label: "Kırmızı",    value: "text-red-500",    dot: "bg-red-500" },
  { label: "Yeşil",      value: "text-emerald-500",dot: "bg-emerald-500" },
  { label: "Açık Yeşil", value: "text-emerald-400",dot: "bg-emerald-400" },
  { label: "Amber",      value: "text-amber-400",  dot: "bg-amber-400" },
  { label: "Sade",       value: "text-muted-foreground", dot: "bg-neutral-500" },
];

// ─── Section metadata ─────────────────────────────────────────────────────────

const SECTION_META: Record<SectionSlug, { stepClass: string; headerTitle: string; addLabel: string }> = {
  glass:   { stepClass: "bg-primary/20 text-primary border border-primary/30",            headerTitle: "KADEH SEÇİMİ (GLASSWARE)",  addLabel: "Yeni Kadeh Ekle" },
  spirit:  { stepClass: "bg-primary text-primary-foreground shadow-sm",                   headerTitle: "BAZ ALKOLLER (SPIRITS)",     addLabel: "Yeni Baz İçki Ekle" },
  mixer:   { stepClass: "bg-amber-500/20 text-amber-400 border border-amber-500/30",      headerTitle: "MİKSERLER & TONİKLER",       addLabel: "Yeni Mikser Ekle" },
  cordial: { stepClass: "bg-purple-500/20 text-purple-400 border border-purple-500/30",   headerTitle: "ŞURUPLAR & CORDIAL",         addLabel: "Yeni Şurup / Cordial Ekle" },
  ice:     { stepClass: "bg-sky-500/20 text-sky-400 border border-sky-500/30",            headerTitle: "BUZ TİPİ",                   addLabel: "Yeni Buz Tipi Ekle" },
  garnish: { stepClass: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",headerTitle: "GARNİTÜR",                   addLabel: "Yeni Garnitür Ekle" },
};

const DEFAULT_TITLES: Record<SectionSlug, { title: string; sub: string }> = {
  glass:   { title: "Kadehini Seç",       sub: "Kokteylinin servis edileceği kadehi belirle." },
  spirit:  { title: "Ana Baz Alkolünü Seç", sub: "Kokteylinin temel karakterini belirleyecek ana içkiyi ve porsiyonu seç." },
  mixer:   { title: "Mikserini Seç",       sub: "Kokteylini tamamlayacak karıştırıcıyı belirle." },
  cordial: { title: "Şurup & Cordial",     sub: "Tatlılık ve renk katacak şurubu seç." },
  ice:     { title: "Buz & Kadeh Tipi",    sub: "Servis sıcaklığını ve buz türünü belirle." },
  garnish: { title: "Garnitür",            sub: "Son dokunuşu ve aromatiği ekle." },
};

const EMPTY_FORMS: Record<SectionSlug, Record<string, string | number | boolean>> = {
  glass:   { name: "", imgSrc: "", ml: 0 },
  spirit:  { name: "", subTag: "", subTagStyle: "", note: "", desc: "", pricePerCl: 0, icon: "solar:bottle-bold",    profile: "", outOfStock: false },
  mixer:   { name: "", subTag: "", subTagStyle: "", note: "", desc: "", pricePerCl: 0, icon: "solar:bottle-2-bold",  profile: "", imageUrl: "" },
  cordial: { name: "", subTag: "", subTagStyle: "", note: "", desc: "", pricePerCl: 0, icon: "solar:drop-bold",      profile: "", imageUrl: "" },
  ice:     { name: "", subTag: "", desc: "", icon: "solar:snowflake-bold", profile: "", imageUrl: "" },
  garnish: { name: "", subTag: "", subTagStyle: "", desc: "", icon: "solar:leaf-bold", colorClass: "text-yellow-300", profile: "", imageUrl: "" },
};

// ─── Initial Data (fallback until backend loads) ──────────────────────────────


// ─── Upload ───────────────────────────────────────────────────────────────────

async function uploadToR2(file: File): Promise<string> {
  const presignRes = await fetch(`${API_URL}/upload/presign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder: "lab-items", contentType: file.type }),
  });
  const { uploadUrl, storeUrl } = await presignRes.json() as { uploadUrl: string; storeUrl: string };
  if (uploadUrl) await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
  return storeUrl;
}

// ─── EditModal ────────────────────────────────────────────────────────────────

function EditModal({ target, form, onSet, onSave, onClose, isNew = false }: {
  target: EditTarget;
  form: Record<string, string | number | boolean | undefined>;
  onSet: (key: string, value: string | number | boolean) => void;
  onSave: () => void;
  onClose: () => void;
  isNew?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const typeLabel = { glass: "Kadeh", spirit: "Baz Alkol", mixer: "Mikser", cordial: "Şurup", ice: "Buz Tipi", garnish: "Garnitür" }[target.type];

  const field = (lbl: string, name: string, type = "text", rows?: number) => (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wide">{lbl}</label>
      {rows ? (
        <textarea value={String(form[name] ?? "")} onChange={e => onSet(name, e.target.value)} rows={rows}
          className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors" />
      ) : (
        <input type={type} value={String(form[name] ?? "")} onChange={e => onSet(name, e.target.value)}
          className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors" />
      )}
    </div>
  );

  const colorPicker = (lbl: string, name: string, options: typeof TAG_STYLE_OPTIONS) => (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wide">{lbl}</label>
      <div className="flex flex-wrap gap-1.5">
        {options.map(opt => (
          <button key={opt.value} type="button" onClick={() => onSet(name, opt.value)}
            className={["flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all",
              form[name] === opt.value ? "border-primary bg-primary/20 text-primary font-bold" : "border-border bg-secondary text-muted-foreground hover:bg-muted",
            ].join(" ")}>
            <span className={`size-2.5 rounded-full shrink-0 ${opt.dot}`} />
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  const iconField = (name: string) => (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wide">İkon (Iconify)</label>
      <div className="flex items-center gap-2">
        <div className="size-9 rounded-lg bg-secondary border border-border flex items-center justify-center shrink-0 text-foreground">
          <Icon icon={String(form[name] ?? "solar:star-bold")} />
        </div>
        <input type="text" value={String(form[name] ?? "")} onChange={e => onSet(name, e.target.value)}
          placeholder="solar:bottle-bold"
          className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors" />
      </div>
      <p className="text-[10px] text-muted-foreground">icon-sets.iconify.design/solar — ikon adını kopyalayın</p>
    </div>
  );

  const imageUploadField = () => {
    const currentUrl = String(form.imageUrl ?? "");
    return (
      <div className="space-y-1.5">
        <label className="block text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wide">Görsel (R2)</label>
        <div className="flex items-start gap-3">
          {currentUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={currentUrl} alt="" className="size-16 rounded-xl object-cover border border-border shrink-0" />
          ) : (
            <div className="size-16 rounded-xl bg-secondary border border-dashed border-border flex items-center justify-center shrink-0">
              <Icon icon="solar:gallery-bold" className="text-muted-foreground" width={22} />
            </div>
          )}
          <div className="flex-1 space-y-2">
            <label className={["flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-xs font-semibold cursor-pointer transition-colors",
              uploading ? "opacity-50 cursor-default bg-secondary border-border text-muted-foreground" : "bg-secondary border-border text-foreground hover:bg-muted",
            ].join(" ")}>
              <Icon icon={uploading ? "solar:refresh-bold" : "solar:upload-bold"} width={14} className={uploading ? "animate-spin" : ""} />
              {uploading ? "Yükleniyor..." : "Görsel Yükle"}
              <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" disabled={uploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploading(true);
                  try { onSet("imageUrl", await uploadToR2(file)); }
                  finally { setUploading(false); e.target.value = ""; }
                }} />
            </label>
            {currentUrl && (
              <button type="button" onClick={() => onSet("imageUrl", "")} className="text-[10px] text-muted-foreground hover:text-destructive transition-colors">
                Görseli kaldır
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-card z-10 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Icon icon={isNew ? "solar:add-circle-bold" : "solar:pen-bold"} width={15} height={15} className="text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-muted-foreground uppercase">{isNew ? "Yeni" : "Düzenle"} — {typeLabel}</p>
              <h2 className="font-heading font-bold text-sm text-foreground uppercase tracking-wide leading-tight">
                {isNew ? `Yeni ${typeLabel} Ekle` : String(form.name ?? "")}
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground border border-border transition-colors">
            <Icon icon="solar:close-bold" width={16} height={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {target.type === "glass" && <>
            {field("Kadeh Adı", "name")}
            {isNew && field("SVG Yolu (imgSrc)", "imgSrc")}
            {field("ML Sınırı", "ml", "number")}
          </>}

          {(target.type === "spirit" || target.type === "mixer" || target.type === "cordial") && <>
            {field("Ad", "name")}
            <div className="grid grid-cols-2 gap-3">
              {field("Kategori Etiketi", "subTag")}
              {field("1 CL Fiyatı (₺)", "pricePerCl", "number")}
            </div>
            {colorPicker("Etiket Rengi", "subTagStyle", TAG_STYLE_OPTIONS)}
            {field("Not / Bilgi Satırı", "note")}
            {field("Açıklama", "desc", "text", 3)}
            {field("Profil", "profile")}
            {target.type === "spirit" ? iconField("icon") : imageUploadField()}
            {target.type === "spirit" && (
              <label className="flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-lg bg-secondary border border-border hover:bg-muted transition-colors">
                <input type="checkbox" checked={Boolean(form.outOfStock)} onChange={e => onSet("outOfStock", e.target.checked)} className="rounded accent-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Tükendi</p>
                  <p className="text-[10px] text-muted-foreground">Karta "Tükendi" rozeti eklenir, seçilemez hale gelir</p>
                </div>
              </label>
            )}
          </>}

          {target.type === "ice" && <>
            {field("Buz Adı", "name")}
            <div className="grid grid-cols-2 gap-3">
              {field("Alt Etiket", "subTag")}
              {field("Profil", "profile")}
            </div>
            {field("Açıklama", "desc", "text", 3)}
            {imageUploadField()}
          </>}

          {target.type === "garnish" && <>
            {field("Garnitür Adı", "name")}
            <div className="grid grid-cols-2 gap-3">
              {field("Alt Etiket", "subTag")}
              {field("Profil", "profile")}
            </div>
            {colorPicker("Etiket Rengi", "subTagStyle", TAG_STYLE_OPTIONS)}
            {colorPicker("İkon Rengi", "colorClass", COLOR_CLASS_OPTIONS)}
            {field("Açıklama", "desc", "text", 3)}
            {imageUploadField()}
          </>}
        </div>

        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border sticky bottom-0 bg-card rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-secondary text-foreground text-sm font-semibold border border-border hover:bg-muted transition-colors">İptal</button>
          <button onClick={onSave} className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all shadow-sm flex items-center gap-2">
            <Icon icon={isNew ? "solar:add-circle-bold" : "solar:diskette-bold"} width={15} height={15} />
            {isNew ? "Ekle" : "Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── VariantCard ──────────────────────────────────────────────────────────────

type VariantCardProps = {
  name: string; subTag: string; subTagStyle?: string; note: string; desc: string;
  pricePerCl: number; icon: string; profile: string; active: boolean; outOfStock?: boolean;
  dragHandle?: React.ReactNode;
  onToggle: () => void;
  onEdit: () => void;
};

function VariantCard({ name, subTag, subTagStyle, note, desc, pricePerCl, icon, profile, active, outOfStock, dragHandle, onToggle, onEdit }: VariantCardProps) {
  return (
    <div onClick={() => !outOfStock && onToggle()} className={[
      "bg-card rounded-2xl border-2 p-4 relative transition-all flex flex-col justify-between",
      outOfStock ? "opacity-50 cursor-default" : "cursor-pointer",
      active && !outOfStock ? "border-primary shadow-md shadow-primary/5" : "border-border hover:border-border/80",
    ].join(" ")}>
      {active && !outOfStock && <Icon icon="solar:check-circle-bold" width={18} height={18} className="absolute top-2.5 left-2.5 text-white z-10" />}
      <div>
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-3">
            <div className={["size-11 rounded-xl border flex items-center justify-center text-xl shrink-0 transition-colors",
              active && !outOfStock ? "bg-primary/20 text-primary border-primary/40" : "bg-secondary text-muted-foreground border-border",
            ].join(" ")}>
              <Icon icon={icon} />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-heading font-bold text-sm sm:text-base text-foreground">{name}</h3>
                {subTag && (
                  <span className={["px-1.5 py-0.5 rounded text-[9px] font-mono font-bold",
                    active && !outOfStock ? "bg-primary text-primary-foreground" : (subTagStyle ?? "text-muted-foreground bg-secondary"),
                  ].join(" ")}>{subTag}</span>
                )}
              </div>
              {note && <span className="text-[10px] font-mono text-muted-foreground">{note}</span>}
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-wide">1 CL</p>
            <p className={`font-mono font-bold text-sm leading-tight ${active && !outOfStock ? "text-primary" : "text-foreground"}`}>{pricePerCl} ₺</p>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground mt-2 line-clamp-2">{desc}</p>
      </div>
      <div className="mt-3.5 pt-3 border-t border-border/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {dragHandle}
          <span className="text-[11px] text-muted-foreground">{profile}</span>
        </div>
        <div className="flex items-center gap-2">
          {outOfStock && <span className="px-2.5 py-1 rounded-lg bg-muted text-muted-foreground text-[10px] font-bold font-mono">Tükendi</span>}
          <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-1.5 rounded-lg bg-secondary hover:bg-muted text-foreground border border-border transition-colors">
            <Icon icon="solar:pen-bold" width={13} height={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── DnD Wrappers ─────────────────────────────────────────────────────────────

function SortableSectionWrapper({ id, children }: { id: string; children: (handle: React.ReactNode) => React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.75 : 1 };
  const handle = (
    <button {...attributes} {...listeners} onClick={e => e.stopPropagation()}
      className="p-2 rounded-lg bg-secondary hover:bg-muted text-muted-foreground border border-border transition-colors cursor-grab active:cursor-grabbing shrink-0 touch-none"
      title="Sürükleyerek sırala">
      <Icon icon="solar:hamburger-menu-bold" width={14} height={14} />
    </button>
  );
  return <div ref={setNodeRef} style={style}>{children(handle)}</div>;
}

function SortableItemWrapper({ id, children }: { id: string; children: (handle: React.ReactNode) => React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.8 : 1, zIndex: isDragging ? 10 : undefined };
  const handle = (
    <button {...attributes} {...listeners} onClick={e => e.stopPropagation()}
      className="p-1 rounded-md bg-secondary hover:bg-muted text-muted-foreground/70 hover:text-muted-foreground border border-border transition-colors cursor-grab active:cursor-grabbing touch-none shrink-0"
      title="Sürükleyerek sırala">
      <Icon icon="solar:hamburger-menu-bold" width={10} height={10} />
    </button>
  );
  return <div ref={setNodeRef} style={style}>{children(handle)}</div>;
}

// ─── SectionHeader ────────────────────────────────────────────────────────────

function SectionHeader({ step, stepClass, title, activeCount, total, addLabel, onAdd, dragHandle }: {
  step: number; stepClass: string; title: string;
  activeCount: number; total: number; addLabel: string;
  onAdd: () => void;
  dragHandle?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 bg-muted/40 border-b border-border">
      {dragHandle}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`size-9 rounded-xl flex items-center justify-center font-bold font-mono text-sm shrink-0 ${stepClass}`}>{step}</div>
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <h3 className="font-heading font-bold text-base text-foreground uppercase">{title}</h3>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border shrink-0 ${activeCount > 0 ? "bg-primary/20 text-primary border-primary/30" : "bg-destructive/20 text-destructive border-destructive/30"}`}>
            {activeCount} / {total} Aktif
          </span>
        </div>
      </div>
      <button onClick={onAdd} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5 shadow-sm shrink-0 hover:bg-primary/90 transition-colors">
        <Icon icon="solar:add-circle-bold" width={14} height={14} />
        {addLabel}
      </button>
    </div>
  );
}

// ─── StepTitle with inline editing ───────────────────────────────────────────

function StepTitle({ step, total, title, sub, onTitleChange, onSubChange }: {
  step: number; total: number; title: string; sub: string;
  onTitleChange: (v: string) => void;
  onSubChange: (v: string) => void;
}) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingSub,   setEditingSub]   = useState(false);
  const [titleVal, setTitleVal] = useState(title);
  const [subVal,   setSubVal]   = useState(sub);

  useEffect(() => { if (!editingTitle) setTitleVal(title); }, [title, editingTitle]);
  useEffect(() => { if (!editingSub)   setSubVal(sub);     }, [sub, editingSub]);

  const commitTitle = () => { setEditingTitle(false); onTitleChange(titleVal); };
  const commitSub   = () => { setEditingSub(false);   onSubChange(subVal); };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 text-[10px] font-mono font-bold uppercase shrink-0">Adım {step} / {total}</span>
        {editingTitle ? (
          <input autoFocus value={titleVal} onChange={e => setTitleVal(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={e => { if (e.key === "Enter") commitTitle(); if (e.key === "Escape") setEditingTitle(false); }}
            className="flex-1 bg-secondary border border-primary/50 rounded-lg px-2 py-0.5 font-heading text-lg sm:text-2xl font-bold uppercase tracking-wider text-foreground focus:outline-none" />
        ) : (
          <h2 className="font-heading text-lg sm:text-2xl font-bold uppercase tracking-wider text-foreground">{title}</h2>
        )}
        <button onClick={() => { setEditingTitle(true); setTitleVal(title); }}
          className="p-1.5 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground border border-border transition-colors shrink-0">
          <Icon icon="solar:pen-bold" width={12} height={12} />
        </button>
      </div>
      <div className="flex items-center gap-2">
        {editingSub ? (
          <input autoFocus value={subVal} onChange={e => setSubVal(e.target.value)}
            onBlur={commitSub}
            onKeyDown={e => { if (e.key === "Enter") commitSub(); if (e.key === "Escape") setEditingSub(false); }}
            className="flex-1 bg-secondary border border-primary/50 rounded-lg px-2 py-0.5 text-xs text-foreground focus:outline-none" />
        ) : (
          <p className="text-xs text-muted-foreground">{sub}</p>
        )}
        <button onClick={() => { setEditingSub(true); setSubVal(sub); }}
          className="p-1 rounded-md bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground border border-border transition-colors shrink-0">
          <Icon icon="solar:pen-bold" width={11} height={11} />
        </button>
      </div>
    </div>
  );
}

// ─── Diff helpers ─────────────────────────────────────────────────────────────

function diffLabItem(pub: ApiLabItem, cur: ApiLabItem): string[] {
  const d: string[] = [];
  if (pub.isActive !== cur.isActive)
    d.push(`Durum: ${pub.isActive ? 'Aktif' : 'Pasif'} → ${cur.isActive ? 'Aktif' : 'Pasif'}`);
  if (pub.name !== cur.name)
    d.push(`İsim: ${pub.name} → ${cur.name}`);
  if ((pub.subTag ?? '') !== (cur.subTag ?? ''))
    d.push(`Etiket: ${pub.subTag ?? '—'} → ${cur.subTag ?? '—'}`);
  if ((pub.note ?? '') !== (cur.note ?? ''))
    d.push(`Not: ${pub.note ?? '—'} → ${cur.note ?? '—'}`);
  if (pub.pricePerCl !== cur.pricePerCl)
    d.push(`1 CL Fiyatı: ${pub.pricePerCl ?? '—'} → ${cur.pricePerCl ?? '—'}`);
  if (pub.ml !== cur.ml)
    d.push(`ML: ${pub.ml ?? '—'} → ${cur.ml ?? '—'}`);
  if (pub.outOfStock !== cur.outOfStock)
    d.push(`Stok: ${pub.outOfStock ? 'Tükendi' : 'Var'} → ${cur.outOfStock ? 'Tükendi' : 'Var'}`);
  if (pub.sortOrder !== cur.sortOrder)
    d.push(`Sıra: ${pub.sortOrder} → ${cur.sortOrder}`);
  return d;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CocktailLabPage() {
  const withLoading = useLoading();
  const [glasses,   setGlasses]   = useState<Glass[]>([]);
  const [spirits,   setSpirits]   = useState<Spirit[]>([]);
  const [mixers,    setMixers]    = useState<Mixer[]>([]);
  const [cordials,  setCordials]  = useState<Cordial[]>([]);
  const [ice,       setIce]       = useState<Ice[]>([]);
  const [garnishes, setGarnishes] = useState<Garnish[]>([]);

  const [sectionOrder, setSectionOrder] = useState<SectionSlug[]>(["glass","spirit","mixer","cordial","ice","garnish"]);
  const [stepTitles,   setStepTitles]   = useState(DEFAULT_TITLES);
  const [stepIdMap,    setStepIdMap]    = useState<Record<SectionSlug, string>>({} as Record<SectionSlug, string>);

  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [editForm,   setEditForm]   = useState<Record<string, string | number | boolean | undefined>>({});

  const [addSlug, setAddSlug] = useState<SectionSlug | null>(null);
  const [addForm, setAddForm] = useState<Record<string, string | number | boolean | undefined>>({});

  const [publishState, setPublishState] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [changesList, setChangesList] = useState<ChangeEntry[] | null>(null);
  const [showChanges, setShowChanges] = useState(false);
  const [snapshotLoaded, setSnapshotLoaded] = useState(false);
  const toggleDebounce = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  // raw API-format maps for client-side diff
  const rawItemsMap   = useRef<Map<string, ApiLabItem>>(new Map());
  const itemCtxMap    = useRef<Map<string, string>>(new Map());
  const pubItemsMap   = useRef<Map<string, ApiLabItem>>(new Map());
  const pubItemCtxMap = useRef<Map<string, string>>(new Map());
  // step-level diff
  type StepMeta = { id: string; stepOrder: number; title: string; subtitle: string | null };
  const rawStepsMeta = useRef<StepMeta[]>([]);
  const pubStepsMeta = useRef<StepMeta[]>([]);

  const hasChanges = changesList === null || changesList.length > 0;

  const recomputeDiff = useCallback(() => {
    if (!pubItemsMap.current.size && !pubStepsMeta.current.length) { setChangesList(null); return; }
    const result: ChangeEntry[] = [];
    for (const [id, cur] of rawItemsMap.current) {
      const pub = pubItemsMap.current.get(id);
      const ctx = itemCtxMap.current.get(id) ?? pubItemCtxMap.current.get(id) ?? '';
      if (!pub) result.push({ id, label: cur.name, context: ctx, status: 'added' });
      else if (hashData(cur) !== hashData(pub)) result.push({ id, label: cur.name, context: ctx, status: 'updated', details: diffLabItem(pub, cur) });
    }
    for (const [id, pub] of pubItemsMap.current) {
      if (!rawItemsMap.current.has(id))
        result.push({ id, label: pub.name, context: pubItemCtxMap.current.get(id) ?? '', status: 'removed' });
    }
    // step-level (reorder / title / sub)
    const curStepsH = hashData([...rawStepsMeta.current].sort((a, b) => a.stepOrder - b.stepOrder));
    const pubStepsH = hashData([...pubStepsMeta.current].sort((a, b) => a.stepOrder - b.stepOrder));
    if (pubStepsMeta.current.length && curStepsH !== pubStepsH)
      result.push({ id: '__steps__', label: 'Adım yapısı / başlıklar', context: 'Genel', status: 'updated' });
    setChangesList(result);
  }, []);

  const handlePublish = async () => {
    setPublishState("loading");
    try {
      await withLoading(async () => {
        const freshRes = await fetch(`${API_URL}/cocktail-lab`, { cache: "no-store" });
        const freshData = await freshRes.json();
        const hash = hashData(freshData);
        await fetch(`${API_URL}/site-config`, {
          method: "PATCH",
          headers: ADMIN_HEADERS,
          body: JSON.stringify({ labHash: hash, labSnapshot: JSON.stringify(freshData) }),
        });
        fetch(
          `${process.env.NEXT_PUBLIC_WEB_URL}/api/revalidate?secret=${process.env.NEXT_PUBLIC_REVALIDATE_SECRET}&tag=cocktail-lab`,
          { method: "POST" },
        ).catch(() => {});
        // Sync snapshot refs so diff resets to zero
        const freshSteps: ApiLabStep[] = freshData;
        pubItemsMap.current.clear(); pubItemCtxMap.current.clear(); pubStepsMeta.current = [];
        for (const step of freshSteps) {
          pubStepsMeta.current.push({ id: step.id, stepOrder: step.stepOrder, title: step.title, subtitle: step.subtitle });
          for (const item of step.items) {
            pubItemsMap.current.set(item.id, item);
            pubItemCtxMap.current.set(item.id, step.title);
          }
        }
        recomputeDiff();
      });
      setPublishState("ok");
      setShowChanges(false);
    } catch {
      setPublishState("err");
    }
    setTimeout(() => setPublishState("idle"), 3000);
  };

  const handleReset = async () => {
    if (!pubItemsMap.current.size) { await fetchAndLoad(); return; }
    await withLoading(async () => {
      const ops: Promise<unknown>[] = [];
      // Restore changed items to published state
      for (const [id, pub] of pubItemsMap.current) {
        const cur = rawItemsMap.current.get(id);
        if (!cur || hashData(cur) === hashData(pub)) continue;
        const { id: _id, ...fields } = pub;
        ops.push(fetch(`${API_URL}/cocktail-lab/items/${id}`, { method: "PATCH", headers: ADMIN_HEADERS, body: JSON.stringify(fields) }));
      }
      // Delete items added since last publish
      for (const [id] of rawItemsMap.current) {
        if (!pubItemsMap.current.has(id))
          ops.push(fetch(`${API_URL}/cocktail-lab/items/${id}`, { method: "DELETE", headers: ADMIN_HEADERS }));
      }
      // Restore step order if changed
      const pubOrder = [...pubStepsMeta.current].sort((a, b) => a.stepOrder - b.stepOrder).map(s => s.id);
      const curOrder = [...rawStepsMeta.current].sort((a, b) => a.stepOrder - b.stepOrder).map(s => s.id);
      if (pubOrder.length && hashData(pubOrder) !== hashData(curOrder))
        ops.push(fetch(`${API_URL}/cocktail-lab/steps/reorder`, { method: "PATCH", headers: ADMIN_HEADERS, body: JSON.stringify({ ids: pubOrder }) }));
      await Promise.all(ops);
      await fetchAndLoad();
    });
  };

  const sensors = useSensors(useSensor(PointerSensor));

  // ── Backend fetch ─────────────────────────────────────────────────────────

  const fetchAndLoad = useCallback(() => withLoading(async () => {
    try {
      const [res, cfgRes] = await Promise.all([
        fetch(`${API_URL}/cocktail-lab`, { cache: "no-store" }),
        fetch(`${API_URL}/site-config`, { cache: "no-store" }),
      ]);
      const steps: ApiLabStep[] = await res.json();
      const cfg = cfgRes.ok ? await cfgRes.json() : null;

      // Rebuild raw maps
      rawItemsMap.current.clear(); itemCtxMap.current.clear(); rawStepsMeta.current = [];
      for (const step of steps) {
        rawStepsMeta.current.push({ id: step.id, stepOrder: step.stepOrder, title: step.title, subtitle: step.subtitle });
        for (const item of step.items) { rawItemsMap.current.set(item.id, item); itemCtxMap.current.set(item.id, step.title); }
      }
      // Rebuild snapshot maps (always refresh from cfg)
      if (cfg?.labSnapshot) {
        const pub: ApiLabStep[] = JSON.parse(cfg.labSnapshot);
        pubItemsMap.current.clear(); pubItemCtxMap.current.clear(); pubStepsMeta.current = [];
        for (const step of pub) {
          pubStepsMeta.current.push({ id: step.id, stepOrder: step.stepOrder, title: step.title, subtitle: step.subtitle });
          for (const item of step.items) { pubItemsMap.current.set(item.id, item); pubItemCtxMap.current.set(item.id, step.title); }
        }
      }
      setSnapshotLoaded(true);
      recomputeDiff();

      const newIdMap: Partial<Record<SectionSlug, string>> = {};
      const newTitles = { ...DEFAULT_TITLES };

      for (const step of steps) {
        const slug = step.slug as SectionSlug;
        newIdMap[slug] = step.id;
        newTitles[slug] = { title: step.title, sub: step.subtitle ?? DEFAULT_TITLES[slug]?.sub ?? "" };

        switch (slug) {
          case "glass":
            setGlasses(step.items.map(i => ({
              id: i.id,
              imgSrc: GLASS_IMG_MAP[i.id] ?? "",
              name: i.name,
              active: i.isActive,
              ml: i.ml ?? 0,
            })));
            break;
          case "spirit":
            setSpirits(step.items.map(i => ({
              id: i.id,
              name: i.name,
              subTag: i.subTag ?? "",
              subTagStyle: i.subTagStyle ?? undefined,
              note: i.note ?? "",
              desc: i.description ?? "",
              pricePerCl: i.pricePerCl ?? 0,
              icon: i.icon ?? "solar:bottle-bold",
              profile: i.profile ?? "",
              active: i.isActive,
              outOfStock: i.outOfStock,
            })));
            break;
          case "mixer":
            setMixers(step.items.map(i => ({
              id: i.id,
              name: i.name,
              subTag: i.subTag ?? "",
              subTagStyle: i.subTagStyle ?? undefined,
              note: i.note ?? "",
              desc: i.description ?? "",
              pricePerCl: i.pricePerCl ?? 0,
              icon: i.icon ?? "solar:bottle-2-bold",
              profile: i.profile ?? "",
              active: i.isActive,
            })));
            break;
          case "cordial":
            setCordials(step.items.map(i => ({
              id: i.id,
              name: i.name,
              subTag: i.subTag ?? "",
              subTagStyle: i.subTagStyle ?? undefined,
              note: i.note ?? "",
              desc: i.description ?? "",
              pricePerCl: i.pricePerCl ?? 0,
              icon: i.icon ?? "solar:drop-bold",
              profile: i.profile ?? "",
              active: i.isActive,
            })));
            break;
          case "ice":
            setIce(step.items.map(i => ({
              id: i.id,
              name: i.name,
              subTag: i.subTag ?? "",
              desc: i.description ?? "",
              icon: i.icon ?? "solar:snowflake-bold",
              profile: i.profile ?? "",
              active: i.isActive,
            })));
            break;
          case "garnish":
            setGarnishes(step.items.map(i => ({
              id: i.id,
              name: i.name,
              subTag: i.subTag ?? "",
              subTagStyle: i.subTagStyle ?? undefined,
              desc: i.description ?? "",
              icon: i.icon ?? "solar:leaf-bold",
              colorClass: i.colorClass ?? "text-muted-foreground",
              profile: i.profile ?? "",
              active: i.isActive,
            })));
            break;
        }
      }

      setStepIdMap(newIdMap as Record<SectionSlug, string>);
      setStepTitles(newTitles);

      const sorted = [...steps].sort((a, b) => a.stepOrder - b.stepOrder).map(s => s.slug as SectionSlug);
      setSectionOrder(sorted);
    } catch {
      // silently fail
    }
  }), [withLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchAndLoad(); }, [fetchAndLoad]);

  // ── Helpers ──────────────────────────────────────────────────────────────

  function toggleActive(id: string, currentActive: boolean, setter: React.Dispatch<React.SetStateAction<any[]>>) {
    setter(prev => prev.map((x: any) => x.id === id ? { ...x, active: !x.active } : x));
    const cur = rawItemsMap.current.get(id);
    if (cur) { rawItemsMap.current.set(id, { ...cur, isActive: !currentActive }); recomputeDiff(); }
    const existing = toggleDebounce.current.get(id);
    if (existing) clearTimeout(existing);
    const timer = setTimeout(() => {
      toggleDebounce.current.delete(id);
      withLoading(() => fetch(`${API_URL}/cocktail-lab/items/${id}`, {
        method: "PATCH",
        headers: ADMIN_HEADERS,
        body: JSON.stringify({ isActive: !currentActive }),
      })).catch(console.error);
    }, 400);
    toggleDebounce.current.set(id, timer);
  }

  const openEdit = (target: EditTarget) => {
    setEditTarget(target);
    setEditForm({ ...target.item } as Record<string, string | number | boolean | undefined>);
  };

  const setField    = (key: string, value: string | number | boolean) => setEditForm(p => ({ ...p, [key]: value }));
  const setAddField = (key: string, value: string | number | boolean) => setAddForm(p => ({ ...p, [key]: value }));

  const handleSave = () => {
    if (!editTarget) return;
    const id = editTarget.item.id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const patch = { ...editForm } as Record<string, any>;

    // Update local state
    switch (editTarget.type) {
      case "glass":
        setGlasses(p => p.map(x => x.id === id ? { ...x, ...patch, ml: Number(patch.ml) || 0 } : x)); break;
      case "spirit":
        setSpirits(p => p.map((x: any) => x.id === id ? { ...x, ...patch, pricePerCl: Number(patch.pricePerCl) || 0 } : x)); break;
      case "mixer":
        setMixers(p => p.map((x: any) => x.id === id ? { ...x, ...patch, pricePerCl: Number(patch.pricePerCl) || 0 } : x)); break;
      case "cordial":
        setCordials(p => p.map((x: any) => x.id === id ? { ...x, ...patch, pricePerCl: Number(patch.pricePerCl) || 0 } : x)); break;
      case "ice":
        setIce(p => p.map((x: any) => x.id === id ? { ...x, ...patch } : x)); break;
      case "garnish":
        setGarnishes(p => p.map((x: any) => x.id === id ? { ...x, ...patch } : x)); break;
    }

    // Build API payload
    let apiPayload: Record<string, unknown> = {};
    if (editTarget.type === "glass") {
      apiPayload = { name: patch.name, ml: Number(patch.ml) || 0 };
    } else if (editTarget.type === "spirit") {
      apiPayload = { name: patch.name, subTag: patch.subTag || null, subTagStyle: patch.subTagStyle || null, note: patch.note || null, description: patch.desc || null, pricePerCl: Number(patch.pricePerCl) || null, icon: patch.icon || null, profile: patch.profile || null, outOfStock: Boolean(patch.outOfStock) };
    } else if (editTarget.type === "mixer" || editTarget.type === "cordial") {
      apiPayload = { name: patch.name, subTag: patch.subTag || null, subTagStyle: patch.subTagStyle || null, note: patch.note || null, description: patch.desc || null, pricePerCl: Number(patch.pricePerCl) || null, icon: patch.icon || null, profile: patch.profile || null, imageUrl: patch.imageUrl || null };
    } else if (editTarget.type === "ice") {
      apiPayload = { name: patch.name, subTag: patch.subTag || null, description: patch.desc || null, icon: patch.icon || null, profile: patch.profile || null, imageUrl: patch.imageUrl || null };
    } else if (editTarget.type === "garnish") {
      apiPayload = { name: patch.name, subTag: patch.subTag || null, subTagStyle: patch.subTagStyle || null, description: patch.desc || null, icon: patch.icon || null, colorClass: patch.colorClass || null, profile: patch.profile || null, imageUrl: patch.imageUrl || null };
    }

    withLoading(() => fetch(`${API_URL}/cocktail-lab/items/${id}`, {
      method: "PATCH",
      headers: ADMIN_HEADERS,
      body: JSON.stringify(apiPayload),
    })).catch(console.error);

    setEditTarget(null);
    const cur = rawItemsMap.current.get(id);
    if (cur) { rawItemsMap.current.set(id, { ...cur, ...(apiPayload as Partial<ApiLabItem>) }); recomputeDiff(); }
  };

  const openAdd = (slug: SectionSlug) => {
    setAddSlug(slug);
    setAddForm({ ...EMPTY_FORMS[slug] });
  };

  const handleAdd = async () => {
    if (!addSlug) return;
    const stepId = stepIdMap[addSlug];
    if (!stepId) { setAddSlug(null); return; }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = { ...addForm } as Record<string, any>;

    let payload: Record<string, unknown> = { stepId, name: p.name || "Yeni öğe", isActive: true, outOfStock: false };
    if (addSlug === "glass") {
      payload = { ...payload, ml: Number(p.ml) || 0 };
    } else if (addSlug === "spirit") {
      payload = { ...payload, subTag: p.subTag || null, subTagStyle: p.subTagStyle || null, note: p.note || null, description: p.desc || null, pricePerCl: Number(p.pricePerCl) || null, icon: p.icon || "solar:bottle-bold", profile: p.profile || null };
    } else if (addSlug === "mixer" || addSlug === "cordial") {
      payload = { ...payload, subTag: p.subTag || null, subTagStyle: p.subTagStyle || null, note: p.note || null, description: p.desc || null, pricePerCl: Number(p.pricePerCl) || null, icon: p.icon || null, profile: p.profile || null, imageUrl: p.imageUrl || null };
    } else if (addSlug === "ice") {
      payload = { ...payload, subTag: p.subTag || null, description: p.desc || null, icon: p.icon || "solar:snowflake-bold", profile: p.profile || null, imageUrl: p.imageUrl || null };
    } else if (addSlug === "garnish") {
      payload = { ...payload, subTag: p.subTag || null, subTagStyle: p.subTagStyle || null, description: p.desc || null, icon: p.icon || "solar:leaf-bold", colorClass: p.colorClass || "text-muted-foreground", profile: p.profile || null, imageUrl: p.imageUrl || null };
    }

    setAddSlug(null);
    try {
      await withLoading(async () => {
        await fetch(`${API_URL}/cocktail-lab/items`, {
          method: "POST",
          headers: ADMIN_HEADERS,
          body: JSON.stringify(payload),
        });
        await fetchAndLoad();
      });
      // fetchAndLoad rebuilds maps and calls recomputeDiff
    } catch (e) {
      console.error(e);
    }
  };

  // ── Drag end handlers ─────────────────────────────────────────────────────

  const handleSectionDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const newOrder = arrayMove(sectionOrder, sectionOrder.indexOf(active.id as SectionSlug), sectionOrder.indexOf(over.id as SectionSlug));
    setSectionOrder(newOrder);
    const ids = newOrder.map(slug => stepIdMap[slug]).filter(Boolean);
    if (ids.length > 0) {
      withLoading(() => fetch(`${API_URL}/cocktail-lab/steps/reorder`, {
        method: "PATCH",
        headers: ADMIN_HEADERS,
        body: JSON.stringify({ ids }),
      })).catch(console.error);
    }
    newOrder.forEach((slug, idx) => {
      const stepId = stepIdMap[slug]; if (!stepId) return;
      const meta = rawStepsMeta.current.find(m => m.id === stepId);
      if (meta) meta.stepOrder = idx;
    });
    recomputeDiff();
  };

  const handleItemDragEnd = (slug: SectionSlug) => (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const arr = getItems(slug) as { id: string }[];
    const from = arr.findIndex(x => x.id === active.id);
    const to = arr.findIndex(x => x.id === over.id);
    const newArr = arrayMove([...arr], from, to);
    switch (slug) {
      case "glass":   setGlasses(newArr as Glass[]); break;
      case "spirit":  setSpirits(newArr as Spirit[]); break;
      case "mixer":   setMixers(newArr as Mixer[]); break;
      case "cordial": setCordials(newArr as Cordial[]); break;
      case "ice":     setIce(newArr as Ice[]); break;
      case "garnish": setGarnishes(newArr as Garnish[]); break;
    }
    withLoading(() => fetch(`${API_URL}/cocktail-lab/items/reorder`, {
      method: "PATCH",
      headers: ADMIN_HEADERS,
      body: JSON.stringify({ ids: newArr.map(x => x.id) }),
    })).catch(console.error);
    newArr.forEach((item, idx) => {
      const cur = rawItemsMap.current.get(item.id);
      if (cur) rawItemsMap.current.set(item.id, { ...cur, sortOrder: idx });
    });
    recomputeDiff();
  };

  // ── Section renderer ──────────────────────────────────────────────────────

  const getItems = (slug: SectionSlug) => {
    switch (slug) {
      case "glass":   return glasses;
      case "spirit":  return spirits;
      case "mixer":   return mixers;
      case "cordial": return cordials;
      case "ice":     return ice;
      case "garnish": return garnishes;
    }
  };

  const renderSectionItems = (slug: SectionSlug, stepNum: number) => {
    const titles = stepTitles[slug];

    return (
      <div className="p-5 sm:p-6 space-y-5">
        <StepTitle
          step={stepNum} total={sectionOrder.length}
          title={titles.title} sub={titles.sub}
          onTitleChange={v => {
            setStepTitles(p => ({ ...p, [slug]: { ...p[slug], title: v } }));
            const meta = rawStepsMeta.current.find(m => m.id === stepIdMap[slug]);
            if (meta) { meta.title = v; recomputeDiff(); }
            if (stepIdMap[slug]) withLoading(() => fetch(`${API_URL}/cocktail-lab/steps/${stepIdMap[slug]}`, { method: "PATCH", headers: ADMIN_HEADERS, body: JSON.stringify({ title: v }) })).catch(console.error);
          }}
          onSubChange={v => {
            setStepTitles(p => ({ ...p, [slug]: { ...p[slug], sub: v } }));
            const meta = rawStepsMeta.current.find(m => m.id === stepIdMap[slug]);
            if (meta) { meta.subtitle = v; recomputeDiff(); }
            if (stepIdMap[slug]) withLoading(() => fetch(`${API_URL}/cocktail-lab/steps/${stepIdMap[slug]}`, { method: "PATCH", headers: ADMIN_HEADERS, body: JSON.stringify({ subtitle: v }) })).catch(console.error);
          }}
        />

        {/* ── Glass ── */}
        {slug === "glass" && (
          <DndContext id="dnd-glass" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleItemDragEnd("glass")}>
            <SortableContext items={glasses.map(g => g.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {glasses.map(glass => (
                  <SortableItemWrapper key={glass.id} id={glass.id}>
                    {(handle) => (
                      <div onClick={() => toggleActive(glass.id, glass.active, setGlasses)} className={[
                        "bg-card rounded-2xl border-2 p-4 flex flex-col items-center text-center gap-3 relative transition-all cursor-pointer",
                        glass.active ? "border-primary shadow-md shadow-primary/5" : "border-border opacity-50 hover:opacity-70",
                      ].join(" ")}>
                        {glass.active && <Icon icon="solar:check-circle-bold" width={18} height={18} className="absolute top-2.5 left-2.5 text-white z-10" />}
                        <button onClick={e => { e.stopPropagation(); openEdit({ type: "glass", item: glass }); }}
                          className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-background/80 hover:bg-muted text-muted-foreground hover:text-foreground border border-border transition-colors z-10">
                          <Icon icon="solar:pen-bold" width={11} height={11} />
                        </button>
                        <div className="w-full h-28 flex items-end justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={glass.imgSrc} alt={glass.name} className={["h-full w-auto invert transition-opacity", glass.active ? "opacity-100" : "opacity-40"].join(" ")} />
                        </div>
                        <h3 className="font-heading font-bold text-sm text-foreground leading-tight">{glass.name}</h3>
                        <div className="flex items-center justify-between w-full pt-1.5 border-t border-border/60">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-muted-foreground bg-secondary border border-border">{glass.ml} ml</span>
                          {handle}
                        </div>
                      </div>
                    )}
                  </SortableItemWrapper>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* ── Spirit / Mixer / Cordial ── */}
        {(slug === "spirit" || slug === "mixer" || slug === "cordial") && (() => {
          const arr = slug === "spirit" ? spirits : slug === "mixer" ? mixers : cordials;
          const setter = slug === "spirit" ? setSpirits : slug === "mixer" ? setMixers : setCordials;
          return (
            <DndContext id={`dnd-${slug}`} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleItemDragEnd(slug)}>
              <SortableContext items={arr.map(x => x.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {arr.map(item => (
                    <SortableItemWrapper key={item.id} id={item.id}>
                      {(handle) => (
                        <VariantCard key={item.id} {...item}
                          dragHandle={handle}
                          onToggle={() => toggleActive(item.id, item.active, setter)}
                          onEdit={() => openEdit({ type: slug, item: item as any })}
                        />
                      )}
                    </SortableItemWrapper>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          );
        })()}

        {/* ── Ice ── */}
        {slug === "ice" && (
          <DndContext id="dnd-ice" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleItemDragEnd("ice")}>
            <SortableContext items={ice.map(i => i.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {ice.map(item => (
                  <SortableItemWrapper key={item.id} id={item.id}>
                    {(handle) => (
                      <div onClick={() => toggleActive(item.id, item.active, setIce)} className={[
                        "bg-card rounded-2xl border-2 p-5 cursor-pointer transition-all flex flex-col justify-between gap-3 relative",
                        item.active ? "border-primary shadow-md shadow-primary/5" : "border-border opacity-50 hover:opacity-70",
                      ].join(" ")}>
                        {item.active && <Icon icon="solar:check-circle-bold" width={18} height={18} className="absolute top-2.5 left-2.5 text-white z-10" />}
                        <div className="flex items-start gap-3">
                          <div className={["size-12 rounded-xl border flex items-center justify-center text-2xl shrink-0 transition-colors",
                            item.active ? "bg-primary/20 text-primary border-primary/40" : "bg-secondary text-muted-foreground border-border",
                          ].join(" ")}>
                            <Icon icon={item.icon} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h3 className="font-heading font-bold text-sm sm:text-base text-foreground">{item.name}</h3>
                              {item.subTag && <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-sky-300 bg-sky-500/10">{item.subTag}</span>}
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1">{item.desc}</p>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-border/80 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {handle}
                            <span className="text-[11px] font-mono text-muted-foreground">{item.profile}</span>
                          </div>
                          <button onClick={e => { e.stopPropagation(); openEdit({ type: "ice", item }); }}
                            className="p-1.5 rounded-lg bg-secondary hover:bg-muted text-foreground border border-border transition-colors">
                            <Icon icon="solar:pen-bold" width={13} height={13} />
                          </button>
                        </div>
                      </div>
                    )}
                  </SortableItemWrapper>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* ── Garnish ── */}
        {slug === "garnish" && (
          <DndContext id="dnd-garnish" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleItemDragEnd("garnish")}>
            <SortableContext items={garnishes.map(g => g.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {garnishes.map(g => (
                  <SortableItemWrapper key={g.id} id={g.id}>
                    {(handle) => (
                      <div onClick={() => toggleActive(g.id, g.active, setGarnishes)} className={[
                        "bg-card rounded-2xl border-2 p-4 cursor-pointer transition-all flex flex-col items-center text-center gap-2 relative",
                        g.active ? "border-primary shadow-md shadow-primary/5" : "border-border opacity-50 hover:opacity-70",
                      ].join(" ")}>
                        {g.active && <Icon icon="solar:check-circle-bold" width={18} height={18} className="absolute top-2.5 left-2.5 text-white z-10" />}
                        <button onClick={e => { e.stopPropagation(); openEdit({ type: "garnish", item: g }); }}
                          className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-background/80 hover:bg-muted text-muted-foreground hover:text-foreground border border-border transition-colors z-10">
                          <Icon icon="solar:pen-bold" width={11} height={11} />
                        </button>
                        <div className={["size-14 rounded-xl border flex items-center justify-center text-2xl transition-colors",
                          g.active ? "bg-primary/20 border-primary/40" : "bg-secondary border-border",
                        ].join(" ")}>
                          <Icon icon={g.icon} className={g.active ? "text-primary" : g.colorClass} />
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-xs sm:text-sm text-foreground leading-tight">{g.name}</h3>
                          <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{g.profile}</p>
                        </div>
                        <div className="mt-auto pt-1.5 border-t border-border/60 w-full flex items-center justify-between">
                          {g.subTag ? (
                            <span className={["px-1.5 py-0.5 rounded text-[9px] font-mono font-bold inline-block",
                              g.active ? "bg-primary text-primary-foreground" : (g.subTagStyle ?? "text-muted-foreground bg-secondary"),
                            ].join(" ")}>{g.subTag}</span>
                          ) : <span />}
                          {handle}
                        </div>
                      </div>
                    )}
                  </SortableItemWrapper>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    );
  };

  // ── JSX ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-white">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-md shadow-primary/20">
                <Icon icon="solar:shield-star-bold" width={20} height={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading text-lg sm:text-xl font-bold uppercase tracking-wider text-foreground">Bilkent York</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-primary/20 text-primary border border-primary/30">Admin Panel</span>
                </div>
                <p className="text-[11px] text-muted-foreground font-mono">Kokteyl Lab Stüdyosu &amp; Adım Adım Malzeme Mimarisi</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 pl-2 border-l border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://lh3.googleusercontent.com/a/ACg8ocJCxwMUJaUR_K6XCsiAdpE7nvLNJBzBaXmv3EjdUs_F69FMRS4=s96-c" alt="Badu Alp Ustagül" className="size-8 rounded-lg border border-primary/50 object-cover" />
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold leading-none text-foreground">Badu Alp Ustagül</p>
                  <p className="text-[10px] text-primary font-mono">Head Executive</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tab nav */}
      <div className="bg-card border-b border-border/80 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 overflow-x-auto py-2.5 text-xs">
            <Link href="/" className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted font-medium flex items-center gap-2 shrink-0 transition-colors">
              <Icon icon="solar:chart-square-bold" width={16} height={16} />Genel Bakış
            </Link>
            <Link href="/menu" className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted font-medium flex items-center gap-2 shrink-0 transition-colors">
              <Icon icon="solar:menu-dots-square-bold" width={16} height={16} />Menü
            </Link>
            <Link href="/cocktail-lab" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-2 shrink-0 shadow-sm">
              <Icon icon="solar:cup-hot-bold" width={16} height={16} />Kokteyl Lab
            </Link>
            <Link href="/leaderboard" className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted font-medium flex items-center gap-2 shrink-0 transition-colors">
              <Icon icon="solar:cup-star-bold" width={16} height={16} />Liderlik Tablosu
            </Link>
            <Link href="/orders" className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted font-medium flex items-center gap-2 shrink-0 transition-colors">
              <Icon icon="solar:bill-list-bold" width={16} height={16} />Siparişler
            </Link>
          </nav>
        </div>
      </div>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border/60">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wider text-foreground flex items-center gap-2.5">
              <span>KOKTEYL LAB MİMARİSİ &amp; AYARLARI</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-primary/20 text-primary border border-primary/30">Customizer Aktif</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1">Müşterilerin kendi kokteyllerini yapacağı 6 adımı bağımsız bölümler halinde yapılandırın.</p>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
            {sectionOrder.map((slug, i) => (
              <a key={slug} href={`#step-${slug}`} className="px-2.5 py-1.5 rounded-lg bg-secondary text-foreground hover:bg-muted font-medium shrink-0 transition-colors">
                {i + 1}. {slug === "glass" ? "Kadehler" : slug === "spirit" ? "Bazlar" : slug === "mixer" ? "Mikserler" : slug === "cordial" ? "Şuruplar" : slug === "ice" ? "Buz" : "Garnitür"}
              </a>
            ))}
          </div>
        </div>

        {/* Sections — draggable */}
        <DndContext id="dnd-sections" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
          <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
            <div className="space-y-10">
              {sectionOrder.map((slug, index) => {
                const stepNum = index + 1;
                const meta = SECTION_META[slug];
                const items = getItems(slug);
                const activeCount = items.filter((x: any) => x.active).length;
                return (
                  <SortableSectionWrapper key={slug} id={slug}>
                    {(dragHandle) => (
                      <section id={`step-${slug}`} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                        <SectionHeader
                          step={stepNum}
                          stepClass={meta.stepClass}
                          title={`${stepNum}. ADIM: ${meta.headerTitle}`}
                          activeCount={activeCount}
                          total={items.length}
                          addLabel={meta.addLabel}
                          onAdd={() => openAdd(slug)}
                          dragHandle={dragHandle}
                        />
                        {renderSectionItems(slug, stepNum)}
                      </section>
                    )}
                  </SortableSectionWrapper>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      </main>

      {/* Edit Modal */}
      {editTarget && (
        <EditModal target={editTarget} form={editForm} onSet={setField} onSave={handleSave} onClose={() => setEditTarget(null)} />
      )}

      {/* Add Modal */}
      {addSlug && (
        <EditModal
          target={{ type: addSlug, item: {} as any }}
          form={addForm}
          onSet={setAddField}
          onSave={handleAdd}
          onClose={() => setAddSlug(null)}
          isNew
        />
      )}

      {/* Overlay to close changes panel on outside click */}
      {showChanges && (
        <div className="fixed inset-0 z-[49]" onClick={() => setShowChanges(false)} />
      )}

      {/* Fixed publish bar — always visible */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {/* Changes panel */}
        <AnimatePresence>
          {showChanges && (
            <motion.div
              key="changes-panel"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "20rem", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden" }}
            >
              <div className="w-80 bg-card border border-border rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <span className="text-sm font-semibold">Yayınlanmamış Değişiklikler</span>
                  <button onClick={() => setShowChanges(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                    <Icon icon="solar:close-circle-bold" width={16} />
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {changesList === null ? (
                    <p className="px-4 py-4 text-sm text-muted-foreground">Önceki yayın bulunamadı. İlk yayın olacak.</p>
                  ) : changesList.length === 0 ? (
                    <div className="flex items-center gap-2 px-4 py-4 text-sm text-muted-foreground">
                      <Icon icon="solar:check-circle-bold" className="text-green-400 shrink-0" width={16} />
                      Yayınlanan ile aynı içerik.
                    </div>
                  ) : (
                    <div className="p-2 space-y-0.5">
                      {changesList.map((c) => (
                        <div key={c.id} className="px-2 py-1.5 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-2.5">
                            <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide ${
                              c.status === 'added'   ? 'bg-green-500/20 text-green-400' :
                              c.status === 'updated' ? 'bg-amber-500/20 text-amber-400' :
                                                       'bg-red-500/20 text-red-400'
                            }`}>
                              {c.status === 'added' ? 'Yeni' : c.status === 'updated' ? 'Değişti' : 'Silindi'}
                            </span>
                            <span className="text-sm truncate flex-1">{c.label}</span>
                            <span className="text-xs text-muted-foreground shrink-0">{c.context}</span>
                          </div>
                          {c.details && c.details.length > 0 && (
                            <div className="mt-0.5 pl-3 space-y-0">
                              {c.details.map((d, i) => (
                                <p key={i} className="text-[10px] font-mono text-muted-foreground/70 leading-5">{d}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-2 w-48">
          {/* Değişiklikleri Gör */}
          <button
            onClick={() => setShowChanges(p => !p)}
            disabled={!snapshotLoaded}
            className={`w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border shadow-xl transition-colors disabled:opacity-50 ${
              showChanges
                ? 'bg-primary/10 text-primary border-primary/30'
                : 'bg-secondary text-secondary-foreground border-border hover:bg-muted'
            }`}
          >
            <Icon icon={!snapshotLoaded ? "svg-spinners:ring-resize" : "solar:eye-bold"} width={15} />
            Değişiklikleri Gör
          </button>

          {/* Sıfırla */}
          <button
            onClick={handleReset}
            disabled={!hasChanges || publishState === "loading"}
            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium bg-secondary text-secondary-foreground border border-border shadow-xl hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Icon icon="solar:restart-bold" width={15} height={15} />
            Sıfırla
          </button>

          {/* Yayınla */}
          <button
            onClick={handlePublish}
            disabled={!hasChanges || publishState === "loading"}
            className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold font-heading uppercase tracking-wider shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
              publishState === "ok"  ? "bg-emerald-600 text-white shadow-emerald-600/30" :
              publishState === "err" ? "bg-destructive text-white shadow-destructive/30" :
              "bg-primary text-primary-foreground shadow-primary/30 hover:bg-primary/90"
            }`}
          >
            <Icon icon={publishState === "ok" ? "solar:check-circle-bold" : publishState === "err" ? "solar:close-circle-bold" : "solar:upload-bold"} width={18} height={18} />
            {publishState === "loading" ? "Yayınlanıyor…" : publishState === "ok" ? "Yayınlandı" : publishState === "err" ? "Hata" : "Yayınla"}
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-4 text-center text-xs text-muted-foreground mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>Bilkent York Operations Portal v2.4 • Yönetici: Badu Alp Ustagül (Head Executive)</p>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#" className="hover:text-primary transition-colors">Yedek Al</a>
            <a href="#" className="hover:text-primary transition-colors">Dışa Aktar (Reçeteler JSON)</a>
            <a href="#" className="hover:text-primary transition-colors">Bar POS Entegrasyonu</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
